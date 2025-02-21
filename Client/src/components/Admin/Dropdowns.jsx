import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa"; // Import the plus icon

const Dropdowns = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState({
    Vaccine: ["Covid", "Radissea"],
    Employer: ["JSW Cements", "JSW Steels"],
    Contractor: ["A", "B"],
    NatureOfJob: ["Fire Works", "Height Works"],
    Department: ["Option 1", "Option 2"],
  });

  const handleAddOption = (category) => {
    const newOption = prompt(`Add a new option to ${category}`);
    if (newOption) {
      setDropdownOptions((prevState) => ({
        ...prevState,
        [category]: [...prevState[category], newOption],
      }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <div className=" flex h-screen overflow-hidden bg-[#8fcadd]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <motion.div
        className="w-full p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Dynamic Dropdowns
        </h1>

        {/* Buttons Container */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 p-6 bg-white shadow-md rounded-lg"
          variants={containerVariants}
        >
          {Object.keys(dropdownOptions).map((category, index) => {
            const isSelected = selectedButton === category;
            return (
              <motion.button
                key={index}
                onClick={() =>
                  setSelectedButton(isSelected ? null : category)
                }
                className={`px-6 py-3 rounded-lg font-semibold text-gray-800 transition ${
                  isSelected
                    ? "ring-4 ring-blue-200 bg-blue-100 text-blue-800"
                    : "hover:bg-gray-200 bg-white shadow-sm"
                }`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {category}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Dropdown Section */}
        {selectedButton && (
          <motion.div
            className="bg-white p-6 mt-6 rounded-lg shadow-md"
            variants={containerVariants}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {selectedButton} Options
            </h2>
            <select
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dropdownOptions[selectedButton].map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
            <button
              onClick={() => handleAddOption(selectedButton)}
              className="px-5 py-3 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition flex items-center space-x-2"
            >
              <FaPlus className="text-sm" />
              <span>Add New Option</span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dropdowns; 