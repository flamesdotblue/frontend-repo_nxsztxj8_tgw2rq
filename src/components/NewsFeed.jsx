import { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, VolumeX, Globe, ExternalLink } from 'lucide-react';

// Premium sources mapping
const premiumSources = {
  Hyderabad: 'https://telanganatoday.com/category/hyderabad/feed',
  Telangana: 'https://telanganatoday.com/category/telangana/feed',
  India: 'https://feeds.feedburner.com/ndtvnews-india-news',
  International: 'https://www.thehindu.com/news/international/feeder/default.rss',
  Sports: 'https://feeds.feedburner.com/ndtvsports-latest',
};

// Parse RSS/Atom content to a normalized list of items
function parseRSS(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  // Handle parsererror
  if (doc.querySelector('parsererror')) return [];

  const items = [...doc.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title')?.textContent?.trim() || 'Untitled',
    link: item.querySelector('link')?.textContent?.trim() || '#',
    pubDate:
      item.querySelector('pubDate')?.textContent ||
      item.querySelector('dc\\:date')?.textContent ||
      item.querySelector('updated')?.textContent ||
      item.querySelector('published')?.textContent ||
      '',
    description:
      item.querySelector('description')?.textContent ||
      item.querySelector('content\\:encoded')?.textContent ||
      '',
  }));

  if (items.length) return items;

  // Atom fallback
  const entries = [...doc.querySelectorAll('entry')].map((entry) => ({
    title: entry.querySelector('title')?.textContent?.trim() || 'Untitled',
    link: entry.querySelector('link')?.getAttribute('href') || '#',
    pubDate:
      entry.querySelector('updated')?.textContent ||
      entry.querySelector('published')?.textContent ||
      '',
    description: entry.querySelector('summary')?.textContent || '',
  }));

  return entries;
}

async function fetchViaAllOrigins(url) {
  const proxied = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxied);
  if (!res.ok) throw new Error('Network error');
  const data = await res.json();
  return data.contents;
}

function buildJinaUrl(originalUrl) {
  // Jina Reader expects: https://r.jina.ai/http://<host><path>?<query>
  // We map https://example.com/a?b=c -> https://r.jina.ai/http://example.com/a?b=c
  try {
    const u = new URL(originalUrl);
    return `https://r.jina.ai/http://${u.host}${u.pathname}${u.search}`;
  } catch {
    // Fallback to passing raw if URL parsing fails
    return `https://r.jina.ai/http://${originalUrl.replace(/^https?:\/\//, '')}`;
  }
}

async function fetchViaJinaReader(url) {
  const proxied = buildJinaUrl(url);
  const res = await fetch(proxied);
  if (!res.ok) throw new Error('Network error');
  return await res.text();
}

