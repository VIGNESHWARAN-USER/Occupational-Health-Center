import React, { useState } from "react";
import AdminSidebar from "../Sidebar/AdminSidebar";

function Dropdowns() {
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

  return (
    <div className="bg-blue-100 flex h-screen">
      <AdminSidebar/>
      <div className="w-4/5 p-8">
      <h1 className="text-3xl font-bold text-black mb-6">Dropdowns</h1>
      {/* Buttons Container */}
      <div className="flex flex-wrap bg-white items-center justify-center gap-6 p-4  shadow-lg rounded-lg">
        {Object.keys(dropdownOptions).map((category, index) => {
          const isSelected = selectedButton === category;
          return (
            <button
              key={index}
              onClick={() =>
                setSelectedButton(isSelected ? null : category)
              }
              className={`px-6 py-3 rounded-lg font-semibold text-black transition ${
                isSelected
                  ? "ring-4 ring-blue-300 bg-blue-300"
                  : "hover:bg-blue-500 bg-white shadow"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Dropdown Section */}
      {selectedButton && (
        <div className="bg-white p-6 mt-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-black mb-4">
            {selectedButton} Options
          </h2>
          <select
            className="w-full p-2 mb-4 border border-blue-300 rounded-lg bg-blue-100"
          >
            {dropdownOptions[selectedButton].map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
          <button
            onClick={() => handleAddOption(selectedButton)}
            className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-950 hover:bg-blue-800 transition"
          >
            Add New Dropdown Option
          </button>
        </div>
      )}
    </div>
    </div>
  );
}

export default Dropdowns;
