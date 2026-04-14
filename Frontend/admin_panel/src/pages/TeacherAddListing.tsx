import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { AuthenticationService } from "../services/AuthenticationService";
import { Api } from "../services/ApiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

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
 
  const [title, setTitles] = useState<any[]>([]);
  const [teacherDetailsForm, setTeacherDetailsForm] = useState<any>({});
  const [teacherUpdateModel, showTeacherUpdateModel] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch all subjects (titles)
  async function fetchTitles() {
    try {
     
      if (await AuthenticationService.isAuthenticated()) {
        const response = await Api("course/searchTitles");
        if (response.status === 200) {
          setTitles(response.data);
        }
      }
    } catch (err) {
      console.error("Error fetching titles:", err);
      toast.error("Failed to load course titles");
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
  {/* ===== Header ===== */}
  <div className="p-4 md:p-10">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Teachers Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage teachers and their subjects
        </p>
      </div>

      <button
        onClick={() => showAddTeacherModel(true)}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        <AiOutlinePlus size={18} />
        Add Teacher
      </button>
    </div>

    {/* ===== Add Teacher Modal ===== */}
    {AddTeacherModel && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 md:p-6 relative">

          <button
            onClick={() => showAddTeacherModel(false)}
            className="absolute top-3 right-3 text-gray-500"
          >
            <IoClose size={22} />
          </button>

          <h2 className="text-lg md:text-xl font-bold mb-1">
            Add New Teacher
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Fill details to add teacher
          </p>

          <form onSubmit={addTeacher} className="space-y-4">

            <input
              placeholder="Full Name"
              value={teacherData.name || ""}
              onChange={(e)=>setAddTeacherData({...teacherData,name:e.target.value})}
              className="w-full border px-3 py-2 rounded-md"
            />

            <input
              placeholder="Username"
              value={teacherData.username || ""}
              onChange={(e)=>setAddTeacherData({...teacherData,username:e.target.value})}
              className="w-full border px-3 py-2 rounded-md"
            />

            <select
              value={teacherData.subject || ""}
              onChange={(e)=>setAddTeacherData({...teacherData,subject:e.target.value})}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option>Select Subject</option>
              {title.map((course, i) => (
                <option key={i}>{course}</option>
              ))}
            </select>

            <input
              type="password"
              placeholder="Password"
              value={teacherData.password || ""}
              onChange={(e)=>setAddTeacherData({...teacherData,password:e.target.value})}
              className="w-full border px-3 py-2 rounded-md"
            />

            <button className="w-full bg-blue-500 text-white py-2 rounded-md">
              Add Teacher
            </button>
          </form>
        </div>
      </div>
    )}
  </div>

  {/* ===== Teachers List ===== */}
  <div className="p-4 md:p-10">

    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          All Teachers
        </h2>
        <p className="text-sm text-gray-500">
          Manage registered teachers
        </p>
      </div>

      <span className="self-start md:self-auto text-sm bg-gray-100 px-4 py-1 rounded-full">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

        {showTeacherdetails.map((teacher: any) => (
          <div
            key={teacher._id}
            className="bg-white rounded-2xl p-4 md:p-6 border shadow-sm hover:shadow-xl transition"
          >

            {/* Top */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                  {teacher.name.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold">{teacher.name}</h3>
                  <p className="text-xs text-gray-500">{teacher.username}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">

                <button
                  onClick={()=>{
                    setteacherId(teacher._id);
                    getTeacherById(teacher._id);
                    showTeacherUpdateModel(true);
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                >
                  Update
                </button>

                {teacher.isBlocked ? (
                  <button
                    onClick={()=>blockUpBlockteacher(teacher._id)}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full"
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={()=>blockUpBlockteacher(teacher._id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full"
                  >
                    Block
                  </button>
                )}
              </div>
            </div>

            <div className="my-4 border-t"></div>

            {/* Bottom */}
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                {teacher.subject}
              </span>

              <span className="text-xs text-gray-400">
                Teacher
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* ===== Update Modal ===== */}
  {teacherUpdateModel && (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-xl p-4 md:p-6">

        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">
            Update Teacher
          </h2>

          <ImCross
            size={15}
            className="cursor-pointer"
            onClick={()=>showTeacherUpdateModel(false)}
          />
        </div>

        <div className="space-y-3">

          <input
            value={teacherDetailsForm.name || ""}
            onChange={(e)=>setTeacherDetailsForm({...teacherDetailsForm,name:e.target.value})}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            value={teacherDetailsForm.username || ""}
            onChange={(e)=>setTeacherDetailsForm({...teacherDetailsForm,username:e.target.value})}
            placeholder="Username"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="password"
            value={teacherDetailsForm.password || ""}
            onChange={(e)=>setTeacherDetailsForm({...teacherDetailsForm,password:e.target.value})}
            placeholder="Password"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            value={teacherDetailsForm.subject || ""}
            onChange={(e)=>setTeacherDetailsForm({...teacherDetailsForm,subject:e.target.value})}
            placeholder="Subject"
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          <button className="w-full sm:w-auto px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={()=>{
              setTeacherDetailsForm({...teacherDetailsForm,teacherId});
              updateTeacher();
            }}
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )}
</>
  );
}
