import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative h-[320px] md:h-[420px] w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
      <div className="absolute inset-0">
        {/* 3D Scene */}
        <Spline scene="https://prod.spline.design/jYH0m-A9AqkS8A2b/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Soft gradient overlay that does not block interaction */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
        <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
          Tap into live headlines with AI-powered summaries
        </h2>
        <p className="mt-2 text-sm md:text-base text-zinc-300 max-w-2xl">
          Choose your language, listen on the go, and explore premium sections while testing without friction.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <a
            href="#news"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-100 transition"
          >
            Start reading
          </a>
          <a
            href="#premium"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
          >
            Explore premium
          </a>
        </div>
      </div>
    </section>
  );
}
