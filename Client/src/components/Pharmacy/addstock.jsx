import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash"; 
import Sidebar from "../Sidebar";
import { useNavigate } from "react-router-dom";
import { FaHistory } from "react-icons/fa";

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

  const navigate = useNavigate();

  const medicineOptions = [
    "Tablet", "Syrup", "Injection", "Lotions", "Respules", 
    "Powder", "Creams", "Drops", "Fluids", "Other", 
    "Suture & Procedure Items", "Dressing Items"
  ];

  // Helper to check if the selected form is one of the special categories
  const isSpecialCategory = ["Suture & Procedure Items", "Dressing Items"].includes(formData.medicine_form);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // These get requests are fine, assuming endpoints exist
        await axios.get("http://localhost:8000/archive_stock/");
        await axios.get("http://localhost:8000/current_expiry/");
      } catch (error) {
        console.error("Error fetching initial data", error);
      }
    };
    fetchData();
  }, []);

  // --- Debounced Functions ---
  const fetchBrandSuggestions = debounce(async (chemicalName, medicineForm) => {
    if (chemicalName.length < 3 || !medicineForm) {
      setBrandSuggestions([]);
      setShowBrandSuggestions(false);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/get-brand-names/?chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setBrandSuggestions(response.data.suggestions);
      setShowBrandSuggestions(true);
    } catch (error) { console.error(error); }
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
    } catch (error) { console.error(error); }
  }, 500);

  const fetchDoseSuggestions = debounce(async (brandName, chemicalName, medicineForm) => {
    if (!brandName || !chemicalName || !medicineForm) return;
    try {
      const response = await axios.get(`http://localhost:8000/get-dose-volume/?brand_name=${brandName}&chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setDoseSuggestions(response.data.suggestions);
      setShowDoseSuggestions(response.data.suggestions.length > 1);
      if (!doseManuallyEntered && response.data.suggestions.length === 1) {
        setFormData((prev) => ({ ...prev, dose_volume: response.data.suggestions[0] }));
      }
    } catch (error) { console.error(error); }
  }, 500);

  // --- Handlers ---

  const handleSuggestionClick = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (field === "chemical_name") {
      setShowChemicalSuggestions(false);
      fetchBrandSuggestions(value, formData.medicine_form);
      fetchDoseSuggestions(formData.brand_name, value, formData.medicine_form);
    } else if (field === "brand_name") {
      setShowBrandSuggestions(false);
      if (!formData.chemical_name) fetchChemicalSuggestions(value, formData.medicine_form);
      fetchDoseSuggestions(value, formData.chemical_name, formData.medicine_form);
    } else if (field === "dose_volume") {
      setDoseManuallyEntered(false);
      setShowDoseSuggestions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (isSpecialCategory) return;

    if (name === "chemical_name") fetchBrandSuggestions(value, formData.medicine_form);
    if (name === "brand_name") {
      fetchChemicalSuggestions(value, formData.medicine_form);
      fetchDoseSuggestions(value, formData.chemical_name, formData.medicine_form);
    }
    if (name === "medicine_form") {
      setBrandSuggestions([]);
      setChemicalSuggestions([]);
      setDoseSuggestions([]);
      setFormData(prev => ({ ...prev, brand_name: "", chemical_name: "", dose_volume: "" }));
    }
    if (name === "dose_volume") {
      setDoseManuallyEntered(true);
      setShowDoseSuggestions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // --- Validation Logic ---
    if (isSpecialCategory) {
      if (!formData.medicine_form || !formData.brand_name || !formData.quantity || !formData.expiry_date) {
        setMessage("Item Name, Quantity, and Expiry Date are required.");
        return;
      }
    } else {
      if (!formData.medicine_form || !formData.brand_name || !formData.chemical_name || !formData.dose_volume || !formData.quantity || !formData.expiry_date) {
        setMessage("All fields are required.");
        return;
      }
    }

    // --- Prepare Payload ---
    // ✅ CHANGED: Send null instead of "N/A"
    const submissionData = {
      ...formData,
      chemical_name: isSpecialCategory ? null : formData.chemical_name,
      dose_volume: isSpecialCategory ? null : formData.dose_volume,
    };

    try {
      const response = await axios.post("http://localhost:8000/add-stock/", submissionData);
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
        <div className="flex justify-end">
          <button
            onClick={() => navigate("../stockhistory")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 flex items-center gap-2"
          >
            <FaHistory size={16} />
            View History
          </button>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-center">Add Stock</h2>
          {message && <p className={`text-center mb-4 ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>{message}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block font-medium">Medicine Form / Category</label>
              <select name="medicine_form" value={formData.medicine_form} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg">
                <option value="">Select</option>
                {medicineOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* CONDITIONAL RENDERING */}
            {isSpecialCategory ? (
              <div className="relative">
                <label className="block font-medium">Item Name</label>
                <input
                  type="text"
                  name="brand_name" 
                  value={formData.brand_name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  placeholder="Enter Item Name"
                  autoComplete="off"
                />
              </div>
            ) : (
              <>
                <div className="relative">
                  <label className="block font-medium">Chemical Name</label>
                  <input
                    type="text"
                    name="chemical_name"
                    value={formData.chemical_name}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    autoComplete="off"
                    disabled={!formData.medicine_form}
                  />
                  {showChemicalSuggestions && chemicalSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-md max-h-40 overflow-y-auto">
                      {chemicalSuggestions.map((s, i) => (
                        <li key={i} className="px-3 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSuggestionClick("chemical_name", s)}>
                          {s}
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
                    disabled={!formData.medicine_form}
                  />
                  {showBrandSuggestions && brandSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-md max-h-40 overflow-y-auto">
                      {brandSuggestions.map((s, i) => (
                        <li key={i} className="px-3 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSuggestionClick("brand_name", s)}>
                          {s}
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
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    disabled={!formData.medicine_form}
                  />
                  {showDoseSuggestions && doseSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-md max-h-40 overflow-y-auto">
                      {doseSuggestions.map((s, i) => (
                        <li key={i} className="px-3 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSuggestionClick("dose_volume", s)}>
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block font-medium">Quantity</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
            </div>

            <div>
              <label className="block font-medium">Expiry Date</label>
              <input type="month" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
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