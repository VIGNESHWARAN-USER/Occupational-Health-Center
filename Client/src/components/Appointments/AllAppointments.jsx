import React, { useEffect, useState } from "react";
import { FaSearch, FaCalendarAlt, FaFilter, FaSyncAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]); // Changed from employee_data
  const navigate = useNavigate();

  const purposeOptions = [
    "Pre employment",
    "Pre employment (Food Handler)",
    "Pre Placement",
    "Annual / Periodical",
    "Periodical (Food Handler)",
    "Camps (Mandatory)",
    "Camps (Optional)",
    "Special Work Fitness",
    "Special Work Fitness (Renewal)",
    "Fitness After Medical Leave",
    "Mock Drill",
    "BP Sugar Check  ( Normal Value)",
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        console.log("fetching data");
        const response = await axios.post("http://localhost:8000/userData");
        const fetchedEmployees = response.data.data;
        setEmployees(fetchedEmployees);
        console.log("fetched data");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fromDate, toDate, purpose]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:8000/appointments/";
      const params = new URLSearchParams();

      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (purpose) params.append("purpose", purpose);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      console.log("data:", data);
      if (data.appointments) {
        setAppointments(data.appointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setPurpose("");
    fetchAppointments();
  };

  const handleStatusChange = async (appointment) => {  // Pass the whole appointment object
    if (appointment.status !== "initiate") {
      // Find the employee data by matching emp_no
      const employee = employees.find(emp => emp.emp_no === appointment.emp_no);

      if (employee) {
        navigate("../newvisit", { state: { search: appointment.emp_no, reference: true } });
      } else {
        console.warn("Employee data not found for emp_no:", appointment.emp_no);
        // Handle the case where employee data is not found, maybe show an error message
        alert("Employee data not found.  Please ensure employee data is loaded."); // Optional
      }

      return;
    }

    try {
      const response = await fetch("http://localhost:8000/update-appointment-status/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: appointment.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((prevAppointment) =>
            prevAppointment.id === appointment.id
              ? { ...prevAppointment, status: data.status }
              : prevAppointment
          )
        );

        // Find the employee data by matching emp_no
        const employee = employees.find(emp => emp.emp_no === appointment.emp_no);

        if (employee) {
          navigate("../newvisit", { state: { data: employee, reference: false } }); // Pass data only after successful status update
        } else {
          console.warn("Employee data not found for emp_no:", appointment.emp_no);
           alert("Employee data not found.  Please ensure employee data is loaded."); // Optional
        }
       // window.location.href = "/Newvisit"; // REMOVE THIS.  React Router's navigate() is preferred
      } else {
        console.error("Failed to update appointment:", data.message);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  return (
    <motion.div
      className="p-4 md:p-6 rounded-lg bg-gray-50 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          {purpose ? `${purpose} Appointments` : "All Appointments"}
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="flex items-center gap-2 md:gap-4 w-full">
            <div className="relative flex items-center w-full">
              <FaSearch className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID or Name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 w-full md:w-auto">
            <div className="relative flex items-center w-full md:w-48">
              <FaCalendarAlt className="absolute left-3 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="relative flex items-center w-full md:w-48">
              <FaCalendarAlt className="absolute left-3 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="relative flex items-center w-full md:w-48">
              <FaFilter className="absolute left-3 text-gray-400" />
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Purpose</option>
                {purposeOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                onClick={fetchAppointments}
              >
                <FaFilter /> Apply
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
                onClick={clearFilters}
              >
                <FaSyncAlt /> Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-50 text-blue-600">
            <tr>
              <th className="px-4 py-2 font-semibold text-center">Appointment No.</th>
              <th className="px-4 py-2 font-semibold text-center">MRD No.</th>
              <th className="px-4 py-2 font-semibold text-center">Booked Date</th>
              <th className="px-4 py-2 font-semibold text-center">Role</th>
              <th className="px-4 py-2 font-semibold text-center">Purpose</th>
              <th className="px-4 py-2 font-semibold text-center">Appointment Date</th>
              <th className="px-4 py-2 font-semibold text-center">Aadhar No.</th>
              <th className="px-4 py-2 font-semibold text-center">Booked By</th>
              <th className="px-4 py-2 font-semibold text-center">Consulted By</th>
              <th className="px-4 py-2 font-semibold text-center">Contractor Name</th>
              <th className="px-4 py-2 font-semibold text-center">Doctor Name</th>
              <th className="px-4 py-2 font-semibold text-center">Emp No</th>
              <th className="px-4 py-2 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13" className="text-center py-4">
                  <div className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                </td>
              </tr>
            ) : appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.appointment_no || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.mrd_no || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.booked_date || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.role || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.purpose || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.date || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.aadhar_no || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.booked_by || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.consultated_by || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.contractor_name || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.doctor_name || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center truncate">{appointment.emp_no || '-'}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 text-center">
                    <button
                      className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold mx-auto ${appointment.status === "initiate"
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : appointment.status === "inprogress"
                          ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                      onClick={() => handleStatusChange(appointment)}  // Pass the appointment object
                    >
                      {appointment.status}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="p-6 text-center text-gray-500">No appointments found matching the selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </motion.div>
  );
};

export default AllAppointments;