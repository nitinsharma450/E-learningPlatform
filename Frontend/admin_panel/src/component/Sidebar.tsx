import { useLocation, useNavigate } from "react-router";
import { RxDashboard } from "react-icons/rx";
import { NavLink } from "react-router";
import { PiStudentFill } from "react-icons/pi";

import { GiTeacher } from "react-icons/gi";
import { IoMdLogOut } from "react-icons/io";
import logout from "./Logout";
import { FaBook } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navigate=useNavigate()

  return (
    <div className=" flex flex-col w-64 h-screen bg-white shadow-lg p-5">
      <h1 className="text-2xl font-bold mb-6">E-Learning</h1>

      <NavLink
        to="/dashboard"
        className={`flex items-center gap-3 p-3 rounded-lg font-medium ${
          location.pathname === "/dashboard"
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <RxDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink to={'/studentlisting'}  className={` mt-5 flex items-center gap-3 p-3 rounded-lg font-medium ${location.pathname==='/student'? 'text-blue-600 bg-white': 'text-gray-600 hover:bg-gray-100'}`}>
        <PiStudentFill size={25}  /> 
        <span> Student</span>
      </NavLink>

      <NavLink to={'/teacher'}  className={` mt-5 flex items-center gap-3 p-3 rounded-lg font-medium ${location.pathname==='/teacher'? 'text-blue-600 bg-white': 'text-gray-600 hover:bg-gray-100'}`}>
        <GiTeacher size={25}  />  
        <span> Teachers</span>
      </NavLink>


       <NavLink to={'/courses'}  className={` mt-5 flex items-center gap-3 p-3 rounded-lg font-medium ${location.pathname==='/courses'? 'text-blue-600 bg-white': 'text-gray-600 hover:bg-gray-100'}`}>
        <FaBook size={25}/> 
        <span> Courses</span>
      </NavLink>

<div 
  className="flex items-center gap-2 px-4 py-2 rounded-xl mt-50
             bg-red-500 text-white font-medium shadow-md 
             hover:bg-red-600 active:scale-95 transition-all cursor-pointer" onClick={()=>logout(navigate)}>
  <IoMdLogOut size={20} />
  <p>Logout</p>
</div>

      

        
    </div>
  );
}
