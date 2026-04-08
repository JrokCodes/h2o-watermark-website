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
 * Send response in either streaming SSE or regular JSON format.
 */
function sendResponse(res, content, model, stream) {
    const id = `chatcmpl-${Date.now()}`;
    const created = Math.floor(Date.now() / 1000);
    const modelName = model || 'h2o-watermark-agent';
    if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const roleChunk = {
            id, object: 'chat.completion.chunk', created, model: modelName,
            choices: [{ index: 0, delta: { role: 'assistant' }, finish_reason: null }],
        };
        res.write(`data: ${JSON.stringify(roleChunk)}\n\n`);
        const contentChunk = {
            id, object: 'chat.completion.chunk', created, model: modelName,
            choices: [{ index: 0, delta: { content }, finish_reason: null }],
        };
        res.write(`data: ${JSON.stringify(contentChunk)}\n\n`);
        const finishChunk = {
            id, object: 'chat.completion.chunk', created, model: modelName,
            choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
        };
        res.write(`data: ${JSON.stringify(finishChunk)}\n\n`);
        res.write('data: [DONE]\n\n');
        return res.end();
    }
    return res.json({
        id, object: 'chat.completion', created, model: modelName,
        choices: [{
                index: 0,
                message: { role: 'assistant', content },
                finish_reason: 'stop',
            }],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    });
}
/**
 * POST /v1/chat/completions
 * OpenAI-compatible endpoint that ElevenLabs calls.
 */
router.post('/chat/completions', async (req, res) => {
    const t0 = Date.now();
    try {
        const { messages, model, stream } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'messages array required' });
        }
        // Extract conversation ID from ElevenLabs headers if available
        const elevenLabsConvId = req.headers['x-conversation-id'] ||
            req.headers['x-session-id'] || '';
        // Get the latest user message
        const userMessages = messages.filter((m) => m.role === 'user');
        const latestUserMessage = userMessages[userMessages.length - 1]?.content || '';
        if (!latestUserMessage) {
            // No user message yet — return the greeting
            const session = ConversationEngine_1.conversationEngine.startSession('voice');
            const fingerprint = elevenLabsConvId || `new-${Date.now()}`;
            conversationMap.set(fingerprint, session.sessionId);
            return sendResponse(res, session.greeting, model, !!stream);
        }
        // Find or create session
        const fingerprint = elevenLabsConvId || getConversationFingerprint(messages);
        let sessionId = conversationMap.get(fingerprint);
        if (!sessionId) {
            // New conversation — start a session
            const session = ConversationEngine_1.conversationEngine.startSession('voice');
            sessionId = session.sessionId;
            conversationMap.set(fingerprint, sessionId);
            // If there are previous user messages (ElevenLabs sends full history),
            // we need to replay them to build up state
            if (userMessages.length > 1) {
                for (let i = 0; i < userMessages.length - 1; i++) {
                    await ConversationEngine_1.conversationEngine.processMessage(sessionId, userMessages[i].content);
                }
            }
        }
        // Process the latest message through the state machine
        const result = await ConversationEngine_1.conversationEngine.processMessage(sessionId, latestUserMessage);
        const elapsed = Date.now() - t0;
        console.log(`[CustomLLM] conv=${fingerprint.substring(0, 20)} session=${sessionId} state=${result.state} end=${result.shouldEnd} elapsed=${elapsed}ms responseLen=${result.response.length}`);
        console.log(`[CustomLLM] response: "${result.response.substring(0, 200)}"`);
        // Clean up if conversation ended
        if (result.shouldEnd) {
            ConversationEngine_1.conversationEngine.endSession(sessionId, elevenLabsConvId || fingerprint);
            conversationMap.delete(fingerprint);
        }
        return sendResponse(res, result.response, model, !!stream);
    }
    catch (error) {
        console.error('[CustomLLM] Error:', error);
        const stream = req.body?.stream === true;
        return sendResponse(res, "I'm sorry, I'm having a technical issue. You can reach Christine directly at (808) 650-2382.", 'h2o-watermark-agent', stream);
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