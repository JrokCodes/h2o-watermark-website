"use strict";
/**
 * Custom LLM Route — OpenAI-compatible endpoint for ElevenLabs.
 *
 * ElevenLabs sends the full conversation history in OpenAI chat completion format.
 * We extract the latest user message, route it through our state machine,
 * and return the response in OpenAI format.
 *
 * Session management: We use the conversation history to identify returning sessions.
 * First message (only system + user) = new session. Subsequent messages = existing session.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ConversationEngine_1 = require("../core/ConversationEngine");
const router = (0, express_1.Router)();
// Map to track ElevenLabs conversations → our session IDs
const conversationMap = new Map();
function getConversationFingerprint(messages) {
    const firstUser = messages.find((m) => m.role === 'user');
    if (firstUser) {
        return firstUser.content.substring(0, 50);
    }
    return 'unknown';
}
/**
 * Open an SSE stream and immediately flush the role chunk.
 * ElevenLabs treats the first byte arriving as "LLM is alive" — sending the
 * role chunk before we run the state machine prevents it from giving up while
 * we're computing.
 */
function openStream(res, model) {
    const id = `chatcmpl-${Date.now()}`;
    const created = Math.floor(Date.now() / 1000);
    const modelName = model || 'h2o-watermark-agent';
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();
    const roleChunk = {
        id, object: 'chat.completion.chunk', created, model: modelName,
        choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }],
    };
    res.write(`data: ${JSON.stringify(roleChunk)}\n\n`);
    return { id, modelName, created };
}
function closeStream(res, ctx, content) {
    const contentChunk = {
        id: ctx.id, object: 'chat.completion.chunk', created: ctx.created, model: ctx.modelName,
        choices: [{ index: 0, delta: { content }, finish_reason: null }],
    };
    res.write(`data: ${JSON.stringify(contentChunk)}\n\n`);
    const finishChunk = {
        id: ctx.id, object: 'chat.completion.chunk', created: ctx.created, model: ctx.modelName,
        choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
    };
    res.write(`data: ${JSON.stringify(finishChunk)}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
}
function sendJson(res, content, model) {
    const id = `chatcmpl-${Date.now()}`;
    const created = Math.floor(Date.now() / 1000);
    const modelName = model || 'h2o-watermark-agent';
    return res.json({
        id, object: 'chat.completion', created, model: modelName,
        choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    });
}
/**
 * POST /v1/chat/completions
 * OpenAI-compatible endpoint that ElevenLabs calls.
 */
router.post('/chat/completions', async (req, res) => {
    const t0 = Date.now();
    const { messages, model, stream } = req.body || {};
    const useStream = !!stream;
    // Open the SSE stream IMMEDIATELY (if streaming) and flush the role chunk
    // so ElevenLabs sees the LLM is alive while we run the state machine.
    let streamCtx = null;
    if (useStream) {
        streamCtx = openStream(res, model);
    }
    const finish = (content) => {
        if (streamCtx)
            closeStream(res, streamCtx, content);
        else
            sendJson(res, content, model);
    };
    try {
        if (!messages || !Array.isArray(messages)) {
            return finish("I'm sorry, something went wrong on my end. Please call (808) 650-2382.");
        }
        const elevenLabsConvId = req.headers['x-conversation-id'] ||
            req.headers['x-session-id'] || '';
        const userMessages = messages.filter((m) => m.role === 'user');
        const latestUserMessage = userMessages[userMessages.length - 1]?.content || '';
        if (!latestUserMessage) {
            // No user message yet — return the greeting (used by some test clients)
            const session = ConversationEngine_1.conversationEngine.startSession('voice');
            const fingerprint = elevenLabsConvId || `new-${Date.now()}`;
            conversationMap.set(fingerprint, session.sessionId);
            console.log(`[CustomLLM] greeting session=${session.sessionId} elapsed=${Date.now() - t0}ms`);
            return finish(session.greeting);
        }
        const fingerprint = elevenLabsConvId || getConversationFingerprint(messages);
        let sessionId = conversationMap.get(fingerprint);
        if (!sessionId) {
            const session = ConversationEngine_1.conversationEngine.startSession('voice');
            sessionId = session.sessionId;
            conversationMap.set(fingerprint, sessionId);
            console.log(`[CustomLLM] new session=${sessionId} fingerprint="${fingerprint.substring(0, 30)}"`);
            if (userMessages.length > 1) {
                for (let i = 0; i < userMessages.length - 1; i++) {
                    await ConversationEngine_1.conversationEngine.processMessage(sessionId, userMessages[i].content);
                }
            }
        }
        else {
            console.log(`[CustomLLM] reuse session=${sessionId} fingerprint="${fingerprint.substring(0, 30)}"`);
        }
        const result = await ConversationEngine_1.conversationEngine.processMessage(sessionId, latestUserMessage);
        const elapsed = Date.now() - t0;
        console.log(`[CustomLLM] state=${result.state} end=${result.shouldEnd} elapsed=${elapsed}ms responseLen=${result.response.length}`);
        console.log(`[CustomLLM] response: "${result.response.substring(0, 200)}"`);
        if (result.shouldEnd) {
            ConversationEngine_1.conversationEngine.endSession(sessionId, elevenLabsConvId || fingerprint);
            conversationMap.delete(fingerprint);
        }
        return finish(result.response);
    }
    catch (error) {
        console.error('[CustomLLM] Error:', error);
        return finish("I'm sorry, I'm having a technical issue. You can reach Christine directly at (808) 650-2382.");
    }
});
// Cleanup old conversation mappings periodically
setInterval(() => {
    if (conversationMap.size > 100) {
        // Keep only the 50 most recent
        const entries = Array.from(conversationMap.entries());
        entries.slice(0, entries.length - 50).forEach(([k]) => conversationMap.delete(k));
    }
}, 60000);
exports.default = router;
//# sourceMappingURL=customLLMRoutes.js.map