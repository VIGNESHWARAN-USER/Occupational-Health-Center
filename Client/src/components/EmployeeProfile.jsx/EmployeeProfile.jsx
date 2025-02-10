import Sidebar from "../Sidebar";;
import { FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import NewVisit from "./NewVisitProf/NewVisit";

const EmployeeProfile = () => {

  const {data} = useLocation().state || []
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-auto p-6">
        {/* Employee Details Section */}
        <div className="flex p-6 rounded-xl bg-white shadow-md space-x-6">
          {/* Employee Icon and Basic Details */}
          <div className="flex flex-col items-center w-1/5 space-y-4">
            <FaUserCircle className="text-gray-500 text-8xl" />
            <h2 className="text-lg font-bold">Employee</h2>
          </div>

          {/* Employee Information */}
          <div className="flex">
            <div className="flex flex-col">
            <p className="me-8 p-2">
                <span className="font-medium">Name:</span> {data.name}
              </p>
              <p className="me-8 p-2">
                <span className="font-medium">Emp ID:</span> {data.id}
              </p>
              <p className="me-8 p-2">
                <span className="font-medium">Aadhar No.:</span> {data.aadhar}
              </p>
              
              </div>
              <div className="flex flex-col">
              <hr className="w-1 rounded-lg h-32 bg-gray-600 me-8"/>
              </div>
              <div className="flex flex-col">
              <p className="me-8 p-2">
                <span className="font-medium">Department:</span> {data.department}
              </p>
              <p className="me-8 p-2">
                <span className="font-medium">Phone No.:</span> {data.phone_Office}
              </p>
              <p className="me-8 p-2">
                <span className="font-medium">Blood Group:</span> {data.bloodgrp}
              </p>
            </div>
          </div>
        </div>

        
        <div className="">
          <NewVisit data={data}/>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
