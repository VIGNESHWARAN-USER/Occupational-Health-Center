import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';

const EventsAndCamps = () => {
    const accessLevel = localStorage.getItem("accessLevel");
    const navigate = useNavigate();
    const [campData, setCampData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filteredCampData, setFilteredCampData] = useState([]);
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [tempFilterStatus, setTempFilterStatus] = useState("");
    const [selectedFiles, setSelectedFiles] = useState({});
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [tempDateFrom, setTempDateFrom] = useState("");
    const [tempDateTo, setTempDateTo] = useState("");
    const [uploadedFileNames, setUploadedFileNames] = useState({});  // State to hold names
    const [allFilesUploaded, setAllFilesUploaded] = useState({}); // Track all files status
    const fileTypes = ["report1", "report2", "photos", "ppt"]; // Define file types

    // Nurse Role Functionality
    if (accessLevel === "nurse") {
        const [formDatas, setFormDatas] = useState({
            camp_name: "",
            start_date: "",
            end_date: "",
            camp_details: "",
        });

        const [isSubmitting, setIsSubmitting] = useState(false);
        const [formVal, setformVal] = useState("");

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormDatas({ ...formDatas, [name]: value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setError(null);

            if (
                !formDatas.camp_name ||
                !formDatas.start_date ||
                !formDatas.end_date ||
                !formDatas.camp_details
            ) {
                setError("Please fill in all required fields.");
                setIsSubmitting(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/add-camp/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formDatas),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        `Error saving data: ${response.status} - ${
                        errorData.error || "Unknown error"
                        }`
                    );
                }

                alert("Event & Camp data saved successfully");

                setFormDatas({
                    camp_name: "",
                    start_date: "",
                    end_date: "",
                    camp_details: "",
                });
            } catch (err) {
                setError(err.message);
                console.error("Error saving camp data:", err);
            } finally {
                setIsSubmitting(false);
            }
        };

        // Fetch Camp Data (useCallback for optimization)
        const fetchCampData = useCallback(async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();
                if (searchTerm) {
                    params.append("searchTerm", searchTerm);
                }
                if (filterStatus) {
                    params.append("filterStatus", filterStatus);
                }
                if (dateFrom) {
                    params.append("dateFrom", dateFrom);
                }
                if (dateTo) {
                    params.append("dateTo", dateTo);
                }

                const url = `http://localhost:8000/get-camps/?${params.toString()}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("Failed to fetch camp data");
                }

                const data = await response.json();
                setCampData(data);
                setFilteredCampData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, [searchTerm, filterStatus, dateFrom, dateTo]); // Dependency array

        useEffect(() => {
            if (formVal === "View Camps") {
                fetchCampData();
            }
        }, [formVal, fetchCampData]); //  fetchCampData is a dependency


        const handleFilter = () => {
            setSearchTerm(tempSearchTerm);
            setFilterStatus(tempFilterStatus);
            setDateFrom(tempDateFrom);
            setDateTo(tempDateTo);
        };

        const handleFileChange = (e, campId, fileType) => {
            const files = Array.from(e.target.files);
            setSelectedFiles((prevSelectedFiles) => ({
                ...prevSelectedFiles,
                [campId]: {
                    ...prevSelectedFiles[campId], // Keep other file types
                    [fileType]: files,
                },
            }));

            // Update displayed file names
            setUploadedFileNames((prevNames) => ({
                ...prevNames,
                [campId]: {
                    ...prevNames[campId], // Keep other file types
                    [fileType]: files.map((file) => file.name).join(", "),
                },
            }));
             setAllFilesUploaded((prevStatus) => ({
                ...prevStatus,
                [campId]: false, // Reset overall upload status
            }));
        };

        const handleFileUpload = async (campId) => {
            setError(null);
            setLoading(true);
            let allUploaded = true; // Assume all uploads will be successful
            const uploadPromises = fileTypes.map(async (fileType) => {
                 const filesToUpload = selectedFiles[campId]?.[fileType] || [];
                if (filesToUpload.length === 0) {
                   allUploaded = false; // If any file type is missing, mark overall status as false
                    return; // Skip upload if no files for this type
                }
                const formData = new FormData();
                filesToUpload.forEach((file) => {
                    formData.append("files", file);
                });
                 formData.append("campId", campId);
                formData.append("fileType", fileType); // Send file type to server
                try {
                    const response = await fetch("http://localhost:8000/upload-files/", {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error(`File upload failed: ${response.status}`);
                    }
                       setUploadedFileNames((prevNames) => ({
                        ...prevNames,
                        [campId]: {
                            ...prevNames[campId],
                            [fileType]: undefined, // Clear the displayed name
                        },
                    }));
                       setSelectedFiles((prevSelectedFiles) => ({
                        ...prevSelectedFiles,
                        [campId]: {
                            ...prevSelectedFiles[campId],
                            [fileType]: undefined, // Clear selected files for this type
                        },
                    }));
                } catch (error) {
                  console.error(`File upload error for ${fileType}:, error`);
                  allUploaded = false; // Mark overall status as false if any upload fails
                  setError(`File upload error: ${error.message}`);
                }
             });
          await Promise.all(uploadPromises);
           setLoading(false);
            setAllFilesUploaded((prevStatus) => ({
                ...prevStatus,
                [campId]: allUploaded, // Set overall status based on all uploads
            }));
            if (allUploaded) {
                alert("All files uploaded successfully!");
            } else {
                alert("Some files may have failed to upload. Check for errors.");
            }
         };

        const getLabelStyle = (campId, fileType) => {
            const hasFilesSelected = uploadedFileNames[campId]?.[fileType];
            return {
                backgroundColor: hasFilesSelected ? "green" : "blue",
                color: "white",
            };
        };

        const handleExportToExcel = () => {
            // Map the data to the desired format for Excel
            const excelData = filteredCampData.map(camp => ({
                "Camp Name": camp.camp_name,
                "Start Date": camp.start_date,
                "End Date": camp.end_date,
                "Camp Details": camp.camp_details,
                "Status": camp.camp_type,
                // Add other fields here if you want them in the Excel sheet
            }));

            // Create a new workbook
            const wb = XLSX.utils.book_new();
            // Convert the data to a worksheet
            const ws = XLSX.utils.json_to_sheet(excelData);
            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(wb, ws, "CampData");
            // Generate the Excel file
            XLSX.writeFile(wb, "CampData.xlsx");
        };

        return (
            <div className="h-screen flex bg-[#8fcadd]">
                <Sidebar />
                <div className="w-4/5 p-8 overflow-y-auto">
                    <div className="mb-8 flex justify-between items-center">
                        <h1 className="text-4xl font-bold mb-8 text-gray-800">Camps</h1>
                        <div>
                            {["View Camps", "Add Camps"].map((btnText, index) => (
                                <button
                                    key={index}
                                    className="px-4 py-2 rounded-lg bg-blue-500 me-4 text-white"
                                    onClick={() => {
                                        setformVal(btnText);
                                    }}
                                >
                                    {btnText}
                                </button>
                            ))}
                        </div>
                    </div>

                    {formVal === "View Camps" ? (
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                                Camp Details
                            </h2>

                            <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center">
                                {/* Search by Camp Name */}
                                <div className="flex flex-col md:items-start">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Camp Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Search by Camp Name"
                                        value={tempSearchTerm}
                                        onChange={(e) => setTempSearchTerm(e.target.value)}
                                        className="w-full md:w-auto p-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Filter by Status */}
                                <div className="flex flex-col md:items-start">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Camp Type
                                    </label>
                                    <select
                                        value={tempFilterStatus}
                                        onChange={(e) => setTempFilterStatus(e.target.value)}
                                        className="w-full md:w-auto p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Previous">Previous</option>
                                        <option value="Live">Live</option>
                                        <option value="Upcoming">Upcoming</option>
                                    </select>
                                </div>

                                {/* Date From Filter */}
                                <div className="flex flex-col md:items-start">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Date From
                                    </label>
                                    <input
                                        type="date"
                                        value={tempDateFrom}
                                        onChange={(e) => setTempDateFrom(e.target.value)}
                                        className="w-full md:w-auto p-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Date To Filter */}
                                <div className="flex flex-col md:items-start">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Date To
                                    </label>
                                    <input
                                        type="date"
                                        value={tempDateTo}
                                        onChange={(e) => setTempDateTo(e.target.value)}
                                        className="w-full md:w-auto p-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Get Button */}
                                <div className="flex flex-col md:items-start">
                                    <button
                                        onClick={handleFilter}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                    >
                                        Get
                                    </button>
                                </div>

                                {/* Export to Excel Button */}
                                <div className="flex flex-col md:items-start">
                                    <button
                                        onClick={handleExportToExcel}
                                        className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
                                    >
                                        Export to Excel
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <p>Loading camp data...</p>
                            ) : error ? (
                                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            ) : filteredCampData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Camp Name
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Start Date
                                                    (YYYY-MM-DD)
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    End Date
                                                    (YYYY-MM-DD)
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Camp Details
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                {fileTypes.map((type) => (
                                                    <th
                                                        key={type}
                                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        {type}
                                                    </th>
                                                ))}
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Result
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredCampData.map((camp) => (
                                                <tr key={camp.id}>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        {camp.camp_name}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        {camp.start_date}
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        {camp.end_date}
                                                    </td>
                                                    <td className="px-4 py-2 ">{camp.camp_details}</td>
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        {camp.camp_type}
                                                    </td>
                                                    {fileTypes.map((fileType) => (
                                                        <td key={fileType} className="px-4 py-2 whitespace-nowrap">
                                                            {camp.camp_type === "Previous" && (
                                                                <>
                                                                    <input
                                                                        type="file"
                                                                        multiple
                                                                        onChange={(e) => handleFileChange(e, camp.id, fileType)}
                                                                        id={`fileUpload-${camp.id}-${fileType}`}
                                                                        className="hidden"
                                                                    />
                                                                    <label
                                                                        htmlFor={`fileUpload-${camp.id}-${fileType}`}
                                                                        className="px-3 py-1 rounded-md text-sm cursor-pointer mr-2"
                                                                        style={getLabelStyle(camp.id, fileType)}
                                                                    >
                                                                        {uploadedFileNames[camp.id]?.[fileType] ? (
                                                                            "Uploaded"
                                                                        ) : (
                                                                            "Choose Files"
                                                                        )}
                                                                    </label>
                                                                </>
                                                            )}
                                                        </td>
                                                    ))}
                                                    <td className="px-4 py-2 whitespace-nowrap">
                                                        {camp.camp_type === "Previous" && (
                                                            <button
                                                            onClick={() => handleFileUpload(camp.id)}
                                                            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                                                            disabled={loading || allFilesUploaded[camp.id]}
                                                        >
                                                             {allFilesUploaded[camp.id] ? "Uploaded" : "Upload All"}
                                                        </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No camp data available.</p>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                                Add a New Camp
                            </h2>
                            {error && (
                                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Camp Name
                                        </label>
                                        <input
                                            type="text"
                                            name="camp_name"
                                            value={formDatas.camp_name}
                                            onChange={handleChange}
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={formDatas.start_date}
                                            onChange={handleChange}
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            name="end_date"
                                            value={formDatas.end_date}
                                            onChange={handleChange}
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Camp Details
                                    </label>
                                    <textarea
                                        name="camp_details"
                                        value={formDatas.camp_details}
                                        onChange={handleChange}
                                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                                        required
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                    <div className="mt-6 md:mt-0">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                                        >
                                            {isSubmitting ? "Submitting..." : "Submitdata"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <section className="bg-white h-full flex items-center dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center">
                        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-900 md:text-4xl dark:text-white">
                            404
                        </h1>
                        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                            Something's missing.
                        </p>
                        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                            Sorry, we can't find that page. You'll find lots to explore on
                            the home page.{" "}
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex text-white bg-primary-600 hover:cursor-pointer hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </section>
        );
    }
};

export default EventsAndCamps;