import React, { useState, useEffect } from "react";

const FitnessPage = ({ data }) => {
  const allOptions = ["Height", "Gas Line", "Confined Space", "SCBA Rescue", "Fire Rescue"];
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [conditionalOptions, setConditionalOptions] = useState([]);
  const [overallFitness, setOverallFitness] = useState("");
  const [formData, setFormData] = useState({
    emp_no: data[0]?.emp_no,
    tremors: "",
    romberg_test: "",
    acrophobia: "",
    trendelenberg_test: "",
  });
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (data && data[0] && data[0].fitnessassessment) {
      const assessmentData = data[0].fitnessassessment;

      setFormData({
        emp_no: assessmentData.emp_no || data[0]?.emp_no, // Prioritize existing emp_no
        tremors: assessmentData.tremors || "",
        romberg_test: assessmentData.romberg_test || "",
        acrophobia: assessmentData.acrophobia || "",
        trendelenberg_test: assessmentData.trendelenberg_test || "",
      });

      try {
        setSelectedOptions(assessmentData.job_nature || []);
      } catch (error) {
        console.error("Error parsing job_nature:", error);
        setSelectedOptions([]); // Set to empty array in case of parsing error
      }
      setConditionalOptions(assessmentData.conditional_fit_feilds || []);
      setOverallFitness(assessmentData.overall_fitness || "");
      setComments(assessmentData.comments || ""); // Load Existing Comments
    }
  }, [data]);

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

  const handleOverallFitnessChange = (e) => {
    setOverallFitness(e.target.value);
  };

  const handleConditionalSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !conditionalOptions.includes(selectedValue)) {
      setConditionalOptions([...conditionalOptions, selectedValue]);
    }
  };

  const handleRemoveConditionalSelected = (value) => {
    setConditionalOptions(conditionalOptions.filter((option) => option !== value));
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const handleSubmit = async () => {
    const today = new Date();
    const validityDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
    const validityDateString = validityDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    const payload = {
      emp_no: data[0]?.emp_no,
      employer: data[0]?.role,
      ...formData,
      job_nature: JSON.stringify(selectedOptions),  // Stringify this!
      overall_fitness: overallFitness,
      conditional_fit_feilds: conditionalOptions,
      validity: validityDateString,
      comments: comments, // Include Comments
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
      setConditionalOptions([]);
      setOverallFitness("");
      setComments("");  //Clear Comments after submission
    } catch (error) {
      alert(error.message);
    }
  };

  const accessLevel = localStorage.getItem("accessLevel");

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

      {/* Multi-Select Dropdown for Job Nature */}
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

        {accessLevel === "doctor" && (
          <>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-semibold mb-1">Overall Fitness</label>
              <select
                className="form-select block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                onChange={handleOverallFitnessChange}
                value={overallFitness}
              >
                <option value="" disabled>Select an option</option>
                <option value="fit">Fit</option>
                <option value="unfit">Unfit</option>
                <option value="conditional">Conditional Fit</option>
              </select>
            </div>

            {overallFitness === "conditional" && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-4">Fit For (Select Multiple Options)</h2>
                <select
                  className="form-select block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                  onChange={handleConditionalSelectChange}
                >
                  <option value="" disabled>-- Select an option --</option>
                  {allOptions.map((option, index) => (
                    <option key={index} value={option} disabled={conditionalOptions.includes(option)}>
                      {option}
                    </option>
                  ))}
                </select>

                {/* Selected options in a single row */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {conditionalOptions.length > 0 ? (
                    conditionalOptions.map((option, index) => (
                      <div key={index} className="flex items-center p-2 border border-gray-300 rounded-md bg-gray-100">
                        <span className="mr-2">{option}</span>
                        <button className="text-red-500 hover:underline" onClick={() => handleRemoveConditionalSelected(option)}>
                          ✖
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No options selected.</p>
                  )}
                </div>
              </div>
            )}
            <div className="mt-4">
              <label htmlFor="comments" className="block text-gray-700 text-sm font-semibold mb-1">
                Comments
              </label>
              <textarea
                id="comments"
                className="form-textarea block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                rows="3"
                value={comments}
                onChange={handleCommentsChange}
              ></textarea>
            </div>
          </>
        )}


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