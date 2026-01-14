// src/components/PrescriptionIn.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from "../Sidebar"; // Adjust path if needed
import * as XLSX from 'xlsx';
import { FaDownload, FaSave } from "react-icons/fa";

// --- Helper Functions ---
const getDaysInMonth = (year, month) => {
  // month is 0-indexed (0 = January)
  if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
    console.error("Invalid year or month provided to getDaysInMonth:", year, month);
    return 0;
  }
  // Day 0 of next month gives the last day of the current month
  return new Date(year, month + 1, 0).getDate();
};

const parseDate = (dateInput) => {
  // Parses ISO string or already a Date object, returns Date or null
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return !isNaN(dateInput.getTime()) ? dateInput : null;
  }
  if (typeof dateInput === 'string') {
    try {
      const isoDate = new Date(dateInput);
      if (!isNaN(isoDate.getTime()) && dateInput.includes('-')) {
          if (dateInput.length === 10 && !isNaN(Date.parse(dateInput))) {
               const [year, month, day] = dateInput.split('-').map(Number);
               if (year && month && day && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                   return new Date(Date.UTC(year, month - 1, day));
               }
          }
          return isoDate; // Return parsed date if it includes time/timezone info
      }
      // console.warn("Could not parse date string reliably:", dateInput); // Reduce noise
      return null;
    } catch (error) {
      console.error("Error parsing date:", dateInput, error);
      return null;
    }
  }
  return null;
};

const formatDateForAPI = (dateObj) => {
    // Formats Date object to "YYYY-MM-DD" string for API, or null
  if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return null;
  }
  try {
      const year = dateObj.getUTCFullYear();
      const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getUTCDate().toString().padStart(2, '0');
      if (year < 1900 || year > 2100) {
          console.warn("Year out of expected range during formatting:", year);
          return null;
      }
      return `${year}-${month}-${day}`;
  } catch (error) {
      console.error("Error formatting date for API:", dateObj, error);
      return null;
  }
};

