import { FaUsers } from "react-icons/fa";
import { PiBookOpenTextLight } from "react-icons/pi";
import { LuFileText } from "react-icons/lu";
import { LuTrendingUp } from "react-icons/lu";

export default function Dashboard() {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Total Students */}
     <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white transform hover:scale-105 transition-transform duration-300">

        <div>
          <p className="text-gray-600 font-medium">Total Students</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-50">
          <FaUsers size={28} className="text-blue-500" />
        </div>
      </div>

      {/* Total Courses */}
      <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white transform hover:scale-105 transition-transform duration-300">
        <div>
          <p className="text-gray-600 font-medium">Total Courses</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50">
          <PiBookOpenTextLight size={28} className="text-green-500" />
        </div>
      </div>

      {/* Assignments */}
      <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white transform hover:scale-105 transition-transform duration-300">
        <div>
          <p className="text-gray-600 font-medium">Assignments</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-3 rounded-lg bg-orange-50">
          <LuFileText size={28} className="text-orange-500" />
        </div>
      </div>

      {/* Active Quizzes */}
      <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white transform hover:scale-105 transition-transform duration-300">
        <div>
          <p className="text-gray-600 font-medium">Active Quizzes</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-3 rounded-lg bg-red-50">
          <LuTrendingUp size={28} className="text-red-500" />
        </div>
      </div>

    </div>
  );
}
