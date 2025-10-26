import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import LanguageSwitcher from "./components/LanguageSwitcher.jsx";
import NewsFeed from "./components/NewsFeed.jsx";

export default function App() {
  const [language, setLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <Header />
      <Hero />

      <main className="max-w-6xl mx-auto px-4 -mt-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <LanguageSwitcher value={language} onChange={setLanguage} />
        </div>
      </main>

      <NewsFeed language={language} />

      <footer className="py-10 text-center text-white/40 text-sm">
        <div className="max-w-6xl mx-auto px-4">
          Built for preview — dark, elegant, and fast. Add real feeds and AI next.
        </div>
      </footer>
    </div>
  );
}
