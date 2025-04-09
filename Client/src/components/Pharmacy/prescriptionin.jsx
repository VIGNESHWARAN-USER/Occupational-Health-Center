// src/components/PrescriptionIn.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar"; // Assuming Sidebar component path is correct

// --- Helper Function ---
// Gets the number of days in a given month and year
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate(); // month is 0-indexed
};

// --- Initial Data (Based on the JSON structure) ---
// In a real app, fetch this or get it from props/context
const initialPrescriptionData = [
  {
    s_no: 1,
    chemical_name: "Azithromycin",
    brands: [
      { brand_name: "Tab.Aziclass", dosage: "500 MG", daily_quantities: {}, monthly_total: 0 },
      { brand_name: "Tab.ATM", dosage: "500 MG", daily_quantities: {}, monthly_total: 0 },
      { brand_name: "Tab.Aziwok", dosage: "500 MG", daily_quantities: {}, monthly_total: 0 },
      { brand_name: "Tab.Azithral", dosage: "500 MG", daily_quantities: {}, monthly_total: 0 }
    ]
  },
  {
    s_no: 2,
    chemical_name: "Amoxicillin,Potassium & Clavulanate",
    brands: [
      { brand_name: "Tab.Augmentin", dosage: "625 mg", daily_quantities: {}, monthly_total: 0 },
      { brand_name: "Tab.Amoxiclav", dosage: "625 mg", daily_quantities: {}, monthly_total: 0 }
    ]
  },
   {
    s_no: 3,
    chemical_name: "Ciprofloxacin",
    brands: [
      { brand_name: "Tab.Cifran", dosage: "500 mg", daily_quantities: {}, monthly_total: 0 },
      { brand_name: "Tab.Cipro", dosage: "500 mg", daily_quantities: {}, monthly_total: 0 },
      { brand_name: "Tab.Ciplox", dosage: "500 mg", daily_quantities: {}, monthly_total: 0 }
    ]
  },
   {
    s_no: 4,
    chemical_name: "Ofloxacin & Ornidazole",
    brands: [
      { brand_name: "Tab.Lacnid", dosage: "200 mg", daily_quantities: {}, monthly_total: 0 },
      { brand_name: "Tab.Zenflox", dosage: "200 mg", daily_quantities: {}, monthly_total: 0 }
    ]
  },
  {
    s_no: 5,
    chemical_name: "Cefixime",
    brands: [
      { brand_name: "Tab.Taxim O", dosage: "200 mg", daily_quantities: {}, monthly_total: 0 }
    ]
  },
  {
    s_no: 6,
    chemical_name: "Metronidazole",
    brands: [
      { brand_name: "Tab.Metrogyl", dosage: "400 mg", daily_quantities: {}, monthly_total: 0 },
      { brand_name: "Tab.Flagyl", dosage: "400 mg", daily_quantities: {}, monthly_total: 0 }
    ]
  },
   {
    s_no: 7,
    chemical_name: "Norfloxacin & Tinidazole",
    brands: [
      { brand_name: "Tab.Norflox TZ", dosage: "200 mg", daily_quantities: {}, monthly_total: 0 },
      { brand_name: "Tab. Norflox", dosage: "200 mg", daily_quantities: {}, monthly_total: 0 } // Space intentional as per image
    ]
  },
   {
    s_no: 8,
    chemical_name: "Nitrofurantoin",
    brands: [
      { brand_name: "Tab.NitroBact", dosage: "100 mg", daily_quantities: {}, monthly_total: 0 }
    ]
  }
  // ... Add the rest of the data similarly
];

