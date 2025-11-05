import { FaPhoneAlt, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Api } from "../Service/ApiService";
import { NavLink } from "react-router";
import { ApiConfigs } from "../Configs/ApiConfigs";
import { AuthenticationService } from "../Service/AuthencationService";
import Logout from "../components/Logout";
import { io } from "socket.io-client";
import { socket } from "../socket";


export default function CoursesPage() {
  const [courseList, setCourseList] = useState<any[]>([]);
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const [userProfile, setUserProfile] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
   


  // ✅ Fetch all courses
  async function getAllCourse() {
    try {
      const response = await Api("course/searchAll");
      if (response?.data) {
        setCourseList(response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  // ✅ Filter course by keyword
  async function filterCourse() {
    if (!filterKeyword.trim()) {
      getAllCourse();
      return;
    }
    try {
      const response = await Api("course/filterCourse", { key: filterKeyword });
      if (response?.data) {
        setCourseList(response.data);
      }
    } catch (error) {
      console.error("Error filtering courses:", error);
    }
  }

  // ✅ Fetch user profile (if logged in)
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

  // ✅ Enroll in a course (fixed logic)
  async function courseEnroll(courseTitle: string) {
    try {
      if (await AuthenticationService.isAuthenticated()) {
        const raw = localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL);
        const parsed = raw ? JSON.parse(raw) : null;
        const user_id = parsed?.userDetails?.uid;

        

        const enrollPayload = { user_id, courseTitle };
        console.log("Enroll Payload:", enrollPayload);

        const response = await Api("course/enroll", enrollPayload);
        if (response?.status === 200) {
          console.log("✅ Enrolled successfully!");
        // socket.emit("userStatusChange");
        } else {
          console.log("❌ Enrollment failed:", response);
        }
      } else {
        console.warn("User not authenticated");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  }

  
  // ✅ Initial data load
  useEffect(() => {
    getAllCourse();
    fetchProfile();
  }, []);

 

  // ✅ Filter effect
  useEffect(() => {
    if (filterKeyword.trim() !== "") {
      filterCourse();
    }
  }, [filterKeyword]);

  // ✅ UI
  return (
    <div
      className="min-h-screen from-[#dbeafe] to-white"
      style={{
        background: "linear-gradient(180deg, #dbeafe 0%, #ffffff 100%)",
      }}
    >
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-4 bg-white shadow-sm sticky top-0 z-50">
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
          <a href="#" className="hover:text-green-600 transition">
            Jobs
          </a>
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
      </header>

      {/* Title + Search */}
      <section className="text-center mt-12 px-4">
        <h1 className="text-3xl font-bold text-gray-800">OpenLearn</h1>
        <p className="text-gray-600 mt-2">
          Interactive LIVE & Self-Paced Courses
        </p>
        <div className="flex justify-center items-center mt-2 text-gray-600 gap-2">
          <FaPhoneAlt />{" "}
          <a
            className="text-blue-600 hover:underline"
            href="tel:8800817720"
          >
            8800817720
          </a>
        </div>

        {/* Search Bar */}
        <div className="mt-8 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="  What do you want to learn today?"
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="w-full py-3 pl-12 pr-4 rounded-2xl border border-gray-200 bg-white/70 text-gray-800 placeholder-gray-400 shadow-md backdrop-blur-sm 
                focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-300 ease-in-out"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 text-lg pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Course Section */}
      <section className="max-w-7xl mx-auto mt-14 px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Popular Now</h2>
          <a
            href="#"
            className="text-green-600 font-medium hover:underline flex items-center gap-1"
          >
            View All{" "}
            <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded-full">
              ●
            </span>
          </a>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {courseList.length > 0 ? (
            courseList.map((course: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Card Top */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold">
                    LIVE COURSE
                  </div>
                </div>

                {/* Card Bottom */}
                <div className="p-5">
                  <div className="text-sm text-gray-500 mb-2">
                    {course.interested || "100+ interested learners"}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {course.title}
                  </h3>

                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      {course.level || "Beginner to Advanced"}
                    </p>
                    {course.rating && (
                      <span className="flex items-center gap-1 bg-yellow-400 text-white text-xs px-2 py-1 rounded">
                        ⭐ {course.rating}
                      </span>
                    )}
                  </div>

                  {course.company && (
                    <p className="text-gray-400 text-sm mt-2">
                      {course.company}
                    </p>
                  )}

                  <NavLink
                    to={`/course/${course.title}`}
                    onClick={() => courseEnroll(course.title)}
                    className="w-full mt-5 border border-green-600 text-green-600 py-2 rounded-md font-medium hover:bg-green-50 transition"
                  >
                    Explore
                  </NavLink>
                </div>
              </div>
            ))
          ) : (
            <p>No courses found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
