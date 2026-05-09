import React, { useState } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Maximize2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { imageSchema } from "../utils/imageSchema";
import { generateImage } from "../api/image.api";
import { fadeIn } from "../animations/FadeIn";

const ASPECT_RATIOS = {
  "1:1": "1 / 1",
  "16:9": "16 / 9",
  "9:16": "9 / 16",
};

const fieldBase =
  "w-full px-4 py-3.5 rounded-xl border border-border-soft bg-bg-soft text-[0.95rem] font-[inherit] outline-none transition-all duration-200 hover:border-text-muted/40 placeholder:text-text-muted focus-visible:border-btn-primary focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_rgba(79,156,249,0.15)]";

const submitBtn =
  "group w-full p-3.5 rounded-xl border-0 bg-brand-primary enabled:hover:bg-[#032c5a] text-text-inverse font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2";

const labelEl =
  "flex items-center gap-1.5 text-[0.8rem] font-bold tracking-[0.06em] uppercase text-text-secondary";

const aspectOption =
  "inline-flex items-center gap-1.5 text-sm cursor-pointer px-3 py-1.5 rounded-lg border border-border-soft bg-bg-soft transition-colors hover:bg-white has-[input:checked]:!bg-brand-primary has-[input:checked]:!text-white has-[input:checked]:!border-brand-primary";

const ImageGenerate = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
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
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 min-h-full w-full lg:p-12">
      <div className="grid grid-cols-1 gap-5 md:gap-8 lg:grid-cols-[520px_1fr] lg:items-start">
        {/* LEFT PANEL */}
        <aside
          className="flex flex-col gap-8"
          {...fadeIn({
            direction: "right",
            distance: 80,
            duration: 0.9,
          })}
        >
          <form
            className="bg-bg-surface p-5 md:p-7 rounded-2xl md:rounded-3xl border border-border-soft flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <header className="mb-1">
              <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-1.5">
                Workspace
              </span>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-[-0.01em] mb-1.5 text-text-primary">
                Image Generation
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                High-quality AI images with fine-grained control.
              </p>
            </header>

            {/* PROMPT */}
            <div className="flex flex-col gap-2">
              <label className={labelEl}>
                <ImageIcon size={13} /> Prompt
              </label>
              <textarea
                rows={5}
                placeholder="Describe the image in detail…"
                className={`${fieldBase} resize-y min-h-[120px]`}
                {...register("prompt")}
              />
              {errors.prompt && (
                <span className="text-xs font-medium text-text-error">
                  {errors.prompt.message}
                </span>
              )}
            </div>

            {/* RESOLUTION + QUALITY */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label className={labelEl}>Resolution</label>
                <select className={fieldBase} {...register("resolution")}>
                  <option value="512x512">512 × 512</option>
                  <option value="768x768">768 × 768</option>
                  <option value="1024x1024">1024 × 1024</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelEl}>Quality</label>
                <select className={fieldBase} {...register("quality")}>
                  <option value="fast">Fast</option>
                  <option value="balanced">Balanced</option>
                  <option value="ultra">Ultra</option>
                </select>
              </div>
            </div>

            {/* ASPECT RATIO */}
            <div className="flex flex-col gap-2">
              <label className={labelEl}>Aspect Ratio</label>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(ASPECT_RATIOS).map((ratio) => (
                  <label key={ratio} className={aspectOption}>
                    <input
                      type="radio"
                      value={ratio}
                      className="sr-only"
                      {...register("aspectRatio")}
                    />
                    {ratio}
                  </label>
                ))}
              </div>
            </div>

            {/* NEGATIVE PROMPT */}
            <div className="flex flex-col gap-2">
              <label className={labelEl}>Negative prompt (optional)</label>
              <input
                type="text"
                placeholder="What to avoid — e.g. blurry, watermark, text"
                className={fieldBase}
                {...register("negativePrompt")}
              />
              {errors.negativePrompt && (
                <span className="text-xs font-medium text-text-error">
                  {errors.negativePrompt.message}
                </span>
              )}
            </div>

            <button className={submitBtn} disabled={isSubmitting}>
              {isSubmitting ? "Generating…" : "Generate Image"}
              {!isSubmitting && (
                <Sparkles
                  size={17}
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
        </aside>

        {/* RIGHT PANEL */}
        <section className="bg-bg-surface rounded-2xl md:rounded-3xl border border-dashed border-border-soft p-4 md:p-6 flex items-center justify-center w-full min-h-[280px] md:min-h-[420px] relative">
          {!imageUrl && isSubmitting && (
            <div
              className="w-full max-w-[720px] rounded-xl bg-[length:400%_100%] bg-gradient-to-r from-bg-soft from-[25%] via-[#e5e7eb] via-[37%] to-bg-soft to-[63%] animate-shimmer"
              style={{
                aspectRatio: ASPECT_RATIOS[aspectRatio],
              }}
            />
          )}

          {!imageUrl && !isSubmitting && (
            <div className="w-full max-w-[720px] aspect-[16/9] flex flex-col items-center justify-center gap-3 text-text-muted text-center">
              <div className="w-14 h-14 rounded-2xl bg-bg-soft text-text-muted flex items-center justify-center">
                <ImageIcon size={26} />
              </div>
              <p className="text-sm">Your image will appear here</p>
            </div>
          )}

          {imageUrl && (
            <div className="relative inline-flex max-w-full">
              <img
                src={imageUrl}
                alt="Generated"
                onClick={() => setIsZoomed(true)}
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-xl cursor-zoom-in"
              />

              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={handleDownload}
                  className="bg-black/65 backdrop-blur-sm text-white border border-white/10 p-2 rounded-lg cursor-pointer transition-colors hover:bg-black/80"
                  aria-label="Download"
                >
                  <Download size={15} />
                </button>
                <button
                  onClick={() => setIsZoomed(true)}
                  className="bg-black/65 backdrop-blur-sm text-white border border-white/10 p-2 rounded-lg cursor-pointer transition-colors hover:bg-black/80"
                  aria-label="Maximize"
                >
                  <Maximize2 size={15} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* FULLSCREEN PREVIEW */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg cursor-pointer transition-colors"
            onClick={() => setIsZoomed(false)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <img
            src={imageUrl}
            alt="Fullscreen preview"
            className="max-w-[92vw] max-h-[92vh] rounded-xl"
          />
        </div>
      )}
    </div>
  );
};

export default ImageGenerate;
