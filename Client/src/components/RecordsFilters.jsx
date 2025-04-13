import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Sidebar from "./Sidebar"; // Assuming Sidebar component exists and is correctly imported
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- Filter Section Definitions ---
const filterSections = [
    { id: "employementstatus", label: "Employment Status" },
    { id: "personaldetails", label: "Personal Details" },
    { id: "employementdetails", label: "Employment Details" },
    { id: "medicalhistory", label: "Medical History" },
    { id: "vaccination", label: "Vaccination" },
    { id: "purpose", label: "Purpose Filter" },
    { id: "vitals", label: "Vitals" },
    { id: "investigations", label: "Investigations" },
    { id: "diagnosis", label: "Diagnosis and Notable Remarks" },
    { id: "fitness", label: "Fitness" },
    { id: "prescriptions", label: "Prescriptions" },
    { id: "referrals", label: "Referrals" },
    { id: "statutoryforms", label: "Statutory Forms" },
];

// --- Helper function to calculate age ---
const calculateAge = (dobString) => {
    if (!dobString) return '-';
    try {
        const birthDate = new Date(dobString);
        if (isNaN(birthDate.getTime())) { return '-'; }
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
        return age >= 0 ? age : '-';
    } catch (error) {
        console.error("Error calculating age from DOB:", dobString, error);
        return '-';
    }
};

// --- Main Component ---
const RecordsFilters = () => {
    const navigate = useNavigate();
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [employees, setEmployees] = useState([]); // Raw data from API
    const [filteredEmployees, setFilteredEmployees] = useState([]); // Data displayed in table
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(""); // For Employee/Contractor/Visitor filter
    const [cd, setcd] = useState([]); // Diagnosis options
    const [remarks, setremarks] = useState([]); // Diagnosis options
    // State for referral options
    const [specialityOptions, setSpecialityOptions] = useState([]);
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [hospitalOptions, setHospitalOptions] = useState([]);

    // --- Fetch Initial Employee Data and Filter Options ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch main employee data
                const response = await axios.post("http://localhost:8000/userData");
                const data = response.data?.data;

                if (Array.isArray(data)) {
                    setEmployees(data);
                    setFilteredEmployees(data);
                    console.log("Fetched Employee Data:", data);
                } else {
                    console.error("Fetched employee data is not an array:", data);
                    setEmployees([]);
                    setFilteredEmployees([]);
                }

                // Fetch summary/notes/consultation data for filter options
                const summaryResponse = await axios.post("http://localhost:8000/get_notes/");
                const summaryData = summaryResponse?.data?.data; // For Diagnosis
                const consultationData = summaryResponse?.data?.consultation; // For Referrals
                console.log("Fetched /get_notes/ response:", summaryResponse.data);

                // --- Process Diagnosis Options ---
                if (Array.isArray(summaryData)) {
                    const uniqueCDs = new Set();
                    const uniqueRemarks = new Set();
                    summaryData.forEach(element => {
                        if (element?.communicable_disease) {
                            uniqueCDs.add(element.communicable_disease.trim());
                        }
                        if (element?.remarks) {
                            uniqueRemarks.add(element.remarks.trim());
                        }
                    });
                    const cdArray = Array.from(uniqueCDs).filter(item => item !== '');
                    const remarksArray = Array.from(uniqueRemarks).filter(item => item !== '');
                    setcd(cdArray);
                    setremarks(remarksArray);
                    console.log("Populated CD options:", cdArray);
                    console.log("Populated Remarks options:", remarksArray);
                } else {
                    console.error("Fetched summary data (for diagnosis) is not an array:", summaryData);
                    setcd([]);
                    setremarks([]);
                }

                // --- Process Referral Options ---
                if (Array.isArray(consultationData)) {
                    const uniqueSpecialities = new Set();
                    const uniqueDoctors = new Set();
                    const uniqueHospitals = new Set();
                    consultationData.forEach(element => {
                        // Use 'speaciality' key from sample data (note the typo)
                        if (element?.speaciality) {
                            uniqueSpecialities.add(element.speaciality.trim());
                        }
                        if (element?.doctor_name) {
                            uniqueDoctors.add(element.doctor_name.trim());
                        }
                        if (element?.hospital_name) {
                            uniqueHospitals.add(element.hospital_name.trim());
                        }
                    });
                    const specialityArray = Array.from(uniqueSpecialities).filter(item => item !== '');
                    const doctorArray = Array.from(uniqueDoctors).filter(item => item !== '');
                    const hospitalArray = Array.from(uniqueHospitals).filter(item => item !== '');

                    setSpecialityOptions(specialityArray);
                    setDoctorOptions(doctorArray);
                    setHospitalOptions(hospitalArray);

                    console.log("Populated Speciality options:", specialityArray);
                    console.log("Populated Doctor options:", doctorArray);
                    console.log("Populated Hospital options:", hospitalArray);

                } else {
                     console.error("Fetched consultation data (for referrals) is not an array:", consultationData);
                     setSpecialityOptions([]);
                     setDoctorOptions([]);
                     setHospitalOptions([]);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                setEmployees([]);
                setFilteredEmployees([]);
                setcd([]);
                setremarks([]);
                setSpecialityOptions([]);
                setDoctorOptions([]);
                setHospitalOptions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Runs once on mount

    // --- Filter Selection Handlers ---
    const handleRoleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleFilterClick = (sectionId) => {
        setSelectedSection(sectionId);
    };

    // --- Filter Management Functions ---
    const removeFilter = (filterToRemove) => {
        setSelectedFilters((prevFilters) =>
            prevFilters.filter((item) => JSON.stringify(item) !== JSON.stringify(filterToRemove)) // More robust comparison
        );
    };

    const addFilter = (formData) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = [...prevFilters];
            Object.entries(formData).forEach(([key, value]) => {
                if (value === "" || value === null || value === undefined || (typeof value === 'object' && !Array.isArray(value) && value !== null && Object.keys(value).length === 0)) return;

                let filterKey = key;
                let filterObject = { [key]: value };

                // Create Unique Keys for Complex Filters
                if (key === "param" && typeof value === 'object' && value.param) {
                    filterKey = `param_${value.param}`; filterObject = { [filterKey]: value };
                } else if (key === "investigation" && typeof value === 'object' && value.form && value.param) {
                    filterKey = `investigation_${value.form}_${value.param}`; filterObject = { [filterKey]: value };
                } else if (key === "familyCondition" && typeof value === 'object' && value.condition && value.relation) {
                    filterKey = `family_${value.condition}_${value.relation}`; filterObject = { [filterKey]: value };
                } else if (key === "referrals" && typeof value === 'object') { // Added uniqueness for referrals
                    filterKey = `referrals_${JSON.stringify(value)}`; filterObject = { [filterKey]: value };
                } else if (key === "purpose" && typeof value === 'object') { // Added uniqueness for purpose
                    filterKey = `purpose_${JSON.stringify(value)}`; filterObject = { [filterKey]: value };
                } else if (key === "fitness" && typeof value === 'object') { // Added uniqueness for fitness
                    filterKey = `fitness_${JSON.stringify(value)}`; filterObject = { [filterKey]: value };
                } else if (key === "statutoryFormFilter" && typeof value === 'object') { // Added uniqueness for statutory forms
                    filterKey = `statutory_${value.formType}_${value.from}_${value.to}`; filterObject = { [filterKey]: value };
                } else if (key.startsWith('personal_')) { // For personal conditions like personal_HTN
                    filterKey = key; filterObject = { [filterKey]: value };
                }
                // Other simple key-value filters remain as they are
                 else {
                    filterObject = { [key]: value }; // Key is already unique for simple filters
                 }

                const existingIndex = updatedFilters.findIndex( f => Object.keys(f)[0] === filterKey );

                if (existingIndex !== -1) { updatedFilters[existingIndex] = filterObject; }
                else { updatedFilters.push(filterObject); }
            });
             setSelectedSection(null);
            return updatedFilters;
        });
    };


    // --- Core Filtering Logic ---
    const applyFiltersToData = () => {
        console.log("Applying filters:", selectedFilters);
        console.log("Selected Role:", selectedRole);

        let results = [...employees];

        // 1. Filter by Role
        if (selectedRole) {
            results = results.filter(emp => emp.type && emp.type.toLowerCase() === selectedRole.toLowerCase());
        }

        // 2. Filter by selected criteria
        const filtersMap = selectedFilters.reduce((acc, filter) => {
            const key = Object.keys(filter)[0]; // Use the potentially modified filterKey
            acc[key] = filter[key];
            return acc;
        }, {});

        results = results.filter(employee => {
            for (const key in filtersMap) {
                const value = filtersMap[key];

                // --- Personal Details ---
                if (key === 'sex') { if (!employee.sex || employee.sex?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'bloodgrp') { if (employee.bloodgrp !== value) return false; }
                else if (key === 'marital_status') { if (!employee.marital_status || employee.marital_status?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'ageFrom') { const age = calculateAge(employee.dob); if (age === '-' || age < parseInt(value, 10)) return false; }
                else if (key === 'ageTo') { const age = calculateAge(employee.dob); if (age === '-' || age > parseInt(value, 10)) return false; }

                // --- Employment Details ---
                else if (key === 'designation') { if (!employee.designation || employee.designation?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'department') { if (!employee.department || employee.department?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'employer') { if (!employee.employer || employee.employer?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'moj') { if (!employee.moj || employee.moj?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'job_nature') { if (!employee.job_nature || employee.job_nature?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'doj') { if (employee.doj !== value) return false; }

                // --- Employment Status ---
                 else if (key === 'status') {
                     if (!employee.employee_status || employee.employee_status.toLowerCase() !== value.toLowerCase()) return false;
                     if (value.toLowerCase() === 'transferred to' && filtersMap.transferred_to) {
                         if (!employee.transfer_details || employee.transfer_details.toLowerCase() !== filtersMap.transferred_to.toLowerCase()) return false;
                     }
                     else if (value.toLowerCase() !== 'transferred to' && (filtersMap.from || filtersMap.to)) {
                         if (!employee.since_date) return false;
                         try {
                             const employeeStatusDate = new Date(employee.since_date); employeeStatusDate.setHours(0,0,0,0);
                             if (isNaN(employeeStatusDate.getTime())) { console.warn(`Invalid since_date: ${employee.since_date}`); return false; }
                             let dateMatch = true;
                             if (filtersMap.from) { const filterFrom = new Date(filtersMap.from); filterFrom.setHours(0,0,0,0); if (isNaN(filterFrom.getTime()) || employeeStatusDate < filterFrom) dateMatch = false; }
                             if (dateMatch && filtersMap.to) { const filterTo = new Date(filtersMap.to); filterTo.setHours(0,0,0,0); if (isNaN(filterTo.getTime()) || employeeStatusDate > filterTo) dateMatch = false; }
                              if (!dateMatch) return false;
                         } catch(e) { console.error(`Error processing date:`, e); return false; }
                     }
                 }
                 // --- Vitals ---
                else if (key.startsWith('param_')) {
                    const filterData = value; // value is { param, from, to, value: categoryValue }
                    const vitalParam = filterData.param;
                    if (!employee.vitals || employee.vitals[vitalParam] === undefined || employee.vitals[vitalParam] === null || employee.vitals[vitalParam] === '') return false;
                    if (filterData.value) { // BMI category
                         if (vitalParam !== 'bmi') { console.warn(`Category filtering for vital '${vitalParam}' not implemented.`); return false; }
                         const bmiValue = parseFloat(employee.vitals.bmi);
                         if (isNaN(bmiValue)) return false;
                         let empCategory = '';
                         if (bmiValue < 18.5) empCategory = 'Under weight'; else if (bmiValue < 25) empCategory = 'Normal'; else if (bmiValue < 30) empCategory = 'Over weight'; else if (bmiValue < 35) empCategory = 'Obese'; else empCategory = 'Extremely Obese';
                         if(empCategory.toLowerCase() !== filterData.value.toLowerCase()) return false;
                    } else { // Range
                        const vitalValue = parseFloat(employee.vitals[vitalParam]);
                        const fromValue = parseFloat(filterData.from); const toValue = parseFloat(filterData.to);
                        if (isNaN(vitalValue) || isNaN(fromValue) || isNaN(toValue) || vitalValue < fromValue || vitalValue > toValue) return false;
                    }
                }
                // --- Investigations ---
                else if (key.startsWith('investigation_')) {
                    const filterData = value; // value is { form, param, from, to, status }
                    const investigationData = employee[filterData.form]?.[filterData.param];
                    if (investigationData === undefined || investigationData === null || investigationData === '') return false;
                    if (filterData.from && filterData.to) {
                        const numVal = parseFloat(investigationData); const fromVal = parseFloat(filterData.from); const toVal = parseFloat(filterData.to);
                        if (isNaN(numVal) || isNaN(fromVal) || isNaN(toVal) || numVal < fromVal || numVal > toVal) return false;
                    }
                    if (filterData.status) {
                        const statusField = `${filterData.param}_status`; const invStatus = employee[filterData.form]?.[statusField];
                        if (!invStatus || invStatus.toLowerCase() !== filterData.status.toLowerCase()) return false;
                    }
                }
                // --- Fitness ---
                else if (key.startsWith('fitness_')) { // Check the unique key
                    const filterData = value; // value is the fitness form data object
                    if (!employee.fitnessassessment) return false;
                    const fitnessMatch = Object.entries(filterData).every(([fitnessKey, fitnessValue]) =>
                        employee.fitnessassessment[fitnessKey]?.toLowerCase() === fitnessValue?.toLowerCase()
                    );
                    if (!fitnessMatch) return false;
                }
                // --- Medical History ---
                 else if (['smoking', 'alcohol', 'paan', 'diet'].includes(key)) {
                     const habitData = employee.msphistory?.personal_history?.[key]; if (!habitData || habitData.yesNo?.toLowerCase() !== value.toLowerCase()) return false;
                 }
                 else if (key.startsWith('personal_')) {
                     const condition = key.substring('personal_'.length); const conditionData = employee.msphistory?.medical_data?.[condition];
                     const hasCond = conditionData && Array.isArray(conditionData.children) && conditionData.children.length > 0;
                     if ((value === 'Yes' && !hasCond) || (value === 'No' && hasCond)) return false;
                 }
                 else if (key.startsWith('family_')) {
                     const filterData = value; // { condition, status, relation }
                     const relations = employee.msphistory?.conditions?.[filterData.condition];
                     const relationPresent = Array.isArray(relations) && relations.some(r => r.toLowerCase() === filterData.relation.toLowerCase());
                     if ((filterData.status === 'Yes' && !relationPresent) || (filterData.status === 'No' && relationPresent)) return false;
                 }
                 else if (['drugAllergy', 'foodAllergy', 'otherAllergies'].includes(key)) {
                     let allergyType = ''; if (key === 'drugAllergy') allergyType = 'drug'; else if (key === 'foodAllergy') allergyType = 'food'; else allergyType = 'others';
                     const allergyData = employee.msphistory?.allergy_fields?.[allergyType]; if (!allergyData || allergyData.yesNo?.toLowerCase() !== value.toLowerCase()) return false;
                 }
                 else if (key === 'surgicalHistory') {
                     const hasSurg = employee.msphistory?.surgical_history && Array.isArray(employee.msphistory.surgical_history.children) && employee.msphistory.surgical_history.children.length > 0;
                     if ((value === 'Yes' && !hasSurg) || (value === 'No' && hasSurg)) return false;
                 }
                // --- Vaccination ---
                else if (['disease', 'vaccine', 'vaccine_status'].includes(key)) {
                     if (!employee.vaccination?.vaccination || !Array.isArray(employee.vaccination.vaccination)) return false;
                     const match = employee.vaccination.vaccination.some(vac => {
                         if (key === 'disease') return vac.disease_name?.toLowerCase() === value.toLowerCase();
                         if (key === 'vaccine') return vac.vaccine_name?.toLowerCase() === value.toLowerCase();
                         if (key === 'vaccine_status') return vac.status?.toLowerCase() === value.toLowerCase();
                         return false;
                     });
                     if (!match) return false;
                 }
                // --- Purpose ---
                else if (key.startsWith('purpose_')) {
                    const filterData = value; // { type_of_visit, register, specificCategory, fromDate, toDate }
                    if (filterData.type_of_visit && (employee.type_of_visit?.toLowerCase() !== filterData.type_of_visit.toLowerCase())) return false;
                    if (filterData.register && (employee.register?.toLowerCase() !== filterData.register.toLowerCase())) return false;
                    if (filterData.specificCategory && (employee.purpose?.toLowerCase() !== filterData.specificCategory.toLowerCase())) return false;
                    if (filterData.fromDate || filterData.toDate) {
                        if (!employee.entry_date) return false;
                        try {
                            const entryDate = new Date(employee.entry_date); entryDate.setHours(0,0,0,0); if (isNaN(entryDate.getTime())) { console.warn(`Invalid entry_date: ${employee.entry_date}`); return false; }
                            let dateCheck = true;
                            if (filterData.fromDate) { const from = new Date(filterData.fromDate); from.setHours(0,0,0,0); if (isNaN(from.getTime()) || entryDate < from) dateCheck = false; }
                            if (dateCheck && filterData.toDate) { const to = new Date(filterData.toDate); to.setHours(0,0,0,0); if (isNaN(to.getTime()) || entryDate > to) dateCheck = false; }
                             if (!dateCheck) return false;
                        } catch (e) { console.error("Date parsing error:", e); return false; }
                    }
                }
                // --- Diagnosis ---
                 else if (key === 'disease') { // Check 'disease' key from Diagnosis component
                     if (!employee?.significant_notes?.communicable_disease || employee.significant_notes.communicable_disease.toLowerCase() !== value.toLowerCase()) return false;
                 }
                 else if (key === 'notable_remarks') { // Check 'notable_remarks' key from Diagnosis component
                     if (!employee?.significant_notes?.remarks || employee.significant_notes.remarks.toLowerCase() !== value.toLowerCase()) return false;
                 }
                // --- Prescriptions ---
                 else if (['tablets', 'injections', 'creams', 'others'].includes(key)) {
                      if (!employee.prescription || !employee.prescription[key] || employee.prescription[key].toLowerCase() !== value.toLowerCase()) return false;
                 }
                // --- Referrals ---
                 else if (key.startsWith('referrals_')) {
                    const filterData = value; // { referred, speciality, hospitalName, doctorName }
                    const consultationData = employee.consultation;
                    if (filterData.referred === 'No') {
                        if (consultationData && consultationData.referral?.toLowerCase() === 'yes') return false;
                    } else {
                        if (!consultationData || consultationData.referral?.toLowerCase() !== 'yes') return false;
                        if (filterData.speciality && consultationData.speaciality?.toLowerCase() !== filterData.speciality.toLowerCase()) return false;
                        if (filterData.hospitalName && consultationData.hospital_name?.toLowerCase() !== filterData.hospitalName.toLowerCase()) return false;
                        if (filterData.doctorName && consultationData.doctor_name?.toLowerCase() !== filterData.doctorName.toLowerCase()) return false;
                    }
                }
                // --- Statutory Forms ---
                else if (key.startsWith('statutory_')) {
                    const filterData = value; // { formType, from, to }
                    const formKey = filterData.formType.toLowerCase();
                    if (!filterData.formType || !employee[formKey]?.id) return false; // Check existence and ID
                    if (filterData.from || filterData.to) {
                        const formDateStr = employee[formKey]?.entry_date; if (!formDateStr) return false;
                        if (filterData.from && formDateStr < filterData.from) return false;
                        if (filterData.to && formDateStr > filterData.to) return false;
                    }
                }
                // --- Default/Unrecognized ---
                else {
                    if (!['transferred_to', 'from', 'to'].includes(key)) {
                         console.warn(`Filtering logic for key "${key}" is not explicitly handled.`);
                    }
                }
            } // End loop through filter keys
            return true; // Survived all filters
        });

        setFilteredEmployees(results);
    };


    // --- Effect to re-apply filters when selections change ---
    useEffect(() => {
        applyFiltersToData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilters, selectedRole, employees]);

    // --- Helper to Format Filter Display String ---
    const getFilterDisplayString = (filter) => {
        const key = Object.keys(filter)[0];
        const value = Object.values(filter)[0];

         // --- Custom Display Strings ---
         if (key === 'status') {
             let display = `Status: ${value}`;
             const relatedTransfer = selectedFilters.find(f => Object.keys(f)[0] === 'transferred_to');
             const relatedFrom = selectedFilters.find(f => Object.keys(f)[0] === 'from');
             const relatedTo = selectedFilters.find(f => Object.keys(f)[0] === 'to');
             if (value.toLowerCase() === 'transferred to' && relatedTransfer) { display += ` (To: ${Object.values(relatedTransfer)[0]})`; }
             else if (value.toLowerCase() !== 'transferred to' && (relatedFrom || relatedTo)) { display += ` (Since: ${relatedFrom ? Object.values(relatedFrom)[0] : '...'} - ${relatedTo ? Object.values(relatedTo)[0] : '...'})`; }
             return display;
         }
         if ((key === 'transferred_to' || key === 'from' || key === 'to') && selectedFilters.some(f => Object.keys(f)[0] === 'status')) return null; // Hide if part of status filter
         if (key.startsWith("param_") && typeof value === 'object') { return `Vitals: ${value.param.toUpperCase()} ${value.value ? `(${value.value})` : `[${value.from} - ${value.to}]`}`; }
         else if (key.startsWith("investigation_") && typeof value === 'object') { let d = `Invest: ${value.form.toUpperCase()} > ${value.param.toUpperCase()}`; if (value.from && value.to) d += ` [${value.from}-${value.to}]`; if (value.status) d += ` (${value.status.toUpperCase()})`; return d; }
         else if (key.startsWith("fitness_") && typeof value === 'object') { return `Fitness: ${Object.entries(value).map(([k, v]) => `${k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${v}`).join(", ")}`; }
         else if (key.startsWith("purpose_") && typeof value === 'object') { let p = []; if(value.type_of_visit) p.push(`Type:${value.type_of_visit}`); if(value.register) p.push(`Reg:${value.register}`); if(value.specificCategory) p.push(`Cat:${value.specificCategory}`); if(value.fromDate || value.toDate) p.push(`Date:[${value.fromDate||'..'} to ${value.toDate||'..'}]`); return `Purpose: ${p.join('|')}`; }
         else if (key.startsWith("referrals_") && typeof value === 'object') { let p=[]; if (value.referred) p.push(`Referred:${value.referred}`); if (value.speciality) p.push(`Spec:${value.speciality}`); if (value.hospitalName) p.push(`Hosp:${value.hospitalName}`); if (value.doctorName) p.push(`Doc:${value.doctorName}`); return `Referral:${p.join(', ')}`; }
         else if (key.startsWith("family_") && typeof value === 'object') { return `FamilyHx: ${value.relation}-${value.condition}(${value.status})`; }
         else if (key.startsWith("personal_")) { return `PersonalHx: ${key.substring('personal_'.length)}(${value})`; }
         else if (['smoking', 'alcohol', 'paan', 'diet', 'drugAllergy', 'foodAllergy', 'otherAllergies', 'surgicalHistory'].includes(key)) { return `MedHx: ${key.replace(/([A-Z])/g,' $1').replace(/^./, s => s.toUpperCase())}(${value})`; }
         else if (key === 'vaccine_status') { return `Vaccine Status: ${value}`; }
         else if (key.startsWith('statutory_')) { const { formType, from, to } = value; let d = `Statutory: ${formType}`; if(from || to) d += ` [${from || '..'} - ${to || '..'}]`; return d; }
         // Simple Key-Value or Default
         else {
              const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              if (typeof value === 'object' && value !== null && !Array.isArray(value)) { return `${formattedKey}: Complex`; }
              return `${formattedKey}: ${value}`;
         }
    };


    // --- JSX Render ---
    return (
        <div className="h-screen bg-[#8fcadd] flex">
            <Sidebar />
            <div className="h-screen overflow-auto flex flex-1 flex-col"> {/* Use flex-1 */}
                {/* --- Selected Filters Display --- */}
                <div className="p-4 flex flex-wrap gap-2 bg-gray-100 rounded-xl border-gray-300 sticky top-0 z-10 shadow-sm min-h-[50px]"> {/* Min height added */}
                     {selectedFilters.length > 0 ? (
                        selectedFilters.map((filter, index) => {
                            const displayString = getFilterDisplayString(filter);
                            const filterKey = Object.keys(filter)[0]; // Get the unique key
                            return displayString ? (
                                <motion.div
                                    key={filterKey} // Use the unique filter key
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} layout
                                    className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-full shadow text-sm cursor-default"
                                >
                                    <span>{displayString}</span>
                                    <X size={16} className="ml-2 cursor-pointer hover:bg-red-500 rounded-full p-0.5" onClick={() => removeFilter(filter)} />
                                </motion.div>
                            ) : null;
                        })
                    ) : (
                        <p className="text-gray-500 italic p-2">No filters selected. Add filters below.</p>
                    )}
                </div>

                {/* --- Filter Selection Area --- */}
                 <div className="flex m-4 gap-4">
                    <select className="flex-shrink-0 p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleRoleChange} value={selectedRole} aria-label="Select Role Filter">
                        <option value="">Overall Role</option> <option value="Employee">Employee</option> <option value="Contractor">Contractor</option> <option value="Visitor">Visitor</option>
                    </select>
                    <select className="flex-grow p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => { const v=e.target.value; if(v) { handleFilterClick(v); } e.target.value=""; }} value={""} aria-label="Select Filter Category to Add">
                        <option value="" disabled> Add Filters By Category... </option>
                        {filterSections.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
                    </select>
                </div>

                {/* --- Dynamic Filter Form Area --- */}
                 <div className="p-4 flex-shrink-0">
                    <AnimatePresence>
                        {selectedSection && (
                            <motion.div key={selectedSection} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, transition: { duration: 0.15 } }} transition={{ duration: 0.2 }} className="p-6 bg-white shadow rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-700">{filterSections.find((f) => f.id === selectedSection)?.label} Filter</h2>
                                    <button onClick={() => setSelectedSection(null)} className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100" aria-label="Close Filter Section"> <X size={20} /> </button>
                                </div>
                                {/* --- Render Specific Filter Component --- */}
                                {selectedSection === "employementstatus" && <EmployementStatus addFilter={addFilter} />}
                                {selectedSection === "personaldetails" && <PersonalDetails addFilter={addFilter} />}
                                {selectedSection === "employementdetails" && <EmploymentDetails addFilter={addFilter} />}
                                {selectedSection === "vitals" && <Vitals addFilter={addFilter} />}
                                {selectedSection === "fitness" && <Fitness addFilter={addFilter} />}
                                {selectedSection === "medicalhistory" && <MedicalHistoryForm addFilter={addFilter} />}
                                {selectedSection === "investigations" && <Investigations addFilter={addFilter} />}
                                {selectedSection === "vaccination" && <VaccinationForm addFilter={addFilter} />}
                                {selectedSection === "purpose" && <PurposeFilter addFilter={addFilter} />}
                                {selectedSection === "diagnosis" && <Diagnosis addFilter={addFilter} cd={cd} remarks={remarks} />}
                                {selectedSection === "prescriptions" && <Prescriptions addFilter={addFilter} />}
                                {selectedSection === "referrals" && <Referrals addFilter={addFilter} specialityOptions={specialityOptions} hospitalOptions={hospitalOptions} doctorOptions={doctorOptions} />}
                                {selectedSection === "statutoryforms" && <StatutoryForms addFilter={addFilter} />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* --- Display Employee Data Table --- */}
                <div className="p-4 flex-grow flex flex-col min-h-0"> {/* Added min-h-0 for flex-grow */}
                    <h2 className="text-xl font-semibold mb-4 flex-shrink-0">Filtered Employee Records ({filteredEmployees.length})</h2>
                    <div className="overflow-auto flex-grow bg-gray-50 rounded-lg p-4 shadow-md border border-gray-200">
                        <table className="min-w-full bg-white rounded-lg ">
                            <thead className="bg-blue-600 text-white sticky top-0 z-5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Emp ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Age</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Gender</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-10 text-gray-500">
                                        <div className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                                        <span className="ml-2">Loading records...</span>
                                    </td></tr>
                                ) : filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((employee) => (
                                        <tr key={employee.id || employee.emp_no} className="hover:bg-blue-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.emp_no || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{calculateAge(employee.dob)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.sex || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.type || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{employee.employee_status || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => navigate("../employeeprofile", { state: { data: employee } })}
                                                    className="bg-indigo-500 text-white px-3 py-1 rounded text-xs hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300"> View </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7" className="text-center py-10 text-gray-500 italic">No employee records found matching the selected criteria.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ========================================================================
// --- Filter Component Definitions (Keep ALL components below) ---
// ========================================================================

const EmployementStatus = ({ addFilter }) => {
    const [formData, setFormData] = useState({ status: "", from: "", to: "", transferred_to: "", });
    const handleChange = (e) => { setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleSubmit = () => {
        const { status, from, to, transferred_to } = formData; let filteredData = {}; if (!status) { alert("Please select status."); return; }
        filteredData.status = status; if (status === 'Transferred To' && transferred_to) { filteredData.transferred_to = transferred_to; }
        else if (status !== 'Transferred To') { if (from && to && new Date(from) > new Date(to)) { alert("'From Date' > 'To Date'."); return; } if (from) filteredData.from = from; if (to) filteredData.to = to; }
        else if (status === 'Transferred To' && !transferred_to) { alert("Enter location for 'Transferred To'."); return; }
        if (Object.keys(filteredData).length > 0 && filteredData.status) { addFilter(filteredData); } else { alert("Provide valid criteria."); }
        setFormData({ status: "", from: "", to: "", transferred_to: "" });
    };
    const showTransferredTo = formData.status === "Transferred To"; const showDateRange = formData.status && !showTransferredTo; const isSubmitDisabled = !formData.status || (showTransferredTo && !formData.transferred_to);
    return (<div className="space-y-4"> <div> <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label> <select name="status" id="status-filter" value={formData.status} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"> <option value="">Select Status</option> <option value="Active">Active</option> <option value="Transferred To">Transferred To</option> <option value="Resigned">Resigned</option> <option value="Retired">Retired</option> <option value="Deceased">Deceased</option> <option value="Unauthorised Absence">Unauthorised Absence</option> <option value="Other">Other</option> </select> </div> {showTransferredTo && (<div> <label htmlFor="transferred_to-filter" className="block text-sm font-medium text-gray-700 mb-1">Transferred To Dept/Location</label> <input type="text" id="transferred_to-filter" name="transferred_to" value={formData.transferred_to} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Department/Location"/> </div>)} {showDateRange && (<div className="grid grid-cols-2 gap-4"> <div> <label htmlFor="from-date-filter" className="block text-sm font-medium text-gray-700 mb-1">Date Since From</label> <input type="date" id="from-date-filter" name="from" value={formData.from} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" max={new Date().toISOString().split("T")[0]}/> </div> <div> <label htmlFor="to-date-filter" className="block text-sm font-medium text-gray-700 mb-1">Date Since To</label> <input type="date" id="to-date-filter" name="to" value={formData.to} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min={formData.from || undefined} max={new Date().toISOString().split("T")[0]}/> </div> </div>)} <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50" disabled={isSubmitDisabled}>Add Employment Status Filter</button> </div>);
};
const PersonalDetails = ({ addFilter }) => {
    const [formData, setFormData] = useState({ ageFrom: "", ageTo: "", sex: "", bloodgrp: "", marital_status: "", });
    const handleChange = (e) => { setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleSubmit = () => {
        const filteredData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== "" && v !== null));
        if (filteredData.ageFrom && filteredData.ageTo && parseInt(filteredData.ageFrom, 10) > parseInt(filteredData.ageTo, 10)) { alert("'Age From' > 'Age To'."); return; }
        if (Object.keys(filteredData).length > 0) { addFilter(filteredData); } else { alert("Enter at least one detail."); }
        setFormData({ ageFrom: "", ageTo: "", sex: "", bloodgrp: "", marital_status: "" });
    };
    return (<div className="space-y-4"> <div className="grid grid-cols-2 gap-4"> <div> <label htmlFor="ageFrom-filter">Age From</label> <input type="number" id="ageFrom-filter" name="ageFrom" value={formData.ageFrom} onChange={handleChange} min="0" className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="e.g., 25"/> </div> <div> <label htmlFor="ageTo-filter">Age To</label> <input type="number" id="ageTo-filter" name="ageTo" value={formData.ageTo} onChange={handleChange} min="0" className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="e.g., 40"/> </div> </div> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div> <label htmlFor="sex-filter">Sex</label> <select name="sex" id="sex-filter" value={formData.sex} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"> <option value="">Any Sex</option> <option value="Male">Male</option> <option value="Female">Female</option> <option value="Other">Other</option> </select> </div> <div> <label htmlFor="bloodgrp-filter">Blood Group</label> <select name="bloodgrp" id="bloodgrp-filter" value={formData.bloodgrp} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"> <option value="">Any</option> <option value="A+">A+</option> <option value="A-">A-</option> <option value="B+">B+</option> <option value="B-">B-</option> <option value="AB+">AB+</option> <option value="AB-">AB-</option> <option value="O+">O+</option> <option value="O-">O-</option> </select> </div> <div> <label htmlFor="marital_status-filter">Marital Status</label> <select name="marital_status" id="marital_status-filter" value={formData.marital_status} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"> <option value="">Any</option> <option value="Single">Single</option> <option value="Married">Married</option> <option value="Separated">Separated</option> <option value="Divorced">Divorced</option> <option value="Widowed">Widowed</option> </select> </div> </div> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={Object.values(formData).every(v => v === "")}>Add Personal Details Filter</button> </div>);
};
const EmploymentDetails = ({ addFilter }) => {
    const [formData, setFormData] = useState({ designation: "", department: "", moj: "", employer: "", doj: "", job_nature: "", });
    const employerOptions = { "JSW Steel": "JSW Steel", "JSW Cement": "JSW Cement", "JSW Foundation": "JSW Foundation", /*...*/ }; const mojOptions = { "New Joinee": "New Joinee", "Transfer": "Transfer", /*...*/ }; const jobNatureOptions = { "Contract": "Contract", "Permanent": "Permanent", "Consultant": "Consultant", /*...*/ };
    const handleChange = (e) => { setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleSubmit = () => { const filteredData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== "" && v !== null)); if (Object.keys(filteredData).length > 0) { addFilter(filteredData); } else { alert("Enter at least one detail."); } setFormData({ designation: "", department: "", moj: "", employer: "", doj: "", job_nature: "" }); };
    return (<div className="space-y-4"> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div><label htmlFor="employer-filter">Employer</label><select name="employer" id="employer-filter" value={formData.employer} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">Any</option>{Object.entries(employerOptions).map(([k, v])=>(<option key={k} value={k}>{v}</option>))}</select></div> <div><label htmlFor="moj-filter">Mode of Joining</label><select name="moj" id="moj-filter" value={formData.moj} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">Any</option>{Object.entries(mojOptions).map(([k, v])=>(<option key={k} value={k}>{v}</option>))}</select></div> <div><label htmlFor="job_nature-filter">Job Nature</label><select name="job_nature" id="job_nature-filter" value={formData.job_nature} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">Any</option>{Object.entries(jobNatureOptions).map(([k, v])=>(<option key={k} value={k}>{v}</option>))}</select></div> </div> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div><label htmlFor="designation-filter">Designation</label><input type="text" id="designation-filter" name="designation" value={formData.designation} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="e.g., Engineer"/></div> <div><label htmlFor="department-filter">Department</label><input type="text" id="department-filter" name="department" value={formData.department} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="e.g., IT"/></div> <div><label htmlFor="doj-filter">Date of Joining</label><input type="date" id="doj-filter" name="doj" value={formData.doj} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"/></div> </div> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={Object.values(formData).every(v=>v==="")}>Add Employment Details Filter</button> </div>);
};
const Vitals = ({ addFilter }) => {
    const [formData, setFormData] = useState({ param: "systolic", bmiCategory: "", from: "", to: "", });
    const vitalParams = [ { value: "systolic", label: "Systolic BP", type: "range" }, { value: "diastolic", label: "Diastolic BP", type: "range" }, { value: "pulse", label: "Pulse Rate", type: "range" }, { value: "respiratory_rate", label: "Resp Rate", type: "range" }, { value: "temperature", label: "Temp", type: "range" }, { value: "spo2", label: "SpO2", type: "range" }, { value: "height", label: "Height", type: "range" }, { value: "weight", label: "Weight", type: "range" }, { value: "bmi", label: "BMI", type: "category" }, ];
    const bmiOptions = { "Under weight": "Under weight", "Normal": "Normal", "Over weight": "Over weight", "Obese": "Obese", "Extremely Obese": "Extremely Obese" };
    const selectedParamConfig = vitalParams.find(p => p.value === formData.param);
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => { const ns = { ...prev, [name]: value }; if (name === 'param') { ns.bmiCategory = ""; ns.from = ""; ns.to = ""; } return ns; }); };
    const handleSubmit = () => { const { param, bmiCategory, from, to } = formData; const config = vitalParams.find(p => p.value === param); if (!config) return; let fp = {}; if (config.type === "category" && param === "bmi" && bmiCategory) { fp = { param: param, value: bmiCategory }; } else if (config.type === "range" && from !== "" && to !== "") { if (parseFloat(from) > parseFloat(to)) { alert("'From' > 'To'."); return; } fp = { param: param, from: from, to: to }; } else { alert("Provide valid inputs."); return; } addFilter({ param: fp }); setFormData({ param: "systolic", bmiCategory: "", from: "", to: "" }); };
    const showBmiDropdown = selectedParamConfig?.type === "category" && selectedParamConfig?.value === "bmi"; const showRangeInputs = selectedParamConfig?.type === "range"; const isSubmitDisabled = !selectedParamConfig || (showBmiDropdown && !formData.bmiCategory) || (showRangeInputs && (formData.from === "" || formData.to === ""));
    return (<div className="space-y-4"> <div> <label htmlFor="param-vital-filter">Parameter</label> <select name="param" id="param-vital-filter" value={formData.param} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"> {vitalParams.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))} </select> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {showBmiDropdown && (<div className="md:col-span-2"> <label htmlFor="bmiCategory-filter">BMI Category</label> <select name="bmiCategory" id="bmiCategory-filter" value={formData.bmiCategory} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"> <option value="">Select</option> {Object.entries(bmiOptions).map(([k, v]) => (<option key={k} value={k}>{v}</option>))} </select> </div>)} {showRangeInputs && (<><div> <label htmlFor="from-vital-filter">Range From</label> <input type="number" id="from-vital-filter" name="from" value={formData.from} onChange={handleChange} step="any" className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="e.g., 120"/> </div> <div> <label htmlFor="to-vital-filter">Range To</label> <input type="number" id="to-vital-filter" name="to" value={formData.to} onChange={handleChange} step="any" className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="e.g., 140"/> </div> </>)} </div> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}> Add Vital Filter ({selectedParamConfig?.label}) </button> </div>);
};
const Investigations = ({ addFilter }) => {
    const formOptions = { haematology: ["hemoglobin", "total_rbc", /*...*/], routinesugartests: ["glucose_f", "hba1c",/*...*/], lipidprofile: ["calcium", /*...*/], liverfunctiontest: ["bilirubin_total", /*...*/], thyroidfunctiontest: ["t3_triiodothyronine",/*...*/], renalfunctiontests_and_electrolytes: ["urea",/*...*/], coagulationtest: ["prothrombin_time",/*...*/], enzymesandcardiacprofile: ["acid_phosphatase",/*...*/], urineroutine: ["colour",/*...*/], serology: ["screening_hiv",/*...*/], motion: ["colour_motion",/*...*/], menspack: ["psa"], opthalamicreport: ["vision",/*...*/], usg: ["usg_abdomen",/*...*/], };
    const formatLabel = (k) => k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); const [formData, setFormData] = useState({ form: "", param: "", from: "", to: "", status: "", }); const selectedFormParams = formData.form ? formOptions[formData.form] || [] : [];
    useEffect(() => { setFormData((prev) => ({ ...prev, param: "", from: "", to: "", status: "" })); }, [formData.form]); const handleChange = (e) => { setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleSubmit = () => { const { form, param, from, to, status } = formData; if (!form || !param) { alert("Select Form and Parameter."); return; } let fp = { form, param }; let hv = false; if (from !== "" && to !== "") { if (parseFloat(from) > parseFloat(to)) { alert("'From' > 'To'."); return; } fp.from = from; fp.to = to; hv = true; } if (status !== "") { fp.status = status; hv = true; } if (!hv) { alert("Provide Range or Status."); return; } addFilter({ investigation: fp }); setFormData({ form: "", param: "", from: "", to: "", status: "" }); }; const isSubmitDisabled = !formData.form || !formData.param || (formData.from === "" && formData.to === "" && formData.status === "");
    return (<div className="space-y-4"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label htmlFor="form-investigation-filter">Form</label> <select name="form" id="form-investigation-filter" value={formData.form} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"> <option value="">-- Select --</option> {Object.keys(formOptions).map((k) => (<option key={k} value={k}>{formatLabel(k)}</option>))} </select> </div> <div> <label htmlFor="param-investigation-filter">Parameter</label> <select name="param" id="param-investigation-filter" value={formData.param} onChange={handleChange} disabled={!formData.form || selectedFormParams.length === 0} className="w-full p-3 border rounded-lg focus:ring-blue-500 disabled:bg-gray-100"> <option value="">-- Select --</option> {selectedFormParams.map((p) => (<option key={p} value={p}>{formatLabel(p)}</option>))} </select> </div> </div> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div> <label htmlFor="from-investigation-filter">From (Value)</label> <input type="number" id="from-investigation-filter" name="from" value={formData.from} onChange={handleChange} step="any" className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="Min"/> </div> <div> <label htmlFor="to-investigation-filter">To (Value)</label> <input type="number" id="to-investigation-filter" name="to" value={formData.to} onChange={handleChange} step="any" className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="Max"/> </div> <div> <label htmlFor="status-investigation-filter">Status</label> <select name="status" id="status-investigation-filter" value={formData.status} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"> <option value="">-- Select --</option> <option value="normal">Normal</option> <option value="abnormal">Abnormal</option> </select> </div> </div> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}> Add Investigation Filter </button> </div>);
};
const Fitness = ({ addFilter }) => {
    const [formData, setFormData] = useState({ tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "", job_nature: "", overall_fitness: "", });
    const yesNoOptions = { "": "Any", Positive: "Positive", Negative: "Negative" }; const jobNatureOptions = { "": "Any", "Desk Job": "Desk Job", "Field Work": "Field Work", "Manual Labor": "Manual Labor" }; const fitnessStatusOptions = { "": "Any", Fit: "Fit", "Conditionally Fit": "Conditionally Fit", Unfit: "Unfit" };
    const handleChange = (e) => { setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value })); }; const handleSubmit = () => { const fd = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== "")); if (Object.keys(fd).length > 0) { addFilter({ fitness: fd }); } else { alert("Select at least one criterion."); } setFormData({ tremors: "", romberg_test: "", acrophobia: "", trendelenberg_test: "", job_nature: "", overall_fitness: "" }); }; const isSubmitDisabled = Object.values(formData).every(v => v === "");
    return (<div className="space-y-6"> <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> <div> <label htmlFor="tremors-filter">Tremors</label> <select name="tremors" id="tremors-filter" value={formData.tremors} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(yesNoOptions).map(([v, l])=><option key={v} value={v}>{l}</option>)}</select> </div> <div> <label htmlFor="romberg_test-filter">Romberg</label> <select name="romberg_test" id="romberg_test-filter" value={formData.romberg_test} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(yesNoOptions).map(([v, l])=><option key={v} value={v}>{l}</option>)}</select> </div> <div> <label htmlFor="acrophobia-filter">Acrophobia</label> <select name="acrophobia" id="acrophobia-filter" value={formData.acrophobia} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(yesNoOptions).map(([v, l])=><option key={v} value={v}>{l}</option>)}</select> </div> <div> <label htmlFor="trendelenberg_test-filter">Trendelenberg</label> <select name="trendelenberg_test" id="trendelenberg_test-filter" value={formData.trendelenberg_test} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(yesNoOptions).map(([v, l])=><option key={v} value={v}>{l}</option>)}</select> </div> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label htmlFor="job_nature_fitness-filter">Job Nature</label> <select name="job_nature" id="job_nature_fitness-filter" value={formData.job_nature} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(jobNatureOptions).map(([v, l])=><option key={v} value={v}>{l}</option>)}</select> </div> <div> <label htmlFor="overall_fitness-filter">Overall Fitness</label> <select name="overall_fitness" id="overall_fitness-filter" value={formData.overall_fitness} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(fitnessStatusOptions).map(([v, l])=><option key={v} value={v}>{l}</option>)}</select> </div> </div> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}> Add Fitness Filter </button> </div>);
};
const MedicalHistoryForm = ({ addFilter }) => {
    const [ph, setPh] = useState({ smoking: "", alcohol: "", paan: "", diet: "", }); const [pc, setPc] = useState({ condition: "", status: "", }); const [fc, setFc] = useState({ condition: "", status: "", relation: "", }); const [al, setAl] = useState({ drugAllergy: "", foodAllergy: "", otherAllergies: "", }); const [sh, setSh] = useState({ status: "", });
    const hOpts={"":"Any",Yes:"Yes",No:"No",Cessased:"Cessased"}; const yOpts={"":"Any",Yes:"Yes",No:"No"}; const dOpts={"":"Any","Pure Veg":"Pure Veg","Mixed Diet":"Mixed Diet",Eggetarian:"Eggetarian"}; const cParams=["","HTN","DM","Epileptic","Hyper thyroid","Hypo thyroid","Asthma","CVS","CNS","RS","GIT","KUB","CANCER","Defective Colour Vision","OTHERS","Obstetric","Gynaec"]; const rOpts=["","Father","Mother","Brother","Sister","Son","Daughter","Spouse","Grandparent","Other"];
    const hhc=(e)=>{setPh(p=>({...p,[e.target.name]:e.target.value}))}; const hpc=(e)=>{setPc(p=>({...p,[e.target.name]:e.target.value}))}; const hfc=(e)=>{setFc(p=>({...p,[e.target.name]:e.target.value}))}; const hal=(e)=>{setAl(p=>({...p,[e.target.name]:e.target.value}))}; const hsh=(e)=>{setSh(p=>({...p,[e.target.name]:e.target.value}))};
    const handleSubmit = () => { let cf={}; Object.entries(ph).forEach(([k,v])=>{if(v)cf[k]=v}); Object.entries(al).forEach(([k,v])=>{if(v)cf[k]=v}); if(sh.status){cf.surgicalHistory=sh.status} if(pc.condition&&pc.status){cf[`personal_${pc.condition}`]=pc.status} if(fc.condition&&fc.status&&fc.relation){cf.familyCondition={condition:fc.condition,status:fc.status,relation:fc.relation}} if(Object.keys(cf).length > 0){addFilter(cf)}else{alert("Select at least one criterion.")} setPh({smoking:"",alcohol:"",paan:"",diet:""}); setPc({condition:"",status:""}); setFc({condition:"",status:"",relation:""}); setAl({drugAllergy:"",foodAllergy:"",otherAllergies:""}); setSh({status:""}); };
    const isSubmitDisabled = Object.values(ph).every(v=>!v) && (!pc.condition||!pc.status) && (!fc.condition||!fc.status||!fc.relation) && Object.values(al).every(v=>!v) && !sh.status;
    return (<div className="space-y-6"> <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2 text-gray-600">Personal Habits</legend><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">{Object.keys(ph).map((k)=>(<div key={k}><label htmlFor={`${k}-h-f`}>{k.charAt(0).toUpperCase()+k.slice(1)}</label><select name={k} id={`${k}-h-f`} value={ph[k]} onChange={hhc} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(k==='diet'?dOpts:hOpts).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>))}</div></fieldset> <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2 text-gray-600">Personal Conditions</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"><div><label htmlFor="pc-c-f">Condition</label><select name="condition" id="pc-c-f" value={pc.condition} onChange={hpc} className="w-full p-3 border rounded-lg focus:ring-blue-500">{cParams.map(c=><option key={c} value={c}>{c||'--Select--'}</option>)}</select></div><div><label htmlFor="pc-s-f">Status (Y/N)</label><select name="status" id="pc-s-f" value={pc.status} onChange={hpc} disabled={!pc.condition} className="w-full p-3 border rounded-lg focus:ring-blue-500 disabled:bg-gray-100">{Object.entries(yOpts).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div></div></fieldset> <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2 text-gray-600">Allergies</legend><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">{Object.keys(al).map((k)=>(<div key={k}><label htmlFor={`${k}-a-f`}>{k==='drugAllergy'?'Drug':k==='foodAllergy'?'Food':'Other'}</label><select name={k} id={`${k}-a-f`} value={al[k]} onChange={hal} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(yOpts).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>))}</div></fieldset> <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2 text-gray-600">Surgical History</legend><div className="grid grid-cols-1 gap-4 mt-2"><div><label htmlFor="sh-f">Any Past Surgeries?</label><select name="status" id="sh-f" value={sh.status} onChange={hsh} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(yOpts).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div></div></fieldset> <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2 text-gray-600">Family History</legend><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"><div><label htmlFor="fc-c-f">Condition</label><select name="condition" id="fc-c-f" value={fc.condition} onChange={hfc} className="w-full p-3 border rounded-lg focus:ring-blue-500">{cParams.map(c=><option key={c} value={c}>{c||'--Select--'}</option>)}</select></div><div><label htmlFor="fc-r-f">Relation</label><select name="relation" id="fc-r-f" value={fc.relation} onChange={hfc} disabled={!fc.condition} className="w-full p-3 border rounded-lg focus:ring-blue-500 disabled:bg-gray-100">{rOpts.map(r=><option key={r} value={r}>{r||'--Select--'}</option>)}</select></div><div><label htmlFor="fc-s-f">Status (Y/N)</label><select name="status" id="fc-s-f" value={fc.status} onChange={hfc} disabled={!fc.condition||!fc.relation} className="w-full p-3 border rounded-lg focus:ring-blue-500 disabled:bg-gray-100">{Object.entries(yOpts).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div></div></fieldset> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}> Add Medical History Filter(s) </button> </div>);
};
const VaccinationForm = ({ addFilter }) => {
    const [formData, setFormData] = useState({ disease: "", vaccine: "", vaccine_status: "", });
    const dOpts=["","Covid-19","Hepatitis B","Influenza","Tetanus","MMR",/*...*/]; const vOpts={"Covid-19":["","Covishield","Covaxin"],"Hepatitis B":["","Engerix-B"],"Influenza":["","Fluarix"],"Tetanus":["","Tdap"],"MMR":["","MMR-II"],}; const sOpts={"":"Any",Completed:"Completed",Partial:"Partial"};
    const availableVaccines = formData.disease ? vOpts[formData.disease] || [""] : [""]; const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => { const ns = { ...prev, [name]: value }; if (name === 'disease') ns.vaccine = ""; return ns; }); };
    const handleSubmit = () => { const fd = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== "")); if (Object.keys(fd).length > 0) { addFilter(fd); } else { alert("Select at least one criterion."); } setFormData({ disease: "", vaccine: "", vaccine_status: "" }); }; const isSubmitDisabled = !formData.disease && !formData.vaccine && !formData.vaccine_status;
    return (<div className="space-y-4"> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div> <label htmlFor="d-v-f">Disease</label> <select name="disease" id="d-v-f" value={formData.disease} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{dOpts.map(d => <option key={d} value={d}>{d||'--Select--'}</option>)}</select> </div> <div> <label htmlFor="v-s-f">Vaccine (Optional)</label> <select name="vaccine" id="v-s-f" value={formData.vaccine} onChange={handleChange} disabled={!formData.disease} className="w-full p-3 border rounded-lg focus:ring-blue-500 disabled:bg-gray-100">{availableVaccines.map(v => <option key={v} value={v}>{v||'--Any--'}</option>)}</select> </div> <div> <label htmlFor="s-v-f">Status</label> <select name="vaccine_status" id="s-v-f" value={formData.vaccine_status} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(sOpts).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select> </div> </div> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}> Add Vaccination Filter </button> </div>);
};
const PurposeData = { "Preventive": { "Medical Examination": ["Pre Employment", "Pre Employment (FH)", "Pre Placement", "Annual", "Periodical (FH)", "Camps (M)", "Camps (O)"], "Periodic Work Fitness": ["Special WF", "Special WF (R)"], "Fitness After Medical Leave": ["Fitness After ML"], "Mock Drill": ["Mock Drill"], "BP Sugar Check": ["BP Sugar Check"] }, "Curative": { "Outpatient": ["Illness", "OCI", "Injury", "OCI", "Follow-up", "BP Sugar Chart", "Injury Outside", "OCI Outside"], "Alcohol Abuse": ["Alcohol Abuse"] } };
function PurposeFilter({ addFilter }) {
    const [formData, setFormData] = useState({ fromDate: "", toDate: "", type_of_visit: "", register: "", specificCategory: "", }); const { fromDate, toDate, type_of_visit, register, specificCategory } = formData;
    const subcategories = type_of_visit ? Object.keys(PurposeData[type_of_visit] || {}) : []; const specificOpts = type_of_visit && register ? (PurposeData[type_of_visit]?.[register] || []) : [];
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => { const ns = { ...prev, [name]: value }; if (name === 'type_of_visit') { ns.register = ""; ns.specificCategory = ""; } else if (name === 'register') { ns.specificCategory = ""; } return ns; }); };
    const handleSubmit = () => { const pf = {}; if (fromDate) pf.fromDate = fromDate; if (toDate) pf.toDate = toDate; if (type_of_visit) pf.type_of_visit = type_of_visit; if (register) pf.register = register; if (specificCategory) pf.specificCategory = specificCategory; if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) { alert("'From' > 'To'."); return; } if (Object.keys(pf).length > 0) { addFilter({ purpose: pf }); } else { alert("Select criterion or date range."); } setFormData({ fromDate: "", toDate: "", type_of_visit: "", register: "", specificCategory: "" }); }; const isSubmitDisabled = !fromDate && !toDate && !type_of_visit && !register && !specificCategory;
    return (<div className="space-y-4"> <fieldset className="border p-4 rounded-md"><legend>Date Range</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"> <div><label htmlFor="fD-p-f">From</label><input type="date" id="fD-p-f" name="fromDate" value={fromDate} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"/></div> <div><label htmlFor="tD-p-f">To</label><input type="date" id="tD-p-f" name="toDate" value={toDate} onChange={handleChange} min={fromDate || undefined} className="w-full p-3 border rounded-lg focus:ring-blue-500"/></div> </div></fieldset> <fieldset className="border p-4 rounded-md"><legend>Visit Purpose</legend><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"> <div><label htmlFor="tov-f">Type</label><select id="tov-f" name="type_of_visit" value={type_of_visit} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">--Select--</option>{Object.keys(PurposeData).map((k)=>(<option key={k} value={k}>{k}</option>))}</select></div> <div><label htmlFor="r-p-f">Register</label><select id="r-p-f" name="register" value={register} onChange={handleChange} disabled={!type_of_visit} className="w-full p-3 border rounded-lg focus:ring-blue-500 disabled:bg-gray-100"><option value="">--Select--</option>{subcategories.map((k)=>(<option key={k} value={k}>{k}</option>))}</select></div> <div><label htmlFor="sc-p-f">Specific Reason</label><select id="sc-p-f" name="specificCategory" value={specificCategory} onChange={handleChange} disabled={!register||specificOpts.length===0} className="w-full p-3 border rounded-lg focus:ring-blue-500 disabled:bg-gray-100"><option value="">--Select--</option>{specificOpts.map((c, i)=>(<option key={`${c}-${i}`} value={c}>{c}</option>))}</select></div> </div></fieldset> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}>Add Purpose Filter</button> </div>);
}
const Diagnosis = ({ addFilter, cd = [], remarks = [] }) => {
    const [formData, setFormData] = useState({ disease: "", notable_remarks: "" });
    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const handleSubmit = (e) => { e.preventDefault(); const fd=Object.fromEntries(Object.entries(formData).filter(([_,v])=>v!==""&&v!==null)); if(Object.keys(fd).length>0){addFilter(fd)}else{alert("Select Disease or Remarks status.")} setFormData({disease:"",notable_remarks:""}); }; const isSubmitDisabled = !formData.disease && !formData.notable_remarks;
    return (<div className="space-y-4"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label htmlFor="d-d-f">Disease/Diagnosis</label> <select name="disease" id="d-d-f" value={formData.disease} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"> <option value="">--Select--</option> {cd.map(d => <option key={d} value={d}>{d||'N/A'}</option>)} </select> </div> <div> <label htmlFor="n-r-f">Notable Remarks?</label> <select name="notable_remarks" id="n-r-f" value={formData.notable_remarks} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"> <option value="">--Select--</option> {remarks.map(r => <option key={r} value={r}>{r||'N/A'}</option>)} </select> </div> </div> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}>Add Diagnosis/Remarks Filter</button> </div>);
};
const Prescriptions = ({ addFilter }) => {
    const [formData, setFormData] = useState({ tablets: "", injections: "", creams: "", others: "", });
    const tOpts=["","Aspirin","Ibuprofen",/*...*/]; const iOpts=["","Insulin","Adrenaline",/*...*/]; const cOpts=["","Hydrocortisone",/*...*/]; const oOpts=["","Syrup A","Inhaler B",/*...*/];
    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const handleSubmit = (e) => { e.preventDefault(); const fd=Object.fromEntries(Object.entries(formData).filter(([k,v])=>v!=="")); if(Object.keys(fd).length>0){addFilter(fd)}else{alert("Select medication.")} setFormData({tablets:"",injections:"",creams:"",others:""}); }; const isSubmitDisabled = Object.values(formData).every(v=>v==="");
    return (<div className="space-y-4"> <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"> <div> <label htmlFor="t-p-f">Tablets</label> <select name="tablets" id="t-p-f" value={formData.tablets} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{tOpts.map(o=><option key={o} value={o}>{o||'--Select--'}</option>)}</select> </div> <div> <label htmlFor="i-p-f">Injections</label> <select name="injections" id="i-p-f" value={formData.injections} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{iOpts.map(o=><option key={o} value={o}>{o||'--Select--'}</option>)}</select> </div> <div> <label htmlFor="c-p-f">Creams</label> <select name="creams" id="c-p-f" value={formData.creams} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{cOpts.map(o=><option key={o} value={o}>{o||'--Select--'}</option>)}</select> </div> <div> <label htmlFor="o-p-f">Others</label> <select name="others" id="o-p-f" value={formData.others} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{oOpts.map(o=><option key={o} value={o}>{o||'--Select--'}</option>)}</select> </div> </div> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}>Add Prescription Filter</button> </div>);
}
const Referrals = ({ addFilter, specialityOptions = [], hospitalOptions = [], doctorOptions = [] }) => {
    const [formData, setFormData] = useState({ referred: "", speciality: "", hospitalName: "", doctorName: "" });
    const yesNoOptions = { "": "Any", Yes: "Yes", No: "No" };
    const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleSubmit = (e) => { e.preventDefault(); const fd=Object.fromEntries(Object.entries(formData).filter(([_,v])=>v!==""&&v!==null)); if(Object.keys(fd).length>0){addFilter({referrals:fd})}else{alert("Select criterion.")} setFormData({referred:"",speciality:"",hospitalName:"",doctorName:""}); }; const isSubmitDisabled = Object.values(formData).every(v=>v==="");
    return (<form onSubmit={handleSubmit} className="space-y-4"> <div> <label htmlFor="referred-filter">Referral Made?</label> <select name="referred" id="referred-filter" value={formData.referred} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(yesNoOptions).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label htmlFor="speciality-referral-filter">Speciality</label> <select id="speciality-referral-filter" name="speciality" value={formData.speciality} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">--Select--</option>{specialityOptions.map(o=><option key={o} value={o}>{o}</option>)}</select> </div> <div> <label htmlFor="hospitalName-referral-filter">Hospital</label> <select id="hospitalName-referral-filter" name="hospitalName" value={formData.hospitalName} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">--Select--</option>{hospitalOptions.map(o=><option key={o} value={o}>{o}</option>)}</select> </div> </div> <div> <label htmlFor="doctorName-referral-filter">Doctor</label> <select id="doctorName-referral-filter" name="doctorName" value={formData.doctorName} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">--Select--</option>{doctorOptions.map(o=><option key={o} value={o}>{o}</option>)}</select> </div> <button type="submit" className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}>Add Referral Filter</button> </form>);
};
const StatutoryForms = ({ addFilter }) => {
    const [formData, setFormData] = useState({ formType: "", from: "", to: "", });
    const formOptions = ["Form27", "Form17", "Form38", "Form39", "Form40"];
    const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleSubmit = () => { if (!formData.formType) { alert("Select form type."); return; } if (formData.from && formData.to && formData.from > formData.to) { alert("'From' > 'To'."); return; } addFilter({ statutoryFormFilter: formData }); setFormData({ formType: "", from: "", to: "" }); };
    return (<div className="space-y-4 p-4 border rounded-md"> <div> <label htmlFor="statutory-form-type">Form Type *</label> <select id="statutory-form-type" name="formType" value={formData.formType} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-blue-500" required><option value="">--Select--</option>{formOptions.map(f => <option key={f} value={f}>{f}</option>)}</select> </div> <div> <label htmlFor="statutory-form-from">From Date</label> <input type="date" id="statutory-form-from" name="from" value={formData.from} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-blue-500"/> </div> <div> <label htmlFor="statutory-form-to">To Date</label> <input type="date" id="statutory-form-to" name="to" value={formData.to} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-blue-500"/> </div> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={!formData.formType}>Add Statutory Form Filter</button> </div>);
}


// --- Export ---
export default RecordsFilters;