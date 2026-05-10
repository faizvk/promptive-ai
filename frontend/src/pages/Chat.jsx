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
import Select from "../components/Select";

const Chat = () => {
  const [models, setModels] = useState([]);
  const [modelId, setModelId] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
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

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !modelId || sending) return;
    setSending(true);
    setError(null);

    const optimisticUser = { role: "user", content: input };
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
      const list = await fetchChats();
      setChats(list.chats || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send message");
    } finally {
      setSending(false);
    }
  };

  const noModels = models.length === 0;
  const messages = currentChat?.messages || [];

  // Build options for the custom Select
  const modelOptions = useMemo(() => {
    return models.map((m) => ({
      value: m.id,
      label: m.displayName,
      description: m.description,
      group: m.tier === "free" ? "Available" : `Requires ${m.tier}`,
      disabled: !m.available,
    }));
  }, [models]);

  return (
    <div className="grid gap-5 grid-cols-1 lg:grid-cols-[260px_1fr] h-[calc(100vh-160px)] min-h-[520px]">
      {/* Conversation list */}
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
        <header className="px-4 md:px-5 h-14 border-b border-border-soft flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-text-primary truncate">
            {currentChat?.title || "New chat"}
          </span>
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
            <div className="text-center text-text-muted py-12 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
                <Sparkles size={20} />
              </div>
              <h2 className="text-base font-bold text-text-primary mb-1.5">
                Start a conversation
              </h2>
              <p className="text-sm">
                Pick a model and send your first message. Your conversations are
                saved automatically.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-bg-error border border-border-error text-text-error rounded-lg p-3 text-sm mb-4">
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

          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[0.95rem] whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand-primary text-white"
                      : "bg-bg-soft text-text-primary border border-border-soft"
                  }`}
                >
                  {m.content}
                  {m.role === "assistant" && m.model && (
                    <p
                      className={`text-[0.65rem] mt-2 ${
                        m.role === "user" ? "text-white/70" : "text-text-muted"
                      }`}
                    >
                      {m.model}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-bg-soft border border-border-soft rounded-2xl px-4 py-3 text-sm text-text-muted flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-text-muted animate-pulse" />
                  Thinking…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form
          onSubmit={handleSend}
          className="border-t border-border-soft px-4 md:px-6 py-3"
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
