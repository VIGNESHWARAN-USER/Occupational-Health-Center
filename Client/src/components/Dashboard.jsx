import React, { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import axios from 'axios';



const MyBarChart = ({ data, title, color, onItemClick, index }) => {
    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.2,  // Staggered delay based on index
            },
        },
    };

    return (
        <motion.div
            className="bg-white p-4 rounded-lg shadow w-full"
            variants={variants}
            initial="hidden"
            animate="visible"
        >
            <h4 className="text-lg font-semibold text-gray-800 mb-3">{title}</h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} onClick={onItemClick}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill={color} label={{ position: 'top' }} />
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
            className="mb-4"
            variants={variants}
            initial="hidden"
            animate="visible"
        >
            <label htmlFor="over-all-footfall" className="block text-gray-700 text-sm font-bold mb-2">
                Overall Footfall:
            </label>
            <select
                id="over-all-footfall"
                value={value}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
                <option value="">Select Footfall Type</option>
                <option value="Employee">Employee</option>
                <option value="Contractor">Contractor</option>
                <option value="Employee+Contractor">Employee + Contractor</option>
                <option value="Total">Total</option>
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
    const [showCharts, setShowCharts] = useState(false); // State to control chart visibility
    const [fromDate, setFromDate] = useState(''); // State for "From" date
    const [toDate, setToDate] = useState(''); // State for "To" date
    const [visitData, setVisitData] = useState([]);



    useEffect(() => {
      const fetchData = async () => {
        try {
          const resp = await axios.post("http://localhost:8000/visitData/");
          console.log(resp.data);
          setVisitData(resp.data.data); // Store the fetched data in state
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
        setShowCharts(true);  // Show charts after dropdown changes
    };

    const handleBarClick = (event) => {
        if (event && event.activePayload && event.activePayload[0]) {
            setSelectedBar(event.activePayload[0].payload.name);
            setSelectedSubBar(null);
            setSecondBarChartData([]);
            setThirdBarChartData([]);
        }
    };

    const handleSubBarClick = (event) => {
        if (event && event.activePayload && event.activePayload[0]) {
            setSelectedSubBar(event.activePayload[0].payload.name);
        }
    };

    useEffect(() => {
        if (!visitData || visitData.length === 0) {
            return; // Don't proceed if visitData is empty or not yet loaded.
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
            return; // Don't proceed if visitData is empty or not yet loaded.
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
                const key = item.register || item.date ; // Group by date or any other relevant field
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
        // Placeholder for fetching data based on date range
        console.log("Fetching data from:", fromDate, "to:", toDate);
        // Add your data fetching logic here
        // Example:
        //  fetchData(fromDate, toDate).then(data => {
        //    setChartData(processData(data));
        //  });
    };

    const clearDateFilter = () => {
        setFromDate('');
        setToDate('');
        // Optionally, refetch the original data
        // fetchOriginalData().then(data => {
        //   setChartData(processData(data));
        // });
    };

    const chartData = [
        {
            title: "Overall Data Distribution",
            data: barChartData,
            color: "#3182CE",
            onItemClick: handleBarClick,
            show: true,  // Always show this chart
        },
        {
            title: "Subdivision Details",
            data: secondBarChartData,
            color: "#82ca9d",
            onItemClick: handleSubBarClick,
            show: secondBarChartData.length > 0,
        },
        {
            title: "Detailed Analysis",
            data: thirdBarChartData,
            color: "#E53E3E",
            show: thirdBarChartData.length > 0,
        },
    ];

    return (
        <div className="h-screen flex bg-[#8fcadd]">
            <Sidebar />
            <div className="flex-1 p-4 overflow-y-auto">  {/* Added overflow-y-auto */}

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
                    <h2 className="text-2xl font-semibold mb-4">Footfall Analysis</h2>

                    <OverAllFootFallDropdown value={overAllFootFall} onChange={handleOverAllFootFallChange} />

                    <div className="flex flex-col gap-4">  {/* Changed to flex column */}
                        {chartData.map((chart, index) => (
                            chart.show && (
                                <MyBarChart
                                    key={index}
                                    index={index}  // Pass the index
                                    title={chart.title}
                                    data={chart.data}
                                    color={chart.color}
                                    onItemClick={chart.onItemClick}
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;