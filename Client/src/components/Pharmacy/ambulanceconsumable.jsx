import React, { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import Sidebar from "../Sidebar";
import * as XLSX from 'xlsx';
import { FaPlus, FaFilter, FaEraser, FaDownload } from "react-icons/fa";

const AmbulanceConsumables = () => {
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
  const [suggestions, setSuggestions] = useState([]); // Brand suggestions
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

  const [doseManuallyEntered, setDoseManuallyEntered] = useState(false);
  const [expiryManuallyEntered, setExpiryManuallyEntered] = useState(false);
  const [quantityManuallyEntered, setQuantityManuallyEntered] = useState(false);

  const [ambulanceConsumables, setAmbulanceConsumables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const medicineOptions = [
    "Tablet", "Syrup", "Injection", "Lotions", "Respules", "Powder", 
    "Creams", "Drops", "Fluids", "SutureAndProcedureItems", 
    "DressingItems", "Other"
  ];

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const fetchAmbulanceConsumables = async () => {
    try {
      setLoading(true);
      const params = {};
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;

      const response = await axios.get("http://localhost:8000/get_ambulance_consumable/", { params });
      setAmbulanceConsumables(response.data.ambulance_consumables || response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ambulance consumables:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulanceConsumables();
  }, []);

  // --- Suggestion Fetchers ---

  const fetchChemicalSuggestions = debounce(async (chemicalName, medicineForm) => {
    if (chemicalName.length < 3 || !medicineForm) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-chemical-name-by-chemical/?chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setChemicalSuggestions(res.data.suggestions);
      setShowChemicalSuggestions(true);
    } catch (error) { console.error(error); }
  }, 500);

  const fetchBrandSuggestions = debounce(async (chemicalName, medicineForm) => {
    if (chemicalName.length < 3 || !medicineForm) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-brand-names/?chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setSuggestions(res.data.suggestions);
      setShowSuggestions(true);
    } catch (error) { console.error(error); }
  }, 500);

  const fetchDoseSuggestions = debounce(async (brandName, chemicalName, medicineForm) => {
    if (!brandName || !chemicalName || !medicineForm) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-dose-volume/?brand_name=${brandName}&chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setDoseSuggestions(res.data.suggestions);
      setShowDoseSuggestions(res.data.suggestions.length > 0);
      if (!doseManuallyEntered && res.data.suggestions.length === 1) {
        setFormData((prev) => ({ ...prev, dose_volume: res.data.suggestions[0] }));
      }
    } catch (error) { console.error(error); }
  }, 500);

  const fetchExpirySuggestions = debounce(async (chemicalName, brandName, dose_volume) => {
    if (!brandName || !chemicalName || !dose_volume) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-expiry-dates/?brand_name=${brandName}&chemical_name=${chemicalName}&dose_volume=${dose_volume}`);
      setExpirySuggestions(res.data.suggestions);
      setShowExpirySuggestions(res.data.suggestions.length > 0);
      if (!expiryManuallyEntered && res.data.suggestions.length === 1) {
        setFormData((prev) => ({ ...prev, expiry_date: res.data.suggestions[0] }));
      }
    } catch (error) { console.error(error); }
  }, 500);

  const fetchQuantitySuggestions = debounce(async (chemicalName, brandName, expiry_date) => {
    if (!brandName || !chemicalName || !expiry_date) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-quantity-suggestions/?brand_name=${brandName}&chemical_name=${chemicalName}&expiry_date=${expiry_date}`);
      setQuantitySuggestions(res.data.suggestions);
      setShowQuantitySuggestions(res.data.suggestions.length > 0);
      if (!quantityManuallyEntered && res.data.suggestions.length === 1) {
        setFormData((prev) => ({ ...prev, quantity: res.data.suggestions[0] }));
      }
    } catch (error) { console.error(error); }
  }, 500);

  // --- Handlers ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "chemical_name") {
      fetchChemicalSuggestions(value, formData.medicine_form);
      fetchBrandSuggestions(value, formData.medicine_form);
    }
    if (name === "brand_name") {
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

  const handleChemicalSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, chemical_name: suggestion }));
    setShowChemicalSuggestions(false);
    fetchBrandSuggestions(suggestion, formData.medicine_form);
  };

  const handleBrandSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, brand_name: suggestion }));
    setShowSuggestions(false);
    fetchDoseSuggestions(suggestion, formData.chemical_name, formData.medicine_form);
  };

  const handleDoseSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, dose_volume: suggestion }));
    setShowDoseSuggestions(false);
    fetchExpirySuggestions(formData.chemical_name, formData.brand_name, suggestion);
  };

  const handleExpirySuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, expiry_date: suggestion }));
    setShowExpirySuggestions(false);
    fetchQuantitySuggestions(formData.chemical_name, formData.brand_name, suggestion);
  };

  const handleQuantitySuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, quantity: suggestion }));
    setShowQuantitySuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSpecialForm = ["SutureAndProcedureItems", "DressingItems"].includes(formData.medicine_form);

    if (isSpecialForm) {
      if (!formData.brand_name || !formData.quantity || !formData.expiry_date) {
        setMessage("Item Name, Quantity, and Expiry are required.");
        return;
      }
    } else {
      if (!formData.chemical_name || !formData.brand_name || !formData.dose_volume || !formData.quantity || !formData.expiry_date) {
        setMessage("All fields are required.");
        return;
      }
    }

    try {
      await axios.post("http://localhost:8000/add_ambulance_consumable/", formData);
      setMessage("Ambulance consumable added successfully!");
      setShowForm(false);
      fetchAmbulanceConsumables();
    } catch (err) {
      setMessage(err.response?.data?.error || "Error adding record.");
    }
  };

  const handleDownloadExcel = () => {
    const dataToExport = ambulanceConsumables.map((item) => ({
      Form: item.medicine_form,
      Chemical: item.chemical_name,
      Brand: item.brand_name,
      Dose: item.dose_volume,
      Quantity: item.quantity,
      "Expiry Date": item.expiry_date,
      "Consumed Date": new Date(item.consumed_date).toLocaleDateString("en-GB"),
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consumables");
    XLSX.writeFile(workbook, `Ambulance_Consumables_${Date.now()}.xlsx`);
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-blue-300 to-blue-400">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        {!showForm ? (
          <div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FaPlus size={14} /> Add Consumed Item
              </button>
              <div className="flex gap-2 items-center">
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border px-2 py-1 rounded" />
                <span>to</span>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border px-2 py-1 rounded" />
                <button onClick={fetchAmbulanceConsumables} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1"><FaFilter size={12}/> Filter</button>
                <button onClick={() => {setFromDate(""); setToDate(""); fetchAmbulanceConsumables();}} className="bg-gray-500 text-white px-3 py-1 rounded flex items-center gap-1"><FaEraser size={12}/> Clear</button>
              </div>
              <button onClick={handleDownloadExcel} className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                <FaDownload size={14} /> Download Excel
              </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Ambulance Consumables</h2>
              <table className="w-full border-collapse">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">Form</th>
                    <th className="p-3 text-left">Chemical</th>
                    <th className="p-3 text-left">Brand</th>
                    <th className="p-3 text-left">Dose</th>
                    <th className="p-3 text-left">Qty</th>
                    <th className="p-3 text-left">Expiry</th>
                    <th className="p-3 text-left">Consumed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ambulanceConsumables.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3">{item.medicine_form}</td>
                      <td className="p-3">{item.chemical_name}</td>
                      <td className="p-3">{item.brand_name}</td>
                      <td className="p-3">{item.dose_volume}</td>
                      <td className="p-3 font-bold">{item.quantity}</td>
                      <td className="p-3">{item.expiry_date}</td>
                      <td className="p-3 text-red-600 font-semibold">{new Date(item.consumed_date).toLocaleDateString("en-GB")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Add Ambulance Consumable</h2>
            {message && <p className="mb-4 text-red-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Medicine Form</label>
                <select name="medicine_form" value={formData.medicine_form} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg">
                  <option value="">Select</option>
                  {medicineOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              {/* Chemical Name */}
              <div className="relative">
                <label className="block font-medium">Chemical Name</label>
                <input type="text" name="chemical_name" value={formData.chemical_name} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" autoComplete="off" />
                {showChemicalSuggestions && (
                  <ul className="absolute z-10 w-full bg-white border max-h-40 overflow-y-auto shadow-lg">
                    {chemicalSuggestions.map(s => <li key={s} onClick={() => handleChemicalSuggestionClick(s)} className="p-2 hover:bg-gray-100 cursor-pointer">{s}</li>)}
                  </ul>
                )}
              </div>

              {/* Brand Name */}
              <div className="relative">
                <label className="block font-medium">Brand/Item Name</label>
                <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" autoComplete="off" />
                {showSuggestions && (
                  <ul className="absolute z-10 w-full bg-white border max-h-40 overflow-y-auto shadow-lg">
                    {suggestions.map(s => <li key={s} onClick={() => handleBrandSuggestionClick(s)} className="p-2 hover:bg-gray-100 cursor-pointer">{s}</li>)}
                  </ul>
                )}
              </div>

              {/* Dose */}
              <div className="relative">
                <label className="block font-medium">Dose/Volume</label>
                <input type="text" name="dose_volume" value={formData.dose_volume} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" autoComplete="off" />
                {showDoseSuggestions && (
                  <ul className="absolute z-10 w-full bg-white border max-h-40 overflow-y-auto shadow-lg">
                    {doseSuggestions.map(s => <li key={s} onClick={() => handleDoseSuggestionClick(s)} className="p-2 hover:bg-gray-100 cursor-pointer">{s}</li>)}
                  </ul>
                )}
              </div>

              {/* Expiry */}
              <div className="relative">
                <label className="block font-medium">Expiry Date</label>
                <input type="text" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" placeholder="YYYY-MM-DD" />
                {showExpirySuggestions && (
                  <ul className="absolute z-10 w-full bg-white border max-h-40 overflow-y-auto shadow-lg">
                    {expirySuggestions.map(s => <li key={s} onClick={() => handleExpirySuggestionClick(s)} className="p-2 hover:bg-gray-100 cursor-pointer">{s}</li>)}
                  </ul>
                )}
              </div>

              {/* Quantity */}
              <div className="relative">
                <label className="block font-medium">Quantity (Available shown in list)</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
                {showQuantitySuggestions && (
                  <ul className="absolute z-10 w-full bg-white border max-h-40 overflow-y-auto shadow-lg">
                    {quantitySuggestions.map(s => <li key={s} onClick={() => handleQuantitySuggestionClick(s)} className="p-2 hover:bg-gray-100 cursor-pointer">Stock Available: {s}</li>)}
                  </ul>
                )}
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Add Consumable</button>
            </form>
            <button className="mt-4 text-blue-600" onClick={() => setShowForm(false)}>Back to List</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbulanceConsumables;