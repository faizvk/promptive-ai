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
import "./styles/ImageGenerate.css";

const ASPECT_RATIOS = {
  "1:1": "1 / 1",
  "16:9": "16 / 9",
  "9:16": "9 / 16",
};

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

  const resolution = watch("resolution");
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
    <div className="image-gen-container">
      <div className="workspace-layout">
        {/* LEFT PANEL */}
        <aside
          className="controls-panel"
          {...fadeIn({
            direction: "right",
            distance: 80,
            duration: 0.9,
          })}
        >
          <header className="page-header">
            <h1>Image Generation</h1>
            <p>High-quality AI images with fine-grained control.</p>
          </header>

          <form className="control-group" onSubmit={handleSubmit(onSubmit)}>
            {/* PROMPT */}
            <div className="input-block">
              <label className="input-label">
                <ImageIcon size={14} /> Prompt
              </label>
              <div className="textarea-container">
                <textarea
                  rows={5}
                  placeholder="Describe the image in detail…"
                  {...register("prompt")}
                />
              </div>
              {errors.prompt && (
                <span className="error-text">{errors.prompt.message}</span>
              )}
            </div>

            {/* RESOLUTION */}
            <div className="input-block">
              <label className="input-label">Resolution</label>
              <select className="custom-select" {...register("resolution")}>
                <option value="512x512">512 × 512</option>
                <option value="768x768">768 × 768</option>
                <option value="1024x1024">1024 × 1024</option>
              </select>
            </div>

            {/* ASPECT RATIO */}
            <div className="input-block">
              <label className="input-label">Aspect Ratio</label>
              <div className="aspect-ratio-group">
                {Object.keys(ASPECT_RATIOS).map((ratio) => (
                  <label key={ratio} className="aspect-option">
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
              className="primary-button"
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
              <div className="error-banner">{errors.root.message}</div>
            )}
          </form>
        </aside>

        {/* RIGHT PANEL */}
        <section className="preview-panel">
          {/* Skeleton */}
          {!imageUrl && isSubmitting && (
            <div
              className="image-skeleton"
              style={{
                aspectRatio: ASPECT_RATIOS[aspectRatio],
              }}
            />
          )}

          {/* Empty */}
          {!imageUrl && !isSubmitting && (
            <div className="empty-state">
              <ImageIcon size={42} />
              <p>Your image will appear here</p>
            </div>
          )}

          {/* Image */}
          {imageUrl && (
            <div
              className={`image-container ${imageUrl ? "image-loaded" : ""}`}
            >
              <img
                src={imageUrl}
                alt="Generated"
                onClick={() => setIsZoomed(true)}
              />

              <div className="image-actions">
                <button onClick={handleDownload}>
                  <Download size={16} />
                </button>
                <button onClick={() => setIsZoomed(true)}>
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* FULLSCREEN PREVIEW */}
      {isZoomed && (
        <div className="zoom-overlay" onClick={() => setIsZoomed(false)}>
          <img src={imageUrl} alt="Fullscreen preview" />
        </div>
      )}
    </div>
  );
};

export default ImageGenerate;
