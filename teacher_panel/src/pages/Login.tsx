import { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Api } from "../services/ApiService";
import { toast } from "react-toastify";
import LoginSpinner from "../component/LoginSpinner";
import { ApiConfigs } from "../Configs/ApiConfigs";
import { useNavigate } from "react-router";


export default function TeacherLogin() {
  const [loginForm, setLoginForm] = useState({
    
    username: "",
    subject: "", 
    password: "",
  });

  const [error, setError] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [subject, setSubject] = useState<any[]>([]);
  let navigate = useNavigate();

  async function fetchTitles() {
    try {
      setLoadingSubject(true);

      const response = await Api("course/searchTitles");
      console.log(response.data);
      if (response.status === 200) {
        setSubject(response.data);
      }
    } catch (err) {
      console.error("Error fetching titles:", err);
      toast.error("Failed to load course titles");
    } finally {
      setLoadingSubject(false);
    }
  }

  const handleLogin = async () => {
    let newErrors: any = {};

    if (!loginForm.username) newErrors.username = "Username is required";
    if (!loginForm.password) newErrors.password = "Password is required";
    if (!loginForm.subject) newErrors.subject = "Subject is required";
    if (Object.keys(newErrors).length > 0) {
      // Update all errors once
      setError(newErrors);
    } else {
      try {
        setLoading(true);
        console.log(loginForm);
        let response = await Api("login", loginForm);
        console.log(response);
        if (response.status == 200) {
         
           
            let token=response.token
            let userId={userId:response.data._id}
          
          localStorage.setItem(
            ApiConfigs.TOKEN_CREDENTIAL,
            token
          );

          localStorage.setItem(ApiConfigs.TEACHER_ID,JSON.stringify(userId))
          toast.success("login successful");

          navigate("/dashboard");
        } else {
          toast.error("invalid credentials");
        }
      } catch (error) {
        toast.error("login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setError({});
  }, [loginForm]);
  useEffect(() => {
    fetchTitles();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="bg-white shadow-lg rounded-2xl w-[420px] p-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="bg-blue-900 text-white p-3 rounded-xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6l-8 4 8 4 8-4-8-4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 10v4l8 4 8-4v-4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Panel</h1>
          <p className="text-gray-600 text-sm mt-2 mb-6 text-center">
            Sign in to access your teaching dashboard
          </p>
        </div>

        {/* Username */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Username
          </label>

          <div
            className={`flex items-center border rounded-lg p-2 transition-all duration-200 ${
              error.username
                ? "border-red-400"
                : "border-gray-300 focus-within:border-blue-500"
            }`}
          >
            <span className="px-2 text-gray-500">
              <FaUser />
            </span>
            <input
              type="text"
              onChange={(e) =>
                setLoginForm({ ...loginForm, username: e.target.value })
              }
              placeholder="Enter your username"
              className="w-full p-2 outline-none text-gray-700 rounded-md placeholder-gray-400"
            />
          </div>

          {error.username && (
            <p className="text-xs text-red-500 mt-1 ml-1">{error.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Password
          </label>

          <div
            className={`flex items-center border rounded-lg p-2 transition-all duration-200 ${
              error.password
                ? "border-red-400"
                : "border-gray-300 focus-within:border-blue-500"
            }`}
          >
            <span className="px-2 text-gray-500">
              <FaLock />
            </span>
            <input
              type="password"
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              placeholder="Enter your password"
              className="w-full p-2 outline-none text-gray-700 rounded-md placeholder-gray-400"
            />
          </div>

          {error.password && (
            <p className="text-xs text-red-500 mt-1 ml-1">{error.password}</p>
          )}
        </div>

        {/* Subject */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-800">Subject</label>
          <select
            onChange={(e) =>
              setLoginForm({
                ...loginForm,
                subject: e.target.value,
              })
            }
            value={loginForm.subject}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 mt-1 outline-none"
          >
            <option value="">Select Subject</option>
            {subject.map((course: string, index: number) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>

          <span className="text-sm text-red-400">{error.subject}</span>
        </div>

        {/* Sign In Button */}
        <button
          onClick={() => {
            handleLogin();
          }}
          className="w-full bg-blue-900 text-white py-2.5 rounded-lg hover:bg-blue-800 transition"
        >
          {loading ? <LoginSpinner /> : " Sign In"}
        </button>

        {/* Footer Links */}
        <div className="flex justify-between text-sm text-blue-900 mt-3">
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
          <a href="#" className="hover:underline">
            Need Help?
          </a>
        </div>
      </div>
    </div>
  );
}
