import React, { useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, RefreshCcw, Copy, Sparkles, Check } from "lucide-react";
import { rewriteSchema } from "../utils/rewriteSchema";
import { rewriteContent } from "../api/rewrite.api";
import Select from "../components/Select";

const fieldBase =
  "w-full px-3.5 py-3 rounded-lg border border-border-soft bg-white text-[0.95rem] outline-none transition-colors hover:border-text-muted/40 placeholder:text-text-muted focus:border-btn-primary";

const labelEl =
  "block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-text-muted mb-2";

const TONES = [
  {
    value: "professional",
    label: "Professional",
    description: "Polished and business-appropriate",
  },
  {
    value: "formal",
    label: "Formal",
    description: "Structured, respectful, careful",
  },
  {
    value: "casual",
    label: "Casual",
    description: "Conversational and easy-going",
  },
  {
    value: "creative",
    label: "Creative",
    description: "Vivid, expressive, playful",
  },
];

const ContentRewrite = () => {
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(rewriteSchema),
    defaultValues: {
      text: "",
      tone: "professional",
    },
  });

  const liveText = useWatch({ control, name: "text" }) || "";
  const { chars, words } = useMemo(() => {
    const trimmed = liveText.trim();
    return {
      chars: liveText.length,
      words: trimmed ? trimmed.split(/\s+/).length : 0,
    };
  }, [liveText]);

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
    <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
      {/* INPUT */}
      <section className="bg-white border border-border-soft rounded-xl p-5 md:p-6">
        <header className="mb-5">
          <h2 className="text-lg font-extrabold text-text-primary tracking-tight">
            Original
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Paste content and pick a tone — Promptive keeps the meaning intact.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <div className="flex items-baseline justify-between">
              <label className={labelEl}>Content</label>
              <span className="text-[0.7rem] text-text-muted tabular-nums mb-2">
                {words} words · {chars} chars
              </span>
            </div>
            <textarea
              rows={8}
              placeholder="Paste your content here…"
              className={`${fieldBase} resize-y min-h-[200px] bg-bg-soft`}
              {...register("text")}
            />
            {errors.text && (
              <span className="text-xs font-medium text-text-error mt-1 block">
                {errors.text.message}
              </span>
            )}
            {chars === 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "text",
                      "We provide tools that help teams make content faster and better."
                    )
                  }
                  className="text-[0.72rem] px-2.5 py-1 rounded-md border border-border-soft bg-white text-text-secondary hover:bg-bg-soft hover:border-brand-primary/30 transition-colors"
                >
                  Try a marketing line
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "text",
                      "Hey, just wanted to check in and see if you had a sec to look at the doc I sent over yesterday. Lmk!"
                    )
                  }
                  className="text-[0.72rem] px-2.5 py-1 rounded-md border border-border-soft bg-white text-text-secondary hover:bg-bg-soft hover:border-brand-primary/30 transition-colors"
                >
                  Try a casual email
                </button>
              </div>
            )}
          </div>

          <div>
            <label className={labelEl}>Tone</label>
            <Controller
              control={control}
              name="tone"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  options={TONES}
                  triggerClassName="w-full"
                />
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-3 rounded-lg border-0 bg-brand-primary enabled:hover:bg-[#032c5a] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-60"
          >
            {isSubmitting ? "Rewriting…" : "Rewrite content"}
            {!isSubmitting && <Sparkles size={15} />}
          </button>

          {errors.root?.message && (
            <div className="bg-bg-error text-text-error p-3 rounded-lg border border-border-error text-sm">
              {errors.root.message}
            </div>
          )}
        </form>
      </section>

      {/* OUTPUT */}
      <section className="bg-white border border-border-soft border-dashed rounded-xl p-5 md:p-6 flex flex-col">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-text-primary tracking-tight">
              Rewritten
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              The output appears here. You can copy it or regenerate.
            </p>
          </div>
          {output && (
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-soft bg-white text-xs font-medium hover:bg-bg-soft hover:border-text-muted/40 transition-colors"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </header>

        {!output && !isSubmitting && (
          <div className="flex-1 flex flex-col items-center justify-center text-text-muted text-center py-10 gap-2.5">
            <div className="w-12 h-12 rounded-xl bg-bg-soft flex items-center justify-center">
              <FileText size={22} />
            </div>
            <p className="text-sm">Your rewritten content will appear here</p>
          </div>
        )}

        {isSubmitting && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-secondary py-10">
            <div className="w-9 h-9 rounded-full bg-brand-primary animate-pulse-loader" />
            <p className="text-sm">Rewriting content…</p>
          </div>
        )}

        {output && (
          <div className="flex flex-col gap-4 flex-1">
            <div className="bg-bg-soft border border-border-soft rounded-lg p-4 text-[0.95rem] leading-[1.7] text-text-primary whitespace-pre-wrap max-h-[440px] overflow-y-auto">
              {output}
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-soft bg-white text-sm font-medium hover:bg-bg-soft hover:border-text-muted/40 transition-colors"
            >
              <RefreshCcw size={13} /> Regenerate
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ContentRewrite;
