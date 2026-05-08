import React, { useEffect, useState } from "react";
import { Image, FileText, Trash2, X, Copy, Check } from "lucide-react";
import { fetchHistory, deleteHistoryItem } from "../api/history.api";

const tabBtnBase =
  "px-5 py-2.5 rounded-lg border-0 bg-transparent text-sm font-semibold text-[#64748b] cursor-pointer flex items-center gap-2 transition-all duration-200 max-md:flex-1 max-md:justify-center max-md:whitespace-nowrap";

const tabBtnActive = "!bg-white !text-brand-primary shadow-[0_1px_3px_rgba(0,0,0,0.1)]";

const historyCard =
  "group relative bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden transition-all duration-300 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] flex flex-col hover:-translate-y-1 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:border-brand-primary";

const deleteBtn =
  "absolute top-4 right-4 w-8 h-8 rounded-lg border-0 bg-white/90 backdrop-blur-[4px] text-[#ef4444] flex items-center justify-center cursor-pointer transition-all duration-200 shadow-[0_4px_6px_rgba(0,0,0,0.1)] opacity-100 -translate-y-0 max-md:opacity-100 md:opacity-0 md:-translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:!bg-[#ef4444] hover:!text-white";

const downloadBtn =
  "absolute bottom-2.5 right-2.5 px-2.5 py-1.5 text-xs font-semibold bg-black/65 text-white border-0 rounded-lg cursor-pointer transition-[opacity,transform] duration-200 max-md:opacity-100 md:opacity-0 md:[.image-wrapper:hover_&]:opacity-100 md:[.image-wrapper:hover_&]:-translate-y-0.5 hover:bg-black/80";

const copyBtn =
  "bg-brand-primary text-white border-0 px-6 py-3 rounded-[10px] font-semibold cursor-pointer transition-opacity duration-200 hover:opacity-90 max-md:w-full";

const dangerOutline =
  "bg-white text-[#ef4444] border border-[#fee2e2] px-6 py-3 rounded-[10px] font-semibold cursor-pointer hover:bg-bg-error max-md:w-full";

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
      <header className="flex flex-col items-start gap-6 mb-8 pb-6 border-b border-[#e2e8f0] md:flex-row md:justify-between md:items-end md:mb-12">
        <h1 className="text-2xl md:text-[1.85rem] font-extrabold text-[#0f172a] tracking-[-0.02em]">
          History
        </h1>
        <div className="flex bg-[#f1f5f9] p-1.5 rounded-xl gap-1 w-full md:w-auto overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <button
            className={`${tabBtnBase} ${type === "image" ? tabBtnActive : ""}`}
            onClick={() => setType("image")}
          >
            <Image size={18} /> Images
          </button>
          <button
            className={`${tabBtnBase} ${type === "rewrite" ? tabBtnActive : ""}`}
            onClick={() => setType("rewrite")}
          >
            <FileText size={18} /> Rewrites
          </button>
        </div>
      </header>

      {loading ? (
        <div>Refining your history...</div>
      ) : items.length === 0 ? (
        <div>No items found in this category.</div>
      ) : (
        Object.entries(grouped).map(
          ([section, sectionItems]) =>
            sectionItems.length > 0 && (
              <section key={section} className="mb-16">
                <h2 className="text-[0.7rem] md:text-xs font-bold uppercase tracking-[0.1em] text-[#94a3b8] mb-6 flex items-center gap-4 after:content-[''] after:flex-1 after:h-px after:bg-[#e2e8f0]">
                  {section}
                </h2>
                <div className="grid gap-4 md:gap-6 grid-cols-1 [@media(min-width:769px)]:[grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
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
                            className="w-full aspect-[16/10] object-cover border-b border-[#e2e8f0]"
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

                      <div className="p-5">
                        <p className="text-[0.9rem] text-[#475569] leading-[1.6] line-clamp-3">
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
                      >
                        <Trash2 size={16} />
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
          className="fixed inset-0 bg-[rgba(15,23,42,0.4)] backdrop-blur-[8px] flex items-center justify-center z-[1000] p-6"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-white w-full max-w-[650px] rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden animate-modal-slide-up md:rounded-3xl max-md:rounded-[20px] max-md:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="px-8 py-6 border-b border-[#e2e8f0] flex justify-between items-center max-md:px-5 max-md:py-5">
              <h3 className="font-bold text-[#0f172a]">Content Details</h3>
              <button
                className="bg-[#f1f5f9] border-0 p-2 rounded-full cursor-pointer text-[#64748b]"
                onClick={() => setActiveItem(null)}
              >
                <X size={20} />
              </button>
            </header>
            <div className="p-8 max-h-[60vh] overflow-y-auto text-[1.05rem] leading-[1.8] text-[#334155] [background-image:radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] max-md:p-5 max-md:text-[0.95rem]">
              <p>{activeItem.rewrittenText || activeItem.originalText}</p>
            </div>
            <footer className="px-8 py-6 bg-[#f8fafc] border-t border-[#e2e8f0] flex justify-end gap-4 max-md:flex-col-reverse max-md:px-5 max-md:py-5">
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
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? " Copied" : " Copy Text"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
