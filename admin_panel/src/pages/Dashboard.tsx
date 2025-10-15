import { FaGraduationCap, FaUsers, FaUserPlus } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="p-10 m-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-500">Manage teachers and students</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        
        {/* Card 1 */}
        <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Teachers</p>
            <p className="text-2xl font-bold mt-2">1</p>
          </div>
          <FaGraduationCap className="text-gray-500" size={24} />
        </div>

        {/* Card 2 */}
        <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-2xl font-bold mt-2">1</p>
          </div>
          <FaUsers className="text-gray-500" size={24} />
        </div>

        {/* Card 3 */}
        <div className="flex justify-between items-center p-6 rounded-xl shadow-md border border-gray-200 bg-white">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Users</p>
            <p className="text-2xl font-bold mt-2">2</p>
          </div>
          <FaUserPlus className="text-gray-500" size={24} />
        </div>
      </div>

        
    </div>
  );
}
