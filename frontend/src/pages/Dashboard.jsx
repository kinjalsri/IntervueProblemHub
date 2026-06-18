import {useEffect, useState} from 'react'

import api from '../api/axios';
import StudentDashboard from '../pages/StudentDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import { handleSuccess, handleError } from '../util';
import { useNavigate } from 'react-router-dom';




function Dashboard() {

    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {

      const fetchUser = async () =>
      {
        try {
          const token = localStorage.getItem('token');
          
          const response = await api.get('/user/me', 
            {
                headers : {
                    Authorization: `Bearer ${token}`
                }
            }
          );

          //console.log(response.data);
          setUser(response.data);
        } catch (error) {
           console.log(error); 
           handleError(error);
        }
      }
      fetchUser();
      }, []);

      const handleLogout = () => {

     localStorage.removeItem('token');
     localStorage.removeItem('loggedInUser');

     handleSuccess('Logged Out Successfully');

    setTimeout(() => {
        navigate('/login');
    });
};


      
if (!user) {
    return <h1>Loading...</h1>;
}

if (user.role === 'student') {
    return <StudentDashboard 
    user={user}
    handleLogout= {handleLogout}
     />;
}

return <AdminDashboard 
       user={user} 
       handleLogout= {handleLogout}
       />;
}

export default Dashboard
