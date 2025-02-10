import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

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
      console.log(data)
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
          id: appointmentId, // Send appointment ID
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === appointmentId
              ? { ...appointment, status: data.status } // Update status dynamically
              : appointment
          )
        );
        window.location.href = "/Newvisit"; // Redirect after status update
      } else {
        console.error("Failed to update appointment:", data.message);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg h-screen overflow-auto p-8">
      {/* Search and Filters */}
      <div className="flex justify-between rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <label>From</label>
          <input
            type="date"
            className="px-4 bg-blue-100 py-2 border rounded-md shadow-sm"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label>To</label>
          <input
            type="date"
            className="px-4 py-2 bg-blue-100 border rounded-md shadow-sm"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button className="px-4 py-2 rounded-lg bg-blue-500 text-white" onClick={fetchAppointments}>
            Apply
          </button>
          <button className="px-4 py-2 ml-4 rounded-lg bg-gray-500 text-white" onClick={clearFilters}>
            Clear
          </button>
        </div>
        <div className="relative">
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 text-gray-500" />
          <input
            className="w-96 px-10 py-2 bg-blue-100 rounded-lg"
            placeholder="Search Employees by ID"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-5 bg-blue-100 rounded-lg p-2 font-bold text-blue-500 text-center">
        <p>ID</p>
        <p>Name</p>
        <p>Role</p>
        <p>Appointment Date</p>
        <p>Action</p>
      </div>

      {/* Appointments Data */}
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="grid grid-cols-5 text-center p-2 border-b border-gray-300 items-center"
          >
            <p>{appointment.id}</p>
            <p>{appointment.name}</p>
            <p>{appointment.role}</p>
            <p>{new Date(appointment.appointment_date).toLocaleString()}</p>
            <button
              className={`px-4 py-2 rounded-lg ${
                appointment.status === "initiate"
                  ? "bg-red-500 text-white"
                  : appointment.status === "inprogress"
                  ? "bg-yellow-500 text-black"
                  : "bg-green-500 text-white"
              }`}
              onClick={() => handleStatusChange(appointment.id, appointment.status)}
            >
              {appointment.status}
            </button>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">No appointments found</p>
      )}
    </div>
  );
};

export default AllAppointments;
