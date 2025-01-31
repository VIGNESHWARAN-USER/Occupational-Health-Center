import React from "react";
import Sidebar from "../../Sidebar/DocSideBar";
import { FaUserCircle } from "react-icons/fa";
import DocNewVisit from "./DocNewVisitProf/DocNewVisit";

const DocEmployeeProfile = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Employee Details Section */}
        <div className="flex bg-white p-6 rounded shadow-md space-x-6">
          {/* Employee Icon and Basic Details */}
          <div className="flex flex-col items-center w-1/5 space-y-4">
            <FaUserCircle className="text-gray-500 text-6xl" />
            <h2 className="text-lg font-bold">John Doe</h2>
          </div>

          {/* Employee Information */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <p>
                <span className="font-medium">Emp ID:</span> 12345
              </p>
              <p>
                <span className="font-medium">Aadhar No.:</span> 9876-5432-1098
              </p>
              <p>
                <span className="font-medium">Blood Group:</span> O+
              </p>
              <p>
                <span className="font-medium">Department:</span> Cardiology
              </p>
              <p>
                <span className="font-medium">Phone No.:</span> +1 234-567-890
              </p>
            </div>
          </div>
        </div>

        {/* DocNewVisit Component */}
        <div className="mt-6">
          <DocNewVisit />
        </div>
      </div>
    </div>
  );
};

export default DocEmployeeProfile;
