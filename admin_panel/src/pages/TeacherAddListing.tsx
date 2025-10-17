import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { AuthenticationService } from "../services/AuthenticationService";
import { Api } from "../services/ApiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function TeacherAddListing() {
  const [AddTeacherModel, showAddTeacherModel] = useState(false);
  const [teacherData,setAddTeacherData]=useState<any>({})
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

  return (
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
  );
}


