import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, RefreshCcw, Copy, Sparkles } from "lucide-react";

import { rewriteSchema } from "../utils/rewriteSchema";
import { rewriteContent } from "../api/rewrite.api";

const fieldBase =
  "w-full p-4 rounded-xl border border-border-soft bg-bg-soft text-[0.95rem] font-[inherit] outline-none transition-all duration-200 hover:border-text-muted/40 placeholder:text-text-muted focus-visible:border-btn-primary focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_rgba(79,156,249,0.15)]";

const submitBtn =
  "group w-full px-4 py-3.5 rounded-xl border-0 bg-gradient-to-b from-brand-primary to-[#032c5a] text-text-inverse font-semibold inline-flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(4,56,115,0.3)] transition-all duration-200 enabled:hover:shadow-[0_8px_24px_rgba(4,56,115,0.4)] enabled:hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2";

const outputActionBtn =
  "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border-soft bg-white cursor-pointer font-medium text-sm transition-all duration-200 hover:bg-bg-soft hover:border-brand-primary/30 hover:shadow-[0_2px_8px_rgba(4,56,115,0.06)]";

const labelEl =
  "flex items-center gap-1.5 text-[0.8rem] font-bold tracking-[0.06em] uppercase text-text-secondary";

const ContentRewrite = () => {
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen w-full">
      <div className="max-w-[1400px] mx-auto grid gap-5 md:gap-8 grid-cols-1 lg:grid-cols-2">
        {/* LEFT: INPUT */}
        <section className="bg-bg-surface rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col min-h-full border border-border-soft">
          <header className="mb-5 md:mb-6">
            <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-1.5">
              Workspace
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-[-0.01em] mb-1.5 text-text-primary">
              Content Rewrite
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Rewrite text using AI while preserving meaning.
            </p>
          </header>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <label className={labelEl}>
                <FileText size={13} /> Original Content
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
              <label className={labelEl}>Tone</label>
              <select className={fieldBase} {...register("tone")}>
                <option value="professional">Professional</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <button type="submit" disabled={isSubmitting} className={submitBtn}>
              {isSubmitting ? "Rewriting…" : "Rewrite Content"}
              {!isSubmitting && (
                <Sparkles
                  size={16}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              )}
            </button>

            {errors.root?.message && (
              <div className="bg-bg-error text-text-error p-4 rounded-xl border border-border-error text-sm">
                {errors.root.message}
              </div>
            )}
          </form>
        </section>

        {/* RIGHT: OUTPUT */}
        <section className="bg-bg-surface rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col min-h-full border border-dashed border-border-soft justify-center">
          {!output && !isSubmitting && (
            <div className="text-center text-text-muted flex flex-col items-center gap-3 py-8">
              <div className="w-14 h-14 rounded-2xl bg-bg-soft text-text-muted flex items-center justify-center">
                <FileText size={26} />
              </div>
              <p className="text-sm">Your rewritten content will appear here</p>
            </div>
          )}

          {isSubmitting && (
            <div className="flex flex-col items-center gap-3 text-text-secondary py-8">
              <div className="w-9 h-9 rounded-full bg-brand-primary animate-pulse-loader" />
              <p className="text-sm">Rewriting content…</p>
            </div>
          )}

          {output && (
            <div className="flex flex-col gap-4 md:gap-5 w-full">
              <div className="whitespace-pre-wrap leading-[1.7] text-text-primary text-[0.95rem] text-left bg-bg-soft p-5 rounded-2xl max-h-[420px] overflow-y-auto border border-border-soft">
                {output}
              </div>

              <div className="flex gap-2.5 flex-wrap">
                <button onClick={handleCopy} className={outputActionBtn}>
                  <Copy size={15} /> {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={handleSubmit(onSubmit)}
                  className={outputActionBtn}
                >
                  <RefreshCcw size={15} /> Regenerate
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
