import React, { useState, useRef, useEffect } from "react";
import SignaturePad from 'signature_pad';

const FitnessPage = ({ data }) => {
    const allOptions = ["Height", "Gas Line", "Confined Space", "SCBA Rescue", "Fire Rescue"];
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [conditionalOptions, setConditionalOptions] = useState([]);
    const [overallFitness, setOverallFitness] = useState("");
    const [fitnessFormData, setFitnessFormData] = useState({
        emp_no: data[0]?.emp_no,
        tremors: "",
        romberg_test: "",
        acrophobia: "",
        trendelenberg_test: "",
    });
    const [comments, setComments] = useState("");
    const [isForm17Open, setIsForm17Open] = useState(false);
    const [isForm38Open, setIsForm38Open] = useState(false);
    const [isForm39Open, setIsForm39Open] = useState(false);
    const [isForm40Open, setIsForm40Open] = useState(false); // NEW: Form 40 state
    const [isForm27Open, setIsForm27Open] = useState(false); //NEW: Form 27 State

    // Form 17 State
    const [form17Data, setForm17Data] = useState({
        dept: '', worksNumber: '', workerName: '', sex: '', dob: '', employmentDate: '', leavingDate: '', reason: '', transferredTo: '', jobNature: '', rawMaterial: '', medicalExamDate: '', medicalExamResult: '', suspensionDetails: '', recertifiedDate: '', unfitnessCertificate: '', surgeonSignature: '', fmoSignature: ''
    });

    //Form 38 State
    const [form38Data, setForm38Data] = useState({
        serialNumber: '', department: '', workerName: '', sex: '', age: '', jobNature: '', employmentDate: '', eyeExamDate: '', result: '', opthamologistSignature: '', fmoSignature: '', remarks: ''
    });

    //Form 39 State
    const [form39Data, setForm39Data] = useState({
        serialNumber: '', workerName: '', sex: '', age: '', proposedEmploymentDate: '', jobOccupation: '', rawMaterialHandled: '', medicalExamDate: '', medicalExamResult: '', certifiedFit: '', certifyingSurgeonSignature: '', departmentSection: ''
    });

    //Form 40 State
    const [form40Data, setForm40Data] = useState({
        serialNumber: '', dateOfEmployment: '', workerName: '', sex: '', age: '', sonWifeDaughterOf: '', natureOfJob: '', urineResult: '', bloodResult: '', fecesResult: '', xrayResult: '', otherExamResult: '', deworming: '', typhoidVaccinationDate: '',signatureOfFMO:'',remarks:''
    });

    //Form 27 State (Assumed fields based on the OCR and images)
    const [form27Data, setForm27Data] = useState({
        serialNumber: '', date: '', department: '', nameOfWorks: '', sex: '', dateOfBirth: '', age: '', nameOfTheFather: '', natureOfJobOrOccupation: '', signatureOfFMO: '', descriptiveMarks: '', signatureOfCertifyingSurgeon: ''
    });
    
    

    const [activeSignatureIndex, setActiveSignatureIndex] = useState(null);
    const signatureCanvasRef = useRef(null);
    const [signaturePad, setSignaturePad] = useState(null);
    const [signatureDataURLs, setSignatureDataURLs] = useState({});

    // Form 17 Effects
    useEffect(() => {
        if (activeSignatureIndex !== null && signatureCanvasRef.current) {
            const newSignaturePad = new SignaturePad(signatureCanvasRef.current);
            setSignaturePad(newSignaturePad);
            if (signatureDataURLs[activeSignatureIndex]) {
                newSignaturePad.fromDataURL(signatureDataURLs[activeSignatureIndex]);
            }
        }
    }, [activeSignatureIndex, signatureDataURLs]);

    //Fitness Page Effects
    useEffect(() => {
        if (data && data[0] && data[0].fitnessassessment) {
            const assessmentData = data[0].fitnessassessment;

            setFitnessFormData({
                emp_no: assessmentData.emp_no || data[0]?.emp_no, // Prioritize existing emp_no
                tremors: assessmentData.tremors || "",
                romberg_test: assessmentData.romberg_test || "",
                acrophobia: assessmentData.acrophobia || "",
                trendelenberg_test: assessmentData.trendelenberg_test || "",
            });

            try {
                setSelectedOptions(assessmentData.job_nature || []);
            } catch (error) {
                console.error("Error parsing job_nature:", error);
                setSelectedOptions([]); // Set to empty array in case of parsing error
            }
            setConditionalOptions(assessmentData.conditional_fit_feilds || []);
            setOverallFitness(assessmentData.overall_fitness || "");
            setComments(assessmentData.comments || ""); // Load Existing Comments
        }
    }, [data]);

    // Form 17 Handlers
    const handleForm17InputChange = (event) => {
        const { name, value } = event.target;
        setForm17Data(prevState => ({ ...prevState, [name]: value }));
    };

    //Form 38 Handlers
    const handleForm38InputChange = (event) => {
        const { name, value } = event.target;
        setForm38Data(prevState => ({ ...prevState, [name]: value }));
    };

    //Form 39 Handlers
    const handleForm39InputChange = (event) => {
        const { name, value } = event.target;
        setForm39Data(prevState => ({ ...prevState, [name]: value }));
    };

     //Form 40 Handlers
    const handleForm40InputChange = (event) => {
        const { name, value } = event.target;
        setForm40Data(prevState => ({ ...prevState, [name]: value }));
    };

    //Form 27 Handlers
    const handleForm27InputChange = (event) => {
        const { name, value } = event.target;
        setForm27Data(prevState => ({ ...prevState, [name]: value }));
    };

    const clearSignature = () => {
        if (signaturePad) {
            signaturePad.clear();
            saveSignature();
        }
    };

    const saveSignature = () => {
        if (signaturePad && !signaturePad.isEmpty() && activeSignatureIndex !== null) {
            const dataURL = signaturePad.toDataURL();
            setSignatureDataURLs(prevState => ({ ...prevState, [activeSignatureIndex]: dataURL }));
        } else if (activeSignatureIndex !== null) {
            setSignatureDataURLs(prevState => ({ ...prevState, [activeSignatureIndex]: "" }));
        }
    };

    const handleForm17Submit = (e) => {
        e.preventDefault();
        const signaturesArray = Object.entries(signatureDataURLs).map(([index, dataURL]) => ({ index, dataURL }));
        console.log('Form 17 Data:', { form17Data, signatures: signaturesArray });
        closeForm17(); // Close the form after submitting
    };

    // Form 38 Submit
    const handleForm38Submit = (e) => {
        e.preventDefault();
        const signaturesArray = Object.entries(signatureDataURLs).map(([index, dataURL]) => ({ index, dataURL }));
        console.log('Form 38 Data:', { form38Data, signatures: signaturesArray });
        closeForm38(); // Close the form after submitting
    };

    // Form 39 Submit
    const handleForm39Submit = (e) => {
        e.preventDefault();
        const signaturesArray = Object.entries(signatureDataURLs).map(([index, dataURL]) => ({ index, dataURL }));
        console.log('Form 39 Data:', { form39Data, signatures: signaturesArray });
        closeForm39(); // Close the form after submitting
    };

     // Form 40 Submit
    const handleForm40Submit = (e) => {
        e.preventDefault();
        const signaturesArray = Object.entries(signatureDataURLs).map(([index, dataURL]) => ({ index, dataURL }));
        console.log('Form 40 Data:', { form40Data, signatures: signaturesArray });
        closeForm40(); // Close the form after submitting
    };

    // Form 27 Submit
    const handleForm27Submit = (e) => {
        e.preventDefault();
        const signaturesArray = Object.entries(signatureDataURLs).map(([index, dataURL]) => ({ index, dataURL }));
        console.log('Form 27 Data:', { form27Data, signatures: signaturesArray });
        closeForm27(); // Close the form after submitting
    };

    const handleTapToSign = (index) => {
        setActiveSignatureIndex(index);
        if (activeSignatureIndex === index) {
            setActiveSignatureIndex(null);
        }
    };

    //Fitness Page Handlers

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !selectedOptions.includes(selectedValue)) {
            setSelectedOptions([...selectedOptions, selectedValue]);
        }
    };

    const handleRemoveSelected = (value) => {
        setSelectedOptions(selectedOptions.filter((option) => option !== value));
    };

    const handleFitnessInputChange = (e) => {
        setFitnessFormData({ ...fitnessFormData, [e.target.name]: e.target.value });
    };

    const handleOverallFitnessChange = (e) => {
        setOverallFitness(e.target.value);
    };

    const handleConditionalSelectChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !conditionalOptions.includes(selectedValue)) {
            setConditionalOptions([...conditionalOptions, selectedValue]);
        }
    };

    const handleRemoveConditionalSelected = (value) => {
        setConditionalOptions(conditionalOptions.filter((option) => option !== value));
    };

    const handleCommentsChange = (e) => {
        setComments(e.target.value);
    };

    const handleFitnessSubmit = async () => {
        const today = new Date();
        const validityDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
        const validityDateString = validityDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        const payload = {
            emp_no: data[0]?.emp_no,
            employer: data[0]?.role,
            ...fitnessFormData,
            job_nature: JSON.stringify(selectedOptions),  // Stringify this!
            overall_fitness: overallFitness,
            conditional_fit_feilds: conditionalOptions,
            validity: validityDateString,
            comments: comments, // Include Comments
        };

        try {
            const response = await fetch("http://localhost:8000/fitness-tests/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to submit fitness data!");

            alert("Fitness data submitted successfully!");
            setFitnessFormData({ tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "" });
            setSelectedOptions([]);
            setConditionalOptions([]);
            setOverallFitness("");
            setComments("");  //Clear Comments after submission
        } catch (error) {
            alert(error.message);
        }
    };

    const accessLevel = localStorage.getItem("accessLevel");

    const openForm17 = () => {
        setIsForm17Open(true);
    };

    const closeForm17 = () => {
        setIsForm17Open(false);
        setActiveSignatureIndex(null);
        setSignatureDataURLs({});
        setForm17Data({
            dept: '', worksNumber: '', workerName: '', sex: 'male', dob: '', employmentDate: '', leavingDate: '', reason: '', transferredTo: '', jobNature: '', rawMaterial: '', medicalExamDate: '', medicalExamResult: '', suspensionDetails: '', recertifiedDate: '', unfitnessCertificate: '', surgeonSignature: '', fmoSignature: ''
        });

    };

    const openForm38 = () => {
        setIsForm38Open(true);
    };

    const closeForm38 = () => {
        setIsForm38Open(false);
        setActiveSignatureIndex(null);
        setSignatureDataURLs({});
        setForm38Data({
            serialNumber: '', department: '', workerName: '', sex: 'male', age: '', jobNature: '', employmentDate: '', eyeExamDate: '', result: '', opthamologistSignature: '', fmoSignature: '', remarks: ''
        });

    };

    const openForm39 = () => {
        setIsForm39Open(true);
    };

    const closeForm39 = () => {
        setIsForm39Open(false);
        setActiveSignatureIndex(null);
        setSignatureDataURLs({});
        setForm39Data({
            serialNumber: '', workerName: '', sex: 'male', age: '', proposedEmploymentDate: '', jobOccupation: '', rawMaterialHandled: '', medicalExamDate: '', medicalExamResult: '', certifiedFit: '', certifyingSurgeonSignature: '', departmentSection: ''
        });

    };

     // Form 40 Open and Close
    const openForm40 = () => {
        setIsForm40Open(true);
    };

    const closeForm40 = () => {
        setIsForm40Open(false);
        setActiveSignatureIndex(null);
        setSignatureDataURLs({});
        setForm40Data({
             serialNumber: '', dateOfEmployment: '', workerName: '', sex: '', age: '', sonWifeDaughterOf: '', natureOfJob: '', urineResult: '', bloodResult: '', fecesResult: '', xrayResult: '', otherExamResult: '', deworming: '', typhoidVaccinationDate: '',signatureOfFMO:'',remarks:''
        });
    };

    // Form 27 Open and Close
    const openForm27 = () => {
        setIsForm27Open(true);
    };

    const closeForm27 = () => {
        setIsForm27Open(false);
        setActiveSignatureIndex(null);
        setSignatureDataURLs({});
        setForm27Data({
            serialNumber: '', date: '', department: '', nameOfWorks: '', sex: '', dateOfBirth: '', age: '', nameOfTheFather: '', natureOfJobOrOccupation: '', signatureOfFMO: '', descriptiveMarks: '', signatureOfCertifyingSurgeon: ''
        });
    };

    const renderFormModal = (isOpen, onClose, title, formId, formData, setFormData, handleSubmit, signatureFields) => {
        if (!isOpen) return null;

        const handleInputChange = (event) => {
            const { name, value } = event.target;
            setFormData(prevState => ({ ...prevState, [name]: value }));
        };

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div className="relative max-w-4xl p-6 bg-white rounded-lg shadow-xl transform transition-all m-4" style={{ width: '90%', maxWidth: '1200px' }}>
                    <div className="flex items-start justify-between p-4 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {title}
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={onClose}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>
                    <div className="p-6 space-y-6">
                        <form id={formId} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(formData).map(([name, value]) => (
                                <div key={name} className="mb-4">
                                    <label htmlFor={name} className="block text-gray-700 text-sm font-bold mb-2 capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
                                    {name === 'sex' ? (
                                        <select
                                            id={name}
                                            name={name}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={value}
                                            onChange={handleInputChange}
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    ) : (
                                        <input
                                            type={name.toLowerCase().includes('date') ? 'date' : 'text'}
                                            id={name}
                                            name={name}
                                            placeholder={`Enter ${name.replace(/([A-Z])/g, ' $1')}`}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            value={value}
                                            onChange={handleInputChange}
                                        />
                                    )}
                                </div>
                            ))}
                            {signatureFields.map(field => (
                                <div key={field} className="mb-4">
                                    <label htmlFor={field} className="block text-gray-700 text-sm font-bold mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                    <button
                                        type="button"
                                        className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${signatureDataURLs[field] ? 'bg-green-500 hover:bg-green-700 text-white' : ''}`}
                                        onClick={() => handleTapToSign(field)}
                                    >
                                        {signatureDataURLs[field] ? 'Signature Saved' : 'Add Signature'}
                                    </button>
                                    {activeSignatureIndex === field && (
                                        <div className="mt-2">
                                            <canvas ref={signatureCanvasRef} width={300} height={150} className="border border-gray-300 rounded"></canvas>
                                            <div className="mt-1 flex space-x-2">
                                                <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={clearSignature}>Clear</button>
                                                <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={saveSignature}>Save</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </form>
                    </div>
                    <div className="flex items-center justify-end p-4 border-t rounded-b">
                        <button data-modal-close="defaultModal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSubmit}>Submit</button>
                        <button type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 ml-3" onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white min-h-screen p-6 relative">
            <h1 className="text-3xl font-bold mb-8">Fitness</h1>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                {["tremors", "romberg_test", "acrophobia", "trendelenberg_test"].map((test) => (
                    <div key={test} className="bg-blue-100 p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4">{test.replace("_", " ")}</h2>
                        <div className="space-y-2">
                            {["positive","Double Positive","Triple Positive","negative"].map((value) => (
                                <label key={value} className="ms-4 items-center space-x-2">
                                    <input
                                        type="radio"
                                        name={test}
                                        value={value}
                                        checked={fitnessFormData[test] === value}
                                        onChange={handleFitnessInputChange}
                                    />
                                    <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Multi-Select Dropdown for Job Nature */}
            <div className="bg-blue-100 p-6 rounded-lg shadow-md mt-8">
                <h2 className="text-lg font-semibold mb-4">Job Nature (Select Multiple Options)</h2>
                <select
                    className="form-select block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                    onChange={handleSelectChange}
                >
                    <option value="" disabled>-- Select an option --</option>
                    {allOptions.map((option, index) => (
                        <option key={index} value={option} disabled={selectedOptions.includes(option)}>
                            {option}
                        </option>
                    ))}
                </select>

                {/* Selected options in a single row */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((option, index) => (
                            <div key={index} className="flex items-center p-2 border border-gray-300 rounded-md bg-gray-100">
                                <span className="mr-2">{option}</span>
                                <button className="text-red-500 hover:underline" onClick={() => handleRemoveSelected(option)}>
                                    ×</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No options selected.</p>
                    )}
                </div>

                {accessLevel === "doctor" && (
                    <>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-1">Overall Fitness</label>
                            <select
                               className="form-select block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                                onChange={handleOverallFitnessChange}
                                value={overallFitness}
                            >
                                <option value="" disabled>Select an option</option>
                                <option value="fit">Fit</option>
                                <option value="unfit">Unfit</option>
                                <option value="conditional">Conditional Fit</option>
                            </select>
                        </div>

                        {overallFitness === "conditional" && (
                            <div className="mt-4">
                                <h2 className="text-lg font-semibold mb-4">Fit For (Select Multiple Options)</h2>
                                <select
                                    className="form-select block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                                    onChange={handleConditionalSelectChange}
                                >
                                    <option value="" disabled>-- Select an option --</option>
                                    {allOptions.map((option, index) => (
                                        <option key={index} value={option} disabled={conditionalOptions.includes(option)}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                {/* Selected options in a single row */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {conditionalOptions.length > 0 ? (
                                        conditionalOptions.map((option, index) => (
                                            <div key={index} className="flex items-center p-2 border border-gray-300 rounded-md bg-gray-100">
                                                <span className="mr-2">{option}</span>
                                                <button className="text-red-500 hover:underline" onClick={() => handleRemoveConditionalSelected(option)}>
                                                    ×</button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No options selected.</p>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="mt-4">
                            <label htmlFor="comments" className="block text-gray-700 text-sm font-semibold mb-1">
                                Comments
                            </label>
                            <textarea
                                id="comments"
                                className="form-textarea block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                                rows="3"
                                value={comments}
                                onChange={handleCommentsChange}
                            ></textarea>
                        </div>
                        <h1 className="text-3xl font-bold my-8">Forms</h1>
                        <div className="flex flex-wrap justify-around  gap-4 m-16">
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer mb-4 h-28 bg-blue-400 shadow-md hover:shadow-lg transition duration-300"
                                onClick={openForm17} //Open form 17 on click
                            >
                                Form 17
                            </div>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer mb-4 h-28 bg-blue-400 shadow-md hover:shadow-lg transition duration-300"
                                onClick={openForm38} //Open form 38 on click
                            >
                                Form 38
                            </div>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer mb-4 h-28 bg-blue-400 shadow-md hover:shadow-lg transition duration-300"
                                onClick={openForm39} //Open form 39 on click
                            >
                                Form 39
                            </div>
                              <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer mb-4 h-28 bg-blue-400 shadow-md hover:shadow-lg transition duration-300"
                                onClick={openForm40} //Open form 40 on click
                            >
                                Form 40
                            </div>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer mb-4 h-28 bg-blue-400 shadow-md hover:shadow-lg transition duration-300"
                                onClick={openForm27} //Open form 27 on click
                            >
                                Form 27
                            </div>
                        </div>

                    </>
                )}


                {/* Submit Button */}
                <div className="absolute bottom-6 right-6">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600" onClick={handleFitnessSubmit}>
                        Submit
                    </button>
                </div>
            </div>

              {renderFormModal(
                isForm17Open,
                closeForm17,
                "Form 17",
                "form17",
                form17Data,
                setForm17Data,
                handleForm17Submit,
                ['surgeonSignature', 'fmoSignature']
            )}

            {renderFormModal(
                isForm38Open,
                closeForm38,
                "Form 38",
                "form38",
                form38Data,
                setForm38Data,
                handleForm38Submit,
                ['opthamologistSignature', 'fmoSignature']
            )}

            {renderFormModal(
                isForm39Open,
                closeForm39,
                "Form 39",
                "form39",
                form39Data,
                setForm39Data,
                handleForm39Submit,
                ['certifyingSurgeonSignature']
            )}

            {renderFormModal(
                isForm40Open,
                closeForm40,
                "Form 40",
                "form40",
                form40Data,
                setForm40Data,
                handleForm40Submit,
                ['signatureOfFMO']
            )}

            {renderFormModal(
                isForm27Open,
                closeForm27,
                "Form 27",
                "form27",
                form27Data,
                setForm27Data,
                handleForm27Submit,
                ['signatureOfCertifyingSurgeon', 'signatureOfFMO']
            )}
        
                </div>
            );
        };
        
        export default FitnessPage;