import { useEffect, useState } from 'react'
import { handleError, handleSuccess } from '../util'
import api from '../api/axios'

function CreateProblem({ editingProblem, onProblemCreated }) {
  const isEditMode = Boolean(editingProblem)
  const [problem, setProblem] = useState({
    title: '',
    description: '',
    company_name: '',
    is_anonymous: false,
    tag_ids: []
  })

  const [tags, setTags] = useState([])
  const [isLoadingTags, setIsLoadingTags] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingProblem) {
      setProblem({
        title: editingProblem.title || '',
        description: editingProblem.description || '',
        company_name: editingProblem.company_name || '',
        is_anonymous: editingProblem.is_anonymous || false,
        tag_ids: editingProblem.tag_ids || []
      })
    }
  }, [editingProblem])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const token = localStorage.getItem('token')
        const result = await api.get('/tags', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setTags(Array.isArray(result.data) ? result.data : [])
      } catch (fetchError) {
        console.error(fetchError)
        handleError('Unable to load tags. Please refresh the page.')
      } finally {
        setIsLoadingTags(false)
      }
    }

    fetchTags()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { title, description, company_name } = problem

    if (!title || !description || !company_name) {
      return handleError('All fields are required')
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('token')

      if (isEditMode && editingProblem?.id) {
        await api.put(
          `/problems/${editingProblem.id}`,
          {
            title: problem.title,
            description: problem.description,
            company_name: problem.company_name,
            is_anonymous: problem.is_anonymous
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        handleSuccess('Problem updated successfully')
      } else {
        await api.post('/problems', problem, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        handleSuccess('Problem created successfully')
      }

      setProblem({
        title: '',
        description: '',
        company_name: '',
        is_anonymous: false,
        tag_ids: []
      })

      if (onProblemCreated) {
        onProblemCreated()
      }
    } catch (submissionError) {
      console.error(submissionError)
      handleError('Unable to save problem. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setProblem({
      ...problem,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleTagClick = (tagId) => {
    const selectedTags = problem.tag_ids

    if (selectedTags.includes(tagId)) {
      setProblem({
        ...problem,
        tag_ids: selectedTags.filter((id) => id !== tagId)
      })
    } else {
      setProblem({
        ...problem,
        tag_ids: [...selectedTags, tagId]
      })
    }
  }

  return (
    <div className="flex-1 bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-green-500 mb-6">
            {isEditMode ? 'Edit Problem' : 'Create Problem'}
          </h1>

          {isEditMode && (
            <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
              Editing is limited to title, company, description, and visibility for now.
            </div>
          )}

          <input
            name="title"
            value={problem.title}
            placeholder="Problem Title"
            onChange={handleChange}
            className="w-full border border-gray-300 bg-white p-3 rounded-lg mb-5 outline-none focus:border-green-500"
          />

          <input
            name="company_name"
            value={problem.company_name}
            placeholder="Company Name"
            onChange={handleChange}
            className="w-full border border-gray-300 bg-white p-3 rounded-lg mb-5 outline-none focus:border-green-500"
          />

          <textarea
            name="description"
            value={problem.description}
            rows="8"
            placeholder="Problem Description..."
            onChange={handleChange}
            className="w-full border border-gray-300 bg-white p-3 rounded-lg mb-5 outline-none focus:border-green-500"
          />

          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              name="is_anonymous"
              checked={problem.is_anonymous}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-green-500"
            />
            <label className="text-gray-700">Post Anonymously</label>
          </div>

          {!isEditMode && (
            <div className="mt-6">
              <label className="block text-lg font-semibold mb-4">Tags</label>

              {isLoadingTags ? (
                <p className="text-gray-500">Loading tags...</p>
              ) : tags.length === 0 ? (
                <p className="text-gray-500">No tags available.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => {
                    const isSelected = problem.tag_ids.includes(tag.id)

                    return (
                      <button
                        type="button"
                        key={tag.id}
                        onClick={() => handleTagClick(tag.id)}
                        className={`px-4 py-2 rounded-full border transition ${
                          isSelected
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-green-100'
                        }`}
                      >
                        {tag.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 rounded-full bg-green-500 px-6 py-3 text-black font-semibold transition hover:bg-green-400 disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create Problem'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateProblem
