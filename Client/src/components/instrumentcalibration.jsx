import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const InstrumentCalibration = () => {
  const [pendingCalibrations, setPendingCalibrations] = useState([]);
  const [calibrationHistory, setCalibrationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newInstrument, setNewInstrument] = useState({
    instrument_name: "",
    numbers: "",
    certificate_number: "",
    make: "",
    model_number: "",
    equipment_sl_no: "",
    calibration_date: "",
    calibration_status: "0",
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

  const handleCompleteCalibration = async (id) => {
    try {
      await axios.post("https://occupational-health-center-1.onrender.com/complete_calibration/", { id });
      fetchPendingCalibrations();
    } catch (error) {
      console.error("Error completing calibration:", error);
    }
  };

  const handleAddInstrument = async () => {
    if (!newInstrument.instrument_name || !newInstrument.numbers || !newInstrument.calibration_date) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      await axios.post("https://occupational-health-center-1.onrender.com/add_instrument/", newInstrument, {
        headers: { "Content-Type": "application/json" },
      });
      setShowModal(false);
      fetchPendingCalibrations();
      setNewInstrument({
        instrument_name: "",
        numbers: "",
        certificate_number: "",
        make: "",
        model_number: "",
        equipment_sl_no: "",
        calibration_date: "",
        calibration_status: "0",
      });
    } catch (error) {
      console.error("Error adding instrument:", error);
      alert("Failed to add instrument. Please check the server.");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
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

        {/* Pending Calibrations */}
        {!showHistory ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2 text-left">Instrument</th>
                  <th className="border px-4 py-2 text-left">Numbers</th>
                  <th className="border px-4 py-2 text-left">Make</th>
                  <th className="border px-4 py-2 text-left">Model Number</th>
                  <th className="border px-4 py-2 text-left">Calibration Date</th>
                  <th className="border px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingCalibrations.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{item.instrument_name}</td>
                    <td className="border px-4 py-2">{item.numbers}</td>
                    <td className="border px-4 py-2">{item.make}</td>
                    <td className="border px-4 py-2">{item.model_number}</td>
                    <td className="border px-4 py-2">{item.calibration_date}</td>
                    <td className="border px-4 py-2 text-center">
                      <button className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700" onClick={() => handleCompleteCalibration(item.id)}>
                        Complete Calibration
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Calibration History Table
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Calibration History</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2 text-left">Instrument</th>
                  <th className="border px-4 py-2 text-left">Numbers</th>
                  <th className="border px-4 py-2 text-left">Make</th>
                  <th className="border px-4 py-2 text-left">Model Number</th>
                  <th className="border px-4 py-2 text-left">Calibration Date</th>
                  <th className="border px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {calibrationHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{item.instrument_name}</td>
                    <td className="border px-4 py-2">{item.numbers}</td>
                    <td className="border px-4 py-2">{item.make}</td>
                    <td className="border px-4 py-2">{item.model_number}</td>
                    <td className="border px-4 py-2">{item.calibration_date}</td>
                    <td className="border px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded ${item.calibration_status ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {item.calibration_status ? "Completed" : "Pending"}
                      </span>
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
              {["instrument_name", "numbers", "certificate_number", "make", "model_number", "equipment_sl_no"].map((field) => (
                <input key={field} type="text" placeholder={field.replace("_", " ")} className="border p-2 w-full mb-2"
                  onChange={(e) => setNewInstrument({ ...newInstrument, [field]: e.target.value })} />
              ))}
              <input type="date" className="border p-2 w-full mb-2"
                onChange={(e) => setNewInstrument({ ...newInstrument, calibration_date: e.target.value })} />
              <select className="border p-2 w-full mb-2"
                onChange={(e) => setNewInstrument({ ...newInstrument, calibration_status: e.target.value })}>
                <option value="0">Pending</option>
                <option value="1">Completed</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAddInstrument}>Save</button>
              <button className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstrumentCalibration;
