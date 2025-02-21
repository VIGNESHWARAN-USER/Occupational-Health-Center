import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";



const Dashboard = () => {

  const navigate = useNavigate();
  const [chartData, setChartData] = useState({
    type_counts: [],
    type_of_visit_counts: [],
    register_counts: [],
    purpose_counts: [],
  });

  useEffect(() => {
    const accessLevel = localStorage.getItem("accessLevel");
    if (!accessLevel) {
      navigate("../");
    }

    // Fetch dashboard stats
    axios.get("http://localhost:8000/dashboard/")
      .then((response) => {
        setChartData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, [navigate]);

  // Format data for recharts
  const formatChartData = (data) => data.map((item) => ({ name: item.type || item.type_of_visit || item.register || item.purpose, count: item.count }));

  
  useEffect(() => {
    const accessLevel = localStorage.getItem('accessLevel');
    const checkAuth = () => {
      if (!accessLevel)
        navigate("../");
    }

    checkAuth();
  }, [navigate]);

  const accessLevel = localStorage.getItem('accessLevel');

  const renderDashboardContent = () => {
    let heading = "";
    let backgroundColor = "bg-gradient-to-r from-blue-50 to-blue-100"; 

    switch (accessLevel) {
      case "nurse":
        heading = "Nurse Dashboard";
        backgroundColor = "bg-gradient-to-r from-teal-50 to-teal-100"; 
        break;
      case "doctor":
        heading = "Doctor Dashboard";
        backgroundColor = "bg-gradient-to-r from-indigo-50 to-indigo-100"; 
        break;
      case "admin":
        heading = "Admin Dashboard";
        backgroundColor = "bg-gradient-to-r from-purple-50 to-purple-100"; 
        break;
      default:
        return null; 
    }

    return (
      <div>
      <div className="h-screen flex bg-[#8fcadd]">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{heading}</h2>
            <motion.div
              className="bg-white p-4 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                
                  <input
                    type="date"
                    id="fromDate"
                    className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    type="date"
                    id="toDate"
                    className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                  />
                </div>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                  Apply
                </button>
              </div>
            </motion.div>
          </div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-3">
              {["Preventive", "Curative"].map(
                (tab, index) => (
                  <button
                    key={index}
                    className="px-5 py-2.5 rounded-lg shadow-md transition text-sm font-semibold bg-white text-gray-700 hover:bg-gray-100">
                    {tab}
                  </button>
                )
            ) }
            </div>
            <div className="flex flex-wrap gap-3">
              {["Total Footfalls", "Employee", "Contractor", "Visitor"].map(
                (tab, index) => (
                  <button
                    key={index}
                    className={`px-5 py-2.5 rounded-lg shadow-md transition text-sm font-semibold ${
                      index === 0
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Footfalls", value: 0 },
                { label: "Healthy Entry", value: 10 },
                { label: "Unhealthy Entry", value: 10 },
                { label: "Appointments", value: 0 },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl shadow-md text-center hover:shadow-lg transition"
                >
                  <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-800">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Type of Visit</h3>
              <div className="p-6 bg-white rounded-xl">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatChartData(chartData.type_of_visit_counts)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2B6CB0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="h-screen flex bg-[#8fcadd]">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Statistics</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Type Chart */}
          <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatChartData(chartData.type_counts)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Type of Visit Chart */}
          

          {/* Register Chart */}
          <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Register Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatChartData(chartData.register_counts)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#D69E2E" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Purpose Chart */}
          <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Purpose</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatChartData(chartData.purpose_counts)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#38A169" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>

</div>
    );
  };

  return accessLevel ? renderDashboardContent() : null;
};

export default Dashboard; 