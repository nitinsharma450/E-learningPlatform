import { FaPhoneAlt, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Api } from "../Service/ApiService";
import { NavLink, useLocation, useNavigate } from "react-router";
import { ApiConfigs } from "../Configs/ApiConfigs";
import { AuthenticationService } from "../Service/AuthencationService";

export default function CoursesPage() {
  const [courseList, setCourseList] = useState<any[]>([]);
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);

  let navigate = useNavigate();

  // ✅ Fetch all courses
  async function getAllCourse() {
    try {
      const response = await Api("course/searchAll");
      console.log(response.data);
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
        navigate("/login");
        console.warn("User not authenticated");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  }

  async function fetchRecommendedCourses() {

try {
    if(await AuthenticationService.isAuthenticated()){
       let response=await Api("course/recommandations")
       if(response?.data){
      setRecommendedCourses(response.data)
       }
    }
} catch (error) {
  console.log('error in fetching recommendation',error)
}

  
  }

  // ✅ Initial data load
  useEffect(() => {
    getAllCourse();
    fetchRecommendedCourses()
  }, []);

  useEffect(() => {
    if (filterKeyword.trim() !== "") {
      filterCourse();
    }
  }, [filterKeyword]);

  return (
    <div
      className="min-h-screen from-[#dbeafe] to-white"
      style={{
        background: "linear-gradient(180deg, #dbeafe 0%, #ffffff 100%)",
      }}
    >
      {/* Title + Search */}
      <section className="text-center  px-4">
        <h1 className="text-3xl font-bold text-gray-800">OpenLearn</h1>
        <p className="text-gray-600 mt-2">
          Interactive LIVE & Self-Paced Courses
        </p>
        <div className="flex justify-center items-center mt-2 text-gray-600 gap-2">
          <FaPhoneAlt />{" "}
          <a className="text-blue-600 hover:underline" href="tel:8800817720">
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
                      <span className="flex items-center gap-1 text-black text-xs px-2 py-1 rounded">
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
                    to={`/course/${course.title}/${course._id}`}
                    onClick={() => courseEnroll(course.title)}
                    className="w-full mt-5 inline-flex items-center justify-center gap-2
             border-2 border-green-600 text-green-600 font-semibold 
             py-2.5 rounded-xl hover:bg-green-600 hover:text-white 
             transition-all duration-300 ease-in-out"
                  >
                    <span>Explore</span>
                  </NavLink>
                </div>
              </div>
            ))
          ) : (
            <p>No courses found.</p>
          )}
        </div>
      </section>


{/* course recommandation */}
     {localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL) && (
  <section className="max-w-7xl mx-auto mt-14 px-6">
    
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Recommended for You
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Personalized courses based on your interests
        </p>
      </div>

    
    </div>

    {/* Course Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Card */}
      {recommendedCourses?.map((course:any) => (
        <div
          key={course._id}
          className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          {/* Thumbnail */}
          <div className="relative overflow-hidden rounded-t-xl">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
              {course.level}
            </span>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
              {course.title}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {course.category}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-3">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-medium text-gray-800">
                {course.rating}
              </span>
              <span className="text-xs text-gray-500">
                ({course.totalRatings})
              </span>
            </div>

            {/* CTA */}
            <button className="mt-4 w-full bg-indigo-600 text-white text-sm py-2 rounded-lg hover:bg-indigo-700 transition">
              Enroll Now
            </button>
          </div>
        </div>
      ))}

    </div>
  </section>
)}

    </div>
  );
}
