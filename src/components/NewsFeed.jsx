import { Lock, Volume2, Play, Pause } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const BRAND_LOGO = (
  <div className="mr-2 shrink-0 h-6 w-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 ring-2 ring-yellow-500/50 flex items-center justify-center text-[10px] font-bold text-black">NP</div>
)

const translations = {
  // These are sample static translations for demo purposes
  en: (text) => text,
  ru: (text) => text, // roman urdu provided side-by-side
  hi: () => 'यह एक उदाहरण समाचार सारांश है — वास्तविक डेटा एकीकृत किया जाएगा।',
  ur: () => 'یہ ایک مثال خبر خلاصہ ہے — اصل ڈیٹا شامل کیا جائے گا۔',
  te: () => 'ఇది ఒక నమూనా వార్తల సంగ్రహం — నిజమైన డేటా సమకాలీకరించబడుతుంది.',
}

const romanUrduForBullets = [
  'AI avatar se aasan tareeqay se news suniye',
  'Har khabar ka 3 point me English summary',
  'Instant translation aur audio playback sab languages me',
]

const freeItems = [
  {
    id: 'az1',
    source: 'Azad Studio • Telegram @AzadStudioOfficial',
    title: 'Azad Studio — Today\'s Highlights',
    bullets: [
      'Breaking: Key updates from Hyderabad and Telangana',
      'Sports roundup with major wins and transfers',
      'Founder spotlight: Vision and mission for better news',
    ],
  },
]

const premiumSections = ['Hyderabad', 'Telangana', 'India', 'International', 'Sports', 'Founders']

function useVoices() {
  const [voices, setVoices] = useState([])
  useEffect(() => {
    function update() {
      const v = window.speechSynthesis?.getVoices?.() || []
      setVoices(v)
    }
    update()
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.addEventListener?.('voiceschanged', update)
      return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', update)
    }
  }, [])
  return voices
}

function pickVoice(voices, langCode) {
  const langMap = {
    en: 'en',
    hi: 'hi',
    ur: 'ur',
    te: 'te',
    ru: 'en', // roman urdu will be spoken in English voice
  }
  const pref = langMap[langCode] || 'en'
  return (
    voices.find((v) => v.lang?.toLowerCase().startsWith(pref)) ||
    voices.find((v) => v.lang?.toLowerCase().startsWith('en')) ||
    voices[0]
  )
}

export default function NewsFeed({ language }) {
  const [playingId, setPlayingId] = useState(null)
  const voices = useVoices()
  const utterRef = useRef(null)

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel?.()
    }
  }, [])

  function speak(text, id, langCode) {
    try {
      window.speechSynthesis?.cancel?.()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = langCode === 'ru' ? 'en-US' : `${langCode}-${langCode.toUpperCase()}`
      const voice = pickVoice(voices, langCode)
      if (voice) utter.voice = voice
      utter.onend = () => setPlayingId(null)
      utter.onerror = () => setPlayingId(null)
      utterRef.current = utter
      setPlayingId(id)
      window.speechSynthesis?.speak?.(utter)
    } catch (e) {
      console.error(e)
      setPlayingId(null)
    }
  }

  function stop() {
    window.speechSynthesis?.cancel?.()
    setPlayingId(null)
  }

  const renderedFree = useMemo(() => {
    return freeItems.map((item) => {
      const roman = romanUrduForBullets
      return (
        <article key={item.id} className="bg-white/5 border border-yellow-500/20 rounded-xl p-4 md:p-5 text-white">
          <header className="flex items-center text-sm text-gray-300 mb-2">
            {BRAND_LOGO}
            <span>{item.source}</span>
          </header>
          <h3 className="text-lg md:text-xl font-semibold mb-3">{item.title}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 list-disc list-inside text-gray-100">
              {item.bullets.map((b, idx) => (
                <li key={idx} className="">
                  <span className="font-medium">{b}</span>
                  <div className="text-xs text-gray-300 ml-5 mt-1">{roman[idx]}</div>
                  {language !== 'en' && (
                    <div className="text-xs text-gray-300 ml-5 mt-1">{translations[language](b)}</div>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex flex-col justify-between">
              <div className="text-sm text-gray-300">
                Listen to this summary in your preferred language.
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => speak(item.bullets.join('. '), item.id + '-en', 'en')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-yellow-500 text-black text-sm font-semibold hover:bg-yellow-400"
                >
                  <Volume2 size={16} /> English
                </button>
                <button
                  onClick={() => speak(roman.join('. '), item.id + '-ru', 'ru')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-sm hover:bg-yellow-500/30"
                >
                  <Volume2 size={16} /> Roman Urdu
                </button>
                {['hi', 'ur', 'te'].includes(language) && (
                  <button
                    onClick={() => speak(item.bullets.map((b) => translations[language](b)).join('. '), item.id + '-' + language, language)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-sm hover:bg-yellow-500/30"
                  >
                    <Volume2 size={16} /> Speak Selected
                  </button>
                )}
                {playingId ? (
                  <button onClick={stop} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20">
                    <Pause size={16} /> Stop
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/70 text-sm">
                    <Play size={16} /> Ready
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      )
    })
  }, [language])

  return (
    <section id="feed" className="bg-black py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Azad Studio — Free</h2>
            <p className="text-gray-300 text-sm">Live highlights from @AzadStudioOfficial</p>
          </div>
          <a href="#premium" className="text-yellow-400 text-sm">See Premium Sections →</a>
        </div>

        <div className="space-y-4">{renderedFree}</div>

        <div id="premium" className="mt-10 md:mt-14">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Premium Sections</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {premiumSections.map((sec) => (
              <div key={sec} className="relative rounded-xl border border-yellow-500/20 bg-gradient-to-br from-white/5 to-white/0 p-4 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-yellow-300 mb-2">
                    {BRAND_LOGO}
                    <span className="text-sm">{sec}</span>
                  </div>
                  <div className="text-lg font-semibold">Unlock {sec} News</div>
                  <p className="text-sm text-gray-300 mt-1">Subscribe to access real-time updates, translations and audio.</p>
                  <button className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-yellow-500 text-black text-sm font-semibold hover:bg-yellow-400">
                    <Lock size={16} /> Get Premium • ₹799/mo
                  </button>
                  <div className="text-[11px] text-gray-400 mt-1">Includes 3-day free trial</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
