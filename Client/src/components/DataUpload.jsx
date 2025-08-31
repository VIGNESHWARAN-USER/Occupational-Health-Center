import React, { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import axios from 'axios';
import { FaFileUpload, FaCloudUploadAlt, FaTrash, FaSpinner } from "react-icons/fa";

const DataUpload = () => {
    const accessLevel = localStorage.getItem("accessLevel");
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formVal, setFormVal] = useState("HR Data");
    const [hrDataType, setHrDataType] = useState("Employee");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const dragAreaVariants = {
        initial: { backgroundColor: "#ffffff", scale: 1, borderColor: "#d1d5db" },
        dragHover: { backgroundColor: "#eff6ff", scale: 1.02, borderColor: "#3b82f6" },
    };

    const resetState = useCallback(() => {
        setSelectedFile(null);
        setError(null);
        setSuccessMessage(null);
        setIsSubmitting(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    useEffect(() => {
        resetState();
    }, [formVal, hrDataType, resetState]);

    const isValidFileType = (file) => {
        if (!file) return false;
        const validExtensions = ['.xlsx', '.xls'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        return validExtensions.includes(fileExtension);
    };

    const handleFileSelection = (file) => {
        if (file && isValidFileType(file)) {
            setSelectedFile(file);
            setError(null);
            setSuccessMessage(null);
        } else {
            setError("Invalid file type. Please upload an Excel file (.xlsx or .xls).");
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        handleFileSelection(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files[0];
        handleFileSelection(file);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleClear = () => {
        resetState();
    };

    function parseHierarchicalExcel(worksheet) {
        const rawData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: ''
        });

        if (rawData.length < 4) {
            return [];
        }

        const headerRow1 = rawData[0];
        const headerRow2 = rawData[1];
        const headerRow3 = rawData[2];
        const dataRows = rawData.slice(3);

        const combinedHeaders = [];
        let lastL1Header = '';
        let lastL2Header = '';

        for (let i = 0; i < headerRow3.length; i++) {
            if (headerRow1[i]) {
                lastL1Header = headerRow1[i];
            }
            if (headerRow2[i]) {
                lastL2Header = headerRow2[i];
            }

            const l3Header = headerRow3[i] || '';

            const fullHeader = [lastL1Header, lastL2Header, l3Header]
                .map(s => String(s).trim())
                .filter(Boolean)
                .join('_');

            combinedHeaders.push(fullHeader);
        }

        const jsonData = dataRows.map(row => {
            const rowObject = {};
            row.forEach((cellValue, index) => {
                if (combinedHeaders[index]) {
                    rowObject[combinedHeaders[index]] = cellValue;
                }
            });
            return rowObject;
        }).filter(obj => Object.keys(obj).length > 1);

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

        const formData = new FormData();
        formData.append('file', selectedFile);

        let uploadUrl = '';
        const baseURL = 'https://occupational-health-center-1.onrender.com';

        if (formVal === "HR Data") {
            uploadUrl = `${baseURL}/hrupload/${hrDataType.toLowerCase()}`;
            formData.append('dataType', hrDataType);
        } else if (formVal === "Medical Data") {
            uploadUrl = `${baseURL}/medicalupload`;
        } else {
            setError("Invalid data type selected.");
            setIsSubmitting(false);
            return;
        }

        console.log(`Uploading ${formVal} (${hrDataType}) file to ${uploadUrl}`);
        
        try {
            const response = await axios.post(uploadUrl, formData);

            setSuccessMessage(response.data?.message || `${formVal} (${hrDataType}) uploaded successfully!`);
            resetState();
        } catch (err) {
            console.error("Error uploading file:", err.response || err);

    let displayError = "Upload failed: An unknown error occurred.";

    if (err.response && err.response.data) {
        const { message, errors } = err.response.data;
        
        // Use the main message from the backend
        displayError = `Upload failed: ${message || err.message}`;

        // If there's a list of specific errors, format them for display
        if (errors && Array.isArray(errors) && errors.length > 0) {
            // Create a formatted string or a list component to show these errors.
            // For simplicity, let's join them with line breaks.
            const detailedErrors = errors.join('\n');
            displayError += `\n\nDetails:\n${detailedErrors}`;
        }
    } else {
        displayError = `Upload failed: ${err.message}`;
    }
    
    setError(displayError);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedFile, formVal, hrDataType, resetState]);
    console.log(accessLevel)
    if (accessLevel !== "nurse" && accessLevel !== "doctor") {
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
                                disabled={isSubmitting}
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
                    {formVal === "HR Data" && (
                        <div className="mb-6">
                            <label htmlFor="hr-type" className="block text-sm font-medium text-gray-700 mb-2">
                                Select HR Data Type
                            </label>
                            <select
                                id="hr-type"
                                value={hrDataType}
                                onChange={(e) => setHrDataType(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                disabled={isSubmitting}
                            >
                                <option value="Employee">Employee</option>
                                <option value="Associate">Associate</option>
                                <option value="Visitor">Visitor</option>
                            </select>
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm break-words">
                           <span className="font-semibold">Error:</span> {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                            {successMessage}
                        </div>
                    )}
                    <motion.div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer mb-6"
                        variants={dragAreaVariants}
                        initial="initial"
                        whileHover="dragHover"
                        whileTap="dragHover"
                        onClick={handleBrowseClick}
                        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={handleDrop}
                    >
                        <FaFileUpload className="text-3xl sm:text-4xl text-gray-400 mb-3" />
                        <p className="text-gray-600 text-sm sm:text-base mb-1">
                            Drag and drop your Excel file here
                        </p>
                        <p className="text-xs text-gray-500 mb-3">(.xlsx or .xls)</p>
                        <p className="text-sm text-gray-500 mb-3">or</p>
                        <input
                            type="file"
                            id="fileInput"
                            ref={fileInputRef}
                            accept=".xlsx, .xls"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <button
                            className="px-4 py-2 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-200"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBrowseClick();
                            }}
                        >
                            Browse Files
                        </button>
                        {selectedFile && !error && (
                            <p className="mt-4 text-sm text-green-700 font-medium">
                                Selected: {selectedFile.name}
                            </p>
                        )}
                    </motion.div>
                    {selectedFile && (
                        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                            <button
                                className={`px-5 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-200 flex items-center justify-center text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleClear}
                                disabled={isSubmitting}
                            >
                                <FaTrash className="mr-2" />
                                Clear Selection
                            </button>
                            <button
                                className={`px-5 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition duration-200 flex items-center justify-center text-sm ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                                onClick={handleUpload}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <FaSpinner className="animate-spin mr-2" />
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