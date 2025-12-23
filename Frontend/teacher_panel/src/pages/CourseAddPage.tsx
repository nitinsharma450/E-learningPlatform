import { useState, useEffect } from "react";
import { AuthenticationService } from "../services/AuthencationService";
import { Api } from "../services/ApiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function CourseAddPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadingForm, setUploadingForm] = useState({
    title: "",
    category: "",
    description: "",
    contentType: ""
  });
  const [titles, setTitles] = useState<any[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(false);
  let navigate=useNavigate()

  // Fetch course titles from backend
  async function fetchTitles() {
    try {
      setLoadingTitles(true);
      
        const response = await Api("course/searchTitles");
        console.log(response.data)
        if (response.status === 200) {
          setTitles(response.data);
        }
      
     
    } catch (err) {
      console.error("Error fetching titles:", err);
      toast.error("Failed to load course titles");
    } finally {
      setLoadingTitles(false);
    }
  }

  useEffect(() => {
    fetchTitles();
  }, []);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!file || !uploadingForm.title || !uploadingForm.category) {
      toast.warning("Please fill all required fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", uploadingForm.title);
    formData.append("category", uploadingForm.category);
    formData.append("description", uploadingForm.description);
    formData.append("contentType", uploadingForm.contentType);

    try {
      if (await AuthenticationService.isAuthenticated()) {
        const response = await Api("course/content/upload", formData);
        if (response.status === 200) {
          toast.success("Course uploaded successfully!");
          setUploadingForm({
            title: "",
            category: "",
            description: "",
            contentType: "",
          });
          setFile(null);
        } else {
          toast.error("Course upload failed");
        }
      }
      else{
        navigate('/')
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Course upload failed");
    }
  };

  return (
  <div className="max-w-4xl mx-auto mt-12 bg-white p-14 rounded-2xl shadow-lg border border-gray-100">
    {/* Header */}
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-gray-800">
        Upload New Course Content
      </h2>
      <p className="text-gray-500 text-base mt-2">
        Add new content (Video, PDF, etc.) to your existing course.
      </p>
    </div>

    {/* File Upload Box */}
    <div className="border-2 border-dashed border-green-400 bg-green-50 hover:bg-green-100 transition-all duration-300 rounded-xl p-12 flex flex-col items-center justify-center text-center mb-10">
      <svg
        className="w-16 h-16 text-green-500 mb-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      <p className="text-gray-700 font-semibold text-lg mb-1">
        Drag & Drop your file here
      </p>
      <p className="text-gray-500 text-sm mb-5">
        or click below to browse from your device
      </p>
      <label className="bg-green-500 text-white px-6 py-3 rounded-md cursor-pointer hover:bg-green-600 transition-all font-medium">
        Choose File
        <input type="file" onChange={handleFileChange} className="hidden" />
      </label>
      {file && (
        <p className="mt-3 text-sm text-gray-600 italic">
          Selected: <span className="font-semibold">{file.name}</span>
        </p>
      )}
    </div>

    {/* Form */}
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Title Dropdown */}
      <div>
        <label className="block font-semibold mb-2 text-gray-700 text-lg">
          Select Course Title <span className="text-red-500">*</span>
        </label>
        <select
          name="title"
          value={uploadingForm.title}
          onChange={(e) =>
            setUploadingForm({ ...uploadingForm, title: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-green-400 outline-none text-gray-700 bg-white"
        >
          <option value="">Select course</option>
          {loadingTitles ? (
            <option disabled>Loading...</option>
          ) : titles.length > 0 ? (
            titles.map((item: any, index: number) => (
              <option key={index} value={item.title || item._id}>
                {item.title || item}
              </option>
            ))
          ) : (
            <option disabled>No courses found</option>
          )}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block font-semibold mb-2 text-gray-700 text-lg">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={uploadingForm.category}
          onChange={(e) =>
            setUploadingForm({ ...uploadingForm, category: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-green-400 outline-none text-gray-700 bg-white"
        >
          <option value="">Select category</option>
          <option value="web">Web Development</option>
          <option value="ai">Artificial Intelligence</option>
          <option value="ds">Data Science</option>
          <option value="programming">Programming</option>
        </select>
      </div>

      {/* Content Type */}
      <div>
        <label className="block font-semibold mb-2 text-gray-700 text-lg">
          Content Type
        </label>
        <input
          type="text"
          name="contentType"
          value={uploadingForm.contentType}
          onChange={(e) =>
            setUploadingForm({
              ...uploadingForm,
              contentType: e.target.value,
            })
          }
          placeholder="e.g. Video, PDF, Article"
          className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-green-400 outline-none text-gray-700"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold mb-2 text-gray-700 text-lg">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={uploadingForm.description}
          onChange={(e) =>
            setUploadingForm({
              ...uploadingForm,
              description: e.target.value,
            })
          }
          rows={5}
          placeholder="Provide a detailed overview of your content..."
          className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-green-400 outline-none text-gray-700"
        ></textarea>
      </div>

      {/* Submit */}
      <div className="pt-6 flex justify-center">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold text-lg px-12 py-4 rounded-lg shadow-md transition-all"
        >
          Upload Content
        </button>
      </div>
    </form>
  </div>
);

}
