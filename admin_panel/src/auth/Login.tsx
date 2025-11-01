import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import { ApiConfigs } from "../configs/ApiConfigs";
import { AuthenticationService } from "../services/AuthenticationService";
import { Api } from "../services/ApiService";
import dotenv from 'dotenv'

dotenv.config()

export default function Login() {
  const [loginForm, setLoginForm] = useState<any>({});
  const [error, setError] = useState<any>({});
  dotenv.config()
  let navigate = useNavigate();

  // ✅ Firebase config (fixed bucket name)
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "adminpanel-c7fc8.firebaseapp.com",
    projectId: "adminpanel-c7fc8",
    storageBucket: "adminpanel-c7fc8.appspot.com",
    messagingSenderId: "5738630187",
    appId: "1:5738630187:web:ea9c250204b48acbda2e6e",
    measurementId: "G-BYS0NS8NTM",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // ✅ Save user details to backend
  async function saveUserDetails() {
    if (await AuthenticationService.isAuthenticated()) {
      console.log("Saving user details...");
      const response = localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL);
      const parsedData = response ? JSON.parse(response) : null;

      if (parsedData && parsedData.userDetails) {
        try {
          await Api("save/credentials", parsedData.userDetails);
          
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

      const credential = { token, userDetails: user };
      localStorage.setItem(ApiConfigs.TOKEN_CREDENTIAL, JSON.stringify(credential));

      await saveUserDetails(); // save immediately after login
      navigate("/dashboard");
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
  );
}
