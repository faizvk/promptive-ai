import React, { useEffect, useState } from "react";
import { Image, FileText, Trash2 } from "lucide-react";
import { fetchHistory, deleteHistoryItem } from "../api/history.api";
import "./styles/History.css";

/* ===========================
   HELPERS
   =========================== */

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

/* ===========================
   COMPONENT
   =========================== */

const History = () => {
  const [type, setType] = useState("image");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetchHistory({ type });
      setItems(res.items || []);
    } catch (err) {
      console.error("History load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    setActiveItem(null);
  }, [type]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    await deleteHistoryItem({ type, id });
    setActiveItem(null);
    loadHistory();
  };

  const grouped = groupByDate(items);

  return (
    <div className="history-page">
      {/* ================= HEADER ================= */}
      <header className="history-header">
        <h1>History</h1>
        <div className="history-tabs">
          <button
            className={type === "image" ? "active" : ""}
            onClick={() => setType("image")}
          >
            <Image size={16} /> Images
          </button>
          <button
            className={type === "rewrite" ? "active" : ""}
            onClick={() => setType("rewrite")}
          >
            <FileText size={16} /> Rewrites
          </button>
        </div>
      </header>

      {/* ================= STATES ================= */}
      {loading && <p className="status-text">Loading history…</p>}

      {!loading && items.length === 0 && (
        <p className="empty-text">No history found.</p>
      )}

      {/* ================= HISTORY SECTIONS ================= */}
      {!loading &&
        Object.entries(grouped).map(
          ([section, sectionItems]) =>
            sectionItems.length > 0 && (
              <section key={section} className="history-section">
                <h2 className="section-title">{section}</h2>

                <div className="history-grid">
                  {sectionItems.map((item) =>
                    type === "image" ? (
                      /* IMAGE CARD */
                      <div key={item._id} className="history-card">
                        <img src={item.imageUrl} alt={item.prompt} />
                        <p className="prompt-text">{item.prompt}</p>
                        <button onClick={() => handleDelete(item._id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      /* REWRITE CARD */
                      <div
                        key={item._id}
                        className="history-card text-card"
                        onClick={() => setActiveItem(item)}
                      >
                        <p className="prompt-text">
                          {(
                            item.originalText ||
                            item.rewrittenText ||
                            ""
                          ).slice(0, 180)}
                          …
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item._id);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </section>
            )
        )}

      {/* ================= MODAL ================= */}
      {activeItem && (
        <div className="modal-overlay" onClick={() => setActiveItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Rewritten Content</h3>
              <button onClick={() => setActiveItem(null)}>✕</button>
            </header>

            <div className="modal-body">
              <p>{activeItem.rewrittenText || activeItem.originalText || ""}</p>
            </div>

            <footer className="modal-footer">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    activeItem.rewrittenText || activeItem.originalText || ""
                  )
                }
              >
                Copy
              </button>

              <button
                className="danger"
                onClick={() => handleDelete(activeItem._id)}
              >
                Delete
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
