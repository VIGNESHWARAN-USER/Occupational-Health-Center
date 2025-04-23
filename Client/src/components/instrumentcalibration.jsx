import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const InstrumentCalibration = () => {
  const [pendingCalibrations, setPendingCalibrations] = useState([]);
  const [calibrationHistory, setCalibrationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  
  const frequencyOptions = [
    "Monthly",
    "Quarterly",
    "Half-Yearly",
    "Yearly"
  ];

  const calculateNextDueDate = (calibrationDate, freq) => {
    const date = new Date(calibrationDate);
    const normalizedFreq = freq.trim().toLowerCase();

    switch (normalizedFreq) {
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "quarterly":
        date.setMonth(date.getMonth() + 3);
        break;
      case "half-yearly":
        date.setMonth(date.getMonth() + 6);
        break;
      case "yearly":
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        return "";
    }

    return date.toISOString().split("T")[0];
  };

  const getButtonColor = (nextDueDate, freq) => {
    const today = new Date();
  
    // Convert DD-MM-YYYY → YYYY-MM-DD
    const [day, month, year] = nextDueDate.split("-");
    const formattedDueDate = `${year}-${month}-${day}`;
    const dueDate = new Date(formattedDueDate);
  
    const msInMonth = 1000 * 60 * 60 * 24 * 30.44;
    const diffInMs = dueDate - today;
    const monthsDiff = diffInMs / msInMonth;
  
    const normalizedFreq = freq.trim().toLowerCase();
    let totalMonths = 12;
  
    if (normalizedFreq === "half-yearly") totalMonths = 6;
    else if (normalizedFreq === "quarterly") totalMonths = 3;
    else if (normalizedFreq === "monthly") totalMonths = 1;
  
    const fraction = monthsDiff / totalMonths;
  
    if (fraction >= 0.66) return "bg-green-600";
    if (fraction >= 0.33) return "bg-yellow-500";
    return "bg-red-600";
  };
  
  

  const [newInstrument, setNewInstrument] = useState({
    equipment_sl_no: "",
    instrument_name: "",
    numbers: "",
    certificate_number: "",
    make: "",
    model_number: "",
    freq: "",
    calibration_date: "",
    next_due_date: "",
    calibration_status: ""
  });

  const [completionDetails, setCompletionDetails] = useState({
    calibration_date: new Date().toISOString().split("T")[0],
    freq: "",
    next_due_date: ""
  });

  useEffect(() => {
    fetchPendingCalibrations();
  }, []);

  const fetchPendingCalibrations = async () => {
    try {
      const response = await axios.get("https://occupational-health-center-1.onrender.com/get_pending_calibrations/");
      setPendingCalibrations(response.data.pending_calibrations);
    } catch (error) {
      console.error("Error fetching pending calibrations:", error);
    }
  };

  const fetchCalibrationHistory = async () => {
    try {
      const response = await axios.get("https://occupational-health-center-1.onrender.com/get_calibration_history/");
      setCalibrationHistory(response.data.calibration_history);
      setShowHistory(true);
    } catch (error) {
      console.error("Error fetching calibration history:", error);
    }
  };

  const handleAddInstrument = async () => {
    const requiredFields = [
      "equipment_sl_no", 
      "instrument_name", 
      "numbers", 
      "calibration_date", 
      "next_due_date", 
      "freq", 
      "calibration_status"
    ];

    const missingField = requiredFields.find((field) => !newInstrument[field]);

    if (missingField) {
      alert(`Please fill in the required field: ${missingField.replace("_", " ")}`);
      return;
    }

    try {
      await axios.post("https://occupational-health-center-1.onrender.com/add_instrument/", newInstrument);
      setShowModal(false);
      fetchPendingCalibrations();
      setNewInstrument({
        equipment_sl_no: "",
        instrument_name: "",
        numbers: "",
        certificate_number: "",
        make: "",
        model_number: "",
        freq: "",
        calibration_date: "",
        next_due_date: "",
        calibration_status: ""
      });
    } catch (error) {
      console.error("Error adding instrument:", error);
      alert("Failed to add instrument.");
    }
  };

  const handleOpenCompleteModal = (item) => {
    setSelectedInstrument(item);
    setCompletionDetails({
      calibration_date: new Date().toISOString().split("T")[0],
      freq: "",
      next_due_date: ""
    });
    setShowCompleteModal(true);
  };

  const handleCompleteCalibration = async () => {
    if (!completionDetails.freq || !completionDetails.next_due_date) {
      alert("Please enter both frequency and next due date");
      return;
    }

    try {
      const response = await axios.post("https://occupational-health-center-1.onrender.com/complete_calibration/", {
        id: selectedInstrument.id,
        ...completionDetails
      });

      if (response.data.message) {
        setShowCompleteModal(false);
        fetchPendingCalibrations();
      }
    } catch (error) {
      console.error("Error completing calibration:", error);
      alert("Failed to complete calibration");
    }
  };

  return (
    <div className="h-screen flex bg-[#8fcadd]">
      <Sidebar />
      <div className="w-4/5 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          {showHistory ? (
            <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800" onClick={() => setShowHistory(false)}>
              ← Back to Pending Calibrations
            </button>
          ) : (
            <h2 className="text-2xl font-bold text-center w-full">Pending Calibrations</h2>
          )}

          {!showHistory && (
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => setShowModal(true)}>
                + Add Instrument
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={fetchCalibrationHistory}>
                View Calibration History
              </button>
            </div>
          )}
        </div>

        {!showHistory ? (
          <table className="bg-white w-full">
            <thead>
              <tr className="bg-gray-200">
                {["Equipment ID", "Instrument", "Numbers", "Certificate No", "Make", "Model No", "Freq", "Calibration Date", "Next Due Date", "Action"].map((head) => (
                  <th key={head} className="border px-4 py-2 text-left">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
            {pendingCalibrations.map((item) => {
              // console.log("Due:", item.next_due_date, "Freq:", item.freq, "Color:", getButtonColor(item.next_due_date, item.freq));
              return (
                <tr key={item.id} className="hover:bg-gray-100">
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
                    <button
                      className={`${getButtonColor(item.next_due_date, item.freq)} text-white py-1 px-3 rounded hover:opacity-80`}
                      onClick={() => handleOpenCompleteModal(item)}
                    >
                      Complete
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center mb-4">Calibration History</h2>
            <table className="bg-white w-full">
              <thead>
                <tr className="bg-gray-200">
                  {["Equipment ID", "Instrument", "Numbers", "Certificate No", "Make", "Model No", "Freq", "Calibration Date", "Next Due Date", "Status"].map((head) => (
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
                      <span className="bg-green-500 text-white px-2 py-1 rounded">Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Instrument Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Add Instrument</h2>
              <input type="text" placeholder="Equipment Unique ID No" className="border p-2 w-full mb-2"
                value={newInstrument.equipment_sl_no}
                onChange={(e) => setNewInstrument({ ...newInstrument, equipment_sl_no: e.target.value })}
              />
              <input type="text" placeholder="Instrument Name" className="border p-2 w-full mb-2"
                value={newInstrument.instrument_name}
                onChange={(e) => setNewInstrument({ ...newInstrument, instrument_name: e.target.value })}
              />
              <input type="number" placeholder="Numbers" className="border p-2 w-full mb-2"
                value={newInstrument.numbers}
                onChange={(e) => setNewInstrument({ ...newInstrument, numbers: e.target.value })}
              />
              <input type="text" placeholder="Certificate Number" className="border p-2 w-full mb-2"
                value={newInstrument.certificate_number}
                onChange={(e) => setNewInstrument({ ...newInstrument, certificate_number: e.target.value })}
              />
              <input type="text" placeholder="Make" className="border p-2 w-full mb-2"
                value={newInstrument.make}
                onChange={(e) => setNewInstrument({ ...newInstrument, make: e.target.value })}
              />
              <input type="text" placeholder="Model Number" className="border p-2 w-full mb-2"
                value={newInstrument.model_number}
                onChange={(e) => setNewInstrument({ ...newInstrument, model_number: e.target.value })}
              />
              <label>Frequency</label>
              <select className="border p-2 w-full mb-2"
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

              <label>Calibration Date</label>
              <input type="date" className="border p-2 w-full mb-2"
                value={newInstrument.calibration_date}
                onChange={(e) => {
                  const date = e.target.value;
                  const nextDue = calculateNextDueDate(date, newInstrument.freq);
                  setNewInstrument({ ...newInstrument, calibration_date: date, next_due_date: nextDue });
                }}
              />

              <label>Next Due Date</label>
              <input type="date" className="border p-2 w-full mb-2 bg-gray-100" readOnly
                value={newInstrument.next_due_date}
              />

              <label>Status</label>
              <select className="border p-2 w-full mb-2"
                value={newInstrument.calibration_status}
                onChange={(e) => setNewInstrument({ ...newInstrument, calibration_status: e.target.value })}
              >
                <option value="" disabled>Select Status</option>
                <option value="0">Pending</option>
                <option value="1">Completed</option>
              </select>

              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAddInstrument}>Save</button>
                <button className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Complete Calibration Modal */}
        {showCompleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Complete Calibration</h2>
              <label className="block mb-1">Calibration Date</label>
              <input type="date" value={completionDetails.calibration_date} readOnly className="border p-2 w-full mb-2 bg-gray-100" />
              <label className="block mb-1">Frequency</label>
              <select className="border p-2 w-full mb-2"
                value={completionDetails.freq}
                onChange={(e) => {
                  const freq = e.target.value;
                  const nextDue = calculateNextDueDate(completionDetails.calibration_date, freq);
                  setCompletionDetails({ ...completionDetails, freq, next_due_date: nextDue });
                }}
              >
                <option value="" disabled>Select Frequency</option>
                {frequencyOptions.map((freq, idx) => (
                  <option key={idx} value={freq}>{freq}</option>
                ))}
              </select>
              <label className="block mb-1">Next Due Date</label>
              <input type="date" className="border p-2 w-full mb-4"
                value={completionDetails.next_due_date}
                readOnly
              />
              <div className="flex justify-end">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleCompleteCalibration}>Submit</button>
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
