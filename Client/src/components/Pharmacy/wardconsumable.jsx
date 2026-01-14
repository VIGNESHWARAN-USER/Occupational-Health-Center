import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import Sidebar from "../Sidebar";
import * as XLSX from "xlsx";
import { FaPlus, FaFilter, FaEraser, FaDownload } from "react-icons/fa";

const WardConsumables = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    medicine_form: "",
    chemical_name: "",
    brand_name: "",
    dose_volume: "",
    quantity: "",
    expiry_date: "",
    consumed_date: new Date().toISOString().split("T")[0],
  });

  const [message, setMessage] = useState("");
  
  // Suggestion States
  const [suggestions, setSuggestions] = useState([]); // Brands
  const [chemicalSuggestions, setChemicalSuggestions] = useState([]);
  const [doseSuggestions, setDoseSuggestions] = useState([]);
  const [expirySuggestions, setExpirySuggestions] = useState([]);
  const [quantitySuggestions, setQuantitySuggestions] = useState([]);

  // Visibility States
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showChemicalSuggestions, setShowChemicalSuggestions] = useState(false);
  const [showDoseSuggestions, setShowDoseSuggestions] = useState(false);
  const [showExpirySuggestions, setShowExpirySuggestions] = useState(false);
  const [showQuantitySuggestions, setShowQuantitySuggestions] = useState(false);

  // Manual Entry Flags
  const [doseManuallyEntered, setDoseManuallyEntered] = useState(false);
  const [expiryManuallyEntered, setExpiryManuallyEntered] = useState(false);
  const [quantityManuallyEntered, setQuantityManuallyEntered] = useState(false);

  const [wardConsumables, setWardConsumables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const medicineOptions = [
    "Tablet", "Syrup", "Injection", "Lotions", "Respules", "Powder",
    "Creams", "Drops", "Fluids", "SutureAndProcedureItems",
    "DressingItems", "Other",
  ];

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const fetchWardConsumables = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:8000/get_ward_consumable/";
      const params = [];
      if (fromDate) params.push(`from_date=${fromDate}`);
      if (toDate) params.push(`to_date=${toDate}`);
      if (params.length) url += `?${params.join("&")}`;

      const response = await axios.get(url);
      setWardConsumables(response.data.ward_consumables || response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ward consumables:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWardConsumables();
  }, []);

  // --------- Suggestion Fetchers (Debounced) ----------
  
  const fetchChemicalSuggestions = debounce(async (chemicalName, medicineForm) => {
    if (chemicalName.length < 3 || !medicineForm) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-chemical-name-by-chemical/?chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setChemicalSuggestions(res.data.suggestions || []);
      setShowChemicalSuggestions(true);
    } catch (err) { console.error(err); }
  }, 500);

  const fetchBrandSuggestions = debounce(async (chemicalName, medicineForm) => {
    if (chemicalName.length < 3 || !medicineForm) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-brand-names/?chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setSuggestions(res.data.suggestions || []);
      setShowSuggestions(true);
    } catch (err) { console.error(err); }
  }, 500);

  const fetchDoseSuggestions = debounce(async (brandName, chemicalName, medicineForm) => {
    if (!brandName || !chemicalName || !medicineForm) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-dose-volume/?brand_name=${brandName}&chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setDoseSuggestions(res.data.suggestions || []);
      setShowDoseSuggestions((res.data.suggestions || []).length > 0);
      if (!doseManuallyEntered && (res.data.suggestions || []).length === 1) {
        setFormData((prev) => ({ ...prev, dose_volume: res.data.suggestions[0] }));
      }
    } catch (err) { console.error(err); }
  }, 500);

  const fetchExpirySuggestions = debounce(async (chemicalName, brandName, dose_volume) => {
    if (!brandName || !chemicalName || !dose_volume) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-expiry-dates/?brand_name=${brandName}&chemical_name=${chemicalName}&dose_volume=${dose_volume}`);
      setExpirySuggestions(res.data.suggestions || []);
      setShowExpirySuggestions((res.data.suggestions || []).length > 0);
      if (!expiryManuallyEntered && (res.data.suggestions || []).length === 1) {
        setFormData((prev) => ({ ...prev, expiry_date: res.data.suggestions[0] }));
      }
    } catch (err) { console.error(err); }
  }, 500);

  const fetchQuantitySuggestions = debounce(async (chemicalName, brandName, expiry_date) => {
    if (!brandName || !chemicalName || !expiry_date) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-quantity-suggestions/?brand_name=${brandName}&chemical_name=${chemicalName}&expiry_date=${expiry_date}`);
      setQuantitySuggestions(res.data.suggestions || []);
      setShowQuantitySuggestions((res.data.suggestions || []).length > 0);
      if (!quantityManuallyEntered && (res.data.suggestions || []).length === 1) {
        setFormData((prev) => ({ ...prev, quantity: res.data.suggestions[0] }));
      }
    } catch (err) { console.error(err); }
  }, 500);

  // --------- Suggestion Click Handlers ----------

  const handleChemicalSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, chemical_name: suggestion }));
    setShowChemicalSuggestions(false);
    if (!isSpecialForm()) {
      fetchBrandSuggestions(suggestion, formData.medicine_form);
    }
  };

  const handleBrandSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, brand_name: suggestion }));
    setShowSuggestions(false);
    if (!isSpecialForm()) {
      fetchDoseSuggestions(suggestion, formData.chemical_name, formData.medicine_form);
    }
  };

  const handleDoseSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, dose_volume: suggestion }));
    setShowDoseSuggestions(false);
    if (!isSpecialForm()) {
      fetchExpirySuggestions(formData.chemical_name, formData.brand_name, suggestion);
    }
  };

  const handleExpirySuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, expiry_date: suggestion }));
    setShowExpirySuggestions(false);
    if (!isSpecialForm()) {
      fetchQuantitySuggestions(formData.chemical_name, formData.brand_name, suggestion);
    }
  };

  const handleQuantitySuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, quantity: suggestion }));
    setShowQuantitySuggestions(false);
  };

  const isSpecialForm = () =>
    formData.medicine_form === "SutureAndProcedureItems" || formData.medicine_form === "DressingItems";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "medicine_form") {
      setSuggestions([]);
      setChemicalSuggestions([]);
      setDoseSuggestions([]);
      setExpirySuggestions([]);
      setQuantitySuggestions([]);
    }

    if (isSpecialForm()) return;

    if (name === "chemical_name") {
      fetchChemicalSuggestions(value, formData.medicine_form);
      fetchBrandSuggestions(value, formData.medicine_form);
    }
    if (name === "brand_name") {
      fetchDoseSuggestions(value, formData.chemical_name, formData.medicine_form);
    }
    if (name === "dose_volume") {
      setDoseManuallyEntered(true);
      setShowDoseSuggestions(false);
    }
    if (name === "expiry_date") {
      setExpiryManuallyEntered(true);
      setShowExpirySuggestions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        chemical_name: isSpecialForm() ? null : formData.chemical_name,
        dose_volume: isSpecialForm() ? null : formData.dose_volume,
      };

      await axios.post("http://localhost:8000/add_ward_consumable/", payload);
      setMessage("Ward consumable added successfully!");
      setShowForm(false);
      fetchWardConsumables();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error adding ward consumable.");
    }
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(wardConsumables);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "WardConsumables");
    XLSX.writeFile(workbook, `Ward_Consumables_${Date.now()}.xlsx`);
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-blue-300 to-blue-400">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        {!showForm ? (
          <>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                <FaPlus size={14} /> Add Consumed Item
              </button>
              <div className="flex gap-2 items-center mx-auto">
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border rounded px-2 py-1" />
                <span>to</span>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border rounded px-2 py-1" />
                <button onClick={fetchWardConsumables} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"><FaFilter size={12} /> Filter</button>
                <button onClick={() => {setFromDate(""); setToDate(""); fetchWardConsumables();}} className="bg-gray-500 text-white px-3 py-1 rounded flex items-center gap-2"><FaEraser size={12} /> Clear</button>
              </div>
              <button onClick={handleDownloadExcel} className="bg-green-500 text-white px-4 py-2 rounded shadow flex items-center gap-2">
                <FaDownload size={14} /> Download Excel
              </button>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Ward Consumables</h2>
              <table className="w-full border-collapse">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Form</th>
                    <th className="p-3 text-left">Chemical</th>
                    <th className="p-3 text-left">Brand / Item</th>
                    <th className="p-3 text-left">Dose</th>
                    <th className="p-3 text-left">Qty</th>
                    <th className="p-3 text-left">Expiry</th>
                    <th className="p-3 text-left">Consumed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {wardConsumables.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">{item.medicine_form}</td>
                      <td className="p-2">{item.chemical_name || "N/A"}</td>
                      <td className="p-2">{item.brand_name}</td>
                      <td className="p-2">{item.dose_volume || "N/A"}</td>
                      <td className="p-2 font-bold">{item.quantity}</td>
                      <td className="p-2">{item.expiry_date || "N/A"}</td>
                      <td className="p-2 text-red-600 font-semibold">{new Date(item.consumed_date).toLocaleDateString("en-GB")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Add Ward Consumable</h2>
            {message && <p className={`mb-4 p-3 rounded-lg ${message.includes("success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Medicine Form *</label>
                <select name="medicine_form" value={formData.medicine_form} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" required>
                  <option value="">Select Form</option>
                  {medicineOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              {/* Chemical Name */}
              <div className="relative">
                <label className="block font-medium mb-1">Chemical Name</label>
                <input type="text" name="chemical_name" value={formData.chemical_name} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" autoComplete="off" />
                {showChemicalSuggestions && (
                  <ul className="absolute z-10 w-full bg-white border mt-1 max-h-40 overflow-y-auto rounded shadow-lg">
                    {chemicalSuggestions.map(s => <li key={s} onClick={() => handleChemicalSuggestionClick(s)} className="p-2 hover:bg-gray-100 cursor-pointer">{s}</li>)}
                  </ul>
                )}
              </div>

              {/* Brand Name */}
              <div className="relative">
                <label className="block font-medium mb-1">Brand Name *</label>
                <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" required autoComplete="off" />
                {showSuggestions && (
                  <ul className="absolute z-10 w-full bg-white border mt-1 max-h-40 overflow-y-auto rounded shadow-lg">
                    {suggestions.map(s => <li key={s} onClick={() => handleBrandSuggestionClick(s)} className="p-2 hover:bg-gray-100 cursor-pointer">{s}</li>)}
                  </ul>
                )}
              </div>

              {/* Dose */}
              <div className="relative">
                <label className="block font-medium mb-1">Dose/Volume</label>
                <input type="text" name="dose_volume" value={formData.dose_volume} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" autoComplete="off" />
                {showDoseSuggestions && (
                  <ul className="absolute z-10 w-full bg-white border mt-1 max-h-40 overflow-y-auto rounded shadow-lg">
                    {doseSuggestions.map(s => <li key={s} onClick={() => handleDoseSuggestionClick(s)} className="p-2 hover:bg-gray-100 cursor-pointer">{s}</li>)}
                  </ul>
                )}
              </div>

              {/* Expiry */}
              <div className="relative">
                <label className="block font-medium mb-1">Expiry Date</label>
                <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
                {showExpirySuggestions && (
                  <ul className="absolute z-10 w-full bg-white border mt-1 max-h-40 overflow-y-auto rounded shadow-lg">
                    {expirySuggestions.map(s => <li key={s} onClick={() => handleExpirySuggestionClick(s)} className="p-2 hover:bg-gray-100 cursor-pointer">{s}</li>)}
                  </ul>
                )}
              </div>

              {/* Quantity */}
              <div className="relative">
                <label className="block font-medium mb-1">Quantity *</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" required />
                {showQuantitySuggestions && (
                  <ul className="absolute z-10 w-full bg-white border mt-1 max-h-40 overflow-y-auto rounded shadow-lg">
                    {quantitySuggestions.map(s => <li key={s} onClick={() => handleQuantitySuggestionClick(s)} className="p-2 hover:bg-gray-100 cursor-pointer">Available Stock: {s}</li>)}
                  </ul>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Consumed Date *</label>
                <input type="date" name="consumed_date" value={formData.consumed_date} readOnly className="w-full border px-3 py-2 bg-gray-100 rounded-lg" />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg">Add Consumable</button>
            </form>
            <button className="mt-4 text-blue-600 hover:underline" onClick={() => setShowForm(false)}>Back to List</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardConsumables;