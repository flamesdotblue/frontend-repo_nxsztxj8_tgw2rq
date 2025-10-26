import { useEffect, useMemo, useRef, useState } from "react";
import { Globe, Play, Square } from "lucide-react";

// Simple, resilient TTS using the Web Speech API
function useSpeech() {
  const synthRef = useRef(window?.speechSynthesis || null);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) return;
    const onEnd = () => setSpeaking(false);
    const onStart = () => setSpeaking(true);

    window.addEventListener("speechsynthesisvoiceschanged", () => {});
    synth.addEventListener?.("voiceschanged", () => {});

    return () => {
      synth?.removeEventListener?.("end", onEnd);
      synth?.removeEventListener?.("start", onStart);
    };
  }, []);

  const speak = (text) => {
    const synth = synthRef.current;
    if (!synth || !text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.onend = () => setSpeaking(false);
    utter.onstart = () => setSpeaking(true);
    synth.cancel();
    synth.speak(utter);
  };

  const stop = () => {
    const synth = synthRef.current;
    if (!synth) return;
    synth.cancel();
    setSpeaking(false);
  };

  return { speak, stop, speaking };
}

const premiumSections = [
  { key: "hyderabad", title: "Hyderabad" },
  { key: "telangana", title: "Telangana" },
  { key: "india", title: "India" },
  { key: "world", title: "International" },
  { key: "sports", title: "Sports" },
];

// Lightweight mock data to ensure the UI is always visible even if external RSS is blocked.
const MOCK_ITEMS = [
  {
    title: "Tech stocks lift markets as earnings optimism builds",
    summary:
      "Investors piled into technology shares ahead of a busy week of corporate results, pushing major indices higher.",
    source: "Global Finance Daily",
  },
  {
    title: "Monsoon brings relief and challenges across Telangana",
    summary:
      "Heavy showers cooled temperatures but caused local flooding in low-lying areas; authorities issued advisories.",
    source: "Telangana Today",
  },
  {
    title: "Hyderabad metro expands last-mile connectivity",
    summary:
      "New feeder services launched to improve access to stations, easing commute for thousands of riders.",
    source: "City Desk",
  },
];

function Section({ title, items, onPlay, onStop }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-white">
          <Globe className="h-5 w-5 text-fuchsia-300" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-400/30 text-white"
            onClick={onPlay}
            aria-label="Play summary"
          >
            <Play className="h-4 w-4" />
            <span className="text-sm">Play</span>
          </button>
          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white"
            onClick={onStop}
            aria-label="Stop playback"
          >
            <Square className="h-4 w-4" />
            <span className="text-sm">Stop</span>
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((it, idx) => (
          <article
            key={idx}
            className="rounded-xl bg-black/40 border border-white/10 p-4 hover:border-fuchsia-400/30 transition"
          >
            <h4 className="text-white font-medium leading-snug line-clamp-2">{it.title}</h4>
            <p className="mt-2 text-white/70 text-sm line-clamp-3">{it.summary}</p>
            <div className="mt-3 text-xs text-white/50">{it.source}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function NewsFeed({ language }) {
  const { speak, stop } = useSpeech();

  const items = useMemo(() => MOCK_ITEMS, []);

  const composeSummary = () => {
    const intro =
      language === "hi"
        ? "आज की मुख्य ख़बरें:"
        : language === "ur"
        ? "Aaj ki ahem khabrein:"
        : language === "te"
        ? "ఈరోజు ప్రధాన వార్తలు:"
        : language === "ru"
        ? "Главные новости дня:"
        : "Top stories:";

    const body = items
      .slice(0, 3)
      .map((i, idx) => `${idx + 1}. ${i.title}`)
      .join(" ");

    return `${intro} ${body}`;
  };

  return (
    <section className="max-w-6xl mx-auto px-4 space-y-6 py-8">
      <div className="space-y-4">
        {premiumSections.map((sec) => (
          <Section
            key={sec.key}
            title={sec.title}
            items={items}
            onPlay={() => speak(composeSummary())}
            onStop={stop}
          />)
        )}
      </div>

      <div className="pt-2 text-center text-white/50 text-sm">
        Live RSS and AI summaries can be enabled next. This preview uses sample headlines so it always loads reliably.
      </div>
    </section>
  );
}
