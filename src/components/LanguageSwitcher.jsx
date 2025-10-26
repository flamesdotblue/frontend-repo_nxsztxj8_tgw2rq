import { useState } from "react";
import { Languages } from "lucide-react";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ur", label: "Urdu (Roman)" },
  { code: "te", label: "Telugu" },
  { code: "ru", label: "Russian" },
];

const SAMPLE = {
  en: "Markets rally as tech leads gains; analysts eye earnings season.",
  hi: "टेक सेक्टर की बढ़त से बाजार में तेजी; विश्लेषकों की नज़र नतीजों पर है।",
  ur: "Tech sector ki barh't se bazaar mein tezi, analysts ki nazar earnings par.",
  te: "టెక్ రంగం దూసుకుపోవడంతో మార్కెట్లు లాభపడ్డాయి; విశ్లేషకుల దృష్టి ఫలితాలపై.",
  ru: "Рынки растут благодаря технологиям; аналитики ждут сезон отчетности.",
};

export default function LanguageSwitcher({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/80">
          <Languages className="h-5 w-5" />
          <span className="text-sm">Summaries language</span>
        </div>
        <button
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white"
          onClick={() => setOpen((v) => !v)}
        >
          {LANGS.find((l) => l.code === value)?.label || "English"}
          <span className="text-white/50">▾</span>
        </button>
      </div>

      {open && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                onChange?.(l.code);
                setOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg border transition ${
                value === l.code
                  ? "bg-fuchsia-500/20 border-fuchsia-400/30 text-white"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-white/90"
              }`}
            >
              <div className="font-medium">{l.label}</div>
              <div className="text-xs text-white/60 line-clamp-1">{SAMPLE[l.code]}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
