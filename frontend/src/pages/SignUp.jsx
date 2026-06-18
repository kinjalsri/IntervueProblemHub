import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import api from '../api/axios'
import { handleError, handleSuccess } from '../util'

function SignUp() {

  const [signUpInfo , setSignUpInfo] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  })

  const navigate = useNavigate();
  
  const handleChange = (e) => {

        const{name, value} = e.target; 
        console.log(name,value);
        setSignUpInfo({
          ...signUpInfo,
          [name]: value 
        })

  }

     const handleSignUp = async (e) => 
       {
         
         e.preventDefault(); 

         const {name, email, password, role} = signUpInfo; 
          if(!name || !email || !password|| !role){

            return handleError('All fields are required (name, email, password, role)'); 

          }

          try {
            

            const result = await api.post(
            '/auth/signup',
            signUpInfo
            
          );

          const {success, message} = result.data;

           if(success){
              handleSuccess(message);
            
            setTimeout(() => {
              navigate('/login');
            }, 1000);

            }


            
          } catch (error) {

           console.log(error.response?.data);

            const message =
              error.response?.data?.message ||
              error.message;

            handleError(message);
            
          }

          

          
       }
  


  return (
    <div className= "min-h-screen bg-black flex justify-center items-center">
       <form 
       onSubmit={handleSignUp}
       className="bg-gray-900 p-8 rounded-lg w-96">
            <h1 className="text-green-500 text-3xl font-bold mb-6 text-center">
                SignUp
            </h1>

            <div className="mb-4">
                <label
                htmlFor="name"
                className="block text-green-500 mb-2"
                >
                Name
                </label>

                <input
                onChange={handleChange}
                name= "name"
                type="text"
                placeholder="Enter Your Name..."
                autoFocus
                className="w-full p-3 rounded bg-black text-white border border-green-500"
                />
            </div>

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

            <div className="mb-4">
               <label
                  htmlFor="role"
                  className="block text-green-500 mb-2">
                  Role
              </label>
                    <select
                      name="role"
                      onChange={handleChange}
                      className="w-full p-3 rounded bg-black text-white border border-green-500">
                      <option value="">
                          Select Role
                      </option>

                      <option value="student">
                          Student
                      </option>

                      <option value="admin">
                          Company Admin
                      </option>
                </select>
            </div>

                <div className="flex justify-center">
                    <button type="submit" className="w-32 bg-green-500 text-black p-3 rounded font-semibold hover:bg-green-400 transition">
                    SignUp
                    </button>
                </div>



                <span className='text-center w-32 text-green-600'
                > Already have an have an account?
          <Link to= '/login'> Login.. </Link>
                </span>


        </form>

        
    </div>
  )
}

export default SignUp
