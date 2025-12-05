// All appointment
import React, { useEffect, useState, useMemo } from "react";
import { FaSearch, FaCalendarAlt, FaFilter, FaSyncAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const CurrentFootfalls = () => {
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
      let url = "http://localhost:8000/currentfootfalls/";
      const params = new URLSearchParams();

      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (purpose) params.append("purpose", purpose);

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      console.log("Fetching appointments from:", url); // Log the URL being hit

      const response = await axios.post(url);
      if (response.status != 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } 
      console.log(response.data.data)
      const data = await response.data.data;

      console.log("Received appointments data:", data); // Log the received data

      if (data && Array.isArray(data)) {
        setAppointments(data);
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
      const empNoMatch = appointment.details.emp_no?.toString().toLowerCase().includes(lowerCaseQuery);
      const nameMatch = appointment.details.name?.toLowerCase().includes(lowerCaseQuery);
      return empNoMatch || nameMatch;
    });
  }, [appointments, searchQuery]);
  console.log(appointments)
  // handleStatusChange - remains the same
  const handleStatusChange = async (appointment) => {
    console.log("Navigating to New Visit with appointment:", appointment.details);
      navigate("../newvisit", { state: { appointment: appointment.details, reference: true } });
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
              <th className="px-3 py-2 font-semibold text-left text-xs">MRD No.</th>
              <th className="px-3 py-2 font-semibold text-left text-xs">Role</th>
              <th className="px-3 py-2 font-semibold text-left text-xs sticky left-[70px] bg-blue-50 z-10">Emp No</th> {/* Adjust px value if needed */}
              <th className="px-3 py-2 font-semibold text-left text-xs">Aadhar No.</th>
              <th className="px-3 py-2 font-semibold text-left text-xs sticky left-[140px] bg-blue-50 z-10">Name</th> {/* Adjust px value if needed */}
              <th className="px-3 py-2 font-semibold text-left text-xs">Purpose</th>
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
                  <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-xl border border-dashed border-gray-300">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-5xl text-blue-500 mb-4" />
                        <p className="text-gray-600 font-semibold text-lg animate-pulse">Searching Database...</p>
                      </div>
                </td>
              </tr>
              // Use the refined message function here
            ) : filteredAppointments.length > 0 ? (
                 // Map over filteredAppointments - keep this part the same
                 filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition group">
                       {/* Apply sticky positioning to corresponding TD cells */}
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.details.mrdNo || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.details.type || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate sticky left-[70px] bg-white group-hover:bg-gray-50 z-10">{appointment.details.emp_no || '-'}</td> 
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.details.aadhar || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate sticky left-[140px] bg-white group-hover:bg-gray-50 z-10">{appointment.details.name || '-'}</td> 
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment.details.register || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment?.consultation?.submittedNurse || appointment?.assessment?.submittedNurse || '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment?.assessment?.bookedDoctor||appointment?.consultation?.bookedDoctor|| '-'}</td>
                      <td className="px-3 py-2 text-xs text-gray-700 text-left truncate">{appointment?.consultation?.submittedDoctor || appointment?.assessment?.submittedDoctor || '-'}</td>
                      
                      <td className="px-3 py-2 text-xs text-gray-700 text-center">
                        <button
                          className={`px-2 py-1 rounded text-xs font-semibold mx-auto w-20 text-center bg-green-600 text-white opacity-70`}
                          onClick={() => handleStatusChange(appointment)}
                        >
                          Open
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

export default CurrentFootfalls;