import { useEffect, useState } from "react";
import { AuthenticationService } from "../services/AuthenticationService";
import { Api } from "../services/ApiService";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";
import { FaBookReader, FaEllipsisV, FaPlus } from "react-icons/fa";
import Spinner from "../component/Spinner";

export default function CoursesAddListing() {
  const [courseForm, setCourseForm] = useState<any>({});
  const [error, setError] = useState<any>({});
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [CourseModel, showCourseModel] = useState<Boolean>(false);
  const [courseListing, setCourseListing] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const[keyword,setKeyword]=useState<any>({})

  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseForm({ ...courseForm, thumbnail: file });
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };


  //  course submit handler
  const handleSubmit = async () => {
    let errors: any = {};
    if (!courseForm.title) errors.title = "Course title is required";
    if (!courseForm.description) errors.description = "Description is required";
    if (!courseForm.category) errors.category = "Select a category";
    if (!courseForm.level) errors.level = "Select difficulty level";
    if (!courseForm.duration) errors.duration = "Enter duration";

    setError(errors);
    if (Object.keys(errors).length > 0) return;

    const formData = new FormData();
    for (let key in courseForm) {
      formData.append(key, courseForm[key]);
    }

    try {
      if (await AuthenticationService.isAuthenticated()) {
        let response = await Api("course/add", formData);
        if (response.status === 200) {
          toast.success("Course added successfully 🎉");
          showCourseModel(false);
          searchCourse();
          setCourseForm({});
          setThumbnailPreview(null);
        } else toast.error("Error adding course");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };


  //  course search handler
  const searchCourse = async () => {
    setLoading(true);
    if (await AuthenticationService.isAuthenticated()) {
      let response = await Api("course/searchAll");
      if (response && response.data) setCourseListing(response.data);
    }
    setLoading(false);
  };


  // course filter handler
  async function inputFilter(){
    
    if(await AuthenticationService.isAuthenticated()){

      if (!keyword.key || keyword.key.trim() === "") {
    searchCourse();
    return;
  }

       let response= await Api('course/filter',keyword)
       if(response && response.data){
        setCourseListing(response.data)
       }
    }
  }

  useEffect(() => {
    searchCourse();
  }, []);
  useEffect(()=>{
  inputFilter()
  },[keyword])

  return (
    <>
      {/* Header */}
      <div className="m-6 flex justify-between items-center bg-white px-8 py-6 shadow-lg rounded-2xl border border-gray-100">
        <h1 className="text-2xl flex items-center gap-2 font-bold text-gray-800">
          <FaBookReader className="text-blue-600" /> Course Management
        </h1>
        <button
          onClick={() => showCourseModel(true)}
          className="px-5 py-3 flex items-center gap-2 text-center justify-center font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md hover:opacity-90 transition duration-200"
        >
          <FaPlus /> Add Course
        </button>
      </div>


    {/* Search Input */}
<div className="flex r m-6">
  <div className=" w-full max-w-md">
    <input
      type="text"
      placeholder="🔍 Search for courses..."
      className="w-full px-5 py-3 pl-12 text-gray-800 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition duration-200"
      onChange={(e) => setKeyword({ ...keyword, key: e.target.value })}
    />
   
  </div>
</div>


      {/* Course Listing */}
      {loading ? (
        <Spinner />
      ) : courseListing.length > 0 ? (
        <div className="overflow-x-auto m-6 bg-white rounded-2xl shadow-md border border-gray-100">
          <table className="min-w-full text-sm text-left">
            <thead className="text-xs text-gray-600 uppercase bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <tr>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courseListing.map((course: any, index: number) => (
                <tr
                  key={index}
                  className="border-b hover:bg-indigo-50 transition-all duration-150"
                >
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow-sm"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {course.title}
                      </div>
                      <div className="text-gray-500 text-sm line-clamp-1">
                        {course.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {course.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {course.level}
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-semibold">
                    {course.duration}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-blue-600 transition">
                      <FaEllipsisV />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">
          No courses available yet.
        </p>
      )}

      {/* Add Course Modal */}
      {CourseModel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh] border border-gray-100">
            {/* Close Button */}
            <button
              onClick={() => showCourseModel(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <ImCross />
            </button>

            {/* Modal Header */}
            <div className="mb-8 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Add New Course
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill out the course details below to add it to your catalog.
              </p>
            </div>

            {/* Modal Form */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Mastering React.js from Scratch"
                />
                {error.title && (
                  <p className="text-red-500 text-sm mt-1">{error.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Description
                </label>
                <textarea
                  rows={4}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Briefly describe your course..."
                />
                {error.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.description}
                  </p>
                )}
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="Web Development">Web Development</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                  {error.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {error.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        level: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select level
                    </option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  {error.level && (
                    <p className="text-red-500 text-sm mt-1">{error.level}</p>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, duration: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 8 weeks"
                />
                {error.duration && (
                  <p className="text-red-500 text-sm mt-1">{error.duration}</p>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="mt-4 w-48 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 shadow-md transition duration-150"
                >
                  Save Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
