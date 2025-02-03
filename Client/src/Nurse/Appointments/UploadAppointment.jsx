/# Upload/
import React, { useState } from "react";
import * as XLSX from "xlsx";

const UploadAppointmentPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("File selected:", file);

    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        const binaryStr = reader.result;
        const wb = XLSX.read(binaryStr, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log("Parsed Excel Data:", jsonData);
        setExcelData(jsonData);

        // Send the parsed data to Django backend
        sendToBackend(jsonData);
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Please select a valid Excel file (XLSX).");
    }
  };

  const sendToBackend = async (data) => {
    try {
      const response = await fetch("http://localhost:8000/uploadAppointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointments: data }),
      });

      const result = await response.json();
      console.log("Backend response:", result);

      if (response.ok) {
        alert("Appointments uploaded successfully!");
      } else {
        alert("Error uploading appointments.");
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
      alert("An error occurred while uploading the data.");
    }
  };

  const handleBrowseClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div>
      <div className="bg-white p-6 rounded shadow text-white">
        <h2 className="text-lg font-bold mb-4">Upload the appointment excel here:</h2>

        <div className="border-dashed bg-blue-200 border-2 border-gray-400 rounded-lg p-6 h-96 flex flex-col items-center justify-center text-center">
          <p className="mb-2">Drag and drop file here</p>
          <p className="text-sm text-gray-500 mb-4">Limit 200MB per file · XLSX</p>

          <input
            type="file"
            id="fileInput"
            accept=".xlsx"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            className="px-4 py-2 rounded bg-blue-700 text-white"
            onClick={handleBrowseClick}
          >
            Browse files
          </button>
        </div>
      </div>

      {excelData && (
        <div>
          <h3>Excel Data:</h3>
          <pre>{JSON.stringify(excelData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadAppointmentPage;