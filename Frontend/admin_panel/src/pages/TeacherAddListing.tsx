import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { AuthenticationService } from "../services/AuthenticationService";
import { Api } from "../services/ApiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { MdBlockFlipped } from "react-icons/md";
import { ImCross } from "react-icons/im";


export default function TeacherAddListing() {
  const [AddTeacherModel, showAddTeacherModel] = useState(false);
  const [teacherData, setAddTeacherData] = useState<any>({
    name: "",
    username: "",
    password: "",
    subject: "",
  });
  const [teacherId,setteacherId]=useState<any>(String)
  const [showTeacherdetails, setTeacherDetails] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubject, setLoadingSubject] = useState<Boolean>(false);
  const [title, setTitles] = useState<any[]>([]);
  const [teacherDetailsForm, setTeacherDetailsForm] = useState<any>({});
  const [teacherUpdateModel, showTeacherUpdateModel] = useState(false);

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
          setAddTeacherData({
            name: "",
            username: "",
            password: "",
            subject: "",
          });
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
        console.log("teacher search response", response.data);
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

  async function blockUpBlockteacher(teacherId: string) {
    try {
      if (await AuthenticationService.isAuthenticated()) {
        let response = await Api("teacher/blockUnblock", { teacherId });
        if (response.status == 200) {
          toast.success(response.message);
          searchTeacher();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getTeacherById(teacherId: string) {
    if (await AuthenticationService.isAuthenticated()) {
      let response = await Api("teacher/getById", { teacherId });
      console.log('data:',response.data)
      if (response && response.data) {
        setTeacherDetailsForm(response.data[0]);
      }
    }
  }

  async function updateTeacher(){

try {
  if(await AuthenticationService.isAuthenticated()){
    let response=await Api('teacher/update',teacherDetailsForm)
    if(response.status==200){
      toast.success(response.message)
    }
    else{
      toast.error(response.message)
    }
    }
} catch (error) {
  console.log(error)
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
                      setAddTeacherData({
                        ...teacherData,
                        name: e.target.value,
                      })
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">All Teachers</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor registered teachers
            </p>
          </div>
          <span className="text-sm text-gray-600 bg-gray-100 px-4 py-1 rounded-full">
            Total: {showTeacherdetails.length}
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : showTeacherdetails.length === 0 ? (
          <div className="text-gray-400 text-center py-16 text-sm">
            No teachers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showTeacherdetails.map((teacher: any) => (
              <div
                key={teacher._id}
                className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold shadow">
                      {teacher.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {teacher.username}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setteacherId(teacher._id)
                        getTeacherById(teacher._id),
                          showTeacherUpdateModel(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 cursor-pointer text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                    >
                      Update
                    </button>

                    {teacher.isBlocked ? (
                      <button
                        onClick={() => blockUpBlockteacher(teacher._id)}
                        className="flex cursor-pointer items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          blockUpBlockteacher(teacher._id);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 cursor-pointer text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition"
                      >
                        <MdBlockFlipped size={14} />
                        Block
                      </button>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-gray-100"></div>

                {/* Details */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                    {teacher.subject}
                  </span>

                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Teacher
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Teacher Modal */}

      {teacherUpdateModel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            {/* Header */}

            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Update Teacher Details
              </h2>

              <div
                className="cursor-pointer"
                onClick={() => {
                  showTeacherUpdateModel(false);
                }}
              >
                <ImCross size={15} color="black" />
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={teacherDetailsForm.name || ""}
                  onChange={(e)=>{setTeacherDetailsForm({...teacherDetailsForm,name:e.target.value})}}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={teacherDetailsForm.username}
                   onChange={(e)=>{setTeacherDetailsForm({...teacherDetailsForm,username:e.target.value})}}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={teacherDetailsForm.password}
                  onChange={(e)=>{setTeacherDetailsForm({...teacherDetailsForm,password:e.target.value})}}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={teacherDetailsForm.subject}
                  onChange={(e)=>{setTeacherDetailsForm({...teacherDetailsForm,subject:e.target.value})}}
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-5 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition">
                Cancel
              </button>

              <button 
              onClick={()=>(setTeacherDetailsForm({...teacherDetailsForm,teacherId:teacherId}),updateTeacher())}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
