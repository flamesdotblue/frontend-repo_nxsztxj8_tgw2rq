import Spline from '@splinetool/react-spline'
import { ChevronRight } from 'lucide-react'

export default function Hero({ onExplore }) {
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black pointer-events-none" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Your AI-powered Premium News Experience
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-200">
              Live news, instant translations, audio narration, and an AI avatar that guides you — starting with Azad Studio, always free.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={onExplore} className="inline-flex items-center gap-2 bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-400 transition">
                Explore Azad Studio
                <ChevronRight size={18} />
              </button>
              <a href="#premium" className="inline-flex items-center gap-2 border border-yellow-500/50 text-yellow-300 px-4 py-2 rounded-md hover:bg-yellow-500/10 transition">
                Go Premium ₹799/mo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
