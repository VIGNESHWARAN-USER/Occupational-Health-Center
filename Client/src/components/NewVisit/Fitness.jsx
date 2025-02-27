import React, { useState } from "react";

const FitnessPage = ({data}) => {
  const [options, setOptions] = useState(["Height Work", "2", "3", "4"]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [formData, setFormData] = useState({
    tremors: "",
    romberg_test: "",
    acrophobia: "",
    trendelenberg_test: "",
  });
  console.log(data)
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      setSelectedOptions([...selectedOptions, selectedValue]);
      setOptions(options.filter((option) => option !== selectedValue));
    }
  };
console.log(selectedOptions)
  const handleRemoveSelected = (value) => {
    setOptions([...options, value]);
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
      const response = await fetch("http://localhost:8000/fitness-tests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit fitness data!");

      alert("Fitness data submitted successfully!");
      setFormData({ tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "" });
      setSelectedOptions([]);
      setOptions(["Height Work", "2", "3", "4"]);
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
          {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>

        {/* Selected options */}
        <div className="space-y-2 mt-4">
          {selectedOptions.length > 0 ? selectedOptions.map((option, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
              <span>{option}</span>
              <button className="text-red-500 hover:underline" onClick={() => handleRemoveSelected(option)}>Remove</button>
            </div>
          )) : <p className="text-sm text-gray-500">No options selected.</p>}
        </div>
      </div>

      {/* Submit Button */}
      <div className="absolute bottom-6 right-6">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default FitnessPage;