import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const VisitHistory = ({data}) => {
  const [selectedYear, setSelectedYear] = useState("");
  const [visitReason, setVisitReason] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [visitData, setVisitData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();   
  const emp_no = data.emp_no;
  useEffect(() =>{
    const fetchVisitData = async () => {
      try {
        const response = await axios.post(`https://occupational-health-center-1.onrender.com/visitData/${emp_no}`);
        console.log(response.data.data)
        const data = await response.data.data;
        console.log(data);
        setVisitData(data);
        setFilteredData(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchVisitData();
  }, [])

  // Filter function
  const applyFilter = () => {
    const filtered = visitData.filter((item) => {
      return (
        (selectedYear ? item.year === selectedYear.split("-")[0] : true) &&
        (visitReason ? item.reason === visitReason : true)
      );
    });
    setFilteredData(filtered);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Filters */}
      <div className="grid gap-6 grid-cols-2 bg-white p-6 shadow-md rounded-lg mb-6">
        {/* Year Input */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select the Year
          </label>
          <input
            type="date"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Visit Reason & Apply Button */}
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Visit Reason
            </label>
            <select
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Reason</option>
              <option>Pre employement</option>
              <option>Pre employement (Food Handler)</option>
              <option>Pre Placement</option>
              <option>Annual / Periodical</option>
              <option>Periodical (Food Handler)</option>
              <option>Camps (Mandatory)</option>
              <option>Camps (Optional)</option>
              <option>Special Work Fitness</option>
              <option>Special Work Fitness (Renewal)</option>
              <option>Fitness After Medical Leave</option>
              <option>Mock Drill</option>
              <option>BP Sugar Check (Normal Value)</option>
            </select>
          </div>

          {/* Apply Button */}
          <button
            onClick={applyFilter}
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">MRD No.</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Purpose</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Visited Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                <div className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                </td>
              </tr>
            ) :
            filteredData.length > 0 ? (
              filteredData.map((visit, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-200">
                  <td className="px-6 py-4">{visit.mrdNo || 'Null'}</td>
                  <td className="px-6 py-4">{visit.register}</td>
                  <td className="px-6 py-4">{visit.date}</td>
                  <td className="px-6 py-4">
                    <button
                    onClick={() => {navigate("../summary", {state: {emp_no: emp_no, date: visit.date}})}} 
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitHistory;
