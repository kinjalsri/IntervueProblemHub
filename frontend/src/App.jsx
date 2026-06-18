import {Navigate, Routes, Route} from 'react-router-dom'
import {useState} from 'react'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import { ToastContainer } from 'react-toastify'
import RefreshHandler from '../RefreshHandler';

function App() {

   const [isAuthenticted, setIsAuthenticated] = useState(false); 
  const PrivateRoute = ({children}) => {
    return isAuthenticted? children: <Navigate to= "/login"/>
  }

  return (
    <>
      <div>
      <RefreshHandler setIsAuthenticated= {setIsAuthenticated}/>
      <Routes>
        <Route path ='/' element = {<Navigate to= "/login"/>}/>
        <Route path ='/login' element ={<Login/>} />
        <Route path ='/signup' element ={<SignUp/>} />
        <Route path ='/dashboard' element={
                          <PrivateRoute>
                              <Dashboard />
                          </PrivateRoute>} />
      </Routes>
      <ToastContainer />
    </div>
      
    </>
  )
}

export default App
