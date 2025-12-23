import { useEffect, useState } from "react";
import { FaGraduationCap, FaUsers, FaUserPlus } from "react-icons/fa";
import { AuthenticationService } from "../services/AuthenticationService";
import { Api } from "../services/ApiService";
import { ApiConfigs } from "../configs/ApiConfigs";

import { ImCross } from "react-icons/im";
import { IoMdLogOut } from "react-icons/io";
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

  useEffect(() => {
    countTeacher();
    countCourses();
    fetchProfile();
    countStudent();
  }, []);

  useEffect(() => {
    countActiveStudent();
    countActiveTeacher()
    getActiveStudentProfile()
    getActiveTeacherProfile()

    socket.on("userStatusChange", () => {
      countActiveStudent();
      countActiveTeacher();
      getActiveStudentProfile();
      getActiveTeacherProfile();

      
    });

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
      {/* Header and Profile Section */}
      <div className="flex cursor-pointer items-center mt-3 justify-end space-x-6 px-6 py-3">
        {loading ? (
          <div className="w-8 h-8 border-4 border-blue-500  border-dashed rounded-full  animate-spin"></div>
        ) : (
          userProfile.map((user: any) => (
            <div
              key={user._id}
              className="flex items-center space-x-2"
              onClick={() => showProfileModel(true)}
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-gray-800">{user.name}</span>
            </div>
          ))
        )}
      </div>

      {profileModel && (
        <div className="fixed  inset-0 flex items-start justify-end bg-transparent z-50 p-4">
          <div className="bg-white w-[320px] sm:w-[380px] mt-14 mr-4 rounded-2xl shadow-2xl border border-gray-100 relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              onClick={() => showProfileModel(false)}
            >
              <ImCross size={14} />
            </button>
            {userProfile.map((user: any) => (
              <div key={user._id} className="p-5">
                <div className="flex  items-center gap-3 mb-4">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="h-12 w-12  rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </h2>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                    {user.role.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-600 border-t pt-3">
                  <p>
                    <strong className="text-gray-800">Member Since:</strong>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong className="text-gray-800">Last Updated:</strong>{" "}
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="border-t my-4"></div>
                <div className="flex justify-between">
                  <button className="flex-1 mr-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium">
                    Edit Profile
                  </button>
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white font-medium shadow-md hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
                    onClick={() => Logout(navigate)}
                  >
                    <IoMdLogOut size={20} />
                    <p>Logout</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="p-10">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-500">Manage teachers and students</p>

        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Teachers
              </p>
              <p className="text-2xl font-bold mt-2">{numberOfTeacher}</p>
            </div>
            <FaGraduationCap className="text-gray-500" size={24} />
          </div>
          <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Students
              </p>
              <p className="text-2xl font-bold mt-2">{numberOfStudent}</p>
            </div>
            <FaUsers className="text-gray-500" size={24} />
          </div>
          <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Student</p>
              <p className="text-2xl font-bold mt-2">{numberOfActiveStudent}</p>
            </div>
            <FaUserPlus className="text-gray-500" size={24} />
          </div>

           <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Teacher</p>
              <p className="text-2xl font-bold mt-2">{numberOfActiveTeacher}</p>
            </div>
            <FaUserPlus className="text-gray-500" size={24} />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="m-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📊 Platform Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl shadow-md">
            <h3 className="text-md font-bold text-gray-700 mb-3">
              Courses vs Teachers
            </h3>
            <Bar
              data={statsData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl shadow-md">
            <h3 className="text-md font-bold text-gray-700 mb-3">
              Courses vs Teachers (Pie)
            </h3>
            <Pie
              data={statsData}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
        </div>
      </div>
 {/* Active Students List */}
     
<div className="m-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">
    🟢 Active Students
  </h2>

  {activeStudentProfile.length === 0 ? (
    <p className="text-sm text-gray-500">No active students currently</p>
  ) : (
    <div className="space-y-3">
      {activeStudentProfile.map((profile: any) => (
        <div
          key={profile.userId}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:shadow-md transition bg-gray-50"
        >
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className="h-10 w-10 rounded-full object-cover border"
              />
            ) : (
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Name & Email */}
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {profile.name}
              </p>
              <p className="text-xs text-gray-500">{profile.email}</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-end text-xs text-gray-500">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium border border-green-200">
              ACTIVE
            </span>
            {profile.lastLogin && (
              <span className="mt-1">
                Last login:{" "}
                {new Date(profile.lastLogin).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

{/* Active Teachers List */}
<div className="m-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">
    🟢 Active Teacher
  </h2>

  {activeTeacherProfile.length === 0 ? (
    <p className="text-sm text-gray-500">No active Teacher currently</p>
  ) : (
    <div className="space-y-3">
      {activeTeacherProfile.map((profile: any) => (
        <div
          key={profile.userId}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:shadow-md transition bg-gray-50"
        >
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className="h-10 w-10 rounded-full object-cover border"
              />
            ) : (
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Name & Email */}
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {profile.name}
              </p>
              <p className="text-xs text-gray-500">{profile.email}</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-end text-xs text-gray-500">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium border border-green-200">
              ACTIVE
            </span>
            {profile.lastLogin && (
              <span className="mt-1">
                Last login:{" "}
                {new Date(profile.lastLogin).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

    </>
  );
}
