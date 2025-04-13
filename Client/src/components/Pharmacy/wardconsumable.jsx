import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import Sidebar from "../Sidebar"; // Assuming Sidebar path is correct

const WardConsumables = () => {
  const [showForm, setShowForm] = useState(false); // Controls table/form visibility
  const [formData, setFormData] = useState({
    medicine_form: "",
    chemical_name: "",
    brand_name: "",
    dose_volume: "",
    quantity: "",
    expiry_date: "",
    consumed_date: new Date().toISOString().split("T")[0], // Default to today
  });

  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [chemicalSuggestions, setChemicalSuggestions] = useState([]);
  const [doseSuggestions, setDoseSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showChemicalSuggestions, setShowChemicalSuggestions] = useState(false);
  const [showDoseSuggestions, setShowDoseSuggestions] = useState(false);
  const [doseManuallyEntered, setDoseManuallyEntered] = useState(false);
  const [wardConsumables, setWardConsumables] = useState([]); // Changed state name
  const [loading, setLoading] = useState(true);

  const medicineOptions = ["Tablet", "Syrup", "Injection", "Creams", "Drops", "Fluids", "Other"];

  useEffect(() => {
    fetchWardConsumables(); // Changed function call
  }, []);

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const fetchWardConsumables = async () => { // Renamed function
    try {
      // Updated API endpoint for getting consumables
      const response = await axios.get("http://localhost:8000/get_ward_consumable/");
      setWardConsumables(response.data.ward_consumables || response.data); // Adjust based on actual API response structure
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ward consumables:", error);
      setMessage("Error fetching ward consumables list."); // User-friendly message
      setLoading(false);
    }
  };

  // --- Suggestion fetching functions remain largely the same ---
  // Debounced functions (assuming suggestion endpoints are reusable)
  const fetchBrandSuggestions = debounce(async (chemicalName, medicineForm) => {
    if (chemicalName.length < 3 || !medicineForm) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/get-brand-names/?chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setSuggestions(response.data.suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching brand name suggestions:", error);
    }
  }, 500);

  const fetchChemicalSuggestions = debounce(async (brandName, medicineForm) => {
    if (brandName.length < 3 || !medicineForm) {
      setChemicalSuggestions([]);
      setShowChemicalSuggestions(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/get-chemical-name-by-brand/?brand_name=${brandName}&medicine_form=${medicineForm}`);
      setChemicalSuggestions(response.data.suggestions);
      setShowChemicalSuggestions(true);
    } catch (error) {
      console.error("Error fetching chemical name suggestions:", error);
    }
  }, 500);

  const fetchDoseSuggestions = debounce(async (brandName, chemicalName, medicineForm) => {
    if (!brandName || !chemicalName || !medicineForm) return;
    try {
      const response = await axios.get(`http://localhost:8000/get-dose-volume/?brand_name=${brandName}&chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setDoseSuggestions(response.data.suggestions);
      setShowDoseSuggestions(response.data.suggestions.length > 1);
      if (!doseManuallyEntered && response.data.suggestions.length === 1) {
        setFormData((prevState) => ({
          ...prevState,
          dose_volume: response.data.suggestions[0],
        }));
      }
    } catch (error) {
      console.error("Error fetching dose suggestions:", error);
    }
  }, 500);
  // --- End of suggestion fetching functions ---


  // --- Suggestion click handlers remain the same ---
  const handleDoseSuggestionClick = (suggestion) => {
    setDoseManuallyEntered(false);
    setFormData((prevState) => ({
      ...prevState,
      dose_volume: suggestion,
    }));
    setShowDoseSuggestions(false);
  };

  const handleChemicalSuggestionClick = (suggestion) => {
    setFormData((prevState) => ({
      ...prevState,
      chemical_name: suggestion,
    }));
    setShowChemicalSuggestions(false);
    fetchBrandSuggestions(suggestion, formData.medicine_form);
    fetchDoseSuggestions(formData.brand_name, suggestion, formData.medicine_form);
  };

  const handleBrandSuggestionClick = (suggestion) => {
    setFormData((prevState) => ({
      ...prevState,
      brand_name: suggestion,
    }));
    setShowSuggestions(false);
    if (!formData.chemical_name) {
      fetchChemicalSuggestions(suggestion, formData.medicine_form);
    }
    fetchDoseSuggestions(suggestion, formData.chemical_name, formData.medicine_form);
  };
  // --- End of suggestion click handlers ---


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent changing consumed_date if needed, though readOnly attribute is better
    // if (name === 'consumed_date') return;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Trigger suggestion fetches based on changes
    if (name === "chemical_name") {
      fetchBrandSuggestions(value, formData.medicine_form);
    }

    if (name === "brand_name") {
      fetchChemicalSuggestions(value, formData.medicine_form);
      fetchDoseSuggestions(value, formData.chemical_name, formData.medicine_form);
    }

    if (name === "medicine_form") {
      // Reset suggestions if form changes
      setSuggestions([]);
      setChemicalSuggestions([]);
      setDoseSuggestions([]);
      // Optionally trigger fetches if chemical/brand already exist
       if (formData.chemical_name) fetchBrandSuggestions(formData.chemical_name, value);
       if (formData.brand_name) fetchChemicalSuggestions(formData.brand_name, value);
       if (formData.brand_name && formData.chemical_name) fetchDoseSuggestions(formData.brand_name, formData.chemical_name, value);
    }

    if (name === "dose_volume") {
      setDoseManuallyEntered(true); // User is typing dose manually
      setShowDoseSuggestions(false); // Hide suggestions when typing dose
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Updated validation check (removed reason, added consumed_date - though it has a default)
    if (!formData.medicine_form || !formData.brand_name || !formData.chemical_name || !formData.dose_volume || !formData.quantity || !formData.expiry_date || !formData.consumed_date) {
      setMessage("All fields except expiry date (optional) are required."); // Adjust message as needed
      return;
    }

     // Ensure consumed_date is today before submitting, although it's defaulted and readOnly
     const submissionData = {
        ...formData,
        consumed_date: getTodayDate() // Force today's date on submission
     };

    try {
       // Updated API endpoint for adding consumable
      await axios.post("http://localhost:8000/add_ward_consumable/", submissionData);
      setMessage("Ward consumable added successfully!");
      // Reset form, keeping consumed_date as today
      setFormData({
        medicine_form: "",
        chemical_name: "",
        brand_name: "",
        dose_volume: "",
        quantity: "",
        expiry_date: "",
        consumed_date: getTodayDate(), // Reset to today
       });
      fetchWardConsumables(); // Refresh the list
      setShowForm(false); // Return to table view
    } catch (error) {
      console.error("Error adding ward consumable:", error);
      // Provide more specific error feedback if possible (e.g., from error.response.data)
      const errorMsg = error.response?.data?.detail || "Error adding ward consumable. Please try again.";
      setMessage(errorMsg);
    }
  };

  // Handler to show form and reset consumed_date to today
  const handleShowForm = () => {
    setFormData(prevState => ({
        ...prevState, // Keep other potential form data if needed
        medicine_form: "", // Clear specific fields on showing form
        chemical_name: "",
        brand_name: "",
        dose_volume: "",
        quantity: "",
        expiry_date: "",
        consumed_date: getTodayDate() // Ensure consumed_date is today when form is opened
    }));
    setMessage(""); // Clear previous messages
    setShowForm(true);
  };


  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        {!showForm ? (
          <div>
            <button
              className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow focus:outline-none focus:shadow-outline"
              onClick={handleShowForm} // Use handler to set today's date
            >
              Add Ward Consumable {/* Changed button text */}
            </button>
            <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto"> {/* Added overflow-x-auto */}
              <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">Ward Consumables</h2> {/* Changed title */}
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : wardConsumables.length === 0 ? (
                 <p className="text-center text-gray-500">No ward consumables recorded yet.</p>
              ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      {/* Updated table headers */}
                      <th className="p-3 text-left">Form</th>
                      <th className="p-3 text-left">Chemical</th>
                      <th className="p-3 text-left">Brand</th>
                      <th className="p-3 text-left">Dose</th>
                      <th className="p-3 text-left">Quantity</th>
                      <th className="p-3 text-left">Expiry Date</th>
                      <th className="p-3 text-left">Consumed Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm font-light">
                    {/* Map over wardConsumables */}
                    {wardConsumables.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                        {/* Updated table data cells */}
                        <td className="p-3">{item.medicine_form}</td>
                        <td className="p-3">{item.chemical_name}</td>
                        <td className="p-3">{item.brand_name}</td>
                        <td className="p-3">{item.dose_volume}</td>
                        <td className="p-3 font-bold">{item.quantity}</td>
                        <td className="p-3">{item.expiry_date || 'N/A'}</td> {/* Handle potentially null expiry */}
                        <td className="p-3 text-red-600 font-semibold">{item.consumed_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl"> {/* Enhanced styling */}
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Add Ward Consumable</h2> {/* Changed title */}
            {message && (
                <p className={`mb-4 p-3 rounded-lg ${message.includes("successfully") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
               {/* Medicine Form Dropdown */}
               <div>
                 <label className="block text-gray-700 font-medium mb-1">Medicine Form <span className="text-red-500">*</span></label>
                 <select
                    name="medicine_form"
                    value={formData.medicine_form}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required // Added required attribute
                 >
                   <option value="">Select Form</option>
                   {medicineOptions.map((option) => (
                     <option key={option} value={option}>{option}</option>
                   ))}
                 </select>
               </div>

               {/* Chemical Name Input with Suggestions */}
               <div className="relative">
                 <label className="block text-gray-700 font-medium mb-1">Chemical Name <span className="text-red-500">*</span></label>
                 <input
                   type="text"
                   name="chemical_name"
                   value={formData.chemical_name}
                   onChange={handleChange}
                   className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   required
                   autoComplete="off" // Prevent browser autocomplete interfering with suggestions
                 />
                 {showChemicalSuggestions && chemicalSuggestions.length > 0 && (
                   <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto rounded-lg shadow-lg">
                     {chemicalSuggestions.map((suggestion) => (
                       <li
                         key={suggestion}
                         onClick={() => handleChemicalSuggestionClick(suggestion)}
                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                       >
                         {suggestion}
                       </li>
                     ))}
                   </ul>
                 )}
               </div>

               {/* Brand Name Input with Suggestions */}
               <div className="relative">
                 <label className="block text-gray-700 font-medium mb-1">Brand Name <span className="text-red-500">*</span></label>
                 <input
                   type="text"
                   name="brand_name"
                   value={formData.brand_name}
                   onChange={handleChange}
                   className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   required
                   autoComplete="off"
                 />
                 {showSuggestions && suggestions.length > 0 && (
                   <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto rounded-lg shadow-lg">
                     {suggestions.map((suggestion) => (
                       <li
                         key={suggestion}
                         onClick={() => handleBrandSuggestionClick(suggestion)}
                         className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                       >
                         {suggestion}
                       </li>
                     ))}
                   </ul>
                 )}
               </div>

              {/* Dose/Volume Input with Suggestions */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-1">Dose/Volume <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="dose_volume"
                  value={formData.dose_volume}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  autoComplete="off"
                />
                {showDoseSuggestions && doseSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-y-auto rounded-lg shadow-lg">
                    {doseSuggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        onClick={() => handleDoseSuggestionClick(suggestion)}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Quantity <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1" // Ensure quantity is positive
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Expiry Date Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Expiry Date</label>
                <input
                  type="month"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

               {/* Consumed Date Input (Read Only) */}
               <div>
                 <label className="block text-gray-700 font-medium mb-1">Consumed Date <span className="text-red-500">*</span></label>
                 <input
                   type="date"
                   name="consumed_date"
                   value={formData.consumed_date}
                   // onChange={handleChange} // Disable direct changes by user
                   readOnly // Make field read-only
                   className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed" // Style as read-only
                   required
                 />
               </div>

              {/* Removed Reason Textarea */}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Add Consumable {/* Changed button text */}
              </button>
            </form>
            <button
              className="mt-6 text-blue-600 hover:underline"
              onClick={() => setShowForm(false)}
            >
              Back to Consumables List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardConsumables;