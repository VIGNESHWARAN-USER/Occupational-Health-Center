import React, { useState } from "react";

const FitnessPage = ({ data }) => {
  const allOptions = ["Height", "Gas Line", "Confined Space", "SCBA Rescue", "Fire Rescue"];
  const [selectedOptions, setSelectedOptions] = useState([]);
  console.log(data)
  const [formData, setFormData] = useState({
    emp_no: data[0]?.emp_no,
    tremors: "",
    romberg_test: "",
    acrophobia: "",
    trendelenberg_test: "",
  });

  console.log(data);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedOptions.includes(selectedValue)) {
      setSelectedOptions([...selectedOptions, selectedValue]);
    }
  };

  const handleRemoveSelected = (value) => {
    setSelectedOptions(selectedOptions.filter((option) => option !== value));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      emp_no: "", // Replace with actual employee number
      ...formData,
      job_nature: selectedOptions,
      overall_fitness: "",
      comments: "",
    };

    try {
      const response = await fetch("https://occupational-health-center-1.onrender.com/fitness-tests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit fitness data!");

      alert("Fitness data submitted successfully!");
      setFormData({ tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "" });
      setSelectedOptions([]);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white min-h-screen p-6 relative">
      <h1 className="text-3xl font-bold mb-8">Fitness</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {["tremors", "romberg_test", "acrophobia", "trendelenberg_test"].map((test) => (
          <div key={test} className="bg-blue-100 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">{test.replace("_", " ")}</h2>
            <div className="space-y-2">
              {["positive", "negative"].map((value) => (
                <label key={value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={test}
                    value={value}
                    checked={formData[test] === value}
                    onChange={handleInputChange}
                  />
                  <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Select Dropdown */}
      <div className="bg-blue-100 p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-lg font-semibold mb-4">Job Nature (Select Multiple Options)</h2>
        <select
          className="form-select block w-full p-3 border border-gray-300 rounded-md shadow-sm"
          onChange={handleSelectChange}
        >
          <option value="" disabled>-- Select an option --</option>
          {allOptions.map((option, index) => (
            <option key={index} value={option} disabled={selectedOptions.includes(option)}>
              {option}
            </option>
          ))}
        </select>

        {/* Selected options in a single row */}
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((option, index) => (
              <div key={index} className="flex items-center p-2 border border-gray-300 rounded-md bg-gray-100">
                <span className="mr-2">{option}</span>
                <button className="text-red-500 hover:underline" onClick={() => handleRemoveSelected(option)}>
                  ✖
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No options selected.</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="absolute bottom-6 right-6">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FitnessPage;