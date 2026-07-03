
function Navbar({user , onLogout}){
    return(
        <nav className='flex justify-between justify-content items-center px-8 py-4 bg-gray-900 border-b border-green-500'>
            <h1 className="text-3xl font-bold text-green-500">
                ProblemHub
            </h1>


            {/* Right Side */}
            <div className="flex items-center gap-6">

                

                

                <button
                onClick={onLogout}
                className="text-red-400 hover:text-red-300"
                >
                Logout
                </button>

                <div className="flex items-center gap-2">

                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <span className="text-white">
                    {user?.name}
                </span>

                </div>

            </div>

        </nav>
    )
}

export default Navbar;