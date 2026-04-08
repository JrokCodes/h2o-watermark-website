import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { chatStart, chatMessage, chatEnd } from "../../lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export default function ChatWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [confirmingClose, setConfirmingClose] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetChat = () => {
    setSessionId(null);
    setMessages([]);
    setInput("");
    setTyping(false);
    setShowQuickActions(true);
    setConfirmingClose(false);
  };

  // Listen for openChat events from anywhere on the page
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      // Always start a fresh session when openChat is fired with a property
      if (detail?.property) {
        if (sessionId) {
          chatEnd(sessionId).catch(() => {});
        }
        resetChat();
        setPendingMessage(`I'm interested in ${detail.property}`);
      }
      setOpen(true);
    };
    window.addEventListener("openChat", handler);
    return () => window.removeEventListener("openChat", handler);
  }, [sessionId]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Initialize session when chat opens
  useEffect(() => {
    if (open && !sessionId) {
      chatStart()
        .then((res) => {
          setSessionId(res.sessionId);
          setMessages([{ role: "assistant", content: res.greeting, timestamp: Date.now() }]);
        })
        .catch((e) => console.error("Chat start failed:", e));
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, sessionId]);

  // Send any pending pre-populated message once the session is ready
  useEffect(() => {
    if (sessionId && pendingMessage && messages.length > 0) {
      const msg = pendingMessage;
      setPendingMessage(null);
      handleSend(msg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, pendingMessage, messages.length]);

  const handleSend = async (text?: string) => {
    const message = text ?? input.trim();
    if (!message || !sessionId || typing) return;

    setShowQuickActions(false);
    setMessages((m) => [...m, { role: "user", content: message, timestamp: Date.now() }]);
    setInput("");
    setTyping(true);

    try {
      const res = await chatMessage(sessionId, message);
      setMessages((m) => [...m, { role: "assistant", content: res.response, timestamp: Date.now() }]);
      if (res.shouldEnd) {
        await chatEnd(sessionId);
        setSessionId(null);
      }
    } catch (e) {
      console.error("Message failed:", e);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "I'm having trouble connecting. Please try calling (808) 650-2382 directly.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleCloseClick = () => {
    // If there's nothing to lose, close immediately
    if (!sessionId || messages.length <= 1) {
      doClose();
      return;
    }
    setConfirmingClose(true);
  };

  const doClose = async () => {
    const sid = sessionId;
    setOpen(false);
    resetChat();
    if (sid) {
      await chatEnd(sid).catch(() => {});
    }
  };

  const quickActions = [
    { label: t("chat.quickActions.browseRentals"), msg: "What rentals do you have available?" },
    { label: t("chat.quickActions.scheduleShowing"), msg: "I'd like to schedule a showing" },
    { label: t("chat.quickActions.reportIssue"), msg: "I need to report a maintenance issue" },
    { label: t("chat.quickActions.contactInfo"), msg: "What are your office hours?" },
  ];

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 px-5 py-4 bg-sunset hover:bg-sunset-dark text-white rounded-full shadow-2xl shadow-coral hover:shadow-2xl transition-all hover:-translate-y-1 animate-bounce-slow"
          aria-label="Open chat"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-sunset animate-pulse" />
          </div>
          <span className="hidden sm:inline font-medium">{t("chat.button")}</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] h-[100dvh] sm:h-[640px] sm:max-h-[80vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col animate-slide-up overflow-hidden border border-border">
          {/* Header */}
          <div className="gradient-ocean text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-playfair text-xl font-semibold">
                A
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-ocean-dark" />
              </div>
              <div>
                <div className="font-semibold text-sm">{t("chat.title")}</div>
                <div className="text-xs text-white/70">{t("chat.subtitle")}</div>
              </div>
            </div>
            <button
              onClick={handleCloseClick}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-cream/30">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-sunset text-white rounded-br-md"
                      : "bg-white text-foreground rounded-bl-md shadow-card"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-card">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-ocean/40 animate-typing" style={{ animationDelay: "0s" }} />
                    <span className="w-2 h-2 rounded-full bg-ocean/40 animate-typing" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 rounded-full bg-ocean/40 animate-typing" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Quick actions */}
            {showQuickActions && messages.length === 1 && (
              <div className="space-y-2 pt-4">
                <p className="text-xs text-muted-foreground text-center mb-2">Quick actions:</p>
                {quickActions.map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(qa.msg)}
                    className="block w-full text-left px-4 py-2.5 bg-white hover:bg-ocean/5 border border-border hover:border-ocean rounded-xl text-sm text-foreground transition-all"
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("chat.placeholder")}
                disabled={typing || !sessionId}
                className="flex-1 px-4 py-2.5 bg-cream/50 border border-border rounded-xl text-sm focus:outline-none focus:border-ocean focus:bg-white transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || typing || !sessionId}
                className="p-2.5 bg-sunset hover:bg-sunset-dark text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Send"
              >
                {typing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-2">{t("chat.poweredBy")}</p>
          </div>

          {/* Confirm close overlay */}
          {confirmingClose && (
            <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
                <h3 className="font-playfair text-xl font-semibold text-foreground mb-2">
                  End this conversation?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Closing will end your chat with Amy. Your conversation will be cleared.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmingClose(false)}
                    className="flex-1 py-2.5 bg-ocean/5 hover:bg-ocean/10 text-ocean font-medium rounded-lg transition-colors"
                  >
                    Keep Chatting
                  </button>
                  <button
                    onClick={doClose}
                    className="flex-1 py-2.5 bg-sunset hover:bg-sunset-dark text-white font-medium rounded-lg transition-colors"
                  >
                    End Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
