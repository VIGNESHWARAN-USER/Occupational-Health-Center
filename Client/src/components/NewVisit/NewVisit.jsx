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
  const [OtherRegister, setOtherRegister] = useState("");
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

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    if (!e.target.files || !e.target.files[0]) {
      setUploadError('No file selected');
      return;
    }

    const file = e.target.files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file.');
      return;
    }

    setUploadError(null); // Clear any previous errors
    const reader = new FileReader();
    
    reader.onloadend = async () => {
      try {
        const imageData = reader.result;
        setUploadedImage(imageData);
        
        if (!formData.aadhar) {
          alert("Please search and get employee data by Aadhar number first");
          return;
        }

        const updateResponse = await axios.put(`https://occupational-health-center-1.onrender.com/updateProfileImage/${formData.aadhar}`, { 
          profileImage: imageData, 
          formData 
        });

        if (updateResponse.status === 200) {
          alert("Profile image updated successfully!");
          // Refresh employee list or update local state
          const fetchResponse = await axios.post("https://occupational-health-center-1.onrender.com/userData");
          setEmployees(fetchResponse.data.data);
          setFilteredEmployees(fetchResponse.data.data);
          setdata([{ ...formData, profileImage: imageData }]);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image!");
      }
    };

    reader.onerror = () => {
      setUploadError('Error reading file');
    };

    reader.readAsDataURL(file);
  };

  const dataMapping = {
    Employee: {
      Preventive: {
        "Pre employment": "Medical Examination",
        "Pre employment (Food Handler)": "Medical Examination",
        "Pre Placement": "Medical Examination",
        "Annual / Periodical": "Medical Examination",
        "Periodical (Food Handler)": "Medical Examination",
        "Retirement medical examination": "Medical Examination",
        "Camps (Mandatory)": "Medical Examination",
        "Camps (Optional)": "Medical Examination",
        "Special Work Fitness": "Periodic Work Fitness",
        "Special Work Fitness (Renewal)": "Periodic Work Fitness",
        "Fitness After Medical Leave": "Fitness After Medical Leave",
        "Fitness After Personal Long Leave": "Fitness After Personal Long Leave", 
        "Mock Drill": "Mock Drill",
        "BP Sugar Check  ( Normal Value)": "BP Sugar Check  ( Normal Value)",
        "Follow Up Visits":"Follow Up Visits",
        "Other": "Other",
      },
      Curative: {
        "Illness": "Outpatient",
        "Over Counter Illness": "Outpatient",
        "Injury": "Outpatient",
        "Over Counter Injury": "Outpatient",
        "Follow Up Visits": "Follow Up Visits",
        "BP Sugar Chart": "Outpatient",
        "Injury Outside the Premises": "Outpatient",
        "Over Counter Injury Outside the Premises": "Outpatient",
        "Alcohol Abuse": "Alcohol Abuse",
        "Other": "Other",
      }
    },
    Contractor: {
      Preventive: {
        "Pre employment": "Medical Examination",
        "Pre employment (Food Handler)": "Medical Examination",
        "Pre Placement (Same Contract)": "Medical Examination",
        "Pre Placement (Contract change)": "Medical Examination",
        "Annual / Periodical": "Medical Examination",
        "Periodical (Food Handler)": "Medical Examination",
        "Camps (Mandatory)": "Medical Examination",
        "Camps (Optional)": "Medical Examination",
        "Special Work Fitness": "Periodic Work Fitness",
        "Special Work Fitness (Renewal)": "Periodic Work Fitness",
        "Fitness After Medical Leave": "Fitness After Medical Leave",
        "Fitness Personal Long Leave": "Fitness Personal Long Leave",
        "Mock Drill": "Mock Drill",
        "BP Sugar Check  ( Normal Value)": "BP Sugar Check  ( Normal Value)",
        "Follow Up Visits":"Follow Up Visits",
        "Other": "Other",
      },
      Curative: {
        "Illness": "Outpatient",
        "Over Counter Illness": "Outpatient",
        "Injury": "Outpatient",
        "Over Counter Injury": "Outpatient",
        "Follow Up Visits": "Outpatient",
        "BP Sugar ( Abnormal Value)": "BP Sugar Check  ( Abnormal Value)",
        "Injury Outside the Premises": "Outpatient",
        "Over Counter Injury Outside the Premises": "Outpatient",
        "Alcohol Abuse": "Alcohol Abuse",
        "Other": "Other",
      },
    },
    Visitor: {
      Preventive: {
        "Fitness": "Fitness",
        "BP Sugar ( Normal Value)": "BP Sugar Check  ( Normal Value)"
      },
      Curative: {
        "Illness": "Outpatient",
        "Over Counter Illness": "Outpatient",
        "Injury": "Outpatient",
        "Over Counter Injury": "Outpatient",
        "Follow Up Visits": "Outpatient",
        "BP Sugar ( Abnormal Value)": "BP Sugar Check  ( Abnormal Value)",
        "Injury Outside the Premises": "Outpatient",
        "Over Counter Injury Outside the Premises": "Outpatient",
        "Other": "Other",
      }
    }
  };

  
  const [loading1, setLoading1] = useState(false);
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
    setLoading1(true);

    // Validate required fields
    if (!formData.aadhar) {
      alert("Please search and get employee data by Aadhar number first");
      setLoading1(false);
      return;
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Check if employee has any entries for today
    const hasEntryToday = formData.entry_date === today && formData.mrdNo !== "";

    const message1 = "Are you sure you want to submit the entry as footfall?";
    const message2 = "This employee has already been registered in the system for today. Are you sure you want to submit the entry as another footfall?";
    
    const confirm = window.confirm(hasEntryToday ? message2 : message1);
    if (!confirm) {
      setLoading1(false);
      return;
    }
    
    // Validate required selections
    if (!type) {
      alert("Please select Type");
      setLoading1(false);
      return;
    }

    if (!visit) {
      alert("Please select Type of Visit");
      setLoading1(false);
      return;
    }

    if (!register) {
      alert("Please select Register");
      setLoading1(false);
      return;
    }

    // Validate additional fields based on register type
    if (register === "Annual / Periodical" || register === "Periodical (Food Handler)") {
      if (!annualPeriodicalFields.year || !annualPeriodicalFields.batch || !annualPeriodicalFields.hospitalName) {
        alert("Please fill all Annual/Periodical fields (Year, Batch, Hospital Name)");
        setLoading1(false);
        return;
      }
    }

    if (register.startsWith("Camps")) {
      if (!campFields.campName || !campFields.hospitalName) {
        alert("Please fill all Camp fields (Camp Name, Hospital Name)");
        setLoading1(false);
        return;
      }
    }

    if (register.startsWith("Pre Placement Same Contract")) {
      if (!campFields.contractName) {
        alert("Please fill Contract Name");
        setLoading1(false);
        return;
      }
    }

    if (register.startsWith("Pre Placement Contract change")) {
      if (!campFields.prevcontractName || !campFields.old_emp_no) {
        alert("Please fill all Pre Placement Contract Change fields (Previous Contract Name, Employee Number)");
        setLoading1(false);
        return;
      }
    }

    if (register.startsWith("BP Sugar Check")) {
      const bpStatusSelect = document.getElementById("reason");
      if (!bpStatusSelect || !bpStatusSelect.value) {
        alert("Please select Patient Status");
        setLoading1(false);
        return;
      }
    }

    if (register.startsWith("BP Sugar Chart")) {
      const bpChartReasonSelect = document.getElementById("reason");
      if (!bpChartReasonSelect || !bpChartReasonSelect.value) {
        alert("Please select Job Nature (Reason)");
        setLoading1(false);
        return;
      }
    }

    if (register.startsWith("Follow Up Visits") && purpose == "Curative") {
      const followupPurposeSelect = document.getElementById("reason");
      if (!followupPurposeSelect || !followupPurposeSelect.value) {
        alert("Please select Purpose");
        setLoading1(false);
        return;
      }
      if (followupPurposeSelect.value === "Others" && !purpose) {
        alert("Please specify the purpose in Others field");
        setLoading1(false);
        return;
      }
    }

    // Prepare the submission data
    const submissionData = {
      formDataDashboard: {
        typeofVisit: visit,
        category: type,
        register: register,
        purpose: purpose
      },
      extraData: {},
      formData: {
        ...formData,
        entry_date: today,
        type: type,
        type_of_visit: visit,
        register: register,
        purpose: purpose
      }
    };

    // Add conditional fields based on register type
    if (register === "Annual / Periodical" || register === "Periodical (Food Handler)") {
      submissionData.extraData = {
        ...submissionData.extraData,
        year: annualPeriodicalFields.year,
        batch: annualPeriodicalFields.batch,
        hospitalName: annualPeriodicalFields.hospitalName
      };
    }

    if (register.startsWith("Camps")) {
      submissionData.extraData = {
        ...submissionData.extraData,
        campName: campFields.campName,
        hospitalName: campFields.hospitalName
      };
    }

    if (register.startsWith("Pre Placement Same Contract")) {
      submissionData.extraData = {
        ...submissionData.extraData,
        contractName: campFields.contractName
      };
    }

    if (register.startsWith("Pre Placement Contract change")) {
      submissionData.extraData = {
        ...submissionData.extraData,
        prevcontractName: campFields.prevcontractName,
        old_emp_no: campFields.old_emp_no
      };
    }

    if (register.startsWith("BP Sugar Check")) {
      const bpStatusSelect = document.getElementById("reason");
      submissionData.extraData = {
        ...submissionData.extraData,
        status: bpStatusSelect.value
      };
    }

    if (register.startsWith("BP Sugar Chart")) {
      const bpChartReasonSelect = document.getElementById("reason");
      submissionData.extraData = {
        ...submissionData.extraData,
        reason: bpChartReasonSelect.value
      };
    }

    if (register.startsWith("Follow Up Visits") && purpose == "Curative") {
      const followupPurposeSelect = document.getElementById("reason");
      submissionData.extraData = {
        ...submissionData.extraData,
        purpose: followupPurposeSelect.value,
        ...(followupPurposeSelect.value === "Others" && { purpose_others: purpose })
      };
    }

    try {
      const response = await axios.post("https://occupational-health-center-1.onrender.com/addEntries", submissionData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        console.log("MRD Number:", response.data.mrdNo);
        setMRDNo(response.data.mrdNo);
        setFormData(prev => ({...prev, mrdNo: response.data.mrdNo}));
        setdata([{...formData, mrdNo: response.data.mrdNo}]);
        alert("Data submitted successfully!");
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error);
      } else {
        console.error("Error submitting form:", error);
        alert("Error submitting data!");
      }
    } finally {
      setLoading1(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(mrdNo === ""){
        alert("Please submit the entries first to get MRD Number"); 
        return;
      }
      const updatedformData = { ...formData, role: type, mrdNo: mrdNo }
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
          latestEmployee.mrdNo = "";
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
              entry_date: new Date().toISOString().split('T')[0],
              mrdNo: "",
              mri: {},
              msphistory: {},
              name: "",
              permanent_country: "",
              residential_country: "",
              nationality: "",
              docname: "",
              opthalamicreport: {},
              phone_Office: "",
              phone_Personal: "",
              prescription: {},
              profilepic: "",
              profilepic_url: "",
              purpose: "",
              register: "",
              OtherRegister: "",
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
    setMRDNo("");
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
    return Object.keys(dataMapping[type]?.[visit] || {});
  };
    
    const handleRegisterChange = (e) => {
      const selectedRegister = e.target.value;
      setRegister(selectedRegister);
      const autoPurpose = dataMapping[type]?.[visit]?.[selectedRegister] || "";
      setPurpose(autoPurpose);
      setFormDataDashboard(prev => ({ ...prev, register: selectedRegister, purpose: autoPurpose }));
  
      // Reset additional fields when register changes
      setAnnualPeriodicalFields({ year: "", batch: "", hospitalName: "" });
      setCampFields({ campName: "", hospitalName: "" });
    };
    const handleOtherRegisterChange = (e) => {
      const selectedRegister = e.target.value;
      setOtherRegister(selectedRegister);
      const autoPurpose = dataMapping[type]?.[visit]?.[selectedRegister] || "";
      setPurpose(autoPurpose);
      setFormDataDashboard(prev => ({ ...prev, otherRegister: selectedRegister, purpose: autoPurpose }));

      // Reset additional fields when register changes
      setAnnualPeriodicalFields({ year: "", batch: "", hospitalName: "" });
      setCampFields({ campName: "", hospitalName: "" });
    };
  
    const handleTypeChange = (e) => {
      const selectedType = e.target.value;
      console.log("Selected Type:", selectedType);
      setType(selectedType);
      setRegister(""); // Reset register
      setOtherRegister
      setPurpose("");   // Reset purpose
      setFormDataDashboard(prev => ({ ...prev, category: selectedType, register: "", setOtherRegister:"", purpose: "" })); // Update dashboard data and reset
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
    { id: "MedicalHistory", label: "Medical/Surgical/Personal History" },
    { id: "Investigations", label: "Investigations" },
    { id: "Vaccination", label: "Vaccination" },
    visit === "Preventive" && register !== "Camps (Optional)" && { id: "Fitness", label: "Fitness" },

    // --- CORRECTED LOGIC ---
    // Show Consultation tab if the visit is Curative OR it's a Follow Up visit
    (visit === "Curative") && { id: "Consultation", label: "Consultation and Referral" },
    
    // Show Prescription tab ONLY for Curative visits
    visit === "Curative" && { id: "Prescription", label: "Prescription" },
    
  ].filter(Boolean); // Filter out any `false` or `null` values (from the conditional rendering) 


  const handleProfileIconClick = () => {
    // Toggle webcam state
    setProfileImage(null)
    setUploadedImage(null)
    setIsWebcamActive(!isWebcamActive);
  };

  const handleCancelWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
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
            <h2 className="text-lg font-medium mb-4">Personal Details</h2>
            <div className="grid grid-cols-3 mb-16 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 ">Name</label>
                <input
                  name="name"
                  value={formData.name || ''} // Ensure default value to avoid uncontrolled component warning
                  onChange={handleChange}
                  type="text"
                  placeholder="as in Aadhar/Doc(Forgn)-in Capital"
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
                  placeholder="as in Aadhar/Doc(Forgn)-in Capital"
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
                  className="px-4 py-2 w-full bg-blue-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    <label htmlFor="bloodgrp" className="block text-sm font-medium text-gray-700 ">Blood Group</label> 
    <select name="bloodgrp" id="bloodgrp-filter" value={formData.bloodgrp} onChange={handleChange} 
    className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"> 
    <option value="">--Select Option--</option> 
    <option value="A+">A+</option>
     <option value="A-">A-</option> 
     <option value="B+">B+</option> 
     <option value="B-">B-</option> 
     <option value="AB+">AB+</option> 
     <option value="AB-">AB-</option> 
     <option value="O+">O+</option> 
     <option value="O-">O-</option> 
     </select> </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Identification Mark 1</label>
                <input
                  name="identification_marks1"
                  value={formData.identification_marks1 || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="eg, A BM on Rt wrist"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Identification Mark 2</label>
                <input
                  name="identification_marks2"
                  value={formData.identification_marks2 || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="eg, A Healed scar on Rt Eye Brow"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 ">Nationality</label>
                <select name="nationality" id="nationality"
                  value={formData.nationality || ''}
                  onChange={handleChange}
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Indian">Indian</option>
                  <option value="Foreign">Foreign</option>
                </select>
              </div>
              {(formData.nationality === "Foreign") && (<div>
                <label htmlFor="docName" className="block text-sm font-medium text-gray-700 ">Foreigner Document Name</label>
                <input name="docName" id="docName"
                  value={formData.docName || ''}
                  onChange={handleChange}
                  placeholder="Foreigner Document Number"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                </input>
              </div>)}
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
                
                </>
              ) : (
                <div></div>
                
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
                      placeholder="eg,JSW Cement, TATA POWER"
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
                    <label className="block text-sm font-medium text-gray-700 ">Visiting Date To</label>
                    <input
                      name="visiting_date_to"
                      value={formData.visiting_date_to || ''}
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
                      className="mt-1 block w-full p-2 bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
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
                    <label className="block text-sm font-medium text-gray-700 ">{type === "Contractor" && "Contract Employee Number" || "Employee Number"}</label>
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
                      {type === "Contractor" ? "Contract Employer" : "Current Employer"}
                    </label>
                    <input
                      name="employer"
                      value={formData.employer || ""}
                      onChange={handleChange}
                      type="text"
                      placeholder={type === "Contractor" ? "Enter contract employer name" : "eg, JSW steel , JSW Cement"}
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {type === "Employee" &&
                    (<div>
                      <label className="block text-sm font-medium text-gray-700">
                        Current Location
                      </label>
                      <input
                        name="location"
                        value={formData.location || ""}
                        onChange={handleChange}
                        type="text"
                        placeholder="eg, Salem"
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
                          <option value="ssc">SSC</option>
                          <option value="jbn">JBN</option>
                          <option value="tmc">TMC</option>
                          <option value="jbc">JBC</option>
                          <option value="ggbs">GGBS</option>
                          <option value="jbi">JBI</option>
                          <option value="jba">JBA</option>
                          <option value="support_staff">Support Staff</option>
                          <option value="mbc">MBC</option>
                          <option value="propreitor">Propreitor</option>
                          <option value="csr_foundation">CSR Foundation</option>
                          <option value="transporter">Transporter</option>
                          <option value="jsw_society">JSW Society</option>
                          <option value="shutdown">Shutdown</option>
                          <option value="iti_apprentice">ITI Apprentice</option>
                          <option value="supplier">Supplier</option>
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
                  {type !== "Contractor" && formData.moj=="Transfer" && (
                   <div>
                    <label className="block text-sm font-medium text-gray-700 ">Previous Employer </label>
                    <input
                      name="previousemployer"
                      value={formData.previousemployer || ''}
                      onChange={handleChange}
                      type="text"
                      placeholder="e.g., JSW steel , JSW Cement"
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>)}
                  {type !== "Contractor" && formData.moj=="Transfer" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">Previous Location</label>
                    <input
                      name="previouslocation"
                      value={formData.previouslocation || ''}
                      onChange={handleChange}
                      type="text"
                      placeholder="e.g., Dolvi, Mumbai "
                      className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>)}
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
                  placeholder="as in Aadhar/Doc(Forgn)-in Capital"
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
                  placeholder="e.g., Father, Mother, Spouse"
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
                <label className="block text-sm font-medium text-gray-700 ">Country</label>
                <input
                  name='permanent_country'
                  value={formData.permanent_country || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter Country"
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
                <label className="block text-sm font-medium text-gray-700 ">Country</label>
                <input
                  name='residential_country'
                  value={formData.residential_country || ''}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter Country"
                  className="px-4 py-2 w-full bg-blue-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            


            <button onClick={handleSubmit} className="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300">
              Add Basic Details
            </button>
          </div>
        );
    // ... inside the renderTabContent function
      case "Fitness":
        return <Fitness data={data} register = {register} type={visit} mrdNo={mrdNo} />;
      case "Investigations":
        return <Investigation data={singleData} mrdNo={mrdNo} />; // <<< CHANGED: Pass mrdNo as a prop
      case "Vaccination":
        return <Vaccination data={data} mrdNo={mrdNo}  />;
// ...
      case "Vitals":
        return <Vitals data={data} type={type} mrdNo={mrdNo}/>;
      case "MedicalHistory":
        return <MedicalHistory data={data}  mrdNo={mrdNo}/>;
      case "Consultation":
        return <Consultation data={data} type={visit} register = {register}  mrdNo={mrdNo}/>;
      case "Prescription":
        return <Prescription data={data} condition={false} register = {register}  mrdNo={mrdNo}/>;
      case "formFields":
        return <FormFields formType={"alcoholPage"} />;
      case "formFields1":
        return <FormFields formType={"medicalCertificate"} />;
      case "formFields2":
        return <FormFields formType={"medicalCertificate"} />;
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
                            className="w-44 h-44 rounded-full object-cover"
                          />
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={captureImage}
                              className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                            >
                              <FaCamera className="mr-2" /> Capture
                            </button>
                            <button
                              onClick={handleCancelWebcam}
                              className="flex items-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </div>
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
                    {!profileImage && !isWebcamActive && (
                      <>
                        <div className="flex flex-col space-y-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                          />
                          {uploadError && <p className="text-red-500">{uploadError}</p>}
                        </div>
                        <button
                          onClick={handleUploadClick}
                          className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                          <FaUpload className="mr-2" /> Upload Picture
                        </button>
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
                    <div className="w-65"> {/* Adjust width as needed, e.g., w-1/2, w-full */}
    {/* Label */}
    <label
      htmlFor="doc-search-input"
      className="block mb-1 pl-7 text-sm font-medium text-gray-800"
    >
    <strong>Aadhar / Doc No. -Foreigner</strong>
    </label>
                    <div className="relative flex items-center">
                      {/* Search Icon */}
                      <FaSearch className="absolute top-5 transform -translate-y-1/2 left-3 text-gray-400 " />
                      {/* Input Field */}
                      <input
                        type="text"
                        placeholder="Enter/Search - last 12 digits"
                        className="w-full bg-white py-2 pl-8 pr-5 pe-3  mb-4 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-indigo-400 hover:shadow-md placeholder-gray-400 text-gray-700 transition-all duration-300 ease-in-out text-base placeholder:text-sm"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                      />
                    </div>
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
                        className="w-full bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                      >
                        { loading1 === true &&
                <div className="inline-block h-8 w-8 text-white animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div> || "Add Entry"
              }
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Select Type
                    </label>
                    <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      value={type}
                      onChange={handleTypeChange}
                    >
                      <option value="">Select Type</option>
                      <option>Employee</option>
                      <option>Contractor</option>
                      <option>Visitor</option>
                    </select>
                  </div>

                  {/* Visit Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Select Type of Visit
                    </label>
                    <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      value={visit}
                      onChange={handleVisitChange}
                    >
                      <option value="">Select Visit Type</option>
                      <option>Preventive</option>
                      <option>Curative</option>
                    </select>
                  </div>

                  {/* Register Selection */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Select Register
                    </label>
                    <select
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                      value={register}
                      onChange={handleRegisterChange}
                    >
                      <option value="">Select Register</option>
                      {getRegisterOptions().map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {/* Purpose (Auto-selected) */}
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Purpose
                    </label>
                    <input
                      type="text"
                      value={purpose}
                      placeholder="Select the above feilds"
                      readOnly
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                  </div>
                </div>

                {(register === "Other") && (
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Other Purpose
                    </label>
                    <input
                      type="text"
                      value={OtherRegister}
                      onChange={handleOtherRegisterChange}
                      placeholder="Specify other purpose"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                  </div>
                )}

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

                {register.startsWith("Follow Up Visits") && visit != "Preventive" &&(
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



