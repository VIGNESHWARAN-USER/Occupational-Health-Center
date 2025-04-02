import React, { useState, useRef, useEffect } from "react";
import moment from 'moment'; // Import moment.js

const FITNESS_ASSESSMENT_URL = "https://occupational-health-center-1.onrender.com/fitness-assessment"; // URL for main fitness data
const FORM17_URL = "https://occupational-health-center-1.onrender.com/form17/";
const FORM38_URL = "https://occupational-health-center-1.onrender.com/form38/";
const FORM39_URL = "https://occupational-health-center-1.onrender.com/form39/";
const FORM40_URL = "https://occupational-health-center-1.onrender.com/form40/";
const FORM27_URL = "https://occupational-health-center-1.onrender.com/form27/";

const FitnessPage = ({ data }) => {
    const allOptions = ["Height", "Gas Line", "Confined Space", "SCBA Rescue", "Fire Rescue"];
    const statutoryOptions = ["Select Form", "Form 17", "Form 38", "Form 39", "Form 40", "Form 27"];
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [conditionalOptions, setConditionalOptions] = useState([]);
    const [overallFitness, setOverallFitness] = useState("");
    const [fitnessFormData, setFitnessFormData] = useState({
        emp_no: data[0]?.emp_no || '',
        tremors: "",
        romberg_test: "",
        acrophobia: "",
        trendelenberg_test: "",
    });
    const [comments, setComments] = useState("");

    const [form17Data, setForm17Data] = useState({
        emp_no: data[0]?.emp_no || '', // Initialize with emp_no
        dept: '',
        worksNumber: '',
        workerName: '',
        sex: 'male',
        dob: '',
        age: '', // Added age field
        employmentDate: '',
        leavingDate: '',
        reason: '',
        transferredTo: '',
        jobNature: '',
        rawMaterial: '',
        medicalExamDate: '',
        medicalExamResult: '',
        suspensionDetails: '',
        recertifiedDate: '',
        unfitnessCertificate: '',
        surgeonSignature: '',
        fmoSignature: ''
    });

    const [form38Data, setForm38Data] = useState({
        emp_no: data[0]?.emp_no || '', // Initialize with emp_no
        serialNumber: '',
        department: '',
        workerName: '',
        sex: 'male',
        age: '', // Added age field
        jobNature: '',
        employmentDate: '',
        eyeExamDate: '',
        result: '',
        opthamologistSignature: '',
        fmoSignature: '',
        remarks: ''
    });

    const [form39Data, setForm39Data] = useState({
        emp_no: data[0]?.emp_no || '', // Initialize with emp_no
        serialNumber: '',
        workerName: '',
        sex: 'male',
        age: '', // Added age field
        proposedEmploymentDate: '',
        jobOccupation: '',
        rawMaterialHandled: '',
        medicalExamDate: '',
        medicalExamResult: '',
        certifiedFit: '',
        certifyingSurgeonSignature: '',
        departmentSection: ''
    });

    const [form40Data, setForm40Data] = useState({
        emp_no: data[0]?.emp_no || '', // Initialize with emp_no
        serialNumber: '',
        dateOfEmployment: '',
        workerName: '',
        sex: 'male',
        age: '', // Added age field
        sonWifeDaughterOf: '',
        natureOfJob: '',
        urineResult: '',
        bloodResult: '',
        fecesResult: '',
        xrayResult: '',
        otherExamResult: '',
        deworming: '',
        typhoidVaccinationDate: '',
        signatureOfFMO: '',
        remarks: ''
    });

    const [form27Data, setForm27Data] = useState({
        emp_no: data[0]?.emp_no || '', // Initialize with emp_no
        serialNumber: '',
        date: '',
        department: '',
        nameOfWorks: '',
        sex: 'male',
        age: '', // Added age field
        dateOfBirth: '',
        nameOfTheFather: '',
        natureOfJobOrOccupation: '',
        signatureOfFMO: '',
        descriptiveMarks: '',
        signatureOfCertifyingSurgeon: ''
    });


    const [selectedStatutoryForms, setSelectedStatutoryForms] = useState([]);


    useEffect(() => {
        if (data && data[0]) {

            // Update emp_no in fitnessFormData
            setFitnessFormData(prevState => ({...prevState, emp_no: data[0]?.emp_no || ''}));


            if (data[0].fitnessassessment) {
                const assessmentData = data[0].fitnessassessment;

                setFitnessFormData({
                    emp_no: assessmentData.emp_no || data[0]?.emp_no || '',
                    tremors: assessmentData.tremors || "",
                    romberg_test: assessmentData.romberg_test || "",
                    acrophobia: assessmentData.acrophobia || "",
                    trendelenberg_test: assessmentData.trendelenberg_test || "",
                });

                try {
                    setSelectedOptions(JSON.parse(assessmentData.job_nature || "[]"));
                } catch (error) {
                    console.error("Error parsing job_nature:", error);
                    setSelectedOptions([]);
                }
                setConditionalOptions(assessmentData.conditional_fit_feilds || []);
                setOverallFitness(assessmentData.overall_fitness || "");
                setComments(assessmentData.comments || "");
            }

            // Update emp_no in all forms
            setForm17Data(prevState => ({...prevState, emp_no: data[0]?.emp_no || ''}));
            setForm38Data(prevState => ({...prevState, emp_no: data[0]?.emp_no || ''}));
            setForm39Data(prevState => ({...prevState, emp_no: data[0]?.emp_no || ''}));
            setForm40Data(prevState => ({...prevState, emp_no: data[0]?.emp_no || ''}));
            setForm27Data(prevState => ({...prevState, emp_no: data[0]?.emp_no || ''}));

        }
    }, [data]);

    const handleForm17InputChange = (event) => {
        const {name, value} = event.target;

        if (name === 'dob') {
            const birthDate = moment(value);
            const today = moment();
            const age = today.diff(birthDate, 'years');
            setForm17Data(prevState => ({...prevState, [name]: value, age: age.toString()})); // set Age to form 17
        } else {
            setForm17Data(prevState => ({...prevState, [name]: value}));
        }
    };

    const handleForm38InputChange = (event) => {
        const {name, value} = event.target;
        if (name === 'age') {
            setForm38Data(prevState => ({...prevState, [name]: value}));
        } else {
            setForm38Data(prevState => ({...prevState, [name]: value}));
        }

    };

    const handleForm39InputChange = (event) => {
        const {name, value} = event.target;
        if (name === 'age') {
            setForm39Data(prevState => ({...prevState, [name]: value}));
        } else {
            setForm39Data(prevState => ({...prevState, [name]: value}));
        }

    };

    const handleForm40InputChange = (event) => {
        const {name, value} = event.target;
        if (name === 'age') {
            setForm40Data(prevState => ({...prevState, [name]: value}));
        } else {
            setForm40Data(prevState => ({...prevState, [name]: value}));
        }
    };

    const handleForm27InputChange = (event) => {
        const {name, value} = event.target;
        if (name === 'age') {
            setForm27Data(prevState => ({...prevState, [name]: value}));
        } else {
            setForm27Data(prevState => ({...prevState, [name]: value}));
        }
    };


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
        setFitnessFormData({...fitnessFormData, [e.target.name]: e.target.value});
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
        const validityDateString = validityDate.toISOString().split('T')[0];

        const payload = {
            emp_no: data[0]?.emp_no,
            employer: data[0]?.role,
            ...fitnessFormData,
            job_nature: JSON.stringify(selectedOptions),
            overall_fitness: overallFitness,
            conditional_fit_feilds: conditionalOptions,
            validity: validityDateString,
            comments: comments,
        };

        try {
            const response = await fetch(FITNESS_ASSESSMENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to submit fitness data!");

            alert("Fitness data submitted successfully!");
            setFitnessFormData({emp_no: data[0]?.emp_no || '', tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: ""});
            setSelectedOptions([]);
            setConditionalOptions([]);
            setOverallFitness("");
            setComments("");


        } catch (error) {
            alert(error.message);
        }
    };

    const accessLevel = localStorage.getItem("accessLevel");

    const handleStatutorySelectChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue && !selectedStatutoryForms.includes(selectedValue)) {
            setSelectedStatutoryForms([...selectedStatutoryForms, selectedValue]);
        } else {
            setSelectedStatutoryForms(selectedStatutoryForms.filter((option) => option !== selectedValue));

            switch (selectedValue) {
                case "Form 17":
                    setForm17Data({
                        emp_no: data[0]?.emp_no || '',
                        dept: '',
                        worksNumber: '',
                        workerName: '',
                        sex: 'male',
                        dob: '',
                        age: '', // Added age field
                        employmentDate: '',
                        leavingDate: '',
                        reason: '',
                        transferredTo: '',
                        jobNature: '',
                        rawMaterial: '',
                        medicalExamDate: '',
                        medicalExamResult: '',
                        suspensionDetails: '',
                        recertifiedDate: '',
                        unfitnessCertificate: '',
                        surgeonSignature: '',
                        fmoSignature: ''
                    });
                    break;
                case "Form 38":
                    setForm38Data({
                        emp_no: data[0]?.emp_no || '',
                        serialNumber: '',
                        department: '',
                        workerName: '',
                        sex: 'male',
                        age: '', // Added age field
                        jobNature: '',
                        employmentDate: '',
                        eyeExamDate: '',
                        result: '',
                        opthamologistSignature: '',
                        fmoSignature: '',
                        remarks: ''
                    });
                    break;
                case "Form 39":
                    setForm39Data({
                        emp_no: data[0]?.emp_no || '',
                        serialNumber: '',
                        workerName: '',
                        sex: 'male',
                        age: '', // Added age field
                        proposedEmploymentDate: '',
                        jobOccupation: '',
                        rawMaterialHandled: '',
                        medicalExamDate: '',
                        medicalExamResult: '',
                        certifiedFit: '',
                        certifyingSurgeonSignature: '',
                        departmentSection: ''
                    });
                    break;
                case "Form 40":
                    setForm40Data({
                        emp_no: data[0]?.emp_no || '',
                        serialNumber: '',
                        dateOfEmployment: '',
                        workerName: '',
                        sex: 'male',
                        age: '', // Added age field
                        sonWifeDaughterOf: '',
                        natureOfJob: '',
                        urineResult: '',
                        bloodResult: '',
                        fecesResult: '',
                        xrayResult: '',
                        otherExamResult: '',
                        deworming: '',
                        typhoidVaccinationDate: '',
                        signatureOfFMO: '',
                        remarks: ''
                    });
                    break;
                case "Form 27":
                    setForm27Data({
                        emp_no: data[0]?.emp_no || '',
                        serialNumber: '',
                        date: '',
                        department: '',
                        nameOfWorks: '',
                        sex: 'male',
                        age: '', // Added age field
                        dateOfBirth: '',
                        nameOfTheFather: '',
                        natureOfJobOrOccupation: '',
                        signatureOfFMO: '',
                        descriptiveMarks: '',
                        signatureOfCertifyingSurgeon: ''
                    });
                    break;
                default:
                    break;
            }
        }
    };

    const handleRemoveStatutorySelected = (value) => {
        setSelectedStatutoryForms(selectedStatutoryForms.filter((option) => option !== value));
    };

    const renderForm17 = () => {
        return (
            <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Form 17 Details</h2>
                {/* Hidden Emp_No Field */}
                <input type="hidden" name="emp_no" value={form17Data.emp_no} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-4">
                        <label htmlFor="dept" className="block text-gray-700 text-sm font-bold mb-2">Dept</label>
                        <input
                            type="text"
                            id="dept"
                            name="dept"
                            placeholder="Enter Department"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.dept}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="worksNumber" className="block text-gray-700 text-sm font-bold mb-2">Works Number</label>
                        <input
                            type="text"
                            id="worksNumber"
                            name="worksNumber"
                            placeholder="Enter Works Number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.worksNumber}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="workerName" className="block text-gray-700 text-sm font-bold mb-2">Worker Name</label>
                        <input
                            type="text"
                            id="workerName"
                            name="workerName"
                            placeholder="Enter Worker Name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.workerName}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="sex" className="block text-gray-700 text-sm font-bold mb-2">Sex</label>
                        <select
                            id="sex"
                            name="sex"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.sex}
                            onChange={handleForm17InputChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dob" className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.dob}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    {/* Added Age Field */}
                    <div className="mb-4">
                        <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">Age</label>
                        <input
                            type="text"
                            id="age"
                            name="age"
                            placeholder="Age"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.age}
                            readOnly  // Make it readonly to prevent manual input, since it's calculated
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="employmentDate" className="block text-gray-700 text-sm font-bold mb-2">Employment Date</label>
                        <input
                            type="date"
                            id="employmentDate"
                            name="employmentDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.employmentDate}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="leavingDate" className="block text-gray-700 text-sm font-bold mb-2">Leaving Date</label>
                        <input
                            type="date"
                            id="leavingDate"
                            name="leavingDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.leavingDate}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="reason" className="block text-gray-700 text-sm font-bold mb-2">Reason</label>
                        <input
                            type="text"
                            id="reason"
                            name="reason"
                            placeholder="Enter Reason"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.reason}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="transferredTo" className="block text-gray-700 text-sm font-bold mb-2">Transferred To</label>
                        <input
                            type="text"
                            id="transferredTo"
                            name="transferredTo"
                            placeholder="Enter Transfer Location"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.transferredTo}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="jobNature" className="block text-gray-700 text-sm font-bold mb-2">Job Nature</label>
                        <input
                            type="text"
                            id="jobNature"
                            name="jobNature"
                            placeholder="Enter Job Nature"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.jobNature}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="rawMaterial" className="block text-gray-700 text-sm font-bold mb-2">Raw Material</label>
                        <input
                            type="text"
                            id="rawMaterial"
                            name="rawMaterial"
                            placeholder="Enter Raw Material"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.rawMaterial}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="medicalExamDate" className="block text-gray-700 text-sm font-bold mb-2">Medical Exam Date</label>
                        <input
                            type="date"
                            id="medicalExamDate"
                            name="medicalExamDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.medicalExamDate}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="medicalExamResult" className="block text-gray-700 text-sm font-bold mb-2">Medical Exam Result</label>
                        <input
                            type="text"
                            id="medicalExamResult"
                            name="medicalExamResult"
                            placeholder="Enter Medical Exam Result"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.medicalExamResult}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="suspensionDetails" className="block text-gray-700 text-sm font-bold mb-2">Suspension Details</label>
                        <input
                            type="text"
                            id="suspensionDetails"
                            name="suspensionDetails"
                            placeholder="Enter Suspension Details"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.suspensionDetails}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="recertifiedDate" className="block text-gray-700 text-sm font-bold mb-2">Recertified Date</label>
                        <input
                            type="date"
                            id="recertifiedDate"
                            name="recertifiedDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.recertifiedDate}
                            onChange={handleForm17InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="unfitnessCertificate" className="block text-gray-700 text-sm font-bold mb-2">Unfitness Certificate</label>
                        <input
                            type="text"
                            id="unfitnessCertificate"
                            name="unfitnessCertificate"
                            placeholder="Enter Certificate Details"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form17Data.unfitnessCertificate}
                            onChange={handleForm17InputChange}
                        />
                    </div>

                </div>
                <button type="button" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                        onClick={submitForm17}>
                    Submit Form 17
                </button>
            </div>
        );
    };

    const renderForm38 = () => {
        return (
            <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Form 38 Details</h2>
                {/* Hidden Emp_No Field */}
                <input type="hidden" name="emp_no" value={form38Data.emp_no} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-4">
                        <label htmlFor="serialNumber38" className="block text-gray-700 text-sm font-bold mb-2">Serial
                            Number</label>
                        <input
                            type="text"
                            id="serialNumber38"
                            name="serialNumber"
                            placeholder="Enter Serial Number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.serialNumber}
                            onChange={handleForm38InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="department38" className="block text-gray-700 text-sm font-bold mb-2">Department/Workers</label>
                        <input
                            type="text"
                            id="department38"
                            name="department"
                            placeholder="Enter Department"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.department}
                            onChange={handleForm38InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="workerName38" className="block text-gray-700 text-sm font-bold mb-2">Name of
                            Worker</label>
                        <input
                            type="text"
                            id="workerName38"
                            name="workerName"
                            placeholder="Enter Worker Name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.workerName}
                            onChange={handleForm38InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="sex38" className="block text-gray-700 text-sm font-bold mb-2">Sex</label>
                        <select
                            id="sex38"
                            name="sex"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.sex}
                            onChange={handleForm38InputChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Added Age Field */}
                    <div className="mb-4">
                        <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">Age</label>
                        <input
                            type="text"
                            id="age"
                            name="age"
                            placeholder="Age"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.age}
                            onChange={handleForm38InputChange} //  to allow manual input
                        />
                    </div>


                    <div className="mb-4">
                        <label htmlFor="jobNature38" className="block text-gray-700 text-sm font-bold mb-2">Nature of
                            Job</label>
                        <input
                            type="text"
                            id="jobNature38"
                            name="jobNature"
                            placeholder="Enter Job Nature"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.jobNature}
                            onChange={handleForm38InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="employmentDate38" className="block text-gray-700 text-sm font-bold mb-2">Date of
                            Employment</label>
                        <input
                            type="date"
                            id="employmentDate38"
                            name="employmentDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.employmentDate}
                            onChange={handleForm38InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="eyeExamDate38" className="block text-gray-700 text-sm font-bold mb-2">Date of Eye
                            Exam</label>
                        <input
                            type="date"
                            id="eyeExamDate38"
                            name="eyeExamDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.eyeExamDate}
                            onChange={handleForm38InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="result38" className="block text-gray-700 text-sm font-bold mb-2">Result</label>
                        <input
                            type="text"
                            id="result38"
                            name="result"
                            placeholder="Enter Result"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.result}
                            onChange={handleForm38InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="opthamologistSignature" className="block text-gray-700 text-sm font-bold mb-2">Opthamologist
                            Signature</label>
                        <input
                            type="text"
                            id="opthamologistSignature"
                            name="opthamologistSignature"
                            placeholder="Enter Opthamologist Signature"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.opthamologistSignature}
                            onChange={handleForm38InputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="fmoSignature38" className="block text-gray-700 text-sm font-bold mb-2">FMO
                            Signature</label>
                        <input
                            type="text"
                            id="fmoSignature38"
                            name="fmoSignature"
                            placeholder="Enter FMO Signature"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.fmoSignature}
                            onChange={handleForm38InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="remarks38" className="block text-gray-700 text-sm font-bold mb-2">Remarks</label>
                        <input
                            type="text"
                            id="remarks38"
                            name="remarks"
                            placeholder="Enter remarks"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form38Data.remarks}
                            onChange={handleForm38InputChange}
                        />
                    </div>
                </div>
                <button type="button" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                        onClick={submitForm38}>
                    Submit Form 38
                </button>
            </div>
        );
    };

    const renderForm39 = () => {
        return (
            <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Form 39 Details</h2>
                {/* Hidden Emp_No Field */}
                <input type="hidden" name="emp_no" value={form39Data.emp_no} />
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="mb-4">
                        <label htmlFor="serialNumber39" className="block text-gray-700 text-sm font-bold mb-2">Serial
                            Number</label>
                        <input
                            type="text"
                            id="serialNumber39"
                            name="serialNumber"
                            placeholder="Enter Serial Number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.serialNumber}
                            onChange={handleForm39InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="workerName39" className="block text-gray-700 text-sm font-bold mb-2">Name of
                            Worker</label>
                        <input
                            type="text"
                            id="workerName39"
                            name="workerName"
                            placeholder="Enter Worker Name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.workerName}
                            onChange={handleForm39InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="sex39" className="block text-gray-700 text-sm font-bold mb-2">Sex</label>
                        <select
                            id="sex39"
                            name="sex"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.sex}
                            onChange={handleForm39InputChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Added Age Field */}
                    <div className="mb-4">
                    <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">Age</label>
                        <input
                            type="text"
                            id="age"
                            name="age"
                            placeholder="Age"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.age}
                            onChange={handleForm39InputChange} // allow manual entry
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="proposedEmploymentDate39" className="block text-gray-700 text-sm font-bold mb-2">Date
                            of Proposed Employment</label>
                        <input
                            type="date"
                            id="proposedEmploymentDate39"
                            name="proposedEmploymentDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.proposedEmploymentDate}
                            onChange={handleForm39InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="jobOccupation39" className="block text-gray-700 text-sm font-bold mb-2">Job
                            Occupation</label>
                        <input
                            type="text"
                            id="jobOccupation39"
                            name="jobOccupation"
                            placeholder="Enter Job Nature"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.jobOccupation}
                            onChange={handleForm39InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="rawMaterialHandled39" className="block text-gray-700 text-sm font-bold mb-2">Raw of
                            Medical or by Product Proposed to be Handled</label>
                        <input
                            type="text"
                            id="rawMaterialHandled39"
                            name="rawMaterialHandled"
                            placeholder="Enter Raw Material"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.rawMaterialHandled}
                            onChange={handleForm39InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="medicalExamDate39" className="block text-gray-700 text-sm font-bold mb-2">Date of
                            Medical Examination by Certifying Surgeon</label>
                        <input
                            type="date"
                            id="medicalExamDate39"
                            name="medicalExamDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.medicalExamDate}
                            onChange={handleForm39InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="medicalExamResult39" className="block text-gray-700 text-sm font-bold mb-2">Result
                            of Medical Examination</label>
                        <input
                            type="text"
                            id="medicalExamResult39"
                            name="medicalExamResult"
                            placeholder="Enter Medical Exam Result"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.medicalExamResult}
                            onChange={handleForm39InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="certifiedFit39" className="block text-gray-700 text-sm font-bold mb-2">Whether
                            Certified Fit or Unit or Proposed Employment</label>
                        <select
                            id="certifiedFit39"
                            name="certifiedFit"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.certifiedFit}
                            onChange={handleForm39InputChange}
                        >
                            <option value="">Select Option</option>
                            <option value="fit">Fit</option>
                            <option value="unfit">Unfit</option>
                            <option value="conditional">Conditional</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="certifyingSurgeonSignature"
                               className="block text-gray-700 text-sm font-bold mb-2">Signature of the Certifying
                            Surgeon (With Name in Capital Letters)</label>
                        <input
                            type="text"
                            id="certifyingSurgeonSignature"
                            name="certifyingSurgeonSignature"
                            placeholder="Enter Signature of the Certifying Surgeon"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.certifyingSurgeonSignature}
                            onChange={handleForm39InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="departmentSection39" className="block text-gray-700 text-sm font-bold mb-2">If
                            Employment is Given Specify the Department/ Section with Works Number</label>
                        <input
                            type="text"
                            id="departmentSection39"
                            name="departmentSection"
                            placeholder="Enter Department/Section"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form39Data.departmentSection}
                            onChange={handleForm39InputChange}
                        />
                    </div>
                </div>
                <button type="button" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                        onClick={submitForm39}>
                    Submit Form 39
                </button>
            </div>
        );
    };

    const renderForm40 = () => {
        return (
            <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Form 40 Details</h2>
                {/* Hidden Emp_No Field */}
                <input type="hidden" name="emp_no" value={form40Data.emp_no} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-4">
                        <label htmlFor="serialNumber40" className="block text-gray-700 text-sm font-bold mb-2">Serial
                            Number</label>
                        <input
                            type="text"
                            id="serialNumber40"
                            name="serialNumber"
                            placeholder="Enter Serial Number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.serialNumber}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dateOfEmployment40" className="block text-gray-700 text-sm font-bold mb-2">Date of
                            Employment</label>
                        <input
                            type="date"
                            id="dateOfEmployment40"
                            name="dateOfEmployment"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.dateOfEmployment}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="workerName40" className="block text-gray-700 text-sm font-bold mb-2">Name of
                            Worker</label>
                        <input
                            type="text"
                            id="workerName40"
                            name="workerName"
                            placeholder="Enter Worker Name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.workerName}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="sex40" className="block text-gray-700 text-sm font-bold mb-2">Sex</label>
                        <select
                            id="sex40"
                            name="sex"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.sex}
                            onChange={handleForm40InputChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                      {/* Added Age Field */}
                      <div className="mb-4">
                          <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">Age</label>
                          <input
                              type="text"
                              id="age"
                              name="age"
                              placeholder="Age"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              value={form40Data.age}
                              onChange={handleForm40InputChange} // allow manual entry

                          />
                      </div>
                    <div className="mb-4">
                        <label htmlFor="sonWifeDaughterOf40" className="block text-gray-700 text-sm font-bold mb-2">Son of
                            / Wife of / Daughter of</label>
                        <input
                            type="text"
                            id="sonWifeDaughterOf40"
                            name="sonWifeDaughterOf"
                            placeholder="Enter Parent/Spouse Name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.sonWifeDaughterOf}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="natureOfJob40" className="block text-gray-700 text-sm font-bold mb-2">Nature of
                            Job</label>
                        <input
                            type="text"
                            id="natureOfJob40"
                            name="natureOfJob"
                            placeholder="Enter Job Nature"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.natureOfJob}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="urineResult40" className="block text-gray-700 text-sm font-bold mb-2">Urine</label>
                        <input
                            type="text"
                            id="urineResult40"
                            name="urineResult"
                            placeholder="Enter Urine Result"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.urineResult}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="bloodResult40" className="block text-gray-700 text-sm font-bold mb-2">Blood</label>
                        <input
                            type="text"
                            id="bloodResult40"
                            name="bloodResult"
                            placeholder="Enter Blood Result"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.bloodResult}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="fecesResult40" className="block text-gray-700 text-sm font-bold mb-2">Feces</label>
                        <input
                            type="text"
                            id="fecesResult40"
                            name="fecesResult"
                            placeholder="Enter Feces Result"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.fecesResult}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="xrayResult40" className="block text-gray-700 text-sm font-bold mb-2">X-ray test, if
                            any done</label>
                        <input
                            type="text"
                            id="xrayResult40"
                            name="xrayResult"
                            placeholder="Enter X-ray Result"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.xrayResult}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="otherExamResult40" className="block text-gray-700 text-sm font-bold mb-2">Any other
                            examination / test done</label>
                        <input
                            type="text"
                            id="otherExamResult40"
                            name="otherExamResult"
                            placeholder="Enter Other Exam Result"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.otherExamResult}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="deworming40" className="block text-gray-700 text-sm font-bold mb-2">Deworming</label>
                        <input
                            type="text"
                            id="deworming40"
                            name="deworming"
                            placeholder="Enter Deworming Details"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.deworming}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="typhoidVaccinationDate40" className="block text-gray-700 text-sm font-bold mb-2">Typhoid
                            Vaccination Date</label>
                        <input
                            type="date"
                            id="typhoidVaccinationDate40"
                            name="typhoidVaccinationDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.typhoidVaccinationDate}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="signatureOfFMO40" className="block text-gray-700 text-sm font-bold mb-2">Signature
                            of FMO</label>
                        <input
                            type="text"
                            id="signatureOfFMO40"
                            name="signatureOfFMO"
                            placeholder="Enter Signature of FMO"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.signatureOfFMO}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="remarks40" className="block text-gray-700 text-sm font-bold mb-2">Remarks</label>
                        <input
                            type="text"
                            id="remarks40"
                            name="remarks"
                            placeholder="Enter remarks"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form40Data.remarks}
                            onChange={handleForm40InputChange}
                        />
                    </div>
                </div>
                <button type="button" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                        onClick={submitForm40}>
                    Submit Form 40
                </button>
            </div>
        );
    };

    const renderForm27 = () => {
        return (
            <div className="bg-blue-100 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Form 27 Details</h2>
                {/* Hidden Emp_No Field */}
                <input type="hidden" name="emp_no" value={form27Data.emp_no} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-4">
                        <label htmlFor="serialNumber27" className="block text-gray-700 text-sm font-bold mb-2">Serial
                            Number</label>
                        <input
                            type="text"
                            id="serialNumber27"
                            name="serialNumber"
                            placeholder="Enter Serial Number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form27Data.serialNumber}
                            onChange={handleForm27InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="date27" className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                        <input
                            type="date"
                            id="date27"
                            name="date"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form27Data.date}
                            onChange={handleForm27InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="department27" className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                        <input
                            type="text"
                            id="department27"
                            name="department"
                            placeholder="Enter Department"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form27Data.department}
                            onChange={handleForm27InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="nameOfWorks27" className="block text-gray-700 text-sm font-bold mb-2">Name of
                            Works</label>
                        <input
                            type="text"
                            id="nameOfWorks27"
                            name="nameOfWorks"
                            placeholder="Enter Name of Works"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form27Data.nameOfWorks}
                            onChange={handleForm27InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="sex27" className="block text-gray-700 text-sm font-bold mb-2">Sex</label>
                        <select
                            id="sex27"
                            name="sex"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form27Data.sex}
                            onChange={handleForm27InputChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                      {/* Added Age Field */}
                      <div className="mb-4">
                          <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">Age</label>
                          <input
                              type="text"
                              id="age"
                              name="age"
                              placeholder="Age"
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              value={form27Data.age}
                              onChange={handleForm27InputChange} // allow manual entry

                          />
                      </div>

                    <div className="mb-4">
                        <label htmlFor="dateOfBirth27" className="block text-gray-700 text-sm font-bold mb-2">Date of
                            Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth27"
                            name="dateOfBirth"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form27Data.dateOfBirth}
                            onChange={handleForm27InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="nameOfTheFather27" className="block text-gray-700 text-sm font-bold mb-2">Name of
                            the Father</label>
                        <input
                            type="text"
                            id="nameOfTheFather27"
                            name="nameOfTheFather"
                            placeholder="Enter Father's Name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form27Data.nameOfTheFather}
                            onChange={handleForm27InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="natureOfJobOrOccupation27"
                               className="block text-gray-700 text-sm font-bold mb-2">Nature of Job or
                            Occupation</label>
                        <input
                            type="text"
                            id="natureOfJobOrOccupation27"
                            name="natureOfJobOrOccupation"
                            placeholder="Enter Job Nature"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form27Data.natureOfJobOrOccupation}
                            onChange={handleForm27InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="descriptiveMarks27" className="block text-gray-700 text-sm font-bold mb-2">Descriptive
                            Marks</label>
                        <input
                            type="text"
                            id="descriptiveMarks27"
                            name="descriptiveMarks"
                            placeholder="Enter Descriptive Marks"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form27Data.descriptiveMarks}
                            onChange={handleForm27InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="signatureOfCertifyingSurgeon27"
                               className="block text-gray-700 text-sm font-bold mb-2">Signature of Certifying
                            Surgeon</label>
                        <input
                            type="text"
                            id="signatureOfCertifyingSurgeon27"
                            name="signatureOfCertifyingSurgeon"
                            placeholder="Enter Signature of Certifying Surgeon"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form27Data.signatureOfCertifyingSurgeon}
                            onChange={handleForm27InputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="signatureOfFMO27" className="block text-gray-700 text-sm font-bold mb-2">Signature
                            of FMO</label>
                        <input
                            type="text"
                            id="signatureOfFMO27"
                            name="signatureOfFMO"
                            placeholder="Enter Signature of FMO"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={form27Data.signatureOfFMO}
                            onChange={handleForm27InputChange}
                        />
                    </div>
                </div>
                <button type="button" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                        onClick={submitForm27}>
                    Submit Form 27
                </button>
            </div>
        );
    };

    // Function to get the CSRF token from the cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const submitForm17 = async () => {
        try {
            const response = await fetch(FORM17_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify(form17Data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to submit Form 17: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            alert("Form 17 submitted successfully!");
            setForm17Data({
                emp_no: data[0]?.emp_no || '',
                dept: '',
                worksNumber: '',
                workerName: '',
                sex: 'male',
                dob: '',
                age: '',
                employmentDate: '',
                leavingDate: '',
                reason: '',
                transferredTo: '',
                jobNature: '',
                rawMaterial: '',
                medicalExamDate: '',
                medicalExamResult: '',
                suspensionDetails: '',
                recertifiedDate: '',
                unfitnessCertificate: '',
                surgeonSignature: '',
                fmoSignature: ''
            });
            setSelectedStatutoryForms(selectedStatutoryForms.filter((option) => option !== "Form 17")); // Unselect form after submission
        } catch (error) {
            alert(error.message);
        }
    };

    const submitForm38 = async () => {
        try {
            const response = await fetch(FORM38_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify(form38Data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to submit Form 38: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            alert("Form 38 submitted successfully!");
            setForm38Data({
                emp_no: data[0]?.emp_no || '',
                serialNumber: '',
                department: '',
                workerName: '',
                sex: 'male',
                age: '',
                jobNature: '',
                employmentDate: '',
                eyeExamDate: '',
                result: '',
                opthamologistSignature: '',
                fmoSignature: '',
                remarks: ''
            });
            setSelectedStatutoryForms(selectedStatutoryForms.filter((option) => option !== "Form 38"));
        } catch (error) {
            alert(error.message);
        }
    };

    const submitForm39 = async () => {
        try {
            const response = await fetch(FORM39_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify(form39Data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to submit Form 39: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            alert("Form 39 submitted successfully!");
            setForm39Data({
                emp_no: data[0]?.emp_no || '',
                serialNumber: '',
                workerName: '',
                sex: 'male',
                age: '',
                proposedEmploymentDate: '',
                jobOccupation: '',
                rawMaterialHandled: '',
                medicalExamDate: '',
                medicalExamResult: '',
                certifiedFit: '',
                certifyingSurgeonSignature: '',
                departmentSection: ''
            });
            setSelectedStatutoryForms(selectedStatutoryForms.filter((option) => option !== "Form 39"));
        } catch (error) {
            alert(error.message);
        }
    };

    const submitForm40 = async () => {
        try {
            const response = await fetch(FORM40_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"),
                },
                body: JSON.stringify(form40Data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to submit Form 40: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            alert("Form 40 submitted successfully!");
            setForm40Data({
                emp_no: data[0]?.emp_no || '',
                serialNumber: '',
                dateOfEmployment: '',
                workerName: '',
                sex: 'male',
                age: '',
                sonWifeDaughterOf: '',
                natureOfJob: '',
                urineResult: '',
                bloodResult: '',
                fecesResult: '',
                xrayResult: '',
                otherExamResult: '',
                deworming: '',
                typhoidVaccinationDate: '',
                signatureOfFMO: '',
                remarks: ''
            });
            setSelectedStatutoryForms(selectedStatutoryForms.filter((option) => option !== "Form 40"));
        } catch (error) {
            alert(error.message);
        }
      };
  
      const submitForm27 = async () => {
          try {
              const response = await fetch(FORM27_URL, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      "X-CSRFToken": getCookie("csrftoken"),
                  },
                  body: JSON.stringify(form27Data),
              });
  
              if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(`Failed to submit Form 27: ${response.status} - ${JSON.stringify(errorData)}`);
              }
  
              alert("Form 27 submitted successfully!");
              setForm27Data({
                  emp_no: data[0]?.emp_no || '',
                  serialNumber: '',
                  date: '',
                  department: '',
                  nameOfWorks: '',
                  sex: 'male',
                  age: '',
                  dateOfBirth: '',
                  nameOfTheFather: '',
                  natureOfJobOrOccupation: '',
                  signatureOfFMO: '',
                  descriptiveMarks: '',
                  signatureOfCertifyingSurgeon: ''
              });
              setSelectedStatutoryForms(selectedStatutoryForms.filter((option) => option !== "Form 27"));
          } catch (error) {
              alert(error.message);
          }
      };
  
      return (
          <div className="bg-white min-h-screen p-6 relative">
              <h1 className="text-3xl font-bold mb-8">Fitness</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {["tremors", "romberg_test", "acrophobia", "trendelenberg_test"].map((test) => (
                      <div key={test} className="bg-blue-100 p-6 rounded-lg shadow-md">
                          <h2 className="text-lg font-semibold mb-4">{test.replace("_", " ")}</h2>
                          <div className="space-y-2">
                              {["positive", "negative"].map((value) => (
                                  <label key={value} className="flex items-center space-x-2">
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
                              <div key={index}
                                   className="flex items-center p-2 border border-gray-300 rounded-md bg-gray-100">
                                  <span className="mr-2">{option}</span>
                                  <button className="text-red-500 hover:underline"
                                          onClick={() => handleRemoveSelected(option)}>
                                      ×
                                  </button>
                              </div>
                          ))
                      ) : (
                          <p className="text-sm text-gray-500">No options selected.</p>
                      )}
                  </div>
  
                  {accessLevel === "doctor" && (
                      <>
  
                          {/* Multi-Select Dropdown for Statutory Forms */}
                          
  
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
                                              <div key={index}
                                                   className="flex items-center p-2 border border-gray-300 rounded-md bg-gray-100">
                                                  <span className="mr-2">{option}</span>
                                                  <button className="text-red-500 hover:underline"
                                                          onClick={() => handleRemoveConditionalSelected(option)}>
                                                      ×
                                                  </button>
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
                          <div className="mt-8">
                              <h2 className="text-lg font-semibold mb-4">Statutory Forms (Select Multiple)</h2>
                              <select
                                  className="form-select block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                                  onChange={handleStatutorySelectChange}
                              >
                                  
                                  {statutoryOptions.map((option, index) => (
                                      <option key={index} value={option}>
                                          {option}
                                      </option>
                                  ))}
                              </select>
  
                              {/* Display Selected Statutory Forms */}
                              <div className="flex flex-wrap gap-2 mt-4">
                                  {selectedStatutoryForms.length > 0 ? (
                                      selectedStatutoryForms.map((option, index) => (
                                          <div key={index}
                                               className="flex items-center p-2 border border-gray-300 rounded-md bg-gray-100">
                                              <span className="mr-2">{option}</span>
                                              <button className="text-red-500 hover:underline"
                                                      onClick={() => handleRemoveStatutorySelected(option)}>
                                                  ×
                                              </button>
                                          </div>
                                      ))
                                  ) : (
                                      <p className="text-sm text-gray-500">No forms selected.</p>
                                  )}
                              </div>
                          </div>
                          {/* Conditionally render the forms directly */}
                          {selectedStatutoryForms.length > 0 && (
                              <div className="flex flex-col gap-4 m-16">
                                  {selectedStatutoryForms.includes("Form 17") && renderForm17()}
                                  {selectedStatutoryForms.includes("Form 38") && renderForm38()}
                                  {selectedStatutoryForms.includes("Form 39") && renderForm39()}
                                  {selectedStatutoryForms.includes("Form 40") && renderForm40()}
                                  {selectedStatutoryForms.includes("Form 27") && renderForm27()}
                              </div>
                          )}
                      </>
                  )}
  
                  {/* Submit Button */}
                  <div className="absolute bottom-6 right-6">
                      <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600"
                              onClick={handleFitnessSubmit}>
                          Submit
                      </button>
                  </div>
              </div>
          </div>
      );
  };
  
  export default FitnessPage;




  