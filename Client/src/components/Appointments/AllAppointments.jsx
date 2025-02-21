//AllAppointments
import React, { useEffect, useState } from "react";
import { FaSearch, FaCalendarAlt, FaFilter, FaSyncAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      let url = "http://127.0.0.1:8000/appointments/";
      if (fromDate || toDate) {
        const params = new URLSearchParams();
        if (fromDate) params.append("fromDate", fromDate);
        if (toDate) params.append("toDate", toDate);
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
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
    fetchAppointments();
  };

  const handleStatusChange = async (appointmentId, currentStatus) => {
    if (currentStatus !== "initiate") {
      window.location.href = "/Newvisit";
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/update-appointment-status/", {
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
      className="p-6 rounded-lg bg-gray-50 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">All Appointments</h1>
        {/* <p className="text-gray-500">Manage and view all appointments in the system.</p> */}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex items-center w-full sm:w-64">
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

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex items-center w-full sm:w-48">
              <FaCalendarAlt className="absolute left-3 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="relative flex items-center w-full sm:w-48">
              <FaCalendarAlt className="absolute left-3 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-5 bg-blue-50 p-4 font-semibold text-blue-600">
          <p>ID</p>
          <p>Name</p>
          <p>Role</p>
          <p>Appointment Date</p>
          <p>Action</p>
        </div>

        {/* Table Body */}
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="grid grid-cols-5 p-4 text-sm text-gray-700 border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <p>{appointment.id}</p>
              <p>{appointment.name}</p>
              <p>{appointment.role}</p>
              <p>{new Date(appointment.appointment_date).toLocaleString()}</p>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
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
          <div className="p-6 text-center text-gray-500">
            No appointments found.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AllAppointments;