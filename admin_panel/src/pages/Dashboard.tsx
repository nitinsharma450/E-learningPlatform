import { useEffect, useState } from "react";
import { FaGraduationCap, FaUsers, FaUserPlus } from "react-icons/fa";
import { AuthenticationService } from "../services/AuthenticationService";
import { Api } from "../services/ApiService";
import { ApiConfigs } from "../configs/ApiConfigs";

import { ImCross } from "react-icons/im";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router";
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
  const [numberOfTeacher, setNumberOfTeacher] = useState<number>(0);
  const [numberOfStudent, setNumberOfStudent] = useState<number>(0);
  const [countCourse, setCountCourse] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [profileModel, showProfileModel] = useState(false);
  const navigate = useNavigate();

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

  async function countStudent() {
   if(await AuthenticationService.isAuthenticated()){
   let response=await Api('student/count')
   if(response.data){
     setNumberOfStudent(response.data)
   }
  }}

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
    countStudent()
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

        <div className="grid grid-cols-3 gap-6 mt-8">
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
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold mt-2">2</p>
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
    </>
  );
  }
