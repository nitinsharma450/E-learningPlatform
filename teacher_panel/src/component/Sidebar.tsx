import { useLocation } from "react-router";
import { RxDashboard } from "react-icons/rx";
import { NavLink } from "react-router";
import { IoBook } from "react-icons/io5";
import { MdOutlineAssignment, MdOutlineQuiz } from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className=" flex flex-col w-64 h-screen bg-white shadow-lg p-5">
      <h1 className="text-2xl font-bold mb-6">EduPanel</h1>

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

      <NavLink to={'/course'}  className={` mt-5 flex items-center gap-3 p-3 rounded-lg font-medium ${location.pathname==='/couses'? 'text-blue-600 bg-white': 'text-gray-600 hover:bg-gray-100'}`}>
        <IoBook size={25} color="blue"/>
        <span> Courses</span>
      </NavLink>

      <NavLink to={''}  className={` mt-5 flex items-center gap-3 p-3 rounded-lg font-medium ${location.pathname==='/couses'? 'text-blue-600 bg-white': 'text-gray-600 hover:bg-gray-100'}`}>
        <MdOutlineAssignment size={25} color="blue" /> 
        <span> Assignment</span>
      </NavLink>

      <NavLink to={''}  className={` mt-5 flex items-center gap-3 p-3 rounded-lg font-medium ${location.pathname==='/couses'? 'text-blue-600 bg-white': 'text-gray-600 hover:bg-gray-100'}`}>
        <MdOutlineQuiz size={25} color="blue" /> 
        <span> Quizzes</span>
      </NavLink>    
    </div>
  );
}
