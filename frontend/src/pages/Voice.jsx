import React, { useEffect, useState } from "react";
import { Mic, Sparkles, Download, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchVoices, generateVoice } from "../api/voice.api";

const fieldBase =
  "w-full p-4 rounded-xl border border-border-soft bg-bg-soft text-[0.95rem] outline-none transition-colors focus:border-btn-primary focus:bg-white";

const labelEl =
  "flex items-center gap-1.5 text-[0.8rem] font-bold tracking-[0.06em] uppercase text-text-secondary";

const Voice = () => {
  const [voices, setVoices] = useState([]);
  const [voiceId, setVoiceId] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    fetchVoices()
      .then((res) => {
        const v = res.voices || [];
        setVoices(v);
        if (v[0]) setVoiceId(v[0].id);
      })
      .catch((err) => {
        if (err.response?.status === 503) {
          setAvailable(false);
          setError(
            "Voice synthesis isn't enabled on this server. Add an ElevenLabs or OpenAI key."
          );
        }
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !voiceId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await generateVoice({ text, voiceId });
      setResult(res.voice);
    } catch (err) {
      setError(err.response?.data?.message || "Voice generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result?.audioUrl) return;
    try {
      const res = await fetch(result.audioUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "promptive-ai-voice.mp3";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-full w-full">
      <div className="max-w-[1100px] mx-auto grid gap-5 md:gap-8 grid-cols-1 lg:grid-cols-[1fr_1fr]">
        {/* LEFT */}
        <section className="bg-bg-surface rounded-2xl md:rounded-3xl p-5 md:p-7 border border-border-soft">
          <header className="mb-5">
            <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-brand-primary/70 mb-1.5">
              Workspace
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-[-0.01em] mb-1.5 text-text-primary">
              Voice synthesis
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              Convert text into natural-sounding speech.
            </p>
          </header>

          {!available && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-bg-error border border-border-error text-text-error text-sm">
              <Lock size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {available && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className={labelEl}>Voice</label>
                <select
                  className={fieldBase}
                  value={voiceId || ""}
                  onChange={(e) => setVoiceId(e.target.value)}
                >
                  {voices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — {v.description} ({v.provider})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={labelEl}>
                  <Mic size={13} /> Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  maxLength={2000}
                  placeholder="Type or paste up to 2,000 characters of text…"
                  className={`${fieldBase} resize-y min-h-[140px]`}
                />
                <p className="text-[0.7rem] text-text-muted text-right">
                  {text.length} / 2000
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !text.trim() || !voiceId}
                className="w-full p-3.5 rounded-xl border-0 bg-brand-primary enabled:hover:bg-[#032c5a] text-white font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Generating…" : "Generate audio"}
                {!loading && <Sparkles size={16} />}
              </button>

              {error && (
                <div className="bg-bg-error border border-border-error text-text-error rounded-xl p-3 text-sm">
                  {error}
                  {error.toLowerCase().includes("plan") ||
                  error.toLowerCase().includes("limit") ? (
                    <Link
                      to="/dashboard/billing"
                      className="ml-2 font-semibold underline"
                    >
                      Upgrade plan
                    </Link>
                  ) : null}
                </div>
              )}
            </form>
          )}
        </section>

        {/* RIGHT — preview */}
        <section className="bg-bg-surface rounded-2xl md:rounded-3xl p-5 md:p-7 border border-dashed border-border-soft flex flex-col items-center justify-center min-h-[260px]">
          {!result && !loading && (
            <div className="text-center text-text-muted">
              <Mic size={28} className="mx-auto mb-3" />
              <p className="text-sm">Generated audio will appear here.</p>
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center gap-3 text-text-secondary">
              <div className="w-9 h-9 rounded-full bg-brand-primary animate-pulse-loader" />
              <p className="text-sm">Synthesizing…</p>
            </div>
          )}
          {result && (
            <div className="w-full">
              <p className="text-[0.7rem] text-text-muted mb-2 uppercase tracking-[0.12em] font-semibold">
                {result.voiceName} · {result.provider} · ~
                {Math.round(result.durationSec)}s
              </p>
              <audio
                controls
                src={result.audioUrl}
                className="w-full mb-3"
              ></audio>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border-soft bg-white text-sm font-medium hover:bg-bg-soft transition-colors"
              >
                <Download size={15} /> Download MP3
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Voice;
