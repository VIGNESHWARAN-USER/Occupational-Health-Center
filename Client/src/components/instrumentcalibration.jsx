import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Sidebar from "./Sidebar";

const InstrumentCalibration = () => {
  // --- STATE MANAGEMENT ---
  const [pendingCalibrations, setPendingCalibrations] = useState([]);
  const [calibrationHistory, setCalibrationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevents double-clicks

  const [statusCounts, setStatusCounts] = useState({
    red_count: 0,
    yellow_count: 0,
    green_count: 0,
  });
  
  const frequencyOptions = [
    "Monthly", "Once in 2 Months", "Quarterly", "Half-Yearly", "Yearly", "Once in 2 Years",
  ];

  // --- INITIAL STATES FOR FORMS ---
  const initialInstrumentState = {
    equipment_sl_no: "", instrument_name: "", numbers: "", certificate_number: "",
    make: "", model_number: "", freq: "", calibration_date: "",
    next_due_date: "", calibration_status: "",
  };
  const [newInstrument, setNewInstrument] = useState(initialInstrumentState);

  const initialCompletionState = {
    calibration_date: new Date().toISOString().split("T")[0],
    freq: "", next_due_date: "", certificate_number: "",
  };
  const [completionDetails, setCompletionDetails] = useState(initialCompletionState);

  // --- UTILITY FUNCTIONS ---
  const normalizeFrequency = (freq) => (freq || "").trim().toLowerCase();

  const calculateNextDueDate = (calibrationDate, freq) => {
    if (!calibrationDate || !freq) return "";
    const date = new Date(calibrationDate);
    if (isNaN(date.getTime())) return ""; // Invalid date check

    const normalizedFreq = normalizeFrequency(freq);
    switch (normalizedFreq) {
      case "monthly": date.setMonth(date.getMonth() + 1); break;
      case "once in 2 months": date.setMonth(date.getMonth() + 2); break;
      case "quarterly": date.setMonth(date.getMonth() + 3); break;
      case "half-yearly": date.setMonth(date.getMonth() + 6); break;
      case "yearly": date.setFullYear(date.getFullYear() + 1); break;
      case "once in 2 years": date.setFullYear(date.getFullYear() + 2); break;
      default: return "";
    }
    return date.toISOString().split("T")[0];
  };

  /**
   * DEBUGGED: Reliably parses "DD-Mon-YYYY" and calculates button color.
   */
  const getButtonColor = (nextDueDateStr, freq) => {
    const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    const parts = nextDueDateStr.split('-');
    if (parts.length !== 3) return "bg-gray-400"; // Invalid format

    const day = parseInt(parts[0], 10);
    const month = months[parts[1].toLowerCase()];
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || month === undefined || isNaN(year)) return "bg-gray-400";

    const dueDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) return "bg-red-600";

    const diffInMs = dueDate - today;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    const normalizedFreq = normalizeFrequency(freq);
    let totalDaysInPeriod = 365; // Default to Yearly
    if (normalizedFreq === "half-yearly") totalDaysInPeriod = 182;
    else if (normalizedFreq === "quarterly") totalDaysInPeriod = 91;
    else if (normalizedFreq === "once in 2 months") totalDaysInPeriod = 61;
    else if (normalizedFreq === "monthly") totalDaysInPeriod = 30;
    else if (normalizedFreq === "once in 2 years") totalDaysInPeriod = 730;

    const fractionRemaining = diffInDays / totalDaysInPeriod;

    if (fractionRemaining > 0.5) return "bg-green-600";
    if (fractionRemaining > 0.25) return "bg-yellow-500";
    return "bg-red-600";
  };
  
  // --- DATA FETCHING & SIDE EFFECTS ---
  useEffect(() => {
    fetchPendingCalibrations();
  }, []);

  useEffect(() => {
    const counts = pendingCalibrations.reduce(
      (acc, item) => {
        const color = getButtonColor(item.next_due_date, item.freq);
        if (color === "bg-red-600") acc.red_count++;
        else if (color === "bg-yellow-500") acc.yellow_count++;
        else if (color === "bg-green-600") acc.green_count++;
        return acc;
      }, { red_count: 0, yellow_count: 0, green_count: 0 }
    );
    setStatusCounts(counts);
  }, [pendingCalibrations]);

  const fetchPendingCalibrations = async () => {
    try {
      const response = await axios.get("https://occupational-health-center-1.onrender.com/get_calibrations/");
      setPendingCalibrations(response.data.pending_calibrations || []);
    } catch (error) {
      console.error("Error fetching pending calibrations:", error);
      alert("Error: Could not fetch pending calibrations.");
    }
  };

  const fetchCalibrationHistory = async () => {
    try {
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;
      const response = await axios.get("https://occupational-health-center-1.onrender.com/get_calibration_history/", { params });
      setCalibrationHistory(response.data.calibration_history || []);
      setShowHistory(true);
    } catch (error) {
      console.error("Error fetching calibration history:", error);
      alert("Error: Could not fetch calibration history.");
    }
  };

  // --- EVENT HANDLERS ---
  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(calibrationHistory);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Calibration History");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Calibration_History.xlsx");
  };

  const handleAddInstrument = async () => {
    const requiredFields = ["equipment_sl_no", "instrument_name", "numbers", "calibration_date", "freq", "calibration_status"];
    const missingField = requiredFields.find((field) => !newInstrument[field]);
    if (missingField) {
      alert(`Please fill in the required field: ${missingField.replace(/_/g, " ")}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("https://occupational-health-center-1.onrender.com/add_instrument/", {
        ...newInstrument,
        done_by: localStorage.getItem("userData"),
      });
      alert("Instrument added successfully!");
      setShowModal(false);
      setNewInstrument(initialInstrumentState); // Reset form
      fetchPendingCalibrations(); // Refresh list
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An unknown server error occurred.";
      console.error("Error adding instrument:", errorMessage);
      alert(`Failed to add instrument: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCompleteCalibration = async () => {
    if (!completionDetails.freq) {
      alert("Please select a frequency for the next calibration cycle.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("https://occupational-health-center-1.onrender.com/complete_calibration/", {
          id: selectedInstrument.id,
          ...completionDetails,
        }
      );
      alert(response.data.message); // Show success message from backend
      setShowCompleteModal(false);
      fetchPendingCalibrations(); // Refresh list
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An unknown server error occurred.";
      console.error("Error completing calibration:", errorMessage);
      alert(`Failed to complete calibration: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (instrument) => {
    const response = await axios.post("https://occupational-health-center-1.onrender.com/deleteInstrument", instrument);
    console.log(response)
    if(response.status === 200)
      alert("Instrument Deleted Successfully");
    else
       alert("Instrument is not Deleted");
  };
  
  const  handleOpenCompleteModal = (instrument) => {
    setSelectedInstrument(instrument);
    setCompletionDetails({
        ...initialCompletionState,
        // Pre-fill certificate number if it already exists
        certificate_number: instrument.certificate_number || "",
    });
    setShowCompleteModal(true);
  };
  
  const handleCloseAddModal = () => {
    setShowModal(false);
    setNewInstrument(initialInstrumentState);
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    // Re-fetch history without date filters
    fetchCalibrationHistory();
  };

  // --- RENDER ---
  return (
    <div className="h-screen flex bg-[#8fcadd]">
      <Sidebar />
      <div className="w-4/5 p-8 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          {showHistory ? (
            <>
              <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800" onClick={() => setShowHistory(false)} >
                ← Back to Current Status
              </button>
              <div className="flex justify-end items-center mb-4 space-x-2">
                <label>From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border p-1 ml-1" /></label>
                <label>To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border p-1 ml-1" /></label>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={fetchCalibrationHistory}>Apply Filter</button>
                <button onClick={handleClearFilters} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Clear</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleDownloadExcel}>Download Excel</button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col space-y-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => setShowModal(true)}>+ Add Instrument</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={fetchCalibrationHistory}>View Calibration History</button>
              </div>
              <h2 className="text-3xl font-bold">Current Status</h2>
              <div className="flex space-x-2">
                <div className="px-3 py-2 bg-red-600 text-white rounded shadow">{statusCounts.red_count}</div>
                <div className="px-3 py-2 bg-yellow-500 text-white rounded shadow">{statusCounts.yellow_count}</div>
                <div className="px-3 py-2 bg-green-600 text-white rounded shadow">{statusCounts.green_count}</div>
              </div>
            </>
          )}
        </div>

        {!showHistory ? (
          <div className="overflow-x-auto">
            <table className="bg-white w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gray-200">
                  {["S.No", "Equipment ID", "Instrument", "Numbers", "Certificate No", "Make", "Model No", "Freq", "Calib. Date", "Next Due", "Action", "Delete"].map((head) => (
                    <th key={head} className="border px-4 py-2 text-left text-sm">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendingCalibrations.map((item, index) => {
                  const buttonColor = getButtonColor(item.next_due_date, item.freq);
                  return (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td className="border px-3 py-2 text-sm">{index + 1}</td>
                      <td className="border px-3 py-2 text-sm">{item.equipment_sl_no}</td>
                      <td className="border px-3 py-2 text-sm">{item.instrument_name}</td>
                      <td className="border px-3 py-2 text-sm">{item.numbers}</td>
                      <td className="border px-3 py-2 text-sm">{item.certificate_number}</td>
                      <td className="border px-3 py-2 text-sm">{item.make}</td>
                      <td className="border px-3 py-2 text-sm">{item.model_number}</td>
                      <td className="border px-3 py-2 text-sm">{item.freq}</td>
                      <td className="border px-3 py-2 text-sm whitespace-nowrap">{item.calibration_date}</td>
                      <td className="border px-3 py-2 text-sm whitespace-nowrap">{item.next_due_date}</td>
                      <td className="border px-3 py-2 text-sm text-center">
                        <button className={`${buttonColor} text-white py-1 px-3 text-xs rounded hover:opacity-80`} disabled = {item.calibration_status === "Completed"} onClick={() => handleOpenCompleteModal(item)}>Complete</button>
                      </td>
                      <td className="border px-3 py-2 text-sm text-center">
                        <button className={`bg-red-600 text-white py-1 px-3 text-xs rounded hover:opacity-80`} onClick={() => handleDelete(item)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center mb-4">Calibration History</h2>
            <table className="bg-white w-full">
              <thead>
                <tr className="bg-gray-200">
                  {["Equipment ID", "Instrument", "Numbers", "Certificate No", "Make", "Model No", "Freq", "Calib. Date", "Next Due", "Status", "Delete"].map((head) => (
                    <th key={head} className="border px-4 py-2 text-left">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {calibrationHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{item.equipment_sl_no}</td>
                    <td className="border px-4 py-2">{item.instrument_name}</td>
                    <td className="border px-4 py-2">{item.numbers}</td>
                    <td className="border px-4 py-2">{item.certificate_number}</td>
                    <td className="border px-4 py-2">{item.make}</td>
                    <td className="border px-4 py-2">{item.model_number}</td>
                    <td className="border px-4 py-2">{item.freq}</td>
                    <td className="border px-4 py-2">{item.calibration_date}</td>
                    <td className="border px-4 py-2">{item.next_due_date}</td>
                    <td className="border px-4 py-2 text-center">
                      <span className="bg-green-500 text-white px-2 py-1 rounded">{(item.calibration_status ? "Completed" : "Pending")}</span>
                    </td>
                    <td className="border px-3 py-2 text-sm text-center">
                        <button className={`bg-red-600 text-white py-1 px-3 text-xs rounded hover:opacity-80`} onClick={() => handleDelete(item)}>Delete</button>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Instrument Modal */}
        {/* --- Enhanced Add Instrument Modal --- */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl transform transition-all">
      {/* Modal Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add New Instrument
      </h2>

      {/* Form with Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        
        {/* Instrument Name (Full Width) */}
        <div className="md:col-span-2">
          <label htmlFor="instrument_name" className="block text-sm font-medium text-gray-700 mb-1">
            Instrument Name
          </label>
          <input
            type="text"
            id="instrument_name"
            placeholder="Enter Instrument Name"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newInstrument.instrument_name}
            onChange={(e) => setNewInstrument({ ...newInstrument, instrument_name: e.target.value })}
          />
        </div>

        {/* Make (Brand Name) */}
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
            Brand Name
          </label>
          <input
            type="text"
            id="make"
            placeholder="Enter Brand Name"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newInstrument.make}
            onChange={(e) => setNewInstrument({ ...newInstrument, make: e.target.value })}
          />
        </div>

        {/* Model Number */}
        <div>
          <label htmlFor="model_number" className="block text-sm font-medium text-gray-700 mb-1">
            Model Number
          </label>
          <input
            type="text"
            id="model_number"
            placeholder="Enter Model Number"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newInstrument.model_number}
            onChange={(e) => setNewInstrument({ ...newInstrument, model_number: e.target.value })}
          />
        </div>

        {/* Equipment Sl.No */}
        <div>
          <label htmlFor="equipment_sl_no" className="block text-sm font-medium text-gray-700 mb-1">
            Equipment Serial No.
          </label>
          <input
            type="text"
            id="equipment_sl_no"
            placeholder="Unique Serial Number"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newInstrument.equipment_sl_no}
            onChange={(e) => setNewInstrument({ ...newInstrument, equipment_sl_no: e.target.value })}
          />
        </div>

        {/* Numbers */}
        <div>
          <label htmlFor="numbers" className="block text-sm font-medium text-gray-700 mb-1">
            Numbers
          </label>
          <input
            type="number"
            id="numbers"
            placeholder="Enter associated number"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newInstrument.numbers}
            onChange={(e) => setNewInstrument({ ...newInstrument, numbers: e.target.value })}
          />
        </div>

        {/* Certificate Number (Full Width) */}
        <div className="md:col-span-2">
          <label htmlFor="certificate_number" className="block text-sm font-medium text-gray-700 mb-1">
            Certificate Number
          </label>
          <input
            type="text"
            id="certificate_number"
            placeholder="Enter Certificate Number"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newInstrument.certificate_number}
            onChange={(e) => setNewInstrument({ ...newInstrument, certificate_number: e.target.value })}
          />
        </div>
        
        {/* --- Calibration Details Section --- */}

        {/* Calibration Date */}
        <div>
          <label htmlFor="calibration_date" className="block text-sm font-medium text-gray-700 mb-1">
            Last Calibration Date
          </label>
          <input
            type="date"
            id="calibration_date"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newInstrument.calibration_date}
            onChange={(e) => {
              const date = e.target.value;
              const nextDue = calculateNextDueDate(date, newInstrument.freq);
              setNewInstrument({ ...newInstrument, calibration_date: date, next_due_date: nextDue });
            }}
          />
        </div>

        {/* Frequency */}
        <div>
          <label htmlFor="freq" className="block text-sm font-medium text-gray-700 mb-1">
            Calibration Frequency
          </label>
          <select
            id="freq"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newInstrument.freq}
            onChange={(e) => {
              const freq = e.target.value;
              const nextDue = calculateNextDueDate(newInstrument.calibration_date, freq);
              setNewInstrument({ ...newInstrument, freq, next_due_date: nextDue });
            }}
          >
            <option value="" disabled>Select Frequency</option>
            {frequencyOptions.map((freq, idx) => (
              <option key={idx} value={freq}>{freq}</option>
            ))}
          </select>
        </div>

        {/* Next Due Date (Read-Only) */}
        <div>
          <label htmlFor="next_due_date" className="block text-sm font-medium text-gray-700 mb-1">
            Next Due Date
          </label>
          <input
            type="date"
            id="next_due_date"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            readOnly
            value={newInstrument.next_due_date}
          />
        </div>

        {/* Initial Status */}
        <div>
          <label htmlFor="initial_status" className="block text-sm font-medium text-gray-700 mb-1">
            Initial Status
          </label>
          <select
            id="initial_status"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newInstrument.calibration_status}
            onChange={(e) => setNewInstrument({ ...newInstrument, calibration_status: e.target.value })}
          >
            <option value="" disabled>Select Status</option>
            <option value="pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Modal Footer with Buttons */}
      <div className="flex justify-end mt-8 pt-4 border-t">
        <button
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={handleCloseAddModal}
        >
          Cancel
        </button>
        <button
          className="ml-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleAddInstrument}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Instrument"}
        </button>
      </div>
    </div>
  </div>
)}

        {/* Complete Calibration Modal */}
        {showCompleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Complete Calibration</h2>
              <label className="block mb-1">Completion Date</label>
              <input type="date" value={completionDetails.calibration_date} readOnly className="border p-2 w-full mb-2 bg-gray-100" />
              <label className="block mb-1">Certificate Number (for this cycle)</label>
              <input type="text" placeholder="Enter certificate number" className="border p-2 w-full mb-2" value={completionDetails.certificate_number} onChange={(e) => setCompletionDetails({ ...completionDetails, certificate_number: e.target.value })} />
              <label className="block mb-1">Next Cycle Frequency</label>
              <select className="border p-2 w-full mb-2" value={completionDetails.freq} onChange={(e) => { const freq = e.target.value; const nextDue = calculateNextDueDate(completionDetails.calibration_date, freq); setCompletionDetails({ ...completionDetails, freq, next_due_date: nextDue }); }} >
                <option value="" disabled>Select Frequency</option>
                {frequencyOptions.map((freq, idx) => (<option key={idx} value={freq}>{freq}</option>))}
              </select>
              <label className="block mb-1">Next Due Date</label>
              <input type="date" className="border p-2 w-full mb-4 bg-gray-100" value={completionDetails.next_due_date} readOnly />
              <div className="flex justify-end">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400" onClick={handleCompleteCalibration} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
                <button className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => setShowCompleteModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentCalibration;