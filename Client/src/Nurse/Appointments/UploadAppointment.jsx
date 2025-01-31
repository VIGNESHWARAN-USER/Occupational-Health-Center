import React from "react";
import Sidebar from "../../Sidebar/Sidebar";

const UploadAppointmentPage = () => {
    const theme = {
        primaryColor: "#22384F",
        backgroundColor: "#EAF2FA",
        secondaryBackgroundColor: "#CDDEF4",
        textColor: "#262730",
        fontFamily: "sans-serif",
      };
  return (
    <div>
        <div>

        <div
          className="bg-white p-6 rounded shadow text-white"
        >
          <h2 className="text-lg font-bold mb-4">Upload the appointment excel here:</h2>

          <div
            className="border-dashed bg-blue-200 border-2 border-gray-400 rounded-lg p-6 h-96 flex flex-col items-center justify-center text-center">
            <p className="mb-2">
              Drag and drop file here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Limit 200MB per file · XLSX
            </p>

            <button
              className="px-4 py-2 rounded bg-blue-700 text-white">
              Browse files
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAppointmentPage;