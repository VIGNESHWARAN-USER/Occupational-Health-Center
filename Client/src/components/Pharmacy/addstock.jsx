import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash"; // ✅ Import debounce
import Sidebar from "../Sidebar";

const AddStock = () => {
  const [formData, setFormData] = useState({
    medicine_form: "",
    brand_name: "",
    chemical_name: "",
    dose_volume: "",
    quantity: "",
    expiry_date: "",
  });

  const [message, setMessage] = useState("");
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [chemicalSuggestions, setChemicalSuggestions] = useState([]);
  const [doseSuggestions, setDoseSuggestions] = useState([]);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [showChemicalSuggestions, setShowChemicalSuggestions] = useState(false);
  const [showDoseSuggestions, setShowDoseSuggestions] = useState(false);
  const [doseManuallyEntered, setDoseManuallyEntered] = useState(false);

  const medicineOptions = ["Tablet", "Syrup", "Injection", "Creams", "Drops", "Fluids", "Other"];

  // Debounced functions
  const fetchBrandSuggestions = debounce(async (chemicalName, medicineForm) => {
    if (chemicalName.length < 3 || !medicineForm) {
      setBrandSuggestions([]);
      setShowBrandSuggestions(false);
      return;
    }

    try {
      const response = await axios.get(`https://occupational-health-center-1.onrender.com/get-brand-names/?chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setBrandSuggestions(response.data.suggestions);
      setShowBrandSuggestions(true);
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
      const response = await axios.get(`https://occupational-health-center-1.onrender.com/get-chemical-name-by-brand/?brand_name=${brandName}&medicine_form=${medicineForm}`);
      setChemicalSuggestions(response.data.suggestions);
      setShowChemicalSuggestions(true);
    } catch (error) {
      console.error("Error fetching chemical name suggestions:", error);
    }
  }, 500);

  const fetchDoseSuggestions = debounce(async (brandName, chemicalName, medicineForm) => {
  if (!brandName || !chemicalName || !medicineForm) return;

  try {
    const response = await axios.get(`https://occupational-health-center-1.onrender.com/get-dose-volume/?brand_name=${brandName}&chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
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
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "chemical_name") {
      fetchBrandSuggestions(value, formData.medicine_form);
    }

    if (name === "brand_name") {
      fetchChemicalSuggestions(value, formData.medicine_form);
      fetchDoseSuggestions(value, formData.chemical_name, formData.medicine_form);
    }

    if (name === "medicine_form") {
      setBrandSuggestions([]);
      setChemicalSuggestions([]);
      setDoseSuggestions([]);
    }

    if (name === "dose_volume") {
      setDoseManuallyEntered(true);
      setShowDoseSuggestions(false);
    }
  };

  const handleBrandSuggestionClick = (suggestion) => {
    setFormData((prevState) => ({
      ...prevState,
      brand_name: suggestion,
    }));
    setShowBrandSuggestions(false);
    if (!formData.chemical_name) {
      fetchChemicalSuggestions(suggestion, formData.medicine_form);
    }
    fetchDoseSuggestions(suggestion, formData.chemical_name, formData.medicine_form);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.medicine_form || !formData.brand_name || !formData.chemical_name || !formData.dose_volume || !formData.quantity || !formData.expiry_date) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await axios.post("https://occupational-health-center-1.onrender.com/add-stock/", formData);
      setMessage(response.data.message);

      setFormData({
        medicine_form: "",
        brand_name: "",
        chemical_name: "",
        dose_volume: "",
        quantity: "",
        expiry_date: "",
      });
      setDoseManuallyEntered(false);
    } catch (error) {
      console.error("Error adding stock:", error);
      setMessage("Error adding stock. Please try again.");
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Add Stock</h2>
          {message && <p className="text-red-600">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
              <label className="block font-medium">Medicine Form</label>
              <select name="medicine_form" value={formData.medicine_form} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg">
                <option value="">Select</option>
                {medicineOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block font-medium">Chemical Name</label>
              <input
                type="text"
                name="chemical_name"
                value={formData.chemical_name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
                autoComplete="off"
              />
              {showChemicalSuggestions && chemicalSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-md">
                  {chemicalSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleChemicalSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative">
              <label className="block font-medium">Brand Name</label>
              <input
                type="text"
                name="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
                autoComplete="off"
              />
              {showBrandSuggestions && brandSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-md">
                  {brandSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleBrandSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative">
              <label className="block font-medium">Dose / Volume</label>
              <input
                type="text"
                name="dose_volume"
                value={formData.dose_volume}
                onChange={handleChange} // ✅ Allow manual entry
                className="w-full border px-3 py-2 rounded-lg"
              />
              {showDoseSuggestions && doseSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-md">
                  {doseSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleDoseSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block font-medium">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
            </div>

            <div>
              <label className="block font-medium">Expiry Date</label>
              <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Add Stock
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStock;
