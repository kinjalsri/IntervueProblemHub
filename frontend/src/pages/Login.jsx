import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import api from '../api/axios'
import { handleError, handleSuccess } from '../util'
import Dashboard from './Dashboard'



function Login() {
   
   
     const [loginInfo, setLoginInfo] = useState(
        {
            email : '',
            password: ''
        }
     );
     
    const navigate = useNavigate();
        
     const handleChange = (e) => {
        const {name, value}= e.target;
       // console.log(name , value);

        setLoginInfo({
            ...loginInfo,
            [name]: value
        })
        
      }



      const handleLogin = async (e) => {
          e.preventDefault();
            const { email, password } = loginInfo;
            

            if (!email || !password) {
                return handleError('All fields are required (email, password)')
            }
          
          try {
            const response = await api.post(
                '/auth/login', 
                loginInfo
            );

            //console.log(response.data);

             const {token, name, success, message } = response.data;


            if(success){

                handleSuccess("Login Successful");
               
                localStorage.setItem('token', token);
                localStorage.setItem('loggedInUser', name);
                console.log("loggin..")
               setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);

               
            }

            

            
          } catch (error) {

                const message = error.response?.data?.message || error.message || "Something went wrong";

                handleError(message);
             
          }


      }




  return (
    <div className= "min-h-screen bg-black flex flex-col justify-center items-center">
            <h1 className="text-green-500 text-5xl font-bold mb-6 text-center">
         Problem Hub</h1>
       <form 
       onSubmit={handleLogin}
       className="bg-gray-900 p-8 rounded-lg w-96">
            <h1 className="text-green-500 text-3xl font-bold mb-6 text-center">
                Login
            </h1>

            <div className="mb-4">
                <label
                htmlFor="email"
                className="block text-green-500 mb-2"
                >
                Email
                </label>

                <input
                onChange={handleChange}
                name= "email"
                type="email"
                placeholder="Enter Email..."
                autoFocus
                className="w-full p-3 rounded bg-black text-white border border-green-500"
                />
            </div>

            <div className="mb-6">
                <label
                htmlFor="password"
                className="block text-green-500 mb-2"
                >
                Password
                </label>

                <input
                onChange={handleChange}
                name="password"
                type="password"
                placeholder="Enter Password..."
                className="w-full p-3 rounded bg-black text-white border border-green-500"
                />
            </div>

                <div className="flex justify-center">
                    <button type="submit" className="w-32 bg-green-500 text-black p-3 rounded font-semibold hover:bg-green-400 transition">
                    Login
                    </button>
                </div>

                <span className='text-center w-32 text-green-600'
                > Don't have an have an account?
          <Link to= '/signup'> SignUp.. </Link>
                </span>


        </form>

        
    </div>
  )
}

export default Login
