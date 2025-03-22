import React, { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import moment from 'moment';

// Animation variants (same as before)
const chartVariants = { /* ... */ };

const renderCustomizedLabel = (props) => { /* ... */ };

const MyBarChart = ({ data, title, color, onItemClick, visible }) => {
    return (
        <motion.div
            className="bg-white p-4 rounded-lg shadow w-full overflow-hidden"
            variants={chartVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ display: visible ? 'block' : 'none' }}
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
                        label={<LabelList dataKey="count" content={renderCustomizedLabel} position="top" />}
                        style={{ scaleY: 1 }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

const footFallOptions = [
    { value: "", label: "Select Footfall Type" },
    { value: "Employee", label: "Employee" },
    { value: "Contractor", label: "Contractor" },
    { value: "Employee+Contractor", label: "Employee + Contractor"}, // ADDED
    { value: "Visitor", label: "Visitor" },
    { value: "Total", label: "Total (Employee + Contractor + Visitor)" },
    { value: "Fitness", label: "Fitness" }
];

const OverAllFootFallDropdown = ({ value, onChange }) => {
    const variants = { /* ... */ };

    return (
        <motion.div
            className="mb-4 w-full md:w-4/6"
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
                {footFallOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
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
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [visitData, setVisitData] = useState([]);
    const [currentChartLevel, setCurrentChartLevel] = useState(1);
    const [originalVisitData, setOriginalVisitData] = useState([]);
    const [fitnessChartData, setFitnessChartData] = useState([]);
    const [originalFitnessData, setOriginalFitnessData] = useState([]);  // Store original fitness data
    const [fitnessVisitData, setFitnessVisitData] = useState([]);
    const [userFilters, setUserFilters] = useState({});

    // User Filter Reference (same as before)
    const userFiltersReference = { /* ... */ };


    useEffect(() => {
        const fetchFitnessData = async () => {
            try {
                const resp = await axios.post("https://occupational-health-center-1.onrender.com/fitnessData/");
                console.log("Fitness data:", resp.data.data);
                setFitnessVisitData(resp.data.data);
                setOriginalFitnessData(resp.data.data);
            } catch (error) {
                console.error("Error fetching fitness data:", error);
            }
        };

        const fetchVisitData = async () => {
            try {
                const resp = await axios.post("https://occupational-health-center-1.onrender.com/visitData/");
                console.log("Visit data:", resp.data.data);
                setVisitData(resp.data.data);
                setOriginalVisitData(resp.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchFitnessData();
        fetchVisitData();
    }, []);


    const handleOverAllFootFallChange = (event) => {
        const selectedValue = event.target.value;
        setOverAllFootFall(selectedValue);
        setSelectedBar(null);
        setSelectedSubBar(null);
        setSecondBarChartData([]);
        setThirdBarChartData([]);
        setCurrentChartLevel(1);
        setFitnessChartData([]);
        setUserFilters(userFiltersReference[selectedValue] || {});
    };

    const handleBarClick = (event) => {
        if (event && event.activePayload && event.activePayload[0]) {
            const clickedBarName = event.activePayload[0].payload.name;
            setSelectedBar(clickedBarName);
            setSelectedSubBar(null);
            setSecondBarChartData([]);
            setThirdBarChartData([]);
            setCurrentChartLevel(2);
        }
    };

    const handleSubBarClick = (event) => {
        if (event && event.activePayload && event.activePayload[0]) {
            const clickedBarName = event.activePayload[0].payload.name;
            setSelectedSubBar(clickedBarName);
            setCurrentChartLevel(3);
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

    const fetchChartData = () => {
        if (!fromDate || !toDate) {
            alert("Please select both 'From' and 'To' dates.");
            return;
        }

        const from = moment(fromDate);
        const to = moment(toDate);

        const filteredVisitData = originalVisitData.filter(item => {
            const visitDate = moment(item.date);
            return visitDate.isSameOrAfter(from, 'day') && visitDate.isSameOrBefore(to, 'day');
        });
        setVisitData(filteredVisitData);

        const filteredFitnessData = originalFitnessData.filter(item => {
            const entryDate = moment(item.entry_date);
            return entryDate.isSameOrAfter(from, 'day') && entryDate.isSameOrBefore(to, 'day');
        });
        setFitnessVisitData(filteredFitnessData);
    };

    const clearDateFilter = () => {
        setFromDate('');
        setToDate('');
        setVisitData(originalVisitData);
        setFitnessVisitData(originalFitnessData);
    };

    useEffect(() => {
        if (!visitData || overAllFootFall === "Fitness") {
            setBarChartData([]);
            return;
        }

        let mainData = [];
        let filteredData = visitData;

        // Add the Employee+Contractor option
        if (overAllFootFall === "Employee+Contractor") {
            filteredData = visitData.filter(item => item.type === "Employee" || item.type === "Contractor");
        } else if (overAllFootFall !== "Total" && overAllFootFall !== "") {
            filteredData = visitData.filter(item => item.type === overAllFootFall);
        }

        // LEVEL 1 Chart: type_of_visit Breakdown
        const groupedData = {};
        filteredData.forEach(item => {
            const key = item.type_of_visit;
            if (groupedData[key]) {
                groupedData[key]++;
            } else {
                groupedData[key] = 1;
            }
        });
        mainData = Object.keys(groupedData).map(key => ({
            name: key,
            count: groupedData[key],
        }));
        setBarChartData(mainData);
    }, [overAllFootFall, visitData]);

    useEffect(() => {
        // Level 2 Chart: Purpose Breakdown based on selected type_of_visit
        if (!visitData || overAllFootFall === "Fitness") {
            setSecondBarChartData([]);
            return;
        }

        let detailData = [];
        if (selectedBar) {
            let filteredData = visitData;

            if (overAllFootFall === "Employee+Contractor") {
                filteredData = visitData.filter(item => item.type === "Employee" || item.type === "Contractor");
            }  else if (overAllFootFall !== "Total" && overAllFootFall !== "") {
                 filteredData = visitData.filter(item => item.type === overAllFootFall);
             }

            const subFilteredData = filteredData.filter(item => item.type_of_visit === selectedBar);

            const groupedData = {};
            subFilteredData.forEach(item => {
                const key = item.purpose;
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
        setSecondBarChartData(detailData);
    }, [selectedBar, overAllFootFall, visitData]);

    useEffect(() => {
        // Level 3 Chart: Register Breakdown based on selected Purpose
        let thirdData = [];
        if (selectedSubBar) {
            const filteredVisitData = visitData.filter(item => item.purpose === selectedSubBar);
            const groupedData = {};
            filteredVisitData.forEach(item => {
                const key = item.register;
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

    useEffect(() => {
        // Level 1 Fitness Data
        if (overAllFootFall === "Fitness") {
            if (!fitnessVisitData) {
                return;
            }
            const fitnessData = [
                { name: 'TotalFitness', count: fitnessVisitData.length },
                { name: 'Employee', count: fitnessVisitData.filter(item => item.employer === "Employee").length },
                { name: 'Contractor', count: fitnessVisitData.filter(item => item.employer === "Contractor").length },
                { name: 'Employee+Contractor', count: fitnessVisitData.filter(item => item.employer === "Employee+Contractor").length },
                { name: 'Visitor', count: fitnessVisitData.filter(item => item.employer === "Visitor").length },
            ];
            setFitnessChartData(fitnessData);
        }
        else {
            setFitnessChartData([]);
        }
    }, [overAllFootFall, fitnessVisitData]);

    useEffect(() => {
        // Level 2 Fitness data Detail chart for fit, unfit and conditional (including Pending)
        if (overAllFootFall === "Fitness" && selectedBar) {
            let fitnessDetailData = [];

            let filteredFitnessData = [];
            switch (selectedBar) {
                case 'TotalFitness':
                    filteredFitnessData = fitnessVisitData;
                    break;
                case 'Employee':
                    filteredFitnessData = fitnessVisitData.filter(item => item.employer === "Employee");
                    break;
                case 'Contractor':
                    filteredFitnessData = fitnessVisitData.filter(item => item.employer === "Contractor");
                    break;
                case 'Employee+Contractor':
                    filteredFitnessData = fitnessVisitData.filter(item => item.employer === "Employee" || item.employer === "Contractor");
                    break;
                case 'Visitor':
                    filteredFitnessData = fitnessVisitData.filter(item => item.employer === "Visitor");
                    break;
                default:
                    filteredFitnessData = [];
            }

            const fitCount = filteredFitnessData.filter(item => item.overall_fitness === "fit").length;
            const unfitCount = filteredFitnessData.filter(item => item.overall_fitness === "unfit").length;
            const conditionalCount = filteredFitnessData.filter(item => item.overall_fitness === "conditional").length;
            const pendingCount = filteredFitnessData.filter(item => !item.overall_fitness).length; //Count empty data

            fitnessDetailData = [
                { name: 'Fit', count: fitCount },
                { name: 'Unfit', count: unfitCount },
                { name: 'Conditional Fit', count: conditionalCount },
                 { name: 'Pending', count: pendingCount } // Add the pending
            ];

            setSecondBarChartData(fitnessDetailData);
        }
    }, [overAllFootFall, selectedBar, fitnessVisitData]);

    return (
        <div className="min-h-screen flex bg-[#8fcadd]">
            <Sidebar />
            <div className="flex-1 p-4 overflow-y-auto">
                <motion.div
                    className="bg-white p-6 rounded-lg shadow-md mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold mb-4">Dashboard Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="w-full">
                            <label htmlFor="fromDate" className="block text-gray-700 text-sm font-bold mb-2">From Date:</label>
                            <input
                                type="date"
                                id="fromDate"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="toDate" className="block text-gray-700 text-sm font-bold mb-2">To Date:</label>
                            <input
                                type="date"
                                id="toDate"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex justify-end w-full">
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
                    <div className='flex flex-col md:flex-row gap-4 items-start md:items-center'>
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

                    <AnimatePresence mode="wait">
                        {overAllFootFall !== "Fitness" && currentChartLevel === 1 && (
                            <MyBarChart
                                key="chart1"
                                title="Overall Data Distribution"
                                data={barChartData}
                                color="#3182CE"
                                onItemClick={handleBarClick}
                                visible={currentChartLevel === 1 && barChartData.length > 0}
                            />
                        )}

                        {overAllFootFall === "Fitness" && currentChartLevel === 1 && (
                            <MyBarChart
                                key="fitnessChart"
                                title="Fitness Category Breakdown"
                                data={fitnessChartData}
                                color="#6B46C1"
                                onItemClick={handleBarClick}
                                visible={overAllFootFall === "Fitness" && currentChartLevel === 1}
                            />
                        )}

                        {currentChartLevel === 2 && (
                            <MyBarChart
                                key="fitnessDetailChart"
                                title={`Breakdown by Purpose (${selectedBar})`}
                                data={secondBarChartData}
                                color="#82ca9d"
                                onItemClick={handleSubBarClick}
                                visible={currentChartLevel === 2}
                            />
                        )}
                        {currentChartLevel === 3 && (
                            <MyBarChart
                                key="thirdHierarchy"
                                title={`Breakdown by Register (${selectedSubBar})`}
                                data={thirdBarChartData}
                                color="#a855f7"
                                visible={currentChartLevel === 3}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default App;