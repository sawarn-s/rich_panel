import { useRef } from "react";
import { auth } from "../firebase";
import {signInWithEmailAndPassword} from 'firebase/auth'
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    const goToHome = () => navigate('/home');
    const goToRegister = () => navigate('/register');
    const login = (e) =>{
        e.preventDefault();
        signInWithEmailAndPassword(
            auth,
           emailRef.current.value,
           passwordRef.current.value
        ).then((authUser)=>{
            goToHome();
          
        }).catch((error) =>{
         alert(error.message);
        })
 }


    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-2/6 p-6 m-auto bg-white rounded-md shadow-xl shadow-black-600/40  lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-black">
                   Login to your account
                </h1>
                <form className="mt-6">
                    <div className="mb-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            ref={emailRef}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            className="block w-full px-4 py-2 mt-2 text-gray-600 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            ref={passwordRef}
                        />
                    </div>
                    
                    <div className="mt-6">
                        <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        onClick={login}>
                            Login
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-xs font-light text-center text-gray-700">
                    {" "}
                    New to myApp? <span>
                    
                        <Link to="register" replace>
                          Sign up
                        </Link>
                   

                    </span>
                </p>
            </div>
        </div>
    );
}




export default Login