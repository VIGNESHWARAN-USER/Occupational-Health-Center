import Sidebar from "../Sidebar";
import { FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import NewVisit from "./NewVisitProf/NewVisit";

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const accessLevel = localStorage.getItem('accessLevel')
    if(accessLevel === "nurse" || accessLevel === "doctor")
    {
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
}
else{
  return(
    <section class="bg-white h-full flex items-center dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-900 md:text-4xl dark:text-white">404</h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <button onClick={()=>navigate(-1)} class="inline-flex text-white bg-primary-600 hover:cursor-pointer hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back</button>
        </div>   
    </div>
</section>
  );
}
};

export default EmployeeProfile;
