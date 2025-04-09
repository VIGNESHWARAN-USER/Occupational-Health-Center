import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from "../Sidebar";
import Prescription from '../NewVisit/Prescription'; // Ensure this path is correct

function Viewprescription() {
    // ... (Keep all existing useState hooks: prescriptions, loading, error, etc.) ...
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPrescriptionData, setSelectedPrescriptionData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showIssued, setShowIssued] = useState(false);
    const [selectedIssuedPrescriptionItems, setSelectedIssuedPrescriptionItems] = useState([]);
    const [viewedPrescriptionId, setViewedPrescriptionId] = useState(null); // To show ID in modal title
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);


    // --- Date Filter handlers (Keep as is) ---
    const handleFromDateChange = (e) => setFromDate(e.target.value);
    const handleToDateChange = (e) => setToDate(e.target.value);
    const applyDateFilter = useCallback(() => {
        // ... (keep existing applyDateFilter logic) ...
        const sourceList = prescriptions; // Always filter from the full list

        if (fromDate && toDate) {
            try {
                const from = new Date(fromDate);
                from.setHours(0, 0, 0, 0); // Start of the 'from' day
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999); // End of the 'to' day

                const filtered = sourceList.filter(prescription => {
                    const entryDate = new Date(prescription.entry_date);
                    // Basic check if entryDate is valid
                    if (isNaN(entryDate.getTime())) {
                        console.warn("Invalid entry_date found:", prescription.entry_date, "for prescription ID:", prescription.id);
                        return false;
                    }
                    return entryDate >= from && entryDate <= to;
                });
                setFilteredPrescriptions(filtered);
            } catch (e) {
                console.error("Error parsing dates for filtering:", e);
                setFilteredPrescriptions(sourceList); // Fallback to unfiltered list on error
            }
        } else {
            // If no dates are set, show all prescriptions matching the current status view
            setFilteredPrescriptions(sourceList);
        }
    }, [prescriptions, fromDate, toDate]);
    const clearDateFilter = () => {
        // ... (keep existing clearDateFilter logic) ...
        setFromDate('');
        setToDate('');
        // Re-apply base filtering (all prescriptions)
        setFilteredPrescriptions(prescriptions);
    };

    // --- Fetch Prescriptions (Keep as is) ---
    const fetchPrescriptions = async () => {
        // ... (keep existing fetchPrescriptions logic) ...
        setLoading(true);
        setError(null);

        try {
            let url = 'http://localhost:8000/prescriptions/view/'; // Ensure this returns the nested 'prescription' object
            const response = await axios.get(url);

            console.log('Fetched prescriptions:', response.data);
            const fetched = response.data.prescriptions || [];
            fetched.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));
            setPrescriptions(fetched);
            applyDateFilter(); // Apply date filter immediately
        } catch (err) {
            setError(err);
            console.error('Error fetching prescriptions:', err);
            setPrescriptions([]);
            setFilteredPrescriptions([]);
        } finally {
            setLoading(false);
        }
    };

    // --- useEffect Hooks (Keep as is) ---
    useEffect(() => {
        fetchPrescriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        applyDateFilter();
    }, [fromDate, toDate, applyDateFilter]);


    // --- handleInitiate (Keep corrected version) ---
    const handleInitiate = (prescriptionToIssue) => {
        // ... (keep corrected handleInitiate logic from previous step) ...
        console.log('Initiating prescription ID:', prescriptionToIssue.id, 'for employee number:', prescriptionToIssue.emp_no);
        if (!prescriptionToIssue || prescriptionToIssue.issued_status !== 0) {
            alert('Could not initiate the selected prescription. It might already be issued or is invalid.');
            setSelectedPrescriptionData(null);
            setIsUpdating(false);
            return;
        }
        setSelectedPrescriptionData(prescriptionToIssue);
        setIsUpdating(true);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };


    // --- MODIFIED handleViewIssuedItems ---
    const handleViewIssuedItems = (prescriptionId) => {
        console.log('Viewing items for prescription ID:', prescriptionId);
        setViewedPrescriptionId(prescriptionId); // Store ID for modal title

        // Find the prescription data already in the main 'prescriptions' state
        const prescription = prescriptions.find(p => p.id === prescriptionId);

        // IMPORTANT: Check if the nested 'prescription' object exists
        if (!prescription || !prescription.prescription) {
            console.error('Detailed prescription data not found in state for ID:', prescriptionId, 'Object:', prescription);
            setSelectedIssuedPrescriptionItems([]); // Clear items
            alert('Could not find detailed item data for this prescription.');
            return;
        }

        const items = [];
        const presDetails = prescription.prescription; // Access the NESTED prescription details

        // Helper to process each item list and add to the combined 'items' array
        const processItems = (itemList, typeName) => {
            // Ensure itemList is an array before trying to iterate
            if (Array.isArray(itemList)) {
                itemList.forEach((item, index) => {
                    items.push({
                        // Create a unique key for React list rendering
                        key: `${typeName.toLowerCase()}-${item.chemicalName || 'item'}-${index}`,
                        type: typeName,
                        chemicalName: item.chemicalName || '-', // Use '-' as fallback
                        brandName: item.brandName || '-',
                        doseVolume: item.doseVolume || '-',
                        // Show 'serving' only for types that have it, otherwise show quantity
                        servingOrQty: (typeName === 'Syrup' || typeName === 'Drops') ? (item.serving || item.qty || '-') : (item.qty || '-'),
                        issuedIn: item.issuedIn || '-',
                    });
                });
            } else if (itemList) {
                 console.warn(`Expected an array for ${typeName} but received:`, itemList);
            }
        };

        // Process each category of items using the helper
        processItems(presDetails.tablets, 'Tablet');
        processItems(presDetails.syrups, 'Syrup');
        processItems(presDetails.injections, 'Injection');
        processItems(presDetails.creams, 'Cream');
        processItems(presDetails.drops, 'Drops');
        processItems(presDetails.fluids, 'Fluid');
        processItems(presDetails.lotions, 'Lotion');
        processItems(presDetails.powder, 'Powder');
        processItems(presDetails.respules, 'Respule');
        processItems(presDetails.sutureProcedureItems, 'Suture/Procedure');
        processItems(presDetails.dressingItems, 'Dressing');
        processItems(presDetails.others, 'Other');

        if (items.length === 0) {
             console.warn('No individual items found within prescription ID:', prescriptionId);
             alert('No individual items found within this prescription data.');
        }

        // Update the state to show the items in the modal
        setSelectedIssuedPrescriptionItems(items);
    };
    // --- END MODIFICATION ---

    // --- handlePrescriptionUpdate (Keep as is) ---
    const handlePrescriptionUpdate = (updatedPrescriptionId) => {
        fetchPrescriptions();
        setSelectedPrescriptionData(null);
        setIsUpdating(false);
        alert("Prescription Issued Successfully!");
    };

    // --- handleCancel (Keep as is) ---
    const handleCancel = () => {
        setSelectedPrescriptionData(null);
        setIsUpdating(false);
    };

    // --- handleShowIssued / handleShowPending (Keep as is) ---
     const handleShowIssued = () => {
        if (!showIssued) {
            setShowIssued(true);
            setIsUpdating(false); // Close update form when switching views
            setSelectedPrescriptionData(null);
            // Filtering will be handled by the filter useEffect
        }
    };
    const handleShowPending = () => {
        if (showIssued) {
            setShowIssued(false);
             setIsUpdating(false); // Close update form when switching views
             setSelectedPrescriptionData(null);
            // Filtering will be handled by the filter useEffect
        }
    };

    // Filter prescriptions based on the showIssued state *after* date filtering
    const finalFilteredList = filteredPrescriptions.filter(p =>
        showIssued ? p.issued_status === 1 : p.issued_status === 0
    );


    // --- Render Logic ---
    if (error) {
        // *** Corrected Error Return ***
        return (
             <div className="flex h-screen bg-gray-100">
                <Sidebar />
                 <div className="flex-1 p-4">
                     <h1 className="text-2xl font-semibold mb-4">View Prescriptions</h1>
                     <div className="text-center py-4 text-red-500">Error loading data: {error.message}. Please try refreshing.</div>
                 </div>
            </div>
        ); // <<< Missing closing parenthesis was here
    }

    // *** Main Return for the component starts here ***
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-4 overflow-y-auto"> {/* Added overflow-y-auto */}
                <h1 className="text-2xl font-semibold mb-4">View Prescriptions</h1>

                {/* Toggle Buttons */}
                 <div className="mb-4">
                    <button
                        className={`font-bold py-2 px-4 rounded mr-2 ${!showIssued ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                        onClick={handleShowPending}
                        disabled={loading || isUpdating}
                    >
                        Pending ({prescriptions.filter(p => p.issued_status === 0).length})
                    </button>
                    <button
                        className={`font-bold py-2 px-4 rounded ${showIssued ? 'bg-green-500 text-white shadow-md' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                        onClick={handleShowIssued}
                        disabled={loading || isUpdating}
                    >
                        Issued ({prescriptions.filter(p => p.issued_status === 1).length})
                    </button>
                </div>


                {/* Date Filter Section */}
                {showIssued && (
                     <div className="mb-4 p-3 border rounded bg-gray-50 flex flex-wrap items-center gap-4">
                        <div className='flex items-center'>
                            <label htmlFor="fromDate" className="mr-2 text-sm font-medium">From:</label>
                            <input type="date" id="fromDate" className="border rounded px-2 py-1 text-sm" value={fromDate} onChange={handleFromDateChange} max={toDate || undefined} />
                        </div>
                        <div className='flex items-center'>
                            <label htmlFor="toDate" className="mr-2 text-sm font-medium">To:</label>
                            <input type="date" id="toDate" className="border rounded px-2 py-1 text-sm" value={toDate} onChange={handleToDateChange} min={fromDate || undefined} />
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm" onClick={applyDateFilter} disabled={!fromDate || !toDate} > Apply Filter </button>
                        <button className="bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-1 px-3 rounded text-sm" onClick={clearDateFilter} disabled={!fromDate && !toDate} > Clear Filter </button>
                    </div>
                )}

                {/* Loading Indicator */}
                {loading && <div className="text-center py-4">Loading...</div>}


                {/* Table Display */}
                {!loading && (
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Emp No</th>
                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {finalFilteredList.length > 0 ? (
                                    finalFilteredList.map((prescription) => (
                                        <tr key={prescription.id} className="hover:bg-gray-50">
                                            <td className="py-2 px-4 border-b text-sm text-gray-700">{prescription.id}</td>
                                            <td className="py-2 px-4 border-b text-sm text-gray-700">{prescription.emp_no}</td>
                                            <td className="py-2 px-4 border-b text-sm text-gray-700">{prescription.name}</td>
                                            <td className="py-2 px-4 border-b text-sm text-gray-700">
                                                {new Date(prescription.entry_date).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {showIssued ? (
                                                    <button
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline"
                                                        onClick={() => handleViewIssuedItems(prescription.id)} // Pass ID here
                                                        disabled={isUpdating}
                                                        title="View Issued Items"
                                                    > View Items </button>
                                                ) : (
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline"
                                                        onClick={() => handleInitiate(prescription)} // Pass object here
                                                        disabled={isUpdating}
                                                        title="Issue this Prescription"
                                                    > Issue </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                     <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-500">
                                            No {showIssued ? 'issued' : 'pending'} prescriptions found{ (showIssued && (fromDate || toDate)) ? ' for the selected date range' : ''}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Prescription Issuing/Updating Section */}
                 {isUpdating && selectedPrescriptionData && (
                    <div className="mt-6 p-4 border rounded bg-white shadow-lg">
                         <h2 className="text-xl font-semibold mb-3">
                            Issue Prescription #{selectedPrescriptionData.id} for {selectedPrescriptionData.name} ({selectedPrescriptionData.emp_no})
                            <span className="text-base font-normal text-gray-600 ml-2"> (Date: {new Date(selectedPrescriptionData.entry_date).toLocaleDateString()}) </span>
                        </h2>
                        <Prescription
                            data={[selectedPrescriptionData]} // Pass as array
                            onPrescriptionUpdate={() => handlePrescriptionUpdate(selectedPrescriptionData.id)} // Pass ID back if needed
                        />
                        <div className="mt-4 text-right">
                            <button className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleCancel} > Cancel Issuing </button>
                        </div>
                    </div>
                )}


                {/* Display Issued Items Modal */}
                {selectedIssuedPrescriptionItems.length > 0 && (
                     <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10">
                        <div className="relative bg-white p-6 border rounded-lg shadow-xl max-w-4xl w-full mx-4 my-6">
                             <h2 className="text-xl font-semibold mb-4">Issued Items for Prescription #{viewedPrescriptionId}</h2>
                             <button
                                 className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
                                 onClick={() => {setSelectedIssuedPrescriptionItems([]); setViewedPrescriptionId(null);}}
                                 title="Close"
                             >×</button>
                             <div className="overflow-x-auto max-h-[60vh]">
                                 <table className="min-w-full bg-white border border-gray-300 mb-4">
                                    <thead className="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Chemical Name</th>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Brand Name</th>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Dose/Vol</th>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Serving/Qty</th>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Issued In Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {selectedIssuedPrescriptionItems.map((item) => (
                                            <tr key={item.key}>
                                                <td className="py-2 px-3 border-b text-sm text-gray-700 align-top">{item.type}</td>
                                                <td className="py-2 px-3 border-b text-sm text-gray-700 align-top">{item.chemicalName}</td>
                                                <td className="py-2 px-3 border-b text-sm text-gray-700 align-top">{item.brandName}</td>
                                                <td className="py-2 px-3 border-b text-sm text-gray-700 align-top">{item.doseVolume}</td>
                                                <td className="py-2 px-3 border-b text-sm text-gray-700 align-top">{item.servingOrQty}</td>
                                                <td className="py-2 px-3 border-b text-sm text-gray-700 align-top whitespace-pre-wrap">{item.issuedIn}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                             <div className="text-right mt-4">
                                <button
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => {setSelectedIssuedPrescriptionItems([]); setViewedPrescriptionId(null);}}
                                >
                                    Close
                                </button>
                             </div>
                         </div>
                    </div>
                )}


            </div> {/* End flex-1 content area */}
        </div> // End main flex container
    );
}

export default Viewprescription;