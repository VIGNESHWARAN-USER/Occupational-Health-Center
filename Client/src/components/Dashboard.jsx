import React, { useState, useEffect } from 'react';
import Sidebar from "./Sidebar";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
    Brush
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { GrRun } from "react-icons/gr";

// Animation variants (same as before)
const chartVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: {
            duration: 0.2,
        },
    },
};

const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const radius = 10;

    return (
        <g>
            <text
                x={x + width / 2}
                y={y - radius}
                fill="#444"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="0.8em"  // Adjust font size for labels
            >
                {value}
            </text>
        </g>
    );
};

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
            <ResponsiveContainer width="100%" height={360}>
    <BarChart data={data} onClick={onItemClick}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Legend />
        <Bar dataKey="count" fill={color} isAnimationActive={false}>
            <LabelList dataKey="count" content={renderCustomizedLabel} />
        </Bar>
    </BarChart>
</ResponsiveContainer>
        </motion.div>
    );
};

const footFallOptions = [
    { value: "", label: "Select Footfall Type" },
    { value: "Employee", label: "Employee" },
    { value: "Contractor", label: "Contractor" },
    { value: "Employee+Contractor", label: "Employee + Contractor" },
    { value: "Visitor", label: "Visitor" },
    { value: "Total", label: "Total (Employee + Contractor + Visitor)" }
];

