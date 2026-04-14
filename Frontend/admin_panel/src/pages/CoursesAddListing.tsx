import { useEffect, useState } from "react";
import { AuthenticationService } from "../services/AuthenticationService";
import { Api } from "../services/ApiService";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";
import { FaBookReader, FaEllipsisV, FaPlus } from "react-icons/fa";
import Spinner from "../component/Spinner";

export default function CoursesAddListing() {
  const [courseForm, setCourseForm] = useState<any>({});
  const [ setError] = useState<any>({});
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
  <div className="m-4 md:m-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white px-4 md:px-8 py-4 md:py-6 shadow-lg rounded-2xl border border-gray-100">
    <h1 className="text-xl md:text-2xl flex items-center gap-2 font-bold text-gray-800">
      <FaBookReader className="text-blue-600" /> Course Management
    </h1>

    <button
      onClick={() => showCourseModel(true)}
      className="w-full md:w-auto px-5 py-3 flex items-center justify-center gap-2 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md hover:opacity-90 transition"
    >
      <FaPlus /> Add Course
    </button>
  </div>

  {/* Search */}
  <div className="m-4 md:m-6 flex justify-center md:justify-start">
    <div className="w-full md:max-w-md">
      <input
        type="text"
        placeholder="🔍 Search for courses..."
        className="w-full px-5 py-3 text-sm md:text-base border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setKeyword({ ...keyword, key: e.target.value })}
      />
    </div>
  </div>

  {/* Content */}
  {loading ? (
    <Spinner />
  ) : courseListing.length > 0 ? (
    <>
      {/* 📱 Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {courseListing.map((course:any, index:any) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow border">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h2 className="font-semibold text-lg">{course.title}</h2>
            <p className="text-sm text-gray-500 line-clamp-2">
              {course.description}
            </p>

            <div className="flex justify-between mt-3 text-sm">
              <span className="font-medium">{course.level}</span>
              <span>{course.duration}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 💻 Desktop Table View */}
      <div className="hidden md:block m-4 md:m-6 bg-white rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm text-left">
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
            {courseListing.map((course:any, index:any) => (
              <tr
                key={index}
                className="border-b hover:bg-indigo-50 transition"
              >
                <td className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-14 h-14 rounded-xl object-cover border shadow-sm"
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

                <td className="px-6 py-4 font-semibold">
                  {course.level}
                </td>

                <td className="px-6 py-4 font-semibold">
                  {course.duration}
                </td>

                <td className="px-6 py-4 text-right">
                  <button className="text-gray-500 hover:text-blue-600">
                    <FaEllipsisV />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <p className="text-center text-gray-500 py-10">
      No courses available yet.
    </p>
  )}

  {/* Modal */}
  {CourseModel && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-4 md:p-8 overflow-y-auto max-h-[90vh]">
        
        {/* Close */}
        <button
          onClick={() => showCourseModel(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <ImCross />
        </button>

        {/* Header */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl md:text-2xl font-bold">
            Add New Course
          </h2>
          <p className="text-sm text-gray-500">
            Fill details to add course
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">

          <input
            type="text"
            placeholder="Course Title"
            onChange={(e) =>
              setCourseForm({ ...courseForm, title: e.target.value })
            }
            className="w-full p-3 border rounded-lg"
          />

          <textarea
            rows={3}
            placeholder="Description"
            onChange={(e) =>
              setCourseForm({
                ...courseForm,
                description: e.target.value,
              })
            }
            className="w-full p-3 border rounded-lg"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  category: e.target.value,
                })
              }
              className="p-3 border rounded-lg"
            >
              <option>Select Category</option>
              <option>Web Development</option>
              <option>Design</option>
            </select>

            <select
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  level: e.target.value,
                })
              }
              className="p-3 border rounded-lg"
            >
              <option>Select Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Duration"
            onChange={(e) =>
              setCourseForm({
                ...courseForm,
                duration: e.target.value,
              })
            }
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 border rounded-lg"
          />

          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              className="w-full max-w-xs rounded-lg"
            />
          )}

          <button
            onClick={handleSubmit}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Save Course
          </button>
        </div>
      </div>
    </div>
  )}
</>
  );
}
