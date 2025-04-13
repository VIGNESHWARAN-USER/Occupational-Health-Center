import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import Sidebar from "../Sidebar";

const DiscardedMedicines = () => {
  const [showForm, setShowForm] = useState(false); // Controls table/form visibility
  const [formData, setFormData] = useState({
    medicine_form: "",
    chemical_name: "", // Chemical name comes before brand name
    brand_name: "",
    dose_volume: "",
    quantity: "",
    expiry_date: "",
    reason: "",
  });

  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [chemicalSuggestions, setChemicalSuggestions] = useState([]);
  const [doseSuggestions, setDoseSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showChemicalSuggestions, setShowChemicalSuggestions] = useState(false);
  const [showDoseSuggestions, setShowDoseSuggestions] = useState(false);
  const [doseManuallyEntered, setDoseManuallyEntered] = useState(false);
  const [discardedMedicines, setDiscardedMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const medicineOptions = ["Tablet", "Syrup", "Injection", "Creams", "Drops", "Fluids", "Other"];

  useEffect(() => {
    fetchDiscardedMedicines();
  }, []);

  const fetchDiscardedMedicines = async () => {
    try {
      const response = await axios.get("http://localhost:8000/discarded_medicines/");
      setDiscardedMedicines(response.data.discarded_medicines);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching discarded medicines:", error);
      setLoading(false);
    }
  };

  // Debounced functions
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
      setSuggestions([]);
      setChemicalSuggestions([]);
      setDoseSuggestions([]);
    }

    if (name === "dose_volume") {
      setDoseManuallyEntered(true);
      setShowDoseSuggestions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.medicine_form || !formData.brand_name || !formData.chemical_name || !formData.dose_volume || !formData.quantity || !formData.expiry_date || !formData.reason) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        expiry_date: `${formData.expiry_date}-01`, // Append day to make full date
      };
      await axios.post("http://localhost:8000/add_discarded_medicine/", dataToSend);
      setMessage("Discarded medicine added successfully!");
      setFormData({ medicine_form: "", chemical_name: "", brand_name: "", dose_volume: "", quantity: "", expiry_date: "", reason: "" });
      fetchDiscardedMedicines();
      setShowForm(false); // Return to table view
    } catch (error) {
      console.error("Error adding discarded medicine:", error);
      setMessage("Error adding discarded medicine. Please try again.");
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        {!showForm ? (
          <div>
            <button className="mb-4 bg-blue-600 text-white py-2 px-4 rounded-lg" onClick={() => setShowForm(true)}>
              Add Discarded Medicine
            </button>
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Discarded Medicines</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
                <table className="w-full border-collapse">
                  <thead>
                  <tr className="bg-blue-600 text-white">
                      <th className="p-3 text-left">Form</th>
                      <th className="p-3 text-left">Chemical</th>
                      <th className="p-3 text-left">Brand</th>
                      <th className="p-3 text-left">Dose</th>
                      <th className="p-3 text-left">Quantity</th>
                      <th className="p-3 text-left">Expiry Date</th>
                      <th className="p-3 text-left">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discardedMedicines.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{item.medicine_form}</td>
                        <td className="p-3">{item.chemical_name}</td>
                        <td className="p-3">{item.brand_name}</td>
                        <td className="p-3">{item.dose_volume}</td>
                        <td className="p-3 font-bold">{item.quantity}</td>
                        <td className="p-3">{item.expiry_date}</td>
                        <td className="p-3 text-red-600 font-semibold">{item.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Discard Medicine</h2>
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
              <div>
                <label className="block font-medium">Chemical Name</label>
                <input
                  type="text"
                  name="chemical_name"
                  value={formData.chemical_name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                {showChemicalSuggestions && (
                  <ul className="bg-white border mt-1 max-h-40 overflow-y-auto">
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
              <div>
                <label className="block font-medium">Brand Name</label>
                <input
                  type="text"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                {showSuggestions && (
                  <ul className="bg-white border mt-1 max-h-40 overflow-y-auto">
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
              <div>
                <label className="block font-medium">Dose/Volume</label>
                <input
                  type="text"
                  name="dose_volume"
                  value={formData.dose_volume}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                {showDoseSuggestions && (
                  <ul className="bg-white border mt-1 max-h-40 overflow-y-auto">
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
              <div>
                <label className="block font-medium">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium">Expiry Date</label>
                <input
                  type="month"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-medium">Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg">
                Add Discarded Medicine
              </button>
            </form>
            <button
              className="mt-4 text-blue-600"
              onClick={() => setShowForm(false)}
            >
              Back to List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscardedMedicines;
