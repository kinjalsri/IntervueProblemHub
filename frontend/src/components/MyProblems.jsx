import { useEffect, useState } from 'react'
import api from '../api/axios'
import ProblemCard from './ProblemCard'
import { handleError, handleSuccess } from '../util'

function MyProblems({ refreshKey, onViewProblem, onDeleteSuccess, onStartEdit }) {
  const [problems, setProblems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem('token')
        const response = await api.get('/problems/my-problems', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (Array.isArray(response.data)) {
          setProblems(response.data)
        } else {
          setError('Unexpected response from server.')
        }
      } catch (fetchError) {
        console.error(fetchError)
        setError('Could not load your problems. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProblems()
  }, [refreshKey])

  const handleDelete = async (problemId) => {
    const confirmed = window.confirm('Are you sure you want to delete this problem?')
    if (!confirmed) return

    try {
      const token = localStorage.getItem('token')
      await api.delete(`/problems/${problemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      handleSuccess('Problem deleted successfully')
      if (onDeleteSuccess) onDeleteSuccess()
    } catch (deleteError) {
      console.error(deleteError)
      handleError('Unable to delete the problem. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900 p-8 rounded shadow text-white">
        Loading your problems...
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900 text-white p-6 rounded shadow">
        {error}
      </div>
    )
  }

  return (
    <div className="bg-gray-900 p-8 rounded shadow min-h-screen">
      <h1 className="text-2xl text-green-500 mb-4">My Problems</h1>

      {problems.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded border border-gray-700 text-gray-300">
          No problems created yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              actionButtons={[
                {
                  label: 'View Details',
                  onClick: () => onViewProblem && onViewProblem(problem.id)
                },
                {
                  label: 'Edit',
                  onClick: () => onStartEdit && onStartEdit(problem),
                  className: 'rounded-full border border-green-500 bg-transparent px-5 py-2 text-green-300 transition hover:bg-gray-800'
                },
                {
                  label: 'Delete',
                  onClick: () => handleDelete(problem.id),
                  className: 'rounded-full border border-red-500 bg-red-500 px-5 py-2 text-black transition hover:bg-red-400'
                }
              ]}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProblems
