import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/SideBar';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [employees, setEmployees] = useState([]); // Stores all employee data
  const [searchId, setSearchId] = useState(""); // Stores the search query
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Stores filtered data
  const navigate = useNavigate()
  useEffect(() => {

    const fetchDetails = async () => {
      try {
        const response = await axios.post("http://localhost:8000/userData");
        setEmployees(response.data.data);
        setFilteredEmployees(response.data.data); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDetails();
  }, []);

  // Search function
  const handleSearch = () => {
    if (searchId.trim() === "") {
      setFilteredEmployees(employees); 
    } else {
      const filtered = employees.filter(emp => 
        emp.emp_no.toLowerCase().includes(searchId.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  };

  return (
    <div className='h-screen flex'>
      <Sidebar />
      <div className='p-8 w-4/5'>
        <h1 className='text-2xl font-bold'>Search By Employee ID</h1>
        <div className='bg-white h-5/6 mt-6 p-8 rounded-lg'>
          
          {/* Search Bar */}
          <div className='w-full flex items-center space-x-4'>
            <div className='relative flex-grow'>
              <FaSearch className='absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-700' />
              <input 
                type="text" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder='Search By Employee ID' 
                className='w-full bg-blue-100 py-4 pl-10 pr-4 rounded-lg'
              />
            </div>
            <button 
              onClick={handleSearch}
              className='bg-blue-500 text-white py-4 px-6 rounded-lg font-medium flex-shrink-0 w-1/4'>
              Search
            </button>
          </div>

          {/* Employee Table */}
          <div className='mt-6 overflow-auto max-h-[400px] bg-gray-100 rounded-lg p-4'>
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Employee ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Age</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4">{emp.emp_no}</td>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      <FaUserCircle className="w-5 h-5 text-gray-500" />
                      <span>{emp.name}</span>
                    </td>
                    <td className="px-6 py-4">{new Date().getFullYear() - new Date(emp.dob).getFullYear()}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={()=>{navigate("../employeeprofile",{state:{data:emp}})}}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">No employee found</td>
                  </tr>
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
