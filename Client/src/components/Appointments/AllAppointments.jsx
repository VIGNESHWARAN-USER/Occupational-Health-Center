import React, { useEffect, useState } from "react";
import { FaSearch, FaCalendarAlt, FaFilter, FaSyncAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [purpose, setPurpose] = useState("");

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
    fetchAppointments();
  }, [fromDate, toDate, purpose]);

  const fetchAppointments = async () => {
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
    }
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setPurpose("");
    fetchAppointments();
  };

  const handleStatusChange = async (appointmentId, currentStatus) => {
    if (currentStatus !== "initiate") {
      window.location.href = "/Newvisit";
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/update-appointment-status/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: appointmentId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === appointmentId
              ? { ...appointment, status: data.status }
              : appointment
          )
        );
        window.location.href = "/Newvisit";
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
  {/* Table Header */}
  <div className="grid grid-cols-7 bg-blue-50 p-2 md:p-4 font-semibold text-blue-600 text-center">
    <p className="hidden md:block">Appointment No.</p>
    <p className="hidden md:block">MRD No.</p>
    <p className="hidden md:block">Booked Date</p>
    <p className="hidden md:block">Role</p>
    <p className="hidden md:block">Purpose</p>
    <p className="hidden md:block">Appointment Date</p>
    <p>Action</p>
  </div>

  {/* Table Body */}
  {appointments.length > 0 ? (
    appointments.map((appointment) => (
      <div
        key={appointment.id}
        className="grid grid-cols-7 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 transition text-center items-center py-2 md:py-4"
      >
        <p className="hidden md:block">{appointment.appointment_no}</p>
        <p className="hidden md:block">{appointment.mrd_no}</p>
        <p className="hidden md:block">{appointment.booked_date}</p>
        <p className="hidden md:block">{appointment.role}</p>
        <p className="hidden md:block">{appointment.purpose}</p>
        <p className="hidden md:block">{appointment.date}</p>
        <button
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-semibold mx-auto ${
            appointment.status === "initiate"
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : appointment.status === "inprogress"
              ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
          onClick={() => handleStatusChange(appointment.id, appointment.status)}
        >
          {appointment.status}
        </button>
      </div>
    ))
  ) : (
    <div className="p-6 text-center text-gray-500">No appointments found matching the selected filters.</div>
  )}
</div>

    </motion.div>
  );
};

export default AllAppointments;