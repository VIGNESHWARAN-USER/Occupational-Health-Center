import React, { useEffect, useState } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';

const Search = () => {
  const accessLevel = localStorage.getItem('accessLevel');
  const navigate = useNavigate(); // Define navigate once

  // Check access level early
  if (accessLevel !== "nurse" && accessLevel !== "doctor") {
    return (
      <section className="bg-white h-full flex items-center dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            {/* Using 403 for Forbidden Access might be more accurate than 404 */}
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">403</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Access Denied.</p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, you don't have permission to access this page.</p>
            <button onClick={() => navigate(-1)} className="inline-flex text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-900 my-4">Go Back</button>
          </div>
        </div>
      </section>
    );
  }

  // State declarations only if access is granted
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState(""); // Represents Aadhar number now
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // Consider optimizing: Fetch only necessary fields if the list is very large
        const response = await axios.post("https://occupational-health-center-1.onrender.com/userData");
        setEmployees(response.data.data);
        setFilteredEmployees(response.data.data); // Initially show all
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error display to user if needed
      } finally { // Use finally to ensure loading is set to false
        setLoading(false);
      }
    };
    fetchDetails();
  }, []); // Empty dependency array means this runs once on mount

  const handleSearch = () => {
    const searchTerm = searchId.trim(); // Trim whitespace
    if (searchTerm === "") {
      setFilteredEmployees(employees); // Show all if search is empty
      localStorage.removeItem("selectedEmployee"); // Clear selection if needed
    } else {
      // Filter by Aadhar number (exact match is usually best for Aadhar)
      const filtered = employees.filter(emp =>
        emp.aadhar === searchTerm // Check for exact match
        // If partial match is desired: emp.aadhar && emp.aadhar.includes(searchTerm)
      );
      setFilteredEmployees(filtered);

      // Optional: Update localStorage if needed, though clicking "View" passes data directly
      if (filtered.length > 0) {
        // Find the latest record among the matches if multiple exist (unlikely for unique Aadhar)
        const latestEmployee = filtered.sort((a, b) =>
           // Use a reliable timestamp; assuming id increments or use an 'updated_at' field
           (b.id || 0) - (a.id || 0) // Example: Sort by id descending
        )[0];
        localStorage.setItem("selectedEmployee", JSON.stringify(latestEmployee));
      } else {
         localStorage.removeItem("selectedEmployee"); // Clear if no match
      }
    }
  };

  // Calculate age safely
  const calculateAge = (dob) => {
    if (!dob) return '-';
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
       // Handle cases where DOB might be invalid or in the future
      return age >= 0 ? age : '-';
    } catch (e) {
      console.error("Error calculating age:", e);
      return '-';
    }
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-blue-300 to-blue-400">
      <Sidebar />
      <div className="p-8 w-4/5 overflow-y-auto"> {/* Added overflow-y-auto */}
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Search Person</h1>

        <div className="bg-white shadow-xl rounded-xl p-8 transition-all duration-300 hover:shadow-2xl">
          {/* Search Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-grow">
              <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-600" />
              <input
                type="text" // Use text initially, or number if you enforce digits
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.replace(/\D/g, ''))} // Allow only digits
                maxLength={12} // Aadhar is 12 digits
                placeholder="Search by Aadhar Number (12 digits)" // Updated placeholder
                className="w-full bg-gray-100 py-3 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || searchId.length > 0 && searchId.length !== 12} // Disable search if loading or length is invalid (but not empty)
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 disabled:opacity-50"
            >
              Search
            </button>
          </div>

          {/* Employee Table - Added min-height for consistency */}
          <div className="mt-6 overflow-auto max-h-[450px] min-h-[200px] bg-gray-50 rounded-lg p-4 shadow-inner"> {/* Added shadow-inner */}
            <table className="min-w-full bg-white rounded-lg "> {/* Removed shadow-lg here */}
              <thead className="bg-blue-500 text-white sticky top-0 z-10"> {/* Make header sticky */}
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Profile</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Worker ID</th>
                  {/* Added Aadhar Number column */}
                  <th className="px-6 py-3 text-left text-sm font-medium">Aadhar Number</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Age</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Gender</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              {/* Use shadow on the container, not individual body */}
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    {/* Updated colspan */}
                    <td colSpan="8" className="text-center py-10">
                      <div className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                      <p className='text-gray-500 mt-2'>Loading Data...</p>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id || emp.aadhar} className="hover:bg-gray-100 transition duration-200">
                        <td className="px-6 py-4 align-middle"> {/* Use align-middle */}
                           {/* Display actual image or placeholder */}
                          {emp.profilepic_url ? (
                             <img src={emp.profilepic_url} alt={`${emp.name || 'User'} profile`} className='w-12 h-12 rounded-full object-cover text-gray-500'/>
                           ) : (
                             <FaUserCircle className="w-12 h-12 text-gray-400" />
                           )}
                        </td>
                        {/* Display Worker ID or '-' if not applicable/present */}
                        <td className="px-6 py-4 align-middle">{emp.emp_no || '-'}</td>
                        {/* Display Aadhar Number */}
                        <td className="px-6 py-4 align-middle">{emp.aadhar || '-'}</td>
                        <td className="px-6 py-4 align-middle">{emp.role || '-'}</td>
                        <td className="px-6 py-4 align-middle">
                          {emp.name || '-'}
                        </td>
                        <td className="px-6 py-4 align-middle">
                          {calculateAge(emp.dob)} {/* Use safe age calculation */}
                        </td>
                        <td className="px-6 py-4 align-middle">{emp.sex || '-'}</td>
                        <td className="px-6 py-4 align-middle">
                          <button
                            // Pass the specific employee data in state
                            onClick={() => navigate("../employeeprofile", { state: { data: emp } })}
                            className="w-28 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 text-sm"> {/* Adjusted padding/size */}
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      {/* Updated colspan */}
                      <td colSpan="8" className="text-center py-10 text-gray-500">
                        No person found matching the criteria.
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;