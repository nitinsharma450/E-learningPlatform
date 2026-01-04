import React, { useEffect, useState } from "react";
import { AuthenticationService } from "../Service/AuthencationService";
import { Api } from "../Service/ApiService";
import { ApiConfigs } from "../Configs/ApiConfigs";

export default function EnrolledCourse() {
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  

 async function getEnrolledCourses() {
  try {
    if (await AuthenticationService.isAuthenticated()) {
      setLoading(true);

      const userInfo = localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL);
      if (!userInfo) return;

      const parsed = JSON.parse(userInfo);
      const userId = parsed?.userDetails?.uid; // local variable

      if (!userId) return;

   

      const response = await Api("enrolledCourses", { userId });
      if (response?.data) {
        setEnrolledCourses(response.data);
      }
    }
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
  } finally {
    setLoading(false);
  }
}


  useEffect(() => {
    getEnrolledCourses();
  }, []);

 return (
  <div className="p-6">
    {loading && <p>Loading enrolled courses...</p>}

    {!loading && enrolledCourses.length === 0 && (
      <p>No enrolled courses found.</p>
    )}

    {!loading &&
      enrolledCourses.map((course: any) => {
        const details = course.courseDetails;

      return (
  <div
    key={course._id}
    className="group flex flex-col md:flex-row gap-6 p-5 mb-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
  >
    {/* Image Section */}
    {details?.thumbnail && (
      <div className="shrink-0">
        <img
          src={details.thumbnail}
          alt={details.title}
          className="w-full md:w-48 h-32 object-cover rounded-lg bg-gray-50"
        />
      </div>
    )}

    {/* Content Section */}
    <div className="flex flex-col justify-between flex-1">
      <div>
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
            {details?.title}
          </h2>
          <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
            {details?.level}
          </span>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:flex md:gap-8 mt-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Category</span>
            <span className="text-sm text-gray-700">{details?.category}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Duration</span>
            <span className="text-sm text-gray-700">{details?.duration}</span>
          </div>
        </div>
      </div>

      {/* Optional: Add a "View Details" or "Action" indicator */}
      <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 cursor-pointer">
        View Course Details
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);
      })}
  </div>
);

}