const OverAllFootFallDropdown = ({ value, onChange }) => {
    const variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    };

    return (
        <motion.div
            className="mb-4 w-full md:w-1/3"
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

    // Fitness Analysis State
    const [fitnessChartData, setFitnessChartData] = useState([]);
    const [originalFitnessData, setOriginalFitnessData] = useState([]);
    const [fitnessVisitData, setFitnessVisitData] = useState([]);

    // Display Toggle State
    const [activeAnalysis, setActiveAnalysis] = useState("footfall");  // 'footfall' or 'fitness'

    // API calls,  visitData set to https://occupational-health-center-1.onrender.com/visitData/
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

        // Apply date filter to fitness data as well
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
        // Visit Data Processing (Level 1)
        if (!visitData) {
            setBarChartData([]);
            return;
        }

        let mainData = [];
        let filteredData = visitData;

        // Apply dropdown filter (e.g., Employee, Contractor)
        if (overAllFootFall === "Employee+Contractor") {
            filteredData = visitData.filter(item => item.type === "Employee" || item.type === "Contractor");
        } else if (overAllFootFall && overAllFootFall !== "Total") {
            filteredData = visitData.filter(item => item.type === overAllFootFall);
        }
        else if (overAllFootFall === "Total") {
            filteredData = visitData; //No filter needed
        }

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
        if (!visitData) {
            setSecondBarChartData([]);
            return;
        }

        let detailData = [];
        if (selectedBar) {
            let filteredData = visitData;
            if (overAllFootFall === "Employee+Contractor") {
                filteredData = visitData.filter(item => item.type === "Employee" || item.type === "Contractor");
            } else if (overAllFootFall && overAllFootFall !== "Total") {
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
        if (selectedSubBar && selectedBar) { // Ensure both are selected
            const filteredVisitData = visitData.filter(item => 
                item.purpose === selectedSubBar && item.type_of_visit === selectedBar
            );

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
    }, [selectedSubBar, selectedBar, visitData]); // Add selectedBar to dependency array

    useEffect(() => {
        // Process and update fitness data for Clustered Bar Chart
        if (!fitnessVisitData) {
            return;
        }

        const employerTypes = ['Overall', 'Employee', 'Contractor', 'Visitor']; // Added 'Overall' at the start
        //const fitnessCategories = ['Fit', 'Unfit', 'Conditional Fit', 'Pending'];

        const fitnessData = employerTypes.map(employer => {
            let filteredData = fitnessVisitData;

            if (employer !== 'Overall') {
                filteredData = fitnessVisitData.filter(item => item.employer === employer);
            }

            const fitCount = filteredData.filter(item => item.overall_fitness === "fit").length;
            const unfitCount = filteredData.filter(item => item.overall_fitness === "unfit").length;
            const conditionalCount = filteredData.filter(item => item.overall_fitness === "conditional").length;
            const pendingCount = filteredData.filter(item =>  item.overall_fitness === "pending").length; //Corrected pending logic

            return {
                name: employer,
                Fit: fitCount,
                Unfit: unfitCount,
                Conditional: conditionalCount,
                Pending: pendingCount
            };
        });

        setFitnessChartData(fitnessData);
    }, [fitnessVisitData]);

    const toggleAnalysis = (analysisType) => {
        setActiveAnalysis(analysisType);
    };

    return (
        <div className="h-screen flex bg-[#8fcadd]">
            <Sidebar />
            <div className="flex-1 p-6 overflow-y-auto">

                {/* Top Section with Date Filters */}
                <motion.div
                    className="bg-white p-6 rounded-lg shadow-md mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                        Dashboard Statistics
                    </h2>
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
                                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                type="button"
                                onClick={fetchChartData}
                            >
                                Apply
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={clearDateFilter}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Analysis Toggle Buttons */}
                


                {/* Footfall Analysis */}
                {activeAnalysis === 'footfall' && (
                    <motion.div
                        className="bg-white rounded-lg shadow-md p-6"
                        variants={chartVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        
                        <div className='flex flex-col md:flex-row gap-4 items-start md:items-center'>
                        <h2 className="text-2xl font-semibold mb-4  text-gray-800">Fitness Analysis</h2>
                        <div className="flex justify-around gap-4 mb-6">
                    <button
                        className={`flex items-center bg-${activeAnalysis === 'footfall' ? 'blue' : 'gray'}-500 hover:bg-${activeAnalysis === 'footfall' ? 'blue' : 'gray'}-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                        onClick={() => toggleAnalysis('footfall')}
                    >
                        <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                        Footfall Analysis
                    </button>
                    <button
                        className={`flex items-center bg-${activeAnalysis === 'fitness' ? 'blue' : 'gray'}-500 hover:bg-${activeAnalysis === 'fitness' ? 'blue' : 'gray'}-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                        onClick={() => toggleAnalysis('fitness')}
                    >
                        <GrRun className='text-xl me-2'/>

                        Fitness Analysis
                    </button>
                </div>
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
                            {currentChartLevel === 1 && (
                                <MyBarChart
                                    key="chart1"
                                    title="Overall Data Distribution"
                                    data={barChartData}
                                    color="#3182CB"
                                    onItemClick={handleBarClick}
                                    visible={barChartData.length > 0}
                                />
                            )}

                            {currentChartLevel === 2 && (
                                <MyBarChart
                                    key="chart2"
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
                    </motion.div>
                )}


                {/* Fitness Analysis */}
                {activeAnalysis === 'fitness' && (
                    <motion.div
                        className="bg-white rounded-lg shadow-md p-6 mt-6"
                        variants={chartVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <div className='flex flex-col md:flex-row gap-4 items-start md:items-center'>
                        <h2 className="text-2xl font-semibold mb-4  text-gray-800">Fitness Analysis</h2>
                        <div className="flex justify-around gap-4 mb-6">
                    <button
                        className={`flex items-center bg-${activeAnalysis === 'footfall' ? 'blue' : 'gray'}-500 hover:bg-${activeAnalysis === 'footfall' ? 'blue' : 'gray'}-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                        onClick={() => toggleAnalysis('footfall')}
                    >
                        <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                        Footfall Analysis
                    </button>
                    <button
                        className={`flex items-center bg-${activeAnalysis === 'fitness' ? 'blue' : 'gray'}-500 hover:bg-${activeAnalysis === 'fitness' ? 'blue' : 'gray'}-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                        onClick={() => toggleAnalysis('fitness')}
                    >
                        <GrRun className='text-xl me-2'/>
                        Fitness Analysis
                    </button>
                </div>
                </div>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={fitnessChartData} margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Legend />
                                <Bar dataKey="Fit" fill="#2ecc71">
                                    <LabelList dataKey="Fit" content={renderCustomizedLabel} />
                                </Bar>
                                <Bar dataKey="Unfit" fill="#e74c3c">
                                    <LabelList dataKey="Unfit" content={renderCustomizedLabel} />
                                </Bar>
                                <Bar dataKey="Conditional" fill="#f39c12">
                                    <LabelList dataKey="Conditional" content={renderCustomizedLabel} />
                                </Bar>
                                <Bar dataKey="Pending" fill="#95a5a6">
                                    <LabelList dataKey="Pending" content={renderCustomizedLabel} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

            </div>
        </div>
    );
};

export default App;