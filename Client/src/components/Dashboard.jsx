import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const accessLevel = localStorage.getItem('accessLevel');
  const navigate = useNavigate();
  if(accessLevel === "nurse")
  {
    const [chartData, setChartData] = useState({
      type_counts: [],
      type_of_visit_counts: [],
      register_counts: [],
      purpose_counts: [],
    });
  
    // Two separate filter states
    const [visitType, setVisitType] = useState(""); // Preventive / Curative
    const [entityType, setEntityType] = useState(""); // Total Footfalls / Employee / Contractor / Visitor
  
    // Default to today's date
    const today = new Date().toISOString().split("T")[0];
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
  
    // Function to reset the date filter
    const clearDateFilter = () => {
      setFromDate(today);
      setToDate(today);
    };
  
    // Fetch chart data with applied filters
    const fetchChartData = () => {
      if (!visitType || !entityType) return; // Ensure both filters are selected before fetching
  
      const params = new URLSearchParams();
      params.append("fromDate", fromDate);
      params.append("toDate", toDate);
      params.append("visitType", visitType);
      params.append("entityType", entityType);
  
      axios.get(`http://localhost:8000/dashboard/?${params.toString()}`)
        .then((response) => {
          setChartData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching dashboard data:", error);
        });
    };
  
    useEffect(() => {
      const accessLevel = localStorage.getItem("accessLevel");
      if (!accessLevel) navigate("../");
  
      fetchChartData();
    }, [navigate, visitType, entityType, fromDate, toDate]);
  
    const formatChartData = (data) => data.map((item) => ({
      name: item.type || item.type_of_visit || item.register || item.purpose,
      count: item.count,
    }));
  
    return (
      <div className="h-screen flex bg-[#8fcadd]">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          
          {/* Header with Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard Statistics</h2>
            <motion.div className="bg-white p-4 rounded-xl shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm font-bold mb-1">From:</label>
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-3 py-2 border rounded-lg shadow-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm font-bold mb-1">To:</label>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-3 py-2 border rounded-lg shadow-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition" onClick={fetchChartData}>Apply</button>
                <button className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition" onClick={clearDateFilter}>Clear</button>
              </div>
            </motion.div>
          </div>
  
          {/* First Group Filters */}
          <motion.div className="mb-4">
            <div className="flex gap-3">
              {["Preventive", "Curative"].map((filter) => (
                <button key={filter} onClick={() => setVisitType(filter)}
                  className={`px-5 py-2.5 rounded-lg shadow-md text-sm font-semibold transition ${
                    visitType === filter ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}>{filter}</button>
              ))}
            </div>
          </motion.div>
  
          {/* Second Group Filters */}
          <motion.div className="mb-8">
            <div className="flex gap-3">
              {["Total Footfalls", "Employee", "Contractor", "Visitor"].map((filter) => (
                <button key={filter} onClick={() => setEntityType(filter)}
                  className={`px-5 py-2.5 rounded-lg shadow-md text-sm font-semibold transition ${
                    entityType === filter ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}>{filter}</button>
              ))}
            </div>
          </motion.div>
  
  
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Dashboard Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Type Distribution", data: formatChartData(chartData.type_counts), color: "#3182CE" }, 
                  { title: "Type of Visit Distribution", data: formatChartData(chartData.type_of_visit_counts), color: "#2B6CB0" },
                  { title: "Register Distribution", data: formatChartData(chartData.register_counts), color: "#D69E2E" },
                  { title: "Purpose Distribution", data: formatChartData(chartData.purpose_counts), color: "#38A169" }
                ].map((chart, index) => (
                  <div key={index} className="h-80 bg-gray-100 p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">{chart.title}</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chart.data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Legend/><Bar dataKey="count" fill={chart.color} /></BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
  
        </div>
      </div>
    );
  }
  else if(accessLevel === "doctor")
  {
    const [chartData, setChartData] = useState({
      type_counts: [],
      type_of_visit_counts: [],
      register_counts: [],
      purpose_counts: [],
    });
  
    // Two separate filter states
    const [visitType, setVisitType] = useState(""); // Preventive / Curative
    const [entityType, setEntityType] = useState(""); // Total Footfalls / Employee / Contractor / Visitor
  
    // Default to today's date
    const today = new Date().toISOString().split("T")[0];
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
  
    // Function to reset the date filter
    const clearDateFilter = () => {
      setFromDate(today);
      setToDate(today);
    };
  
    // Fetch chart data with applied filters
    const fetchChartData = () => {
      if (!visitType || !entityType) return; // Ensure both filters are selected before fetching
  
      const params = new URLSearchParams();
      params.append("fromDate", fromDate);
      params.append("toDate", toDate);
      params.append("visitType", visitType);
      params.append("entityType", entityType);
  
      axios.get(`http://localhost:8000/dashboard/?${params.toString()}`)
        .then((response) => {
          setChartData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching dashboard data:", error);
        });
    };
  
    useEffect(() => {
      const accessLevel = localStorage.getItem("accessLevel");
      if (!accessLevel) navigate("../");
  
      fetchChartData();
    }, [navigate, visitType, entityType, fromDate, toDate]);
  
    const formatChartData = (data) => data.map((item) => ({
      name: item.type || item.type_of_visit || item.register || item.purpose,
      count: item.count,
    }));
  
    return (
      <div className="h-screen flex bg-[#8fcadd]">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          
          {/* Header with Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard Statistics</h2>
            <motion.div className="bg-white p-4 rounded-xl shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm font-bold mb-1">From:</label>
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="px-3 py-2 border rounded-lg shadow-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 text-sm font-bold mb-1">To:</label>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="px-3 py-2 border rounded-lg shadow-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition" onClick={fetchChartData}>Apply</button>
                <button className="px-6 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition" onClick={clearDateFilter}>Clear</button>
              </div>
            </motion.div>
          </div>
  
          {/* First Group Filters */}
          <motion.div className="mb-4">
            <div className="flex gap-3">
              {["Preventive", "Curative"].map((filter) => (
                <button key={filter} onClick={() => setVisitType(filter)}
                  className={`px-5 py-2.5 rounded-lg shadow-md text-sm font-semibold transition ${
                    visitType === filter ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}>{filter}</button>
              ))}
            </div>
          </motion.div>
  
          {/* Second Group Filters */}
          <motion.div className="mb-8">
            <div className="flex gap-3">
              {["Total Footfalls", "Employee", "Contractor", "Visitor"].map((filter) => (
                <button key={filter} onClick={() => setEntityType(filter)}
                  className={`px-5 py-2.5 rounded-lg shadow-md text-sm font-semibold transition ${
                    entityType === filter ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}>{filter}</button>
              ))}
            </div>
          </motion.div>
  
  
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Dashboard Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Type Distribution", data: formatChartData(chartData.type_counts), color: "#3182CE" }, 
                  { title: "Type of Visit Distribution", data: formatChartData(chartData.type_of_visit_counts), color: "#2B6CB0" },
                  { title: "Register Distribution", data: formatChartData(chartData.register_counts), color: "#D69E2E" },
                  { title: "Purpose Distribution", data: formatChartData(chartData.purpose_counts), color: "#38A169" }
                ].map((chart, index) => (
                  <div key={index} className="h-80 bg-gray-100 p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">{chart.title}</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chart.data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis/><Tooltip/><Legend/><Bar dataKey="count" fill={chart.color} /></BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
  
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

export default Dashboard;