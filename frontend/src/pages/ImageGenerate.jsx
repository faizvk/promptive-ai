import React, { useState } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Maximize2,
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
  "w-full px-4 py-3.5 rounded-[14px] border border-border-soft bg-bg-soft text-[0.95rem] font-[inherit] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-text-muted focus-visible:border-btn-primary focus-visible:bg-bg-surface focus-visible:shadow-[0_0_0_2px_rgba(79,156,249,0.2)]";

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
    <div className="max-w-[1400px] mx-auto p-8 min-h-full w-full lg:p-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[560px_1fr] lg:items-start">
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
            className="bg-bg-surface p-8 rounded-3xl border border-border-soft flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <header className="mb-8 border-b border-border-soft pb-5">
              <h1 className="text-xl font-extrabold m-0">Image Generation</h1>
              <p>High-quality AI images with fine-grained control.</p>
            </header>

            {/* PROMPT */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
                <ImageIcon size={14} /> Prompt
              </label>
              <div>
                <textarea
                  rows={5}
                  placeholder="Describe the image in detail…"
                  className={`${fieldBase} resize-y min-h-[120px]`}
                  {...register("prompt")}
                />
              </div>
              {errors.prompt && (
                <span className="text-xs font-medium text-text-error">
                  {errors.prompt.message}
                </span>
              )}
            </div>

            {/* RESOLUTION */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
                Resolution
              </label>
              <select className={fieldBase} {...register("resolution")}>
                <option value="512x512">512 × 512</option>
                <option value="768x768">768 × 768</option>
                <option value="1024x1024">1024 × 1024</option>
              </select>
            </div>

            {/* ASPECT RATIO */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary">
                Aspect Ratio
              </label>
              <div className="flex gap-3 flex-wrap">
                {Object.keys(ASPECT_RATIOS).map((ratio) => (
                  <label
                    key={ratio}
                    className="inline-flex items-center gap-1.5 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={ratio}
                      {...register("aspectRatio")}
                    />
                    {ratio}
                  </label>
                ))}
              </div>
            </div>

            <button
              className="w-full p-4 rounded-[14px] border-0 bg-brand-primary text-text-inverse font-semibold inline-flex items-center justify-center gap-3 cursor-pointer transition-[transform,box-shadow] duration-150 enabled:hover:-translate-y-px enabled:hover:shadow-button disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              {...fadeIn({
                direction: "up",
                distance: 80,
                duration: 0.9,
              })}
            >
              {isSubmitting ? "Generating…" : "Generate Image"}
              {!isSubmitting && <Sparkles size={18} />}
            </button>

            {errors.root?.message && (
              <div className="bg-bg-error text-text-error p-5 rounded-[14px] border border-border-error flex items-center gap-3 text-sm">
                {errors.root.message}
              </div>
            )}
          </form>
        </aside>

        {/* RIGHT PANEL */}
        <section className="bg-bg-surface rounded-3xl border border-dashed border-border-soft p-5 flex items-center justify-center w-full min-h-[320px] relative">
          {!imageUrl && isSubmitting && (
            <div
              className="w-full max-w-[720px] rounded-[14px] bg-[length:400%_100%] bg-gradient-to-r from-bg-soft from-[25%] via-[#e5e7eb] via-[37%] to-bg-soft to-[63%] animate-shimmer"
              style={{
                aspectRatio: ASPECT_RATIOS[aspectRatio],
              }}
            />
          )}

          {!imageUrl && !isSubmitting && (
            <div className="w-full max-w-[720px] aspect-[16/9] flex flex-col items-center justify-center gap-3 text-text-muted text-center">
              <ImageIcon size={42} />
              <p>Your image will appear here</p>
            </div>
          )}

          {imageUrl && (
            <div className="relative inline-flex max-w-full transition-all duration-300">
              <img
                src={imageUrl}
                alt="Generated"
                onClick={() => setIsZoomed(true)}
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-[14px] shadow-card cursor-zoom-in"
              />

              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={handleDownload}
                  className="bg-black/65 text-white border-0 p-1.5 rounded-full cursor-pointer"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => setIsZoomed(true)}
                  className="bg-black/65 text-white border-0 p-1.5 rounded-full cursor-pointer"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* FULLSCREEN PREVIEW */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-[1000]"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={imageUrl}
            alt="Fullscreen preview"
            className="max-w-[92vw] max-h-[92vh] rounded-[14px]"
          />
        </div>
      )}
    </div>
  );
};

export default ImageGenerate;
