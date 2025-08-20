import React, { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import axios from 'axios'; // Ensure axios is imported
import { FaFileUpload, FaCloudUploadAlt, FaTrash, FaSpinner } from "react-icons/fa"; // Import icons

const DataUpload = () => {
    const accessLevel = localStorage.getItem("accessLevel");
    const navigate = useNavigate();
    // Removed loading state, using isSubmitting instead
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // For success feedback
    const [formVal, setFormVal] = useState("HR Data"); // Default selection
    const [isSubmitting, setIsSubmitting] = useState(false); // Used for processing/uploading state
    const [selectedFile, setSelectedFile] = useState(null); // State for the selected file
    const fileInputRef = useRef(null); // Ref for the hidden file input

    // Define drag area animation variants
    const dragAreaVariants = {
        initial: { backgroundColor: "#ffffff", scale: 1, borderColor: "#d1d5db" }, // White bg, gray border
        dragHover: { backgroundColor: "#eff6ff", scale: 1.02, borderColor: "#3b82f6" }, // Light blue bg, blue border
    };

    // Function to reset state (used on formVal change and clear)
    const resetState = useCallback(() => {
        setSelectedFile(null);
        setError(null);
        setSuccessMessage(null);
        setIsSubmitting(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input visually
        }
    }, []); // No dependencies needed as it uses refs and setters

    // Reset state when formVal changes
    useEffect(() => {
        resetState();
    }, [formVal, resetState]);

    // Function to validate file type
    const isValidFileType = (file) => {
        if (!file) return false;
        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        return validExtensions.includes(fileExtension);
    };

    // Handle file selection via browse or drop
    const handleFileSelection = (file) => {
        if (file && isValidFileType(file)) {
            setSelectedFile(file);
            setError(null); // Clear previous errors
            setSuccessMessage(null); // Clear previous success messages
        } else {
            setError("Invalid file type. Please upload an Excel file (.xlsx or .xls).");
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ""; // Clear the input if invalid file was selected/dropped
            }
        }
    };


    // Handle file change from the hidden input
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        handleFileSelection(file);
    };

    // Handle file drop
    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation(); // Prevent bubbling
        const file = event.dataTransfer.files[0];
        handleFileSelection(file);
        // Optional: Reset drag hover style if needed, though motion.div might handle it
    };

    // Trigger hidden file input click
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    // Handle clearing the selected file
    const handleClear = () => {
       resetState();
    };


    /**
 * Parses an Excel worksheet with 3-level hierarchical headers.
 * @param {object} worksheet The worksheet object from the 'xlsx' library.
 * @returns {Array<object>} An array of objects representing the data rows.
 */
