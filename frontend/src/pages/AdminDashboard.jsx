import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import SearchBar from '../components/SearchBar'
import StatsCard from '../components/StatsCard'
import ProblemCard from '../components/ProblemCard'
import ProblemDetails from '../components/ProblemDetails'
import MyProblems from '../components/MyProblems'
import CreateProblem from '../components/CreateProblem'
import api from '../api/axios'

function AdminDashboard({ user, handleLogout }) {
  const [activeSection, setActiveSection] = useState('Home')
  const [allProblems, setAllProblems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProblemId, setSelectedProblemId] = useState(null)
  const [returnSection, setReturnSection] = useState('My Problems')
  const [refreshKey, setRefreshKey] = useState(0)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState(null)
  const [stats, setStats] = useState({ total: 0, anonymous: 0, public: 0 })
  const [editingProblem, setEditingProblem] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      setDashboardLoading(true)
      setDashboardError(null)

      try {
        const token = localStorage.getItem('token')
        const response = await api.get('/problems', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const problems = Array.isArray(response.data) ? response.data : []
        setAllProblems(problems)

        const anonymousCount = problems.filter((problem) => problem.is_anonymous).length
        const publicCount = problems.length - anonymousCount

        setStats({
          total: problems.length,
          anonymous: anonymousCount,
          public: publicCount
        })
      } catch (err) {
        console.error(err)
        setDashboardError('Unable to load dashboard information.')
      } finally {
        setDashboardLoading(false)
      }
    }

    fetchDashboard()
  }, [refreshKey])

  const handleProblemCreated = () => {
    setRefreshKey((prev) => prev + 1)
    setActiveSection('My Problems')
  }

  const handleDeleteSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const filteredRecentProblems = allProblems
    .filter((problem) => {
      if (!searchQuery) return true
      const search = searchQuery.toLowerCase()
      return (
        problem.title.toLowerCase().includes(search) ||
        problem.company_name?.toLowerCase().includes(search) ||
        problem.description?.toLowerCase().includes(search)
      )
    })
    .slice(0, 5)

  const renderHome = () => {
    return (
      <div className="p-8">
        <div className="mb-8 rounded-3xl bg-gray-900 p-8 shadow-lg text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-green-300">Welcome back</p>
              <h1 className="mt-3 text-4xl font-bold text-white">Hello, {user.name}</h1>
              <p className="mt-2 text-gray-400">This is your admin overview. Manage your problems and track the latest activity.</p>
            </div>

            <button
              type="button"
              onClick={() => setActiveSection('Create Problem')}
              className="rounded-full bg-green-500 px-6 py-3 text-black transition hover:bg-green-400"
            >
              Create Problem
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatsCard title="Total Problems" value={stats.total} description="All problems in the system" />
            <StatsCard title="Anonymous Problems" value={stats.anonymous} description="Problems without author attribution" />
            <StatsCard title="Public Problems" value={stats.public} description="Visible issues for students" />
          </div>
        </div>

        <div className="mb-8 rounded-3xl bg-gray-900 p-8 shadow-lg text-white">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Recently Created Problems</h2>
              <p className="text-gray-400">Latest content from the platform.</p>
            </div>
            <div className="w-full sm:w-96">
              <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search recent problems..." />
            </div>
          </div>

          {dashboardLoading ? (
            <p className="text-gray-300">Loading recent problems...</p>
          ) : dashboardError ? (
            <p className="text-red-400">{dashboardError}</p>
          ) : filteredRecentProblems.length === 0 ? (
            <p className="text-gray-300">No recent problems found.</p>
          ) : (
            <div className="grid gap-4">
              {filteredRecentProblems.map((problem) => (
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
      </div>
    )
  }

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

          {activeSection === 'My Problems' && (
            <MyProblems
              refreshKey={refreshKey}
              onViewProblem={(id) => {
                setReturnSection('My Problems')
                setSelectedProblemId(id)
                setActiveSection('Problem Details')
              }}
              onDeleteSuccess={handleDeleteSuccess}
              onStartEdit={(problem) => {
                setEditingProblem(problem)
                setActiveSection('Create Problem')
              }}
            />
          )}

          {activeSection === 'Create Problem' && (
            <CreateProblem
              editingProblem={editingProblem}
              onProblemCreated={() => {
                setEditingProblem(null)
                handleProblemCreated()
              }}
            />
          )}

          {activeSection === 'Problem Details' && selectedProblemId && (
            <div className="p-8">
              <ProblemDetails
                problemId={selectedProblemId}
                role="admin"
                onClose={() => setActiveSection(returnSection)}
              />
            </div>
          )}

          {activeSection === 'Profile' && renderProfile()}
        </div>
      </div>
    </>
  )
}

export default AdminDashboard;