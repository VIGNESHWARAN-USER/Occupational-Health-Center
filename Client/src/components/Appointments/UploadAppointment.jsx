//UploadAppointmentPage
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { FaFileUpload } from "react-icons/fa";

const UploadAppointmentPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setSelectedFile(file);
      processExcel(file);
    } else {
      alert("Please select a valid Excel file (XLSX).");
      setSelectedFile(null);
      setExcelData(null); // Clear previous data
    }
  };

  const processExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const wb = XLSX.read(binaryStr, { type: "binary" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setExcelData(jsonData);
      sendToBackend(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const sendToBackend = async (data) => {
    setUploadStatus(null); // Reset status
    try {
      const response = await fetch("https://occupational-health-center.onrender.com/uploadAppointment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointments: data }),
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus("success");
      } else {
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setUploadStatus("error");
    }
  };

  const handleBrowseClick = () => {
    document.getElementById("fileInput").click();
  };

  const reset = () => {
    setSelectedFile(null);
    setExcelData(null);
    setUploadStatus(null);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const dragAreaVariants = {
    initial: { scale: 1, backgroundColor: "rgba(226, 232, 240, 0.5)" },
    dragHover: {
      scale: 1.05,
      backgroundColor: "rgba(203, 213, 225, 0.7)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="p-6 rounded-lg bg-gray-50 shadow-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-8 rounded-lg ">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Upload Appointments
        </h2>
        <motion.div
          className="border-2 border-dashed border-gray-400 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer"
          id="drag-drop-area"
          variants={dragAreaVariants}
          initial="initial"
          whileHover="dragHover"
          whileTap="dragHover"
          onClick={handleBrowseClick}
          onDragEnter={(e) => e.preventDefault()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
              setSelectedFile(file);
              processExcel(file);
            } else {
              alert("Please upload a valid excel file");
            }
          }}
        >
          <FaFileUpload className="text-4xl text-gray-500 mb-4" />
          <p className="text-gray-700 mb-2">Drag and drop your XLSX file here</p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <input
            type="file"
            id="fileInput"
            accept=".xlsx"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            className="px-5 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
            type="button"
          >
            Browse Files
          </button>
          {selectedFile && (
            <p className="mt-4 text-sm text-gray-600">
              Selected file: {selectedFile.name}
            </p>
          )}
        </motion.div>

        {uploadStatus === "success" && (
          <div className="mt-6 text-green-600 font-semibold">
            Appointments uploaded successfully!
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="mt-6 text-red-600 font-semibold">
            Error uploading appointments. Please try again.
          </div>
        )}

        {(uploadStatus === "success" || uploadStatus === "error") && (
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              onClick={reset}
            >
              Upload Again
            </button>
          </div>
        )}

        {excelData && process.env.NODE_ENV === "development" && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Parsed Excel Data (For Development)
            </h3>
            <div className="border rounded-md p-4 bg-gray-100 overflow-x-auto">
              <pre className="text-sm text-gray-600 whitespace-pre">
                {JSON.stringify(excelData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UploadAppointmentPage;