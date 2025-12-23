import { FaUsers } from "react-icons/fa";
import { PiBookOpenTextLight } from "react-icons/pi";
import { LuFileText, LuTrendingUp } from "react-icons/lu";

import { useEffect, useState } from "react";
import { Api } from "../services/ApiService";
import { ApiConfigs } from "../Configs/ApiConfigs";
import { AuthenticationService } from "../services/AuthencationService";

import {socket} from '../socket'
import { useNavigate } from "react-router";
export default function Dashboard() {
  const [countCourse, setCountCourse] = useState(0);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [teacherSubject, setTeacherSubject] = useState<string>("");
  const [enrollStudentCount,setEnrollStudentCount]=useState(Number)
    const [ActiveEnrollStudent,setActiveEnrollStudent]=useState<any[]>([])
    let navigate=useNavigate();


  async function getProfile() {
    try {
       if (await AuthenticationService.isAuthenticated()) {
      const rawResponse = localStorage.getItem(ApiConfigs.TEACHER_ID);
      const parsedResponse = rawResponse ? JSON.parse(rawResponse) : null;

      if (parsedResponse?.userId) {
        setTeacherId(parsedResponse.userId);

        const response = await Api("profile/search", { user_id: parsedResponse.userId });
        if (response?.data) {
          setTeacherSubject(response.data.subject); // ✅ update state
          console.log("Profile subject:", response.data.subject);
        }
      }
       else{
      navigate('/')
    }
    }
    } catch (error) {
      console.log(error)
    }
   
   
  }

  async function getCourseContentCount(subject: string) {
    if (await AuthenticationService.isAuthenticated()) {
      const response = await Api("courseContent/count", { subject });
      if (response?.data) {
        setCountCourse(response.data);
      }
    }
    else{
      navigate('/')
    }
  }

  async function getEnrollStudentCount(subject:String){
    if(await AuthenticationService.isAuthenticated()){

      try {
        let response= await Api('enroll/student/search',{subject})
        if(response){
          setEnrollStudentCount(response.data)
        }
      } catch (error) {
        console.log(error)
      }
        
    }
    else{
      navigate('/')
    }
  }

  async function getActiveEnrollStudent(){
    if(await AuthenticationService.isAuthenticated()){
      let response= await Api('student/activeStudent')
      console.log(response)
      if(response.data){
      setActiveEnrollStudent(response.data)
      }
    }
    else{
      navigate('/')
    }
  }

 useEffect(()=>{

    getActiveEnrollStudent()
    socket.on('userStatusChange',getActiveEnrollStudent)
    

    return () =>{ socket.off('userStatusChange')}
  },[])
  // 1️⃣ Fetch profile once
  useEffect(() => {
    getProfile();
    
  }, []);

  // 2️⃣ Fetch course count when subject is loaded
  useEffect(() => {
    if (teacherSubject) {
      getCourseContentCount(teacherSubject);
      getEnrollStudentCount(teacherSubject)
    }
  }, [teacherSubject]);

  return (

    <>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white transform hover:scale-105 transition-transform duration-300">
        <div>
          <p className="text-gray-600 font-medium">Total Students</p>
          <p className="text-2xl font-bold">{enrollStudentCount}</p>
        </div>
        <div className="p-3 rounded-lg bg-blue-50">
          <FaUsers size={28} className="text-blue-500" />
        </div>
      </div>

      <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white transform hover:scale-105 transition-transform duration-300">
        <div>
          <p className="text-gray-600 font-medium">Total Courses Content</p>
          <p className="text-2xl font-bold">{countCourse}</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50">
          <PiBookOpenTextLight size={28} className="text-green-500" />
        </div>
      </div>

      <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white transform hover:scale-105 transition-transform duration-300">
        <div>
          <p className="text-gray-600 font-medium">Assignments</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-3 rounded-lg bg-orange-50">
          <LuFileText size={28} className="text-orange-500" />
        </div>
      </div>

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


  <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Enrolled Students</h2>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {ActiveEnrollStudent.length > 0 ? (
      ActiveEnrollStudent.map((student: any) => (
        <div
          key={student._id}
          className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
        >
          {/* Profile Picture */}
          <img
            src={
              student.profilePicture
                ? student.profilePicture
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt={student.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 mb-4"
          />

          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{student.email}</p>

          {/* Status */}
          <div
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              student.isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {student.isActive ? "Active" : "Inactive"}
          </div>

          {/* Last Login */}
          <p className="text-xs text-gray-400 mt-3">
            Last Login: {new Date(student.lastLogin).toLocaleString()}
          </p>
        </div>
      ))
    ) : (
      <p className="text-gray-600 text-center col-span-full">
        No active enrolled students found.
      </p>
    )}
  </div>
</div>


    </>
  );
}
