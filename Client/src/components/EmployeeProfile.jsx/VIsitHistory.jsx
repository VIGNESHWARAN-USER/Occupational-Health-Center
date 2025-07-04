import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parse, isValid } from 'date-fns';

const VisitHistory = ({ data }) => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [visitReason, setVisitReason] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [visitData, setVisitData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const aadhar = data.aadhar;

    useEffect(() => {
        const fetchVisitData = async () => {
            if (!aadhar) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.post(
                    `https://occupational-health-center-1.onrender.com/visitData/${aadhar}`
                );
                const data = response.data.data || [];
                console.log(data);
                setVisitData(data);
                setFilteredData(data);
            } catch (error) {
                console.error("Error fetching visit data:", error);
                setVisitData([]);
                setFilteredData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchVisitData();
    }, [aadhar]);

    const applyFilter = () => {
        const filtered = visitData.filter((item) => {
            let visitDateObj;
            try {
                visitDateObj = parse(item.date, 'yyyy-MM-dd', new Date());
                if (!isValid(visitDateObj)) {
                    visitDateObj = parse(item.date, 'MM/dd/yyyy', new Date());
                }
                if (!isValid(visitDateObj)) {
                    visitDateObj = new Date(item.date);
                }
                if (!isValid(visitDateObj)) {
                    console.error("Invalid date format:", item.date);
                    return false;
                }
            } catch (error) {
                console.error("Error parsing date:", item.date, error);
                return false;
            }

            const fromDateObj = fromDate ? new Date(fromDate) : null;
            const toDateObj = toDate ? new Date(toDate) : null;

            const dateCondition =
                (!fromDateObj || visitDateObj >= fromDateObj) &&
                (!toDateObj || visitDateObj <= toDateObj);

            const reasonCondition = visitReason
                ? item.register.toLowerCase() === visitReason.toLowerCase()
                : true;

            return dateCondition && reasonCondition;
        });
        setFilteredData(filtered);
    };

    // Helper function to format field names for display
    const formatFieldName = (name) => {
        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Filters */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 bg-white p-6 shadow-md rounded-lg mb-6">
                {/* From Date Input */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        From Date
                    </label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* To Date Input */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        To Date
                    </label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Visit Reason & Apply Button */}
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Visit Reason
                        </label>
                        <select
                            value={visitReason}
                            onChange={(e) => setVisitReason(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">Select Reason</option>
                            <option>Pre employment</option>
                            <option>Pre employment (Food Handler)</option>
                            <option>Pre Placement</option>
                            <option>Annual / Periodical</option>
                            <option>Periodical (Food Handler)</option>
                            <option>Camps (Mandatory)</option>
                            <option>Camps (Optional)</option>
                            <option>Special Work Fitness</option>
                            <option>Special Work Fitness (Renewal)</option>
                            <option>Fitness After Medical Leave</option>
                            <option>Mock Drill</option>
                            <option>BP Sugar Check (Normal Value)</option>
                            <option>Retirement Examination</option>
                            <option>Illness</option>
                            <option>Over Counter Illness</option>
                            <option>Injury</option>
                            <option>Over Counter Injury</option>
                            <option>Follow-up Visits</option>
                            <option>BP Sugar Chart</option>
                            <option>Injury Outside the Premises</option>
                            <option>Over Counter Injury Outside the Premises</option>
                            <option>Alcohol Abuse</option>
                        </select>
                    </div>

                    <button
                        onClick={applyFilter}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Apply
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-lg">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">MRD No.</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Purpose</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Visited Date</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Visit Outcome</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Uploads</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    <div className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                                </td>
                            </tr>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((visit, index) => {
                                // ==== MODIFICATION START ====

                                // Define the fields in 'vitals' you want to check for.
                                const uploadableFields = [
                                    'application_form',
                                    'manual',
                                    'self_declared',
                                    'consent',
                                    'fc',
                                    'report'
                                ];

                                // Check if visit.vitals exists and filter the fields that have a value.
                                const availableUploads = visit.vitals
                                    ? uploadableFields.filter(field => visit.vitals[field])
                                    : [];

                                return (
                                    <tr key={index} className="hover:bg-gray-100 transition duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">{visit.mrdNo || "N/A"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{visit.register}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{visit.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{visit.visitOutcome || "N/A"}</td>
                                        
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {availableUploads.length > 0 ? (
                                                    availableUploads.map((fieldName, fieldIndex) => (
                                                        <span 
                                                            key={fieldIndex}
                                                            className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full"
                                                        >
                                                            {formatFieldName(fieldName)}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-500 text-sm">No uploads</span>
                                                )}
                                            </div>
                                        </td>
                                        
                                        {/* ==== MODIFICATION END ==== */}

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    navigate("../summary", {
                                                        state: { aadhar: aadhar, date: visit.date, visit: visit },
                                                    });
                                                }}
                                                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500">
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VisitHistory;