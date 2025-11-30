import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Sidebar from "../Sidebar";
import Prescription from '../NewVisit/Prescription';

function Viewprescription() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPrescriptionData, setSelectedPrescriptionData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showIssued, setShowIssued] = useState(false);
    const [selectedIssuedPrescriptionItems, setSelectedIssuedPrescriptionItems] = useState([]);
    const [viewedPrescriptionId, setViewedPrescriptionId] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);

    // Fetch prescriptions
    const fetchPrescriptions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('https://occupational-health-center-1.onrender.com/prescriptions/view/');
            if (response.data && Array.isArray(response.data.prescriptions)) {
                setPrescriptions(response.data.prescriptions);
                setFilteredPrescriptions(response.data.prescriptions);
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            setError(error.response?.data?.message || 'Failed to fetch prescriptions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrescriptions();
    }, [fetchPrescriptions]);

    // Calculate counts
    const pendingCount = prescriptions.filter(p => p.issued_status === 0 || p.issued_status === false).length;
    const issuedCount = prescriptions.filter(p => p.issued_status === 1 || p.issued_status === true).length;

    // Apply date filter whenever dates or showIssued changes
    useEffect(() => {
        if (!fromDate && !toDate) {
            // Filter prescriptions based on issued_status
            const filtered = prescriptions.filter(prescription => {
                if (showIssued) {
                    return prescription.issued_status === 1 || prescription.issued_status === true;
                } else {
                    return prescription.issued_status === 0 || prescription.issued_status === false;
                }
            });
            setFilteredPrescriptions(filtered);
            return;
        }

        const filtered = prescriptions.filter(prescription => {
            const prescriptionDate = new Date(prescription.entry_date);
            const from = fromDate ? new Date(fromDate) : null;
            const to = toDate ? new Date(toDate) : null;

            // First check the issued status
            const statusMatch = showIssued 
                ? (prescription.issued_status === 1 || prescription.issued_status === true)
                : (prescription.issued_status === 0 || prescription.issued_status === false);

            if (!statusMatch) return false;

            // Then check the date range
            if (from && to) {
                return prescriptionDate >= from && prescriptionDate <= to;
            } else if (from) {
                return prescriptionDate >= from;
            } else if (to) {
                return prescriptionDate <= to;
            }
            return true;
        });

        setFilteredPrescriptions(filtered);
    }, [fromDate, toDate, prescriptions, showIssued]);

    
    const handlePrescriptionSelect = (prescription) => {
        if (!prescription || !prescription.id) {
            console.error('Invalid prescription data:', prescription);
            return;
        }
        setSelectedPrescriptionData([prescription]);
        setViewedPrescriptionId(prescription.id);
        setIsUpdating(true);
    };

    // Handle prescription update
    const handlePrescriptionUpdate = useCallback(async (issuedItems) => {
        try {
            if (!Array.isArray(issuedItems)) {
                console.error('Invalid issuedItems:', issuedItems);
                throw new Error('Invalid issued items data');
            }

            // First update the prescription status
            await fetchPrescriptions();

            // Update stock for each issued item
            const updatePromises = issuedItems.map(async (item) => {
                if (!item.issuedIn || parseInt(item.issuedIn) <= 0) {
                    console.warn(`Skipping stock update for ${item.chemicalName} - Invalid issued quantity`);
                    return;
                }

                try {
                    // Make API call to update stock in jsw_pharmacystock
                    const response = await axios.post('https://occupational-health-center-1.onrender.com/update-pharmacy-stock/', {
                        doseVolume: item.doseVolume,
                        expiryDate: item.expiryDate,
                        quantity: parseInt(item.issuedIn),
                        type: item.type.toLowerCase(),
                        chemicalName: item.chemicalName,
                        brandName: item.brandName,
                        action: 'decrease' // Specify that we want to decrease the stock
                    });

                    if (!response.data.success) {
                        throw new Error(response.data.message || 'Failed to update stock');
                    }

                    console.log(`Successfully updated stock for ${item.chemicalName}`);
                    return response.data;
                } catch (error) {
                    console.error(`Error updating stock for ${item.chemicalName}:`, error);
                    throw error;
                }
            });

            console.log("updated promises : ",updatePromises);

            // Wait for all stock updates to complete
            await Promise.all(updatePromises);

            // Clear the selected prescription
            setSelectedPrescriptionData(null);
            setIsUpdating(false);
            
            // Show success message
            alert("Prescription Issued Successfully and Stock Updated!");
            
            // Switch to issued list
            setShowIssued(true);
            
            // Clear any date filters to show all issued prescriptions
            setFromDate('');
            setToDate('');
        } catch (error) {
            console.error('Error updating prescription and stock:', error);
            alert('Error updating prescription and stock. Please try again.');
        }
    }, [fetchPrescriptions]);

    // Process prescription items for issuing
    const processPrescriptionItems = (prescriptionId) => {
        const prescription = prescriptions.find(p => p.id === prescriptionId);
        if (!prescription) {
            console.error('Prescription not found for ID:', prescriptionId);
            return;
        }

        const items = [];
        const processItems = (itemList, typeName) => {
            if (!Array.isArray(itemList)) return;
            
            itemList.forEach((item, index) => {
                if (item && item.chemicalName) {
                    items.push({
                        key: `${typeName.toLowerCase()}-${item.id || index}-${prescriptionId}`,
                        type: typeName,
                        id: item.id, // Add medicine ID for stock update
                        chemicalName: item.chemicalName || '-',
                        brandName: item.brandName || '-',
                        doseVolume: item.doseVolume || '-',
                        servingOrQty: (typeName === 'Syrup' || typeName === 'Drops') 
                            ? (item.serving || item.qty || '-') 
                            : (item.qty || '-'),
                        expiryDate: item.expiryDate || '-',
                        issuedIn: item.issuedIn || '-',
                    });
                }
            });
        };

        // Process all categories
        const categories = {
            tablets: 'Tablet',
            syrups: 'Syrup',
            injections: 'Injection',
            creams: 'Cream',
            drops: 'Drops',
            fluids: 'Fluid',
            lotions: 'Lotion',
            powder: 'Powder',
            respules: 'Respule',
            suture_procedure: 'Suture/Procedure',
            dressing: 'Dressing',
            others: 'Other'
        };

        Object.entries(categories).forEach(([key, label]) => {
            processItems(prescription[key], label);
        });

        setSelectedIssuedPrescriptionItems(items);
    };

    // Handle initiate prescription
    const handleInitiate = (prescriptionToIssue) => {
        if (!prescriptionToIssue) {
            alert('Invalid prescription data');
            return;
        }

        // Check if prescription is already issued
        if (prescriptionToIssue.issued_status === 1 || prescriptionToIssue.issued_status === true) {
            alert('This prescription has already been issued');
            setSelectedPrescriptionData(null);
            setIsUpdating(false);
            return;
        }

        // Set the prescription data and show the update form
        setSelectedPrescriptionData([prescriptionToIssue]);
        console.log('Issuing Prescription:', prescriptionToIssue);
        setIsUpdating(true);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    // Handle view issued items
    const handleViewIssuedItems = (prescriptionId) => {
        if (!prescriptionId) {
            console.error('Invalid prescription ID');
            return;
        }

        setViewedPrescriptionId(prescriptionId);
        processPrescriptionItems(prescriptionId);
    };

    // Handle cancel
    const handleCancel = () => {
        setSelectedPrescriptionData(null);
        setIsUpdating(false);
    };

    // Handle show issued/pending
    const handleShowIssued = () => {
        if (!showIssued) {
            setShowIssued(true);
            setIsUpdating(false);
            setSelectedPrescriptionData(null);
        }
    };

    const handleShowPending = () => {
        if (showIssued) {
            setShowIssued(false);
            setIsUpdating(false);
            setSelectedPrescriptionData(null);
        }
    };

    // Date filter handlers
    const handleFromDateChange = (e) => setFromDate(e.target.value);
    const handleToDateChange = (e) => setToDate(e.target.value);
    const clearDateFilter = () => {
        setFromDate('');
        setToDate('');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-4 overflow-y-auto">
                <h1 className="text-2xl font-semibold mb-4">View Prescriptions</h1>

                {error && !loading && (
                    <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <div className="mb-4">
                    <button
                        className={`font-bold py-2 px-4 rounded mr-2 ${!showIssued ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                        onClick={handleShowPending}
                        disabled={loading || isUpdating}
                    >
                        Pending ({pendingCount})
                    </button>
                    <button
                        className={`font-bold py-2 px-4 rounded ${showIssued ? 'bg-green-500 text-white shadow-md' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                        onClick={handleShowIssued}
                        disabled={loading || isUpdating}
                    >
                        Issued ({issuedCount})
                    </button>
                </div>

                {showIssued && (
                    <div className="mb-4 p-3 border rounded bg-gray-50 flex flex-wrap items-center gap-4">
                        <div className='flex items-center'>
                            <label htmlFor="fromDate" className="mr-2 text-sm font-medium">From:</label>
                            <input 
                                type="date" 
                                id="fromDate" 
                                className="border rounded px-2 py-1 text-sm" 
                                value={fromDate} 
                                onChange={handleFromDateChange} 
                                max={toDate || undefined} 
                            />
                        </div>
                        <div className='flex items-center'>
                            <label htmlFor="toDate" className="mr-2 text-sm font-medium">To:</label>
                            <input 
                                type="date" 
                                id="toDate" 
                                className="border rounded px-2 py-1 text-sm" 
                                value={toDate} 
                                onChange={handleToDateChange} 
                                min={fromDate || undefined} 
                            />
                        </div>
                        <button 
                            className="bg-gray-400 hover:bg-gray-500 text-gray-800 font-bold py-1 px-3 rounded text-sm" 
                            onClick={clearDateFilter} 
                            disabled={!fromDate && !toDate}
                        >
                            Clear Dates
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-4">Loading prescriptions...</div>
                ) : (
                    <div className="overflow-x-auto shadow-md rounded-lg mb-6">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ID</th>
                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">MRD No</th>
                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Aadhar No</th>
                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="py-2 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPrescriptions.length > 0 ? (
                                    filteredPrescriptions.map((prescription) => (
                                        <tr 
                                            key={prescription.id} 
                                            className={`hover:bg-gray-50 ${isUpdating && selectedPrescriptionData?.[0]?.id === prescription.id ? 'bg-blue-100' : ''}`}
                                        >
                                            <td className="py-2 px-4 border-b text-sm text-gray-700">{prescription.id}</td>
                                            <td className="py-2 px-4 border-b text-sm text-gray-700">{prescription.mrdNo}</td>
                                            <td className="py-2 px-4 border-b text-sm text-gray-700">{prescription.aadhar}</td>
                                            <td className="py-2 px-4 border-b text-sm text-gray-700">{prescription.name}</td>
                                            <td className="py-2 px-4 border-b text-sm text-gray-700">
                                                {prescription.entry_date ? new Date(prescription.entry_date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {showIssued ? (
                                                    <button
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline"
                                                        onClick={() => handleViewIssuedItems(prescription.id)}
                                                        disabled={isUpdating}
                                                        title="View Issued Items"
                                                    >
                                                        View Items
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline"
                                                        onClick={() => handleInitiate(prescription)}
                                                        disabled={isUpdating}
                                                        title="Issue this Prescription"
                                                    >
                                                        Issue
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-gray-500">
                                            No {showIssued ? 'issued' : 'pending'} prescriptions found
                                            {(showIssued && (fromDate || toDate)) ? ' for the selected date range' : ''}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {isUpdating && selectedPrescriptionData?.[0] && (
                    <div className="mt-6 p-4 border rounded bg-white shadow-lg">
                        <h2 className="text-xl font-semibold mb-3">
                            Issue Prescription #{selectedPrescriptionData[0].id} for {selectedPrescriptionData[0].name} ({selectedPrescriptionData[0].emp_no})
                            <span className="text-base font-normal text-gray-600 ml-2">
                                (Date: {selectedPrescriptionData[0].entry_date ? new Date(selectedPrescriptionData[0].entry_date).toLocaleDateString() : 'N/A'})
                            </span>
                        </h2>
                        <Prescription
                            data={selectedPrescriptionData}
                            onPrescriptionUpdate={handlePrescriptionUpdate}
                            condition={true}
                            mrdNo={selectedPrescriptionData[0].mrdNo}
                        />
                        <div className="mt-4 text-right">
                            <button
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleCancel}
                            >
                                Cancel Issuing
                            </button>
                        </div>
                    </div>
                )}

                {selectedIssuedPrescriptionItems.length > 0 && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-start pt-10">
                        <div className="relative bg-white p-6 border rounded-lg shadow-xl max-w-4xl w-full mx-4 my-6">
                            <h2 className="text-xl font-semibold mb-4">Issued Items for Prescription #{viewedPrescriptionId}</h2>
                            <button
                                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
                                onClick={() => {
                                    setSelectedIssuedPrescriptionItems([]);
                                    setViewedPrescriptionId(null);
                                }}
                                title="Close"
                            >
                                ×
                            </button>
                            <div className="overflow-x-auto max-h-[60vh]">
                                <table className="min-w-full bg-white border border-gray-300 mb-4">
                                    <thead className="bg-gray-100 sticky top-0 z-10">
                                        <tr>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Chemical Name</th>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Brand Name</th>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Dose/Vol</th>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Serving/Qty</th>
                                            <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Expiry Date</th>
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
                                                <td className="py-2 px-3 border-b text-sm text-gray-700 align-top">{item.expiryDate}</td>
                                                <td className="py-2 px-3 border-b text-sm text-gray-700 align-top whitespace-pre-wrap">{item.issuedIn}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-right mt-4">
                                <button
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => {
                                        setSelectedIssuedPrescriptionItems([]);
                                        setViewedPrescriptionId(null);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Viewprescription;