function useRss(url, limit = 6) {
  const [state, setState] = useState({ loading: true, error: null, items: [] });

  useEffect(() => {
    let active = true;

    async function run() {
      setState({ loading: true, error: null, items: [] });
      try {
        let xml = '';
        try {
          xml = await fetchViaAllOrigins(url);
        } catch (e) {
          xml = await fetchViaJinaReader(url);
        }
        const items = parseRSS(xml).slice(0, limit);
        if (active) setState({ loading: false, error: null, items });
      } catch (err) {
        if (active) setState({ loading: false, error: 'Failed to load feed', items: [] });
      }
    }

    run();
    const id = setInterval(run, 5 * 60 * 1000); // refresh every 5 minutes

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [url, limit]);

  return state;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (!isFinite(d.getTime())) return '';
  return d.toLocaleString();
}

function SectionFeed({ title, url }) {
  const { loading, error, items } = useRss(url, 6);
  return (
    <section id="premium" className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1"
        >
          Open source <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      {loading && <p className="mt-3 text-zinc-400">Loading latest headlines…</p>}
      {error && (
        <p className="mt-3 text-red-300">
          Could not load this feed right now. It may be rate-limited. Please try again shortly.
        </p>
      )}
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="block p-4 rounded-xl border border-white/10 bg-zinc-900/50 hover:bg-zinc-900 transition"
          >
            <h4 className="font-medium line-clamp-2">{item.title}</h4>
            {item.pubDate && (
              <p className="mt-1 text-xs text-zinc-400">{formatDate(item.pubDate)}</p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

function FreeHighlights({ language, tts }) {
  const highlights = useMemo(
    () => [
      'Top stories curated for speed and signal.',
      'AI summaries in your preferred language.',
      'Listen on the go with instant audio.',
    ],
    []
  );

  const translated = useMemo(() => translateList(highlights, language), [highlights, language]);

  return (
    <section id="news" className="mt-10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-semibold">Azad Studio — Free</h3>
        <div className="flex items-center gap-2 text-zinc-300">
          <Globe className="w-4 h-4" />
          <span className="text-xs">Auto-translate + Audio</span>
        </div>
      </div>

      <ul className="mt-4 grid md:grid-cols-2 gap-3">
        {translated.map((text, i) => (
          <li key={i} className="p-4 rounded-xl border border-white/10 bg-zinc-900/50">
            <p className="leading-relaxed">{text}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2">
        {!tts.isSpeaking ? (
          <button
            onClick={tts.start}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-100"
          >
            <Volume2 className="w-4 h-4" /> Play highlights
          </button>
        ) : (
          <button
            onClick={tts.stop}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-sm hover:bg-white/10"
          >
            <VolumeX className="w-4 h-4" /> Stop
          </button>
        )}
      </div>
    </section>
  );
}

function FoundersSection() {
  return (
    <section className="mt-12">
      <h3 className="text-xl md:text-2xl font-semibold">Founders</h3>
      <p className="mt-2 text-zinc-300 max-w-2xl">
        Meet the minds behind the product. This section is unlocked for visual testing — share photos and bios to populate.
      </p>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Founder One', 'Founder Two', 'Founder Three'].map((name) => (
          <div key={name} className="p-4 rounded-xl border border-white/10 bg-zinc-900/50">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-emerald-400" />
            <h4 className="mt-3 font-medium">{name}</h4>
            <p className="text-sm text-zinc-400">Short bio to be added.</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Simple, local translation mock to fulfill multi-language cue (no external API)
function translateList(list, lang) {
  const maps = {
    hi: {
      'Top stories curated for speed and signal.': 'शीर्ष खबरें तेज़ी और सटीकता के साथ चुनी गई।',
      'AI summaries in your preferred language.': 'आपकी पसंदीदा भाषा में एआई सारांश।',
      'Listen on the go with instant audio.': 'तुरंत ऑडियो के साथ चलते-फिरते सुनें।',
    },
    ur: {
      'Top stories curated for speed and signal.': 'Behtareen khabren raftaar aur wazahat ke sath.',
      'AI summaries in your preferred language.': 'Aapki pasandeeda zabaan mein AI khulasa.',
      'Listen on the go with instant audio.': 'Foran audio ke sath kahin bhi suniye.',
    },
    te: {
      'Top stories curated for speed and signal.': 'వేగం మరియు స్పష్టతతో ఎంపిక చేసిన ప్రధాన కథలు.',
      'AI summaries in your preferred language.': 'మీ ఇష్టమైన భాషలో AI సారాంశాలు.',
      'Listen on the go with instant audio.': 'తక్షణ ఆడియోతో ఎక్కడైనా వినండి.',
    },
    ru: {
      'Top stories curated for speed and signal.': 'Главные новости — быстро и по делу.',
      'AI summaries in your preferred language.': 'AI‑резюме на вашем языке.',
      'Listen on the go with instant audio.': 'Слушайте в пути с мгновенным аудио.',
    },
  };
  return list.map((s) => maps[lang]?.[s] || s);
}

function useSpeech() {
  const [isSpeaking, setSpeaking] = useState(false);
  const utterRef = useRef(null);

  function start() {
    if (isSpeaking) return;
    const text = [
      'Top stories curated for speed and signal.',
      'AI summaries in your preferred language.',
      'Listen on the go with instant audio.',
    ].join(' ');
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  return { isSpeaking, start, stop };
}

export default function NewsFeed({ language }) {
  const tts = useSpeech();

  return (
    <div>
      <FreeHighlights language={language} tts={tts} />

      <div className="mt-12 grid gap-8">
        {Object.entries(premiumSources).map(([title, url]) => (
          <SectionFeed key={title} title={title} url={url} />
        ))}
      </div>

      <FoundersSection />
    </div>
  );
}