// --- Component ---
const PrescriptionIn = () => {
  const [prescriptionData, setPrescriptionData] = useState([]);
  const [currentMonthInfo, setCurrentMonthInfo] = useState({
    monthName: '',
    year: 0,
    daysInMonth: 0,
    dayHeaders: [],
  });

  // --- Initialize data and calculate month details on mount ---
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed (0 = January)
    const days = getDaysInMonth(currentYear, currentMonth);
    const monthName = today.toLocaleString('default', { month: 'long' });
    const dayHeadersArray = Array.from({ length: days }, (_, i) => i + 1); // [1, 2, ..., days]

    setCurrentMonthInfo({
      monthName: monthName,
      year: currentYear,
      daysInMonth: days,
      dayHeaders: dayHeadersArray,
    });

    // Initialize daily quantities for the current month for all brands
    const initializedData = initialPrescriptionData.map(chem => ({
      ...chem,
      brands: chem.brands.map(brand => {
        const daily_quantities = {};
        for (let i = 1; i <= days; i++) {
          daily_quantities[`day_${i}`] = ''; // Initialize with empty string or 0
        }
        return { ...brand, daily_quantities, monthly_total: 0 };
      }),
    }));
    setPrescriptionData(initializedData);

  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Handle Input Change ---
  const handleQuantityChange = (chemIndex, brandIndex, day, value) => {
    // Ensure value is a non-negative integer or empty string
    const numericValue = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);

    // Create a deep copy to avoid state mutation issues
    const newData = JSON.parse(JSON.stringify(prescriptionData));

    // Update the specific day's quantity
    newData[chemIndex].brands[brandIndex].daily_quantities[`day_${day}`] = numericValue;

    // Recalculate the monthly total for that specific brand
    const currentBrandQuantities = newData[chemIndex].brands[brandIndex].daily_quantities;
    const total = Object.values(currentBrandQuantities).reduce((sum, qty) => {
        // Add to sum only if qty is a valid number
        const numQty = parseInt(qty, 10);
        return sum + (isNaN(numQty) ? 0 : numQty);
    }, 0);
    newData[chemIndex].brands[brandIndex].monthly_total = total;

    // Update the state
    setPrescriptionData(newData);
  };


  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Optional Header */}
        {/* <header className="bg-white shadow">...</header> */}

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="py-8">
              <div>
                <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-2">
                  Prescription Input
                </h1>
                 <h2 className="text-xl font-semibold leading-tight text-gray-700 mb-4">
                   Month: {currentMonthInfo.monthName} {currentMonthInfo.year}
                 </h2>
              </div>
              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                  <table className="min-w-full leading-normal border-collapse border border-gray-300">
                    {/* Table Header */}
                    <thead className="bg-gray-200 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-3 border border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          S.No
                        </th>
                        <th className="px-3 py-3 border border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Chemical Name / Component
                        </th>
                        <th className="px-3 py-3 border border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Brand Name
                        </th>
                        <th className="px-3 py-3 border border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Dosage
                        </th>
                        {/* Dynamic Day Headers */}
                        {currentMonthInfo.dayHeaders.map((day) => (
                          <th
                            key={`header-day-${day}`}
                            className="px-2 py-3 border border-gray-300 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            style={{ minWidth: '50px' }} // Ensure day columns have a minimum width
                          >
                            {`D${day}`}
                          </th>
                        ))}
                        <th className="px-3 py-3 border border-gray-300 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                          Monthly Total
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {prescriptionData.map((chemical, chemIndex) => (
                        // Fragment to group rows for a single chemical
                        <React.Fragment key={`chem-${chemical.s_no}`}>
                          {chemical.brands.map((brand, brandIndex) => (
                            <tr key={`${chemical.s_no}-${brand.brand_name}`} className="hover:bg-gray-50">
                              {/* S.No and Chemical Name only shown for the first brand */}
                              {brandIndex === 0 && (
                                <>
                                  <td
                                    className="px-3 py-2 border border-gray-300 bg-white text-sm align-top"
                                    rowSpan={chemical.brands.length} // Span across all brands for this chemical
                                  >
                                    {chemical.s_no}
                                  </td>
                                  <td
                                    className="px-3 py-2 border border-gray-300 bg-white text-sm align-top"
                                    rowSpan={chemical.brands.length} // Span across all brands for this chemical
                                  >
                                    {chemical.chemical_name}
                                  </td>
                                </>
                              )}
                              {/* Brand Specific Info */}
                              <td className="px-3 py-2 border border-gray-300 bg-white text-sm whitespace-nowrap">
                                {brand.brand_name}
                              </td>
                              <td className="px-3 py-2 border border-gray-300 bg-white text-sm whitespace-nowrap">
                                {brand.dosage}
                              </td>
                              {/* Dynamic Day Inputs */}
                              {currentMonthInfo.dayHeaders.map((day) => (
                                <td
                                  key={`input-${chemical.s_no}-${brand.brand_name}-day-${day}`}
                                  className="px-1 py-1 border border-gray-300 bg-white text-sm"
                                >
                                  <input
                                    type="number"
                                    min="0"
                                    value={brand.daily_quantities[`day_${day}`] ?? ''} // Use empty string if value is null/undefined
                                    onChange={(e) => handleQuantityChange(chemIndex, brandIndex, day, e.target.value)}
                                    className="w-full h-full text-center p-1 border border-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                                    style={{ appearance: 'textfield' }} // Hide spinner arrows on number input
                                  />
                                </td>
                              ))}
                              {/* Monthly Total */}
                              <td className="px-3 py-2 border border-gray-300 bg-white text-sm font-semibold text-center whitespace-nowrap">
                                {brand.monthly_total}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PrescriptionIn;

// --- Add basic CSS if needed (or rely on Tailwind) ---
// Optional: Add to your global CSS or component-specific CSS module
// input[type=number]::-webkit-inner-spin-button,
// input[type=number]::-webkit-outer-spin-button {
//   -webkit-appearance: none;
//   margin: 0;
// }
// input[type=number] {
//   -moz-appearance: textfield; /* Firefox */
// }