function parseHierarchicalExcel(worksheet) {
    // 1. Convert the sheet to an array of arrays, preserving blank cells.
    const rawData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '' // Use empty string for blank cells
    });

    if (rawData.length < 4) {
        // Not enough rows for headers and data
        return [];
    }

    // 2. Extract header rows and data rows.
    const headerRow1 = rawData[0]; // Top-level categories (e.g., "General Test")
    const headerRow2 = rawData[1]; // Sub-categories (e.g., "Vitals")
    const headerRow3 = rawData[2]; // Final headers (e.g., "Pulse Rate", "RESULT")
    const dataRows = rawData.slice(3); // The rest is data

    const combinedHeaders = [];
    let lastL1Header = '';
    let lastL2Header = '';

    // 3. Build the combined headers for each column
    for (let i = 0; i < headerRow3.length; i++) {
        // For merged cells, the value is only in the first cell.
        // We carry forward the last seen value.
        if (headerRow1[i]) {
            lastL1Header = headerRow1[i];
        }
        if (headerRow2[i]) {
            lastL2Header = headerRow2[i];
        }

        const l3Header = headerRow3[i] || '';

        // Combine the headers. Using a separator like '_' is common.
        // The .filter(Boolean) removes any empty parts (e.g., if a level is missing)
        const fullHeader = [lastL1Header, lastL2Header, l3Header]
            .map(s => String(s).trim()) // Trim whitespace
            .filter(Boolean) // Remove empty strings
            .join('_'); // e.g., "General Test_Vitals_Pulse Rate"

        combinedHeaders.push(fullHeader);
    }
    
    // 4. Map the data rows to the new combined headers
    const jsonData = dataRows.map(row => {
        const rowObject = {};
        row.forEach((cellValue, index) => {
            if (combinedHeaders[index]) { // Only add if there's a header
                rowObject[combinedHeaders[index]] = cellValue;
            }
        });
        return rowObject;
    }).filter(obj => Object.keys(obj).length > 1); // Filter out potentially empty rows

    return jsonData;
}



   const handleUpload = useCallback(async () => {
    if (!selectedFile) {
        setError("Please select an Excel file to upload.");
        return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    // *** THIS IS THE KEY CHANGE ***
    // Create a FormData object to send the file directly.
    const formData = new FormData();
    formData.append('medical_file', selectedFile); // 'medical_file' is the key the backend will look for.
    // You can also append other data if needed
    // formData.append('formVal', formVal); 

    try {
        let uploadUrl = '';
        const baseURL = 'http://localhost:8000'; 
        if (formVal === "HR Data") {
            uploadUrl = `${baseURL}/hrupload`; 
        } else if (formVal === "Medical Data") {
            uploadUrl = `${baseURL}/medicalupload`; 
        } else {
            throw new Error("Invalid data type selected.");
        }

        console.log(`Uploading ${formVal} file to ${uploadUrl}`);

        // Send FormData instead of JSON.
        // Let axios handle the 'Content-Type' header.
        const response = await axios.post(uploadUrl, formData);

        setSuccessMessage(response.data?.message || `${formVal} uploaded successfully!`);
        resetState();

    } catch (err) {
        // Your existing error handling logic here...
        console.error("Error uploading file:", err);
        // ...
    } finally {
        setIsSubmitting(false);
    }
}, [selectedFile, formVal, resetState]);

    // --- Access Control Logic ---
    // Keep your existing access control logic here...
     if (accessLevel !== "nurse" && accessLevel !== "doctor") { // Adjusted logic for allowed roles
        return (
            <section className="bg-white h-full flex items-center dark:bg-gray-900">
                 <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center">
                        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">403</h1>
                        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                            Access Denied.
                        </p>
                        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                            Sorry, you do not have permission to access this page.
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex text-white bg-blue-600 hover:cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-900 my-4"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // --- Main Component Render for Authorized Users ---
    return (
        <div className="h-screen flex bg-[#f0f4f8]">
            <Sidebar />
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 sm:mb-0 text-gray-800">Data Upload</h1>
                    <div className="flex space-x-2">
                        {["HR Data", "Medical Data"].map((btnText) => (
                            <button
                                key={btnText}
                                className={`px-4 py-2 rounded-lg text-white transition duration-200 ${
                                    formVal === btnText
                                        ? "bg-blue-600 font-semibold shadow-md"
                                        : "bg-blue-400 hover:bg-blue-500"
                                }`}
                                onClick={() => setFormVal(btnText)}
                                disabled={isSubmitting} // Disable type switching during upload
                            >
                                {btnText}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div
                    className="bg-white p-6 md:p-8 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                        {`Upload ${formVal} Excel File`}
                    </h2>

                    {/* Error Message Display */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm break-words">
                           <span className="font-semibold">Error:</span> {error}
                        </div>
                    )}

                    {/* Success Message Display */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                            {successMessage}
                        </div>
                    )}

                    {/* Drag and Drop Area */}
                    <motion.div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer mb-6" // Added mb-6
                        variants={dragAreaVariants}
                        initial="initial"
                        whileHover="dragHover"
                        whileTap="dragHover" // Keep hover style while clicking browse
                        onClick={handleBrowseClick} // Click anywhere triggers browse
                        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }} // Necessary for drop to work
                        onDrop={handleDrop}
                    >
                        <FaFileUpload className="text-3xl sm:text-4xl text-gray-400 mb-3" />
                        <p className="text-gray-600 text-sm sm:text-base mb-1">
                            Drag and drop your Excel file here
                        </p>
                        <p className="text-xs text-gray-500 mb-3">(.xlsx or .xls)</p>
                        <p className="text-sm text-gray-500 mb-3">or</p>
                        {/* Hidden Actual File Input */}
                        <input
                            type="file"
                            id="fileInput"
                            ref={fileInputRef}
                            accept=".xlsx, .xls" // Match validation
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <button
                            className="px-4 py-2 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-200"
                            type="button" // Prevent potential form submission if nested
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the outer div's click
                                handleBrowseClick();
                             }}
                        >
                            Browse Files
                        </button>
                        {selectedFile && !error && ( // Only show if file is valid
                            <p className="mt-4 text-sm text-green-700 font-medium">
                                Selected: {selectedFile.name}
                            </p>
                        )}
                    </motion.div>

                    {/* Upload and Clear Buttons - Conditionally Rendered */}
                    {selectedFile && (
                        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                             <button
                                className={`px-5 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-200 flex items-center justify-center text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleClear}
                                disabled={isSubmitting} // Disable clear during upload
                            >
                                <FaTrash className="mr-2" />
                                Clear Selection
                            </button>
                            <button
                                className={`px-5 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition duration-200 flex items-center justify-center text-sm ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                onClick={handleUpload}
                                disabled={isSubmitting} // Disable upload when processing
                            >
                                {isSubmitting ? (
                                    <FaSpinner className="animate-spin mr-2" /> // Loading spinner
                                ) : (
                                    <FaCloudUploadAlt className="mr-2" />
                                )}
                                {isSubmitting ? 'Uploading...' : `Upload ${formVal}`}
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default DataUpload;