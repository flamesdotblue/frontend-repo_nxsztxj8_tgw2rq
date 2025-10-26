import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';
import NewsFeed from './components/NewsFeed.jsx';

export default function App() {
  const [language, setLanguage] = useState('en');

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 md:px-6">
        <Hero />

        <div className="flex items-center justify-between gap-4 py-4">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">Your Personalized News Pulse</h2>
          <LanguageSwitcher value={language} onChange={setLanguage} />
        </div>

        <NewsFeed language={language} />
      </main>

      <footer className="mt-16 py-8 text-center text-sm text-zinc-400">
        © {new Date().getFullYear()} News Pulse AI — Built for fast, multi-language news discovery.
      </footer>
    </div>
  );
}
