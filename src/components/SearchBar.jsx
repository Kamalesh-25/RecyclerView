export default function SearchBar({ value, onChange }) {
  return (
    <div className="glass search-bar">
      <input
        placeholder="Search movies..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
