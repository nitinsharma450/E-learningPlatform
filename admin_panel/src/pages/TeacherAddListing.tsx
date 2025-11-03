import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { AuthenticationService } from "../services/AuthenticationService";
import { Api } from "../services/ApiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function TeacherAddListing() {
  const [AddTeacherModel, showAddTeacherModel] = useState(false);
  const [teacherData, setAddTeacherData] = useState<any>({
    name: "",
    username: "",
    password: "",
    subject: "",
  });
  const [showTeacherdetails, setTeacherDetails] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubject, setLoadingSubject] = useState<Boolean>(false);
  const [title, setTitles] = useState<any[]>([]);
  const navigate = useNavigate();

  // ✅ Fetch all subjects (titles)
  async function fetchTitles() {
    try {
      setLoadingSubject(true);
      if (await AuthenticationService.isAuthenticated()) {
        const response = await Api("course/searchTitles");
        if (response.status === 200) {
          setTitles(response.data);
        }
      }
    } catch (err) {
      console.error("Error fetching titles:", err);
      toast.error("Failed to load course titles");
    } finally {
      setLoadingSubject(false);
    }
  }

  // ✅ Add teacher with validation
  async function addTeacher(e?: any) {
    e?.preventDefault();

    const { name, username, password, subject } = teacherData;

    if (!name?.trim()) return toast.error("Full name is required");
    if (!username?.trim()) return toast.error("Username is required");
    if (!password?.trim()) return toast.error("Password is required");
    if (!subject?.trim()) return toast.error("Subject is required");

    try {
      if (await AuthenticationService.isAuthenticated()) {
        const response = await Api("teacher/add", teacherData);

        if (response.status === 200) {
          toast.success("Teacher added successfully!");
          setAddTeacherData({ name: "", username: "", password: "", subject: "" });
          showAddTeacherModel(false);
          searchTeacher(); // refresh teacher list
        } else {
          toast.error(response.message || "Failed to add teacher");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Server error");
      console.error("Add teacher error:", error);
    }
  }

  // ✅ Search all teachers
  async function searchTeacher() {
    try {
      if (await AuthenticationService.isAuthenticated()) {
        setLoading(true);
        const response = await Api("teacher/search");
        if (response && response.data) {
          setTeacherDetails(response.data);
        }
      }
    } catch (error) {
      toast.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchTeacher();
    fetchTitles();
  }, []);

  return (
    <>
      <div className="p-10">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Teachers Management</h1>
            <p className="text-gray-500 text-sm">
              Manage teachers and their subjects
            </p>
          </div>

          <div>
            <button
              onClick={() => showAddTeacherModel(true)}
              className="flex items-center gap-2 cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <AiOutlinePlus size={18} />
              Add Teacher
            </button>
          </div>
        </div>

        {/* Modal */}
        {AddTeacherModel && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              {/* Close button */}
              <button
                onClick={() => showAddTeacherModel(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
              >
                <IoClose size={24} />
              </button>

              {/* Modal Title */}
              <h2 className="text-xl font-bold mb-1">Add New Teacher</h2>
              <p className="text-gray-500 text-sm mb-4">
                Fill in the details to add a new teacher to the platform
              </p>

              {/* Form */}
              <form onSubmit={addTeacher} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    onChange={(e) =>
                      setAddTeacherData({ ...teacherData, name: e.target.value })
                    }
                    value={teacherData.name || ""}
                    type="text"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <input
                    onChange={(e) =>
                      setAddTeacherData({
                        ...teacherData,
                        username: e.target.value,
                      })
                    }
                    value={teacherData.username || ""}
                    type="text"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <select
                    value={teacherData.subject || ""}
                    onChange={(e) =>
                      setAddTeacherData({
                        ...teacherData,
                        subject: e.target.value,
                      })
                    }
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Subject</option>
                    {title.map((course, i) => (
                      <option key={i} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    onChange={(e) =>
                      setAddTeacherData({
                        ...teacherData,
                        password: e.target.value,
                      })
                    }
                    value={teacherData.password || ""}
                    type="password"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Add Teacher
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Teachers List */}
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-4">All Teachers</h2>

        {loading ? (
          <div className="text-gray-500 text-center">Loading teachers...</div>
        ) : showTeacherdetails.length === 0 ? (
          <div className="text-gray-400 text-center">No teachers found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showTeacherdetails.map((teacher: any) => (
              <div
                key={teacher._id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-blue-400 text-black font-bold text-2xl rounded-full">
                  {teacher.name.charAt(0).toUpperCase()}
                </div>

                <h3 className="text-xl font-semibold mt-2">{teacher.name}</h3>
                <p className="text-gray-500">Subject: {teacher.subject}</p>
                <p className="text-gray-400 text-sm mt-1">
                  Username: {teacher.username}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
