import React from 'react';

const VitalsDetails = ({ data }) => {

    const renderVisualization = (systolic, diastolic) => {
        if (!systolic || !diastolic) {
            return (
                <p className="text-gray-600 italic">
                    Enter both Systolic and Diastolic values for visualization.
                </p>
            );
        }

        const systolicValue = parseInt(systolic, 10);
        const diastolicValue = parseInt(diastolic, 10);

        // Calculate Mean Arterial Pressure (MAP)
        const meanBP = diastolicValue + (systolicValue - diastolicValue) / 3;

        let status = "Normal";
        let meterColor = "green"; // Default color for Normal
        let percentValue = Math.min((meanBP / 200) * 100, 100); // Normalize percentage for visualization

        // Determine status based on mean BP
        if (meanBP > 100 && meanBP <= 120) {
            status = "Elevated";
            meterColor = "yellow";
        }
        if (meanBP > 120) {
            status = "Hypertension";
            meterColor = "red";
        }

        return (
            <div className="text-center">
                <h3 className={`text-md font-semibold text-${meterColor}-600 mb-2`}>{status}</h3>

                {/* Reduced Size Circular Gauge */}
                <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90)">
                        {/* Background Circle */}
                        <circle
                            className="text-gray-300"
                            cx="18"
                            cy="18"
                            r="15.915"
                            strokeWidth="2"
                            fill="none"
                            stroke="currentColor"
                        />
                        {/* Foreground Circle (Progress Indicator) */}
                        <circle
                            className={`text-${meterColor}-500`}
                            cx="18"
                            cy="18"
                            r="15.915"
                            strokeWidth="2"
                            strokeDasharray={`${percentValue}, 100`}
                            strokeLinecap="round"
                            fill="none"
                            stroke="currentColor"
                        />
                    </svg>
                    {/* Text Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xm font-medium text-gray-600">Mean BP</p>
                        <p className={`text-sm font-bold text-${meterColor}-600`}>{meanBP.toFixed(1)} mmHg</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Vitals Details</h2>

            <div className="mb-12">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Blood Pressure</h3>
                <div className="grid grid-cols-3 gap-6">
                    <DetailCard label="Systolic (mm Hg)" value={data?.systolic} />
                    <DetailCard label="Systolic Status" value={data?.systolic_status} />
                    <DetailCard label="Systolic Comment" value={data?.systolic_comment} />
                    <DetailCard label="Diastolic (mm Hg)" value={data?.diastolic} />
                    <DetailCard label="Diastolic Status" value={data?.diastolic_status} />
                    <DetailCard label="Diastolic Comment" value={data?.diastolic_comment} />
                </div>
                 {/* Ensure it takes a full row */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Blood Pressure Visualization</h3>
                    {renderVisualization(data?.systolic, data?.diastolic)}
                </div>
            </div>

            <div className="mb-12">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Pulse</h3>
                <div className="grid grid-cols-3 gap-6">
                    <DetailCard label="Pulse (Per Minute)" value={data?.pulse} />
                    <DetailCard label="Pulse Status" value={data?.pulse_status} />
                    <DetailCard label="Pulse Comments" value={data?.pulse_comment} />
                </div>
            </div>

            <div className="mb-12">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Respiratory Rate</h3>
                <div className="grid grid-cols-3 gap-6">
                    <DetailCard label="Respiratory Rate (Per Minute)" value={data?.respiratory_rate} />
                    <DetailCard label="Respiratory Rate Status" value={data?.respiratory_rate_status} />
                    <DetailCard label="Respiratory Rate Comments" value={data?.respiratory_rate_comment} />
                </div>
            </div>

            <div className="mb-12">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Temperature</h3>
                <div className="grid grid-cols-3 gap-6">
                    <DetailCard label="Temperature (in °F)" value={data?.temperature} />
                    <DetailCard label="Temperature Status" value={data?.temperature_status} />
                    <DetailCard label="Temperature Comments" value={data?.temperature_comment} />
                </div>
            </div>

            <div className="mb-12">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">SpO2</h3>
                <div className="grid grid-cols-3 gap-6">
                    <DetailCard label="SpO2 (in %)" value={data?.spO2} />
                    <DetailCard label="SpO2 Status" value={data?.spO2_status} />
                    <DetailCard label="SpO2 Comments" value={data?.spO2_comment} />
                </div>
            </div>

            <div className="mb-12">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Weight</h3>
                <div className="grid grid-cols-3 gap-6">
                    <DetailCard label="Weight (in KG)" value={data?.weight} />
                    <DetailCard label="Weight Status" value={data?.weight_status} />
                    <DetailCard label="Weight Comment" value={data?.weight_comment} />
                </div>
            </div>

            <div className="mb-12">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Height</h3>
                <div className="grid grid-cols-3 gap-6">
                    <DetailCard label="Height (in CM)" value={data?.height} />
                    <DetailCard label="Height Status" value={data?.height_status} />
                    <DetailCard label="Height Comment" value={data?.height_comment} />
                </div>
            </div>

            <div className="mb-12">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">BMI</h3>
                <div className="grid grid-cols-3 gap-6">
                    <DetailCard label="BMI" value={data?.bmi} />
                    <DetailCard label="BMI Status" value={data?.bmi_status} />
                    <DetailCard label="BMI Comment" value={data?.bmi_comment} />
                </div>
            </div>

        </div>
    );
};


const DetailCard = ({ label, value }) => (
    <div>
        <label className="block text-gray-700 text-sm font-semibold mb-1">{label}</label>
        <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
            {value || 'No data available'}
        </div>
    </div>
);

export default VitalsDetails;