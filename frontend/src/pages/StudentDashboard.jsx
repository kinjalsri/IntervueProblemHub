import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function StudentDashboard({ user, handleLogout }) {
       return (
        <>
            <Navbar
                user={user}
                onLogout={handleLogout}
            />

            <div className="flex">

                <Sidebar role={user.role} />

                <div className="flex-1 p-6">

                    <h1>
                        Welcome {user.name}
                    </h1>

                    <h2>
                        Student Dashboard
                    </h2>

                </div>

            </div>
        </>
    );
}

export default StudentDashboard;