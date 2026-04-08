"use strict";
/**
 * Conversation Engine for H2O Watermark Agent.
 * Manages sessions, routes to handlers, executes state transitions.
 * Ported from Leilani's ConversationEngine.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationEngine = void 0;
const types_1 = require("./types");
const StateMachine_1 = require("./StateMachine");
const handlers_1 = require("./handlers");
const config_1 = require("../config");
const LLMService_1 = require("../services/LLMService");
const BackendClient_1 = require("../services/BackendClient");
class ConversationEngine {
    constructor() {
        this.sessions = new Map();
        // Periodic cleanup of abandoned sessions
        setInterval(() => this.cleanupSessions(), config_1.config.session.cleanupIntervalMinutes * 60 * 1000);
    }
    /**
     * Start a new conversation session.
     */
    startSession(transport = 'voice') {
        const sessionId = `h2o-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const context = {
            sessionId,
            state: types_1.ConversationState.GREETING,
            collectedData: {},
            conversationHistory: [],
            retryCount: 0,
            maxRetries: config_1.config.session.maxRetries,
            createdAt: new Date(),
            lastActivityAt: new Date(),
            transport,
        };
        this.sessions.set(sessionId, context);
        const greeting = transport === 'chat'
            ? "Aloha! I'm Amy with H2O Watermark Properties. How can I help you today? You can ask about rentals, sales, schedule a showing, or report a maintenance issue."
            : "Aloha, this is Amy with H2O Watermark Properties. How can I help you today?";
        context.conversationHistory.push({ role: 'assistant', content: greeting });
        context.state = types_1.ConversationState.INTENT_DETECTION;
        console.log(`[Session ${sessionId}] Started (${transport})`);
        return { sessionId, greeting, state: context.state };
    }
    /**
     * Process a user message within an existing session.
     */
    async processMessage(sessionId, userInput) {
        const context = this.sessions.get(sessionId);
        if (!context) {
            return {
                response: "I'm sorry, it seems our connection was lost. Please call back and we'll get you sorted out.",
                state: types_1.ConversationState.COMPLETION,
                shouldEnd: true,
            };
        }
        context.lastActivityAt = new Date();
        context.conversationHistory.push({ role: 'user', content: userInput });
        console.log(`[Session ${sessionId}] State: ${context.state} | Input: "${userInput.substring(0, 80)}"`);
        // Check for off-topic input — handle naturally then steer back
        if (LLMService_1.llmService.isOffTopic(userInput, context.state)) {
            console.log(`[Session ${sessionId}] Off-topic detected, handling with LLM`);
            const offTopicResponse = await LLMService_1.llmService.handleOffTopic(userInput, context.state, context.conversationHistory);
            context.conversationHistory.push({ role: 'assistant', content: offTopicResponse });
            return {
                response: offTopicResponse,
                state: context.state, // Stay in same state
                shouldEnd: false,
            };
        }
        // Get handler for current state
        const handler = handlers_1.handlers.get(context.state);
        if (!handler) {
            console.error(`[Session ${sessionId}] No handler for state: ${context.state}`);
            return {
                response: "I'm sorry, something went wrong on my end. Please call Christine directly at (808) 650-2382.",
                state: types_1.ConversationState.COMPLETION,
                shouldEnd: true,
            };
        }
        // Execute handler
        let result;
        try {
            result = await handler(context, userInput);
        }
        catch (error) {
            console.error(`[Session ${sessionId}] Handler error:`, error);
            return {
                response: "I'm having a technical issue. Let me have Christine get back to you. Her number is (808) 650-2382.",
                state: types_1.ConversationState.TRANSFER_TO_HUMAN,
                shouldEnd: true,
            };
        }
        // Apply data updates
        if (result.updatedData) {
            context.collectedData = { ...context.collectedData, ...result.updatedData };
        }
        // Execute state transition
        if (result.trigger) {
            const nextState = (0, StateMachine_1.getNextState)(context.state, result.trigger);
            if (nextState) {
                context.previousState = context.state;
                context.state = nextState;
                console.log(`[Session ${sessionId}] Transition: ${context.previousState} → ${context.state} (trigger: ${result.trigger})`);
                // Reset retry count on successful transition to a new state type
                if (context.previousState !== context.state) {
                    context.retryCount = 0;
                }
                // Auto-execute states that don't need user input
                const autoExecStates = new Set([
                    types_1.ConversationState.AVAILABILITY_CHECK,
                    types_1.ConversationState.BOOKING_EXECUTION,
                    types_1.ConversationState.MAINTENANCE_EXECUTION,
                ]);
                if (autoExecStates.has(context.state)) {
                    context.conversationHistory.push({ role: 'assistant', content: result.response });
                    const autoHandler = handlers_1.handlers.get(context.state);
                    if (autoHandler) {
                        console.log(`[Session ${sessionId}] Auto-executing: ${context.state}`);
                        try {
                            const autoResult = await autoHandler(context, '');
                            if (autoResult.updatedData) {
                                context.collectedData = { ...context.collectedData, ...autoResult.updatedData };
                            }
                            // Chain the responses
                            result.response = result.response + ' ' + autoResult.response;
                            // Apply auto-result's trigger
                            if (autoResult.trigger) {
                                const autoNextState = (0, StateMachine_1.getNextState)(context.state, autoResult.trigger);
                                if (autoNextState) {
                                    context.previousState = context.state;
                                    context.state = autoNextState;
                                    console.log(`[Session ${sessionId}] Auto-transition: ${context.previousState} → ${context.state}`);
                                }
                            }
                            if (autoResult.shouldEnd)
                                result.shouldEnd = true;
                        }
                        catch (autoError) {
                            console.error(`[Session ${sessionId}] Auto-exec error:`, autoError);
                        }
                    }
                }
            }
            else {
                console.warn(`[Session ${sessionId}] No transition for ${context.state} + ${result.trigger}`);
            }
        }
        // Humanize the response (voice only — chat responses are already natural text)
        const shouldHumanize = context.transport === 'voice' &&
            result.response.length > 30 &&
            !context.state.includes('COMPLETION') &&
            !context.state.includes('TRANSFER');
        if (shouldHumanize) {
            // Hard-cap humanization at 1.5s. Voice agents (ElevenLabs) start TTS
            // as soon as the LLM streams its first token; if we sit waiting on
            // Azure for 2-3s the call thinks we hung and disconnects. The
            // un-humanized state-machine response is perfectly fine to fall back to.
            const HUMANIZE_TIMEOUT_MS = 1500;
            try {
                const humanized = await Promise.race([
                    LLMService_1.llmService.humanize(result.response, userInput, context.conversationHistory, context.state),
                    new Promise((_, rej) => setTimeout(() => rej(new Error('humanize-timeout')), HUMANIZE_TIMEOUT_MS)),
                ]);
                result.response = humanized;
            }
            catch (e) {
                if (e?.message === 'humanize-timeout') {
                    console.warn(`[Session ${sessionId}] Humanizer timed out after ${HUMANIZE_TIMEOUT_MS}ms — using raw response`);
                }
                // Fall through with the un-humanized response
            }
        }
        // Add response to history
        context.conversationHistory.push({ role: 'assistant', content: result.response });
        // Only end on explicit shouldEnd or transfer — let COMPLETION continue so user can ask follow-ups
        const shouldEnd = result.shouldEnd ||
            context.state === types_1.ConversationState.TRANSFER_TO_HUMAN;
        return {
            response: result.response,
            state: context.state,
            shouldEnd,
        };
    }
    /**
     * End a session and return summary.
     */
    endSession(sessionId, conversationId) {
        const context = this.sessions.get(sessionId);
        if (!context)
            return null;
        const summary = {
            transcript: context.conversationHistory,
            collectedData: context.collectedData,
            finalState: context.state,
        };
        // Log the call transcript to the backend (async, non-blocking)
        const durationSecs = Math.round((Date.now() - context.createdAt.getTime()) / 1000);
        const outcome = context.state === types_1.ConversationState.COMPLETION ? 'success' :
            context.state === types_1.ConversationState.TRANSFER_TO_HUMAN ? 'transferred' : 'abandoned';
        BackendClient_1.backendClient.logCallTranscript({
            session_id: sessionId,
            conversation_id: conversationId,
            call_type: context.collectedData.intent,
            caller_name: context.collectedData.callerName || context.collectedData.tenantName,
            caller_phone: context.collectedData.callerPhone,
            property_address: context.collectedData.propertyAddress,
            final_state: context.state,
            outcome,
            transcript: context.conversationHistory,
            collected_data: context.collectedData,
            duration_seconds: durationSecs,
            message_count: context.conversationHistory.length,
            transport: context.transport,
        }).catch(e => console.error('[Session] Error logging call:', e));
        this.sessions.delete(sessionId);
        console.log(`[Session ${sessionId}] Ended in state: ${context.state} (${outcome}, ${durationSecs}s)`);
        return summary;
    }
    /**
     * Get current session state.
     */
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    /**
     * List active sessions (for debugging).
     */
    getActiveSessions() {
        const now = Date.now();
        return Array.from(this.sessions.entries()).map(([id, ctx]) => ({
            sessionId: id,
            state: ctx.state,
            age: Math.round((now - ctx.createdAt.getTime()) / 1000),
        }));
    }
    /**
     * Clean up abandoned sessions.
     */
    cleanupSessions() {
        const timeout = config_1.config.session.timeoutMinutes * 60 * 1000;
        const now = Date.now();
        let cleaned = 0;
        for (const [id, ctx] of this.sessions) {
            if (now - ctx.lastActivityAt.getTime() > timeout) {
                this.sessions.delete(id);
                cleaned++;
            }
        }
        if (cleaned > 0) {
            console.log(`[Cleanup] Removed ${cleaned} abandoned sessions`);
        }
    }
}
exports.conversationEngine = new ConversationEngine();
//# sourceMappingURL=ConversationEngine.js.map