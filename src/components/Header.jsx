import { Star } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-amber-400 to-emerald-400" />
            <span className="relative font-extrabold text-black">NP</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">News Pulse AI</h1>
            <p className="text-xs text-zinc-400">Realtime headlines. Smart summaries. Multi‑language audio.</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-300">
          <Star className="w-4 h-4" />
          <span className="text-xs font-medium">Premium unlocked for testing</span>
        </div>
      </div>
    </header>
  );
}
