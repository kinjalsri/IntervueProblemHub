import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import MyProblems from "../components/MyProblems";
import CreateProblem from "../components/CreateProblem";

function AdminDashboard({ user, handleLogout}) {

    const [activeSection, setActiveSection] = useState('My problems')

    return (
        <>
            <Navbar
                user={user}
                onLogout={handleLogout}
            />

            <div className="flex">

                <Sidebar role={user.role}
                 activeSection = {activeSection}
                 setActiveSection={setActiveSection} />

                <div className="flex-1">

                {activeSection === "My Problems" &&
                    <MyProblems />}

                {activeSection === "Create Problem" &&
                    <CreateProblem />}

                </div>

            </div>
        </>
    );
}

export default AdminDashboard;