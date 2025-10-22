import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { AuthenticationService } from "../services/AuthenticationService";
import { Api } from "../services/ApiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function TeacherAddListing() {
  const [AddTeacherModel, showAddTeacherModel] = useState(false);
  const [teacherData,setAddTeacherData]=useState<any>({})
  const[showTeacherdetails,setTeacherDetails]=useState<any>([])
  const[loading,setLoading]=useState(false)
  let navigate=useNavigate()


 async function addTeacher() {
  try {
    
    if (await AuthenticationService.isAuthenticated()) {
    console.log('coming')
      
      let response = await Api("teacher/add", teacherData);

      
      if (response.status === 200) {
        toast.success("Teacher added successfully!");
      } else {
        
        toast.error(response.message || "Failed to add teacher");
      }

    } else {
      navigate('/')
    }

  } catch (error) {
    // Show proper error message
    toast.error("Server error");
    console.error("Add teacher error:", error);
  }
}

async function searchTeacher(){

  if(await AuthenticationService.isAuthenticated()){
    setLoading(true)
    let response=await Api('teacher/search')
    if(response && response.data){
      setTeacherDetails(response.data)
    }
  }
  setLoading(false)
}

useEffect(()=>{
searchTeacher()
},[])

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
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input onChange={(e)=>setAddTeacherData({...teacherData,name:e.target.value})}
                  type="text"
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Username
                </label>
                <input onChange={(e)=>setAddTeacherData({...teacherData,username:e.target.value})}
                  type="text"
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input onChange={(e)=>setAddTeacherData({...teacherData,subject:e.target.value})}
                  type="text"
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

                 <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input onChange={(e)=>setAddTeacherData({...teacherData,password:e.target.value})}
                  type="password"
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button onClick={addTeacher}
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

     <div className="p-10">
        <h2 className="text-2xl font-bold mb-4">All Teachers</h2>

        {loading ? (
          <div className="text-gray-500 text-center">Loading teachers...</div>
        ) : showTeacherdetails.length === 0 ? (
          <div className="text-gray-400 text-center">No teachers found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showTeacherdetails.map((teacher:any) => (
              <div
                key={teacher._id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
               <div className="w-12 h-12 flex items-center justify-center bg-blue-400 text-black font-bold text-2xl rounded-full">
  {teacher.name.charAt(0).toUpperCase()}
</div>

                <h3 className="text-xl font-semibold">{teacher.name}</h3>
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


