import React, { useState, useEffect } from 'react';  // Import useEffect
import { FaTrash } from 'react-icons/fa';
import axios from 'axios'; // Import axios

const Prescription = ({ data }) => {
    const emp_no = data[0]?.emp_no;
    const existingPrescription = data[0]?.prescription;

    // Use useEffect to initialize state from props
    useEffect(() => {
        if (existingPrescription) {
            setTablets(existingPrescription.tablets || []);
            setInjections(existingPrescription.injections || []);
            setCreams(existingPrescription.creams || []);
            setOthers(existingPrescription.others || []);
            setSubmittedBy(existingPrescription.submitted_by || 'SK');
            setIssuedby(existingPrescription.issued_by || 'Nurse');
            setNurseNotes(existingPrescription.nurse_notes || '');
        }
    }, [existingPrescription]); // Dependency array ensures this only runs when existingPrescription changes

    const [tablets, setTablets] = useState([{ drugName: '', qty: '', timing: '', food: '', days: '', comments: '' }]);
    const [injections, setInjections] = useState([{ drugName: '', qty: '' }]);
    const [creams, setCreams] = useState([{ drugName: '', qty: '' }]);
    const [others, setOthers] = useState([{ drugName: '', qty: '' }]);
    const [submittedBy, setSubmittedBy] = useState('SK');
    const [issuedby, setIssuedby] = useState('Nurse');
    const [nurseNotes, setNurseNotes] = useState(''); // State for nurse notes
    const timingOptions = ["FN", "AN", "N", "Stat"];
    const foodOptions = ["BF", "AF", "WF"];
    const accessLevel = localStorage.getItem('accessLevel');
    const isDoctor = accessLevel === 'doctor';
    const isNurse = accessLevel === 'nurse';



    // Early return if emp_no is missing
    if (!emp_no) {
        return <div>Get employee details</div>; // Or a more descriptive message/component
    }

    const addRow = (type) => {
        if (!isDoctor) return; //Prevent adding rows for nurses
        switch (type) {
            case 'tablets':
                setTablets([...tablets, { drugName: '', qty: '', timing: '', food: '', days: '', comments: '' }]);
                break;
            case 'injections':
                setInjections([...injections, { drugName: '', qty: '' }]);
                break;
            case 'creams':
                setCreams([...creams, { drugName: '', qty: '' }]);
                break;
            case 'others':
                setOthers([...others, { drugName: '', qty: '' }]);
                break;
            default:
                break;
        }
    };

    const handleInputChange = (e, type, index, field) => {
        if (!isDoctor) return; //Prevent input change for nurses
        const { value } = e.target;
        switch (type) {
            case 'tablets':
                const newTablets = [...tablets];
                newTablets[index][field] = value;
                setTablets(newTablets);
                break;
            case 'injections':
                const newInjections = [...injections];
                newInjections[index][field] = value;
                setInjections(newInjections);
                break;
            case 'creams':
                const newCreams = [...creams];
                newCreams[index][field] = value;
                setCreams(newCreams);
                break;
            case 'others':
                const newOthers = [...others];
                newOthers[index][field] = value;
                setOthers(newOthers);
                break;
            default:
                break;
        }
    };

    const removeRow = (type, index) => {
        if (!isDoctor) return; //Prevent removing rows for nurses
        switch (type) {
            case 'tablets':
                const newTablets = [...tablets];
                newTablets.splice(index, 1);
                setTablets(newTablets);
                break;
            case 'injections':
                const newInjections = [...injections];
                newInjections.splice(index, 1);
                setInjections(newInjections);
                break;
            case 'creams':
                const newCreams = [...creams];
                newCreams.splice(index, 1);
                setCreams(newCreams);
                break;
            case 'others':
                const newOthers = [...others];
                newOthers.splice(index, 1);
                setOthers(newOthers);
                break;
            default:
                break;
        }
    };

    const renderInputFields = (type, items, index) => {
        const isDisabled = !isDoctor;

        switch (type) {
            case 'tablets':
                return (
                    <>
                        <input
                            type="text"
                            placeholder="Name of the Drug"
                            value={items[index].drugName}
                            onChange={(e) => handleInputChange(e, type, index, 'drugName')}
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isDisabled}
                        />
                        <input
                            type="text"
                            placeholder="Qty"
                            value={items[index].qty}
                            onChange={(e) => handleInputChange(e, type, index, 'qty')}
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isDisabled}
                        />
                        <select
                            value={items[index].timing}
                            onChange={(e) => handleInputChange(e, type, index, 'timing')}
                            className="px-3 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isDisabled}
                        >
                            <option value="">Select Timing</option>
                            {timingOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <select
                            value={items[index].food}
                            onChange={(e) => handleInputChange(e, type, index, 'food')}
                            className="px-3 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isDisabled}
                        >
                            <option value="">Select Food</option>
                            {foodOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Days"
                            value={items[index].days}
                            onChange={(e) => handleInputChange(e, type, index, 'days')}
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isDisabled}
                        />
                        <input
                            type="text"
                            placeholder="Comments"
                            value={items[index].comments}
                            onChange={(e) => handleInputChange(e, type, index, 'comments')}
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isDisabled}
                        />
                    </>
                );
            case 'injections':
            case 'creams':
            case 'others':
                return (
                    <>
                        <input
                            type="text"
                            placeholder="Name of the Drug"
                            value={items[index].drugName}
                            onChange={(e) => handleInputChange(e, type, index, 'drugName')}
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isDisabled}
                        />
                        <input
                            type="text"
                            placeholder="Qty"
                            value={items[index].qty}
                            onChange={(e) => handleInputChange(e, type, index, 'qty')}
                            className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isDisabled}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    const handleSubmit = async () => {
        const prescriptionData = {
            emp_no,
            tablets,
            injections,
            creams,
            others,
            submittedBy,
            issuedby,
            nurseNotes, // Include nurseNotes
        };

        try {
            const response = await axios.post('https://occupational-health-center-1.onrender.com/prescriptions/', prescriptionData); // Adjust the endpoint as needed
            console.log('Prescription data submitted successfully:', response.data);
            // Optionally, reset the form after successful submission
            setTablets([{ drugName: '', qty: '', timing: '', food: '', days: '', comments: '' }]);
            setInjections([{ drugName: '', qty: '' }]);
            setCreams([{ drugName: '', qty: '' }]);
            setOthers([{ drugName: '', qty: '' }]);
            setNurseNotes(''); // Reset nurse notes
            alert("Data send successfuly !!")


        } catch (error) {
            console.error('Error submitting prescription data:', error);
            // Handle errors (e.g., display an error message to the user)
        }
    };

    return (
        <div className="bg-white min-h-screen p-6">
            <h1 className="ext-3xl font-bold mb-8">Prescription Form</h1>

            <section className="mb-5">
                <h2 className="text-lg mb-2 text-gray-700">Tablets:</h2>
                {tablets.map((tablet, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-7 gap-3 mb-3 items-center">
                        {renderInputFields('tablets', tablets, index)}
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeRow('tablets', index)}
                                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded w-8 h-8 flex items-center justify-center ${!isDoctor ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={!isDoctor}
                            >
                                <FaTrash size={12} /> {/*  Small Icon */}
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={() => addRow('tablets')}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!isDoctor ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={!isDoctor}>
                    Add
                </button>
            </section>

            <section className="mb-5">
                <h2 className="text-lg mb-2 text-gray-700">Injection:</h2>
                {injections.map((injection, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 items-center">
                        {renderInputFields('injections', injections, index)}
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeRow('injections', index)}
                                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded w-8 h-8 flex items-center justify-center ${!isDoctor ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={!isDoctor}
                            >
                                <FaTrash size={12} />  {/*  Small Icon */}
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={() => addRow('injections')}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!isDoctor ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={!isDoctor}>
                    Add
                </button>
            </section>

            <section className="mb-5">
                <h2 className="text-lg mb-2 text-gray-700">Creams:</h2>
                {creams.map((cream, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 items-center">
                        {renderInputFields('creams', creams, index)}
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeRow('creams', index)}
                                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded w-8 h-8 flex items-center justify-center ${!isDoctor ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={!isDoctor}
                            >
                                <FaTrash size={12} />  {/*  Small Icon */}
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={() => addRow('creams')}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!isDoctor ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={!isDoctor}>
                    Add
                </button>
            </section>

            <section className="mb-5">
                <h2 className="text-lg mb-2 text-gray-700">Others:</h2>
                {others.map((other, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 items-center">
                        {renderInputFields('others', others, index)}
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeRow('others', index)}
                                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded w-8 h-8 flex items-center justify-center ${!isDoctor ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={!isDoctor}
                            >
                                <FaTrash size={12} />  {/* Small Icon */}
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={() => addRow('others')}
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!isDoctor ? 'cursor-not-allowed opacity-50' : ''}`}
                    disabled={!isDoctor}>
                    Add
                </button>
            </section>

            {/* Nurse Notes */}
            <section className="mb-5">
                <h2 className="text-lg mb-2 text-gray-700">Nurse notes:</h2>
                <textarea
                    value={nurseNotes}
                    onChange={(e) => setNurseNotes(e.target.value)}
                    className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4" // Adjust the number of rows as needed
                    disabled={!isNurse} // Only nurses can edit
                />
            </section>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-5">
                <div>
                    <label htmlFor="submittedBy" className="block text-gray-700 mr-2">Submitted By:</label>
                    <select
                        id="submittedBy"
                        value={submittedBy}
                        onChange={(e) => setSubmittedBy(e.target.value)}
                        className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!isDoctor} // Disable for both nurse and unauthorized
                    >
                        <option>SK</option>
                        <option>Doctor</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="issuedby" className="block text-gray-700 mr-2">Drugs Issued By:</label>
                    <select
                        id="issuedby"
                        value={issuedby}
                        onChange={(e) => setIssuedby(e.target.value)}
                        className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!isNurse}
                    >
                        <option>Nurse</option>
                        <option>Nurse</option>
                    </select>
                </div>

                <div className="mt-3 sm:mt-0">
                    <button
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 ${!isDoctor ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={!isDoctor}
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    <button
                        className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded`}
                    >
                        Generate Prescription
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Prescription;