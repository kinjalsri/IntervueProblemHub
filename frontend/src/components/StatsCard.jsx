function StatsCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 text-white shadow-sm">
      <p className="text-sm uppercase tracking-widest text-green-300">{title}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
      {description && <p className="mt-2 text-sm text-gray-400">{description}</p>}
    </div>
  )
}

export default StatsCard
