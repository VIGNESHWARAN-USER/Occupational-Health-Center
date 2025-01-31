import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const FitnessPage = () => {
  const [options, setOptions] = useState(["Height Work", "2", "3", "4"]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue) {
      setSelectedOptions([...selectedOptions, selectedValue]);
      setOptions(options.filter((option) => option !== selectedValue));
    }
  };

  const handleRemoveSelected = (value) => {
    setOptions([...options, value]);
    setSelectedOptions(selectedOptions.filter((option) => option !== value));
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8">Fitness</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tremors and Romberg Test */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Tremors</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="tremors" className="form-radio" />
              <span>Positive</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="tremors" className="form-radio" />
              <span>Negative</span>
            </label>
          </div>
        </div>

        <div className="bg-blue-100 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Romberg Test</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="romberg" className="form-radio" />
              <span>Positive</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="romberg" className="form-radio" />
              <span>Negative</span>
            </label>
          </div>
        </div>

        {/* Acrophobia and Trendelenberg Test */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Acrophobia</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="acrophobia" className="form-radio" />
              <span>Positive</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="acrophobia" className="form-radio" />
              <span>Negative</span>
            </label>
          </div>
        </div>

        <div className="bg-blue-100 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Trendelenberg Test</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="trendelenberg" className="form-radio" />
              <span>Positive</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="trendelenberg" className="form-radio" />
              <span>Negative</span>
            </label>
          </div>
        </div>
      </div>

      {/* Multi-Select Dropdown */}
      <div className="bg-blue-100 p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-lg font-semibold mb-4">Job Nature (Select Multiple Options)</h2>
        <div className="relative mb-4">
          <select
            id="jobNature"
            className="form-select block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={handleSelectChange}
            value="" // Reset dropdown after each selection
          >
            <option value="" disabled>
              -- Select an option --
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Options:</h3>
          <div className="space-y-2">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-300 rounded-md shadow-sm"
                >
                  <span>{option}</span>
                  <button
                    className="text-red-500 text-sm font-medium hover:underline"
                    onClick={() => handleRemoveSelected(option)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No options selected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessPage;