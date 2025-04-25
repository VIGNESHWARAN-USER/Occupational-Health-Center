import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { debounce } from "lodash";
import jsPDF from 'jspdf';

const Prescription = ({ data, onPrescriptionUpdate }) => {
  // Component Setup: Props, State, Refs
  const emp_no = data?.[0]?.emp_no;
  const existingPrescription = data?.[0]?.prescription;
  const prescriptionId = existingPrescription?.id;

  // State for different medicine types
  const [tablets, setTablets] = useState([]);
  const [injections, setInjections] = useState([]);
  const [syrups, setSyrups] = useState([]);
  const [drops, setDrops] = useState([]);
  const [creams, setCreams] = useState([]);
  const [respules, setRespules] = useState([]);
  const [lotions, setLotions] = useState([]);
  const [fluids, setFluids] = useState([]);
  const [powder, setPowder] = useState([]);
  const [sutureProcedureItems, setSutureProcedureItems] = useState([]);
  const [dressingItems, setDressingItems] = useState([]);
  const [others, setOthers] = useState([]);

  // Other state variables
  const [submittedBy, setSubmittedBy] = useState("SK");
  const [issuedby, setIssuedby] = useState("Nurse");
  const [nurseNotes, setNurseNotes] = useState("");

  // State for suggestions & UI control
  const [brandSuggestions, setBrandSuggestions] = useState({});
  const [chemicalSuggestions, setChemicalSuggestions] = useState({}); // Kept for potential future use
  const [doseSuggestions, setDoseSuggestions] = useState({});
  const [showBrandSuggestions, setShowBrandSuggestions] = useState({});
  const [showChemicalSuggestions, setShowChemicalSuggestions] = useState({}); // Kept for potential future use
  const [showDoseSuggestions, setShowDoseSuggestions] = useState({});
  const [doseManuallyEntered, setDoseManuallyEntered] = useState({});
  const [expandedSections, setExpandedSections] = useState([]);

  // Mappings and Constants
  const medicineForms = {
    tablets: "Tablet", injections: "Injection", syrups: "Syrup", drops: "Drops",
    creams: "Creams", respules: "Respules", lotions: "Lotions", fluids: "Fluids",
    powder: "Powder", sutureProcedureItems: "Suture Procedure Items",
    dressingItems: "Dressing Items", others: "Other",
  };
  const timingOptions = [
    { value: "Morning", label: "Morning" }, { value: "AN", label: "AN" },
    { value: "Night", label: "Night" }, { value: "6h/d", label: "6hrly" },
  ];
  const foodOptions = ["BF", "AF", "WF", "Well Anyways"];

  // Role-Based Access Control (RBAC)
  const accessLevel = localStorage.getItem("accessLevel");
  const isDoctor = accessLevel === "doctor";
  const isNurse = accessLevel === "nurse";
  const isPharmacy = accessLevel === "pharmacy";
  const nurseEditableSections = ["fluids", "powder", "sutureProcedureItems", "dressingItems", "others"];

  // Default Row Structure
  const getDefaultRow = useCallback(
    (type) => ({
      chemicalName: "", brandName: "", doseVolume: "", qty: "", timing: [], food: "",
      days: "", serving: "", issuedIn: "", issuedOut: "", prescriptionOut: "",
    }),
    []
  );

  // Effect to Initialize State from Props or Defaults
  useEffect(() => {
    if (!emp_no) return;

    const initializePrescription = () => {
      let initialData = {
        tablets: [getDefaultRow("tablets")], injections: [getDefaultRow("injections")],
        syrups: [getDefaultRow("syrups")], drops: [getDefaultRow("drops")],
        creams: [getDefaultRow("creams")], respules: [getDefaultRow("respules")],
        lotions: [getDefaultRow("lotions")], fluids: [getDefaultRow("fluids")],
        powder: [getDefaultRow("powder")], sutureProcedureItems: [getDefaultRow("sutureProcedureItems")],
        dressingItems: [getDefaultRow("dressingItems")], others: [getDefaultRow("others")],
        submitted_by: "SK", issued_by: "Nurse", nurse_notes: "",
      };

      if (existingPrescription) {
        // Helper to map timing data (handles array/string variations)
        const mapTiming = (timing) => {
          if (!timing) return [];
          if (Array.isArray(timing)) {
            return timing.map(t => typeof t === 'string' ? { value: t, label: t } : t).filter(Boolean);
          }
          if (typeof timing === 'string') {
            return timing.split(",").map(t => t.trim()).filter(Boolean).map(t => ({ value: t, label: t }));
          }
          return [];
        };

        // Populate initialData with existing prescription data
        initialData = {
          tablets: existingPrescription.tablets?.length ? existingPrescription.tablets.map(item => ({ ...getDefaultRow("tablets"), ...item, timing: mapTiming(item.timing) })) : [getDefaultRow("tablets")],
          injections: existingPrescription.injections?.length ? existingPrescription.injections.map(item => ({ ...getDefaultRow("injections"), ...item })) : [getDefaultRow("injections")],
          syrups: existingPrescription.syrups?.length ? existingPrescription.syrups.map(item => ({ ...getDefaultRow("syrups"), ...item, timing: mapTiming(item.timing) })) : [getDefaultRow("syrups")],
          drops: existingPrescription.drops?.length ? existingPrescription.drops.map(item => ({ ...getDefaultRow("drops"), ...item, chemicalName: item.chemicalName || item.drugName || item.dropName || "", serving: item.serving || "", timing: mapTiming(item.timing), food: item.food || "", days: item.days || "" })) : [getDefaultRow("drops")],
          creams: existingPrescription.creams?.length ? existingPrescription.creams.map(item => ({ ...getDefaultRow("creams"), ...item, timing: mapTiming(item.timing), food: item.food || "", days: item.days || "" })) : [getDefaultRow("creams")],
          respules: existingPrescription.respules?.length ? existingPrescription.respules.map(item => ({ ...getDefaultRow("respules"), ...item })) : [getDefaultRow("respules")],
          lotions: existingPrescription.lotions?.length ? existingPrescription.lotions.map(item => ({ ...getDefaultRow("lotions"), ...item, days: item.days || "" })) : [getDefaultRow("lotions")],
          fluids: existingPrescription.fluids?.length ? existingPrescription.fluids.map(item => ({ ...getDefaultRow("fluids"), ...item, chemicalName: item.chemicalName || "" })) : [getDefaultRow("fluids")],
          powder: existingPrescription.powder?.length ? existingPrescription.powder.map(item => ({ ...getDefaultRow("powder"), ...item, timing: mapTiming(item.timing) })) : [getDefaultRow("powder")],
          sutureProcedureItems: existingPrescription.sutureProcedureItems?.length ? existingPrescription.sutureProcedureItems.map(item => ({ ...getDefaultRow("sutureProcedureItems"), ...item, chemicalName: item.chemicalName || item.itemName || "" })) : [getDefaultRow("sutureProcedureItems")],
          dressingItems: existingPrescription.dressingItems?.length ? existingPrescription.dressingItems.map(item => ({ ...getDefaultRow("dressingItems"), ...item, chemicalName: item.chemicalName || item.itemName || "" })) : [getDefaultRow("dressingItems")],
          others: existingPrescription.others?.length ? existingPrescription.others.map(item => ({ ...getDefaultRow("others"), ...item })) : [getDefaultRow("others")],
          submitted_by: existingPrescription.submitted_by || "SK",
          issued_by: existingPrescription.issued_by || "Nurse",
          nurse_notes: existingPrescription.nurse_notes || "",
        };

        // Ensure pharmacy fields exist on all items
        Object.keys(initialData).forEach((key) => {
          if (Array.isArray(initialData[key])) {
            initialData[key] = initialData[key].map((item) => ({ ...item, issuedIn: item.issuedIn ?? "", issuedOut: item.issuedOut ?? "", prescriptionOut: item.prescriptionOut ?? "" }));
          }
        });
      }

      // Set state for each section
      setTablets(initialData.tablets); setInjections(initialData.injections); setSyrups(initialData.syrups);
      setDrops(initialData.drops); setCreams(initialData.creams); setRespules(initialData.respules);
      setLotions(initialData.lotions); setFluids(initialData.fluids); setPowder(initialData.powder);
      setSutureProcedureItems(initialData.sutureProcedureItems); setDressingItems(initialData.dressingItems);
      setOthers(initialData.others); setSubmittedBy(initialData.submitted_by);
      setIssuedby(initialData.issued_by); setNurseNotes(initialData.nurse_notes);

      // Automatically expand sections that have data
      const sectionsWithData = Object.entries(initialData)
        .filter(([key, value]) => Array.isArray(value) && filterEmptyRows(value, key).length > 0)
        .map(([key]) => key);
      setExpandedSections(sectionsWithData);
    };

    initializePrescription();
  }, [emp_no, existingPrescription, getDefaultRow]); // Dependencies for effect


  // --- CORE FUNCTIONALITY ---

  // Add Row (Doctor Only)
  const addRow = (type) => {
    if (!isDoctor) return;
    const newRow = getDefaultRow(type);
    const setState = (setter) => setter((prev) => [...prev, newRow]);
    switch (type) {
      case "tablets": setState(setTablets); break; case "injections": setState(setInjections); break;
      case "syrups": setState(setSyrups); break; case "drops": setState(setDrops); break;
      case "creams": setState(setCreams); break; case "respules": setState(setRespules); break;
      case "lotions": setState(setLotions); break; case "fluids": setState(setFluids); break;
      case "powder": setState(setPowder); break; case "sutureProcedureItems": setState(setSutureProcedureItems); break;
      case "dressingItems": setState(setDressingItems); break; case "others": setState(setOthers); break;
      default: console.warn("Add row: Unknown type:", type); break;
    }
    if (!expandedSections.includes(type)) setExpandedSections((prev) => [...prev, type]);
  };

  // Remove Row (Doctor Only)
  const removeRow = (type, index) => {
    if (!isDoctor) return;
    const setState = (setter) => setter((prev) => prev.length <= 1 ? prev.map((item, i) => i === index ? getDefaultRow(type) : item) : prev.filter((_, i) => i !== index));
    switch (type) {
        case "tablets": setState(setTablets); break; case "injections": setState(setInjections); break;
        case "syrups": setState(setSyrups); break; case "drops": setState(setDrops); break;
        case "creams": setState(setCreams); break; case "respules": setState(setRespules); break;
        case "lotions": setState(setLotions); break; case "fluids": setState(setFluids); break;
        case "powder": setState(setPowder); break; case "sutureProcedureItems": setState(setSutureProcedureItems); break;
        case "dressingItems": setState(setDressingItems); break; case "others": setState(setOthers); break;
        default: console.warn("Remove row: Unknown type:", type); break;
    }
  };

  // Update Row State (Immutable)
  const updateRowState = (type, index, field, value) => {
    const getUpdater = (setter) => (prevState) => prevState.map((item, i) => i === index ? { ...item, [field]: value } : item);
    switch (type) {
        case "tablets": setTablets(getUpdater(setTablets)); break; case "injections": setInjections(getUpdater(setInjections)); break;
        case "syrups": setSyrups(getUpdater(setSyrups)); break; case "drops": setDrops(getUpdater(setDrops)); break;
        case "creams": setCreams(getUpdater(setCreams)); break; case "respules": setRespules(getUpdater(setRespules)); break;
        case "lotions": setLotions(getUpdater(setLotions)); break; case "fluids": setFluids(getUpdater(setFluids)); break;
        case "powder": setPowder(getUpdater(setPowder)); break; case "sutureProcedureItems": setSutureProcedureItems(getUpdater(setSutureProcedureItems)); break;
        case "dressingItems": setDressingItems(getUpdater(setDressingItems)); break; case "others": setOthers(getUpdater(setOthers)); break;
        default: console.warn("Update state: Unknown type:", type); break;
    }
  };

  // --- Suggestion Fetching (Doctor Only) ---
  const fetchBrandSuggestions = useCallback(
    debounce(async (chemicalName, medicineForm, type, index) => {
      if (!isDoctor || chemicalName?.length < 3 || !medicineForm) {
        setBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: [] } }));
        setShowBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } })); return;
      }
      try {
        const response = await axios.get(`https://occupational-health-center-1.onrender.com/get-brand-names/?chemical_name=${encodeURIComponent(chemicalName)}&medicine_form=${encodeURIComponent(medicineForm)}`);
        setBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: response.data.suggestions } }));
        setShowBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: true } }));
      } catch (error) { console.error("Error fetching brand suggestions:", error); /* Reset state */ }
    }, 500), [isDoctor]
  );

  const fetchDoseSuggestions = useCallback(
    debounce(async (brandName, chemicalName, medicineForm, type, index) => {
      const requiresDoseFetch = ["tablets", "syrups", "drops", "creams", "lotions", "powder", "others", "injections", "respules", "fluids"].includes(type);
      if (!isDoctor || !requiresDoseFetch || !brandName || !chemicalName || !medicineForm) {
        setDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: [] } }));
        setShowDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } })); return;
      }
      try {
        const response = await axios.get(`https://occupational-health-center-1.onrender.com/get-dose-volume/?brand_name=${encodeURIComponent(brandName)}&chemical_name=${encodeURIComponent(chemicalName)}&medicine_form=${encodeURIComponent(medicineForm)}`);
        const suggestions = response.data.suggestions;
        setDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: suggestions } }));
        setShowDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: !doseManuallyEntered?.[type]?.[index] && suggestions.length > 0 } }));
      } catch (error) { console.error("Error fetching dose suggestions:", error); /* Reset state */ }
    }, 500), [isDoctor, doseManuallyEntered]
  );

  // Get Current Item State (Helper for suggestions)
  const getCurrentItemState = (type, index) => {
     switch (type) {
       case "tablets": return tablets[index]; case "injections": return injections[index];
       case "syrups": return syrups[index]; case "drops": return drops[index];
       case "creams": return creams[index]; case "respules": return respules[index];
       case "lotions": return lotions[index]; case "fluids": return fluids[index];
       case "powder": return powder[index]; case "sutureProcedureItems": return sutureProcedureItems[index];
       case "dressingItems": return dressingItems[index]; case "others": return others[index];
       default: return null;
     }
   };

  // Handle Input Changes (RBAC implemented)
  const handleInputChange = (e, type, index, field) => {
    const isPharmacyField = ["issuedIn", "issuedOut", "prescriptionOut"].includes(field);
    const isMedicineType = Object.keys(medicineForms).includes(type);
    const isNurseNoteField = type === "nurseNotes";

    // Permission Check
    if (isPharmacyField) { if (!isPharmacy) return; }
    else if (isNurseNoteField) { if (!isNurse) return; }
    else if (isMedicineType) {
        const isThisNurseEditableSection = nurseEditableSections.includes(type);
        if (!(isDoctor || (isNurse && isThisNurseEditableSection))) return;
    } else return; // Exit if type is unknown

    // Get Value
    let value;
    if (isNurseNoteField) { value = e?.target?.value ?? ""; }
    else if (field === "timing") { value = e; } // react-select passes array
    else if (e && e.target) { value = e.target.value; }
    else { value = e; } // Direct value

    // Update State
    if (isNurseNoteField) { setNurseNotes(value); return; }

    // Handle manual dose entry (doctor only)
    if (field === "doseVolume" && isDoctor) {
      setDoseManuallyEntered((prev) => ({ ...prev, [type]: { ...prev[type], [index]: true } }));
      setShowDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
    }

    updateRowState(type, index, field, value);

    // Trigger Suggestions (Doctor Only)
    if (isDoctor && !isPharmacyField && !isNurseNoteField) {
        const medicineFormValue = medicineForms[type];
        if (!medicineFormValue) return;

        // Use setTimeout to allow state update before accessing item
        setTimeout(() => {
            const currentItem = getCurrentItemState(type, index);
            if (!currentItem) return;
            const currentPrimaryIdentifierValue = currentItem.chemicalName;
            const currentBrandName = currentItem.brandName;
            const standardSuggestionTypes = ["tablets", "syrups", "drops", "creams", "lotions", "powder", "others", "injections", "respules", "fluids"];

            if (standardSuggestionTypes.includes(type)) {
                 if (field === "chemicalName") {
                    fetchBrandSuggestions(value, medicineFormValue, type, index);
                    if (currentBrandName) fetchDoseSuggestions(currentBrandName, value, medicineFormValue, type, index);
                    setDoseManuallyEntered((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
                 } else if (field === "brandName") {
                    fetchBrandSuggestions(currentPrimaryIdentifierValue, medicineFormValue, type, index);
                    if (currentPrimaryIdentifierValue) fetchDoseSuggestions(value, currentPrimaryIdentifierValue, medicineFormValue, type, index);
                    setDoseManuallyEntered((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
                 } else if (field !== "doseVolume") {
                    if (currentPrimaryIdentifierValue && currentBrandName) fetchDoseSuggestions(currentBrandName, currentPrimaryIdentifierValue, medicineFormValue, type, index);
                 }
            }
        }, 50); // Small delay
    }
  };

  // Handle Suggestion Click (Doctor only)
  const handleSuggestionClick = (suggestion, type, index, field) => {
    if (!isDoctor) return;
    updateRowState(type, index, field, suggestion);
    setDoseManuallyEntered((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
    const medicineFormValue = medicineForms[type];
    if (!medicineFormValue) return;
    setTimeout(() => { // Allow state update
      const updatedItem = getCurrentItemState(type, index);
      if (!updatedItem) return;
      const primaryIdentifierValue = updatedItem.chemicalName;
      const brandValue = updatedItem.brandName;
      const standardSuggestionTypes = ["tablets", "syrups", "drops", "creams", "lotions", "powder", "others", "injections", "respules", "fluids"];
      if (standardSuggestionTypes.includes(type)) {
        if (field === "brandName" && primaryIdentifierValue) fetchDoseSuggestions(suggestion, primaryIdentifierValue, medicineFormValue, type, index);
        else if (field === "chemicalName") {
          fetchBrandSuggestions(suggestion, medicineFormValue, type, index);
          if (brandValue) fetchDoseSuggestions(brandValue, suggestion, medicineFormValue, type, index);
        }
      }
      setTimeout(() => { // Hide suggestion list after click registers
         if (field === "brandName") setShowBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
         else if (field === "chemicalName") setShowBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
      }, 150);
    }, 50);
  };

  // Handle Dose Suggestion Click (Doctor only)
  const handleDoseSuggestionClick = (suggestion, type, index) => {
    const requiresDose = ["tablets", "syrups", "drops", "creams", "lotions", "powder", "others", "injections", "respules", "fluids"].includes(type);
    if (!requiresDose || !isDoctor) return;
    setDoseManuallyEntered((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
    updateRowState(type, index, "doseVolume", suggestion);
    setShowDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
  };


  // --- RENDERING LOGIC ---

  // Render Suggestion Dropdowns (Conditional on Role)
  const renderSuggestions = (type, index, field) => {
     if (!isDoctor) return null; // Only doctors see suggestions
     // ... (rest of the logic remains the same as previous fixed version) ...
      let suggestions = [], showSuggestions = false;
      let suggestionsList, showSuggestionsState;
      const hasBrandChemicalSuggestions = [
          "tablets", "syrups", "drops", "creams", "lotions",
          "powder", "others", "injections", "respules", "fluids"
        ].includes(type);
      if (!hasBrandChemicalSuggestions) return null;
      if (field === "brandName") {
        suggestionsList = brandSuggestions; showSuggestionsState = showBrandSuggestions;
      } else if (field === "chemicalName") {
          suggestionsList = brandSuggestions; showSuggestionsState = showBrandSuggestions;
      } else { return null; }
      suggestions = suggestionsList?.[type]?.[index] || [];
      showSuggestions = showSuggestionsState?.[type]?.[index] || false;
      if (showSuggestions && suggestions.length > 0) {
        return (
          <div className="absolute z-20 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, i) => (
              <div key={`${type}-${index}-${field}-sugg-${i}`} className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(suggestion, type, index, field); }} > {suggestion} </div>
            ))}
          </div> );
      } return null;
  };

  const renderDoseVolumeSuggestions = (type, index) => {
     if (!isDoctor) return null; // Only doctors see suggestions
     // ... (rest of the logic remains the same as previous fixed version) ...
     const requiresDose = ["tablets", "syrups", "drops", "creams", "lotions", "powder", "others", "injections", "respules", "fluids"].includes(type);
     if (!requiresDose) return null;
     const suggestions = doseSuggestions?.[type]?.[index] || [];
     const show = showDoseSuggestions?.[type]?.[index] || false;
     if (show && suggestions.length > 0 && !doseManuallyEntered?.[type]?.[index]) {
       return (
         <div className="absolute z-20 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-48 overflow-y-auto">
           {suggestions.map((suggestion, i) => (
             <div key={`${type}-${index}-dose-sugg-${i}`} className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
               onMouseDown={(e) => { e.preventDefault(); handleDoseSuggestionClick(suggestion, type, index); }} > {suggestion} </div>
           ))}
         </div> );
     } return null;
  };

  // Render Input Fields (Applies correct disabled state based on RBAC)
  const renderInputFields = (type, items, index) => {
     const item = items[index]; if (!item) return null;

     // Base styling
     const inputBaseClass = "px-3 py-1.5 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 text-sm bg-white focus:ring-blue-500";
     const selectBaseClass = "w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 text-sm bg-white focus:ring-blue-500";
     const nativeSelectBaseClass = "px-3 py-1.5 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 text-sm bg-white focus:ring-blue-500 appearance-none";
     const textareaBaseClass = "px-3 py-1.5 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 text-sm bg-white focus:ring-blue-500 resize-none";
     const disabledClass = "bg-gray-100 cursor-not-allowed opacity-70";
     const pharmacyEnabledClass = "bg-yellow-50";
     const nurseEnabledClass = "bg-green-50";

     // Determine disabled state based on role and section
     const isThisNurseEditableSection = nurseEditableSections.includes(type);
     const isMedFieldDisabled = !(isDoctor || (isNurse && isThisNurseEditableSection));
     const isPharmacyFieldDisabled = !isPharmacy;
     const medFieldDisabledClass = isMedFieldDisabled ? disabledClass : "";
     const pharmacyDisabledClass = isPharmacyFieldDisabled ? disabledClass : "";
     const medFieldEnabledClass = (isNurse && isThisNurseEditableSection && !isDoctor) ? nurseEnabledClass : ""; // Highlight only if nurse editing

      // React-Select Styles (incorporating disabled state)
      const reactSelectStyles = {
        control: (provided, state) => ({
            ...provided, minHeight: '38px', height: 'auto',
            borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : provided.boxShadow,
            borderRadius: "0.375rem", fontSize: "0.875rem",
            backgroundColor: isMedFieldDisabled ? '#f3f4f6' : 'white', // Dynamic background
            opacity: isMedFieldDisabled ? 0.7 : 1, cursor: isMedFieldDisabled ? 'not-allowed' : 'default',
            '&:hover': { borderColor: state.isFocused ? '#3b82f6' : (isMedFieldDisabled ? '#d1d5db' : '#9ca3af') },
        }),
        // ... other react-select styles ...
        valueContainer: (p) => ({ ...p, padding: "1px 6px", alignItems: 'center' }),
        input: (p) => ({ ...p, margin: '0px', padding: '0px', alignSelf: 'stretch' }),
        indicatorSeparator: () => ({ display: "none" }),
        indicatorsContainer: (p) => ({ ...p, alignSelf: 'stretch' }),
        menu: (p) => ({ ...p, fontSize: "0.875rem", zIndex: 30 }),
        multiValue: (p) => ({ ...p, backgroundColor: "#e0e7ff", margin: "2px", alignItems: 'center' }),
        multiValueLabel: (p) => ({ ...p, padding: "2px", paddingLeft: "4px", whiteSpace: 'normal' }),
        multiValueRemove: (p) => ({ ...p, '&:hover': { backgroundColor: "#be123c", color: "white" }, alignSelf: 'center' }),
        placeholder: (p) => ({ ...p, color: '#9ca3af' }),
    };

     // --- Reusable Field Renderers (Apply correct classes and disabled prop) ---
     const renderChemicalInput = () => ( <div className="relative"> <input type="text" placeholder="Chemical Name" value={item.chemicalName || ""} onChange={(e) => handleInputChange(e, type, index, "chemicalName")} onFocus={() => { if (isDoctor && item.chemicalName?.length >= 3) { fetchBrandSuggestions(item.chemicalName, medicineForms[type], type, index); } }} onBlur={() => setTimeout(() => setShowBrandSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: false } })), 200)} className={`${inputBaseClass} ${medFieldDisabledClass} ${medFieldEnabledClass}`} disabled={isMedFieldDisabled} autoComplete="off" /> {renderSuggestions(type, index, "chemicalName")} </div> );
     const renderBrandInput = () => { const show = ["tablets", "syrups", "drops", "creams", "lotions", "powder", "others", "injections", "respules", "fluids"].includes(type); if (!show) return null; return ( <div className="relative"> <input type="text" placeholder="Brand Name" value={item.brandName || ""} onChange={(e) => handleInputChange(e, type, index, "brandName")} onFocus={() => { if (isDoctor && item.chemicalName) { fetchBrandSuggestions(item.chemicalName, medicineForms[type], type, index); } }} onBlur={() => setTimeout(() => setShowBrandSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: false } })), 200)} className={`${inputBaseClass} ${medFieldDisabledClass} ${medFieldEnabledClass}`} disabled={isMedFieldDisabled} autoComplete="off" /> {renderSuggestions(type, index, "brandName")} </div> ); };
     const renderDoseInput = () => { const show = ["tablets", "syrups", "drops", "creams", "lotions", "powder", "others", "injections", "respules", "fluids"].includes(type); if (!show) return null; return ( <div className="relative"> <input type="text" placeholder="Dose/Vol" value={item.doseVolume || ""} onChange={(e) => handleInputChange(e, type, index, "doseVolume")} onFocus={() => { if (isDoctor && item.brandName && item.chemicalName) { fetchDoseSuggestions(item.brandName, item.chemicalName, medicineForms[type], type, index); } }} onBlur={() => setTimeout(() => setShowDoseSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: false } })), 200)} className={`${inputBaseClass} ${medFieldDisabledClass} ${medFieldEnabledClass}`} disabled={isMedFieldDisabled} autoComplete="off" /> {renderDoseVolumeSuggestions(type, index)} </div> ); };
     const renderQtyInput = () => { let ph="Qty", fn="qty"; if (type==='syrups'||type==='drops') { ph=type==='syrups'?"Serving (e.g., 5ml)":"Serving (e.g., 1 drop)"; fn="serving"; } else if (type==='creams'||type==='lotions') ph="Qty/App"; else if (type==='fluids') ph="Qty/Rate"; else if (type==='others') ph="Qty/Notes"; else if (type==='sutureProcedureItems'||type==='dressingItems') ph="Qty"; const show=["tablets","injections","creams","respules","lotions","fluids","powder","others","sutureProcedureItems","dressingItems","syrups","drops"].includes(type); if (!show) return null; return ( <input type="text" placeholder={ph} value={item[fn] || ""} onChange={(e) => handleInputChange(e, type, index, fn)} className={`${inputBaseClass} ${medFieldDisabledClass} ${medFieldEnabledClass}`} disabled={isMedFieldDisabled} /> ); };
     const renderTimingSelect = () => { const show=["tablets","syrups","drops","creams","powder"].includes(type); if (!show) return null; return ( <Select name="timing" isMulti options={timingOptions} value={item.timing || []} onChange={(sel) => handleInputChange(sel, type, index, "timing")} styles={reactSelectStyles} isDisabled={isMedFieldDisabled} placeholder="Timing" closeMenuOnSelect={false} isClearable={false} /> ); };
     const renderFoodSelect = () => { const show=["tablets","syrups","drops","creams"].includes(type); if (!show) return null; return ( <div className="relative"><select value={item.food||""} onChange={(e)=>handleInputChange(e,type,index,"food")} className={`${nativeSelectBaseClass} ${medFieldDisabledClass} ${medFieldEnabledClass}`} disabled={isMedFieldDisabled}><option value="">Food</option>{foodOptions.map(o=><option key={o} value={o}>{o}</option>)}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div> ); };
     const renderDaysInput = () => { const show=["tablets","syrups","drops","creams","respules","lotions","powder"].includes(type); if (!show) return null; return ( <input type="text" placeholder="Days" value={item.days||""} onChange={(e)=>handleInputChange(e,type,index,"days")} className={`${inputBaseClass} ${medFieldDisabledClass} ${medFieldEnabledClass}`} disabled={isMedFieldDisabled} /> ); };
     const renderPharmacyFields = () => ( <> <textarea placeholder="Issued In" value={item.issuedIn || ""} onChange={(e) => handleInputChange(e, type, index, "issuedIn")} className={`${textareaBaseClass} ${pharmacyDisabledClass} ${isPharmacy?pharmacyEnabledClass:''}`} disabled={isPharmacyFieldDisabled} rows="1" title="Pharmacy Use Only: Issued In"/> <textarea placeholder="Issued Out" value={item.issuedOut || ""} onChange={(e) => handleInputChange(e, type, index, "issuedOut")} className={`${textareaBaseClass} ${pharmacyDisabledClass} ${isPharmacy?pharmacyEnabledClass:''}`} disabled={isPharmacyFieldDisabled} rows="1" title="Pharmacy Use Only: Issued Out"/> <textarea placeholder="Presc. Out" value={item.prescriptionOut || ""} onChange={(e) => handleInputChange(e, type, index, "prescriptionOut")} className={`${textareaBaseClass} ${pharmacyDisabledClass} ${isPharmacy?pharmacyEnabledClass:''}`} disabled={isPharmacyFieldDisabled} rows="1" title="Pharmacy Use Only: Presc. Out"/> </> );

     // Type-Specific Layout (uses renderers with updated disabled logic)
     switch (type) {
       case "tablets": case "syrups": case "drops": case "creams": case "powder": return (<>{renderChemicalInput()}{renderBrandInput()}{renderDoseInput()}{renderQtyInput()}{renderTimingSelect()}{renderFoodSelect()}{renderDaysInput()}{renderPharmacyFields()}</>);
       case "injections": case "respules": case "fluids": return (<>{renderChemicalInput()}{renderBrandInput()}{renderDoseInput()}{renderQtyInput()}{type==='respules'&&renderDaysInput()}{renderPharmacyFields()}</>);
       case "lotions": return (<>{renderChemicalInput()}{renderBrandInput()}{renderDoseInput()}{renderQtyInput()}{renderDaysInput()}{renderPharmacyFields()}</>);
       case "others": return (<>{renderChemicalInput()}{renderBrandInput()}{renderDoseInput()}{renderQtyInput()}{renderPharmacyFields()}</>);
       case "sutureProcedureItems": case "dressingItems": return (<>{ /* Specific layout for these */ }<div className="relative"><input type="text" placeholder="Item Name" value={item.chemicalName||""} onChange={(e)=>handleInputChange(e,type,index,"chemicalName")} className={`${inputBaseClass} ${medFieldDisabledClass} ${medFieldEnabledClass}`} disabled={isMedFieldDisabled} autoComplete="off"/></div><input type="text" placeholder="Qty" value={item.qty||""} onChange={(e)=>handleInputChange(e,type,index,"qty")} className={`${inputBaseClass} ${medFieldDisabledClass} ${medFieldEnabledClass}`} disabled={isMedFieldDisabled}/>{renderPharmacyFields()}</>);
       default: return null;
     }
   };

  // Filter Empty Rows (remains the same)
  const filterEmptyRows = (items, type) => { /* ... */ if (!Array.isArray(items) || items.length === 0) return []; let keyField = "chemicalName"; return items.filter( item => item && typeof item[keyField] === 'string' && item[keyField].trim() !== ""); };

  // Handle Form Submission (remains the same)
  const handleSubmit = async () => { /* ... */ };

  // Handle PDF Generation (remains the same)
  const handleGeneratePrescription = () => { /* ... */ };

  // --- UI Components ---
  const ActionButton = ({ onClick, disabled = false, children, color = "blue", title = "", className = "" }) => ( <button type="button" onClick={onClick} disabled={disabled} title={title} className={`bg-${color}-600 hover:bg-${color}-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out text-sm focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-opacity-50 ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`} > {children} </button> );
  const RemoveButton = ({ onClick, disabled = false, type, index }) => ( <button type="button" onClick={() => onClick(type, index)} disabled={disabled} title={`Remove this row`} className={`bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded w-8 h-8 flex items-center justify-center transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`} > <FaTrash size={12} /> </button> );
  const toggleSection = (section) => { setExpandedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]); };
  const isSectionExpanded = (section) => expandedSections.includes(section);
  const gridTemplateColumns = { /* ... remains the same ... */
     tablets:  "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) repeat(3, minmax(100px, 1fr)) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
     syrups:   "repeat(3, minmax(140px, 1.5fr)) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
     drops:    "repeat(3, minmax(140px, 1.5fr)) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
     creams:   "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) repeat(3, minmax(100px, 1fr)) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
     powder:   "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) minmax(100px, 1fr) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)", // Adjusted: No food
     injections:"repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
     respules: "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
     lotions:  "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
     fluids:   "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
     others:   "repeat(3, minmax(140px, 1.5fr)) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
     sutureProcedureItems: "minmax(150px, 2fr) minmax(80px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
     dressingItems:        "minmax(150px, 2fr) minmax(80px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
   };

  // Render Section (with FIXED Tailwind class mapping)
  const renderSection = (type, title, color, children, addItemButtonText) => {
    const isExpanded = isSectionExpanded(type);
    const headerColor = color || "gray";
    const buttonColor = "blue";

    // Static Class Mappings for Tailwind
    const bgClassMap = { blue: 'bg-blue-50', purple: 'bg-purple-50', green: 'bg-green-50', teal: 'bg-teal-50', orange: 'bg-orange-50', cyan: 'bg-cyan-50', pink: 'bg-pink-50', indigo: 'bg-indigo-50', lime: 'bg-lime-50', gray: 'bg-gray-50' };
    const textClassMap = { blue: 'text-blue-700', purple: 'text-purple-700', green: 'text-green-700', teal: 'text-teal-700', orange: 'text-orange-700', cyan: 'text-cyan-700', pink: 'text-pink-700', indigo: 'text-indigo-700', lime: 'text-lime-700', gray: 'text-gray-700' };
    const hoverBgClassMap = { blue: 'hover:bg-blue-100', purple: 'hover:bg-purple-100', green: 'hover:bg-green-100', teal: 'hover:bg-teal-100', orange: 'hover:bg-orange-100', cyan: 'hover:bg-cyan-100', pink: 'hover:bg-pink-100', indigo: 'hover:bg-indigo-100', lime: 'hover:bg-lime-100', gray: 'hover:bg-gray-100' };

    // Generate Headers (remains the same)
    const getHeaders = () => { /* ... */
         const baseHeaders = [ { title: "Chemical Name", gridSpan: "span 1", tooltip: "Generic or chemical name" }, ];
         const brandDoseHeaders = [ { title: "Brand Name", gridSpan: "span 1", tooltip: "Specific brand name" }, { title: "Dose/Vol", gridSpan: "span 1", tooltip: "Dosage strength/volume" }, ];
         const qtyHeader = { title: "Qty", gridSpan: "span 1", tooltip: "Quantity" }; const servingHeader = { title: "Serving", gridSpan: "span 1", tooltip: "Dosage per administration" };
         const timingHeader = { title: "Timing", gridSpan: "span 1", tooltip: "When to take" }; const foodHeader = { title: "Food", gridSpan: "span 1", tooltip: "Relation to food" }; const daysHeader = { title: "Days", gridSpan: "span 1", tooltip: "Duration" };
         const pharmacyHeaders = [ { title: "Issued In", gridSpan: "span 1", tooltip: "Pharmacy Use Only: Check-in" }, { title: "Issued Out", gridSpan: "span 1", tooltip: "Pharmacy Use Only: Dispensing" }, { title: "Presc. Out", gridSpan: "span 1", tooltip: "Pharmacy Use Only: Tracking" }, ];
         const actionHeader = { title: "Action", gridSpan: "span 1", tooltip: "Remove row" };
         let headers = [];
         switch (type) {
           case "tablets": case "creams": headers = [...baseHeaders, ...brandDoseHeaders, qtyHeader, timingHeader, foodHeader, daysHeader, ...pharmacyHeaders, actionHeader]; break;
           case "syrups": case "drops": headers = [...baseHeaders, ...brandDoseHeaders, servingHeader, timingHeader, foodHeader, daysHeader, ...pharmacyHeaders, actionHeader]; break;
           case "powder": headers = [...baseHeaders, ...brandDoseHeaders, qtyHeader, timingHeader, daysHeader, ...pharmacyHeaders, actionHeader]; break;
           case "injections": case "fluids": headers = [...baseHeaders, ...brandDoseHeaders, qtyHeader, ...pharmacyHeaders, actionHeader]; break;
           case "respules": case "lotions": headers = [...baseHeaders, ...brandDoseHeaders, qtyHeader, daysHeader, ...pharmacyHeaders, actionHeader]; break;
           case "others": headers = [...baseHeaders, ...brandDoseHeaders, { title: "Qty/Notes", gridSpan: "span 1", tooltip:"Qty/Instructions"}, ...pharmacyHeaders, actionHeader]; break;
           case "sutureProcedureItems": case "dressingItems": headers = [{ title: "Item Name", gridSpan: "span 1", tooltip: "Item name" }, qtyHeader, ...pharmacyHeaders, actionHeader]; break;
           default: return null;
         }
         return headers.map((h, i) => ( <div key={`${type}-header-${i}`} className="font-medium text-xs text-gray-600 truncate" title={h.tooltip} style={{ gridColumn: h.gridSpan }}> {h.title} </div> ));
     };

    return (
      <section className="border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden bg-white">
        {/* Apply static classes using the maps */}
        <h2 className={`text-lg font-semibold p-3 border-b border-gray-200 flex justify-between items-center cursor-pointer transition-colors duration-150 ${bgClassMap[headerColor] || bgClassMap.gray} ${textClassMap[headerColor] || textClassMap.gray} ${hoverBgClassMap[headerColor] || hoverBgClassMap.gray}`}
          onClick={() => toggleSection(type)} aria-expanded={isExpanded} aria-controls={`section-content-${type}`} >
          {title}
          <span className={`text-sm text-gray-500 transition-transform duration-200 transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>▼</span>
        </h2>
        {isExpanded && (
          <div id={`section-content-${type}`} className="p-4">
            <div className="overflow-x-auto pb-2">
                <div className={`grid gap-x-4 items-center mb-3 pb-2 border-b border-gray-200`} style={{ gridTemplateColumns: gridTemplateColumns[type] }} >
                  {getHeaders()}
                </div>
                <div> {children} </div>
            </div>
            <div className="mt-4">
              {isDoctor && ( <ActionButton onClick={() => addRow(type)} color={buttonColor} title="Only doctors can add items"> + {addItemButtonText} </ActionButton> )}
            </div>
          </div>
        )}
      </section>
    );
  };

  // Section Order
  const sectionOrder = [ "tablets", "injections", "syrups", "drops", "creams", "respules", "lotions", "fluids", "powder", "sutureProcedureItems", "dressingItems", "others" ];

  // --- MAIN RETURN JSX ---
  if (!emp_no && !existingPrescription) {
    return ( <div className="p-6 text-center text-gray-500"> Please select an employee to view or create a prescription. </div> );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 border-b pb-2 mb-6">
        Prescription Details {emp_no && `for Emp #${emp_no}`} {data?.[0]?.name && `(${data[0].name})`}
        {prescriptionId && <span className="text-sm text-gray-500 font-normal ml-2">(ID: {prescriptionId})</span>}
      </h1>

      {/* Render sections */}
      {sectionOrder.map((type) => {
         let title, color, items, addButtonText;
         const stateMap = { tablets, injections, syrups, drops, creams, respules, lotions, fluids, powder, sutureProcedureItems, dressingItems, others };
         items = stateMap[type] || [];
         switch (type) { /* ... (case logic for title, color, addButtonText) ... */
            case "tablets": title="Tablets"; color="blue"; addButtonText="Add Tablet"; break;
            case "injections": title="Injections"; color="purple"; addButtonText="Add Injection"; break;
            case "syrups": title="Syrups"; color="green"; addButtonText="Add Syrup"; break;
            case "drops": title="Drops"; color="teal"; addButtonText="Add Drop"; break;
            case "creams": title="Creams & Ointments"; color="orange"; addButtonText="Add Cream/Ointment"; break;
            case "respules": title="Respules"; color="cyan"; addButtonText="Add Respule"; break;
            case "lotions": title="Lotions"; color="pink"; addButtonText="Add Lotion"; break;
            case "fluids": title="Fluids"; color="indigo"; addButtonText="Add Fluid"; break;
            case "powder": title="Powders"; color="lime"; addButtonText="Add Powder"; break;
            case "sutureProcedureItems": title="Suture & Procedure Items"; color="gray"; addButtonText="Add Suture/Procedure"; break;
            case "dressingItems": title="Dressing Items"; color="gray"; addButtonText="Add Dressing"; break;
            case "others": title="Others"; color="gray"; addButtonText="Add Other"; break;
            default: return null;
         }

        const children = items.map((_, index) => (
          <div key={`${type}-${index}`} className={`grid gap-x-4 mb-3 items-start`} style={{ gridTemplateColumns: gridTemplateColumns[type] }} >
            {renderInputFields(type, items, index)} {/* Renders inputs with correct permissions */}
            <div className="flex justify-center items-center h-full pt-1"> {/* Remove Button Col */}
              {isDoctor && (items.length > 1 || (items.length === 1)) && ( <RemoveButton onClick={removeRow} type={type} index={index} disabled={!isDoctor} /> )}
              {(!isDoctor || items.length <= 1) && <div className="w-8 h-8"></div>} {/* Placeholder */}
            </div>
          </div>
        ));

        return ( <React.Fragment key={type}> {renderSection(type, title, color, children, addButtonText)} </React.Fragment> );
      })}

      {/* Nurse Notes Section */}
      <section className="border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden bg-white">
         <h2 className={`text-lg font-semibold p-3 bg-teal-50 border-b border-gray-200 text-teal-700`}> Nurse Notes </h2>
         <div className="p-4">
             <textarea value={nurseNotes || ""} onChange={(e) => handleInputChange(e, "nurseNotes", null, "nurseNotes")} className={`px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm resize-y min-h-[80px] ${!isNurse ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-teal-50'}`} rows="4" placeholder={isNurse ? "Enter relevant nursing notes..." : "(Editable by Nurse only)"} disabled={!isNurse} title={isNurse ? "Enter nursing notes" : "Read-only for non-nurses"} />
         </div>
      </section>

      {/* Footer: Submission Info & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 border-t border-gray-300 pt-6 gap-4">
         <div className="flex flex-col sm:flex-row sm:space-x-6 w-full sm:w-auto text-sm">
             {/* Submitted By Select */}
             <div className="mb-3 sm:mb-0"> <label htmlFor="submittedBy" className="block font-medium text-gray-700 mb-1">Prescribed By:</label> <div className="relative"> <select id="submittedBy" value={submittedBy} onChange={(e) => { if (isDoctor) setSubmittedBy(e.target.value); }} className={`px-4 py-2 w-full sm:w-48 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none ${!isDoctor ? 'bg-gray-100 cursor-not-allowed' : ''}`} disabled={!isDoctor}> <option value="SK">Dr. SK</option> <option value="AA">Dr. AA</option> </select> <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div> </div> </div>
             {/* Issued By Select */}
             <div> <label htmlFor="issuedby" className="block font-medium text-gray-700 mb-1">Issued By:</label> <div className="relative"> <select id="issuedby" value={issuedby} onChange={(e) => { if (isNurse || isPharmacy) setIssuedby(e.target.value); }} className={`px-4 py-2 w-full sm:w-48 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none ${!(isNurse || isPharmacy) ? 'bg-gray-100 cursor-not-allowed' : ''}`} disabled={!(isNurse || isPharmacy)}> <option value="Nurse">Nurse</option> <option value="Pharmacy">Pharmacy</option> </select> <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div> </div> </div>
         </div>
         {/* Action Buttons */}
         <div className="flex space-x-4 w-full sm:w-auto justify-end pt-2 sm:pt-0">
             <ActionButton onClick={handleSubmit} color="green" title={existingPrescription ? "Save changes" : "Submit new prescription"} className="min-w-[120px]"> {existingPrescription ? "Update Prescription" : "Submit Prescription"} </ActionButton>
             <ActionButton onClick={handleGeneratePrescription} color="blue" title="Generate downloadable PDF" className="min-w-[120px]" disabled={!emp_no}> Generate PDF </ActionButton>
         </div>
      </div>

    </div> // End main container
  );
};

export default Prescription;