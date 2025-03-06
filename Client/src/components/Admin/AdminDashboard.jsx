import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../Sidebar"; 

const AdminDashboard = () => {
  const navigate = useNavigate();

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
      <div className="h-screen flex bg-[#8fcadd]">
        <><Sidebar /><div className="flex-1 p-6 overflow-auto">

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
                  <label htmlFor="fromDate" className="text-gray-700 text-sm font-bold mb-1">
                    From:
                  </label>
                  <input
                    type="date"
                    id="fromDate"
                    className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40" />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="toDate" className="text-gray-700 text-sm font-bold mb-1">
                    To:
                  </label>
                  <input
                    type="date"
                    id="toDate"
                    className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40" />
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
              {["Preventive", "Curative", "Total Footfalls", "Employee", "Contractor", "Visitor"].map(
                (tab, index) => (
                  <button
                    key={index}
                    className={`px-5 py-2.5 rounded-lg shadow-md transition text-sm font-semibold ${index === 0
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-white text-gray-700 hover:bg-gray-100"}`}
                  >
                    {tab}
                  </button>
                )
              )}
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
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Healthy Entry</h3>
              <div className="h-72 flex items-center justify-center text-gray-400 bg-gray-50 border-2 border-dashed rounded-xl">

                Chart goes here
              </div>
            </div>
          </motion.div>
        </div></>
      </div>
    );
  };

  return accessLevel==="admin" ? renderDashboardContent() : (
    <section class="bg-white h-full flex items-center dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <button onClick={()=>navigate(-1)} class="inline-flex text-white bg-primary-600 hover:cursor-pointer hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back</button>
        </div>   
    </div>
</section>
  );
};

export default AdminDashboard;