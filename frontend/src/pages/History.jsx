import React, { useEffect, useState } from "react";
import { Image, FileText, Trash2, X, Copy, Check } from "lucide-react";
import { fetchHistory, deleteHistoryItem } from "../api/history.api";
import "./styles/History.css";

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
    <div className="history-page">
      <header className="history-header">
        <h1>History</h1>
        <div className="history-tabs">
          <button
            className={type === "image" ? "active" : ""}
            onClick={() => setType("image")}
          >
            <Image size={18} /> Images
          </button>
          <button
            className={type === "rewrite" ? "active" : ""}
            onClick={() => setType("rewrite")}
          >
            <FileText size={18} /> Rewrites
          </button>
        </div>
      </header>

      {loading ? (
        <div className="status-text">Refining your history...</div>
      ) : items.length === 0 ? (
        <div className="empty-text">No items found in this category.</div>
      ) : (
        Object.entries(grouped).map(
          ([section, sectionItems]) =>
            sectionItems.length > 0 && (
              <section key={section} className="history-section">
                <h2 className="section-title">{section}</h2>
                <div className="history-grid">
                  {sectionItems.map((item) => (
                    <div
                      key={item._id}
                      className={`history-card ${
                        type === "rewrite" ? "text-card" : ""
                      }`}
                      onClick={() => type === "rewrite" && setActiveItem(item)}
                    >
                      {type === "image" && (
                        <div className="image-wrapper">
                          <img
                            src={item.imageUrl}
                            alt={item.prompt || "Generated image"}
                          />

                          <button
                            className="download-btn"
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

                      <div className="card-content">
                        <p className="prompt-text">
                          {type === "image"
                            ? item.prompt
                            : item.rewrittenText || item.originalText}
                        </p>
                      </div>
                      <button
                        className="delete-btn"
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
        <div className="modal-overlay" onClick={() => setActiveItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Content Details</h3>
              <button
                className="close-modal"
                onClick={() => setActiveItem(null)}
              >
                <X size={20} />
              </button>
            </header>
            <div className="modal-body">
              <p>{activeItem.rewrittenText || activeItem.originalText}</p>
            </div>
            <footer className="modal-footer">
              <button
                className="danger-outline"
                onClick={() => handleDelete(activeItem._id)}
              >
                Delete
              </button>
              <button
                className="copy-btn"
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
