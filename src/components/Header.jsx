import { Crown } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full bg-black/90 backdrop-blur border-b border-yellow-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-inner flex items-center justify-center ring-2 ring-yellow-500/50">
            <Crown className="text-black" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white text-xl font-semibold tracking-tight">News Pulse AI</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-400/30">Premium</span>
            </div>
            <p className="text-xs text-gray-300">by - Abu Aimal, Aimal Akram & Azad Studio</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 text-sm text-gray-300">
          <span className="px-3 py-1 rounded-full border border-yellow-500/30 text-yellow-400 bg-yellow-500/10">Azad Studio - Free</span>
          <span className="px-3 py-1 rounded-full border border-yellow-500/30 text-gray-200">₹799/mo • 3-day trial</span>
        </div>
      </div>
    </header>
  )
}
