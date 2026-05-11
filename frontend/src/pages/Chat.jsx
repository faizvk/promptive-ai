import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageSquarePlus,
  Sparkles,
  Trash2,
  Lock,
  ArrowUp,
  Copy,
  Check,
  RefreshCcw,
  User,
  Bot,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  fetchChatModels,
  fetchChats,
  fetchChat,
  deleteChat as deleteChatApi,
  sendChatMessage,
} from "../api/chat.api";
import Select from "../components/Select";

const SUGGESTIONS = [
  {
    title: "Plan a launch announcement",
    prompt:
      "Help me draft a launch announcement for a new productivity feature. Keep it punchy.",
  },
  {
    title: "Summarize a long article",
    prompt:
      "I'll paste an article. Summarize it in 5 bullets and give me 3 follow-up questions.",
  },
  {
    title: "Write SQL for a query",
    prompt:
      "I have a `users` table with name, email, plan, created_at. Write SQL for new sign-ups this month grouped by plan.",
  },
  {
    title: "Sharpen this paragraph",
    prompt:
      "Rewrite this paragraph to be more confident and concise without changing the meaning: ",
  },
];

const Chat = () => {
  const [models, setModels] = useState([]);
  const [modelId, setModelId] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchChatModels()
      .then((res) => {
        setModels(res.models || []);
        const firstAvailable = (res.models || []).find((m) => m.available);
        if (firstAvailable) setModelId(firstAvailable.id);
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setError(
            "Chat is not included in your plan. Upgrade to start chatting."
          );
        }
      });

    fetchChats()
      .then((res) => setChats(res.chats || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height =
        Math.min(inputRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const openChat = async (id) => {
    try {
      const res = await fetchChat(id);
      setCurrentChat(res.chat);
      setError(null);
    } catch {
      setError("Failed to open chat");
    }
  };

  const startNewChat = () => {
    setCurrentChat(null);
    setInput("");
    setError(null);
    inputRef.current?.focus();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this chat?")) return;
    await deleteChatApi(id);
    setChats((cs) => cs.filter((c) => c.id !== id));
    if (currentChat?._id === id || currentChat?.id === id) setCurrentChat(null);
  };

  const handleCopyMessage = (idx, content) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1200);
  };

  const sendText = async (messageText, opts = {}) => {
    if (!messageText.trim() || !modelId || sending) return;
    setSending(true);
    setError(null);

    if (!opts.regenerate) {
      const optimisticUser = { role: "user", content: messageText };
      setCurrentChat((c) => ({
        ...(c || { messages: [], title: "New chat" }),
        messages: [...((c && c.messages) || []), optimisticUser],
      }));
      setInput("");
    }

    try {
      const res = await sendChatMessage({
        chatId: currentChat?._id || currentChat?.id,
        modelId,
        message: messageText,
      });
      const updated = res.chat;
      setCurrentChat({ ...updated, _id: updated.id });
      const list = await fetchChats();
      setChats(list.chats || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send message");
    } finally {
      setSending(false);
    }
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    sendText(input);
  };

  const handleRegenerate = () => {
    // Find the last user message and resend it. The new assistant turn will
    // append to the conversation.
    const msgs = currentChat?.messages || [];
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "user") {
        sendText(msgs[i].content, { regenerate: true });
        return;
      }
    }
  };

  const noModels = models.length === 0;
  const messages = currentChat?.messages || [];

  const modelOptions = useMemo(() => {
    return models.map((m) => ({
      value: m.id,
      label: m.displayName,
      description: m.description,
      group: m.tier === "free" ? "Available" : `Requires ${m.tier}`,
      disabled: !m.available,
    }));
  }, [models]);

  const currentModelMeta = models.find((m) => m.id === modelId);

  return (
    <div className="grid gap-5 grid-cols-1 lg:grid-cols-[260px_1fr] h-[calc(100vh-160px)] min-h-[520px]">
      {/* Conversations */}
      <aside className="bg-white border border-border-soft rounded-xl flex flex-col overflow-hidden">
        <div className="p-3 border-b border-border-soft">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-brand-primary hover:bg-[#032c5a] text-white text-sm font-semibold transition-colors"
          >
            <MessageSquarePlus size={15} /> New chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {chats.length === 0 ? (
            <p className="text-xs text-text-muted px-2 py-3 text-center">
              No chats yet. Send your first message →
            </p>
          ) : (
            chats.map((c) => {
              const active =
                currentChat?._id === c.id || currentChat?.id === c.id;
              return (
                <div
                  key={c.id}
                  className={`group flex items-center gap-1.5 rounded-md px-2 py-1.5 cursor-pointer transition-colors ${
                    active
                      ? "bg-bg-soft text-text-primary"
                      : "hover:bg-bg-soft text-text-secondary"
                  }`}
                  onClick={() => openChat(c.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.85rem] font-medium truncate">
                      {c.title || "Untitled"}
                    </div>
                  </div>
                  <button
                    aria-label="Delete chat"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text-error p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.id);
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Main */}
      <section className="bg-white border border-border-soft rounded-xl flex flex-col overflow-hidden">
        <header className="px-4 md:px-5 h-14 border-b border-border-soft flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0 flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary truncate">
              {currentChat?.title || "New chat"}
            </span>
            {currentModelMeta && (
              <span className="hidden sm:inline-flex items-center text-[0.65rem] font-bold uppercase tracking-[0.12em] text-text-muted bg-bg-soft border border-border-soft px-2 py-0.5 rounded-full">
                {currentModelMeta.provider}
              </span>
            )}
          </div>
          <Select
            value={modelId || ""}
            onChange={setModelId}
            options={modelOptions}
            placeholder={noModels ? "No models" : "Select model"}
            align="end"
            size="sm"
            triggerClassName="max-w-[260px]"
          />
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
          {noModels && (
            <div className="text-center text-text-muted py-12 max-w-sm mx-auto">
              <Lock size={26} className="mx-auto mb-3" />
              <p className="text-sm">
                No chat models are configured on this server yet.
              </p>
            </div>
          )}

          {!noModels && messages.length === 0 && !error && (
            <div className="max-w-2xl mx-auto py-8 md:py-12">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-lg md:text-xl font-extrabold text-text-primary mb-1 tracking-tight">
                  Start a conversation
                </h2>
                <p className="text-sm text-text-muted">
                  Pick a model and send your first message. Or try one of these:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => {
                      setInput(s.prompt);
                      inputRef.current?.focus();
                    }}
                    className="text-left p-3 rounded-lg border border-border-soft bg-bg-soft hover:bg-white hover:border-brand-primary/30 transition-colors"
                  >
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {s.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                      {s.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-bg-error border border-border-error text-text-error rounded-lg p-3 text-sm mb-4 max-w-3xl mx-auto">
              {error}
              {error.includes("plan") || error.includes("limit") ? (
                <Link
                  to="/dashboard/billing"
                  className="ml-2 font-semibold underline"
                >
                  Upgrade plan
                </Link>
              ) : null}
            </div>
          )}

          <div className="flex flex-col gap-5 max-w-3xl mx-auto">
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={idx}
                  className={`group flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      isUser
                        ? "bg-brand-primary text-white"
                        : "bg-bg-soft text-text-secondary border border-border-soft"
                    }`}
                  >
                    {isUser ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-[0.95rem] whitespace-pre-wrap leading-relaxed ${
                        isUser
                          ? "bg-brand-primary text-white rounded-tr-md"
                          : "bg-bg-soft text-text-primary border border-border-soft rounded-tl-md"
                      }`}
                    >
                      {m.content}
                    </div>
                    {!isUser && (
                      <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyMessage(idx, m.content)}
                          className="text-[0.7rem] text-text-muted hover:text-text-secondary inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
                          aria-label="Copy"
                        >
                          {copiedIdx === idx ? (
                            <Check size={11} />
                          ) : (
                            <Copy size={11} />
                          )}
                          {copiedIdx === idx ? "Copied" : "Copy"}
                        </button>
                        {idx === messages.length - 1 && (
                          <button
                            onClick={handleRegenerate}
                            disabled={sending}
                            className="text-[0.7rem] text-text-muted hover:text-text-secondary inline-flex items-center gap-1 px-1.5 py-0.5 rounded disabled:opacity-60"
                          >
                            <RefreshCcw size={11} /> Regenerate
                          </button>
                        )}
                        {m.model && (
                          <span className="text-[0.65rem] text-text-muted ml-1">
                            {m.model}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {sending && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-bg-soft text-text-secondary border border-border-soft flex items-center justify-center shrink-0">
                  <Bot size={13} />
                </div>
                <div className="bg-bg-soft border border-border-soft rounded-2xl rounded-tl-md px-4 py-3 text-sm text-text-muted flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-text-muted animate-pulse [animation-delay:0ms]" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-text-muted animate-pulse [animation-delay:150ms]" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-text-muted animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form
          onSubmit={handleSend}
          className="border-t border-border-soft px-4 md:px-6 py-3 shrink-0"
        >
          <div className="max-w-3xl mx-auto flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Send a message…"
              rows={1}
              disabled={sending || noModels}
              className="flex-1 px-3.5 py-3 rounded-lg border border-border-soft bg-bg-soft text-[0.95rem] outline-none transition-colors focus:border-btn-primary focus:bg-white resize-none max-h-[160px]"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending || noModels}
              className="p-3 rounded-lg bg-brand-primary hover:bg-[#032c5a] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send"
            >
              <ArrowUp size={16} />
            </button>
          </div>
          <p className="text-[0.65rem] text-text-muted text-center mt-2 max-w-3xl mx-auto">
            Press <kbd className="font-mono">Enter</kbd> to send,{" "}
            <kbd className="font-mono">Shift</kbd>+
            <kbd className="font-mono">Enter</kbd> for newline
          </p>
        </form>
      </section>
    </div>
  );
};

export default Chat;
