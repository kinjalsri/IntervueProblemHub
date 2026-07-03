import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import SearchBar from '../components/SearchBar'
import ProblemCard from '../components/ProblemCard'
import ProblemDetails from '../components/ProblemDetails'
import api from '../api/axios'

function StudentDashboard({ user, handleLogout }) {
  const [activeSection, setActiveSection] = useState('Home')
  const [recentProblems, setRecentProblems] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [workingProblems, setWorkingProblems] = useState([])
  const [solvedProblems, setSolvedProblems] = useState([])
  const [likedProblems, setLikedProblems] = useState([])
  const [tags, setTags] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProblemId, setSelectedProblemId] = useState(null)
  const [returnSection, setReturnSection] = useState('Home')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudentData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem('token')
        const [allResponse, recResponse, tagResponse] = await Promise.all([
          api.get('/problems', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/user/recommendations', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/tags', { headers: { Authorization: `Bearer ${token}` } })
        ])

        setRecentProblems(Array.isArray(allResponse.data) ? allResponse.data.slice(0, 8) : [])
        setRecommendations(Array.isArray(recResponse.data) ? recResponse.data : [])
        setTags(Array.isArray(tagResponse.data) ? tagResponse.data : [])
      } catch (err) {
        console.error(err)
        setError('Unable to load student data.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentData()
  }, [])

  useEffect(() => {
    if (activeSection === 'Working') {
      fetchStatusList('/user/working-problems', setWorkingProblems)
    }
    if (activeSection === 'Solved') {
      fetchStatusList('/user/solved-problems', setSolvedProblems)
    }
    if (activeSection === 'Liked') {
      fetchStatusList('/user/liked-problems', setLikedProblems)
    }
  }, [activeSection])

  const fetchStatusList = async (endpoint, setter) => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setter(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error(err)
      setter([])
    }
  }

  const filteredRecent = recentProblems.filter((problem) => {
    if (!searchQuery) return true
    const search = searchQuery.toLowerCase()
    return (
      problem.title.toLowerCase().includes(search) ||
      problem.company_name?.toLowerCase().includes(search) ||
      problem.description?.toLowerCase().includes(search)
    )
  })

  const filteredRecommendations = recommendations.filter((problem) => {
    if (!searchQuery) return true
    const search = searchQuery.toLowerCase()
    return (
      problem.title.toLowerCase().includes(search) ||
      problem.company_name?.toLowerCase().includes(search) ||
      problem.description?.toLowerCase().includes(search)
    )
  })

  const renderHome = () => (
    <div className="p-8">
      <div className="rounded-3xl bg-gray-900 p-8 shadow-lg text-white mb-8">
        <p className="text-sm uppercase tracking-widest text-green-300">Welcome back</p>
        <h1 className="mt-3 text-4xl font-bold text-white">Hey, {user.name}</h1>
        <p className="mt-2 text-gray-400">Your student landing page with recommended problems and recent practice opportunities.</p>
      </div>

      <div className="grid gap-8">
        <div className="rounded-3xl bg-gray-900 p-8 shadow-lg text-white">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Recommended Problems</h2>
              <p className="text-gray-400">Problems selected for your interests.</p>
            </div>
            <div className="w-full sm:w-96">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search recommendations..." />
            </div>
          </div>

          {isLoading ? (
            <p className="text-gray-300">Loading recommendations...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : filteredRecommendations.length === 0 ? (
            <p className="text-gray-300">No recommendations found.</p>
          ) : (
            <div className="grid gap-4">
              {filteredRecommendations.slice(0, 4).map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  actionButtons={[
                    {
                      label: 'View Details',
                      onClick: () => {
                        setReturnSection('Home')
                        setSelectedProblemId(problem.id)
                        setActiveSection('Problem Details')
                      }
                    }
                  ]}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-gray-900 p-8 shadow-lg text-white">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Latest Problems</h2>
              <p className="text-gray-400">Recent practice problems from the platform.</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-gray-300">Loading latest problems...</p>
          ) : filteredRecent.length === 0 ? (
            <p className="text-gray-300">No problems found.</p>
          ) : (
            <div className="grid gap-4">
              {filteredRecent.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  actionButtons={[
                    {
                      label: 'View Details',
                      onClick: () => {
                        setReturnSection('Home')
                        setSelectedProblemId(problem.id)
                        setActiveSection('Problem Details')
                      }
                    }
                  ]}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-gray-900 p-8 shadow-lg text-white">
          <h2 className="text-2xl font-semibold mb-4">Popular Tags</h2>
          {tags.length === 0 ? (
            <p className="text-gray-300">No tags available.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {tags.slice(0, 12).map((tag) => (
                <span key={tag.id} className="rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-black">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderSectionList = (items, title, emptyMessage) => (
    <div className="p-8">
      <div className="rounded-3xl bg-gray-900 p-8 shadow-lg text-white">
        <h1 className="text-3xl font-bold text-green-500 mb-4">{title}</h1>
        {items.length === 0 ? (
          <p className="text-gray-300">{emptyMessage}</p>
        ) : (
          <div className="grid gap-4">
            {items.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                actionButtons={[
                  {
                    label: 'View Details',
                    onClick: () => {
                      setReturnSection(activeSection)
                      setSelectedProblemId(problem.id)
                      setActiveSection('Problem Details')
                    }
                  }
                ]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="p-8">
      <div className="rounded-3xl bg-gray-900 p-8 shadow-lg text-white">
        <h1 className="text-3xl font-bold text-green-500 mb-4">Profile</h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-gray-800 p-6">
            <p className="text-sm text-gray-400">Name</p>
            <p className="mt-2 text-lg font-semibold">{user.name}</p>
          </div>
          <div className="rounded-2xl bg-gray-800 p-6">
            <p className="text-sm text-gray-400">Role</p>
            <p className="mt-2 text-lg font-semibold capitalize">{user.role}</p>
          </div>
          <div className="rounded-2xl bg-gray-800 p-6">
            <p className="text-sm text-gray-400">Email</p>
            <p className="mt-2 text-lg font-semibold">{user.email || 'Not available'}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar role={user.role} activeSection={activeSection} setActiveSection={setActiveSection} />

        <div className="flex-1 bg-gray-100 min-h-screen">
          {activeSection === 'Home' && renderHome()}
          {activeSection === 'Recommendations' && renderSectionList(recommendations, 'Recommendations', 'No recommended problems available.')}
          {activeSection === 'Working' && renderSectionList(workingProblems, 'Working Problems', 'No working problems yet.')}
          {activeSection === 'Solved' && renderSectionList(solvedProblems, 'Solved Problems', 'No solved problems yet.')}
          {activeSection === 'Liked' && renderSectionList(likedProblems, 'Liked Problems', 'No liked problems yet.')}
          {activeSection === 'Profile' && renderProfile()}
          {activeSection === 'Problem Details' && selectedProblemId && (
            <div className="p-8">
              <ProblemDetails
                problemId={selectedProblemId}
                role="student"
                onClose={() => setActiveSection(returnSection)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default StudentDashboard;