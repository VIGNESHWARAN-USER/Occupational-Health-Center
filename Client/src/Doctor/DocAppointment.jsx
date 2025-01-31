import React, { useState } from "react";
import DocSidebar from '../Sidebar/DocSideBar';

const AllAppointments = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const handleApply = () => {
    console.log("From:", fromDate, "To:", toDate, "Category:", selectedCategory);
  };

  const handleSearch = () => {
    console.log("Searching for Employee ID:", employeeId);
  };

  const categories = [
    "Pre Employment",
    "Pre Placement",
    "Annual/Periodical",
    "Camps",
    "Fitness After Medical Leave",
    "Illness",
    "Injury",
    "Followup Visit",
    "Special Work Fitness",
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <DocSidebar />

      {/* Main Content */}
      <div className="w-4/5 p-6 h-screen overflow-auto bg-[#EAF2FA]">
        {/* Date Range and Category Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* From Date Field */}
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* To Date Field */}
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          
        </div>

        {/* Apply Button */}
        <div className="mb-6">
          <button
            onClick={handleApply}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Apply
          </button>
        </div>

        {/* Search Section */}
        <div className="flex items-center gap-6">
            
          <input
            type="text"
            placeholder="Search by Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full md:w-1/3 px-4 py-4 border rounded-lg"
          />
          
          {/* Category Dropdown Field */}
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Search
          </button>

        </div>
      </div>
    </div>
  );
};

export default AllAppointments;
