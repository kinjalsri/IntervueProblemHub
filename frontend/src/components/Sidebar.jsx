function Sidebar({role, setActiveSection})
{
   const studentLinks = [
    "Recommendations",
        "Working",
        "Solved",
        "Liked",
        "Profile"
   ]

   const adminLinks = [
      "My Problems",
      "Create Problem",
      "Profile"
   ]

   const links = role === "student"? studentLinks: adminLinks;

   return(
       <div className="w-64 bg-gray-900 min-h-screen p-4">

             {links.map((link) => (
                <div
                    key={link}
                    onClick={() =>
                        setActiveSection(link)
                    }
                    className="text-green-400 p-3 hover:bg-gray-800 rounded cursor-pointer"
                >
                    {link}
                </div>
            ))}

        </div>
   );
}

export default Sidebar;