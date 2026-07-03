function Sidebar({ role, activeSection, setActiveSection }) {
  const studentLinks = [
    'Home',
    'Recommendations',
    'Working',
    'Solved',
    'Liked',
    'Profile'
  ]

  const adminLinks = ['Home', 'My Problems', 'Create Problem', 'Profile']
  const links = role === 'student' ? studentLinks : adminLinks

  return (
    <div className="w-64 bg-gray-900 min-h-screen p-4 border-r border-gray-800">
      <div className="mb-6 text-sm uppercase tracking-widest text-green-300">Dashboard</div>

      {links.map((link) => (
        <button
          key={link}
          type="button"
          onClick={() => setActiveSection(link)}
          className={`mb-2 w-full text-left rounded-lg px-4 py-3 transition ${
            activeSection === link
              ? 'bg-green-500 text-black'
              : 'text-green-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          {link}
        </button>
      ))}
    </div>
  )
}

export default Sidebar;