import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";

const filterSections = [
  { id: "position", label: "Position" },
  { id: "personaldetails", label: "Personal Details" },
  { id: "employmentdetails", label: "Employment Details" },
  { id: "medicalhistory", label: "Medical History" },
  { id: "vaccination", label: "Vaccination" },
  { id: "employmentstatus", label: "Employment Status" },
  { id: "preventive", label: "Preventive" },
  { id: "curative", label: "Curative" },
];

const RecordsFilters = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const handleFilterClick = (section) => {
    
    setSelectedSection(section);
  };

  const removeFilter = (section) => {
    setSelectedFilters(selectedFilters.filter((item) => item !== section));
    if (selectedSection === section) {
      setSelectedSection(null);
    }
  };

  const addFilter = (formData) => {
    const filteredData = Object.entries(formData)
      .filter(([_, value]) => value !== "") // Remove empty values
      .map(([key, value]) => ({ [key]: value })); // Convert to an array of key-value objects
  
    setSelectedFilters((prevFilters) => {
      const updatedFilters = [...prevFilters]; // Clone existing filters
  
      filteredData.forEach((newFilter) => {
        const [newKey] = Object.keys(newFilter);
        const existingIndex = updatedFilters.findIndex(
          (filter) => Object.keys(filter)[0] === newKey
        );
  
        if (existingIndex !== -1) {
          // Override existing key-value pair
          updatedFilters[existingIndex] = newFilter;
        } else {
          // Add new key-value pair
          updatedFilters.push(newFilter);
        }
      });
  
      return updatedFilters;
    });
  };
  

  return (
    <div className="h-screen bg-[#8fcadd] flex">
      <Sidebar />
      <div className="h-screen overflow-auto flex w-4/5 flex-col">
      {/* Selected Filters Display */}
      <div className="p-4 flex flex-wrap gap-2 bg-gray-100 rounded-xl border-gray-300">
        {selectedFilters.length > 0 ? (
          selectedFilters.map((filter) => (
            <motion.div
              key={filter}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-full shadow"
            >
              {`${Object.entries(filter)[0][0].toUpperCase()} : ${Object.entries(filter)[0][1]}`}
              <X
                size={16}
                className="ml-2 cursor-pointer"
                onClick={() => removeFilter(filter)}
              />
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No filters selected</p>
        )}
      </div>

      {/* Dropdown Filter Selector */}
      <div className="relative p-4">
  <select
    className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    onChange={(e) => handleFilterClick(e.target.value)}
  >
    <option value="" disabled selected>
      Select Filters
    </option>
    {filterSections.map((section) => (
      <option key={section.id} value={section.id}>
        {section.label}
      </option>
    ))}
  </select>
</div>


      {/* Filter Sections - Conditionally Rendered */}
      <div className="p-4">
        <AnimatePresence>
          {selectedSection && (
            <motion.div
              key={selectedSection}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="p-6 bg-white shadow rounded-lg"
            >
              <h2 className="text-xl font-semibold mb-4">
                {filterSections.find((f) => f.id === selectedSection)?.label}
              </h2>
              {(selectedSection === "personaldetails")? <PersonalDetails addFilter={addFilter}/>:selectedSection }
            </motion.div>
          )}
        </AnimatePresence>
      </div></div>
    </div>
  );
};

export default RecordsFilters;


const PersonalDetails = ({ addFilter }) => {
  const [formData, setformData] = useState({
    age: "",
    gender: "",
    bloodgroup: "",
    marital_status: "",
    bmi: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-6">
      {/* Age Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter age"
        />
      </div>

      {/* Sex Input */}
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Sex
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Blood Group Input */}
      <div>
        <label htmlFor="bloodgroup" className="block text-sm font-medium text-gray-700">
          Blood Group
        </label>
        <input
          type="text"
          name="bloodgroup"
          value={formData.bloodgroup}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Blood Group"
        />
      </div>

      {/* Marital Status Input */}
      <div>
        <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">
          Marital Status
        </label>
        <select
          name="marital_status"
          value={formData.marital_status}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Marital Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>

      {/* BMI Input */}
      <div>
        <label htmlFor="bmi" className="block text-sm font-medium text-gray-700">
          BMI (Body Mass Index)
        </label>
        <input
          type="number"
          name="bmi"
          value={formData.bmi}
          onChange={handleChange}
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter BMI"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={() => {
          const filteredData = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== "")
          );
          addFilter(filteredData);
        }}      
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
      >
        Add to Filter
      </button>
    </div>
  );
};

