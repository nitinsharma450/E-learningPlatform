import { useEffect, useState } from "react";
import { Api } from "../services/ApiService";
import { AuthenticationService } from "../services/AuthenticationService";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import Spinner from "../component/Spinner";
import { PiStudentBold } from "react-icons/pi";
import { toast } from "react-toastify";

export default function StudentListing() {
  const [studentList, setStudentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  //  student search
  async function searchStudent() {
    try {
      if (await AuthenticationService.isAuthenticated()) {
        setLoading(true);
        let response = await Api("student/searchAll");

        if (response && response.data) {
          setStudentList(response.data);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function blockUnblockStudent(studentId: string) {
    try {
      if (await AuthenticationService.isAuthenticated()) {
        let response = await Api("student/blockUnblock", { studentId });
        if (response.status == 200) {
          toast.success(response.message);
          searchStudent();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    searchStudent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 md:px-10 py-6 md:py-8">
  
  {/* ===== Header Section ===== */}
  <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 bg-white shadow-md rounded-2xl py-3 md:py-4 mb-6 md:mb-10 border border-gray-100 text-center sm:text-left">
    
    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white text-xl md:text-2xl shadow-sm">
      <PiStudentBold />
    </div>

    <div className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 tracking-tight">
      Student Management
    </div>
  </div>

  {/* ===== Grid Section ===== */}
  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
    
    {loading ? (
      <div className="col-span-full flex justify-center py-10">
        <Spinner />
      </div>
    ) : studentList.length === 0 ? (
      <div className="col-span-full text-center text-gray-500 py-10 italic">
        No students found.
      </div>
    ) : (
      studentList.map((student: any) => (
        <div
          key={student._id}
          className="bg-white shadow-sm hover:shadow-xl border border-gray-100 rounded-2xl p-4 sm:p-5 md:p-6 hover:-translate-y-1 transition-all duration-300"
        >
          
          {/* --- Avatar + Name Section --- */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
            
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold text-lg sm:text-xl shadow-sm">
              {student.name ? student.name.charAt(0) : "?"}
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-base sm:text-lg text-gray-900">
                {student.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 capitalize">
                {student.role}
              </p>
            </div>

            {/* Button */}
            <div className="self-start sm:self-auto">
              {student.isBlocked ? (
                <button
                  onClick={() => blockUnblockStudent(student._id)}
                  className="px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition"
                >
                  Unblock
                </button>
              ) : (
                <button
                  onClick={() => blockUnblockStudent(student._id)}
                  className="px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition"
                >
                  Block
                </button>
              )}
            </div>
          </div>

          {/* --- Student Details --- */}
          <div className="space-y-2 text-xs sm:text-sm text-gray-700">
            
            <div className="flex items-start gap-2">
              <CiMail className="w-4 h-4 text-blue-500 mt-0.5" />
              <span className="break-all">{student.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaShield
                className={`w-4 h-4 ${
                  student.isActive ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`font-medium ${
                  student.isActive ? "text-green-600" : "text-red-500"
                }`}
              >
                {student.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <FaRegCalendarAlt className="w-4 h-4 text-gray-400 mt-0.5" />
              <span className="text-gray-600 text-xs sm:text-sm">
                Last Login:{" "}
                {student.lastLogin
                  ? new Date(student.lastLogin).toLocaleString()
                  : "N/A"}
              </span>
            </div>

          </div>
        </div>
      ))
    )}
  </div>
</div>
  );
}
