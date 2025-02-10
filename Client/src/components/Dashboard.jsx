import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const accessLevel = localStorage.getItem('accessLevel');
    const checkAuth = () =>{
      if(!accessLevel)
        navigate("../");
    }

    checkAuth();
  }, [])
  const accessLevel = localStorage.getItem('accessLevel');
  if(accessLevel == "nurse")
  {
    return (
      <div className="h-screen flex bg-gradient-to-r from-blue-100 to-blue-200">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Nurse &gt; Dashboard</h2>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <input
                type="date"
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                Apply
              </button>
            </div>
          </div>
  
          {/* Tabs */}
          <div className="flex flex-wrap gap-4 mb-6">
            {[
              "Preventive",
              "Curative",
              "Total Footfalls",
              "Employee",
              "Contractor",
              "Visitor",
            ].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg shadow-md transition text-sm font-medium ${
                  index === 0
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
  
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Footfalls", value: 0 },
              { label: "Healthy Entry", value: 10 },
              { label: "Unhealthy Entry", value: 10 },
              { label: "Appointments", value: 0 },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md text-center hover:shadow-lg transition"
              >
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>
  
          {/* Chart Placeholder */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Healthy Entry</h3>
            <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 border rounded-lg">
              {/* Replace this placeholder with your chart */}
              Chart goes here
            </div>
          </div>
        </div>
      </div>
    );
  }else if(accessLevel === "doctor")
  {
    return (
      <div className="h-screen flex bg-gradient-to-r from-blue-100 to-blue-200">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Doctor &gt; Dashboard</h2>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <input
                type="date"
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                Apply
              </button>
            </div>
          </div>
  
          {/* Tabs */}
          <div className="flex flex-wrap gap-4 mb-6">
            {[
              "Preventive",
              "Curative",
              "Total Footfalls",
              "Employee",
              "Contractor",
              "Visitor",
            ].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg shadow-md transition text-sm font-medium ${
                  index === 0
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
  
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Footfalls", value: 0 },
              { label: "Healthy Entry", value: 10 },
              { label: "Unhealthy Entry", value: 10 },
              { label: "Appointments", value: 0 },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md text-center hover:shadow-lg transition"
              >
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>
  
          {/* Chart Placeholder */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Healthy Entry</h3>
            <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 border rounded-lg">
              {/* Replace this placeholder with your chart */}
              Chart goes here
            </div>
          </div>
        </div>
      </div>
    );
  }else if(accessLevel == "admin")
  {
    return (
      <div className="h-screen flex bg-gradient-to-r from-blue-100 to-blue-200">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700">Admin &gt; Dashboard</h2>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <input
                type="date"
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                Apply
              </button>
            </div>
          </div>
  
          {/* Tabs */}
          <div className="flex flex-wrap gap-4 mb-6">
            {[
              "Preventive",
              "Curative",
              "Total Footfalls",
              "Employee",
              "Contractor",
              "Visitor",
            ].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg shadow-md transition text-sm font-medium ${
                  index === 0
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
  
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Footfalls", value: 0 },
              { label: "Healthy Entry", value: 10 },
              { label: "Unhealthy Entry", value: 10 },
              { label: "Appointments", value: 0 },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md text-center hover:shadow-lg transition"
              >
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>
  
          {/* Chart Placeholder */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Healthy Entry</h3>
            <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 border rounded-lg">
              {/* Replace this placeholder with your chart */}
              Chart goes here
            </div>
          </div>
        </div>
      </div>
    );
  }
  
};

export default Dashboard;
