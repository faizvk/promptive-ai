import React, { useState } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Maximize2,
  X,
  Square,
  RectangleHorizontal,
  RectangleVertical,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { imageSchema } from "../utils/imageSchema";
import { generateImage } from "../api/image.api";
import Select from "../components/Select";

const ASPECT_RATIOS = {
  "1:1": { ratio: "1 / 1", icon: Square, label: "Square" },
  "16:9": { ratio: "16 / 9", icon: RectangleHorizontal, label: "Landscape" },
  "9:16": { ratio: "9 / 16", icon: RectangleVertical, label: "Portrait" },
};

const fieldBase =
  "w-full px-3.5 py-2.5 rounded-lg border border-border-soft bg-white text-[0.95rem] outline-none transition-colors hover:border-text-muted/40 placeholder:text-text-muted focus:border-btn-primary";

const labelEl =
  "block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-text-muted mb-2";

const RESOLUTION_OPTIONS = [
  { value: "512x512", label: "512 × 512" },
  { value: "768x768", label: "768 × 768" },
  { value: "1024x1024", label: "1024 × 1024" },
];

const PROMPT_INSPIRATIONS = [
  "A futuristic city at sunset, neon highlights, cinematic lighting",
  "Minimal product shot of a ceramic mug on white background, soft shadow",
  "Photorealistic portrait of an astronaut, studio lighting, shallow depth of field",
  "Hand-drawn watercolor illustration of a quiet mountain village in autumn",
];

const QUALITY_OPTIONS = [
  { value: "fast", label: "Fast", description: "Quickest, fewer steps" },
  { value: "balanced", label: "Balanced", description: "Default quality" },
  { value: "ultra", label: "Ultra", description: "Slow, highest detail" },
];

const ImageGenerate = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      prompt: "",
      resolution: "768x768",
      aspectRatio: "1:1",
      quality: "balanced",
      negativePrompt: "",
    },
  });

  const aspectRatio = watch("aspectRatio");

  const onSubmit = async (data) => {
    setImageUrl(null);
    try {
      const res = await generateImage(data);
      setImageUrl(res.image.imageUrl);
    } catch (err) {
      setError("root", {
        message:
          err.response?.data?.message ||
          "Failed to generate image. Please try again.",
      });
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    const blob = await fetch(imageUrl).then((r) => r.blob());
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "promptive-ai-image.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-5">
      {/* LEFT — controls */}
      <aside className="bg-white border border-border-soft rounded-xl p-5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className={labelEl}>Prompt</label>
            <textarea
              rows={4}
              placeholder="Describe the image in detail…"
              className={`${fieldBase} resize-y min-h-[112px] bg-bg-soft`}
              {...register("prompt")}
            />
            {errors.prompt && (
              <span className="text-xs font-medium text-text-error mt-1 block">
                {errors.prompt.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelEl}>Resolution</label>
              <Controller
                control={control}
                name="resolution"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    options={RESOLUTION_OPTIONS}
                    triggerClassName="w-full"
                  />
                )}
              />
            </div>
            <div>
              <label className={labelEl}>Quality</label>
              <Controller
                control={control}
                name="quality"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    options={QUALITY_OPTIONS}
                    triggerClassName="w-full"
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label className={labelEl}>Aspect ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ASPECT_RATIOS).map(([key, cfg]) => {
                const active = aspectRatio === key;
                const Icon = cfg.icon;
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setValue("aspectRatio", key)}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg border transition-colors ${
                      active
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "border-border-soft text-text-secondary hover:bg-bg-soft hover:border-text-muted/40"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-xs font-semibold">{key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelEl}>Negative prompt (optional)</label>
            <input
              type="text"
              placeholder="What to avoid — blurry, watermark, text…"
              className={fieldBase}
              {...register("negativePrompt")}
            />
            {errors.negativePrompt && (
              <span className="text-xs font-medium text-text-error mt-1 block">
                {errors.negativePrompt.message}
              </span>
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="group w-full p-3 rounded-lg border-0 bg-brand-primary enabled:hover:bg-[#032c5a] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Generating…" : "Generate image"}
            {!isSubmitting && <Sparkles size={15} />}
          </button>

          {errors.root?.message && (
            <div className="bg-bg-error text-text-error p-3 rounded-lg border border-border-error text-sm">
              {errors.root.message}
            </div>
          )}
        </form>
      </aside>

      {/* RIGHT — preview */}
      <section className="bg-white border border-border-soft border-dashed rounded-xl p-4 md:p-6 flex items-center justify-center min-h-[480px] relative">
        {!imageUrl && isSubmitting && (
          <div
            className="w-full max-w-[720px] rounded-lg bg-[length:400%_100%] bg-gradient-to-r from-bg-soft from-[25%] via-[#e5e7eb] via-[37%] to-bg-soft to-[63%] animate-shimmer"
            style={{ aspectRatio: ASPECT_RATIOS[aspectRatio].ratio }}
          />
        )}

        {!imageUrl && !isSubmitting && (
          <div className="w-full max-w-[520px] flex flex-col items-center text-center py-6">
            <div className="w-12 h-12 rounded-xl bg-bg-soft text-text-muted flex items-center justify-center mb-3">
              <ImageIcon size={22} />
            </div>
            <h3 className="text-sm font-bold text-text-primary mb-1">
              Generate your first image
            </h3>
            <p className="text-xs text-text-muted mb-5 max-w-xs">
              Write a prompt on the left or try one of these to start:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {PROMPT_INSPIRATIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    reset((prev) => ({ ...prev, prompt: p }))
                  }
                  className="text-left p-2.5 rounded-lg border border-border-soft bg-white hover:border-brand-primary/30 hover:bg-bg-soft text-[0.78rem] leading-snug text-text-secondary transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="relative inline-flex max-w-full">
            <img
              src={imageUrl}
              alt="Generated"
              onClick={() => setIsZoomed(true)}
              className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-lg cursor-zoom-in"
            />
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              <button
                onClick={handleDownload}
                className="bg-black/70 backdrop-blur-sm text-white border border-white/10 p-2 rounded-md hover:bg-black/85 transition-colors"
                aria-label="Download"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => setIsZoomed(true)}
                className="bg-black/70 backdrop-blur-sm text-white border border-white/10 p-2 rounded-md hover:bg-black/85 transition-colors"
                aria-label="Maximize"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        )}
      </section>

      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg"
            onClick={() => setIsZoomed(false)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <img
            src={imageUrl}
            alt="Fullscreen preview"
            className="max-w-[92vw] max-h-[92vh] rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImageGenerate;
