import { Volume2, Play, Pause } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const BRAND_LOGO = (
  <div className="mr-2 shrink-0 h-6 w-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 ring-2 ring-yellow-500/50 flex items-center justify-center text-[10px] font-bold text-black">NP</div>
)

const translations = {
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

const premiumSources = {
  Hyderabad: 'https://telanganatoday.com/category/hyderabad/feed',
  Telangana: 'https://telanganatoday.com/category/telangana/feed',
  India: 'https://feeds.feedburner.com/ndtvnews-india-news',
  International: 'https://www.thehindu.com/news/international/feeder/default.rss',
  Sports: 'https://feeds.feedburner.com/ndtvsports-latest',
}

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

function parseRSS(xmlText, limit = 6) {
  try {
    const doc = new DOMParser().parseFromString(xmlText, 'application/xml')
    const items = Array.from(doc.querySelectorAll('item')).slice(0, limit).map((it) => ({
      title: it.querySelector('title')?.textContent?.trim() || 'Untitled',
      link: it.querySelector('link')?.textContent?.trim() || '#',
      pubDate: it.querySelector('pubDate')?.textContent?.trim() || '',
      source: doc.querySelector('channel > title')?.textContent?.trim() || 'RSS',
    }))
    return items
  } catch (e) {
    console.error('RSS parse error', e)
    return []
  }
}

function useRss(url, limit = 6) {
  const [state, setState] = useState({ loading: true, error: null, items: [] })

  useEffect(() => {
    let alive = true
    async function run() {
      setState({ loading: true, error: null, items: [] })
      try {
        const proxied = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
        const res = await fetch(proxied)
        if (!res.ok) throw new Error('Network error')
        const data = await res.json()
        const items = parseRSS(data.contents, limit)
        if (alive) setState({ loading: false, error: null, items })
      } catch (e) {
        console.error('RSS fetch error', e)
        if (alive) setState({ loading: false, error: 'Failed to load', items: [] })
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [url, limit])

  return state
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

  const freeItem = {
    id: 'az1',
    source: 'Azad Studio — Free',
    title: "Today's Highlights",
    bullets: [
      'Key updates from Hyderabad and Telangana',
      'Sports roundup with major wins and transfers',
      'Spotlight: Vision and mission for better news',
    ],
  }

  const renderedFree = useMemo(() => {
    const roman = romanUrduForBullets
    return (
      <article className="bg-white/5 border border-yellow-500/20 rounded-xl p-4 md:p-5 text-white">
        <header className="flex items-center text-sm text-gray-300 mb-2">
          {BRAND_LOGO}
          <span>{freeItem.source}</span>
        </header>
        <h3 className="text-lg md:text-xl font-semibold mb-3">{freeItem.title}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2 list-disc list-inside text-gray-100">
            {freeItem.bullets.map((b, idx) => (
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
            <div className="text-sm text-gray-300">Listen to this summary in your preferred language.</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => speak(freeItem.bullets.join('. '), freeItem.id + '-en', 'en')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-yellow-500 text-black text-sm font-semibold hover:bg-yellow-400"
              >
                <Volume2 size={16} /> English
              </button>
              <button
                onClick={() => speak(roman.join('. '), freeItem.id + '-ru', 'ru')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-sm hover:bg-yellow-500/30"
              >
                <Volume2 size={16} /> Roman Urdu
              </button>
              {['hi', 'ur', 'te'].includes(language) && (
                <button
                  onClick={() => speak(freeItem.bullets.map((b) => translations[language](b)).join('. '), freeItem.id + '-' + language, language)}
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
  }, [language, playingId])

  return (
    <section id="feed" className="bg-black py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Azad Studio — Free</h2>
            <p className="text-gray-300 text-sm">Curated highlights for everyone</p>
          </div>
          <a href="#premium" className="text-yellow-400 text-sm">Jump to Sections →</a>
        </div>

        <div className="space-y-4">{renderedFree}</div>

        <div id="premium" className="mt-10 md:mt-14">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Live Sections</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(premiumSources).map(([sec, url]) => (
              <SectionFeed key={sec} section={sec} url={url} />
            ))}
            <FoundersSection />
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionFeed({ section, url }) {
  const { loading, error, items } = useRss(url, 6)
  return (
    <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-white/5 to-white/0 p-4 text-white">
      <div className="flex items-center gap-2 text-yellow-300 mb-2">
        {BRAND_LOGO}
        <span className="text-sm">{section}</span>
      </div>
      {loading && <div className="text-sm text-gray-400">Loading latest from {section}…</div>}
      {error && <div className="text-sm text-red-300">Unable to load {section} right now.</div>}
      {!loading && !error && (
        <ul className="space-y-2">
          {items.map((it, idx) => (
            <li key={idx} className="text-sm">
              <a className="text-gray-100 hover:text-yellow-300 underline decoration-yellow-600/40 underline-offset-2" href={it.link} target="_blank" rel="noreferrer">
                {it.title}
              </a>
              {it.pubDate && <div className="text-[11px] text-gray-400">{new Date(it.pubDate).toLocaleString()}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FoundersSection() {
  return (
    <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-white/5 to-white/0 p-4 text-white">
      <div className="flex items-center gap-2 text-yellow-300 mb-2">
        {BRAND_LOGO}
        <span className="text-sm">Founders</span>
      </div>
      <div className="text-sm text-gray-200">
        Meet the minds behind News Pulse AI. Share photos and bios to feature here with a clean card layout.
      </div>
    </div>
  )
}
