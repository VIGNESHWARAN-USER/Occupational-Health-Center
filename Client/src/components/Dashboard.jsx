import React, { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import moment from 'moment'; // Import moment

// Animation variants for charts
const chartVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delayChildren: 0.2,
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: 50,
        transition: { duration: 0.3 }
    }
};

// Animation variants for individual bars
const barVariants = {
    initial: { scaleY: 0 },
    animate: { scaleY: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { scaleY: 0, transition: { duration: 0.3, ease: "easeIn" } }
};

const MyBarChart = ({ data, title, color, onItemClick, visible }) => {
    return (
        <motion.div
            className="bg-white p-4 rounded-lg shadow w-full overflow-hidden"
            variants={chartVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ display: visible ? 'block' : 'none' }}  // Important for AnimatePresence
        >
            <h4 className="text-lg font-semibold text-gray-800 mb-3">{title}</h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} onClick={onItemClick}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="count"
                        fill={color}
                        label={{ position: 'top' }}
                        // Apply bar-specific animation
                        // Can't use variants directly on <Bar>, so do it with style
                        style={{ scaleY: 1 }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
};


const OverAllFootFallDropdown = ({ value, onChange }) => {
    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <motion.div
            className="mb-4 w-4/6"
            variants={variants}
            initial="hidden"
            animate="visible"
        >
            <select
                id="over-all-footfall"
                value={value}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
                <option value="">Select Footfall Type</option>
                <option value="Total">Total</option>
                <option value="Employee">Employee</option>
                <option value="Contractor">Contractor</option>
                <option value="Employee+Contractor">Employee + Contractor</option>
                <option value="Visitor">Visitor</option>
            </select>
        </motion.div>
    );
};

