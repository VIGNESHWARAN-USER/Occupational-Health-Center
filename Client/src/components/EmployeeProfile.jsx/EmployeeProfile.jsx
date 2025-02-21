import Sidebar from "../Sidebar";
import { FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import NewVisit from "./NewVisitProf/NewVisit";

const EmployeeProfile = () => {
  const { data } = useLocation().state || {};

  return (
    <div className="h-screen w-full flex bg-[#8fcadd]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-auto p-6">
        {/* Employee Profile Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex space-x-8 items-center transition-all duration-300 hover:shadow-xl border-t-4 border-blue-600">
          {/* Employee Icon and Basic Details */}
          <div className="flex flex-col items-center w-1/5 space-y-4">
            <FaUserCircle className="text-blue-600 text-9xl" />
            <h2 className="text-xl font-bold text-blue-700">{data.name || "Employee"}</h2>
            <span className="text-sm text-gray-500 font-medium">Emp ID: {data.id || "N/A"}</span>
          </div>

          {/* Employee Information */}
          <div className="flex flex-1">
            {/* Left Details */}
            <div className="flex flex-col space-y-3 w-1/2">
              <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500">
                <span className="font-semibold text-gray-900">Aadhar No.:</span> {data.aadhar || "N/A"}
              </p>
              <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500">
                <span className="font-semibold text-gray-900">Department:</span> {data.department || "N/A"}
              </p>
            </div>

            {/* Vertical Separator */}
            <div className="w-[2px] bg-gray-300 mx-6"></div>

            {/* Right Details */}
            <div className="flex flex-col space-y-3 w-1/2">
              <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500">
                <span className="font-semibold text-gray-900">Phone No.:</span> {data.phone_Office || "N/A"}
              </p>
              <p className="p-3 bg-gray-50 rounded-lg shadow-sm border-l-4 border-blue-500">
                <span className="font-semibold text-gray-900">Blood Group:</span> {data.bloodgrp || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* New Visit Section */}
        <div className="mt-6">
          <NewVisit data={data} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
