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
    { id: "fitness", label: "Fitness" },
    { id: "specialcases", label: "Special Cases" }, // Added Special Cases
    // { id: "prescriptions", label: "Prescriptions" },
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
                const response = await axios.post("https://occupational-health-center-1.onrender.com/userData");
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
                const summaryResponse = await axios.get("https://occupational-health-center-1.onrender.com/get_notes/");
                const consultationData = summaryResponse?.data?.consultation; // For Referrals
                console.log("Fetched /get_notes/ response:", consultationData[0].speciality);


                // --- Process Referral Options ---
                if (Array.isArray(consultationData)) {
                    const uniqueSpecialities = new Set();
                    const uniqueDoctors = new Set();
                    const uniqueHospitals = new Set();
                    consultationData.forEach(element => {
                        // Use 'speaciality' key from sample data (note the typo)
                        if (element?.speciality) {
                            uniqueSpecialities.add(element.speciality.trim());
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
            acc[key] = Object.values(filter)[0];
            return acc;
        }, {});
        results = results.filter(employee => {
            for (const key in filtersMap) {
                const value = filtersMap[key];
                console.log(key)
                // --- Personal Details ---
                if (key === 'sex') { if (!employee.sex || employee.sex?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'bloodgrp') { if (employee.bloodgrp !== value) return false; }
                else if (key === 'marital_status') { if (!employee.marital_status || employee.marital_status?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'ageFrom') { const age = calculateAge(employee.dob); if (age === '-' || age < parseInt(value, 10)) return false; }
                else if (key === 'ageTo') { const age = calculateAge(employee.dob); if (age === '-' || age > parseInt(value, 10)) return false; }

                // --- Employment Details (UPDATED) ---
                else if (key === 'designation') { if (!employee.designation || employee.designation?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'department') { if (!employee.department || employee.department?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'employer') { if (!employee.employer || employee.employer?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'moj') { if (!employee.moj || employee.moj?.toLowerCase() !== value.toLowerCase()) return false; }
                else if (key === 'job_nature') { if (!employee.job_nature || employee.job_nature?.toLowerCase() !== value.toLowerCase()) return false; }
                // ADDED: Logic for dojFrom
                else if (key === 'dojFrom') {
                    if (!employee.doj) return false; // Fail if employee has no DOJ
                    try {
                        const employeeDoj = new Date(employee.doj);
                        const filterFromDate = new Date(value);
                        // Normalize dates to ignore time
                        employeeDoj.setHours(0, 0, 0, 0);
                        filterFromDate.setHours(0, 0, 0, 0);
                        if (isNaN(employeeDoj) || isNaN(filterFromDate) || employeeDoj < filterFromDate) {
                            return false;
                        }
                    } catch (e) { return false; } // Fail on invalid date format
                }
                // ADDED: Logic for dojTo
                else if (key === 'dojTo') {
                    if (!employee.doj) return false; // Fail if employee has no DOJ
                    try {
                        const employeeDoj = new Date(employee.doj);
                        const filterToDate = new Date(value);
                        // Normalize dates to ignore time
                        employeeDoj.setHours(0, 0, 0, 0);
                        filterToDate.setHours(0, 0, 0, 0);
                        if (isNaN(employeeDoj) || isNaN(filterToDate) || employeeDoj > filterToDate) {
                            return false;
                        }
                    } catch (e) { return false; } // Fail on invalid date format
                }
                // REMOVED: The old single 'doj' filter logic is no longer needed.

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
                    const filterData = value; // { form, param, from, to, status }

                    const investigationCategory = employee[filterData.form];

                    if (!investigationCategory) {
                        return false;
                    }

                    if (filterData.from && filterData.to) {
                        const investigationValue = investigationCategory[filterData.param];
                        if (investigationValue === undefined || investigationValue === null || investigationValue === '') {
                            return false;
                        }
                        const numVal = parseFloat(investigationValue);
                        const fromVal = parseFloat(filterData.from);
                        const toVal = parseFloat(filterData.to);
                        if (isNaN(numVal) || numVal < fromVal || numVal > toVal) {
                            return false;
                        }
                    }

                    if (filterData.status) {
                        const statusFieldKey = `${filterData.param}_status`;
                        const investigationStatus = investigationCategory[statusFieldKey];

                        if (!investigationStatus || investigationStatus.toLowerCase() !== filterData.status.toLowerCase()) {
                            return false;
                        }
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
                // --- Special Cases ---
                else if (key === 'specialCase') {
                    const hasFitnessCase = employee.fitnessassessment?.special_cases?.trim();
                    const hasConsultationCase = employee.consultation?.special_cases?.trim();
                    const employeeHasCase = !!(hasFitnessCase || hasConsultationCase);

                    if (value === 'Yes') {
                        if (!employeeHasCase) return false;
                    } else if (value === 'No' || value === 'NA') {
                        if (employeeHasCase) return false;
                    }
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
                // In applyFiltersToData, find and replace this specific block:

 else if (key.startsWith('family_')) {
    const filterData = value; // This is now { condition?, status?, relation? }
    const medicalData = employee.msphistory?.medical_data;

    let employeeHasCondition = false;
    let commentsToCheck = "";

    // Determine the scope of the search based on the filter
    if (filterData.condition) {
        // A specific condition is selected, so we check only that one.
        const conditionData = medicalData?.[filterData.condition];
        employeeHasCondition = conditionData && conditionData.comment && conditionData.comment.trim() !== "";
        if (employeeHasCondition) {
            commentsToCheck = conditionData.comment;
        }
    } else {
        // No specific condition, so check if ANY family history exists.
        if (medicalData) {
            employeeHasCondition = Object.values(medicalData).some(cond => cond && cond.comment && cond.comment.trim() !== "");
            if (employeeHasCondition) {
                // We will check against ALL family history comments combined.
                commentsToCheck = Object.values(medicalData).map(c => c.comment || "").join(" ");
            }
        }
    }

    // Now, apply the filter checks
    // 1. Check Status (e.g., must have a condition, or must not have one)
    if (filterData.status) {
        if ((filterData.status === 'Yes' && !employeeHasCondition) || (filterData.status === 'No' && employeeHasCondition)) {
            return false; // Fails the status check
        }
    }

    // 2. Check Relation (only if a relation is specified and the status check passed)
    if (filterData.relation && employeeHasCondition) {
        const relationRegex = new RegExp(`\\b${filterData.relation}\\b`, 'i');
        if (!relationRegex.test(commentsToCheck)) {
            return false; // Fails the relation check
        }
    }
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
                     if (!employee.vaccinationrecord?.vaccination || !Array.isArray(employee.vaccinationrecord?.vaccination)) return false;
                     console.log(employee.vaccinationrecord);
                     const match = employee.vaccinationrecord.vaccination.some(vac => {
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

                // --- Prescriptions ---
                //  else if (["tablets", "injections", "creams","syrups","drops","respules","lotions","fluids", "powder","suture_procedure","dressing","others" ].includes(key)) {
                //       if (!employee.prescription || !employee.prescription[key] || employee.prescription[key].toLowerCase() !== value.toLowerCase()) return false;
                //  }
                // --- Referrals ---
                 else if (key.startsWith('referrals_')) {
                    const filterData = value; // { referred, speciality, hospitalName, doctorName }
                    const consultationData = employee.consultation;
                    if (filterData.referred === 'No') {
                        if (consultationData && consultationData.referral?.toLowerCase() === 'yes') return false;
                    } else {
                        if (!consultationData || consultationData.referral?.toLowerCase() !== 'yes') return false;
                        if (filterData.speciality && consultationData.speciality?.toLowerCase() !== filterData.speciality.toLowerCase()) return false;
                        if (filterData.hospital_name && consultationData.hospital_name?.toLowerCase() !== filterData.hospitalName.toLowerCase()) return false;
                        if (filterData.doctor_name && consultationData.doctor_name?.toLowerCase() !== filterData.doctorName.toLowerCase()) return false;
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
         else if (key === 'specialCase') { return `Special Cases: ${value}`; } // Added display for Special Cases
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
                                {selectedSection === "specialcases" && <SpecialCasesFilter addFilter={addFilter} />}
                                {selectedSection === "medicalhistory" && <MedicalHistoryForm addFilter={addFilter} />}
                                {selectedSection === "investigations" && <Investigations addFilter={addFilter} />}
                                {selectedSection === "vaccination" && <VaccinationForm addFilter={addFilter} />}
                                {selectedSection === "purpose" && <PurposeFilter addFilter={addFilter} />}
                                {/* {selectedSection === "prescriptions" && <Prescriptions addFilter={addFilter} />} */}
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
    const [formData, setFormData] = useState({
        designation: "",
        department: "",
        moj: "",
        employer: "",
        job_nature: "",
        dojFrom: "",
        dojTo: "",
    });

    const employerOptions = { "JSW Steel": "JSW Steel", "JSW Cement": "JSW Cement", "JSW Foundation": "JSW Foundation" };
    const mojOptions = { "New Joinee": "New Joinee", "Transfer": "Transfer" };
    const jobNatureOptions = { "Contract": "Contract", "Permanent": "Permanent", "Consultant": "Consultant" };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        const filteredData = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== "" && v !== null));

        if (filteredData.dojFrom && filteredData.dojTo && new Date(filteredData.dojFrom) > new Date(filteredData.dojTo)) {
            alert("'From Date' cannot be after 'To Date'.");
            return;
        }

        if (Object.keys(filteredData).length > 0) {
            addFilter(filteredData);
        } else {
            alert("Enter at least one detail.");
        }

        setFormData({
            designation: "", department: "", moj: "", employer: "", job_nature: "", dojFrom: "", dojTo: ""
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label htmlFor="employer-filter">Employer</label><select name="employer" id="employer-filter" value={formData.employer} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">Any</option>{Object.entries(employerOptions).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select></div>
                <div><label htmlFor="moj-filter">Mode of Joining</label><select name="moj" id="moj-filter" value={formData.moj} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">Any</option>{Object.entries(mojOptions).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select></div>
                <div><label htmlFor="job_nature-filter">Job Nature</label><select name="job_nature" id="job_nature-filter" value={formData.job_nature} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">Any</option>{Object.entries(jobNatureOptions).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}</select></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label htmlFor="designation-filter">Designation</label><input type="text" id="designation-filter" name="designation" value={formData.designation} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="e.g., Engineer" /></div>
                <div><label htmlFor="department-filter">Department</label><input type="text" id="department-filter" name="department" value={formData.department} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="e.g., IT" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t mt-4">
                 <div>
                    <label htmlFor="dojFrom-filter">Date of Joining (From)</label>
                    <input type="date" id="dojFrom-filter" name="dojFrom" value={formData.dojFrom} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500" />
                </div>
                 <div>
                    <label htmlFor="dojTo-filter">Date of Joining (To)</label>
                    <input type="date" id="dojTo-filter" name="dojTo" value={formData.dojTo} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500" />
                </div>
            </div>

            <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={Object.values(formData).every(v => v === "")}>Add Employment Details Filter</button>
        </div>
    );
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
    // CORRECTED: Keys now match the lowercase model names from the Django backend.
    const formOptions = {
        heamatalogy: ["hemoglobin", "total_rbc", "total_wbc", "Haemotocrit", "neutrophil", "monocyte", "pcv", "mcv", "mch", "lymphocyte", "esr", "mchc", "platelet_count", "rdw", "eosinophil", "basophil", "peripheral_blood_smear_rbc_morphology" /*...*/],
        routinesugartests: ["glucose_f", "glucose_pp", "random_blood_sugar", "estimated_average_glucose", "hba1c",/*...*/],
        lipidprofile: ["total_cholesterol", "triglycerides", "hdl_cholesterol", "vldl_cholesterol", "ldl_cholesterol", "chol_hdl_ratio", "ldl_hdl_cho_ratio", /*...*/],
        liverfunctiontest: ["bilirubin_total", "bilirubin_direct", "bilirubin_indirect", "sgot_ast", "sgpt_alt", "alkaline_phosphatase", "total_protein_serum", "albumin_serum", "globulin", "alb_glo_ratio", "gamma_glutamyl_transferase", /*...*/],
        thyroidfunctiontest: ["t3_triiodothyronine", "t4_thyroxine", "tsh",/*...*/],
        autoimmunetest: ["ana_antinuclear_antibody", "anti_ds_dna", "anticardiolipin_antibody", "rheumatoid_factor",/***/],
        renalfunctiontests_and_electrolytes: ["urea", "blood_urea_nitrogen", "sr_creatinine", "egfr", "uric_acid", "sodium", "potassium", "calcium", "phosphorus", "chloride", "bicarbonate",/*...*/],
        coagulationtest: ["prothrombin_time", "pt_inr", "bleeding_time", "clotting_time",/*...*/],
        enzymesandcardiacprofile: ["acid_phosphatase", "adenosine_deaminase", "amylase", "lipase", "troponin_t", "troponin_i", "cpk_total", "cpk_mb", "ecg", "echo", "tmt",/*...*/],
        urineroutine: ["colour", "appearance", "reaction_ph", "specific_gravity", "protein_albumin", "glucose_urine", "ketone_bodies", "urobilinogen", "bile_salts", "bile_pigments", "wbc_pus_cells", "red_blood_cells", "epithelial_cells", "casts", "crystals", "bacteria",/*...*/],
        serology: ["screening_for_hiv_1_and_2", "hbsag", "hcv", "widal", "vdrl", "dengue_ns1ag", "dengue_igg", "dengue_igm",/*...*/],
        motion: ["colour_appearance", "occult_blood", "ova", "cyst", "mucus", "pus_cells", "rbcs", "others",/*...*/],
        routinesensitivitytest: ["culture_urine", "culture_motion", "culture_sputum", "culture_blood"],
        menspack: ["psa"],
        womenspack: ["mammogram", "pap_smear"],
        occupationalprofile: ["audiometry", "pft", "bone_densitometry"],
        otherstest: ["dental", "pathology"],
        ophthalmicreport: ["vision", "color_vision", "cataract_glaucoma"], // CORRECTED spelling and consolidated
        xray: ["xray_chest", "xray_spine", "xray_abdomen", "xray_kub", "xray_pelvis"],
        ct: ["ct_brain", "ct_abdomen", "ct_pelvis", "ct_lungs", "ct_spine"],
        mri: ["mri_brain", "mri_abdomen", "mri_pelvis", "mri_lungs", "mri_spine"],
        usg: ["usg_abdomen", "usg_pelvis", "usg_neck", "usg_kub",/*...*/],
    };

    // The rest of the component logic remains the same...
    const formatLabel = (k) => k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); const [formData, setFormData] = useState({ form: "", param: "", from: "", to: "", status: "", }); const selectedFormParams = formData.form ? formOptions[formData.form] || [] : [];
    useEffect(() => { setFormData((prev) => ({ ...prev, param: "", from: "", to: "", status: "" })); }, [formData.form]); const handleChange = (e) => { setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleSubmit = () => { const { form, param, from, to, status } = formData; if (!form || !param) { alert("Select Form and Parameter."); return; } let fp = { form, param }; let hv = false; if (from !== "" && to !== "") { if (parseFloat(from) > parseFloat(to)) { alert("'From' > 'To'."); return; } fp.from = from; fp.to = to; hv = true; } if (status !== "") { fp.status = status; hv = true; } if (!hv) { alert("Provide Range or Status."); return; } addFilter({ investigation: fp }); setFormData({ form: "", param: "", from: "", to: "", status: "" }); }; const isSubmitDisabled = !formData.form || !formData.param || (formData.from === "" && formData.to === "" && formData.status === "");
    return (<div className="space-y-4"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label htmlFor="form-investigation-filter">Form</label> <select name="form" id="form-investigation-filter" value={formData.form} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"> <option value="">-- Select --</option> {Object.keys(formOptions).map((k) => (<option key={k} value={k}>{formatLabel(k)}</option>))} </select> </div> <div> <label htmlFor="param-investigation-filter">Parameter</label> <select name="param" id="param-investigation-filter" value={formData.param} onChange={handleChange} disabled={!formData.form || selectedFormParams.length === 0} className="w-full p-3 border rounded-lg focus:ring-blue-500 disabled:bg-gray-100"> <option value="">-- Select --</option> {selectedFormParams.map((p) => (<option key={p} value={p}>{formatLabel(p)}</option>))} </select> </div> </div> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <div> <label htmlFor="from-investigation-filter">From (Value)</label> <input type="number" id="from-investigation-filter" name="from" value={formData.from} onChange={handleChange} step="any" className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="Min"/> </div> <div> <label htmlFor="to-investigation-filter">To (Value)</label> <input type="number" id="to-investigation-filter" name="to" value={formData.to} onChange={handleChange} step="any" className="w-full p-3 border rounded-lg focus:ring-blue-500" placeholder="Max"/> </div> <div> <label htmlFor="status-investigation-filter">Status</label> <select name="status" id="status-investigation-filter" value={formData.status} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"> <option value="">-- Select --</option> <option value="normal">Normal</option> <option value="abnormal">Abnormal</option> </select> </div> </div> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}> Add Investigation Filter </button> </div>);
};

const Fitness = ({ addFilter }) => {
    // The keys in this state object now EXACTLY match your Django model field names.
    const initialFormData = {
        tremors: "",
        romberg_test: "",
        acrophobia: "",
        trendelenberg_test: "",
        CO_dizziness: "",
        MusculoSkeletal_Movements: "",
        Claustrophobia: "",
        Tandem: "",
        Nystagmus_Test: "",
        Dysdiadochokinesia: "",
        Finger_nose_test: "",
        Psychological_PMK: "",
        Psychological_zollingar: "",
        // Assuming these other fields also match your backend models
        special_cases: "",
        eye_exam_fit_status: "",
        job_nature: "",
        overall_fitness: "",
    };

    const [formData, setFormData] = useState(initialFormData);

    const NormalorAbnormal = { "": "Any", Normal: "Normal", Abnormal: "Abnormal" };
    const yesNoOptions = { "": "Any", Yes: "Normal", No: "Abnormal" };
    const Positiveoptions = { "": "Any", Positive: "Normal", Negative: "Abnormal" };
    const jobNatureOptions = { "": "Any", "Desk Job": "Desk Job", "Field Work": "Field Work", "Manual Labor": "Manual Labor" };
    const fitnessStatusOptions = { "": "Any", Fit: "Fit", "Conditionally Fit": "Conditionally Fit", Unfit: "Unfit" };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        const activeFilters = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== ""));

        if (Object.keys(activeFilters).length > 0) {
            addFilter({ fitness: activeFilters });
        } else {
            alert("Please select at least one filter criterion.");
        }
        setFormData(initialFormData);
    };

    const isSubmitDisabled = Object.values(formData).every(v => v === "");

    // The JSX `name` and `value` props are updated to match the new state keys.
    return (
        <div className="space-y-6">
            {/* Neurological / Balance Tests */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="tremors-filter">Tremors</label>
                    <select name="tremors" id="tremors-filter" value={formData.tremors} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(Positiveoptions).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="romberg_test-filter">Romberg Test</label>
                    <select name="romberg_test" id="romberg_test-filter" value={formData.romberg_test} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(Positiveoptions).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="trendelenberg_test-filter">Trendelenberg Test</label>
                    <select name="trendelenberg_test" id="trendelenberg_test-filter" value={formData.trendelenberg_test} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(Positiveoptions).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="Tandem-filter">Tandem</label>
                    <select name="Tandem" id="Tandem-filter" value={formData.Tandem} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(NormalorAbnormal).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="Nystagmus_Test-filter">Nystagmus Test</label>
                    <select name="Nystagmus_Test" id="Nystagmus_Test-filter" value={formData.Nystagmus_Test} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(NormalorAbnormal).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="Dysdiadochokinesia-filter">Dysdiadochokinesia</label>
                    <select name="Dysdiadochokinesia" id="Dysdiadochokinesia-filter" value={formData.Dysdiadochokinesia} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(NormalorAbnormal).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="Finger_nose_test-filter">Finger-Nose Test</label>
                    <select name="Finger_nose_test" id="Finger_nose_test-filter" value={formData.Finger_nose_test} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(NormalorAbnormal).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="CO_dizziness-filter">CO Dizziness</label>
                    <select name="CO_dizziness" id="CO_dizziness-filter" value={formData.CO_dizziness} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(yesNoOptions).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
            </div>

            {/* Phobias & Psychological Tests */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="acrophobia-filter">Acrophobia</label>
                    <select name="acrophobia" id="acrophobia-filter" value={formData.acrophobia} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(yesNoOptions).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="Claustrophobia-filter">Claustrophobia</label>
                    <select name="Claustrophobia" id="Claustrophobia-filter" value={formData.Claustrophobia} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(yesNoOptions).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="Psychological_PMK-filter">Psychological PMK</label>
                    <select name="Psychological_PMK" id="Psychological_PMK-filter" value={formData.Psychological_PMK} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(NormalorAbnormal).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="Psychological_zollingar-filter">Psychological Zollingar</label>
                    <select name="Psychological_zollingar" id="Psychological_zollingar-filter" value={formData.Psychological_zollingar} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(NormalorAbnormal).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
            </div>

            {/* Fitness & Job Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="MusculoSkeletal_Movements-filter">Musculoskeletal Movements</label>
                    <select name="MusculoSkeletal_Movements" id="MusculoSkeletal_Movements-filter" value={formData.MusculoSkeletal_Movements} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(NormalorAbnormal).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="eye_exam_fit_status-filter">Eye Exam Fitness</label>
                    <select name="eye_exam_fit_status" id="eye_exam_fit_status-filter" value={formData.eye_exam_fit_status} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(fitnessStatusOptions).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="job_nature-filter">Job Nature</label>
                    <select name="job_nature" id="job_nature-filter" value={formData.job_nature} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(jobNatureOptions).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="overall_fitness-filter">Overall Fitness</label>
                    <select name="overall_fitness" id="overall_fitness-filter" value={formData.overall_fitness} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">
                        {Object.entries(fitnessStatusOptions).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                </div>
            </div>

            {/* Special Cases */}
            <div>
                <label htmlFor="special_cases-filter">Special Cases</label>
                <textarea
                    name="special_cases"
                    id="special_cases-filter"
                    value={formData.special_cases}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-blue-500"
                    rows="3"
                />
            </div>

            <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}>
                Add Fitness Filter
            </button>
        </div>
    );
};

// ========================================================================
// --- CORRECTED Special Cases Filter Component ---
// ========================================================================
const SpecialCasesFilter = ({ addFilter }) => {
    const [selectedValue, setSelectedValue] = useState(""); // "Yes", "No", or "NA"

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
    };

    const handleSubmit = () => {
        if (!selectedValue) {
            alert("Please select an option.");
            return;
        }
        addFilter({ specialCase: selectedValue });
        setSelectedValue(""); // Reset for next time
    };

    const isSubmitDisabled = !selectedValue;

    return (
        <div className="space-y-4">
            <p className="block text-sm font-medium text-gray-700 mb-2">
                Does the record contain any special cases in Fitness or Consultation notes?
            </p>
            <div className="flex items-center space-x-6 py-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="specialCaseOption"
                        value="Yes"
                        checked={selectedValue === "Yes"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-800 font-medium">Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="specialCaseOption"
                        value="No"
                        checked={selectedValue === "No"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-800 font-medium">No</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="radio"
                        name="specialCaseOption"
                        value="NA"
                        checked={selectedValue === "NA"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-gray-400 focus:ring-gray-300"
                    />
                    <span className="text-gray-800 font-medium">N/A</span>
                </label>
            </div>
            <button
                onClick={handleSubmit}
                className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitDisabled}
            >
                Add Special Cases Filter
            </button>
        </div>
    );
};

const MedicalHistoryForm = ({ addFilter }) => {
    // State and options remain the same
    const [ph, setPh] = useState({ smoking: "", alcohol: "", paan: "", diet: "", });
    const [pc, setPc] = useState({ condition: "", status: "", });
    const [fc, setFc] = useState({ condition: "", status: "", relation: "", });
    const [al, setAl] = useState({ drugAllergy: "", foodAllergy: "", otherAllergies: "", });
    const [sh, setSh] = useState({ status: "", });

    const hOpts={"":"Any",Yes:"Yes",No:"No",Cessased:"Cessased"}; const yOpts={"":"Any",Yes:"Yes",No:"No"}; const dOpts={"":"Any","Pure Veg":"Pure Veg","Mixed Diet":"Mixed Diet",Eggetarian:"Eggetarian"}; const cParams=["","HTN","DM","Epileptic","Hyper thyroid","Hypo thyroid","Asthma","CVS","CNS","RS","GIT","KUB","CANCER","Defective Colour Vision","OTHERS","Obstetric","Gynaec"]; const rOpts=["","Father","Mother","Brother","Sister","Son","Daughter","Spouse","Grandparent","Other"];

    // Handlers are unchanged
    const hhc=(e)=>{setPh(p=>({...p,[e.target.name]:e.target.value}))};
    const hpc=(e)=>{setPc(p=>({...p,[e.target.name]:e.target.value}))};
    const hfc=(e)=>{setFc(p=>({...p,[e.target.name]:e.target.value}))};
    const hal=(e)=>{setAl(p=>({...p,[e.target.name]:e.target.value}))};
    const hsh=(e)=>{setSh(p=>({...p,[e.target.name]:e.target.value}))};

    const handleSubmit = () => {
        let cf={};
        // This part is unchanged
        Object.entries(ph).forEach(([k,v])=>{if(v)cf[k]=v});
        Object.entries(al).forEach(([k,v])=>{if(v)cf[k]=v});
        if(sh.status){cf.surgicalHistory=sh.status}
        if(pc.condition&&pc.status){cf[`personal_${pc.condition}`]=pc.status}

        // --- UPDATED Family History Logic ---
        // This is the only logic that changes in this function.
        // It now creates a filter if *any* family history field is filled.
        const { condition, status, relation } = fc;
        if (condition || status || relation) {
            const familyFilter = {};
            if (condition) familyFilter.condition = condition;
            if (status) familyFilter.status = status;
            if (relation) familyFilter.relation = relation;
            cf.familyCondition = familyFilter;
        }
        // --- End of UPDATED Logic ---
        if(Object.keys(cf).length > 0){
            addFilter(cf);
        } else {
            alert("Select at least one criterion.")
        }
        // Reset state
        setPh({smoking:"",alcohol:"",paan:"",diet:""});
        setPc({condition:"",status:""});
        setFc({condition:"",status:"",relation:""});
        setAl({drugAllergy:"",foodAllergy:"",otherAllergies:""});
        setSh({status:""});
    };

    // This check is now simpler to allow for more flexible filter combinations
    const isSubmitDisabled = !Object.values(ph).some(v=>v) &&
        (!pc.condition || !pc.status) &&
        (!fc.condition && !fc.status && !fc.relation) &&
        !Object.values(al).some(v=>v) &&
        !sh.status;

    return (
    <div className="space-y-6">
        {/* All other fieldsets are UNCHANGED */}
        <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2 text-gray-600">Personal Habits</legend><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">{Object.keys(ph).map((k)=>(<div key={k}><label htmlFor={`${k}-h-f`}>{k.charAt(0).toUpperCase()+k.slice(1)}</label><select name={k} id={`${k}-h-f`} value={ph[k]} onChange={hhc} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(k==='diet'?dOpts:hOpts).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>))}</div></fieldset>
        <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2 text-gray-600">Personal Conditions</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"><div><label htmlFor="pc-c-f">Condition</label><select name="condition" id="pc-c-f" value={pc.condition} onChange={hpc} className="w-full p-3 border rounded-lg focus:ring-blue-500">{cParams.map(c=><option key={c} value={c}>{c||'--Select--'}</option>)}</select></div><div><label htmlFor="pc-s-f">Status (Y/N)</label><select name="status" id="pc-s-f" value={pc.status} onChange={hpc} disabled={!pc.condition} className="w-full p-3 border rounded-lg focus:ring-blue-500 disabled:bg-gray-100">{Object.entries(yOpts).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div></div></fieldset>
        <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2 text-gray-600">Allergies</legend><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">{Object.keys(al).map((k)=>(<div key={k}><label htmlFor={`${k}-a-f`}>{k==='drugAllergy'?'Drug':k==='foodAllergy'?'Food':'Other'}</label><select name={k} id={`${k}-a-f`} value={al[k]} onChange={hal} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(yOpts).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>))}</div></fieldset>
        <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2 text-gray-600">Surgical History</legend><div className="grid grid-cols-1 gap-4 mt-2"><div><label htmlFor="sh-f">Any Past Surgeries?</label><select name="status" id="sh-f" value={sh.status} onChange={hsh} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(yOpts).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div></div></fieldset>

        {/* --- THIS IS THE ONLY SECTION WITH A VISUAL CHANGE --- */}
        <fieldset className="border p-4 rounded-md"><legend className="text-lg font-semibold px-2 text-gray-600">Family History</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div><label htmlFor="fc-c-f">Condition</label><select name="condition" id="fc-c-f" value={fc.condition} onChange={hfc} className="w-full p-3 border rounded-lg focus:ring-blue-500">{cParams.map(c=><option key={c} value={c}>{c||'--Any--'}</option>)}</select></div>
                <div><label htmlFor="fc-r-f">Relation</label><select name="relation" id="fc-r-f" value={fc.relation} onChange={hfc} className="w-full p-3 border rounded-lg focus:ring-blue-500">{rOpts.map(r=><option key={r} value={r}>{r||'--Any--'}</option>)}</select></div>
                {/* The "disabled" attribute has been removed from the select below */}
                <div><label htmlFor="fc-s-f">Status (Y/N)</label><select name="status" id="fc-s-f" value={fc.status} onChange={hfc} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(yOpts).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>
            </div>
        </fieldset>
        <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}> Add Medical History Filter(s) </button>
    </div>
    );
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
// const Prescriptions = ({ addFilter }) => {
//     const [formData, setFormData] = useState({ tablets: "", injections: "", creams: "",syrups: "",drops: "",respules: "",lotions: "",fluids: "",powder1: "",suture_procedure: "",dressing: "", others: "" });
//     const tOpts=["","Aspirin","Ibuprofen",/*...*/]; const iOpts=["","Insulin","Adrenaline",/*...*/]; const cOpts=["","Hydrocortisone",/*...*/]; const oOpts=["","Syrup A","Inhaler B",/*...*/];
//     const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
//     const handleSubmit = (e) => { e.preventDefault(); const fd=Object.fromEntries(Object.entries(formData).filter(([k,v])=>v!=="")); if(Object.keys(fd).length>0){addFilter(fd)}else{alert("Select medication.")} setFormData({tablets : "", injections: "", creams: "",syrups:"",drops:"",respules:"",lotions:"",fluids:"",powder1:"",suture_procedure:"",dressing:"", others: ""}); }; const isSubmitDisabled = Object.values(formData).every(v=>v==="");
//     return (<div className="space-y-4"> <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"> <div> <label htmlFor="t-p-f">Tablets</label> <select name="tablets" id="t-p-f" value={formData.tablets} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{tOpts.map(o=><option key={o} value={o}>{o||'--Select--'}</option>)}</select> </div> <div> <label htmlFor="i-p-f">Injections</label> <select name="injections" id="i-p-f" value={formData.injections} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{iOpts.map(o=><option key={o} value={o}>{o||'--Select--'}</option>)}</select> </div> <div> <label htmlFor="c-p-f">Creams</label> <select name="creams" id="c-p-f" value={formData.creams} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{cOpts.map(o=><option key={o} value={o}>{o||'--Select--'}</option>)}</select> </div> <div> <label htmlFor="o-p-f">Others</label> <select name="others" id="o-p-f" value={formData.others} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{oOpts.map(o=><option key={o} value={o}>{o||'--Select--'}</option>)}</select> </div> </div> <button onClick={handleSubmit} className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}>Add Prescription Filter</button> </div>);
// }
const Referrals = ({ addFilter, specialityOptions = [], hospitalOptions = [], doctorOptions = [] }) => {
    const [formData, setFormData] = useState({ referred: "", speciality: "", hospitalName: "", doctorName: "" });
    const yesNoOptions = { "": "Any", Yes: "Yes", No: "No" };
    const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleSubmit = (e) => { e.preventDefault(); const fd=Object.fromEntries(Object.entries(formData).filter(([_,v])=>v!==""&&v!==null)); if(Object.keys(fd).length>0){addFilter({referrals:fd})}else{alert("Select criterion.")} setFormData({referred:"",speciality:"",hospitalName:"",doctorName:""}); }; const isSubmitDisabled = Object.values(formData).every(v=>v==="");
    return (<form onSubmit={handleSubmit} className="space-y-4"> <div> <label htmlFor="referred-filter">Referral Made?</label> <select name="referred" id="referred-filter" value={formData.referred} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500">{Object.entries(yesNoOptions).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                 <div> <label htmlFor="speciality-referral-filter">Speciality</label> <select id="speciality-referral-filter" name="speciality" value={formData.speciality} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">--Select--</option>{specialityOptions.map(o=><option key={o} value={o}>{o}</option>)}</select></div>
                                                                 <div> <label htmlFor="hospitalName-referral-filter">Hospital</label> <select id="hospitalName-referral-filter" name="hospitalName" value={formData.hospitalName} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">--Select--</option>{hospitalOptions.map(o=><option key={o} value={o}>{o}</option>)}</select> </div> </div> <div> <label htmlFor="doctorName-referral-filter">Doctor</label> <select id="doctorName-referral-filter" name="doctorName" value={formData.doctorName} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-blue-500"><option value="">--Select--</option>{doctorOptions.map(o=><option key={o} value={o}>{o}</option>)}</select> </div> <button type="submit" className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={isSubmitDisabled}>Add Referral Filter</button> </form>);
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