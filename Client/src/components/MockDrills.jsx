import React from 'react';
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';

const MockDrills = () => {
    const accessLevel = localStorage.getItem('accessLevel');
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [viewButtonSelected, setViewButtonSelected] = useState(false);
    const [addButtonSelected, setAddButtonSelected] = useState(true);
    const [formDatas, setformDatas] = useState({
        date: '',
        time: '',
        department: '',
        location: '',
        scenario: '',
        ambulance_timing: '',
        departure_from_OHC: '',
        return_to_OHC: '',
        emp_no: '',
        victim_department: '',
        victim_name: '',
        nature_of_job: '',
        age: '',
        mobile_no: '',
        gender: '',
        vitals: '',
        complaints: '',
        treatment: '',
        referal: '',
        ambulance_driver: '',
        staff_name: '',
        OHC_doctor: '',
        staff_nurse: '',
        Responsible: '',
        Action_Completion: '',
    });
    const [mockDrillData, setMockDrillData] = useState([]);
    const [selectedDrill, setSelectedDrill] = useState(null); // State to hold the selected drill for detail view
    const [detailedView, setDetailedView] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');


    useEffect(() => {
        // Initialization: Add button selected by default
        handleAddMockDrills();
    }, []);

    const handleViewMockDrills = async () => {
        try {
            let url = 'https://occupational-health-center-1.onrender.com/get-mockdrills/?'; // Corrected URL
            if (fromDate) {
                url += `from_date=${fromDate}&`;
            }
            if (toDate) {
                url += `to_date=${toDate}&`;
            }

            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                setMockDrillData(data);
                setShowForm(false);
                setViewButtonSelected(true);
                setAddButtonSelected(false); // Keep add button unselected
                setDetailedView(true);
            } else {
                console.error("Failed to fetch:", response.status);
                alert("Failed to fetch data.");
            }
        } catch (error) {
            console.error("Error fetching:", error);
            alert("Error fetching data.");
        }
    };

    const handleAddMockDrills = () => {
        setShowForm(true);
        setViewButtonSelected(false);
        setAddButtonSelected(true);  // Make sure add button is selected
        setMockDrillData([]); //clear data from table
        setSelectedDrill(null); // Clear selected drill when adding
        setDetailedView(false);
        setFromDate('');
        setToDate('');
    };

    const handleChange = (e) => {
        setformDatas({ ...formDatas, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("https://occupational-health-center-1.onrender.com/save-mockdrills/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formDatas),
        });

        if (response.ok) {
            alert("Mock Drill data saved successfully");
            setformDatas({
                date: '',
                time: '',
                department: '',
                location: '',
                scenario: '',
                ambulance_timing: '',
                departure_from_OHC: '',
                return_to_OHC: '',
                emp_no: '',
                victim_department: '',
                victim_name: '',
                nature_of_job: '',
                age: '',
                mobile_no: '',
                gender: '',
                vitals: '',
                complaints: '',
                treatment: '',
                referal: '',
                ambulance_driver: '',
                staff_name: '',
                OHC_doctor: '',
                staff_nurse: '',
                Responsible: '',
                Action_Completion: '',
            });
            setShowForm(false);
            setMockDrillData([]);
            setViewButtonSelected(false);
            setAddButtonSelected(true);
            setSelectedDrill(null); // Clear selected drill after submission
            setDetailedView(false);
        } else {
            alert("Error saving data");
        }
    };

    const buttonStyle = {
        backgroundColor: addButtonSelected ? 'blue' : 'green',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        border: 'none',
        fontSize: '16px',
    };

    const buttonStyleView = {
        backgroundColor: viewButtonSelected ? 'blue' : 'green',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        border: 'none',
        fontSize: '16px',
    };

    // Function to handle view more click
    const handleViewMore = (drill) => {
        setSelectedDrill(drill);
    };

    const handleCloseDetails = () => {
        setSelectedDrill(null); // Clear selected drill to close the details view
    };

    const generateExcel = () => {
        if (mockDrillData.length === 0) {
            alert("No data to export!");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(mockDrillData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "MockDrills");
        XLSX.writeFile(workbook, "MockDrills.xlsx");
    };


    if (accessLevel === "nurse" || accessLevel === "doctor") {
        return (
            <div className="h-screen flex bg-[#8fcadd]">
                <Sidebar />
                <div className="w-4/5 h-screen overflow-auto p-8">

                    {/* Buttons moved to the top right corner */}
                    <div className="flex justify-end space-x-4 mb-4">
                        <button
                            style={buttonStyleView}
                            onClick={handleViewMockDrills}
                        >
                            View Mock Drills
                        </button>
                        <button
                            style={buttonStyle}
                            onClick={handleAddMockDrills}
                        >
                            Add Mock Drill
                        </button>
                    </div>

                    {detailedView && (
                        <div className="mb-4 flex space-x-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">From Date</label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">To Date</label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <button
                                    onClick={handleViewMockDrills}
                                    className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
                                >
                                    Apply Filter
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={generateExcel}
                                    className="bg-blue-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6 "
                                >
                                    Export to Excel
                                </button>
                            </div>
                        </div>

                    )}

                    {showForm && (
                        <>
                            <h2 className="text-4xl font-bold mt-8 ml-8 mb-4">Mock Drill</h2>
                            <motion.div
                                className="bg-white p-8 rounded-lg shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formDatas.date}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Time</label>
                                            <input
                                                type="time"
                                                name="time"
                                                value={formDatas.time}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                                            <input
                                                type="text"
                                                name="department"
                                                value={formDatas.department}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formDatas.location}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Scenario</label>
                                            <input
                                                type="text"
                                                name="scenario"
                                                value={formDatas.scenario}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">Ambulance Timing</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Departure from OHC</label>
                                            <input
                                                type="time"
                                                name="departure_from_OHC"
                                                value={formDatas.departure_from_OHC}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Return to OHC</label>
                                            <input
                                                type="time"
                                                name="return_to_OHC"
                                                value={formDatas.return_to_OHC}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Ambulance time</label>
                                            <input
                                                type="time"
                                                name="ambulance_timing"
                                                value={formDatas.ambulance_timing}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-semibold mb-6 text-gray-700">Victim Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Emp ID</label>
                                            <input
                                                type="text"
                                                name="emp_no"
                                                value={formDatas.emp_no}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Victim Name</label>
                                            <input
                                                type="text"
                                                name="victim_name"
                                                value={formDatas.victim_name}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formDatas.age}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                                            <input
                                                type="text"
                                                name="gender"
                                                value={formDatas.gender}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Victim Department</label>
                                            <input
                                                type="text"
                                                name="victim_department"
                                                value={formDatas.victim_department}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Nature of Job</label>
                                            <input
                                                type="text"
                                                name="nature_of_job"
                                                value={formDatas.nature_of_job}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Mobile No</label>
                                            <input
                                                type="text"
                                                name="mobile_no"
                                                value={formDatas.mobile_no}
                                                onChange={handleChange}
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Complaints</label>
                                        <textarea
                                            name="complaints"
                                            value={formDatas.complaints}
                                            onChange={handleChange}
                                            placeholder="Complaints"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Treatment</label>
                                        <textarea
                                            name="treatment"
                                            value={formDatas.treatment}
                                            onChange={handleChange}
                                            placeholder="Treatment"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Referral</label>
                                        <textarea
                                            name="referal"
                                            value={formDatas.referal}
                                            onChange={handleChange}
                                            placeholder="Referral"
                                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <h3 className="text-2xl font-semibold mb-6 text-gray-700">Ambulance</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Ambulance Driver</label>
                                            <input
                                                name="ambulance_driver"
                                                value={formDatas.ambulance_driver}
                                                onChange={handleChange}
                                                placeholder="Ambulance Driver"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Staff Name</label>
                                            <input
                                                name="staff_name"
                                                value={formDatas.staff_name}
                                                onChange={handleChange}
                                                placeholder="Staff Name"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <h4 className="text-2xl font-semibold mb-6 text-gray-700">OHC</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">OHC Doctor</label>
                                            <input
                                                name="OHC_doctor"
                                                value={formDatas.OHC_doctor}
                                                onChange={handleChange}
                                                placeholder="OHC Doctor"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Staff Nurse</label>
                                            <input
                                                name="staff_nurse"
                                                value={formDatas.staff_nurse}
                                                onChange={handleChange}
                                                placeholder="Staff Nurse"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <h4 className="text-2xl font-semibold mb-6 text-gray-700">OHC Observation/Action/Follow up</h4>
                                    <div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Vitals</label>
                                            <textarea
                                                name="vitals"
                                                value={formDatas.vitals}
                                                onChange={handleChange}
                                                placeholder="Vitals"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Action / Completion</label>
                                            <textarea
                                                name="Action_Completion"
                                                value={formDatas.Action_Completion}
                                                onChange={handleChange}
                                                placeholder="Action / Completion"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Responsible</label>
                                            <textarea
                                                name="Responsible"
                                                value={formDatas.Responsible}
                                                onChange={handleChange}
                                                placeholder="Responsible"
                                                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-200"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>

                            </motion.div>
                        </>
                    )}
                    {detailedView && (
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-lg overflow-x-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Mock Drill Records</h2>
                                <table className="table-auto w-full border-collapse">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            {/* Dynamically create table headers from the keys of the first data item */}
                                            {mockDrillData.length > 0 && Object.keys(mockDrillData[0]).map(key => (
                                                <th key={key} className="px-4 py-2 border border-gray-300">{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockDrillData.map((drill) => (
                                            <tr key={drill.id} className="border-b border-gray-200">
                                                {/* Dynamically populate table cells from the values of each data item */}
                                                {Object.values(drill).map((value, index) => (
                                                    <td key={index} className="px-4 py-2 border border-gray-300">{value != null ? value.toString() : ''}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        </motion.div>

                    )}

                    {selectedDrill && (
                        <motion.div
                            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center overflow-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full">
                                <div className="p-6 overflow-y-auto max-h-[80vh]">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Mock Drill Details</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Date:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.date}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Time:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.time}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Department:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.department}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Location:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.location}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Scenario:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.scenario}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Ambulance Timing:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.ambulance_timing}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Departure from OHC:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.departure_from_OHC}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Return to OHC:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.return_to_OHC}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Emp No:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.emp_no}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Victim Department:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.victim_department}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Victim Name:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.victim_name}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Nature of Job:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.nature_of_job}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Age:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.age}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Mobile No:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.mobile_no}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Gender:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.gender}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Vitals:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.vitals}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Complaints:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.complaints}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Treatment:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.treatment}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Referal:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.referal}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Ambulance Driver:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.ambulance_driver}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Staff Name:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.staff_name}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">OHC Doctor:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.OHC_doctor}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Staff Nurse:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.staff_nurse}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Responsible:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.Responsible}</div>
                                        </div>
                                        <div>
                                            <strong className="block font-bold text-gray-700 mb-1">Action Completion:</strong>
                                            <div className="text-gray-900 break-words">{selectedDrill.Action_Completion}</div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            onClick={handleCloseDetails}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-900 md:text-4xl dark:text-white">404</h1>
                        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
                        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
                        <button onClick={() => navigate(-1)} className="inline-flex text-white bg-primary-primary-600 hover:cursor-pointer hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back</button>
                    </div>
                </div>
            </section>
        );
    }
};

export default MockDrills;