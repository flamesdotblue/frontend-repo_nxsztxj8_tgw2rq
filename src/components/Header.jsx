import { Rocket, Star } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/60 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/25">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-white font-semibold leading-tight">News Pulse AI</h1>
            <p className="text-xs text-white/60">Live news, smart summaries, and voice playback</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 text-amber-300 bg-amber-400/10 border border-amber-300/20 px-3 py-1.5 rounded-full">
          <Star className="h-4 w-4" />
          <span className="text-sm">Premium unlocked for testing</span>
        </div>
      </div>
    </header>
  );
}
