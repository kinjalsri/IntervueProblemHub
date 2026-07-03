function SearchBar({ value, onChange, placeholder = 'Search problems...' }) {
  return (
    <div className="mb-6">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
      />
    </div>
  )
}

export default SearchBar
