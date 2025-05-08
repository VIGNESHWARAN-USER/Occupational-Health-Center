import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parse } from 'date-fns'; // Import date-fns
import { isValid } from 'date-fns'; // Import isValid

const VisitHistory = ({ data }) => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [visitReason, setVisitReason] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [visitData, setVisitData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const aadhar = data.aadhar;
    console.log(data)
    useEffect(() => {
        const fetchVisitData = async () => {
            try {
                const response = await axios.post(
                    `https://occupational-health-center-1.onrender.com/visitData/${aadhar}`
                );
                const data = await response.data.data;
                console.log(data);
                setVisitData(data);
                setFilteredData(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false); // Ensure loading is set to false even in error case
            }
        };
        fetchVisitData();
    }, [aadhar]);

    const applyFilter = () => {
        const filtered = visitData.filter((item) => {
            let visitDateObj;

            try {
                // Attempt to parse the date;  adjust the format string if needed
                visitDateObj = parse(item.date, 'yyyy-MM-dd', new Date()); // Try yyyy-MM-dd first
                if (!isValid(visitDateObj)) {
                    visitDateObj = parse(item.date, 'MM/dd/yyyy', new Date()); // Then try MM/dd/yyyy
                }
                if (!isValid(visitDateObj)) {
                    visitDateObj = new Date(item.date); // Fallback to native Date parsing
                }

                if (!isValid(visitDateObj)) {
                    console.error("Invalid date format:", item.date);
                    return false; // Skip this item if the date is invalid
                }

            } catch (error) {
                console.error("Error parsing date:", item.date, error);
                return false; // Skip this item if there's an error
            }

            const fromDateObj = fromDate ? new Date(fromDate) : null;
            const toDateObj = toDate ? new Date(toDate) : null;

            const dateCondition =
                (!fromDateObj || visitDateObj >= fromDateObj) &&
                (!toDateObj || visitDateObj <= toDateObj);

            const reasonCondition = visitReason ? item.register.toLowerCase() === visitReason.toLowerCase() : true;

            return dateCondition && reasonCondition;
        });
        setFilteredData(filtered);
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

                    {/* Apply Button */}
                    <button
                        onClick={applyFilter}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Apply
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <table className="min-w-full bg-white rounded-lg shadow-lg">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium">MRD No.</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Purpose</th>
                            <th className="px-6 py-3 text-left text-sm font-medium">
                                Visited Date
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium">Visit Outcome</th> 
                            <th className="px-6 py-3 text-left text-sm font-medium">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    <div className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                                </td>
                            </tr>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((visit, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-100 transition duration-200"
                                >
                                    <td className="px-6 py-4">{visit.mrdNo || "Null"}</td>
                                    <td className="px-6 py-4">{visit.register}</td>
                                    <td className="px-6 py-4">{visit.date}</td>
                                    <td className="px-6 py-4">{visit.visitOutcome}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => {
                                                navigate("../summary", {
                                                    state: { aadhar: aadhar, date: visit.date, visit: visitData.type_of_visit },
                                                });
                                            }}
                                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
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