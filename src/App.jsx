import { useRef, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import LanguageSwitcher from './components/LanguageSwitcher'
import NewsFeed from './components/NewsFeed'

function App() {
  const [language, setLanguage] = useState('en')
  const feedRef = useRef(null)

  const scrollToFeed = () => {
    document.getElementById('feed')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <Hero onExplore={scrollToFeed} />

      <div className="bg-black border-y border-yellow-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-white/90 text-sm">
            Multi-language and audio-ready. Choose your preferred language.
          </div>
          <LanguageSwitcher value={language} onChange={setLanguage} />
        </div>
      </div>

      <div ref={feedRef}>
        <NewsFeed language={language} />
      </div>

      <footer className="bg-black border-t border-yellow-500/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} News Pulse AI. All rights reserved. Azad Studio section is free for everyone. Premium unlocks Hyderabad, Telangana, India, International, Sports & Founders.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
