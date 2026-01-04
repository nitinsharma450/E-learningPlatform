import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { ApiConfigs } from "../Configs/ApiConfigs";
import Logout from "../components/Logout";
import { AuthenticationService } from "../Service/AuthencationService";
import { Api } from "../Service/ApiService";

export default function Header() {
  const [userId, setUserId] = useState<string>("");
  const [userProfile, setUserProfile] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchProfile() {
    setLoading(true);
    try {
      if (await AuthenticationService.isAuthenticated()) {
        const raw = localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL);
        const parsed = raw ? JSON.parse(raw) : null;

        const response = await Api("profile/search", {
          email: parsed?.userDetails?.email,
        });

        if (response?.data) {
          setUserProfile(response.data);
          setUserId(response.data.userId || response.data._id);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
    setLoading(false);
  }
  useEffect(()=>{
    fetchProfile()
  },[])
  return (
    <div className="flex justify-between items-center px-10 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <img
          src="https://media.geeksforgeeks.org/wp-content/uploads/20210101201641/GeeksforGeeks.png"
          alt="Logo"
          className="w-36"
        />
      </div>
      <nav className="flex items-center gap-8 text-gray-700 font-medium">
        <a href="#" className="hover:text-green-600 transition">
          Courses
        </a>
        <a href="#" className="hover:text-green-600 transition">
          Tutorials
        </a>
        <a href="#" className="hover:text-green-600 transition">
          Practice
        </a>
    

<NavLink
  to="/"
  className={`cursor-pointer ${
    location.pathname === "/" ? "text-red-400 font-bold" : ""
  }`}
>
  Home
</NavLink>

{localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL) && (
  <NavLink
    to="/enrolledCourse"
    className={`cursor-pointer ${
      location.pathname === "/enrolledCourse"
        ? "text-red-400 font-bold"
        : ""
    }`}
  >
    Enrolled Courses
  </NavLink>
)}

        
      </nav>

      {localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL) ? (
        <div
          onClick={() => Logout(userId)}
          className="bg-gray-900 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Logout
        </div>
      ) : (
        <NavLink
          to={"/login"}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Sign In
        </NavLink>
      )}
    </div>
  );
}
