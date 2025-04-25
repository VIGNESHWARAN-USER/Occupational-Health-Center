import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../Sidebar";
import Fitness from "./Fitness";
import Investigation from "./Investigation";
import Vaccination from "./Vaccination";
import Vitals from "./Vitals";
import MedicalHistory from "./MedicalHistory";
import { FaSearch, FaUserCircle, FaCamera, FaUpload, FaRedo } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Consultation from "./Consultation";
import Prescription from "./Prescription";
import FormFields from "./FormFeilds";

const NewVisit = () => {
  const accessLevel = localStorage.getItem('accessLevel');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [type, setType] = useState("Employee");
  const [visit, setVisit] = useState("Preventive");
  const [register, setRegister] = useState("");
  const [purpose, setPurpose] = useState("");
  const [activeTab, setActiveTab] = useState("BasicDetails");
  const [data, setdata] = useState([]);
  const [singleData, setsingleData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState({});
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [formDataDashboard, setFormDataDashboard] = useState({
    typeofVisit: "Preventive",
    category: "Employee",
    register: "Pre employment",
    purpose: "Medical Examination"
  });
  const [profileImage, setProfileImage] = useState(null); // State for profile image (data URL)
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null); // New state for image upload
  const [uploadError, setUploadError] = useState(null);
  const [isNewEmployee, setIsNewEmployee] = useState(false); // Flag to indicate a potential new employee

  //New states
  const [annualPeriodicalFields, setAnnualPeriodicalFields] = useState({
    year: "",
    batch: "",
    hospitalName: "",
  });

  const [campFields, setCampFields] = useState({
    campName: "",
    hospitalName: "",
  });



  // const dataMapping = {
  //   Employee: {
  //     Preventive: {
  //       "Pre employment": "Medical Examination",
  //       "Pre employment (Food Handler)": "Medical Examination",
  //       "Pre Placement": "Medical Examination",
  //       "Annual / Periodical": "Medical Examination",
  //       "Periodical (Food Handler)": "Medical Examination",
  //       "Camps (Mandatory)": "Medical Examination",
  //       "Camps (Optional)": "Medical Examination",
  //       "Special Work Fitness": "Periodic Work Fitness",
  //       "Special Work Fitness (Renewal)": "Periodic Work Fitness",
  //       "Fitness After Medical Leave": "Fitness After Medical Leave",
  //       "Fitness After Long Leave": "Fitness After Long Leave",
  //       "Mock Drill": "Mock Drill",
  //       "BP Sugar Check  ( Normal Value)": "BP Sugar Check  ( Normal Value)",
  //       "Retirement Examination": "Retirement Examination",
  //       "Other": "Other"
  //     },
  //     Curative: {
  //       "Illness": "Outpatient",
  //       "Over Counter Illness": "Outpatient",
  //       "Injury": "Outpatient",
  //       "Over Counter Injury": "Outpatient",
  //       "Followup Visits": "Outpatient",
  //       "BP Sugar ( Abnormal Value)": "Outpatient",
  //       "Injury Outside the Premises": "Outpatient",
  //       "Over Counter Injury Outside the Premises": "Outpatient",
  //       "Alcohol Abuse": "Alcohol Abuse",
  //       "Other": "Other"
  //     }
  //   },
  //   Contractor: {
  //     Preventive: {
  //       "Pre employment": "Medical Examination",
  //       "Pre employment (Food Handler)": "Medical Examination",
  //       "Pre Placement Same Contract": "Medical Examination",
  //       "Pre Employment Contract change": "Medical Examination",
  //       "Annual / Periodical": "Medical Examination",
  //       "Periodical (Food Handler)": "Medical Examination",
  //       "Camps (Mandatory)": "Medical Examination",
  //       "Camps (Optional)": "Medical Examination",
  //       "Special Work Fitness": "Periodic Work Fitness",
  //       "Special Work Fitness (Renewal)": "Periodic Work Fitness",
  //       "Fitness After Medical Leave": "Fitness After Medical Leave",
  //       "Fitness Long Medical Leave": "Fitness Long Medical Leave",
  //       "Mock Drill": "Mock Drill",
  //       "BP Sugar Check  ( Normal Value)": "BP Sugar Check  ( Normal Value)",
  //       "Other": "Other"
  //     },
  //     Curative: {
  //       "Illness": "Outpatient",
  //       "Over Counter Illness": "Outpatient",
  //       "Injury": "Outpatient",
  //       "Over Counter Injury": "Outpatient",
  //       "Followup Visits": "Outpatient",
  //       "BP Sugar ( Abnormal Value)": "BP Sugar Check  ( Normal Value)",
  //       "Other": "Other"
  //     },
  //   },
  //   Visitor: {
  //     Preventive: {
  //       "Visitor Fitness": "Visitor Fitness",
  //       "Other": "Other"
  //     },
  //     Curative: {
  //       "Visitor Patient": "Visitor Patient",
  //       "Followup Visits": "Followup Visits",
  //       "Other": "Other"
  //     }
  //   } 
  // };
  const dataMapping = {
    Employee : {
        "Medical Examination":["Pre employment","Pre employment (Food Handler)","Pre Placement","Annual / Periodical","Periodical (Food Handler)","Camps (Mandatory)","Camps (Optional)"],
         "Periodic Work Fitness" :["Special Work Fitness","Special Work Fitness (Renewal)"],
         "Fitness After Medical Leave" :["Fitness After Medical Leave"],
         "Fitness After Long Leave" :["Fitness After Long Leave"],
         "Mock Drill":["Mock Drill"],
         "BP Sugar Check (Normal Value)":["BP Sugar Check (Normal Value)"],
         "Outpatient":["Illness","Over Counter Illness","Injury","Over Counter Injury","Followup Visits","Bp Sugar Chart","Injury Outside the Premises","Over Counter Injury Outside the Premises"],
         "Alcohol Abuse":["Alcohol Abuse"]

      },

      Contractor : {
        "Medical Examination":["Pre employment","Pre employment (Food Handler)","Pre Placement","Pre Employment Contract change","Annual / Periodical","Periodical (Food Handler)","Camps (Mandatory)","Camps (Optional)"],
         "Periodic Work Fitness" :["Special Work Fitness","Special Work Fitness (Renewal)"],
         "Fitness After Medical Leave" :["Fitness After Medical Leave"],
         "Fitness After Long Leave" :["Fitness After Long Leave"],
         "Mock Drill":["Mock Drill"],
         "BP Sugar Check (Normal Value)":["BP Sugar Check (Normal Value)"],
         "Outpatient":["Illness","Over Counter Illness","Injury","Over Counter Injury","Followup Visits","Bp Sugar Chart","Injury Outside the Premises","Over Counter Injury Outside the Premises"],
         "Alcohol Abuse":["Alcohol Abuse"]
      },

      Visitor: {
         "Periodic Work Fitness" :["Visitors Outsider Fitness"],
         "Outpatient":["Visitors Outsider patient","Followup Visits"]
      }

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };
  const [mrdNo, setMRDNo] = useState("");
  console.log(data)
  const handleSubmitEntries = async (e) => {
    e.preventDefault();

    if (!formData.emp_no) {
      alert("Employee number is required!");
      return;
    }

    let extraData = {};

    // Conditionally add fields to the extraData object
    if (register === "Annual / Periodical" || register === "Periodical (Food Handler)") {
      extraData = { ...extraData, ...annualPeriodicalFields };
    }
    if (register.startsWith("Camps")) {
      extraData = { ...extraData, ...campFields };
    }
    if (register.startsWith("Pre Placement Same Contract")) {
      extraData = { ...extraData, ...campFields }; // Corrected: using campFields as contractName is stored there
    }
    if (register.startsWith("Pre Placement Contract change")) {
      extraData = { ...extraData, ...campFields }; // Corrected: using campFields as prevcontractName and old_emp_no are stored there
    }
    if (register.startsWith("Special Work Fitness")) {
      // Assuming you have a state variable to hold the selected reason
      const reasonSelect = document.getElementById("reason");
      const selectedReason = reasonSelect.value;
      extraData = { ...extraData, reason: selectedReason };
    }
    if (register.startsWith("BP Sugar Check")) {
      const bpStatusSelect = document.getElementById("reason");
      const selectedBpStatus = bpStatusSelect.value;
      extraData = { ...extraData, status: selectedBpStatus };
    }
    if (register.startsWith("Illness")) {
      const illnessReasonSelect = document.getElementById("reason");
      const selectedIllnessReason = illnessReasonSelect.value;
      extraData = { ...extraData, reason: selectedIllnessReason };
    }
    if (register.startsWith("BP Sugar Chart")) {
      const bpChartReasonSelect = document.getElementById("reason");
      const selectedBpChartReason = bpChartReasonSelect.value;
      extraData = { ...extraData, reason: selectedBpChartReason };
    }
    if (register.startsWith("Followup Visits")) {
      const followupPurposeSelect = document.getElementById("reason");
      const selectedFollowupPurpose = followupPurposeSelect.value;

      extraData = { ...extraData, purpose: selectedFollowupPurpose };
      // Add the 'others' input if the purpose is 'Others'
      if (selectedFollowupPurpose === "Others") {
        extraData = { ...extraData, purpose_others: purpose }; // Assuming 'purpose' state holds the 'Others' input value
      }
    }

    try {
      const response = await axios.post("https://occupational-health-center-1.onrender.com/addEntries", {
        formDataDashboard,
        extraData,
        formData
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        console.log(response.data.mrdNo);
        setMRDNo(response.data.mrdNo)
        alert("Data submitted successfully!");
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error); // Show user-friendly message
      } else {
        console.error("Error submitting form:", error);
        alert("Error submitting data!");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedformData = { ...formData, role: type }
      console.log(updatedformData)
      const response = await axios.post("https://occupational-health-center-1.onrender.com/addbasicdetails", updatedformData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        alert("Data submitted successfully!");
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting data!");
    }
  };

  const handleSearch = async () => {  // Make handleSearch async
    if (searchId.trim() === "") {
      setFilteredEmployees(employees);
      setdata([]); // Reset data when no input
      localStorage.removeItem("selectedEmployee"); // Remove saved employee
      setFormData({});//clears the input fields
      setUploadedImage(null);
      setIsNewEmployee(false);
    } else {
      try {
        const filtered = employees.filter(emp =>
          emp.aadhar.toLowerCase() === searchId.toLowerCase()
        );

        if (filtered.length > 0) {
          // Get the latest record by sorting by id (or updated_at)
          const latestEmployee = filtered.sort((a, b) => b.id - a.id)[0];
          console.log("Latest Employee:", latestEmployee);
          setFilteredEmployees([latestEmployee]);
          setdata([latestEmployee]);
          setsingleData([latestEmployee]);
          setFormData(latestEmployee);
          const selectedType = latestEmployee.role;
          setType(selectedType);
          setRegister(""); // Reset register
          setPurpose("");   // Reset purpose
          setFormDataDashboard(prev => ({ ...prev, category: selectedType, register: "", purpose: "" }));
          localStorage.setItem("selectedEmployee", JSON.stringify(latestEmployee));
          setProfileImage(latestEmployee.profileImage || null); // Set profile image if it exists
          if (latestEmployee.profilepic_url) { //Use profilepic_url here directly since its already fully constructed in backend
            console.log("profilepic_url:", latestEmployee.profilepic_url);
            setUploadedImage(latestEmployee.profilepic_url); // profilepic_url is full url
          }
          setIsNewEmployee(false); // Reset the new employee flag


        } else {
          // Employee not found. Ask if it's a new employee with a duplicate ID.
          const isDuplicateNew = window.confirm(
            "Aadhar ID not found, is this the Aadhar Number for a new employee?"
          );

          if (isDuplicateNew) {
            // Initialize form with the entered employee ID and reset other fields.
            setFormData({
              aadhar: searchId,
              pernament_address: "",
              residential_address: "",
              permanent_area: "",
              residential_area: "",
              bloodgrp: "",
              coagulationtest: {},
              consultation: {},
              dashboard: {},
              department: "",
              designation: "",
              dob: "",
              other_site_id: "",
              country_id: "",
              doj: "",
              emergency_contact_person: "",
              emergency_contact_phone: "",
              emergency_contact_relation: "",
              emp_no: "",
              employer: "",
              entry_date: "",
              enzymesandcardiacprofile: {},
              fitnessassessment: {},
              haematology: {},
              id: "",
              identification_marks1: "",
              identification_marks2: "",
              job_nature: "",
              lipidprofile: {},
              liverfunctiontest: {},
              mail_id_Emergency_Contact_Person: "",
              mail_id_Office: "",
              mail_id_Personal: "",
              marital_status: "",
              menspack: {},
              moj: "",
              motion: {},
              mri: {},
              msphistory: {},
              name: "",
              permanent_nationality: "",
              residential_nationality: "",
              opthalamicreport: {},
              phone_Office: "",
              phone_Personal: "",
              prescription: {},
              profilepic: "",
              profilepic_url: "",
              purpose: "",
              register: "",
              renalfunctiontests_and_electrolytes: {},
              role: type,
              routinesugartests: {},
              serology: {},
              sex: "",
              guardian: "",
              permanent_state: "",
              residential_state: "",
              thyroidfunctiontest: {},
              type: "",
              type_of_visit: "",
              urineroutine: {},
              usg: {},
              vaccination: {},
              significant_notes: {},
              vitals: {}
            });
            setFilteredEmployees([formData]);
            setdata([formData]);
            setsingleData([formData]);
            localStorage.setItem("selectedEmployee", JSON.stringify(formData));
            setProfileImage(null);
            setUploadedImage(null);
            setIsNewEmployee(true);
          } else {
            setFilteredEmployees([]);
            setdata([]);
            setsingleData([]);
            setFormData({});
            localStorage.removeItem("selectedEmployee");
            setProfileImage(null);
            setUploadedImage(null);
            setIsNewEmployee(false);
          }

        }
      } catch (error) {
        console.error("Error during search:", error);
        alert("An error occurred during search.");
      }
    }
  };

  const handleClear = () => {
    localStorage.removeItem("selectedEmployee");
    setdata([]);
    setFormData({}); // Clear the form
    setSearchId("");
    setProfileImage(null); // Clear profile image
    setUploadedImage(null);
    setIsNewEmployee(false);
  };

  const { search, reference } = useLocation().state || {};

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        localStorage.removeItem("selectedEmployee");
        const response = await axios.post("https://occupational-health-center-1.onrender.com/userData");
        console.log("API Response Data:", response.data.data);
        setEmployees(response.data.data);
        console.log(response.data.data);
        setFilteredEmployees(response.data.data);

        const savedEmployee = localStorage.getItem("selectedEmployee");
        if (savedEmployee) {
          const parsedEmployee = JSON.parse(savedEmployee);
          setdata([parsedEmployee]);
          setFormData(parsedEmployee);
          setProfileImage(parsedEmployee.profileImage || null);
        }

        if (reference && search) {
          setSearchId(search);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);


  // Update Register options and Purpose dynamically
  const getRegisterOptions = () => {
    return Object.values(dataMapping[type]?.[selectedPurpose] || {});
  };

    // --- CORRECTED Handler for Register Dropdown Change ---
    const handleRegisterChange = (e) => {
      const selectedRegister = e.target.value;
      console.log("Selected Register:", selectedRegister);
  
      // Update the state variable controlling the dropdown's value
      setRegister(selectedRegister);
  
      // Update ONLY the 'register' field in the dashboard state object
      // DO NOT touch the 'purpose' field here. It was set by handlePurposeChange.
      setFormDataDashboard(prev => ({
          ...prev,
          register: selectedRegister
          // REMOVED: purpose: autoPurpose
      }));
  
      // Reset additional fields when register changes (This part is correct)
      setAnnualPeriodicalFields({ year: "", batch: "", hospitalName: "" });
      setCampFields({ campName: "", hospitalName: "", contractName: "", prevcontractName: "", old_emp_no: "" }); // Ensure all conditional fields are reset if applicable
    };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    setRegister(""); // Reset register
    setPurpose("");   // Reset purpose
    setFormDataDashboard(prev => ({ ...prev, category: selectedType, register: "", purpose: "" })); // Update dashboard data and reset
    // Also clear formData when the type changes, to avoid unexpected behavior
    setFormData({ aadhar: searchId, role: selectedType });
  };

  const handleVisitChange = (e) => {
    const selectedVisit = e.target.value;
    setVisit(selectedVisit);
    setRegister(""); // Reset register
    setPurpose("");   // Reset purpose
    setFormDataDashboard(prev => ({ ...prev, typeofVisit: selectedVisit, register: "", purpose: "" })); // Update dashboard data and reset
  };

  const [age, setAge] = useState('');

  useEffect(() => {
    if (formData.dob) {
      calculateAge(formData.dob);
    }
  }, [formData.dob]);

  const calculateAge = (dob) => {
    const today = new Date();
    const [year, month, day] = dob.split('-');
    console.log(day)
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setAge(age);
  };

  const tabs = [
    { id: "BasicDetails", label: "Basic Details" },
    { id: "Vitals", label: "Vitals" },
    register !== "Alcohol Abuse" && { id: "MedicalHistory", label: "Medical/Surgical/Personal History" },
    register !== "Alcohol Abuse" && purpose !== "Periodic Work Fitness" && register !== "Fitness After Medical Leave" && (register === "Followup Visits" || visit !== "Curative") && { id: "Investigations", label: "Investigations" },
    register !== "Alcohol Abuse" && { id: "Vaccination", label: "Vaccination" },
    register !== "Alcohol Abuse" && visit === "Preventive" && register !== "Camps (Optional)" && { id: "Fitness", label: "Fitness" },
    register !== "Alcohol Abuse" && visit === "Curative" && { id: "Consultation", label: "Consultation and Referral" },
     visit === "Curative" && { id: "Prescription", label: "Prescription" },
    register === "Alcohol Abuse" &&   { id: "formFields", label: "Form Fields" },

  ].filter(Boolean); // Filter out any `false` or `null` values (from the conditional rendering)


  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please upload an image file.');
        return;
      }

      setUploadError(null); // Clear any previous errors
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handlePurposeChange = (e) =>{
    const purpose = e.target.value;
    console.log("purpose : ",purpose);
    if(purpose === "Outpatient" || purpose === "Alcohol Abuse"){
      setVisit("Curative");
    }else{
      setVisit("Preventive");
    }
    setSelectedPurpose(purpose);
  }
  const purposeOptions = ["Medical Examination","Periodic Work Fitness","Fitness After Medical Leave","Fitness After Long Leave",
    "Mock Drill","BP Sugar Check  ( Normal Value)","Outpatient","Alcohol Abuse"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "BasicDetails":
        return (
          <div className="mt-8 p-4">
            <h2 className="text-lg font-medium mb-4">Basic Details</h2>
            <div className="grid grid-cols-3 mb-16 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 ">Name</label>
                <input
                  name="name"
                  value={formData.name || ''} // Ensure default value to avoid uncontrolled component warning
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your full name"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Father / Spouse Name</label>
                <input
                  name="guardian"
                  value={formData.guardian || ''} // Ensure default value to avoid uncontrolled component warning
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter guardian name"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Date of Birth</label>
                <input
                  name="dob"
                  value={formData.dob || ''}
                  onChange={handleChange}
                  type="date"
                  placeholder="DD/MM/YYYY"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Age</label>
                <input
                  type="text"
                  value={age}
                  readOnly
                  className="px-4 py-2 w-full bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Sex</label>
                <select
                  name="sex"
                  value={formData.sex || ""}
                  onChange={handleChange}
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Aadhar No.</label>
                <input
                  name="aadhar"
                  value={formData.aadhar || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter 12-digit Aadhar No."
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Blood Group</label>
                <input
                  name="bloodgrp"
                  value={formData.bloodgrp || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g., A+, O-"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Identification Marks 1</label>
                <input
                  name="identification_marks1"
                  value={formData.identification_marks1 || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter any visible identification marks"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Identification Marks 2</label>
                <input
                  name="identification_marks2"
                  value={formData.identification_marks2 || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter any visible identification marks"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {type === "Visitor" ? (
                <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">Other site ID</label>
                  <input
                    name="other_site_id"
                    value={formData.other_site_id || ''}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter Other Site ID"
                    className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">Country ID</label>
                  <input
                    name="country_id"
                    value={formData.country_id || ''}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter Other Site ID"
                    className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 ">Marital Status</label>
                  <select
                    name="marital_status"
                    value={formData.marital_status || ""}
                    onChange={handleChange}
                    className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                    <option>Separated</option>
                    <option>Other</option>
                  </select>
                </div>
              )}
            </div>

            {type === "Visitor" && (
              <>
                <h2 className="text-lg font-medium my-4">Visit Details</h2>
                <div className="grid grid-cols-3 mb-16 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">Name of Organization</label>
                    <input
                      name="organization"
                      value={formData.organization || ''}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter organization name"
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address of Organization</label>
                    <input
                      name="addressOrganization"
                      value={formData.addressOrganization || ""}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter organization address"
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">Visiting Department</label>
                    <input
                      name="visiting_department"
                      value={formData.visiting_department || ''}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter visiting department"
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">Visiting Date From</label>
                    <input
                      name="visiting_date_from"
                      value={formData.visiting_date_from || ''}
                      onChange={handleChange}
                      type="date"
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">Stay in Guest House</label>
                    <select
                      name="stay_in_guest_house"
                      value={formData.stay_in_guest_house || ""}
                      onChange={handleChange}
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">Visiting Purpose</label>
                    <select name="visiting_purpose"
                      value={formData.visiting_purpose || ''}
                      onChange={handleChange}
                      id="visiting_purpose"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                      <option value="">Select</option>
                      <option>Meeting</option>
                      <option>Audit</option>
                      <option>Training</option>
                      <option>Govt Official</option>
                      <option>Medical Camp</option>
                      <option>Medical Inspection</option>
                      <option>Guest for an event</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {(type === "Contractor" || type === "Employee") && (
              <>
                <h2 className="text-lg font-medium my-4">Employment Details</h2>
                <div className="grid grid-cols-3 mb-16 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">Employee Number</label>
                    <input
                      name="emp_no"
                      value={formData.emp_no || ''}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter employee number"
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {type === "Contractor" ? "Contract Employer" : "Employer"}
                    </label>
                    <input
                      name="employer"
                      value={formData.employer || ""}
                      onChange={handleChange}
                      type="text"
                      placeholder={type === "Contractor" ? "Enter contract employer name" : "Enter employer name"}
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {type === "Employee" &&
                    (<div>
                      <label className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter location"
                        className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>)
                  }

                  {type === "Contractor" &&
                    (<div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                        <select name="contractor_status" value={formData.contractor_status || ""}
                        onChange={handleChange}  id="" className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                          <option value="">Select</option>
                          <option value="mbc">MBC</option>
                          <option value="jbc">JBC</option>
                          <option value="jbn">JBN</option>
                          <option value="shutdown">Shutdown</option>
                        </select>
                    </div>)
                  }
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">Designation</label>
                    <input
                      name="designation"
                      value={formData.designation || ''}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter job designation"
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">Department</label>
                    <input
                      name="department"
                      value={formData.department || ''}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter department"
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">Nature of Job</label>
                    <input
                      name="job_nature"
                      value={formData.job_nature || ''}
                      onChange={handleChange}
                      type="text"
                      placeholder="e.g., Height Works, Fire Works"
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">Date of Joining</label>
                    <input
                      name="doj"
                      value={formData.doj || ''}
                      onChange={handleChange}
                      type="date"
                      placeholder="Enter Date of Joining"
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {type !== "Contractor" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 ">Mode of Joining</label>
                      <select
                        name="moj"
                        value={formData.moj || ""}
                        onChange={handleChange}
                        className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option>New Joinee</option>
                        <option>Transfer</option>
                      </select>
                    </div>
                  )}
                </div>
              </>
            )}

            <h2 className="text-lg font-medium my-4">Contact Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Phone (Personal)</label>
                <input
                  name="phone_Personal"
                  value={formData.phone_Personal || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter 10-digit phone number"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Mail Id (Personal)</label>
                <input
                  name="mail_id_Personal"
                  value={formData.mail_id_Personal || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter the personal mail"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Person</label>
                <input
                  name='emergency_contact_person'
                  value={formData.emergency_contact_person || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter Name of Contact Person"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Phone (Office)</label>
                <input
                  name='phone_Office'
                  value={formData.phone_Office || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter office mobile number"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Mail Id (Office)</label>
                <input
                  name='mail_id_Office'
                  value={formData.mail_id_Office || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter office mail id"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Relation</label>
                <input
                  name='emergency_contact_relation'
                  value={formData.emergency_contact_relation || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g., Father, Spouse"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Mail Id (Emergency Contact Person)</label>
                <input
                  name='mail_id_Emergency_Contact_Person'
                  value={formData.mail_id_Emergency_Contact_Person || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter mail"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Emergency Contact Phone</label>
                <input
                  name='emergency_contact_phone'
                  value={formData.emergency_contact_phone || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter Emergency Contact number"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>


            </div>
            <h2 className="text-lg mt-6 font-medium my-4">Permanent Address</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Address</label>
              <textarea
                name='permanent_address'
                value={formData.permanent_address || ''}
                onChange={handleChange}
                placeholder="Enter full address"
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 ">Village/Town/City</label>
                <input
                  name='permanent_area'
                  value={formData.permanent_area || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter Area"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">State</label>
                <input
                  name='permanent_state'
                  value={formData.permanent_state || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter State"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Nationality</label>
                <input
                  name='permanent_nationality'
                  value={formData.permanent_nationality || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter Nationality"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            


            <h2 className="text-lg mt-6 font-medium my-4">Residential Address</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 ">Address</label>
              <textarea
                name='residential_address'
                value={formData.residential_address || ''}
                onChange={handleChange}
                placeholder="Enter full address"
                className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 ">Village/Town/City</label>
                <input
                  name='residential_area'
                  value={formData.residential_area || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter Area"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">State</label>
                <input
                  name='residential_state'
                  value={formData.residential_state || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter State"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Nationality</label>
                <input
                  name='residential_nationality'
                  value={formData.residential_nationality || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter Nationality"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            


            <button onClick={handleSubmit} className="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">
              Add Basic Details
            </button>
          </div>
        );
      case "Fitness":
        return <Fitness data={data} type={visit}/>;
      case "Investigations":
        return <Investigation data={singleData} />;
      case "Vaccination":
        return <Vaccination data={data} />;
      case "Vitals":
        return <Vitals data={data} type={type} />;
      case "MedicalHistory":
        return <MedicalHistory data={data} />;
      case "Consultation":
        return <Consultation data={data} type={visit} />;
      case "Prescription":
        return <Prescription data={data} />;
      case "formFields":
        return <FormFields formType={"alcoholCheck"} />;
      default:
        return <div>Unknown Tab</div>;
    }

  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true); // Set webcam to active if stream is obtained
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  useEffect(() => {
    let stream;
    if (isWebcamActive) {
      startWebcam();
    }

    return () => {
      // Cleanup on unmount.  Important to stop the webcam stream!
      if (videoRef.current && videoRef.current.srcObject) {
        stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsWebcamActive(false);
      }
    };

  }, [isWebcamActive]); // Depend on 'image' to restart webcam if needed

  const handleProfileIconClick = () => {
    // Toggle webcam state
    setProfileImage(null)
    setUploadedImage(null)
    setIsWebcamActive(!isWebcamActive);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      // Check if the video is ready to play
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataURL = canvas.toDataURL('image/jpeg'); // Or 'image/png'
        setProfileImage(dataURL);
        setIsWebcamActive(false); // Deactivate webcam after capture
        // Stop the webcam stream after capturing
        if (video.srcObject) {
          const stream = video.srcObject;
          stream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
        }
      }
      else {
        // Video not ready.
        console.warn("Video stream not ready yet.  Trying again...");
        // Consider setting a timer to retry or display a message to the user.
      }
    }

  };

  const handleUpload = async () => {
    if (profileImage) {
      console.log("Uploading image:", profileImage);
      try {
        // Convert Data URL to Blob
        const blob = dataURLtoBlob(profileImage);
        const formDataImg = new FormData();
        formDataImg.append('image', blob, `profile_${formData.emp_no}.jpg`);
        const updateResponse = await axios.put(`https://occupational-health-center-1.onrender.com/updateProfileImage/${formData.aadhar}`, { profileImage: profileImage, formData });
        if (updateResponse.status === 200) {
          alert("Profile image updated successfully!");
          // Refresh employee list or update local state
          const fetchResponse = await axios.post("https://occupational-health-center-1.onrender.com/userData");
          setEmployees(fetchResponse.data.data);
          setFilteredEmployees(fetchResponse.data.data);
          console.log(fetchResponse.data.data);
          setdata([{ ...formData, profileImage: profileImage }]); // Update local
          // Function to convert Data URL to Blob

        }
        // }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading uploading image!");
      }
    }

  };
  // Function to convert Data URL to Blob
  const dataURLtoBlob = (dataURL) => {
    // Convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURL.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURL.split(',')[1]);
    else
      byteString = unescape(dataURL.split(',')[1]);

    // Separate out the mime component
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

    // Write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });

  }

  const handleRetake = () => {
    setProfileImage(null); // Clear the image to reactivate the webcam
    setIsWebcamActive(true);
  };

  if (accessLevel === "nurse" || accessLevel === "doctor") {
    return (
      <div className="h-screen flex bg-[#8fcadd]">
        <Sidebar />
        <div className="w-4/5 p-8 overflow-y-auto">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">New Visit</h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-1 bg-white rounded-lg overflow-y-auto">
            {(loading) ? (
              <div className="flex justify-center p-6 items-center">
                <div className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
              </div>
            ) : (<motion.div className="bg-white p-8 rounded-lg shadow-lg">

              <div className="bg-white rounded-lg w-full p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  {uploadedImage ? ( // Display the uploaded image
                    <img
                      src={uploadedImage}
                      alt="Profile"
                      className="rounded-full w-44 h-44 object-cover mr-4"
                    />
                  ) : profileImage != null ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="rounded-full w-44 h-44 object-cover mr-4" // Increased size to w-20 h-20
                    />
                  ) : (
                    <>
                      {isWebcamActive ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            className="w-44 h-44 rounded-full object-cover" // Increased size to w-20 h-20
                          />
                        </>
                      ) : (
                        <div className="relative">
                          <FaUserCircle
                            className="text-blue-600 w-44 h-44 mr-4 cursor-pointer" // Increased icon size to 6xl
                            onClick={handleProfileIconClick}
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex flex-col space-y-2">
                    {isWebcamActive && (
                      <button
                        onClick={captureImage}
                        className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                      >
                        <FaCamera className="mr-2" /> Capture
                      </button>
                    )}
                    {profileImage && (
                      <>
                        <button
                          onClick={handleUpload}
                          className="flex items-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                        >
                          <FaUpload className="mr-2" /> Upload
                        </button>
                        <button
                          onClick={handleRetake}
                          className="flex items-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                        >
                          <FaRedo className="mr-2" /> Retake
                        </button>
                      </>
                    )}
                    {!profileImage && !isWebcamActive && (
                      <>
                        <div className="flex flex-col space-y-2">
                         
                          <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                          />
                          {uploadError && <p className="text-red-500">{uploadError}</p>}
                        </div>
                        <button
                          onClick={handleProfileIconClick}
                          className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                          <FaCamera className="mr-2" /> Take Picture
                        </button>
                      </>
                    )}
                  </div>
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="w-full ms-4 flex items-center mb-8 space-x-4">
                    <div className="relative flex items-center">

                      {/* Search Icon */}
                      <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-6 text-gray-400" />

                      {/* Input Field */}
                      <input
                        type="text"
                        placeholder="Search by Aadhar Number"
                        className="w-full bg-white py-3 pl-12 pr-5 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-indigo-400 hover:shadow-md placeholder-gray-400 text-gray-700 transition-all duration-300 ease-in-out"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-grow">
                      <button
                        onClick={handleSearch}
                        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                      >
                        Get
                      </button>
                      <button
                        onClick={handleClear}
                        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ml-2 mr-2"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleSubmitEntries}
                        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                      >
                        Add Entry
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> {/* Changed to 3 columns */}
                   {/* Type (Category) Selection */}
                   <div>
                     <label htmlFor="typeSelect" className="block text-gray-700 text-sm font-bold mb-2">
                       Select Type <span className="text-red-500">*</span>
                     </label>
                     <select
                       id="typeSelect"
                       className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                       value={type}
                       onChange={handleTypeChange}
                     >
                       <option value="Employee">Employee</option>
                       <option value="Contractor">Contractor</option>
                       <option value="Visitor">Visitor</option>
                     </select>
                   </div>

                   {/* Purpose Dropdown - Controls selectedPurpose and determines visit type */}
                   <div>
                       <label className="block text-gray-700 text-sm font-bold mb-2">
                         Purpose <span className="text-red-500">*</span>:
                       </label>
                       <select
                         id="purpose"
                         className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                         value={selectedPurpose} // Controlled by selectedPurpose state
                         onChange={handlePurposeChange} // Use the updated handler
                         required
                       >
                         <option value="">Select Purpose</option>
                         {purposeOptions.map(option => ( // Use purposeOptions array
                           <option key={option} value={option}>{option}</option>
                         ))}
                       </select>
                     </div>


                   {/* Type of Visit Display (Readonly) - Shows determined visit type */}
                     <div>
                         <label className="block text-gray-700 text-sm font-bold mb-2">
                           Type of Visit
                         </label>
                         <input
                           type="text"
                           value={visit} // Display the derived visit state ('Preventive' or 'Curative')
                           placeholder="Determined by Purpose"
                           readOnly
                           className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-700" // Adjusted style for readonly
                         />
                     </div>

                     {/* Register Selection - Options depend on type and determined visit */}
                     <div>
                       <label className="block text-gray-700 text-sm font-bold mb-2">
                         Select Register <span className="text-red-500">*</span>
                       </label>
                       <select
                         className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm bg-white"
                         value={register}
                         onChange={handleRegisterChange}
                         required
                        //  disabled={visit} // Disable if visit type hasn't been determined yet
                       >
                         <option value="">Select Register</option>
                         {getRegisterOptions().map((option) => ( 
                          
                          //  {console.log(option);}
                           <option key={option} value={option}>{option}</option>
                         ))}
                       </select>
                     </div>

                 </div> {/* End of 3-column grid */}

                {/* Conditionally Rendered Fields */}
                {(register === "Annual / Periodical" || register === "Periodical (Food Handler)") && (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        value={annualPeriodicalFields.year}
                        onChange={(e) => setAnnualPeriodicalFields(prev => ({ ...prev, year: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Batch</label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        value={annualPeriodicalFields.batch}
                        onChange={(e) => setAnnualPeriodicalFields(prev => ({ ...prev, batch: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Hospital Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        value={annualPeriodicalFields.hospitalName}
                        onChange={(e) => setAnnualPeriodicalFields(prev => ({ ...prev, hospitalName: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {register.startsWith("Camps") && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Camp Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        value={campFields.campName}
                        onChange={(e) => setCampFields(prev => ({ ...prev, campName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Hospital Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        value={campFields.hospitalName}
                        onChange={(e) => setCampFields(prev => ({ ...prev, hospitalName: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {register.startsWith("Pre Placement Same Contract") && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Contract Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        value={campFields.contractName}
                        onChange={(e) => setCampFields(prev => ({ ...prev, contractName: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {register.startsWith("Pre Placement Contract change") && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Previous Contract Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        value={campFields.prevcontractName}
                        onChange={(e) => setCampFields(prev => ({ ...prev, prevcontractName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Employee number</label>
                      <input
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        value={campFields.old_emp_no}
                        onChange={(e) => setCampFields(prev => ({ ...prev, old_emp_no: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {register.startsWith("Special Work Fitness") && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Job Nature (Reason)</label>
                      <select name="reason" id="reason" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                        <option value="">Select</option>
                        <option value="Height Work">Height</option>
                        <option value="Gas Line Work">Gas Line</option>
                        <option value="Confined Space Work">Confined Space</option>
                        <option value="SCBA Rescue Work">SCBA Rescuer</option>
                        <option value="Fire Rescue Work">Fire Rescuer</option>
                        <option value="Lone Man Work">Lone Worker</option>
                        <option value="Fisher Man Work">Fisher Man</option>
                        <option value="Snake Catcher Work">Snake Catcher</option>
                      </select>
                    </div>
                  </div>
                )}

                {register.startsWith("BP Sugar Check") && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Patient Status</label>
                      <select name="reason" id="reason" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                        <option value="">Select</option>
                        <option value="Normal People">Normal People</option>
                        <option value="Patient under control">Patient under control</option>
                      </select>
                    </div>
                  </div>
                )}

                {register.startsWith("Illness") && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Job Nature (Reason)</label>
                      <select name="reason" id="reason" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                        <option value="">Select</option>
                        Newly detected BP / DM , Patient not in control
                        <option value="Newly detected BP / DM">Newly detected BP / DM</option>
                        <option value="Patient not in control">Patient not in control</option>
                      </select>
                    </div>
                  </div>
                )}

                {register.startsWith("BP Sugar Chart") && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Job Nature (Reason)</label>
                      <select name="reason" id="reason" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                        <option value="">Select</option>
                        <option value="Newly detected">Newly detected</option>
                        <option value="Patient <150 <100">Patient &lt; 150 &lt; 100</option>
                      </select>
                    </div>
                  </div>
                )}

                {register.startsWith("Followup Visits") && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Purpose</label>
                      <select name="reason" id="reason" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                        <option value="">Select</option>
                        <option value="Dressing">Dressing</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Suture Removal">Suture Removal</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    {purpose === "others" && (
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Others</label>
                        <input
                          type="text"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
                <p className="text-gray-500 italic">MRD Number : {mrdNo || "Make add entry to generate MRD Number"}</p>
                <hr className="h-4 text-blue-100" />
                <div className="border-b border-gray-200 mb-4">
                  <nav className="relative flex justify-evenly space-x-4 bg-gray-50 p-3 rounded-lg shadow-sm" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        aria-selected={activeTab === tab.id}
                        className={`relative whitespace-nowrap font-bold py-2 px-3 font-medium text-sm focus:outline-none transition-all duration-300 ease-in-out
                  ${activeTab === tab.id
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"}`}
                      >
                        {tab.label}
                        {/* Active Tab Indicator */}
                        <span
                          className={`absolute left-0 bottom-0 h-1 w-full rounded-full bg-blue-500 transition-all duration-300 ease-in-out
                    ${activeTab === tab.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
                        ></span>
                      </button>
                    ))}
                  </nav>
                  {renderTabContent()}
                </div>
              </div>
            </motion.div>)}
          </motion.div>
        </div>
      </div>
    );

  }
  else {
    return (
      <section className="bg-white h-full flex items-center dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-900 md:text-4xl dark:text-white">404</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <button onClick={() => navigate(-1)} className="inline-flex text-white bg-primary-600 hover:cursor-pointer hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back</button>
          </div>
        </div>
      </section>
    );
  }

};

export default NewVisit;




