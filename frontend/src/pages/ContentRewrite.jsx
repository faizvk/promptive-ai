import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, RefreshCcw, Copy, Sparkles } from "lucide-react";

import { rewriteSchema } from "../utils/rewriteSchema";
import { rewriteContent } from "../api/rewrite.api";
import "./styles/ContentRewrite.css";

const ContentRewrite = () => {
  const [output, setOutput] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(rewriteSchema),
    defaultValues: {
      text: "",
      tone: "professional",
    },
  });

  const onSubmit = async (data) => {
    setOutput("");
    try {
      const res = await rewriteContent(data);
      setOutput(res.content.rewrittenText);
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Failed to rewrite content",
      });
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="rewrite-page">
      <div className="rewrite-layout">
        {/* LEFT: INPUT */}
        <section className="rewrite-panel">
          <header className="rewrite-header">
            <h1>Content Rewrite</h1>
            <p>Rewrite text using AI while preserving meaning.</p>
          </header>

          <form className="rewrite-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="input-block">
              <label className="input-label">
                <FileText size={14} /> Original Content
              </label>
              <textarea
                rows={8}
                placeholder="Paste your content here…"
                {...register("text")}
              />
              {errors.text && (
                <span className="error-text">{errors.text.message}</span>
              )}
            </div>

            <div className="input-block">
              <label className="input-label">Tone</label>
              <select {...register("tone")}>
                <option value="professional">Professional</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Rewriting…" : "Rewrite Content"}
              {!isSubmitting && <Sparkles size={16} />}
            </button>

            {errors.root?.message && (
              <div className="error-banner">{errors.root.message}</div>
            )}
          </form>
        </section>

        {/* RIGHT: OUTPUT */}
        <section className="output-panel">
          {!output && !isSubmitting && (
            <div className="empty-state">
              <FileText size={40} />
              <p>Your rewritten content will appear here</p>
            </div>
          )}

          {isSubmitting && (
            <div className="loading-state">
              <div className="pulse-loader" />
              <p>Rewriting content…</p>
            </div>
          )}

          {output && (
            <div className="output-card">
              <div className="output-text">{output}</div>

              <div className="output-actions">
                <button onClick={handleCopy}>
                  <Copy size={16} /> Copy
                </button>
                <button onClick={handleSubmit(onSubmit)}>
                  <RefreshCcw size={16} /> Regenerate
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ContentRewrite;