const App = () => {
    const [barChartData, setBarChartData] = useState([]);
    const [secondBarChartData, setSecondBarChartData] = useState([]);
    const [thirdBarChartData, setThirdBarChartData] = useState([]);
    const [selectedBar, setSelectedBar] = useState(null);
    const [selectedSubBar, setSelectedSubBar] = useState(null);
    const [overAllFootFall, setOverAllFootFall] = useState("");
    const [fromDate, setFromDate] = useState(''); // State for "From" date
    const [toDate, setToDate] = useState(''); // State for "To" date
    const [visitData, setVisitData] = useState([]);
    const [currentChartLevel, setCurrentChartLevel] = useState(1); // 1: main, 2: sub, 3: detail
    const [originalVisitData, setOriginalVisitData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.post("https://occupational-health-center-1.onrender.com/visitData/");
                console.log(resp.data);
                setVisitData(resp.data.data); // Store the fetched data in state
                setOriginalVisitData(resp.data.data); // Store the original data for resetting filters
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, []);

    const handleOverAllFootFallChange = (event) => {
        setOverAllFootFall(event.target.value);
        setSelectedBar(null);
        setSelectedSubBar(null);
        setSecondBarChartData([]);
        setThirdBarChartData([]);
        setCurrentChartLevel(1);  // Reset to the main chart
    };

    const handleBarClick = (event) => {
        if (event && event.activePayload && event.activePayload[0]) {
            setSelectedBar(event.activePayload[0].payload.name);
            setSelectedSubBar(null);
            setSecondBarChartData([]);
            setThirdBarChartData([]);
            setCurrentChartLevel(2); // Move to sub chart
        }
    };

    const handleSubBarClick = (event) => {
        if (event && event.activePayload && event.activePayload[0]) {
            setSelectedSubBar(event.activePayload[0].payload.name);
            setCurrentChartLevel(3); // Move to detail chart
        }
    };


    const goBack = () => {
        if (currentChartLevel === 2) {
            setCurrentChartLevel(1);
            setSelectedBar(null);
            setSecondBarChartData([]);

        } else if (currentChartLevel === 3) {
            setCurrentChartLevel(2);
            setSelectedSubBar(null);
            setThirdBarChartData([]);
        }
    };

    useEffect(() => {
        if (!visitData || visitData.length === 0) {
            return;
        }

        let mainData = [];

        if (overAllFootFall) {
            let filteredData = visitData;

            if (overAllFootFall !== "Total") {
                filteredData = visitData.filter(item => item.type === overAllFootFall);
            }
            console.log("Filtered data:", filteredData);

            const preventiveCount = filteredData.filter(item => item.type_of_visit === "Preventive").length;
            const curativeCount = filteredData.filter(item => item.type_of_visit === "Curative").length;

            mainData = [
                { name: 'Preventive', count: preventiveCount },
                { name: 'Curative', count: curativeCount },
            ];
        }
        setBarChartData(mainData);

    }, [overAllFootFall, visitData]);

    useEffect(() => {
        if (!visitData || visitData.length === 0) {
            return;
        }

        let detailData = [];

        if (selectedBar) {
            let filteredData = visitData;

            if (overAllFootFall !== "Total") {
                filteredData = visitData.filter(item => item.type === overAllFootFall);
            }

            let subFilteredData;

            if (selectedBar === "Preventive") {
                subFilteredData = filteredData.filter(item => item.type_of_visit === "Preventive");
            } else if (selectedBar === "Curative") {
                subFilteredData = filteredData.filter(item => item.type_of_visit === "Curative");
            }

            if (subFilteredData) {
                // Group by purpose or register based on what's relevant
                const groupedData = {};
                subFilteredData.forEach(item => {
                    const key = item.purpose || item.register; // Use 'purpose' if available, otherwise 'register'

                    if (groupedData[key]) {
                        groupedData[key]++;
                    } else {
                        groupedData[key] = 1;
                    }
                });

                detailData = Object.keys(groupedData).map(key => ({
                    name: key,
                    count: groupedData[key],
                }));
            }
        }
        setSecondBarChartData(detailData);

    }, [selectedBar, overAllFootFall, visitData]);

    useEffect(() => {
        let thirdData = [];

        if (selectedSubBar) {
            const filteredVisitData = visitData.filter(item => item.purpose === selectedSubBar || item.register === selectedSubBar);

            // Group by register or other relevant field for the third chart
            const groupedData = {};
            filteredVisitData.forEach(item => {
                const key = item.register || item.date; // Group by date or any other relevant field
                if (groupedData[key]) {
                    groupedData[key]++;
                } else {
                    groupedData[key] = 1;
                }
            });

            thirdData = Object.keys(groupedData).map(key => ({
                name: key,
                count: groupedData[key],
            }));
        }

        setThirdBarChartData(thirdData);
    }, [selectedSubBar, visitData]);


    const fetchChartData = () => {
        if (!fromDate || !toDate) {
            alert("Please select both 'From' and 'To' dates.");
            return;
        }

        // Filter the originalVisitData based on the date range
        const filteredData = originalVisitData.filter(item => {
            const visitDate = moment(item.date); // Assuming 'date' field is in a recognizable format
            const from = moment(fromDate);
            const to = moment(toDate);
            return visitDate.isSameOrAfter(from, 'day') && visitDate.isSameOrBefore(to, 'day');
        });

        setVisitData(filteredData);
    };

    const clearDateFilter = () => {
        setFromDate('');
        setToDate('');
        setVisitData(originalVisitData); // Reset to original data
    };


    return (
        <div className="h-screen flex bg-[#8fcadd]">
            <Sidebar />
            <div className="flex-1 p-4 overflow-y-auto">
                {/* Header with Filters */}
                <motion.div
                    className="bg-white p-6 rounded-lg shadow-md mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold mb-4">Dashboard Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label htmlFor="fromDate" className="block text-gray-700 text-sm font-bold mb-2">From Date:</label>
                            <input
                                type="date"
                                id="fromDate"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div>
                            <label htmlFor="toDate" className="block text-gray-700 text-sm font-bold mb-2">To Date:</label>
                            <input
                                type="date"
                                id="toDate"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                type="button"
                                onClick={fetchChartData}
                            >
                                Apply
                            </button>
                            <button
                                className="bg-gray-400 hover:bg-gray-500 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={clearDateFilter}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className='flex gap-4'>
                    <h2 className="text-2xl font-semibold mb-4">Footfall Analysis</h2>

                    <OverAllFootFallDropdown value={overAllFootFall} onChange={handleOverAllFootFallChange} />
                        <button
                        disabled={currentChartLevel === 1}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mb-4"
                            onClick={goBack}
                        >
                            Back
                        </button>
                    </div>
                    

                    <AnimatePresence mode="wait" >
                        {currentChartLevel === 1 && (
                            <MyBarChart
                                key="chart1"  // Key for AnimatePresence
                                title="Overall Data Distribution"
                                data={barChartData}
                                color="#3182CE"
                                onItemClick={handleBarClick}
                                visible={currentChartLevel === 1 && barChartData.length > 0}
                            />
                        )}

                        {currentChartLevel === 2 && (
                            <MyBarChart
                                key="chart2"  // Key for AnimatePresence
                                title="Subdivision Details"
                                data={secondBarChartData}
                                color="#82ca9d"
                                onItemClick={handleSubBarClick}
                                visible={currentChartLevel === 2 && secondBarChartData.length > 0}
                            />
                        )}

                        {currentChartLevel === 3 && (
                            <MyBarChart
                                key="chart3"  // Key for AnimatePresence
                                title="Detailed Analysis"
                                data={thirdBarChartData}
                                color="#E53E3E"
                                visible={currentChartLevel === 3 && thirdBarChartData.length > 0}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default App;