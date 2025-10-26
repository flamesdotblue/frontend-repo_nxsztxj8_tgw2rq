const LANG_LABELS = {
  en: 'English',
  hi: 'हिंदी',
  ur: 'اردو',
  te: 'తెలుగు',
  ru: 'Roman Urdu',
}

export default function LanguageSwitcher({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-2">
      <label className="text-sm text-gray-200">Language</label>
      <select
        aria-label="Select language"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-black text-gray-100 border border-yellow-500/40 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      >
        {Object.entries(LANG_LABELS).map(([code, label]) => (
          <option value={code} key={code} className="text-black">{label}</option>
        ))}
      </select>
    </div>
  )
}
