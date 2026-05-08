import React, { useEffect, useState } from "react";
import { Image, FileText, Trash2, X, Copy, Check } from "lucide-react";
import { fetchHistory, deleteHistoryItem } from "../api/history.api";

const tabBtnBase =
  "px-5 py-2.5 rounded-lg border-0 bg-transparent text-sm font-semibold text-text-muted cursor-pointer flex items-center gap-2 transition-all duration-200 max-md:flex-1 max-md:justify-center max-md:whitespace-nowrap hover:text-text-secondary";

const tabBtnActive = "!bg-white !text-brand-primary";

const historyCard =
  "group relative bg-white border border-border-soft rounded-2xl overflow-hidden transition-colors duration-200 flex flex-col cursor-pointer hover:border-brand-primary/30";

const deleteBtn =
  "absolute top-3 right-3 w-8 h-8 rounded-lg border-0 bg-white/95 backdrop-blur-[4px] text-text-error flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_4px_10px_rgba(0,0,0,0.1)] max-md:opacity-100 md:opacity-0 md:-translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:!bg-text-error hover:!text-white";

const downloadBtn =
  "absolute bottom-2.5 right-2.5 px-2.5 py-1.5 text-xs font-semibold bg-black/70 backdrop-blur-sm text-white border border-white/10 rounded-lg cursor-pointer transition-all duration-200 max-md:opacity-100 md:opacity-0 md:[.image-wrapper:hover_&]:opacity-100 md:[.image-wrapper:hover_&]:-translate-y-0.5 hover:bg-black/85";

const copyBtn =
  "group bg-brand-primary hover:bg-[#032c5a] text-white border-0 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer flex items-center gap-2 transition-colors duration-200 max-md:w-full max-md:justify-center";

const dangerOutline =
  "bg-white text-text-error border border-bg-error px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-colors hover:bg-bg-error max-md:w-full";

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

const History = () => {
  const [type, setType] = useState("image");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [copied, setCopied] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetchHistory({ type });
      setItems(res.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    setActiveItem(null);
  }, [type]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    await deleteHistoryItem({ type, id });
    setActiveItem(null);
    loadHistory();
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const grouped = groupByDate(items);

  return (
    <div className="p-4 max-w-[1400px] mx-auto md:p-8">
      <header className="flex flex-col items-start gap-5 mb-8 pb-6 border-b border-border-soft md:flex-row md:justify-between md:items-end md:mb-12">
        <div>
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-2">
            Workspace
          </span>
          <h1 className="text-2xl md:text-[1.85rem] font-extrabold text-text-primary tracking-[-0.02em] m-0">
            History
          </h1>
        </div>
        <div className="flex bg-bg-soft border border-border-soft p-1 rounded-xl gap-1 w-full md:w-auto overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <button
            className={`${tabBtnBase} ${type === "image" ? tabBtnActive : ""}`}
            onClick={() => setType("image")}
          >
            <Image size={17} /> Images
          </button>
          <button
            className={`${tabBtnBase} ${type === "rewrite" ? tabBtnActive : ""}`}
            onClick={() => setType("rewrite")}
          >
            <FileText size={17} /> Rewrites
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center min-h-[30vh] text-text-muted text-sm">
          Loading your history…
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 md:p-16 border border-dashed border-border-soft text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-bg-soft text-text-muted flex items-center justify-center">
            {type === "image" ? <Image size={24} /> : <FileText size={24} />}
          </div>
          <p className="text-text-secondary text-[0.95rem]">
            No items found in this category.
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(
          ([section, sectionItems]) =>
            sectionItems.length > 0 && (
              <section key={section} className="mb-12 md:mb-16">
                <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-text-muted mb-5 flex items-center gap-4 after:content-[''] after:flex-1 after:h-px after:bg-border-soft">
                  {section}
                </h2>
                <div className="grid gap-4 md:gap-5 grid-cols-1 [@media(min-width:769px)]:[grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
                  {sectionItems.map((item) => (
                    <div
                      key={item._id}
                      className={historyCard}
                      onClick={() => type === "rewrite" && setActiveItem(item)}
                    >
                      {type === "image" && (
                        <div className="image-wrapper relative">
                          <img
                            src={item.imageUrl}
                            alt={item.prompt || "Generated image"}
                            className="w-full aspect-[16/10] object-cover"
                          />

                          <button
                            className={downloadBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadImage(
                                item.imageUrl,
                                item.prompt || "promptive-image"
                              );
                            }}
                          >
                            Download
                          </button>
                        </div>
                      )}

                      <div className="p-4 md:p-5">
                        <p className="text-[0.9rem] text-text-secondary leading-relaxed line-clamp-3">
                          {type === "image"
                            ? item.prompt
                            : item.rewrittenText || item.originalText}
                        </p>
                      </div>
                      <button
                        className={deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )
        )
      )}

      {activeItem && (
        <div
          className="fixed inset-0 bg-[rgba(15,23,42,0.5)] backdrop-blur-[8px] flex items-center justify-center z-[1000] p-4 md:p-6"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-white w-full max-w-[640px] rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-modal-slide-up max-md:max-h-[90vh] border border-border-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="px-6 py-5 md:px-7 border-b border-border-soft flex justify-between items-center">
              <div>
                <span className="inline-block text-[0.65rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-1">
                  Saved
                </span>
                <h3 className="font-bold text-text-primary text-base m-0">
                  Content Details
                </h3>
              </div>
              <button
                className="bg-bg-soft border border-border-soft p-2 rounded-lg cursor-pointer text-text-secondary transition-colors hover:bg-white hover:text-text-primary"
                onClick={() => setActiveItem(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </header>
            <div className="px-6 py-6 md:px-7 max-h-[60vh] overflow-y-auto text-[0.95rem] md:text-[1rem] leading-[1.75] text-text-primary bg-bg-soft border-b border-border-soft">
              <p className="whitespace-pre-wrap">
                {activeItem.rewrittenText || activeItem.originalText}
              </p>
            </div>
            <footer className="px-6 py-4 md:px-7 md:py-5 bg-white flex justify-end gap-3 max-md:flex-col-reverse">
              <button
                className={dangerOutline}
                onClick={() => handleDelete(activeItem._id)}
              >
                Delete
              </button>
              <button
                className={copyBtn}
                onClick={() =>
                  handleCopy(
                    activeItem.rewrittenText || activeItem.originalText
                  )
                }
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy Text"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
