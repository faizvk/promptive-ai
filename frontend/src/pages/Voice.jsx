import React, { useEffect, useMemo, useState } from "react";
import { Mic, Sparkles, Download, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchVoices, generateVoice } from "../api/voice.api";
import Select from "../components/Select";

const fieldBase =
  "w-full px-3.5 py-3 rounded-lg border border-border-soft bg-white text-[0.95rem] outline-none transition-colors hover:border-text-muted/40 placeholder:text-text-muted focus:border-btn-primary";

const labelEl =
  "block text-[0.7rem] font-bold tracking-[0.12em] uppercase text-text-muted mb-2";

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

  const voiceOptions = useMemo(
    () =>
      voices.map((v) => ({
        value: v.id,
        label: v.name,
        description: `${v.description} · ${v.provider}`,
        group:
          v.provider === "elevenlabs" ? "ElevenLabs" : "OpenAI",
      })),
    [voices]
  );

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
    <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
      {/* INPUT */}
      <section className="bg-white border border-border-soft rounded-xl p-5 md:p-6">
        <header className="mb-5">
          <h2 className="text-lg font-extrabold text-text-primary tracking-tight">
            Voice synthesis
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Convert text to natural-sounding speech.
          </p>
        </header>

        {!available ? (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-bg-error border border-border-error text-text-error text-sm">
            <Lock size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className={labelEl}>Voice</label>
              <Select
                value={voiceId || ""}
                onChange={setVoiceId}
                options={voiceOptions}
                placeholder="Pick a voice"
                triggerClassName="w-full"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <label className={labelEl}>Text</label>
                <span className="text-[0.7rem] text-text-muted tabular-nums mb-2 tabular-nums">
                  {text.length} / 2,000
                </span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                maxLength={2000}
                placeholder="Type or paste up to 2,000 characters of text…"
                className={`${fieldBase} resize-y min-h-[160px] bg-bg-soft`}
              />
              {text.length === 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setText(
                        "Welcome to Promptive AI. Generate stunning voiceovers in seconds."
                      )
                    }
                    className="text-[0.72rem] px-2.5 py-1 rounded-md border border-border-soft bg-white text-text-secondary hover:bg-bg-soft hover:border-brand-primary/30 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5"
                  >
                    Welcome message
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setText(
                        "In today's episode, we're talking about how teams ship faster with AI tools."
                      )
                    }
                    className="text-[0.72rem] px-2.5 py-1 rounded-md border border-border-soft bg-white text-text-secondary hover:bg-bg-soft hover:border-brand-primary/30 transition-[transform,background-color,border-color] duration-200 hover:-translate-y-0.5"
                  >
                    Podcast intro
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !text.trim() || !voiceId}
              className="w-full p-3 rounded-lg border-0 bg-brand-primary enabled:hover:bg-[#032c5a] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-[transform,background-color] duration-200 enabled:hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Generating…" : "Generate audio"}
              {!loading && <Sparkles size={15} />}
            </button>

            {error && (
              <div className="bg-bg-error border border-border-error text-text-error rounded-lg p-3 text-sm">
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

      {/* OUTPUT */}
      <section className="bg-white border border-border-soft border-dashed rounded-xl p-5 md:p-6 flex flex-col items-center justify-center min-h-[360px]">
        {!result && !loading && (
          <div className="text-center text-text-muted">
            <div className="w-12 h-12 rounded-xl bg-bg-soft flex items-center justify-center mx-auto mb-3">
              <Mic size={20} />
            </div>
            <p className="text-sm">Generated audio will appear here</p>
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center gap-3 text-text-secondary">
            <div className="w-9 h-9 rounded-full bg-brand-primary animate-pulse-loader" />
            <p className="text-sm">Synthesizing…</p>
          </div>
        )}
        {result && (
          <div className="w-full max-w-md">
            <div className="bg-bg-soft border border-border-soft rounded-lg p-4 mb-4">
              <p className="text-[0.65rem] text-text-muted uppercase tracking-[0.18em] font-bold mb-1.5">
                {result.voiceName} · {result.provider}
              </p>
              <p className="text-xs text-text-secondary line-clamp-3">
                {result.text}
              </p>
            </div>

            <audio controls src={result.audioUrl} className="w-full mb-3" />

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-text-muted">
                ~{Math.round(result.durationSec)}s
              </span>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-soft bg-white text-xs font-medium hover:bg-bg-soft hover:border-text-muted/40 transition-colors"
              >
                <Download size={13} /> Download MP3
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Voice;
