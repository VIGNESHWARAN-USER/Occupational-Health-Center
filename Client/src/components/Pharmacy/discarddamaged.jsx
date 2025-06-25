import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { debounce } from "lodash";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DiscardedMedicines = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    medicine_form: "",
    chemical_name: "",
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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const medicineOptions = ["Tablet", "Syrup", "Injection","Lotions","Respules","Powder", "Creams", "Drops", "Fluids", "Other"];

  useEffect(() => {
    fetchDiscardedMedicines();
  }, []);

  const fetchDiscardedMedicines = async () => {
    try {
      setLoading(true);
      const params = {};
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;

      const response = await axios.get("http://localhost:8000/discarded_medicines/", { params });
      setDiscardedMedicines(response.data.discarded_medicines);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching discarded medicines:", error);
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    fetchDiscardedMedicines();
  };

  const fetchBrandSuggestions = debounce(async (chemicalName, medicineForm) => {
    if (chemicalName.length < 3 || !medicineForm) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-brand-names/?chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setSuggestions(res.data.suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error(error);
    }
  }, 500);

  const fetchChemicalSuggestions = debounce(async (brandName, medicineForm) => {
    if (brandName.length < 3 || !medicineForm) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-chemical-name-by-brand/?brand_name=${brandName}&medicine_form=${medicineForm}`);
      setChemicalSuggestions(res.data.suggestions);
      setShowChemicalSuggestions(true);
    } catch (error) {
      console.error(error);
    }
  }, 500);

  const fetchDoseSuggestions = debounce(async (brandName, chemicalName, medicineForm) => {
    if (!brandName || !chemicalName || !medicineForm) return;
    try {
      const res = await axios.get(`http://localhost:8000/get-dose-volume/?brand_name=${brandName}&chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
      setDoseSuggestions(res.data.suggestions);
      setShowDoseSuggestions(res.data.suggestions.length > 1);
      if (!doseManuallyEntered && res.data.suggestions.length === 1) {
        setFormData((prev) => ({ ...prev, dose_volume: res.data.suggestions[0] }));
      }
    } catch (error) {
      console.error(error);
    }
  }, 500);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "chemical_name") fetchBrandSuggestions(value, formData.medicine_form);
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

  const handleDoseSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, dose_volume: suggestion }));
    setShowDoseSuggestions(false);
  };

  const handleChemicalSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, chemical_name: suggestion }));
    setShowChemicalSuggestions(false);
    fetchBrandSuggestions(suggestion, formData.medicine_form);
    fetchDoseSuggestions(formData.brand_name, suggestion, formData.medicine_form);
  };

  const handleBrandSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, brand_name: suggestion }));
    setShowSuggestions(false);
    fetchChemicalSuggestions(suggestion, formData.medicine_form);
    fetchDoseSuggestions(suggestion, formData.chemical_name, formData.medicine_form);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((val) => !val)) {
      setMessage("All fields are required.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/add_discarded_medicine/", {
        ...formData,
        expiry_date: `${formData.expiry_date}-01`,
      });
      setMessage("Discarded medicine added successfully!");
      setFormData({ medicine_form: "", chemical_name: "", brand_name: "", dose_volume: "", quantity: "", expiry_date: "", reason: "" });
      fetchDiscardedMedicines();
      setShowForm(false);
    } catch (error) {
      console.error("Error adding discarded medicine:", error);
      setMessage("Error adding discarded medicine. Please try again.");
    }
  };

  const handleDownloadExcel = () => {
    const dataToExport = discardedMedicines.map((item) => ({
      Form: item.medicine_form,
      Chemical: item.chemical_name,
      Brand: item.brand_name,
      Dose: item.dose_volume,
      Quantity: item.quantity,
      "Discarded Date": formatDate(item.entry_date),
      "Expiry Date": item.expiry_date,
      Reason: item.reason,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Discarded Medicines");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Discarded_Medicines.xlsx");
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        {!showForm ? (
          <div>
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
              <button className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg" onClick={() => setShowForm(true)}>
                Add Discarded Medicine
              </button>
              <div className="flex flex-wrap items-center gap-2">
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border rounded px-2 py-1" />
                <span className="text-gray-700">to</span>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border rounded px-2 py-1" />
                <button onClick={fetchDiscardedMedicines} className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded">
                  Filter
                </button>
                <button onClick={handleClearFilters} className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded">
                  Clear
                </button>
              </div>
              <button onClick={handleDownloadExcel} className="bg-green-500 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md shadow">
                Download Excel
              </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Discarded Medicines</h2>
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="p-3 text-left">Form</th>
                        <th className="p-3 text-left">Chemical</th>
                        <th className="p-3 text-left">Brand</th>
                        <th className="p-3 text-left">Dose</th>
                        <th className="p-3 text-left">Quantity</th>
                        <th className="p-3 text-left">Discarded Date</th>
                        <th className="p-3 text-left">Expiry Date</th>
                        <th className="p-3 text-left">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {discardedMedicines.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-3">{item.medicine_form}</td>
                          <td className="p-3">{item.chemical_name}</td>
                          <td className="p-3">{item.brand_name}</td>
                          <td className="p-3">{item.dose_volume}</td>
                          <td className="p-3 font-bold">{item.quantity}</td>
                          <td className="p-3 text-red-600 font-semibold">{formatDate(item.entry_date)}</td>
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
              <input type="text" name="chemical_name" value={formData.chemical_name} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
              {showChemicalSuggestions && (
                <ul className="bg-white border mt-1 max-h-40 overflow-y-auto">
                  {chemicalSuggestions.map((suggestion) => (
                    <li key={suggestion} onClick={() => handleChemicalSuggestionClick(suggestion)} className="px-3 py-2 cursor-pointer hover:bg-gray-100">{suggestion}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block font-medium">Brand Name</label>
              <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
              {showSuggestions && (
                <ul className="bg-white border mt-1 max-h-40 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion} onClick={() => handleBrandSuggestionClick(suggestion)} className="px-3 py-2 cursor-pointer hover:bg-gray-100">{suggestion}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block font-medium">Dose/Volume</label>
              <input type="text" name="dose_volume" value={formData.dose_volume} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
              {showDoseSuggestions && (
                <ul className="bg-white border mt-1 max-h-40 overflow-y-auto">
                  {doseSuggestions.map((suggestion) => (
                    <li key={suggestion} onClick={() => handleDoseSuggestionClick(suggestion)} className="px-3 py-2 cursor-pointer hover:bg-gray-100">{suggestion}</li>
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
              <input type="month" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
            </div>
            <div>
              <label className="block font-medium">Reason</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg">
              Add Discarded Medicine
            </button>
          </form>
          <button className="mt-4 text-blue-600" onClick={() => setShowForm(false)}>
            Back to List
          </button> </div>
        )}
      </div>
    </div>
  );
};

export default DiscardedMedicines;
