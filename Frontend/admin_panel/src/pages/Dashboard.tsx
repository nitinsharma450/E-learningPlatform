import { useEffect, useState } from "react";
import { FaGraduationCap, FaUsers, FaUserPlus } from "react-icons/fa";
import { AuthenticationService } from "../services/AuthenticationService";
import { Api } from "../services/ApiService";
import { ApiConfigs } from "../configs/ApiConfigs";

import { ImCross } from "react-icons/im";

import { useNavigate } from "react-router";
import io from "socket.io-client";
import Logout from "../component/Logout";

// Chart.js
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [numberOfTeacher, setNumberOfTeacher] = useState<number>();
  const [numberOfStudent, setNumberOfStudent] = useState<number>();
  const [numberOfActiveStudent, setNumberOfActiveStudent] = useState<number>();
  const [countCourse, setCountCourse] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [profileModel, showProfileModel] = useState(false);
  const [activeStudentProfile, setActiveStudentProfile] = useState<any[]>([]);
  const[activeTeacherProfile,setActiveTeacherProfile]=useState<any[]>([])
  const[numberOfActiveTeacher,setNumberOfActiveTeacher]=useState<number>(0)
  const[recentRatings,setRecentRatings]=useState<any[]>([])
  const[recentActivity,setRecentActivity]=useState<any>(false)
  const[topCourse,setTopCourse]=useState<any>([])
  const navigate = useNavigate();

  const socket = io("http://localhost:3333");

  // Fetch total teachers
  async function countTeacher() {
    if (await AuthenticationService.isAuthenticated()) {
      try {
        let response = await Api("teacher/count");
        if (response?.data) setNumberOfTeacher(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  // Fetch total students count
  async function countStudent() {
    if (await AuthenticationService.isAuthenticated()) {
      let response = await Api("student/count");
      if (response.data) {
        setNumberOfStudent(response.data);
      }
    }
  }

  async function countActiveStudent() {
    if (await AuthenticationService.isAuthenticated()) {
      let response = await Api("student/activeStudents");
      console.log(response);
      if (response?.data >= 0) {
        setNumberOfActiveStudent(response.data);
      }
    }
  }

  async function getActiveStudentProfile() {
    try {
      if (await AuthenticationService.isAuthenticated()) {
        let response = await Api("student/getActiveStudentProfile");
        if(response && response.data){
          setActiveStudentProfile(response.data)
        }
      }
    } catch (error) {console.log(error)}
  }
  async function getActiveTeacherProfile() {

 try {
  if(await AuthenticationService.isAuthenticated()){
     let response=await Api('teacher/activeTeacherProfile')
     if(response?.data){
      setActiveTeacherProfile(response.data)
     }
    }
 } catch (error) {
  console.log(error)
 }

    
  }
  async function countActiveTeacher(){
    try {
        if(await AuthenticationService.isAuthenticated()){
             let response=await Api('teacher/activeTeacherCount')
             if(response && response.data){
              setNumberOfActiveTeacher(response.data)
             }
        }
    } catch (error) {
        console.log(error)
    }
  }

  // Fetch total courses
  async function countCourses() {
    if (await AuthenticationService.isAuthenticated()) {
      try {
        let response = await Api("course/count");
        if (response?.data) setCountCourse(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  // Fetch profile
  async function fetchProfile() {
    setLoading(true);
    if (await AuthenticationService.isAuthenticated()) {
      try {
        let rawStorageResponse = localStorage.getItem(
          ApiConfigs.TOKEN_CREDENTIAL
        );
        let storageResponse = rawStorageResponse
          ? JSON.parse(rawStorageResponse)
          : null;
        let response = await Api("profile/search", {
          email: storageResponse.userDetails.email,
        });
        if (response.data) setUserProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  }

  async function fetchTopCourses(){
    if(await AuthenticationService.isAuthenticated()){
        let response=await Api('course/getTopRatedCourse')
        console.log(response)
        if(response?.data){
              setTopCourse(response.data)
        }
    }
  }

  async function getRecentRatings(){
    if(await AuthenticationService.isAuthenticated()){
      let response=await Api('course/getRecentRatings')
      if(response.data && response.data.length>0){
        setRecentRatings(response.data)
        setRecentActivity(true)
      }
    }
  }

  useEffect(() => {
    countTeacher();
    countCourses();
    fetchProfile();
    countStudent();
    fetchTopCourses()
  }, []);

  useEffect(() => {
    countActiveStudent();
    countActiveTeacher()
    getActiveStudentProfile()
    getActiveTeacherProfile()
    getRecentRatings()

    socket.on("userStatusChange", () => {
      countActiveStudent();
      countActiveTeacher();
      getActiveStudentProfile();
      getActiveTeacherProfile();

     
    });
    socket.on('courseRatingUpdated',()=>{
      getRecentRatings();
    })

    return () => {
      socket.off("userStatusChange");
    };
  }, []);

  // Chart Data
  const statsData = {
    labels: ["Courses", "Teachers"],
    datasets: [
      {
        label: "Total Count",
        data: [countCourse, numberOfTeacher],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)", // professional blue
          "rgba(75, 192, 192, 0.7)", // teal
        ],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 2,
      },
    ],
  };

  return (
   <>
  {/* Profile Header */}
  <div className="flex items-center mt-3 justify-end px-4 md:px-6 py-3">
    {loading ? (
      <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    ) : (
      userProfile.map((user: any) => (
        <div
          key={user._id}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => showProfileModel(true)}
        >
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block font-semibold text-gray-800">
            {user.name}
          </span>
        </div>
      ))
    )}
  </div>

  {/* Profile Modal */}
  {profileModel && (
    <div className="fixed inset-0 flex items-start justify-center sm:justify-end bg-black/20 z-50 p-4">
      <div className="bg-white w-full max-w-sm sm:w-[380px] mt-14 sm:mr-4 rounded-2xl shadow-2xl relative">
        <button
          className="absolute top-3 right-3 text-gray-400"
          onClick={() => showProfileModel(false)}
        >
          <ImCross size={14} />
        </button>

        {userProfile.map((user: any) => (
          <div key={user._id} className="p-5">
            <div className="flex items-center gap-3 mb-4">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 text-white">
                  {user.name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-sm font-semibold">{user.name}</h2>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="flex justify-between gap-2 mt-4">
              <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm">
                Edit
              </button>

              <button
                onClick={() => Logout(navigate)}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Stats */}
  <div className="p-4 md:p-10">
    <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
    <p className="text-gray-500 text-sm md:text-base">
      Manage teachers and students
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
      {[ 
        { label: "Total Teachers", value: numberOfTeacher, icon: FaGraduationCap },
        { label: "Total Students", value: numberOfStudent, icon: FaUsers },
        { label: "Active Students", value: numberOfActiveStudent, icon: FaUserPlus },
        { label: "Active Teachers", value: numberOfActiveTeacher, icon: FaUserPlus }
      ].map((item, i) => (
        <div key={i} className="flex justify-between p-4 md:p-6 rounded-xl shadow border bg-white">
          <div>
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="text-xl md:text-2xl font-bold mt-1">{item.value}</p>
          </div>
          <item.icon className="text-gray-500" size={22} />
        </div>
      ))}
    </div>
  </div>

  {/* Charts */}
  <div className="m-4 md:m-6 bg-white rounded-2xl p-4 md:p-6 shadow">
    <h2 className="text-lg md:text-xl font-semibold mb-4">
      📊 Platform Analytics
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="p-4 rounded-xl bg-blue-50">
        <Bar data={statsData} options={{ responsive: true }} />
      </div>

      <div className="p-4 rounded-xl bg-green-50">
        <Pie data={statsData} options={{ responsive: true }} />
      </div>
    </div>
  </div>

  {/* Active Lists */}
  {[ 
    { title: "Active Students", data: activeStudentProfile },
    { title: "Active Teachers", data: activeTeacherProfile }
  ].map((section, i) => (
    <div key={i} className="m-4 md:m-6 bg-white rounded-2xl p-4 md:p-6 shadow">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        🟢 {section.title}
      </h2>

      <div className="space-y-3">
        {section.data.map((profile: any) => (
          <div key={profile.userId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border bg-gray-50">
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                {profile.name.charAt(0)}
              </div>

              <div>
                <p className="text-sm font-semibold">{profile.name}</p>
                <p className="text-xs text-gray-500">{profile.email}</p>
              </div>
            </div>

            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              ACTIVE
            </span>
          </div>
        ))}
      </div>
    </div>
  ))}

  {/* Top Courses */}
  <div className="px-4 md:px-6 mt-10">
    <h2 className="text-xl font-bold mb-6">⭐ Top Courses</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {topCourse.map((course: any) => (
        <div key={course._id} className="bg-white rounded-xl shadow overflow-hidden">
          <img src={course.thumbnail} className="w-full h-40 object-cover" />
          <div className="p-4">
            <h3 className="font-bold">{course.title}</h3>
            <p className="text-sm text-gray-500">{course.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Recent Activity */}
  {recentActivity && (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-bold mb-4">🕒 Recent Activity</h2>

      <div className="space-y-4">
        {recentRatings.map((rating: any) => (
          <div key={rating._id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between">
              <p className="font-semibold">Course Rated</p>
              <span className="text-yellow-600">⭐ {rating.rating}</span>
            </div>
            <p className="text-sm text-gray-500">
              Course: {rating.courseId}
            </p>
          </div>
        ))}
      </div>
    </div>
  )}
</>
  );
}
