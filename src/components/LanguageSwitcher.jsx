const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ur', label: 'Urdu (Roman)' },
  { code: 'te', label: 'Telugu' },
  { code: 'ru', label: 'Russian' },
];

export default function LanguageSwitcher({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-2">
      <label className="text-sm text-zinc-400">Language</label>
      <select
        className="bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  );
}
