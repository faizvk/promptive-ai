import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageSquarePlus,
  Sparkles,
  Trash2,
  Lock,
  ArrowUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  fetchChatModels,
  fetchChats,
  fetchChat,
  deleteChat as deleteChatApi,
  sendChatMessage,
} from "../api/chat.api";

const inputBase =
  "w-full p-3.5 rounded-xl border border-border-soft bg-bg-soft text-[0.95rem] outline-none transition-colors focus:border-btn-primary focus:bg-white";

const Chat = () => {
  const [models, setModels] = useState([]);
  const [, setPlanId] = useState("free");
  const [modelId, setModelId] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Load models + chat list on mount.
  useEffect(() => {
    fetchChatModels()
      .then((res) => {
        setModels(res.models || []);
        setPlanId(res.plan || "free");
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
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this chat?")) return;
    await deleteChatApi(id);
    setChats((cs) => cs.filter((c) => c.id !== id));
    if (currentChat?._id === id || currentChat?.id === id) setCurrentChat(null);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !modelId || sending) return;
    setSending(true);
    setError(null);

    const optimisticUser = {
      role: "user",
      content: input,
      createdAt: new Date(),
    };
    setCurrentChat((c) => ({
      ...(c || { messages: [], title: "New chat" }),
      messages: [...((c && c.messages) || []), optimisticUser],
    }));
    const messageText = input;
    setInput("");

    try {
      const res = await sendChatMessage({
        chatId: currentChat?._id || currentChat?.id,
        modelId,
        message: messageText,
      });
      const updated = res.chat;
      setCurrentChat({ ...updated, _id: updated.id });
      // Refresh chat list (title may have updated)
      const list = await fetchChats();
      setChats(list.chats || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not send message"
      );
    } finally {
      setSending(false);
    }
  };

  const noModels = models.length === 0;
  const messages = currentChat?.messages || [];

  const groupedModels = useMemo(() => {
    const byTier = { free: [], pro: [], business: [] };
    models.forEach((m) => byTier[m.tier]?.push(m));
    return byTier;
  }, [models]);

  return (
    <div className="max-w-[1400px] mx-auto grid gap-5 md:gap-6 grid-cols-1 lg:grid-cols-[260px_1fr] h-[calc(100vh-180px)] min-h-[500px]">
      {/* Sidebar: chat list */}
      <aside className="bg-bg-surface rounded-2xl border border-border-soft p-3 flex flex-col gap-3 overflow-hidden">
        <button
          onClick={startNewChat}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-brand-primary hover:bg-[#032c5a] text-white text-sm font-semibold transition-colors"
        >
          <MessageSquarePlus size={16} /> New chat
        </button>

        <div className="flex-1 overflow-y-auto flex flex-col gap-1">
          {chats.length === 0 ? (
            <p className="text-xs text-text-muted px-2 py-3">
              No chats yet. Send your first message →
            </p>
          ) : (
            chats.map((c) => {
              const active = currentChat?._id === c.id || currentChat?.id === c.id;
              return (
                <div
                  key={c.id}
                  className={`group flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer transition-colors ${
                    active
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "hover:bg-bg-soft text-text-secondary"
                  }`}
                  onClick={() => openChat(c.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {c.title || "Untitled"}
                    </div>
                    <div className="text-[0.7rem] text-text-muted truncate">
                      {c.lastMessagePreview}
                    </div>
                  </div>
                  <button
                    aria-label="Delete chat"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-text-error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(c.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Main */}
      <section className="bg-bg-surface rounded-2xl border border-border-soft flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-4 md:px-6 py-3 border-b border-border-soft flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-text-primary truncate">
              {currentChat?.title || "New chat"}
            </span>
          </div>
          <select
            value={modelId || ""}
            onChange={(e) => setModelId(e.target.value)}
            disabled={noModels}
            className="px-3 py-1.5 rounded-lg border border-border-soft bg-bg-soft text-xs font-medium max-w-[260px] truncate"
          >
            {Object.entries(groupedModels).map(([tier, group]) =>
              group.length > 0 ? (
                <optgroup key={tier} label={tier.toUpperCase()}>
                  {group.map((m) => (
                    <option
                      key={m.id}
                      value={m.id}
                      disabled={!m.available}
                    >
                      {m.displayName}
                      {!m.available ? " 🔒" : ""}
                    </option>
                  ))}
                </optgroup>
              ) : null
            )}
          </select>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
          {noModels && (
            <div className="text-center text-text-muted py-12">
              <Lock size={28} className="mx-auto mb-3" />
              <p className="text-sm">
                No chat models are configured on this server yet.
              </p>
            </div>
          )}

          {!noModels && messages.length === 0 && !error && (
            <div className="text-center text-text-muted py-12">
              <Sparkles size={28} className="mx-auto mb-3 text-brand-primary" />
              <p className="text-sm">
                Pick a model and start chatting. Your conversation history is
                saved automatically.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-bg-error border border-border-error text-text-error rounded-xl p-3 text-sm mb-4">
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

          <div className="flex flex-col gap-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-brand-primary text-white self-end"
                    : "bg-bg-soft text-text-primary self-start border border-border-soft"
                }`}
              >
                <p className="text-[0.95rem] whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </p>
                {m.role === "assistant" && m.model && (
                  <p className="text-[0.65rem] text-text-muted mt-2">
                    {m.model}
                  </p>
                )}
              </div>
            ))}
            {sending && (
              <div className="bg-bg-soft border border-border-soft self-start rounded-2xl px-4 py-3 text-sm text-text-muted">
                Thinking…
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="border-t border-border-soft px-4 md:px-6 py-3 flex gap-2"
        >
          <textarea
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
            className={`${inputBase} resize-none max-h-[140px]`}
            disabled={sending || noModels}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending || noModels}
            className="self-end p-3 rounded-xl bg-brand-primary hover:bg-[#032c5a] text-white disabled:opacity-50 transition-colors"
          >
            <ArrowUp size={18} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default Chat;
