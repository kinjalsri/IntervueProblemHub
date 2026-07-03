import { useEffect, useState } from 'react'
import api from '../api/axios'
import { handleError, handleSuccess } from '../util'

function ProblemDetails({ problemId, onClose, role, onStatusUpdated }) {
  const [problem, setProblem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    if (!problemId) {
      return
    }

    const fetchProblem = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem('token')
        const response = await api.get(`/problems/${problemId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setProblem(response.data)
      } catch (fetchError) {
        console.error(fetchError)
        setError('Unable to load problem details.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProblem()
  }, [problemId])

  const handleStatusChange = async (status) => {
    setIsUpdatingStatus(true)

    try {
      const token = localStorage.getItem('token')
      await api.post(
        `/problems/${problemId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      handleSuccess(`Marked as ${status}`)
      if (onStatusUpdated) {
        onStatusUpdated()
      }
    } catch (statusError) {
      console.error(statusError)
      handleError('Unable to update problem status. Please try again.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const formatDate = (value) => {
    if (!value) return 'Unknown'
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-gray-800 p-8 text-white shadow">
        Loading details...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-900 p-8 text-white shadow">
        {error}
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-gray-800 p-8 shadow-lg text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-green-300">Problem Details</p>
          <h2 className="text-3xl font-bold text-white">{problem.title}</h2>
          <p className="text-sm text-gray-400">Created on {formatDate(problem.created_at)}</p>
        </div>

        <button
          onClick={onClose}
          className="rounded-full border border-green-500 bg-green-500 px-5 py-2 text-black transition hover:bg-green-400"
        >
          Back
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <div className="rounded-2xl bg-gray-900 p-6">
          <p className="text-sm text-gray-400">Company</p>
          <p className="mt-2 text-lg font-semibold text-white">{problem.company_name || 'Not specified'}</p>
        </div>

        <div className="rounded-2xl bg-gray-900 p-6">
          <p className="text-sm text-gray-400">Visibility</p>
          <span className="mt-2 inline-flex rounded-full bg-green-500 px-3 py-1 text-sm font-semibold text-black">
            {problem.is_anonymous ? 'Anonymous' : 'Public'}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">Tags</p>
        {Array.isArray(problem.tags) && problem.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <span key={tag.id} className="rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-black">
                {tag.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No tags available.</p>
        )}
      </div>

      <div className="rounded-2xl bg-gray-900 p-6 mb-6">
        <p className="text-sm text-gray-400 mb-2">Description</p>
        <p className="whitespace-pre-line text-gray-100">{problem.description}</p>
      </div>

      {role === 'student' && (
        <div className="flex flex-wrap gap-3">
          <button
            disabled={isUpdatingStatus}
            onClick={() => handleStatusChange('liked')}
            className="rounded-full bg-green-500 px-5 py-3 text-black transition hover:bg-green-400 disabled:opacity-60"
          >
            Like
          </button>
          <button
            disabled={isUpdatingStatus}
            onClick={() => handleStatusChange('working')}
            className="rounded-full border border-green-500 bg-transparent px-5 py-3 text-white transition hover:bg-gray-700 disabled:opacity-60"
          >
            Mark Working
          </button>
          <button
            disabled={isUpdatingStatus}
            onClick={() => handleStatusChange('solved')}
            className="rounded-full bg-white px-5 py-3 text-gray-900 transition hover:bg-gray-100 disabled:opacity-60"
          >
            Mark Solved
          </button>
        </div>
      )}
    </div>
  )
}

export default ProblemDetails
