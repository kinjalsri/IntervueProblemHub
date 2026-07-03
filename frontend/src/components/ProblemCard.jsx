function ProblemCard({ problem, actionButtons = [] }) {
  const formattedDate = problem.created_at
    ? new Date(problem.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Unknown date'

  const shortDescription = problem.description
    ? problem.description.length > 140
      ? `${problem.description.slice(0, 140)}...`
      : problem.description
    : 'No description provided.'

  return (
    <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-black">
              {problem.is_anonymous ? 'Anonymous' : 'Public'}
            </span>
            <span className="text-sm text-gray-400">{formattedDate}</span>
          </div>
          <h3 className="text-2xl font-semibold text-white">{problem.title}</h3>
          <p className="mt-2 text-sm text-gray-300">{problem.company_name || 'Unknown company'}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.isArray(problem.tags) &&
            problem.tags.map((tag) => (
              <span key={tag.id} className="rounded-full bg-white/10 px-3 py-1 text-sm text-gray-200">
                {tag.name}
              </span>
            ))}
        </div>
      </div>

      <p className="mt-5 text-gray-200 leading-relaxed">{shortDescription}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {actionButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={button.onClick}
            className={button.className || 'rounded-full bg-green-500 px-5 py-2 text-black transition hover:bg-green-400'}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProblemCard
