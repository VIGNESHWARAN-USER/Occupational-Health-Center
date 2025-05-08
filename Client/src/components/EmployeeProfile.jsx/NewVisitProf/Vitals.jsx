import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

// --- Info Modal Component ---
const InfoModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold" aria-label="Close modal">×</button>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
                <div className="text-sm text-gray-600 space-y-2">
                    {children}
                </div>
                <div className="mt-5 text-right">
                    <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Close</button>
                </div>
            </div>
        </div>
    );
};

const VitalsDetails = ({ data }) => {
    const [isBpModalOpen, setIsBpModalOpen] = React.useState(false);
    const [isPulseModalOpen, setIsPulseModalOpen] = React.useState(false);
    const [isTempModalOpen, setIsTempModalOpen] = React.useState(false);
    const [isSpo2ModalOpen, setIsSpo2ModalOpen] = React.useState(false);
    const [isRespRateModalOpen, setIsRespRateModalOpen] = React.useState(false);
    const [isBmiModalOpen, setIsBmiModalOpen] = React.useState(false);

    // --- BP Visualization Function ---
    const renderBpVisualization = (systolic, diastolic, status) => {
        const systolicValue = parseInt(systolic, 10);
        const diastolicValue = parseInt(diastolic, 10);

        if (isNaN(systolicValue) || isNaN(diastolicValue) || systolicValue <= 0 || diastolicValue <= 0 || systolicValue <= diastolicValue) {
            return <div className="text-center text-gray-500 italic text-sm p-4 h-full flex items-center justify-center">Enter valid BP values.</div>;
        }

        let meterColor = "gray";
        let percentValue = 50;
        const meanBP = diastolicValue + (systolicValue - diastolicValue) / 3;

        if (status === 'Low BP (Hypotension)') { meterColor = "blue"; percentValue = 15; }
        else if (status === 'Normal') { meterColor = "green"; percentValue = 35; }
        else if (status === 'High Normal (Prehypertension)') { meterColor = "yellow"; percentValue = 55; }
        else if (status === 'Stage 1 Hypertension') { meterColor = "orange"; percentValue = 75; }
        else if (status === 'Stage 2 Hypertension') { meterColor = "red"; percentValue = 90; }
        else if (status === 'Hypertensive Urgency/Crisis') { meterColor = "red"; percentValue = 100; }

        const colorClass = `text-${meterColor}-600`;
        const svgColorClass = `text-${meterColor}-500`;

        return (
            <div className="text-center p-3 border rounded-lg bg-gray-50 shadow-inner h-full flex flex-col justify-center min-h-[160px]">
                <h4 className={`text-md font-semibold ${colorClass} mb-2 break-words`}>{status || 'Calculating...'}</h4>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90)">
                        <circle className="text-gray-300" cx="18" cy="18" r="15.915" strokeWidth="2.5" fill="none" stroke="currentColor" />
                        <circle className={`${svgColorClass} transition-all duration-500 ease-in-out`} cx="18" cy="18" r="15.915" strokeWidth="2.5" strokeDasharray={`${percentValue.toFixed(1)}, 100`} strokeLinecap="round" fill="none" stroke="currentColor" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xs font-medium text-gray-600">BP</p>
                        <p className={`text-lg font-bold ${colorClass}`}>{systolicValue}/{diastolicValue}</p>
                        <p className="text-[10px] text-gray-500">(MAP: {meanBP.toFixed(0)})</p>
                    </div>
                </div>
            </div>
        );
    };

    // --- BMI Visualization Function ---
    const renderBmiVisualization = (bmi, status) => {
        const bmiValue = parseFloat(bmi);

        if (isNaN(bmiValue) || bmiValue <= 0) {
            return <div className="text-center text-gray-500 italic text-sm p-4 h-full flex items-center justify-center">Enter valid H/W.</div>;
        }

        let meterColor = "gray";
        let percentValue = 50;

        if (status === 'Underweight') { meterColor = "blue"; percentValue = 15; }
        else if (status === 'Normal weight') { meterColor = "green"; percentValue = 35; }
        else if (status === 'Overweight') { meterColor = "yellow"; percentValue = 55; }
        else if (status === 'Obesity') { meterColor = "orange"; percentValue = 75; }
        else if (status === 'Severe Obesity') { meterColor = "red"; percentValue = 90; }

        const colorClass = `text-${meterColor}-600`;
        const svgColorClass = `text-${meterColor}-500`;

        return (
            <div className="text-center p-3 border rounded-lg bg-gray-50 shadow-inner h-full flex flex-col justify-center min-h-[160px]">
                <h4 className={`text-md font-semibold ${colorClass} mb-2 break-words`}>{status || 'Calculating...'}</h4>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90)">
                        <circle className="text-gray-300" cx="18" cy="18" r="15.915" strokeWidth="2.5" fill="none" stroke="currentColor" />
                        <circle className={`${svgColorClass} transition-all duration-500 ease-in-out`} cx="18" cy="18" r="15.915" strokeWidth="2.5" strokeDasharray={`${percentValue.toFixed(1)}, 100`} strokeLinecap="round" fill="none" stroke="currentColor" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xs font-medium text-gray-600">BMI</p>
                        <p className={`text-xl font-bold ${colorClass}`}>{bmiValue.toFixed(1)}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Render Active Modals */}
            <InfoModal isOpen={isBpModalOpen} onClose={() => setIsBpModalOpen(false)} title="Blood Pressure Classification">
                <p><strong>Low BP (Hypotension) :</strong> &lt; 90 / &lt; 60 mmHg</p>
                <p><strong>Normal :</strong> &lt; 120 / &lt; 80 mmHg</p>
                <p><strong>High Normal (Prehypertension) :</strong> 120-139 / 80-89 mmHg</p>
                <p><strong>Stage 1 Hypertension :</strong> 140-159 / 90-99 mmHg</p>
                <p><strong>Stage 2 Hypertension :</strong> ≥ 160 / ≥ 100 mmHg</p>
                <p><strong>Hypertensive Urgency/Crisis :</strong> &gt; 180 / &gt; 120 mmHg</p>
            </InfoModal>
            <InfoModal isOpen={isPulseModalOpen} onClose={() => setIsPulseModalOpen(false)} title="Pulse Information">
                <p><strong>Normal :</strong> 60 - 100 bpm</p>
                <p><strong>Bradycardia :</strong> &lt; 60 bpm</p>
                <p><strong>Tachycardia :</strong> &gt; 100 bpm</p>
            </InfoModal>
            <InfoModal isOpen={isTempModalOpen} onClose={() => setIsTempModalOpen(false)} title="Temperature Information (°F)">
                <p><strong>Normal :</strong> &lt; 99.1°F </p>
                <p><strong>Low Grade Fever :</strong> 99.1°F - 100.4°F</p>
                <p><strong>Moderate Grade Fever :</strong> 100.5°F - 102.2°F</p>
                <p><strong>High Grade Fever :</strong> 102.3°F - 105.8°F</p>
                <p><strong>Hyperthermic :</strong> &gt; 105.8°F</p>
            </InfoModal>
            <InfoModal isOpen={isSpo2ModalOpen} onClose={() => setIsSpo2ModalOpen(false)} title="SpO₂ Information (%)">
                <p><strong>Normal :</strong> 95% - 100%</p>
                <p><strong>Mild Hypoxemia :</strong> 91% - 94%</p>
                <p><strong>Moderate Hypoxemia :</strong> 86% - 90%</p>
                <p><strong>Severe Hypoxemia :</strong> &lt; 86%</p>
            </InfoModal>
            <InfoModal isOpen={isRespRateModalOpen} onClose={() => setIsRespRateModalOpen(false)} title="Respiratory Rate Information">
                <p><strong>Normal :</strong> 12 - 20 breaths/min</p>
                <p><strong>Bradypnea :</strong>  &lt; 12 breaths/min</p>
                <p><strong>Tachypnea :</strong> &gt; 20 breaths/min</p>
            </InfoModal>
            <InfoModal isOpen={isBmiModalOpen} onClose={() => setIsBmiModalOpen(false)} title="BMI Classification Standards">
                <p><strong>Underweight :</strong> &lt; 18.5 kg/m²</p>
                <p><strong>Normal weight :</strong> 18.5 – 24.9 kg/m²</p>
                <p><strong>Overweight :</strong> 25.0 – 29.9 kg/m²</p>
                <p><strong>Obesity :</strong> 30.0 – 39.9 kg/m²</p>
                <p><strong>Severe Obesity :</strong> ≥ 40.0 kg/m²</p>
            </InfoModal>

            <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Vitals Details</h2>

                {/* Blood Pressure Section */}
                <section className="p-4 border rounded-lg bg-slate-50 shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-700">Blood Pressure</h3>
                        <button type="button" onClick={() => setIsBpModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="View Blood Pressure Standards">
                            <FaInfoCircle size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
                        <div className="md:col-span-2 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailCard label="Systolic (mmHg)" value={data?.systolic} />
                                <DetailCard label="Diastolic (mmHg)" value={data?.diastolic} />
                            </div>
                            <DetailCard label="BP Status" value={data?.bp_status} />
                        </div>
                        <div className="md:col-span-1 flex items-center justify-center mt-4 md:mt-0">
                            {renderBpVisualization(data?.systolic, data?.diastolic, data?.bp_status)}
                        </div>
                    </div>
                </section>

                {/* Pulse Section */}
                <section className="p-4 border rounded-lg bg-slate-50 shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-semibold text-gray-700">Pulse <span className='text-xs font-normal'>(/min)</span></h3>
                        <button type="button" onClick={() => setIsPulseModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="Pulse Information">
                            <FaInfoCircle size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <DetailCard label="Value" value={data?.pulse} />
                        <DetailCard label="Status" value={data?.pulse_status} />
                        <DetailCard label="Comment" value={data?.pulse_comment} />
                    </div>
                </section>

                {/* Temperature Section */}
                <section className="p-4 border rounded-lg bg-slate-50 shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-semibold text-gray-700">Temperature <span className='text-xs font-normal'>(°F)</span></h3>
                        <button type="button" onClick={() => setIsTempModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="Temperature Information">
                            <FaInfoCircle size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <DetailCard label="Value" value={data?.temperature} />
                        <DetailCard label="Status" value={data?.temperature_status} />
                        <DetailCard label="Comment" value={data?.temperature_comment} />
                    </div>
                </section>

                {/* SpO2 Section */}
                <section className="p-4 border rounded-lg bg-slate-50 shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-semibold text-gray-700">SpO₂ <span className='text-xs font-normal'>(%)</span></h3>
                        <button type="button" onClick={() => setIsSpo2ModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="SpO₂ Information">
                            <FaInfoCircle size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <DetailCard label="Value" value={data?.spO2} />
                        <DetailCard label="Status" value={data?.spO2_status} />
                        <DetailCard label="Comment" value={data?.spO2_comment} />
                    </div>
                </section>

                {/* Respiratory Rate Section */}
                <section className="p-4 border rounded-lg bg-slate-50 shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-semibold text-gray-700">Respiratory Rate <span className='text-xs font-normal'>(/min)</span></h3>
                        <button type="button" onClick={() => setIsRespRateModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="Respiratory Rate Information">
                            <FaInfoCircle size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <DetailCard label="Value" value={data?.respiratory_rate} />
                        <DetailCard label="Status" value={data?.respiratory_rate_status} />
                        <DetailCard label="Comment" value={data?.respiratory_rate_comment} />
                    </div>
                </section>

                {/* Height, Weight, BMI Section */}
                <section className="p-4 border rounded-lg bg-slate-50 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className='space-y-4'>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailCard label="Height (cm)" value={data?.height} />
                                <DetailCard label="Weight (kg)" value={data?.weight} />
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-md font-semibold text-gray-700">BMI <span className='text-xs font-normal'>(kg/m²)</span></h4>
                                    <button type="button" onClick={() => setIsBmiModalOpen(true)} className="text-blue-500 hover:text-blue-700" title="View BMI Standards">
                                        <FaInfoCircle size={16}/>
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <DetailCard label="Calculated BMI" value={data?.bmi} />
                                    <DetailCard label="BMI Status" value={data?.bmi_status} />
                                    <DetailCard label="Comment" value={data?.bmi_comment} />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center pt-5 md:pt-0">
                            {renderBmiVisualization(data?.bmi, data?.bmi_status)}
                        </div>
                    </div>
                </section>
            </div>

            {/* Inline styles for dynamic Tailwind classes */}
            <style jsx>{`
                .text-blue-600 { color: #2563eb; } .text-blue-500 { color: #3b82f6; }
                .text-green-600 { color: #16a34a; } .text-green-500 { color: #22c55e; }
                .text-yellow-600 { color: #ca8a04; } .text-yellow-500 { color: #eab308; }
                .text-orange-600 { color: #ea580c; } .text-orange-500 { color: #f97316; }
                .text-red-600 { color: #dc2626; } .text-red-500 { color: #ef4444; }
                .text-gray-600 { color: #4b5563; } .text-gray-500 { color: #6b7280; } .text-gray-300 { color: #d1d5db; }
                .min-h-\[160px\] { min-height: 160px; }
            `}</style>
        </>
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