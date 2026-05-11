import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  FileText,
  Trash2,
  X,
  Copy,
  Check,
  Download,
  Search,
  SearchX,
} from "lucide-react";
import { fetchHistory, deleteHistoryItem } from "../api/history.api";

const tabBtn = (active) =>
  `inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
    active
      ? "bg-brand-primary text-white"
      : "text-text-secondary hover:bg-bg-soft"
  }`;

const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const groupByDate = (items) => {
  const groups = { Today: [], Yesterday: [], Earlier: [] };
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  items.forEach((item) => {
    const created = new Date(item.createdAt);
    if (created.toDateString() === today.toDateString()) {
      groups.Today.push(item);
    } else if (created.toDateString() === yesterday.toDateString()) {
      groups.Yesterday.push(item);
    } else {
      groups.Earlier.push(item);
    }
  });
  return groups;
};

const itemText = (item, type) =>
  type === "image"
    ? item.prompt || ""
    : item.rewrittenText || item.originalText || "";

const History = () => {
  const [type, setType] = useState("image");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchHistory({ type });
      setItems(res.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadHistory();
    setActiveItem(null);
    setSearch("");
  }, [loadHistory]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((it) => itemText(it, type).toLowerCase().includes(q));
  }, [items, search, type]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await deleteHistoryItem({ type, id });
    setActiveItem(null);
    loadHistory();
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownloadImage = async (
    imageUrl,
    filename = "promptive-image"
  ) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Image download failed", err);
    }
  };

  const grouped = groupByDate(filtered);
  const isFiltering = search.trim().length > 0;
  const total = items.length;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[1.6rem] md:text-3xl font-extrabold tracking-[-0.02em] text-text-primary">
            History
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Everything you've generated, grouped by day.
          </p>
        </div>
        <div className="inline-flex items-center bg-bg-soft border border-border-soft rounded-lg p-1 gap-0.5">
          <button onClick={() => setType("image")} className={tabBtn(type === "image")}>
            <Image size={15} /> Images
          </button>
          <button
            onClick={() => setType("rewrite")}
            className={tabBtn(type === "rewrite")}
          >
            <FileText size={15} /> Rewrites
          </button>
        </div>
      </header>

      {/* Search bar */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${type === "image" ? "image prompts" : "rewrites"}…`}
          className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-border-soft bg-white text-sm outline-none transition-colors focus:border-btn-primary placeholder:text-text-muted"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1 rounded"
          >
            <X size={14} />
          </button>
        )}
        {isFiltering && (
          <p className="text-[0.7rem] text-text-muted mt-1.5">
            {filtered.length} of {total} match "{search}"
          </p>
        )}
      </div>

      {loading ? (
        <div className="text-text-muted text-sm py-12 text-center">Loading…</div>
      ) : total === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-border-soft text-center py-16 px-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-bg-soft text-text-muted flex items-center justify-center">
            {type === "image" ? <Image size={20} /> : <FileText size={20} />}
          </div>
          <p className="text-text-secondary text-sm">
            No {type === "image" ? "images" : "rewrites"} yet.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-border-soft text-center py-12 px-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-bg-soft text-text-muted flex items-center justify-center">
            <SearchX size={20} />
          </div>
          <p className="text-text-secondary text-sm">
            No items match "{search}".
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([section, sectionItems]) =>
          sectionItems.length > 0 ? (
            <section key={section} className="flex flex-col gap-3">
              <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-text-muted flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-border-soft">
                {section}
              </h2>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sectionItems.map((item) => (
                  <div
                    key={item._id}
                    className="group relative bg-white border border-border-soft rounded-xl overflow-hidden flex flex-col cursor-pointer transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand-primary/30"
                    onClick={() => type === "rewrite" && setActiveItem(item)}
                  >
                    {type === "image" && (
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.prompt || "Generated image"}
                          className="w-full aspect-[4/3] object-cover"
                        />
                        <button
                          aria-label="Download"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadImage(
                              item.imageUrl,
                              item.prompt || "promptive-image"
                            );
                          }}
                          className="absolute bottom-2 right-2 opacity-0 md:group-hover:opacity-100 max-md:opacity-100 transition-opacity bg-black/70 backdrop-blur-sm text-white border border-white/10 p-1.5 rounded-md hover:bg-black/85"
                        >
                          <Download size={13} />
                        </button>
                      </div>
                    )}
                    <div className="p-3 flex-1">
                      <p className="text-[0.85rem] text-text-secondary leading-relaxed line-clamp-3">
                        {itemText(item, type)}
                      </p>
                      {item.createdAt && (
                        <p className="text-[0.65rem] text-text-muted mt-2">
                          {formatTime(item.createdAt)}
                        </p>
                      )}
                    </div>
                    <button
                      aria-label="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="absolute top-2 right-2 opacity-0 md:group-hover:opacity-100 max-md:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm text-text-error border border-border-soft p-1.5 rounded-md hover:bg-text-error hover:text-white"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ) : null
        )
      )}

      {activeItem && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 md:p-6"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-white w-full max-w-[640px] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-border-soft animate-modal-slide-up max-md:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="px-5 py-4 border-b border-border-soft flex justify-between items-center">
              <div>
                <span className="inline-block text-[0.65rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-1">
                  Saved
                </span>
                <h3 className="font-bold text-text-primary text-base m-0">
                  Rewrite details
                </h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                aria-label="Close"
                className="bg-bg-soft text-text-muted hover:text-text-primary hover:bg-white border border-border-soft p-1.5 rounded-md"
              >
                <X size={16} />
              </button>
            </header>
            <div className="px-5 py-5 max-h-[60vh] overflow-y-auto text-[0.95rem] leading-[1.7] text-text-primary bg-bg-soft border-b border-border-soft whitespace-pre-wrap">
              {activeItem.rewrittenText || activeItem.originalText}
            </div>
            <footer className="px-5 py-4 bg-white flex justify-end gap-2 max-md:flex-col-reverse">
              <button
                onClick={() => handleDelete(activeItem._id)}
                className="bg-white text-text-error border border-bg-error px-4 py-2 rounded-lg font-semibold text-sm hover:bg-bg-error transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() =>
                  handleCopy(
                    activeItem.rewrittenText || activeItem.originalText
                  )
                }
                className="inline-flex items-center gap-2 bg-brand-primary hover:bg-[#032c5a] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy text"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
