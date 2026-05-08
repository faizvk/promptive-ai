import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, RefreshCcw, Copy, Sparkles } from "lucide-react";

import { rewriteSchema } from "../utils/rewriteSchema";
import { rewriteContent } from "../api/rewrite.api";

const fieldBase =
  "w-full p-4 rounded-[14px] border border-border-soft bg-bg-soft text-[0.95rem] font-[inherit] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-text-muted focus-visible:border-btn-primary focus-visible:bg-bg-surface focus-visible:shadow-[0_0_0_2px_rgba(79,156,249,0.2)]";

const outputActionBtn =
  "inline-flex items-center gap-1.5 px-4 py-2 rounded-[14px] border border-border-soft bg-white cursor-pointer font-medium text-sm transition-[background-color,border-color] duration-150 hover:bg-bg-soft hover:border-btn-primary";

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
    <div className="p-8 min-h-screen w-full">
      <div className="max-w-[1400px] mx-auto grid gap-8 grid-cols-1 lg:grid-cols-2">
        {/* LEFT: INPUT */}
        <section className="bg-bg-surface rounded-3xl p-8 flex flex-col min-h-full">
          <header className="mb-5">
            <h1 className="text-xl font-extrabold mb-1.5">Content Rewrite</h1>
            <p className="text-sm text-text-secondary leading-[1.5]">
              Rewrite text using AI while preserving meaning.
            </p>
          </header>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
                <FileText size={14} /> Original Content
              </label>
              <textarea
                rows={8}
                placeholder="Paste your content here…"
                className={`${fieldBase} resize-y min-h-[160px] md:min-h-[200px]`}
                {...register("text")}
              />
              {errors.text && (
                <span className="text-xs font-medium text-text-error">
                  {errors.text.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary">
                Tone
              </label>
              <select className={fieldBase} {...register("tone")}>
                <option value="professional">Professional</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3.5 rounded-[14px] border-0 bg-brand-primary text-text-inverse font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-[transform,box-shadow] duration-150 enabled:hover:-translate-y-px enabled:hover:shadow-button disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Rewriting…" : "Rewrite Content"}
              {!isSubmitting && <Sparkles size={16} />}
            </button>

            {errors.root?.message && (
              <div className="mt-3 bg-bg-error text-text-error p-3 rounded-[14px] border border-border-error text-sm">
                {errors.root.message}
              </div>
            )}
          </form>
        </section>

        {/* RIGHT: OUTPUT */}
        <section className="bg-bg-surface rounded-3xl p-8 flex flex-col min-h-full border border-border-soft justify-center">
          {!output && !isSubmitting && (
            <div className="text-center text-text-muted flex flex-col items-center gap-3">
              <FileText size={40} />
              <p>Your rewritten content will appear here</p>
            </div>
          )}

          {isSubmitting && (
            <div className="flex flex-col items-center gap-3 text-text-secondary">
              <div className="w-9 h-9 rounded-full bg-brand-primary animate-pulse-loader" />
              <p>Rewriting content…</p>
            </div>
          )}

          {output && (
            <div className="flex flex-col gap-5 w-full">
              <div className="whitespace-pre-wrap leading-[1.7] text-text-primary text-[0.95rem] text-left bg-bg-soft p-5 rounded-3xl max-h-[420px] overflow-y-auto">
                {output}
              </div>

              <div className="flex gap-3 flex-wrap">
                <button onClick={handleCopy} className={outputActionBtn}>
                  <Copy size={16} /> Copy
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  className={outputActionBtn}
                >
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
