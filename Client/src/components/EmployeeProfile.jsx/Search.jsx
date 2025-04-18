import React, { useEffect, useState } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';

const Search = () => {
  const accessLevel = localStorage.getItem('accessLevel');
    const navigate = useNavigate();
    if(accessLevel === "nurse" || accessLevel === "doctor")
    {
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:8000/userData");
        setEmployees(response.data.data);
        setFilteredEmployees(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchDetails();
  }, []);

  const handleSearch = () => {
    if (searchId.trim() === "") {
      setFilteredEmployees(employees);
      localStorage.removeItem("selectedEmployee");
    } else {
      const filtered = employees.filter(emp =>
        emp.emp_no.toLowerCase().includes(searchId.toLowerCase())
      );
      setFilteredEmployees(filtered);

      if (filtered.length > 0) {
        const latestEmployee = filtered.sort((a, b) =>
          new Date(b.updated_at) - new Date(a.updated_at)
        )[0];

        localStorage.setItem("selectedEmployee", JSON.stringify(latestEmployee));
      }
    }
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-blue-300 to-blue-400">
      <Sidebar />
      <div className="p-8 w-4/5">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Search Employee</h1>
        
        <div className="bg-white h-[600px] shadow-xl rounded-xl p-8 transition-all duration-300 hover:shadow-2xl">
          {/* Search Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-grow">
              <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-600" />
              <input 
                type="text" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Search by Employee ID" 
                className="w-full bg-gray-100 py-3 pl-12 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">
              Search
            </button>
          </div>

          {/* Employee Table */}
          <div className="mt-6 overflow-auto max-h-[400px] bg-gray-50 rounded-lg p-4 shadow-md">
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Profile</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Worker ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Age</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Gender</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-100 transition duration-200">
                        <td className="px-6 py-4">
                        {(emp.profilepic_url)?(<img src={emp.profilepic_url} alt="" className='w-12 h-12 rounded-full text-gray-500'/>) :(<FaUserCircle className="w-12 h-12 text-gray-500" />)}
                        </td>
                        <td className="px-6 py-4">{emp.emp_no}</td>
                        <td className="px-6 py-4">{emp.role}</td>
                        <td className="px-6 py-4 flex items-center space-x-2">
                          
                          {emp.name || '-'}
                        </td>
                        <td className="px-6 py-4">
                          {new Date().getFullYear() - new Date(emp.dob).getFullYear()}
                        </td>
                        <td className="px-6 py-4">{emp.sex}</td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => navigate("../employeeprofile", { state: { data: emp } })}
                            className="w-28 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-500">
                        No employee found
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

export default Search;
