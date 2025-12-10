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
  const [suggestions, setSuggestions] = useState([]);
  const [chemicalSuggestions, setChemicalSuggestions] = useState([]);
  const [doseSuggestions, setDoseSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showChemicalSuggestions, setShowChemicalSuggestions] = useState(false);
  const [showDoseSuggestions, setShowDoseSuggestions] = useState(false);
  const [doseManuallyEntered, setDoseManuallyEntered] = useState(false);
  const [wardConsumables, setWardConsumables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // NOTE: exact strings to match backend special category checks
  const medicineOptions = [
    "Tablet",
    "Syrup",
    "Injection",
    "Lotions",
    "Respules",
    "Powder",
    "Creams",
    "Drops",
    "Fluids",
    "Suture & Procedure Items",
    "Dressing Items",
    "Other",
  ];

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const fetchWardConsumables = async () => {
    try {
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
      setMessage("Error fetching ward consumables list.");
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    fetchWardConsumables();
  };

  const handleDownloadExcel = () => {
    if (!wardConsumables || wardConsumables.length === 0) {
      alert("No ward consumables record available to download.");
      return;
    }

    const formattedData = wardConsumables.map((item) => ({
      ...item,
      consumed_date: new Date(item.consumed_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}.${minutes} ${ampm}`;
    const fileName = `Ward Consumables - ${day}-${month}-${year} @ ${formattedTime}.xlsx`;

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "WardConsumables");
    XLSX.writeFile(workbook, fileName);
  };

  useEffect(() => {
    fetchWardConsumables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------- suggestion fetchers (debounced) ----------
  const fetchBrandSuggestions = debounce(async (chemicalName, medicineForm) => {
    if (!chemicalName || chemicalName.length < 3 || !medicineForm) return;
    try {
      const res = await axios.get(
        `http://localhost:8000/get-brand-names/?chemical_name=${chemicalName}&medicine_form=${medicineForm}`
      );
      setSuggestions(res.data.suggestions || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error fetching brand name suggestions:", err);
    }
  }, 500);

  const fetchChemicalSuggestions = debounce(async (brandName, medicineForm) => {
    if (!brandName || brandName.length < 3 || !medicineForm) return;
    try {
      const res = await axios.get(
        `http://localhost:8000/get-chemical-name-by-brand/?brand_name=${brandName}&medicine_form=${medicineForm}`
      );
      setChemicalSuggestions(res.data.suggestions || []);
      setShowChemicalSuggestions(true);
    } catch (err) {
      console.error("Error fetching chemical name suggestions:", err);
    }
  }, 500);

  const fetchDoseSuggestions = debounce(async (brandName, chemicalName, medicineForm) => {
    if (!brandName || !chemicalName || !medicineForm) return;
    try {
      const res = await axios.get(
        `http://localhost:8000/get-dose-volume/?brand_name=${brandName}&chemical_name=${chemicalName}&medicine_form=${medicineForm}`
      );
      setDoseSuggestions(res.data.suggestions || []);
      setShowDoseSuggestions((res.data.suggestions || []).length > 1);
      if (!doseManuallyEntered && (res.data.suggestions || []).length === 1) {
        setFormData((prev) => ({ ...prev, dose_volume: res.data.suggestions[0] }));
      }
    } catch (err) {
      console.error("Error fetching dose suggestions:", err);
    }
  }, 500);

  // --------- suggestion click handlers ----------
  const handleDoseSuggestionClick = (suggestion) => {
    setDoseManuallyEntered(false);
    setFormData((prev) => ({ ...prev, dose_volume: suggestion }));
    setShowDoseSuggestions(false);
  };

  const handleChemicalSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, chemical_name: suggestion }));
    setShowChemicalSuggestions(false);
    // only call brand/dose suggestions if not a special form
    if (!isSpecialForm()) {
      fetchBrandSuggestions(suggestion, formData.medicine_form);
      fetchDoseSuggestions(formData.brand_name, suggestion, formData.medicine_form);
    }
  };

  const handleBrandSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, brand_name: suggestion }));
    setShowSuggestions(false);
    if (!isSpecialForm()) {
      if (!formData.chemical_name) fetchChemicalSuggestions(suggestion, formData.medicine_form);
      fetchDoseSuggestions(suggestion, formData.chemical_name, formData.medicine_form);
    }
  };

  // --------- helper to check special forms ----------
  const isSpecialForm = () =>
    formData.medicine_form === "Suture & Procedure Items" || formData.medicine_form === "Dressing Items";

  // --------- handleChange ----------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If switching medicine_form to special, clear chemical/dose suggestions and values
    if (name === "medicine_form") {
      // when selecting special forms, we want to clear fields that are irrelevant
      if (value === "Suture & Procedure Items" || value === "Dressing Items") {
        setFormData((prev) => ({
          ...prev,
          medicine_form: value,
          chemical_name: "",
          dose_volume: "",
          // keep brand_name (used as item name) and other fields as-is
        }));
        setSuggestions([]);
        setChemicalSuggestions([]);
        setDoseSuggestions([]);
        setShowSuggestions(false);
        setShowChemicalSuggestions(false);
        setShowDoseSuggestions(false);
        return;
      }
      // when switching from special to normal, just set the form and clear suggestion lists
      setFormData((prev) => ({ ...prev, medicine_form: value }));
      setSuggestions([]);
      setChemicalSuggestions([]);
      setDoseSuggestions([]);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // suggestion triggers only for normal forms
    if (isSpecialForm()) {
      // do not call suggestion APIs when special form selected
      return;
    }

    if (name === "chemical_name") {
      fetchBrandSuggestions(value, formData.medicine_form);
    }

    if (name === "brand_name") {
      fetchChemicalSuggestions(value, formData.medicine_form);
      fetchDoseSuggestions(value, formData.chemical_name, formData.medicine_form);
    }

    if (name === "dose_volume") {
      setDoseManuallyEntered(true);
      setShowDoseSuggestions(false);
    }
  };

  // --------- submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // validation depends on whether form is special
    if (isSpecialForm()) {
      // required: brand_name (item name), quantity, expiry_date, consumed_date
      if (!formData.brand_name || formData.brand_name.toString().trim() === "") {
        setMessage("Item Name is required.");
        return;
      }
      if (!formData.quantity || Number(formData.quantity) <= 0) {
        setMessage("Valid quantity is required.");
        return;
      }
      if (!formData.expiry_date || formData.expiry_date.toString().trim() === "") {
        setMessage("Expiry Date is required for this item type.");
        return;
      }
      if (!formData.consumed_date || formData.consumed_date.toString().trim() === "") {
        setMessage("Consumed Date is required.");
        return;
      }
    } else {
      // normal medicine required fields
      if (
        !formData.medicine_form ||
        !formData.chemical_name ||
        !formData.brand_name ||
        !formData.dose_volume ||
        !formData.quantity
      ) {
        setMessage("All required fields must be filled.");
        return;
      }
      if (!formData.consumed_date || formData.consumed_date.toString().trim() === "") {
        setMessage("Consumed Date is required.");
        return;
      }
    }

    try {
      // prepare payload - for special forms set chemical_name/dose_volume to null
      const payload = {
        medicine_form: formData.medicine_form,
        brand_name: formData.brand_name,
        quantity: Number(formData.quantity),
        expiry_date: formData.expiry_date || null, // YYYY-MM expected by backend
        consumed_date: formData.consumed_date || getTodayDate(), // YYYY-MM-DD
        chemical_name: isSpecialForm() ? null : formData.chemical_name,
        dose_volume: isSpecialForm() ? null : formData.dose_volume,
      };

      await axios.post("http://localhost:8000/add_ward_consumable/", payload);

      setMessage("Ward consumable added successfully!");
      setFormData({
        medicine_form: "",
        chemical_name: "",
        brand_name: "",
        dose_volume: "",
        quantity: "",
        expiry_date: "",
        consumed_date: getTodayDate(),
      });
      fetchWardConsumables();
      setShowForm(false);
    } catch (err) {
      console.error("Error adding consumable:", err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || "Error adding ward consumable.";
      setMessage(errorMsg);
    }
  };

  const handleShowForm = () => {
    setFormData({
      medicine_form: "",
      chemical_name: "",
      brand_name: "",
      dose_volume: "",
      quantity: "",
      expiry_date: "",
      consumed_date: getTodayDate(),
    });
    setMessage("");
    setShowForm(true);
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        {!showForm ? (
          <>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <button
                onClick={handleShowForm}
                className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <FaPlus size={14} />
                Add Consumed Item
              </button>

              <div className="flex gap-2 items-center mx-auto">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                />
                <span className="text-gray-700">to</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                />

                <button
                  onClick={fetchWardConsumables}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-2"
                >
                  <FaFilter size={12} />
                  Filter
                </button>

                <button
                  onClick={handleClearFilters}
                  className="bg-gray-500 hover:bg-gray-400 text-white px-3 py-1 rounded flex items-center gap-2"
                >
                  <FaEraser size={12} />
                  Clear
                </button>
              </div>

              <button
                onClick={handleDownloadExcel}
                className="bg-green-500 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md shadow flex items-center gap-2"
              >
                <FaDownload size={14} />
                Download Excel
              </button>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4 text-center">Ward Consumables</h2>
              {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
              ) : wardConsumables.length === 0 ? (
                <p className="text-center text-gray-500">No consumables found.</p>
              ) : (
                <table className="w-full border-collapse">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-3 text-left">Form</th>
                      <th className="p-3 text-left">Chemical</th>
                      <th className="p-3 text-left">Brand / Item</th>
                      <th className="p-3 text-left">Dose</th>
                      <th className="p-3 text-left">Qty</th>
                      <th className="p-3 text-left">Expiry</th>
                      <th className="p-3 text-left">Consumed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wardConsumables.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="p-2">{item.medicine_form}</td>
                        <td className="p-2">{item.chemical_name || "N/A"}</td>
                        <td className="p-2">{item.brand_name}</td>
                        <td className="p-2">{item.dose_volume || "N/A"}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">{item.expiry_date || "N/A"}</td>
                        <td className="p-2 text-red-600 font-semibold">
                          {item.consumed_date
                            ? new Date(item.consumed_date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Add Ward Consumable</h2>
            {message && (
              <p
                className={`mb-4 p-3 rounded-lg ${
                  message.toLowerCase().includes("success")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Medicine Form Dropdown */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Medicine Form <span className="text-red-500">*</span>
                </label>
                <select
                  name="medicine_form"
                  value={formData.medicine_form}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Form</option>
                  {medicineOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional fields */}
              {isSpecialForm() ? (
                <>
                  {/* Item Name (brand_name) */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="brand_name"
                      value={formData.brand_name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                      required
                      autoComplete="off"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                      required
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="month"
                      name="expiry_date"
                      value={formData.expiry_date}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Chemical Name Input with Suggestions */}
                  <div className="relative">
                    <label className="block text-gray-700 font-medium mb-1">
                      Chemical Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="chemical_name"
                      value={formData.chemical_name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      autoComplete="off"
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
                    <label className="block text-gray-700 font-medium mb-1">
                      Brand Name <span className="text-red-500">*</span>
                    </label>
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
                    <label className="block text-gray-700 font-medium mb-1">
                      Dose/Volume <span className="text-red-500">*</span>
                    </label>
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
                    <label className="block text-gray-700 font-medium mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
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
                </>
              )}

              {/* Consumed Date Input (Read Only) */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Consumed Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="consumed_date"
                  value={formData.consumed_date}
                  readOnly
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
              >
                Add Consumable
              </button>
            </form>

            <button className="mt-6 text-blue-600 hover:underline" onClick={() => setShowForm(false)}>
              Back to Consumables List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardConsumables;
