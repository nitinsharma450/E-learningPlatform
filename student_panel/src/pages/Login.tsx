import  { useEffect, useState } from 'react'
import { initializeApp } from "firebase/app";

import { useNavigate } from 'react-router';
import { AuthenticationService } from '../Service/AuthencationService';
import { ApiConfigs } from '../Configs/ApiConfigs';
import { Api } from '../Service/ApiService';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';


export default function Login() {

     const [loginForm, setLoginForm] = useState<any>({});
  const [error, setError] = useState<any>({});
  let navigate = useNavigate();

  const socket = io("http://localhost:3333");


   // Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_Bua2_e2ApFClFgJJziTsOXVfhj5NI1M",
  authDomain: "studentpanel-90479.firebaseapp.com",
  projectId: "studentpanel-90479",
  storageBucket: "studentpanel-90479.firebasestorage.app",
  messagingSenderId: "485025116558",
  appId: "1:485025116558:web:2e30e70b35d7c5b2fd74df",
  measurementId: "G-Y25BXSFJR9"
};

// Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();


  async function saveUserDetails() {
    if (await AuthenticationService.isAuthenticated()) {
      console.log("Saving user details...");
      const response = localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL);
      const parsedData = response ? JSON.parse(response) : null;

      if (parsedData && parsedData.userDetails) {
        try {
          let response=await Api("save/credentials", parsedData.userDetails);
          return response;
          
        } catch (err) {
          console.error("Error saving user details:", err);
        }
      }
    }
  }

  // ✅ Google login handler
  async function handleGoogleLogin() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      const student_credential = { token, userDetails: user };
      localStorage.setItem(ApiConfigs.TOKEN_CREDENTIAL, JSON.stringify(student_credential));

      let response=await saveUserDetails(); 
      if(response.status==200){
        socket.emit("onlineUser",user.uid)
    toast.success('Login Successful');
      navigate("/");
      }
      else{
        toast.error('Login Failed. Please try again.');
      }
     
    } catch (err) {
      console.error("Google login error:", err);
    }
  }

  // ✅ Manual email/password validation
  function handleLogin() {
    const tempError:{email?:String,password?:String} = {};

    if (!loginForm.email) {
      tempError.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      tempError.email = "Enter a valid email address";
    }

    if (!loginForm.password) {
      tempError.password = "Password is required";
    } else if (loginForm.password.length < 6) {
      tempError.password = "Password must be at least 6 characters";
    }

    setError(tempError);

    if (Object.keys(tempError).length === 0) {
      console.log("Login successful", loginForm);
      // TODO: Call backend login API here for manual auth
    }
  }

  // ✅ Clear validation errors when form changes
  useEffect(() => {
    setError({});
  }, [loginForm]);

  // ✅ On mount, check and save user details if already logged in
  useEffect(() => {
    const response = localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL);
    if (response) {
      saveUserDetails();
    }
  }, []);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[400px] p-10 rounded-xl shadow-lg">
        <h2 className="text-2xl p-5 font-semibold text-center mb-2">Log in</h2>

        {/* ✅ Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border cursor-pointer rounded-md p-2 flex items-center justify-center gap-2 mb-3 hover:bg-gray-100"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-1" />
          <span className="px-2 text-gray-400 text-sm">or</span>
          <hr className="flex-1" />
        </div>

        {/* ✅ Manual Login Form */}
        <div className="space-y-3 m-3">
          <div>
            <input
              type="email"
              placeholder="Username or Email"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
            <span className="text-red-400 text-sm">{error.email}</span>
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            <span className="text-red-400 text-sm">{error.password}</span>
          </div>

          <div className="flex justify-between text-sm p-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-green-600" /> Remember Me
            </label>
            <a href="/forgot" className="text-blue-500">
              Forgot password
            </a>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-green-600 cursor-pointer text-white py-2 rounded-md hover:bg-green-700"
          >
            Sign In
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By creating this account, you agree to our{" "}
          <a href="/privacy" className="text-blue-500">
            Privacy Policy
          </a>{" "}
          &{" "}
          <a href="/cookies" className="text-blue-500">
            Cookie Policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}
