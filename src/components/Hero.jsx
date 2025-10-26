import Spline from "@splinetool/react-spline";

export default function Hero() {
  return (
    <section className="relative h-[46vh] min-h-[360px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/1X1k6xM8cY8pqXkk/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      {/* Soft gradient overlay that does not block interaction */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60" />
      <div className="relative z-10 max-w-6xl mx-auto h-full px-4 flex items-end">
        <div className="pb-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
            Catch the pulse of global news
          </h2>
          <p className="mt-2 text-white/70 max-w-2xl">
            Interactive 3D, elegant UI, and assistive AI to summarize headlines in your language.
          </p>
        </div>
      </div>
    </section>
  );
}