// --- Component ---
const PrescriptionIn = () => {
  const [prescriptionData, setPrescriptionData] = useState([]);
  // State for the month currently BEING DISPLAYED
  const [displayedMonthInfo, setDisplayedMonthInfo] = useState({
    monthName: '', year: 0, daysInMonth: 0, dayHeaders: [], monthIndex: 0 // 0-indexed month
  });
  // State to store today's actual date info for highlighting & update logic
  const [actualTodayInfo, setActualTodayInfo] = useState({
      day: null, monthIndex: null, year: null // day is 1-31, monthIndex is 0-11
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Separate state for data fetching
  const [isUpdating, setIsUpdating] = useState(false); // Separate state for DB update
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');

  // --- Fetch combined stock and daily data ---
  // Wrapped in useCallback to stabilize its identity if passed as prop or dependency
  const fetchDataForMonth = useCallback(async (year, monthZeroIndexed) => {
    // Don't trigger loading state here if updateDisplayedMonth already set it
    // setIsLoading(true); // Moved to updateDisplayedMonth
    setError(null); setUpdateStatus(''); // Clear statuses on new fetch trigger
    const monthOneIndexed = monthZeroIndexed + 1;

    try {
      console.log(`Fetching data for ${year}-${monthOneIndexed}...`);
      // *** ADJUST URL TO YOUR DJANGO BACKEND ENDPOINT ***
      const response = await fetch(`http://localhost:8000/api/prescription-in-data/?year=${year}&month=${monthOneIndexed}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("API response was not an array.");
      }
      console.log("Data received:", data);

      const days = getDaysInMonth(year, monthZeroIndexed);
      if (days === 0) { throw new Error(`Invalid month/year (${year}-${monthOneIndexed}) resulted in 0 days.`);}

      // Process fetched data
      const processedData = data.map((chem, index) => ({
          s_no: index + 1, // Ensure frontend has s_no if backend doesn't provide reliably
          ...chem,
          brands: Array.isArray(chem.brands) ? chem.brands.map(brand => {
              const backendDailyQuantities = (typeof brand.daily_quantities === 'object' && brand.daily_quantities !== null)
                                             ? brand.daily_quantities : {};
              const completeDailyQuantities = {};
              let calculatedTotal = 0;
              for (let i = 1; i <= days; i++) {
                  const dayKey = `day_${i}`;
                  const qtyValue = backendDailyQuantities[dayKey] ?? ''; // Default ''
                  completeDailyQuantities[dayKey] = qtyValue;
                  const numQty = parseInt(qtyValue, 10);
                  if (!isNaN(numQty)) calculatedTotal += numQty;
              }
              return {
                  ...brand,
                  daily_quantities: completeDailyQuantities,
                  monthly_total: calculatedTotal,
                  expiry_date: parseDate(brand.expiry_date), // Parse date string
              };
          }) : [], // Default to empty array if brands is missing/invalid
      }));

      console.log("Processed Data:", processedData);
      setPrescriptionData(processedData); // Update state with processed data

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Failed to load data: ${err.message}`);
      setPrescriptionData([]); // Clear data on error
    } finally {
      setIsLoading(false); // Ensure loading is set to false after fetch completes/fails
    }
  }, []); // Empty dependency array: doesn't rely on component state/props directly

  // --- Function to update month info and trigger fetch ---
  // Needs fetchDataForMonth, so wrapped in useCallback that depends on it
  const updateDisplayedMonth = useCallback((newYear, newMonthIndex) => {
    console.log(`Updating display to: ${newYear}-${newMonthIndex + 1}`);
    setIsLoading(true); // Set loading true BEFORE fetch starts
    setError(null); // Clear previous errors
    setUpdateStatus(''); // Clear previous update statuses

    try {
        const days = getDaysInMonth(newYear, newMonthIndex);
        if (days === 0) throw new Error("Invalid month/year for calculation.");

        const dateForMonthName = new Date(newYear, newMonthIndex, 1);
        const monthName = dateForMonthName.toLocaleString('default', { month: 'long' });
        const dayHeadersArray = Array.from({ length: days }, (_, i) => i + 1);

        setDisplayedMonthInfo({
            monthName: monthName, year: newYear,
            daysInMonth: days, dayHeaders: dayHeadersArray,
            monthIndex: newMonthIndex,
        });

        // Fetch data for the newly selected month
        fetchDataForMonth(newYear, newMonthIndex);

    } catch (err) {
         console.error("Error updating displayed month:", err);
         setError(`Could not change month: ${err.message}`);
         setIsLoading(false); // Ensure loading stops if setup fails
    }
  }, [fetchDataForMonth]); // Depends on fetchDataForMonth

  // --- Initialize: Set today's info and fetch current month's data ---
  useEffect(() => {
    console.log("Initializing component...");
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed
    const currentDayOfMonth = today.getDate();

    // Store today's actual date info
    setActualTodayInfo({
        day: currentDayOfMonth, monthIndex: currentMonth, year: currentYear,
    });

    // Set initial display and trigger fetch
    updateDisplayedMonth(currentYear, currentMonth);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDisplayedMonth]); // Run once on mount, relying on updateDisplayedMonth


  // --- Handle Input Change (only updates quantity and total) ---
  const handleQuantityChange = (chemIndex, brandIndex, day, value) => {
    const numericValue = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);
    setPrescriptionData(prevData =>
        prevData.map((chem, cIndex) =>
            cIndex !== chemIndex ? chem : {
                ...chem,
                brands: Array.isArray(chem.brands) ? chem.brands.map((brand, bIndex) => {
                    if (bIndex !== brandIndex) return brand;
                    const updatedDailyQuantities = { ...(brand.daily_quantities || {}), [`day_${day}`]: numericValue };
                    const total = Object.values(updatedDailyQuantities).reduce((sum, qty) => {
                        const numQty = parseInt(qty, 10);
                        return sum + (isNaN(numQty) ? 0 : numQty);
                    }, 0);
                    return { ...brand, daily_quantities: updatedDailyQuantities, monthly_total: total };
                }) : []
            }
        )
    );
  };

  // --- Handle Update Database (Sends ONLY Today's Data) ---
  const handleUpdateDatabase = async () => {
    console.log("DEBUG: handleUpdateDatabase called (TODAY ONLY)");
    setIsUpdating(true); setUpdateStatus(''); setError(null);

    // Use ACTUAL today's date info for update, but DISPLAYED month/year context
    const { day: currentDay, monthIndex: actualMonthIndex, year: actualYear } = actualTodayInfo;
    const { year: displayedYear, monthIndex: displayedMonthIndex } = displayedMonthInfo;

    // Validation
    if (currentDay === null || actualMonthIndex === null || actualYear === null) {
         setError("Cannot update: Today's date information is missing.");
         setIsUpdating(false); console.error("Update cancelled: actualTodayInfo state invalid:", actualTodayInfo); return;
    }
     if (displayedMonthIndex === null || displayedYear === 0) {
         setError("Cannot update: Displayed month/year state invalid.");
         setIsUpdating(false); console.error("Update cancelled: displayedMonthInfo state invalid:", displayedMonthInfo); return;
     }

    const monthOneIndexedForPayload = actualMonthIndex + 1; // Use actual month for payload date
    const payload = [];
    const dayKey = `day_${currentDay}`;

    prescriptionData.forEach((chemical, chemIndex) => {
        if (!chemical || !Array.isArray(chemical.brands)) return;
        chemical.brands.forEach((brand, brandIndex) => {
            if (!brand) return;
            const expiryDateFormatted = formatDateForAPI(brand.expiry_date); // Format current state expiry
            const quantityStr = brand.daily_quantities?.[dayKey] ?? ''; // Get ONLY today's quantity
            const quantity = quantityStr === '' ? 0 : parseInt(quantityStr, 10);

            if (!isNaN(quantity)) {
                payload.push({
                    chemical_name: chemical.chemical_name, brand_name: brand.brand_name,
                    dose_volume: brand.dosage, expiry_date: expiryDateFormatted,
                    year: actualYear, // Use ACTUAL year for DB date
                    month: monthOneIndexedForPayload, // Use ACTUAL month for DB date
                    day: currentDay, // Use ACTUAL day for DB date
                    quantity: quantity
                });
            } else { console.warn(`Skipping today's entry (${dayKey}) for ${chemical.chemical_name} - ${brand.brand_name}: invalid quantity '${quantityStr}'`); }
        });
    });

    console.log(`Payload for update (Date: ${actualYear}-${monthOneIndexedForPayload}-${currentDay}):`, JSON.stringify(payload, null, 2));

    if (payload.length === 0) {
        console.warn("No valid data entries for today to send.");
        setUpdateStatus("No data entered for today to update.");
        setIsUpdating(false); return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/update-daily-quantities/', { // ADJUST URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' /* Add CSRF */ },
            body: JSON.stringify(payload)
        });
        let result = {};
        try { result = await response.json(); }
        catch (parseError) { const textResponse = await response.text(); console.error("Failed to parse JSON response:", textResponse); result = { error: textResponse || `Request failed with status ${response.status}` }; }
        if (!response.ok) { throw new Error(result.error || `HTTP error! Status: ${response.status}`); }
        console.log("Update successful (Today Only):", result);
        setUpdateStatus(result.message || 'Update successful!');
        // Re-fetch the *currently displayed* month to potentially show updated totals if needed
        // Although only today was saved, re-fetching current view keeps consistency
        fetchDataForMonth(displayedYear, displayedMonthIndex);
    } catch (err) {
        console.error("Error updating database:", err);
        setError(`Update failed: ${err.message}`);
        setUpdateStatus('');
    } finally {
        setIsUpdating(false);
    }
  };


  // --- Handle Export To Excel ---
  const handleExportToExcel = () => {
    console.log("DEBUG: Export to Excel button clicked!"); setError(null);
    if (!prescriptionData || !Array.isArray(prescriptionData) || prescriptionData.length === 0) { alert("No data available to export."); console.warn("Export cancelled: prescriptionData is empty."); return; }
    if (!displayedMonthInfo || !displayedMonthInfo.dayHeaders || !Array.isArray(displayedMonthInfo.dayHeaders) || displayedMonthInfo.dayHeaders.length === 0) { alert("Month information not loaded correctly."); console.warn("Export cancelled: displayedMonthInfo invalid."); return; }
    console.log("DEBUG: Current Displayed Month Info for Export:", displayedMonthInfo);

    try {
        const wb = XLSX.utils.book_new();
        const ws_name = `Prescription In ${displayedMonthInfo.monthName} ${displayedMonthInfo.year}`; // More specific name
        let ws_data = [];
        const headers = ["S.No", "Chemical Name", "Brand Name", "Expiry Date", "Dosage", "Monthly Total", ...displayedMonthInfo.dayHeaders.map(day => `D${day}`)];
        ws_data.push(headers);

        const filteredData = prescriptionData.filter(chemical =>
            chemical?.chemical_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (Array.isArray(chemical?.brands) && chemical.brands.some(brand => brand?.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())))
        );

        filteredData.forEach(chemical => {
            if (!chemical || !Array.isArray(chemical.brands)) return;
            chemical.brands.forEach(brand => {
                 if (!brand) return;
                const expiryFormatted = formatDateForAPI(brand.expiry_date);
                const row = [
                    chemical.s_no ?? '', chemical.chemical_name ?? '', brand.brand_name ?? '',
                    expiryFormatted ?? 'N/A', brand.dosage ?? '', brand.monthly_total ?? 0,
                    ...displayedMonthInfo.dayHeaders.map(day => brand.daily_quantities?.[`day_${day}`] ?? '')
                ];
                ws_data.push(row);
            });
        });

        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        ws['!cols'] = [ { wch: 5 }, { wch: 30 }, { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 10 }, ...displayedMonthInfo.dayHeaders.map(() => ({ wch: 5 })) ];
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
        const fileName = `PrescriptionInData_${displayedMonthInfo.monthName}_${displayedMonthInfo.year}.xlsx`;
        XLSX.writeFile(wb, fileName);
        console.log(`DEBUG: Excel file "${fileName}" generation initiated.`);
    } catch (excelError) {
        console.error("Error generating Excel file:", excelError);
        setError(`Failed to generate Excel file: ${excelError.message}`);
    }
  };

  // --- Month Navigation Handlers ---
  const handlePreviousMonth = () => {
    let { year, monthIndex } = displayedMonthInfo;
    if (monthIndex === 0) { monthIndex = 11; year -= 1; }
    else { monthIndex -= 1; }
    updateDisplayedMonth(year, monthIndex);
  };

  const handleNextMonth = () => {
    let { year, monthIndex } = displayedMonthInfo;
    // Prevent going to future months relative to ACTUAL current month
    if (year > actualTodayInfo.year || (year === actualTodayInfo.year && monthIndex >= actualTodayInfo.monthIndex)) {
        console.log("Navigation to next month disabled (future or current month).");
        return;
    }
    if (monthIndex === 11) { monthIndex = 0; year += 1; }
    else { monthIndex += 1; }
    updateDisplayedMonth(year, monthIndex);
  };

  const handleCurrentMonth = () => {
     const { year: currentYear, monthIndex: currentMonth } = actualTodayInfo;
     if (currentYear === null || currentMonth === null) {
         console.error("Cannot go to current month, actualTodayInfo not set.");
         setError("Could not determine current month.");
         return;
     }
     // Only trigger update if not already viewing the current month
     if (displayedMonthInfo.year !== currentYear || displayedMonthInfo.monthIndex !== currentMonth) {
        updateDisplayedMonth(currentYear, currentMonth);
     }
  };

  // Determine if "Next Month" should be disabled (cannot view future months)
  const isNextMonthDisabled = () => {
     if (!actualTodayInfo.year || actualTodayInfo.monthIndex === null) return true; // Disable if today's info isn't ready
     return displayedMonthInfo.year > actualTodayInfo.year || (displayedMonthInfo.year === actualTodayInfo.year && displayedMonthInfo.monthIndex >= actualTodayInfo.monthIndex);
  };


  // --- Render Logic ---
  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-blue-300 to-blue-400">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto  p-4 md:p-6">
           {/* Header Section */}
          <div className="mb-4 p-4 bg-white rounded shadow-sm">
            <div className="flex justify-between items-center flex-wrap gap-y-2">

              {/* Titles & Month Navigation */}
              <div className="flex items-center gap-4 flex-wrap mb-2 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 order-1">
                  Daily Usage
                </h1>

                <div className="flex items-center gap-2 order-3 md:order-2">
                  <button
                    onClick={handlePreviousMonth}
                    title="Previous Month"
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                    disabled={isLoading || isUpdating}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <h2 className="text-lg md:text-xl font-semibold text-gray-700 text-center w-36 min-w-[9rem]">
                    {displayedMonthInfo.monthName} {displayedMonthInfo.year}
                  </h2>

                  <button
                    onClick={handleNextMonth}
                    title="Next Month"
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                    disabled={isNextMonthDisabled() || isLoading || isUpdating}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={handleCurrentMonth}
                    title="Go to Current Month"
                    className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    disabled={isLoading || isUpdating}
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* Actions & Status */}
              <div className="flex items-center flex-wrap gap-2 justify-end flex-grow md:flex-grow-0 order-2 md:order-3">

                <div className="w-full md:w-auto text-right mb-2 md:mb-0 md:mr-2 order-first md:order-none min-h-[1.25rem]">
                  {isUpdating && <span className="text-blue-600 italic text-sm">Updating...</span>}
                  {error && <span className="text-red-600 font-semibold text-sm">Error: {error}</span>}
                  {updateStatus && <span className="text-green-600 font-semibold text-sm">{updateStatus}</span>}
                </div>

                {/* Update Button */}
                <button
                  onClick={handleUpdateDatabase}
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm flex items-center gap-2 ${isUpdating || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isUpdating || isLoading}
                >
                  <FaSave size={14} />
                  {isUpdating ? "Saving..." : "Update Today's Count"}
                </button>

                {/* Export Button */}
                <button
                  onClick={handleExportToExcel}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm flex items-center gap-2"
                  disabled={isLoading || isUpdating}
                >
                  <FaDownload size={14} />
                  Export to Excel
                </button>

                {/* Search Field */}
                <input
                  type="text"
                  placeholder="Search Chemical or Brand"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 border border-gray-300 rounded w-full md:w-56 lg:w-64 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Loading / No Data / Error Messages */}
          {isLoading && <div className="text-center py-10 text-gray-600">Loading data for {displayedMonthInfo.monthName} {displayedMonthInfo.year}...</div>}
          {!isLoading && error && !updateStatus && <div className="text-center py-10 text-red-600 font-semibold">Error loading data: {error}</div>}
          {!isLoading && !error && prescriptionData.length === 0 && (
            <div className="text-center py-10 text-gray-500">No prescription data found for {displayedMonthInfo.monthName} {displayedMonthInfo.year}.</div>
          )}

          {/* Table Section */}
          {!isLoading && !error && prescriptionData.length > 0 && (
            <div className="container mx-auto px-0">
                <div className="py-4 overflow-x-auto">
                  <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden border border-gray-300">
                    <table className="min-w-full leading-normal border-collapse">
                      <thead className="bg-gray-100 sticky top-0 z-10">
                         {/* Header Row */}
                         <tr>
                           {["S.No", "Chemical Name", "Brand Name", "Expiry Date", "Dosage", "Total", /* Day Headers */
                             ...(displayedMonthInfo.dayHeaders || []).map(day => `D${day}`) // Add check for dayHeaders
                            ].map((headerText, index) => {
                                const isActualTodayHeader = displayedMonthInfo.year === actualTodayInfo.year &&
                                                    displayedMonthInfo.monthIndex === actualTodayInfo.monthIndex &&
                                                    index > 5 && // Check only for day columns
                                                    displayedMonthInfo.dayHeaders?.[index - 6] === actualTodayInfo.day; // Safe access
                                return (
                                    <th key={`header-${index}`} className={`px-2 py-2 border border-gray-300 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap ${index < 6 ? 'text-left' : 'text-center'} ${index === 0 ? 'w-10' : ''} ${index === 3 ? 'w-20' : ''} ${isActualTodayHeader ? 'bg-yellow-200' : ''}`} style={index > 5 ? { minWidth: '45px' } : {}} >
                                        {headerText}
                                    </th>
                                );
                            })}
                        </tr>
                      </thead>
                      <tbody>
                        {prescriptionData
                          .filter(chemical => // Optional chaining for safety
                            chemical?.chemical_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (Array.isArray(chemical?.brands) && chemical.brands.some(brand => brand?.brand_name?.toLowerCase().includes(searchTerm.toLowerCase())))
                          )
                          .map((chemical, chemIndex) => (
                          <React.Fragment key={`chem-${chemical?.s_no ?? chemIndex}-${chemical?.chemical_name ?? 'unknown'}`}>
                            {Array.isArray(chemical?.brands) && chemical.brands.map((brand, brandIndex) => (
                              <tr key={`brand-${chemical?.s_no ?? chemIndex}-${brandIndex}-${brand?.brand_name ?? 'unknown'}`} className="hover:bg-gray-50">
                                {/* S.No & Chemical Name */}
                                {brandIndex === 0 && (
                                  <>
                                    <td className="px-2 py-1 border border-gray-300 bg-white text-sm align-top text-center" rowSpan={chemical.brands.length}>
                                      {chemical.s_no ?? chemIndex + 1}
                                    </td>
                                    <td className="px-2 py-1 border border-gray-300 bg-white text-sm align-top" rowSpan={chemical.brands.length}>
                                      {chemical.chemical_name ?? 'N/A'}
                                    </td>
                                  </>
                                )}
                                {/* Brand Specific Cells */}
                                <td className="px-2 py-1 border border-gray-300 bg-white text-sm whitespace-nowrap">{brand?.brand_name ?? 'N/A'}</td>
                                <td className="px-2 py-1 border border-gray-300 bg-white text-sm whitespace-nowrap text-center">{formatDateForAPI(brand?.expiry_date) ?? 'N/A'}</td>
                                <td className="px-2 py-1 border border-gray-300 bg-white text-sm whitespace-nowrap">{brand?.dosage ?? 'N/A'}</td>
                                <td className="px-2 py-1 border border-gray-300 bg-white text-sm font-semibold text-center whitespace-nowrap">{brand?.monthly_total ?? 0}</td>
                                {/* Daily Quantity Inputs */}
                                {(displayedMonthInfo.dayHeaders || []).map((day) => { // Add check for dayHeaders
                                  // Check if the current cell's day/month/year matches ACTUAL today
                                  const isActualTodayCell = displayedMonthInfo.year === actualTodayInfo.year &&
                                                        displayedMonthInfo.monthIndex === actualTodayInfo.monthIndex &&
                                                        day === actualTodayInfo.day;
                                  const inputKey = `input-${chemical?.s_no ?? chemIndex}-${brandIndex}-day-${day}`;
                                  return (
                                    <td key={inputKey} className={`p-0 border border-gray-300 text-sm ${isActualTodayCell ? 'bg-yellow-100' : 'bg-white'}`}>
                                      <div className="p-1 h-full">
                                        <input
                                          type="number"
                                          min="0"
                                          value={brand?.daily_quantities?.[`day_${day}`] ?? ''}
                                          onChange={(e) => handleQuantityChange(chemIndex, brandIndex, day, e.target.value)}
                                          className="w-full h-full text-center border-none focus:outline-none focus:ring-1 focus:ring-blue-500 rounded bg-transparent p-0"
                                          style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                                          disabled={isLoading || isUpdating}
                                        />
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default PrescriptionIn;