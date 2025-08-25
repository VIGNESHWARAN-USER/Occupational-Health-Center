// All appointment
import React, { useEffect, useState, useMemo } from "react";
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
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const purposeOptions = [
    "Pre employment", "Pre employment (Food Handler)", "Pre Placement",
    "Annual / Periodical", "Periodical (Food Handler)", "Camps (Mandatory)",
    "Camps (Optional)", "Special Work Fitness", "Special Work Fitness (Renewal)",
    "Fitness After Medical Leave", "Mock Drill", "BP Sugar Check  ( Normal Value)",
    "Review"
  ];

  // Fetch employee data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.post("https://occupational-health-center-1.onrender.com/userData");
        setEmployees(response.data.data || []); // Ensure employees is always an array
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setEmployees([]); // Set to empty array on error
      }
    };
    fetchDetails();
  }, []);

  // Fetch appointments based on date/purpose filters
  // This useEffect triggers the backend filtering
  useEffect(() => {
    // Only fetch if not initially loading or if filters change
    // No need for extra condition here as dependencies handle it
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, purpose]);

  const fetchAppointments = async () => {
    setLoading(true);
    // Don't clear appointments immediately, only on successful empty fetch or error
    // This prevents brief flashing of "no results" if the network is slow
    // setAppointments([]);
    try {
      let url = "https://occupational-health-center-1.onrender.com/appointments/";
      const params = new URLSearchParams();

      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (purpose) params.append("purpose", purpose);

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      console.log("Fetching appointments from:", url); // Log the URL being hit

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      console.log("Received appointments data:", data); // Log the received data

      if (data.appointments && Array.isArray(data.appointments)) {
        setAppointments(data.appointments);
      } else {
        console.warn("No 'appointments' array found in response or it's not an array:", data);
        setAppointments([]); // Set empty if backend response is not as expected
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]); // Clear appointments on error
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setPurpose("");
    setSearchQuery("");
    // fetchAppointments will be triggered by the useEffect hook reacting to state changes
  };

  // Client-side filtering based on searchQuery (applied AFTER backend results)
  const filteredAppointments = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    if (!lowerCaseQuery) {
      return appointments; // Return backend results if no search query
    }
    return appointments.filter(appointment => {
      const empNoMatch = appointment.emp_no?.toString().toLowerCase().includes(lowerCaseQuery);
      const nameMatch = appointment.name?.toLowerCase().includes(lowerCaseQuery);
      return empNoMatch || nameMatch;
    });
  }, [appointments, searchQuery]);

  // handleStatusChange - remains the same
  const handleStatusChange = async (appointment) => {
    // ... (your existing handleStatusChange logic) ...
    if (appointment.status !== "initiate") {
      navigate("../newvisit", { state: { search: appointment.aadhar, reference: true } });
      return;
    }

    try {
      const response = await fetch("https://occupational-health-center-1.onrender.com/update-appointment-status/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appointment.id }),
      });
      const data = await response.json();

      if (data.success) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((prevApp) =>
            prevApp.id === appointment.id ? { ...prevApp, status: data.status } : prevApp
          )
        );
          navigate("../newvisit", { state: { data: appointment.aadhar, reference: true } });
        
      } else {
        console.error("Failed to update appointment:", data.message);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };


  const numberOfColumns = 18;

  // --- Function to generate the "No Results" message ---
  const getNoResultsMessage = () => {
    if (searchQuery) {
      // If search query is active, message relates to search + filters
      return `No appointments found matching your search "${searchQuery}" with the selected filters.`;
    }
    if (purpose || fromDate || toDate) {
       // If date/purpose filters are active but search is not
       let filterDesc = [];
       if (purpose) filterDesc.push(`purpose "${purpose}"`);
       if (fromDate && toDate) filterDesc.push(`dates between ${fromDate} and ${toDate}`);
       else if (fromDate) filterDesc.push(`date from ${fromDate}`);
       else if (toDate) filterDesc.push(`date up to ${toDate}`);

       return `No appointments found for ${filterDesc.join(' and ')}. Try broadening your filters.`;
    }
    // If no filters or search query applied at all
    return "No appointments available.";
  };

  return (
    <motion.div
      className="p-4 md:p-6 rounded-lg bg-gray-50 shadow-md min-h-screen" // Added min-h-screen
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-4 md:mb-6"> {/* Reduced margin slightly */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          {`${purpose ? `${purpose} Appointments` : "All Appointments"}`}
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 md:mb-6"> {/* Adjusted padding/margin */}
        {/* ... (keep the filter input section as is) ... */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          {/* Search Input */}
          <div className="flex items-center gap-2 md:gap-4 w-full">
            <div className="relative flex items-center w-full">
              <FaSearch className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Emp No or Name..." // Updated placeholder
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
              />
            </div>
          </div>

          {/* Date and Purpose Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 w-full md:w-auto">
             {/* From Date */}
            <div className="relative flex items-center w-full md:w-40"> {/* Adjusted width */}
              <FaCalendarAlt className="absolute left-3 text-gray-400" />
              <input
                type="date"
                title="From Date"
                className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" // Reduced padding/text size
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
             {/* To Date */}
            <div className="relative flex items-center w-full md:w-40"> {/* Adjusted width */}
              <FaCalendarAlt className="absolute left-3 text-gray-400" />
              <input
                type="date"
                title="To Date"
                className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" // Reduced padding/text size
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            {/* Purpose Select */}
            <div className="relative flex items-center w-full md:w-48">
              <FaFilter className="absolute left-3 text-gray-400" />
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-sm" // Added pr-8 for arrow space
              >
                <option value="">All Purposes</option> {/* Changed default text */}
                {purposeOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
               {/* Simple Dropdown Arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0"> {/* Added flex-shrink-0 */}
              {/* Remove Apply button - fetch happens automatically on filter change */}
              {/* <button ... Apply button ... /> */}
              <button
                className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-1.5 text-sm" // Reduced padding/text size
                onClick={clearFilters}
                disabled={loading} // Disable button while loading
              >
                <FaSyncAlt size={14}/> Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-50 text-blue-600">
             {/* ... (keep the thead section as is) ... */}
            <tr>
              <th className="px-3 py-2 font-semibold text-left text-xs sticky left-0 bg-blue-50 z-10">Appt No.</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">Booked Date</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">MRD No.</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">Role</th>
              <th className="px-3 py-2 font-semibold text-left text-xs sticky left-[70px] bg-blue-50 z-10">Emp No</th> {/* Adjust px value if needed */}
              <th className="px-3 py-2 font-semibold text-left text-xs">Aadhar No.</th>
              <th className="px-3 py-2 font-semibold text-left text-xs sticky left-[140px] bg-blue-50 z-10">Name</th> {/* Adjust px value if needed */}
              <th className="px-3 py-2 font-semibold text-left text-xs">Organization</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">Contractor</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">Purpose</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">Date</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">Time</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">Booked By</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">Nurse Submit</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">Dr Submit</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">Consult Dr</th>
              
              <th className="px-3 py-2 font-semibold text-center text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={numberOfColumns} className="text-center py-6">
                  <div /* ... loading spinner ... */ className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" role="status">
                     <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                  </div>
                </td>
              </tr>
              // Use the refined message function here
            ) : filteredAppointments.length > 0 ? (
                 // Map over filteredAppointments - keep this part the same
                 filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition group">
                       {/* Apply sticky positioning to corresponding TD cells */}
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate sticky left-0 bg-white group-hover:bg-gray-50 z-10">{appointment.appointment_no || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.booked_date || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.mrd_no || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.role || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate sticky left-[70px] bg-white group-hover:bg-gray-50 z-10">{appointment.emp_no || '-'}</td> {/* Adjust px value if needed */}
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.aadhar || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate sticky left-[140px] bg-white group-hover:bg-gray-50 z-10">{appointment.name || '-'}</td> {/* Adjust px value if needed */}
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.organization_name || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.contractor_name || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.purpose || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.date || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.time || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.booked_by || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.submitted_by_nurse || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.submitted_Dr || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.consultated_Dr || '-'}</td>
                      
                      <td className="px-3 py-2 text-xs text-gray-700 text-center">
                        <button
                          className={`px-2 py-1 rounded text-xs font-semibold mx-auto w-20 text-center ${
                            appointment.status === "initiate" ? "bg-red-500 text-white hover:bg-red-600" :
                            appointment.status === "inprogress" ? "bg-yellow-500 text-white hover:bg-yellow-600" :
                            "bg-green-500 text-white cursor-not-allowed opacity-70" // Assuming completed means no action
                          }`}
                          onClick={() => handleStatusChange(appointment)}
                          disabled={appointment.status === 'completed'} // Disable if completed
                        >
                          {appointment.status === "initiate" ? "Initiate" :
                           appointment.status === "inprogress" ? "View" : // Or "Continue"
                           "Completed"}
                        </button>
                      </td>
                    </tr>
                  ))
                // Use the refined message function here
            ) : (
              <tr>
                <td colSpan={numberOfColumns} className="p-6 text-center text-gray-500">
                  {getNoResultsMessage()} {/* Call the function to get the dynamic message */}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AllAppointments;