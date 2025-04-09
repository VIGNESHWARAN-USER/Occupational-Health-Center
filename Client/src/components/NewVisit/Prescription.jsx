import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { debounce } from "lodash";
import jsPDF from 'jspdf'; // <-- Import jsPDF

const Prescription = ({ data, onPrescriptionUpdate }) => {
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

  // State for suggestions
  const [brandSuggestions, setBrandSuggestions] = useState({});
  const [chemicalSuggestions, setChemicalSuggestions] = useState({}); // Kept for potential future use, though fetch logic is commented out
  const [doseSuggestions, setDoseSuggestions] = useState({});
  const [showBrandSuggestions, setShowBrandSuggestions] = useState({});
  const [showChemicalSuggestions, setShowChemicalSuggestions] = useState({}); // Kept for potential future use
  const [showDoseSuggestions, setShowDoseSuggestions] = useState({});
  const [doseManuallyEntered, setDoseManuallyEntered] = useState({});

  const [expandedSections, setExpandedSections] = useState([]); // State to manage expanded sections

  // Mappings and constants
  const medicineForms = {
    tablets: "Tablet",
    injections: "Injection",
    syrups: "Syrup",
    drops: "Drops",
    creams: "Creams", // Combined with Ointments implicitly
    respules: "Respules",
    lotions: "Lotions",
    fluids: "Fluids",
    powder: "Powder",
    sutureProcedureItems: "Suture Procedure Items",
    dressingItems: "Dressing Items",
    others: "Other",
  };

  const timingOptions = [
    { value: "Morning", label: "Morning" },
    { value: "AN", label: "AN" }, // Afternoon
    { value: "Night", label: "Night" },
    { value: "6h/d", label: "6hrly" }, // Every 6 hours
    // Add other common timings as needed
  ];
  const foodOptions = ["BF", "AF", "WF", "Well Anyways"]; // Before Food, After Food, With Food, Any Time

  // Role-based access control
  const accessLevel = localStorage.getItem("accessLevel");
  const isDoctor = accessLevel === "doctor";
  const isNurse = accessLevel === "nurse";
  const isPharmacy = accessLevel === "pharmacy";

  // Default row structure
  const getDefaultRow = useCallback(
    (type) => ({
      chemicalName: "",
      brandName: "",
      doseVolume: "",
      qty: "",
      timing: [],
      food: "",
      days: "", // Applicable for several types, ensured present
      serving: "", // Specifically for Syrups & Drops
      issuedIn: "",
      issuedOut: "",
      prescriptionOut: "",
    }),
    []
  );

  // Effect to initialize state from props or defaults
  useEffect(() => {
    if (!emp_no) return;

    const initializePrescription = () => {
      let initialData = {
        tablets: [getDefaultRow("tablets")],
        injections: [getDefaultRow("injections")],
        syrups: [getDefaultRow("syrups")],
        drops: [getDefaultRow("drops")],
        creams: [getDefaultRow("creams")],
        respules: [getDefaultRow("respules")],
        lotions: [getDefaultRow("lotions")],
        fluids: [getDefaultRow("fluids")],
        powder: [getDefaultRow("powder")],
        sutureProcedureItems: [getDefaultRow("sutureProcedureItems")],
        dressingItems: [getDefaultRow("dressingItems")],
        others: [getDefaultRow("others")],
        submitted_by: "SK",
        issued_by: "Nurse",
        nurse_notes: "",
      };

      if (existingPrescription) {
        const mapTiming = (timing) => {
          if (!timing) return [];
          if (Array.isArray(timing)) {
            return timing
              .map((t) =>
                typeof t === "string"
                  ? { value: t, label: t }
                  : typeof t === "object" && t !== null && t.value
                  ? t
                  : null
              )
              .filter((t) => t !== null);
          }
          if (typeof timing === "string") {
            return timing
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .map((t) => ({ value: t, label: t }));
          }
          return [];
        };

        initialData = {
          tablets: existingPrescription.tablets?.length
            ? existingPrescription.tablets.map((item) => ({
                ...getDefaultRow("tablets"),
                ...item,
                timing: mapTiming(item.timing),
              }))
            : [getDefaultRow("tablets")],
          injections: existingPrescription.injections?.length
            ? existingPrescription.injections.map((item) => ({
                ...getDefaultRow("injections"),
                ...item,
              }))
            : [getDefaultRow("injections")],
          syrups: existingPrescription.syrups?.length
            ? existingPrescription.syrups.map((item) => ({
                ...getDefaultRow("syrups"),
                ...item,
                timing: mapTiming(item.timing),
              }))
            : [getDefaultRow("syrups")],
          drops: existingPrescription.drops?.length
            ? existingPrescription.drops.map((item) => ({
                ...getDefaultRow("drops"),
                ...item,
                // Handle potential old naming if needed, otherwise stick to chemicalName
                chemicalName: item.chemicalName || item.drugName || item.dropName || "",
                serving: item.serving || "",
                timing: mapTiming(item.timing),
                food: item.food || "",
                days: item.days || "",
              }))
            : [getDefaultRow("drops")],
          creams: existingPrescription.creams?.length
            ? existingPrescription.creams.map((item) => ({
                ...getDefaultRow("creams"),
                ...item,
                timing: mapTiming(item.timing),
                food: item.food || "",
                days: item.days || "",
              }))
            : [getDefaultRow("creams")],
          respules: existingPrescription.respules?.length
            ? existingPrescription.respules.map((item) => ({
                ...getDefaultRow("respules"),
                ...item,
              }))
            : [getDefaultRow("respules")],
          lotions: existingPrescription.lotions?.length
            ? existingPrescription.lotions.map((item) => ({
                ...getDefaultRow("lotions"),
                ...item,
                days: item.days || "",
              }))
            : [getDefaultRow("lotions")],
          fluids: existingPrescription.fluids?.length
            ? existingPrescription.fluids.map((item) => ({
                ...getDefaultRow("fluids"),
                ...item,
                 // Ensure chemicalName exists even if old data used a different field
                chemicalName: item.chemicalName || "",
              }))
            : [getDefaultRow("fluids")],
          powder: existingPrescription.powder?.length
            ? existingPrescription.powder.map((item) => ({
                ...getDefaultRow("powder"),
                ...item,
                 timing: mapTiming(item.timing), // Assuming powder might have timing
              }))
            : [getDefaultRow("powder")],
          sutureProcedureItems: existingPrescription.sutureProcedureItems
            ?.length
            ? existingPrescription.sutureProcedureItems.map((item) => ({
                ...getDefaultRow("sutureProcedureItems"),
                ...item,
                chemicalName: item.chemicalName || item.itemName || "", // Handle potential old naming
              }))
            : [getDefaultRow("sutureProcedureItems")],
          dressingItems: existingPrescription.dressingItems?.length
            ? existingPrescription.dressingItems.map((item) => ({
                ...getDefaultRow("dressingItems"),
                ...item,
                chemicalName: item.chemicalName || item.itemName || "", // Handle potential old naming
              }))
            : [getDefaultRow("dressingItems")],
          others: existingPrescription.others?.length
            ? existingPrescription.others.map((item) => ({
                ...getDefaultRow("others"),
                ...item,
              }))
            : [getDefaultRow("others")],
          submitted_by: existingPrescription.submitted_by || "SK",
          issued_by: existingPrescription.issued_by || "Nurse",
          nurse_notes: existingPrescription.nurse_notes || "",
        };

        // Ensure pharmacy fields exist on all items
        Object.keys(initialData).forEach((key) => {
          if (Array.isArray(initialData[key])) {
            initialData[key] = initialData[key].map((item) => ({
              ...item,
              issuedIn: item.issuedIn ?? "",
              issuedOut: item.issuedOut ?? "",
              prescriptionOut: item.prescriptionOut ?? "",
            }));
          }
        });
      }

      // Set state for each section
      setTablets(initialData.tablets);
      setInjections(initialData.injections);
      setSyrups(initialData.syrups);
      setDrops(initialData.drops);
      setCreams(initialData.creams);
      setRespules(initialData.respules);
      setLotions(initialData.lotions);
      setFluids(initialData.fluids);
      setPowder(initialData.powder);
      setSutureProcedureItems(initialData.sutureProcedureItems);
      setDressingItems(initialData.dressingItems);
      setOthers(initialData.others);

      // Set other state
      setSubmittedBy(initialData.submitted_by);
      setIssuedby(initialData.issued_by);
      setNurseNotes(initialData.nurse_notes);

       // Automatically expand sections that have data
       const sectionsWithData = Object.entries(initialData)
         .filter(([key, value]) => Array.isArray(value) && filterEmptyRows(value, key).length > 0)
         .map(([key]) => key);
       setExpandedSections(sectionsWithData);


    };

    initializePrescription();
  }, [emp_no, existingPrescription, getDefaultRow]);


  // Function to add a new row (Doctor only)
  const addRow = (type) => {
    if (!isDoctor) return;
    const newRow = getDefaultRow(type);
    const setState = (setter) => setter((prev) => [...prev, newRow]);

    switch (type) {
      case "tablets": setState(setTablets); break;
      case "injections": setState(setInjections); break;
      case "syrups": setState(setSyrups); break;
      case "drops": setState(setDrops); break;
      case "creams": setState(setCreams); break;
      case "respules": setState(setRespules); break;
      case "lotions": setState(setLotions); break;
      case "fluids": setState(setFluids); break;
      case "powder": setState(setPowder); break;
      case "sutureProcedureItems": setState(setSutureProcedureItems); break;
      case "dressingItems": setState(setDressingItems); break;
      case "others": setState(setOthers); break;
      default: console.warn("Attempted to add row for unknown type:", type); break;
    }
    // Ensure the section is expanded when a row is added
    if (!expandedSections.includes(type)) {
      setExpandedSections((prev) => [...prev, type]);
    }
  };

  // --- Suggestion Fetching Functions (Doctor Driven) ---
  const fetchBrandSuggestions = useCallback(
    debounce(async (chemicalName, medicineForm, type, index) => {
      if (chemicalName?.length < 3 || !medicineForm) {
        setBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: [] } }));
        setShowBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8000/get-brand-names/?chemical_name=${encodeURIComponent(chemicalName)}&medicine_form=${encodeURIComponent(medicineForm)}`
        );
        setBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: response.data.suggestions } }));
        setShowBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: true } }));
      } catch (error) {
        console.error("Error fetching brand name suggestions:", error);
         setBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: [] } }));
         setShowBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
      }
    }, 500),
    []
  );

  // Chemical suggestions fetch logic (currently commented out as per user's code, can be re-enabled if needed)
  /*
  const fetchChemicalSuggestions = useCallback(
    debounce(async (brandName, medicineForm, type, index) => {
      // ... implementation ...
    }, 500),
    []
  );
  */

  // --- Fetch Dose Suggestions ---
  const fetchDoseSuggestions = useCallback(
    debounce(async (brandName, chemicalName, medicineForm, type, index) => {
      const requiresDoseFetch = [
        "tablets", "syrups", "drops", "creams", "lotions",
        "powder", "others", "injections", "respules", "fluids",
      ].includes(type);

      if (!requiresDoseFetch || !brandName || !chemicalName || !medicineForm) {
        setDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: [] } }));
        setShowDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/get-dose-volume/?brand_name=${encodeURIComponent(brandName)}&chemical_name=${encodeURIComponent(chemicalName)}&medicine_form=${encodeURIComponent(medicineForm)}`
        );
        const suggestions = response.data.suggestions;
        setDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: suggestions } }));
        // Only show suggestions if there are any AND dose wasn't manually entered recently
        if (!doseManuallyEntered?.[type]?.[index]) {
            setShowDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: suggestions.length > 0 } }));
        } else {
             setShowDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
        }
      } catch (error) {
        console.error("Error fetching dose volume suggestions:", error);
        setDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: [] } }));
        setShowDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
      }
    }, 500),
    [doseManuallyEntered] // Re-create debounce if manual entry state changes
  );


  // Function to update a specific field in a row's state immutably
  const updateRowState = (type, index, field, value) => {
    const getUpdater = (setter) => (prevState) => {
      const newState = prevState.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return newState;
    };
    switch (type) {
      case "tablets": setTablets(getUpdater(setTablets)); break;
      case "injections": setInjections(getUpdater(setInjections)); break;
      case "syrups": setSyrups(getUpdater(setSyrups)); break;
      case "drops": setDrops(getUpdater(setDrops)); break;
      case "creams": setCreams(getUpdater(setCreams)); break;
      case "respules": setRespules(getUpdater(setRespules)); break;
      case "lotions": setLotions(getUpdater(setLotions)); break;
      case "fluids": setFluids(getUpdater(setFluids)); break;
      case "powder": setPowder(getUpdater(setPowder)); break;
      case "sutureProcedureItems": setSutureProcedureItems(getUpdater(setSutureProcedureItems)); break;
      case "dressingItems": setDressingItems(getUpdater(setDressingItems)); break;
      case "others": setOthers(getUpdater(setOthers)); break;
      default: console.warn(`Attempted to update state for unknown type: ${type}`); break;
    }
  };

  // --- handleInputChange ---
  const handleInputChange = (e, type, index, field) => {

    if (type === "nurseNotes") {
      const value = e?.target?.value ?? ""; // Handle potential undefined event
      if (!isNurse) return;
      setNurseNotes(value);
      return;
    }

    const isPharmacyField = ["issuedIn", "issuedOut", "prescriptionOut"].includes(field);
    const isMedicineType = Object.keys(medicineForms).includes(type);
    if (!isMedicineType) return;

    // Role-based input restriction
    if (isPharmacyField && !isPharmacy) return;
    if (!isPharmacyField && !isDoctor) return;

    let value;
    if (field === "timing") {
      value = e; // react-select passes the whole selected options array/object
    } else if (e && e.target) {
      value = e.target.value; // Standard input/select/textarea
    } else {
      value = e; // Catch other cases, e.g., direct value setting
    }

    // If doctor manually types in dose, mark it and hide suggestions
    if (field === "doseVolume" && isDoctor) {
      setDoseManuallyEntered((prev) => ({ ...prev, [type]: { ...prev[type], [index]: true } }));
      setShowDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
    }

    // Update the specific row's state
    updateRowState(type, index, field, value);

    // --- Trigger Suggestions (Doctor Only, non-pharmacy fields) ---
    if (isDoctor && !isPharmacyField) {
        const medicineFormValue = medicineForms[type];
        if (!medicineFormValue) return;

        // Need to get the potentially updated state *after* the updateRowState call.
        // We can access the state directly here, but it might not be updated yet due to async nature.
        // A more robust way might involve getting the current state *before* updateRowState,
        // creating the potentially updated item object, and then passing that to suggestion fetches.
        // Let's try a direct approach first, acknowledging potential race conditions.

        // Use setTimeout to allow state update to likely complete before fetching suggestions
        setTimeout(() => {
            let currentStateForType;
            switch (type) {
                case "tablets": currentStateForType = tablets; break;
                case "injections": currentStateForType = injections; break;
                case "syrups": currentStateForType = syrups; break;
                case "drops": currentStateForType = drops; break;
                case "creams": currentStateForType = creams; break;
                case "respules": currentStateForType = respules; break;
                case "lotions": currentStateForType = lotions; break;
                case "fluids": currentStateForType = fluids; break;
                case "powder": currentStateForType = powder; break;
                case "sutureProcedureItems": currentStateForType = sutureProcedureItems; break;
                case "dressingItems": currentStateForType = dressingItems; break;
                case "others": currentStateForType = others; break;
                default: currentStateForType = []; break;
            }

            // Get the item *after* state update (hopefully)
            const currentItem = currentStateForType[index];
            if (!currentItem) return; // Should not happen normally

            const currentPrimaryIdentifierValue = currentItem.chemicalName;
            const currentBrandName = currentItem.brandName;

            const standardSuggestionTypes = [
                "tablets", "syrups", "drops", "creams", "lotions",
                "powder", "others", "injections", "respules", "fluids"
            ];

            if (standardSuggestionTypes.includes(type)) {
                if (field === "chemicalName") {
                    fetchBrandSuggestions(value, medicineFormValue, type, index);
                    // If brand name exists, also update dose suggestions based on new chemical name
                    if (currentBrandName) {
                        fetchDoseSuggestions(currentBrandName, value, medicineFormValue, type, index);
                    }
                     // Reset manual dose entry flag when chemical name changes
                    setDoseManuallyEntered((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
                } else if (field === "brandName") {
                    // Fetch chemical suggestions (if uncommented)
                    // fetchChemicalSuggestions(value, medicineFormValue, type, index);

                    // Fetch brand suggestions based on what's typed (might show similar brands)
                    fetchBrandSuggestions(currentPrimaryIdentifierValue, medicineFormValue, type, index); // Fetch brands based on chemical

                    // If a chemical/primary ID also exists, fetch/update dose suggestions
                    if (currentPrimaryIdentifierValue) {
                        fetchDoseSuggestions(value, currentPrimaryIdentifierValue, medicineFormValue, type, index);
                    }
                     // Reset manual dose entry flag when brand name changes
                    setDoseManuallyEntered((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
                } else if (field !== "doseVolume") {
                    // For changes in other fields (like Qty, Timing, etc.),
                    // re-fetch dose suggestions if both identifiers are present
                    if (currentPrimaryIdentifierValue && currentBrandName) {
                         fetchDoseSuggestions(currentBrandName, currentPrimaryIdentifierValue, medicineFormValue, type, index);
                    }
                }
            }
        }, 0); // setTimeout with 0ms delay
    }
};


  // --- removeRow ---
  const removeRow = (type, index) => {
    if (!isDoctor) return;
    const setState = (setter) =>
      setter((prev) => {
        // Prevent removing the last row if it's the only one
        if (prev.length <= 1) {
            // Instead of preventing deletion, clear the contents of the last row
             return prev.map((item, i) => i === index ? getDefaultRow(type) : item);
            // Alternatively, to keep the prevention:
            // return prev;
        }
        return prev.filter((_, i) => i !== index);
      });
    switch (type) {
      case "tablets": setState(setTablets); break;
      case "injections": setState(setInjections); break;
      case "syrups": setState(setSyrups); break;
      case "drops": setState(setDrops); break;
      case "creams": setState(setCreams); break;
      case "respules": setState(setRespules); break;
      case "lotions": setState(setLotions); break;
      case "fluids": setState(setFluids); break;
      case "powder": setState(setPowder); break;
      case "sutureProcedureItems": setState(setSutureProcedureItems); break;
      case "dressingItems": setState(setDressingItems); break;
      case "others": setState(setOthers); break;
      default: console.warn("Attempted to remove row for unknown type:", type); break;
    }
  };

  // --- getCurrentItemState ---
  // Helper to get the current state of an item, needed for suggestion clicks
   const getCurrentItemState = (type, index) => {
     // Use a direct state access pattern similar to handleInputChange timeout
     // This might still have timing issues, consider passing item data directly if needed
     switch (type) {
       case "tablets": return tablets[index];
       case "injections": return injections[index];
       case "syrups": return syrups[index];
       case "drops": return drops[index];
       case "creams": return creams[index];
       case "respules": return respules[index];
       case "lotions": return lotions[index];
       case "fluids": return fluids[index];
       case "powder": return powder[index];
       case "sutureProcedureItems": return sutureProcedureItems[index];
       case "dressingItems": return dressingItems[index];
       case "others": return others[index];
       default: return null;
     }
   };

  // --- handleSuggestionClick ---
  const handleSuggestionClick = (suggestion, type, index, field) => {
    if (!isDoctor) return;

    updateRowState(type, index, field, suggestion);

    // Reset manual dose entry flag when a suggestion is clicked
    setDoseManuallyEntered((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));


    const medicineFormValue = medicineForms[type];
    if (!medicineFormValue) return;

    // Use setTimeout to allow the state update from updateRowState to likely propagate
    setTimeout(() => {
      const updatedItem = getCurrentItemState(type, index); // Get the item *after* the state update
      if (!updatedItem) return;

      const primaryIdentifierValue = updatedItem.chemicalName;
      const brandValue = updatedItem.brandName;

      const standardSuggestionTypes = [
        "tablets", "syrups", "drops", "creams", "lotions",
        "powder", "others", "injections", "respules", "fluids"
      ];

      if (standardSuggestionTypes.includes(type)) {
        if (field === "brandName") {
          // fetchChemicalSuggestions(suggestion, medicineFormValue, type, index); // If uncommented
          // If chemical name exists, fetch dose suggestions based on the *selected* brand
          if (primaryIdentifierValue) {
            fetchDoseSuggestions(suggestion, primaryIdentifierValue, medicineFormValue, type, index);
          }
        } else if (field === "chemicalName") {
          // Fetch brand suggestions based on the *selected* chemical name
          fetchBrandSuggestions(suggestion, medicineFormValue, type, index);
          // If brand name exists, fetch dose suggestions based on the *selected* chemical name
          if (brandValue) {
            fetchDoseSuggestions(brandValue, suggestion, medicineFormValue, type, index);
          }
        }
      }

      // Hide the suggestion list after selection
      // Add slight delay to ensure click registers before hiding
      setTimeout(() => {
        if (field === "brandName") {
             setShowBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
             // setShowChemicalSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } })); // Hide chemical if needed
        } else if (field === "chemicalName") {
             setShowBrandSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
        }
      }, 150); // Adjust delay if needed

    }, 50); // Small delay for state update
  };


  // --- handleDoseSuggestionClick ---
  const handleDoseSuggestionClick = (suggestion, type, index) => {
    const requiresDose = [
        "tablets", "syrups", "drops", "creams", "lotions",
        "powder", "others", "injections", "respules", "fluids"
      ].includes(type);
    if (!requiresDose || !isDoctor) return;

    // Mark that dose was selected from suggestion, not manually entered
    setDoseManuallyEntered((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
    updateRowState(type, index, "doseVolume", suggestion);
    setShowDoseSuggestions((prev) => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
  };

  // --- Rendering Functions ---

   // Render Chemical/Brand Suggestions Dropdown
   const renderSuggestions = (type, index, field) => {
     let suggestions = [], showSuggestions = false;
     let suggestionsList, showSuggestionsState;

     const hasBrandChemicalSuggestions = [
         "tablets", "syrups", "drops", "creams", "lotions",
         "powder", "others", "injections", "respules", "fluids"
       ].includes(type);

     if (!hasBrandChemicalSuggestions) return null;

     if (field === "brandName") {
       // When typing in Brand field, show Brand suggestions based on Chemical
       const currentItem = getCurrentItemState(type, index);
       const chemicalName = currentItem?.chemicalName;
       // Trigger fetch if not already done (e.g., on focus or initial load with chemical)
       // This might need refinement depending on exact UX desired
       if (isDoctor && chemicalName && !brandSuggestions?.[type]?.[index]?.length) {
            // fetchBrandSuggestions(chemicalName, medicineForms[type], type, index); // Potentially trigger here too
       }
       suggestionsList = brandSuggestions;
       showSuggestionsState = showBrandSuggestions;
     } else if (field === "chemicalName") {
         // When typing in Chemical field, show Brand suggestions
         suggestionsList = brandSuggestions;
         showSuggestionsState = showBrandSuggestions;
         // NOTE: Chemical suggestions based on Brand are currently disabled in the provided code.
         // If re-enabled, logic would go here similar to the brandName case above.
     } else {
       return null; // No suggestions for other fields this way
     }

     suggestions = suggestionsList?.[type]?.[index] || [];
     showSuggestions = showSuggestionsState?.[type]?.[index] || false;

     if (isDoctor && showSuggestions && suggestions.length > 0) {
       return (
         <div className="absolute z-20 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-48 overflow-y-auto">
           {suggestions.map((suggestion, i) => (
             <div
               key={`${type}-${index}-${field}-sugg-${i}`}
               className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
               // Use onMouseDown to prevent blur before click registers
               onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(suggestion, type, index, field); }}
             >
               {suggestion}
             </div>
           ))}
         </div>
       );
     }
     return null;
   };

  // Render Dose Suggestions Dropdown
  const renderDoseVolumeSuggestions = (type, index) => {
    const requiresDose = [
        "tablets", "syrups", "drops", "creams", "lotions",
        "powder", "others", "injections", "respules", "fluids"
      ].includes(type);
    if (!requiresDose) return null;

    const suggestions = doseSuggestions?.[type]?.[index] || [];
    const show = showDoseSuggestions?.[type]?.[index] || false;

    // Only show if doctor, suggestions exist, and dose wasn't manually entered
    if (isDoctor && show && suggestions.length > 0 && !doseManuallyEntered?.[type]?.[index]) {
      return (
        <div className="absolute z-20 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, i) => (
            <div
              key={`${type}-${index}-dose-sugg-${i}`}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
              onMouseDown={(e) => { e.preventDefault(); handleDoseSuggestionClick(suggestion, type, index); }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

   // --- Render Input Fields ---
   const renderInputFields = (type, items, index) => {

     const item = items[index];
     if (!item) return null; // Should not happen if items array is managed correctly

     // Base styling classes
     const inputBaseClass = `px-3 py-1.5 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 text-sm bg-white focus:ring-blue-500`;
     const selectBaseClass = `w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 text-sm bg-white focus:ring-blue-500`; // For react-select wrapper
     const nativeSelectBaseClass = `px-3 py-1.5 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 text-sm bg-white focus:ring-blue-500 appearance-none`; // For native <select>
     const textareaBaseClass = `px-3 py-1.5 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 text-sm bg-white focus:ring-blue-500 resize-none`;
     const disabledClass = "bg-gray-100 cursor-not-allowed opacity-70";
     const pharmacyEnabledClass = "bg-yellow-50"; // Highlight pharmacy fields when editable

     // Determine disabled state based on role
     const isDoctorFieldDisabled = !isDoctor;
     const isPharmacyFieldDisabled = !isPharmacy;
     const doctorDisabledClass = isDoctorFieldDisabled ? disabledClass : "";
     const pharmacyDisabledClass = isPharmacyFieldDisabled ? disabledClass : "";

     // --- react-select Styles ---
      const reactSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '38px', // Match approx height of text inputs
            height: 'auto', // Allow wrapping
            borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // Tailwind blue-500 and gray-300
            boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : provided.boxShadow,
            borderRadius: "0.375rem", // rounded-md
            fontSize: "0.875rem", // text-sm
            backgroundColor: isDoctorFieldDisabled ? '#f3f4f6' : 'white', // bg-gray-100 or white
            opacity: isDoctorFieldDisabled ? 0.7 : 1,
            cursor: isDoctorFieldDisabled ? 'not-allowed' : 'default',
            '&:hover': {
                borderColor: state.isFocused ? '#3b82f6' : '#9ca3af', // blue-500 or gray-400
            },
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: "1px 6px", // Adjust vertical padding if needed
            alignItems: 'center', // Vertically center selected items
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px',
            padding: '0px',
            alignSelf: 'stretch', // Ensure input takes full height
        }),
        indicatorSeparator: () => ({
            display: "none", // Hide the vertical line separator
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            alignSelf: 'stretch', // Align dropdown arrow vertically
        }),
        menu: (provided) => ({
            ...provided,
            fontSize: "0.875rem", // text-sm for dropdown options
            zIndex: 30, // Ensure dropdown appears above other elements
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "#e0e7ff", // bg-indigo-100
            margin: "2px", // Space between multi-select items
            alignItems: 'center', // Center text/remove icon in multi-value pill
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            padding: "2px",
            paddingLeft: "4px",
            whiteSpace: 'normal', // Allow wrapping within the pill if needed
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            '&:hover': {
                backgroundColor: "#be123c", // bg-red-700 on hover
                color: "white",
            },
            alignSelf: 'center', // Center the 'x' button vertically
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9ca3af', // text-gray-400
        }),
    };

     // --- Placeholder Logic ---
     let primaryIdentifierPlaceholder = "Chemical Name"; // Default

     // --- Reusable Field Renderers ---

     // Renders Chemical Name input with Brand suggestions logic
     const renderChemicalInput = () => (
       <div className="relative">
         <input type="text" placeholder={primaryIdentifierPlaceholder} value={item.chemicalName || ""}
           onChange={(e) => handleInputChange(e, type, index, "chemicalName")}
           onFocus={() => { if (item.chemicalName?.length >= 3 && isDoctor) { fetchBrandSuggestions(item.chemicalName, medicineForms[type], type, index); } }}
           onBlur={() => setTimeout(() => setShowBrandSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: false } })), 200)} // Increased delay slightly
           className={`${inputBaseClass} ${doctorDisabledClass}`} disabled={isDoctorFieldDisabled} autoComplete="off" />
         {renderSuggestions(type, index, "chemicalName")}
       </div>
     );

     // Renders Brand Name input with its specific suggestion logic (currently just showing brand suggestions again)
     const renderBrandInput = () => {
       const showField = ["tablets", "syrups", "drops", "creams", "lotions", "powder", "others", "injections", "respules", "fluids"].includes(type);
       if (!showField) return null;
       return (
         <div className="relative">
           <input type="text" placeholder="Brand Name" value={item.brandName || ""}
             onChange={(e) => handleInputChange(e, type, index, "brandName")}
             // onFocus logic for Brand field (e.g., fetchChemicalSuggestions or show similar brands)
              onFocus={() => {
                    // Option 1: Fetch chemical if brand has >=3 chars (if fetchChemicalSuggestions is enabled)
                    // if (item.brandName?.length >= 3 && isDoctor) { fetchChemicalSuggestions(item.brandName, medicineForms[type], type, index); }
                    // Option 2: If chemical name exists, show relevant brands again on focus
                    if (item.chemicalName && isDoctor) { fetchBrandSuggestions(item.chemicalName, medicineForms[type], type, index); }
              }}
              onBlur={() => setTimeout(() => {
                    setShowBrandSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
                    // setShowChemicalSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: false } })); // Hide chemical if needed
              }, 200)}
             className={`${inputBaseClass} ${doctorDisabledClass}`} disabled={isDoctorFieldDisabled} autoComplete="off" />
           {renderSuggestions(type, index, "brandName")} {/* This now shows brand suggestions */}
         </div>
       );
     };

     // Renders Dose/Volume input with Dose suggestions logic
     const renderDoseInput = () => {
       const showField = ["tablets", "syrups", "drops", "creams", "lotions", "powder", "others", "injections", "respules", "fluids"].includes(type);
       if (!showField) return null;
       return (
         <div className="relative">
           <input type="text" placeholder="Dose/Vol" value={item.doseVolume || ""}
             onChange={(e) => handleInputChange(e, type, index, "doseVolume")}
             onFocus={() => { if (item.brandName && item.chemicalName && isDoctor) { fetchDoseSuggestions(item.brandName, item.chemicalName, medicineForms[type], type, index); } }}
             onBlur={() => setTimeout(() => setShowDoseSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: false } })), 200)}
             className={`${inputBaseClass} ${doctorDisabledClass}`} disabled={isDoctorFieldDisabled} autoComplete="off" />
           {renderDoseVolumeSuggestions(type, index)}
         </div>
       );
     };

      // Renders Qty/Serving/Application input
      const renderQtyInput = () => {
          let placeholder = "Qty";
          let fieldName = "qty";
          if (type === 'syrups' || type === 'drops') {
            placeholder = type === 'syrups' ? "Serving (e.g., 5ml)" : "Serving (e.g., 1 drop)";
            fieldName = "serving";
          } else if (type === 'creams' || type === 'lotions') {
              placeholder = "Qty / Application";
          } else if (type === 'fluids') {
              placeholder = "Qty / Rate";
          } else if (type === 'others') {
              placeholder = "Qty / Notes";
          } else if (type === 'injections' || type === 'respules' || type === 'powder' || type === 'tablets') {
              placeholder = "Qty";
          } else if (type === 'sutureProcedureItems' || type === 'dressingItems') {
              placeholder = "Qty";
          }
          // Sutures and Dressings don't need this specific field handled here (it's done in their case)

         // Only render if the type requires quantity/serving
         const showField = ![ "sutureProcedureItems", "dressingItems"].includes(type); // Simplified exclusion
         if (!showField) return null;

         // Correction: Need to render Qty input specifically for certain types not covered by serving
          const requiresQty = ["tablets", "injections", "creams", "respules", "lotions", "fluids", "powder", "others"].includes(type);
          if (!requiresQty && fieldName !== 'serving') return null; // Don't render if not qty or serving

          return (
            <input type="text" placeholder={placeholder} value={item[fieldName] || ""}
                onChange={(e) => handleInputChange(e, type, index, fieldName)}
                className={`${inputBaseClass} ${doctorDisabledClass}`} disabled={isDoctorFieldDisabled} />
          );
      };


      // Renders Timing multi-select
      const renderTimingSelect = () => {
        const showField = ["tablets", "syrups", "drops", "creams", "powder"].includes(type); // Add others if needed
        if (!showField) return null;
        return (
          <Select name="timing" isMulti options={timingOptions} value={item.timing || []}
            onChange={(selectedOptions) => handleInputChange(selectedOptions, type, index, "timing")}
            className={`${selectBaseClass} ${doctorDisabledClass}`} // Apply disabled styles to the container
            styles={reactSelectStyles} isDisabled={isDoctorFieldDisabled}
            placeholder="Timing" closeMenuOnSelect={false} isClearable={false} />
        );
      };

      // Renders Food native select
      const renderFoodSelect = () => {
          const showField = ["tablets", "syrups", "drops", "creams"].includes(type); // Add others if needed
          if (!showField) return null;
          return (
              <div className="relative"> {/* Add wrapper for custom arrow */}
                  <select value={item.food || ""} onChange={(e) => handleInputChange(e, type, index, "food")}
                      className={`${nativeSelectBaseClass} ${doctorDisabledClass}`} disabled={isDoctorFieldDisabled}>
                      <option value="">Food</option>
                      {foodOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {/* Custom arrow overlay */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
              </div>
          );
      };

      // Renders Days input
      const renderDaysInput = () => {
        const showField = ["tablets", "syrups", "drops", "creams", "respules", "lotions", "powder"].includes(type);
        if (!showField) return null;
        return (
          <input type="text" placeholder="Days" value={item.days || ""}
            onChange={(e) => handleInputChange(e, type, index, "days")}
            className={`${inputBaseClass} ${doctorDisabledClass}`} disabled={isDoctorFieldDisabled} />
        );
      };

      // Renders Pharmacy-specific textareas
      const renderPharmacyFields = () => (
        <>
          <textarea placeholder="Issued In" value={item.issuedIn || ""} onChange={(e) => handleInputChange(e, type, index, "issuedIn")}
            className={`${textareaBaseClass} ${pharmacyDisabledClass} ${isPharmacy ? pharmacyEnabledClass : ''}`} disabled={isPharmacyFieldDisabled} rows="1" title="Pharmacy Use Only: Issued In Details" />
          <textarea placeholder="Issued Out" value={item.issuedOut || ""} onChange={(e) => handleInputChange(e, type, index, "issuedOut")}
            className={`${textareaBaseClass} ${pharmacyDisabledClass} ${isPharmacy ? pharmacyEnabledClass : ''}`} disabled={isPharmacyFieldDisabled} rows="1" title="Pharmacy Use Only: Issued Out Details" />
          <textarea placeholder="Presc. Out" value={item.prescriptionOut || ""} onChange={(e) => handleInputChange(e, type, index, "prescriptionOut")}
            className={`${textareaBaseClass} ${pharmacyDisabledClass} ${isPharmacy ? pharmacyEnabledClass : ''}`} disabled={isPharmacyFieldDisabled} rows="1" title="Pharmacy Use Only: Prescription Out Details" />
        </>
      );

     // --- Type-Specific Layout ---
     // Use the reusable render functions based on the 'type'
     switch (type) {
       case "tablets":
       case "syrups":
       case "drops":
       case "creams":
       case "powder":
         return (
           <>
             {renderChemicalInput()}
             {renderBrandInput()}
             {renderDoseInput()}
             {renderQtyInput()} {/* Handles serving for syrups/drops */}
             {renderTimingSelect()}
             {renderFoodSelect()}
             {renderDaysInput()}
             {renderPharmacyFields()}
           </>
         );

        case "injections":
        case "respules": // Assuming respules have qty/days but no timing/food
        case "fluids":   // Assuming fluids have qty but no timing/food/days
           return (
            <>
                {renderChemicalInput()}
                {renderBrandInput()}
                {renderDoseInput()}
                {renderQtyInput()} {/* Renders Qty */}
                {/* Add Days input specifically for Respules if needed */}
                {type === 'respules' && renderDaysInput()}
                 {/* Add Timing input specifically for Respules if needed */}
                 {/* {type === 'respules' && renderTimingSelect()} */ }
                {renderPharmacyFields()}
            </>
           );

       case "lotions": // Lotions have Qty and Days, but no timing/food
         return (
           <>
             {renderChemicalInput()}
             {renderBrandInput()}
             {renderDoseInput()}
             {renderQtyInput()} {/* Renders Qty/Application */}
             {renderDaysInput()}
             {renderPharmacyFields()}
           </>
         );

       case "others": // Others have generic fields
         return (
           <>
             {renderChemicalInput()}
             {renderBrandInput()}
             {renderDoseInput()}
             {renderQtyInput()} {/* Renders Qty/Notes */}
             {/* Optionally add Timing/Food/Days if 'Others' can have them */}
             {/* {renderTimingSelect()} */}
             {/* {renderFoodSelect()} */}
             {/* {renderDaysInput()} */}
             {renderPharmacyFields()}
           </>
         );

       case "sutureProcedureItems":
       case "dressingItems": // These have only Item Name (as chemicalName) and Qty
         return (
           <>
             {/* Using renderChemicalInput but placeholder is 'Item Name' */}
             <div className="relative">
               <input type="text" placeholder="Item Name" value={item.chemicalName || ""}
                 onChange={(e) => handleInputChange(e, type, index, "chemicalName")}
                 className={`${inputBaseClass} ${doctorDisabledClass}`} disabled={isDoctorFieldDisabled} autoComplete="off" />
               {/* No suggestions needed for these typically */}
             </div>
             {/* Specific Qty input for these types */}
             <input type="text" placeholder="Qty" value={item.qty || ""}
                onChange={(e) => handleInputChange(e, type, index, "qty")}
                className={`${inputBaseClass} ${doctorDisabledClass}`} disabled={isDoctorFieldDisabled} />
             {renderPharmacyFields()}
           </>
         );

       default: return null; // Should not be reached
     }
   };

  // --- filterEmptyRows ---
  // Filters out rows where the primary identifier (chemicalName) is empty or just whitespace
  const filterEmptyRows = (items, type) => {
    if (!Array.isArray(items) || items.length === 0) return [];
    // Use chemicalName as the key field for filtering across most types
    let keyField = "chemicalName";
    return items.filter( item => item && typeof item[keyField] === 'string' && item[keyField].trim() !== "");
  };

   // --- handleSubmit ---
  const handleSubmit = async () => {
    // Filter out empty rows before submitting
    const finalTablets = filterEmptyRows(tablets, "tablets");
    const finalInjections = filterEmptyRows(injections, "injections");
    const finalSyrups = filterEmptyRows(syrups, "syrups");
    const finalDrops = filterEmptyRows(drops, "drops");
    const finalCreams = filterEmptyRows(creams, "creams");
    const finalRespules = filterEmptyRows(respules, "respules");
    const finalLotions = filterEmptyRows(lotions, "lotions");
    const finalFluids = filterEmptyRows(fluids, "fluids");
    const finalPowder = filterEmptyRows(powder, "powder");
    const finalSutureProcedureItems = filterEmptyRows(sutureProcedureItems, "sutureProcedureItems");
    const finalDressingItems = filterEmptyRows(dressingItems, "dressingItems");
    const finalOthers = filterEmptyRows(others, "others");

    // Combine all filtered items to check if *anything* is being submitted (for doctor validation)
    const allFinalItems = [
        ...finalTablets, ...finalInjections, ...finalSyrups, ...finalDrops,
        ...finalCreams, ...finalRespules, ...finalLotions, ...finalFluids,
        ...finalPowder, ...finalSutureProcedureItems, ...finalDressingItems, ...finalOthers
    ];

    // Doctor Validation: Ensure at least one item is filled if the user is a doctor
    if (isDoctor && allFinalItems.length === 0 && !nurseNotes.trim()) {
      alert("Doctors: Please add at least one medication/item or nurse notes before submitting.");
      return;
    }

    // Format timing array into comma-separated string for submission
    const formatTimingForSubmit = (timingArray) => Array.isArray(timingArray) ? timingArray.map(t => t.value).join(", ") : "";

    // Prepare the data payload
    const prescriptionData = {
      emp_no,
      name: data?.[0]?.name || "", // Include name if available
      id: prescriptionId, // Send the existing ID if updating
      tablets: finalTablets.map(item => ({ chemicalName: item.chemicalName, brandName: item.brandName, doseVolume: item.doseVolume, qty: item.qty, timing: formatTimingForSubmit(item.timing), food: item.food, days: item.days, issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })),
      injections: finalInjections.map(item => ({ chemicalName: item.chemicalName, brandName: item.brandName, doseVolume: item.doseVolume, qty: item.qty, issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })),
      syrups: finalSyrups.map(item => ({ chemicalName: item.chemicalName, brandName: item.brandName, doseVolume: item.doseVolume, serving: item.serving, timing: formatTimingForSubmit(item.timing), food: item.food, days: item.days, issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })),
      drops: finalDrops.map(item => ({ chemicalName: item.chemicalName, brandName: item.brandName, doseVolume: item.doseVolume, serving: item.serving, timing: formatTimingForSubmit(item.timing), food: item.food, days: item.days, issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })),
      creams: finalCreams.map(item => ({ chemicalName: item.chemicalName, brandName: item.brandName, doseVolume: item.doseVolume, qty: item.qty, timing: formatTimingForSubmit(item.timing), food: item.food, days: item.days, issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })),
      respules: finalRespules.map(item => ({ chemicalName: item.chemicalName, brandName: item.brandName, doseVolume: item.doseVolume, qty: item.qty, days: item.days, /* timing? */ issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })), // Added days
      lotions: finalLotions.map(item => ({ chemicalName: item.chemicalName, brandName: item.brandName, doseVolume: item.doseVolume, qty: item.qty, days: item.days, issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })),
      fluids: finalFluids.map(item => ({ chemicalName: item.chemicalName, brandName: item.brandName, doseVolume: item.doseVolume, qty: item.qty, issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })),
      powder: finalPowder.map(item => ({ chemicalName: item.chemicalName, brandName: item.brandName, doseVolume: item.doseVolume, qty: item.qty, timing: formatTimingForSubmit(item.timing), days: item.days, issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })), // Added timing/days
      sutureProcedureItems: finalSutureProcedureItems.map(item => ({ chemicalName: item.chemicalName, qty: item.qty, issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })),
      dressingItems: finalDressingItems.map(item => ({ chemicalName: item.chemicalName, qty: item.qty, issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })),
      others: finalOthers.map(item => ({ chemicalName: item.chemicalName, brandName: item.brandName, doseVolume: item.doseVolume, qty: item.qty, issuedIn: item.issuedIn, issuedOut: item.issuedOut, prescriptionOut: item.prescriptionOut })),
      submitted_by: submittedBy,
      issued_by: issuedby,
      nurse_notes: nurseNotes,
      // Adjust issued_status logic based on your backend requirements
      // If onPrescriptionUpdate is passed, it implies viewing/editing an *existing* record.
      // Backend should handle whether it's truly an 'issue' action based on role/status change.
      // Example: Status might only change if Pharmacy edits fields.
      issued_status: existingPrescription?.issued_status ?? 0, // Default to existing status or 0 if new
    };

    // Use POST for both create and update, let backend handle based on presence of 'id' or 'emp_no' uniqueness
    const method = 'POST';
    const url = 'http://localhost:8000/prescriptions/'; // Unified endpoint

    console.log(`Sending ${method} request to ${url}`);
    console.log("Submitting Prescription Data:", JSON.stringify(prescriptionData, null, 2));

    try {
      const response = await axios({ method, url, data: prescriptionData, headers: { 'Content-Type': 'application/json' } });
      console.log('Prescription submission successful:', response.data);

      // Use response data to determine if created or updated (backend should ideally return this info)
      // Example: Backend might return { success: true, created: boolean, id: number }
      const wasCreated = response.data.created === true; // Adjust based on actual backend response key
      const actionMessage = wasCreated ? 'submitted' : 'updated';

      alert(`Prescription ${actionMessage} successfully!`);

      if (onPrescriptionUpdate) {
        // If it's an update scenario (callback exists), call it with the ID
        onPrescriptionUpdate(response.data.prescription_id || response.data.id || prescriptionId); // Use returned ID or existing ID
      }
      // Consider if form reset is needed for a *new* prescription submission
      // if (wasCreated && !onPrescriptionUpdate) { /* Reset form state */ }

    } catch (error) {
      console.error("Error submitting prescription data:", error.response || error.message || error);
      const actionContext = existingPrescription ? 'updating' : 'submitting';
      let errorMsg = `Error ${actionContext} prescription. Please check the console for details.`;
      if (error.response?.data) {
         const detail = error.response.data.detail || JSON.stringify(error.response.data);
         errorMsg += `\nServer Response: ${detail}`;
      } else if (error.message) {
        errorMsg += `\nDetails: ${error.message}`;
      }
      alert(errorMsg);
    }
  };

  // --- handleGeneratePrescription (with PDF generation) ---
  const handleGeneratePrescription = () => {
    if (!emp_no || !data?.[0]?.name) {
      alert("Cannot generate prescription: Employee details are missing.");
      return;
    }

    // 1. Filter data (reuse existing logic)
    const finalTablets = filterEmptyRows(tablets, "tablets");
    const finalInjections = filterEmptyRows(injections, "injections");
    const finalSyrups = filterEmptyRows(syrups, "syrups");
    const finalDrops = filterEmptyRows(drops, "drops");
    const finalCreams = filterEmptyRows(creams, "creams");
    const finalRespules = filterEmptyRows(respules, "respules");
    const finalLotions = filterEmptyRows(lotions, "lotions");
    const finalFluids = filterEmptyRows(fluids, "fluids");
    const finalPowder = filterEmptyRows(powder, "powder");
    const finalSutureProcedureItems = filterEmptyRows(sutureProcedureItems, "sutureProcedureItems");
    const finalDressingItems = filterEmptyRows(dressingItems, "dressingItems");
    const finalOthers = filterEmptyRows(others, "others");

    const allSections = {
      Tablets: finalTablets,
      Injections: finalInjections,
      Syrups: finalSyrups,
      Drops: finalDrops,
      "Creams & Ointments": finalCreams,
      Respules: finalRespules,
      Lotions: finalLotions,
      Fluids: finalFluids,
      Powders: finalPowder,
      "Suture & Procedure Items": finalSutureProcedureItems,
      "Dressing Items": finalDressingItems,
      Others: finalOthers,
    };

    const hasItems = Object.values(allSections).some(arr => arr.length > 0);

    if (!hasItems && !nurseNotes.trim()) {
         alert("Cannot generate an empty prescription. Please add medication or notes.");
         return;
    }

    // 2. Initialize jsPDF
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15; // Page margin (mm)
    const lineHeight = 7; // Line height (mm)
    const sectionSpacing = 10; // Space between sections (mm)
    let y = margin; // Current Y position on the page (mm)

    // Helper function to add text and handle page breaks
    const addText = (text, x, currentY, options = {}) => {
      const { isBold = false, isTitle = false, fontSize = 10, isCentered = false, maxWidth } = options;

      // Ensure text is a string
      const textString = String(text ?? ''); // Convert null/undefined to empty string

      // Estimate text height (simple approach)
      const textHeight = (fontSize / 72) * 25.4 * 0.5 + lineHeight * 0.3; // Approximate height based on font size + line spacing factor

      // Check if new page is needed *before* adding text
      if (currentY + textHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
        // Optional: Add continuation header on new page
         doc.setFontSize(8);
         doc.setFont(undefined, 'italic');
         doc.text(`Prescription for ${data[0].name} (${emp_no}) - Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin, margin / 2, { align: 'right'});
         doc.setFont(undefined, 'normal'); // Reset font style
         currentY += lineHeight / 2; // Adjust starting Y on new page slightly
      }

      doc.setFontSize(fontSize);
      doc.setFont(undefined, isBold || isTitle ? 'bold' : 'normal');

      let textX = x;
      let textAlign = 'left';
      if (isCentered) {
          textX = pageWidth / 2;
          textAlign = 'center';
      }

      const textOptions = { align: textAlign };
       if (maxWidth) {
           // If maxWidth is provided, use splitTextToSize for wrapping
           const lines = doc.splitTextToSize(textString, maxWidth);
           doc.text(lines, textX, currentY, textOptions);
           currentY += lines.length * lineHeight * 0.8; // Adjust Y based on number of wrapped lines
       } else {
           doc.text(textString, textX, currentY, textOptions);
           currentY += isTitle ? lineHeight * 1.5 : lineHeight; // Adjust Y based on content type
       }


      return currentY; // Return the next Y position
    };

    // --- PDF Content ---

    // Header
    y = addText("PRESCRIPTION", margin, y, { isTitle: true, fontSize: 16, isCentered: true });
    y += lineHeight / 2; // Add a bit more space after title


    // Clinic/Hospital Info (Optional - Example)
     // y = addText("Your Clinic/Hospital Name", margin, y, { fontSize: 12 });
     // y = addText("Address Line 1", margin, y, { fontSize: 9 });
     // y = addText("Phone: xxx-xxx-xxxx", margin, y, { fontSize: 9 });
     // y += lineHeight;


    // Patient Info Box (Example of using lines)
    const patientBoxStartY = y;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    y = addText("Patient Information", margin, y);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    y = addText(`Employee No: ${emp_no}`, margin + 5, y);
    y = addText(`Patient Name: ${data[0].name}`, margin + 5, y);
    y = addText(`Date: ${new Date().toLocaleDateString('en-GB')}`, margin + 5, y); // dd/mm/yyyy format
    const patientBoxEndY = y;
    doc.setDrawColor(150, 150, 150); // Gray border
    doc.rect(margin - 2, patientBoxStartY - lineHeight * 0.8, pageWidth - (margin-2)*2 , patientBoxEndY - patientBoxStartY + lineHeight * 0.5); // Draw rect around info
    y += sectionSpacing / 1.5; // Add space after the box


    // Rx Symbol
    doc.setFontSize(24); // Larger Rx
    doc.setFont(undefined, 'bold');
    y = addText("Rx", margin, y);
    y += lineHeight / 2; // Space after Rx

    // Medication Sections
    const formatTiming = (timingArray) => Array.isArray(timingArray) ? timingArray.map(t => t.label || t.value).join(", ") : (timingArray || 'N/A');

    for (const [title, items] of Object.entries(allSections)) {
      if (items.length > 0) {
        // Draw a line before the section
        // doc.setDrawColor(200, 200, 200); // Lighter gray line
        // doc.line(margin, y - lineHeight / 2, pageWidth - margin, y - lineHeight / 2);
        // y += lineHeight / 2;

        // Section Title
        y = addText(title, margin, y, { isBold: true, fontSize: 12 });

        items.forEach((item, index) => {
            // Check for page break *before* adding item details
            const estimatedItemHeight = lineHeight * 2.5; // Rough estimate for a multi-line item
            if (y + estimatedItemHeight > pageHeight - margin ) {
                 doc.addPage();
                 y = margin;
                 // Optional: Add continuation header on new page
                 doc.setFontSize(8);
                 doc.setFont(undefined, 'italic');
                 doc.text(`Prescription for ${data[0].name} (${emp_no}) - Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin, margin / 2, { align: 'right'});
                 doc.setFont(undefined, 'normal'); // Reset font style
                 y += lineHeight / 2;

                 y = addText(title + " (cont.)", margin, y, { isBold: true, fontSize: 12 });
            }

            // Item Details
            let mainLine = `${index + 1}. ${item.chemicalName || 'N/A'}`;
            if (item.brandName) mainLine += ` (${item.brandName})`;
            if (item.doseVolume) mainLine += ` - ${item.doseVolume}`;

            let qtyLine = `   Qty/Serving: ${item.qty || item.serving || 'N/A'}`; // Indented quantity line

            y = addText(mainLine, margin + 5, y); // Indent item name line
            y = addText(qtyLine, margin + 5, y, {fontSize: 9}); // Smaller font for quantity

            // Sig (Instructions) Line
            let sigLineParts = [];
            if (item.timing && (Array.isArray(item.timing) ? item.timing.length > 0 : item.timing)) {
                sigLineParts.push(`Timing: ${formatTiming(item.timing)}`);
            }
            if (item.food) sigLineParts.push(`Food: ${item.food}`);
            if (item.days) sigLineParts.push(`Days: ${item.days}`);

            if (sigLineParts.length > 0) {
                y = addText(`   Sig: ${sigLineParts.join(' | ')}`, margin + 10, y, { fontSize: 9 }); // Indented further
            }

           // Add a little space between items
           y += lineHeight * 0.4;
        });
        y += sectionSpacing / 1.5; // Space after the section
      }
    }

     // Draw line before notes/footer
     doc.setDrawColor(150, 150, 150);
     doc.line(margin, y - lineHeight / 2, pageWidth - margin, y - lineHeight / 2);
     y += lineHeight / 2;

    // Nurse Notes
    if (nurseNotes && nurseNotes.trim()) {
      y = addText("Nurse Notes:", margin, y, { isBold: true, fontSize: 11 });
      // Use splitTextToSize with maxWidth for wrapping long notes
      y = addText(nurseNotes, margin, y, { fontSize: 10, maxWidth: pageWidth - margin * 2 });
      y += sectionSpacing / 2;
    }

    // Prescribed By & Signature Area
    const footerStartY = y;
    y = addText(`Prescribed By: Dr. ${submittedBy}`, margin, footerStartY, { fontSize: 10 }); // Start both lines at same Y

    // Add Signature Line further to the right
    const signatureX = pageWidth / 2 + 10; // Start signature line around the middle-right
    const signatureY = footerStartY + lineHeight * 2.5; // Position signature below 'Prescribed By'

    // Check for page break *before* adding signature line
     if (signatureY + lineHeight > pageHeight - margin) {
         doc.addPage();
         y = margin; // Reset y for the new page
         // Optional: Add continuation header or footer info here if needed
          doc.setFontSize(8);
          doc.setFont(undefined, 'italic');
          doc.text(`Prescription for ${data[0].name} (${emp_no}) - Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin, margin / 2, { align: 'right'});
          doc.setFont(undefined, 'normal'); // Reset font style
          y += lineHeight;
         doc.line(signatureX, y, pageWidth - margin, y); // Draw line on new page
         y = addText("Doctor's Signature", signatureX, y + lineHeight / 2, {fontSize: 9});
     } else {
         doc.setDrawColor(0, 0, 0); // Black line for signature
         doc.line(signatureX, signatureY, pageWidth - margin, signatureY); // Draw the signature line
         y = addText("Doctor's Signature", signatureX, signatureY + lineHeight / 2, {fontSize: 9}); // Add label below line
     }


    // Footer (Example: Page Number) - Already added in page break logic


    // 3. Save the PDF
    const filename = `prescription-${emp_no}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);

  }; // End of handleGeneratePrescription


  // --- Button Components ---
  const ActionButton = ({ onClick, disabled = false, children, color = "blue", title = "", className = "" }) => (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className={`bg-${color}-600 hover:bg-${color}-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out text-sm focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-opacity-50 ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`} >
      {children}
    </button>
  );

  const RemoveButton = ({ onClick, disabled = false, type, index }) => (
    <button type="button" onClick={() => onClick(type, index)} disabled={disabled} title={`Remove this row`}
      className={`bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded w-8 h-8 flex items-center justify-center transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`} >
      <FaTrash size={12} />
    </button>
  );

  // --- Section Expansion Logic ---
  const toggleSection = (section) => {
    setExpandedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };
  const isSectionExpanded = (section) => expandedSections.includes(section);

   // --- Define grid templates ---
   // Adjusted for potentially fewer/more fields per type
   const gridTemplateColumns = {
    // Common structure: Chemical, Brand, Dose, Qty/Serving, Timing, Food, Days, 3x Pharmacy, Action
    tablets:  "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) repeat(3, minmax(100px, 1fr)) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
    syrups:   "repeat(3, minmax(140px, 1.5fr)) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)", // Serving instead of Qty
    drops:    "repeat(3, minmax(140px, 1.5fr)) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)", // Serving instead of Qty
    creams:   "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) repeat(3, minmax(100px, 1fr)) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
    powder:   "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) minmax(100px, 1fr) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)", // No food? Adjust if needed
    // Less common structure: Chemical, Brand, Dose, Qty, Days?, 3x Pharmacy, Action
    injections:"repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)", // No timing/food/days
    respules: "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)", // Added Days placeholder
    lotions:  "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)", // Added Days
    fluids:   "repeat(3, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)", // No timing/food/days
    others:   "repeat(3, minmax(140px, 1.5fr)) minmax(100px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)", // Generic: Chemical, Brand, Dose, Qty/Notes
    // Simple structure: Item Name, Qty, 3x Pharmacy, Action
    sutureProcedureItems: "minmax(150px, 2fr) minmax(80px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
    dressingItems:        "minmax(150px, 2fr) minmax(80px, 1fr) repeat(3, minmax(100px, 1fr)) minmax(40px, auto)",
  };


  // --- renderSection ---
  const renderSection = (type, title, color, children, addItemButtonText) => {
    const isExpanded = isSectionExpanded(type);
    const headerColor = color || "gray"; // Default color if none provided
    const buttonColor = "blue"; // Consistent add button color

    // Function to dynamically generate headers based on type
    const getHeaders = () => {
      const baseHeaders = [
        { title: "Chemical Name", gridSpan: "span 1", tooltip: "Generic or chemical name of the medication/item" },
      ];
      const brandDoseHeaders = [
        { title: "Brand Name", gridSpan: "span 1", tooltip: "Specific brand name (if applicable)" },
        { title: "Dose/Vol", gridSpan: "span 1", tooltip: "Dosage strength or volume" },
      ];
      const qtyHeader = { title: "Qty", gridSpan: "span 1", tooltip: "Quantity to dispense" };
      const servingHeader = { title: "Serving", gridSpan: "span 1", tooltip: "Dosage per administration (e.g., 5ml, 1 drop)" };
      const timingHeader = { title: "Timing", gridSpan: "span 1", tooltip: "When to take the medication" };
      const foodHeader = { title: "Food", gridSpan: "span 1", tooltip: "Relation to food intake" };
      const daysHeader = { title: "Days", gridSpan: "span 1", tooltip: "Duration of treatment" };
      const pharmacyHeaders = [
        { title: "Issued In", gridSpan: "span 1", tooltip: "Pharmacy Use Only: Details of item arrival/check-in" },
        { title: "Issued Out", gridSpan: "span 1", tooltip: "Pharmacy Use Only: Details of item dispensing/check-out" },
        { title: "Presc. Out", gridSpan: "span 1", tooltip: "Pharmacy Use Only: Prescription status/tracking" },
      ];
      const actionHeader = { title: "Action", gridSpan: "span 1", tooltip: "Remove row" };

      let headers = [];

      switch (type) {
        case "tablets":
        case "creams":
          headers = [...baseHeaders, ...brandDoseHeaders, qtyHeader, timingHeader, foodHeader, daysHeader, ...pharmacyHeaders, actionHeader]; break;
        case "syrups":
        case "drops":
          headers = [...baseHeaders, ...brandDoseHeaders, servingHeader, timingHeader, foodHeader, daysHeader, ...pharmacyHeaders, actionHeader]; break;
        case "powder":
           headers = [...baseHeaders, ...brandDoseHeaders, qtyHeader, timingHeader, daysHeader, ...pharmacyHeaders, actionHeader]; break; // Assuming powder needs timing/days
        case "injections":
        case "fluids":
          headers = [...baseHeaders, ...brandDoseHeaders, qtyHeader, ...pharmacyHeaders, actionHeader]; break;
         case "respules":
         case "lotions":
           headers = [...baseHeaders, ...brandDoseHeaders, qtyHeader, daysHeader, ...pharmacyHeaders, actionHeader]; break;
        case "others":
           headers = [...baseHeaders, ...brandDoseHeaders, { title: "Qty/Notes", gridSpan: "span 1", tooltip:"Quantity or specific instructions"}, ...pharmacyHeaders, actionHeader]; break;
        case "sutureProcedureItems":
        case "dressingItems":
          headers = [{ title: "Item Name", gridSpan: "span 1", tooltip: "Name of the item" }, qtyHeader, ...pharmacyHeaders, actionHeader]; break;
        default: return null;
      }

      return headers.map((h, i) => (
        <div key={`${type}-header-${i}`} className="font-medium text-xs text-gray-600 truncate" title={h.tooltip} style={{ gridColumn: h.gridSpan }}>
          {h.title}
        </div>
      ));
    };


    return (
      <section className="border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden bg-white">
        <h2 className={`text-lg font-semibold p-3 bg-${headerColor}-50 border-b border-gray-200 text-${headerColor}-700 flex justify-between items-center cursor-pointer hover:bg-${headerColor}-100 transition-colors duration-150`}
          onClick={() => toggleSection(type)} aria-expanded={isExpanded} aria-controls={`section-content-${type}`} >
          {title}
          <span className={`text-sm text-gray-500 transition-transform duration-200 transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>▼</span>
        </h2>
        {isExpanded && (
          <div id={`section-content-${type}`} className="p-4">
            <div className="overflow-x-auto pb-2">
                {/* Header Row */}
                <div className={`grid gap-x-4 items-center mb-3 pb-2 border-b border-gray-200`} style={{ gridTemplateColumns: gridTemplateColumns[type] }} >
                  {getHeaders()}
                </div>
                {/* Data Rows */}
                <div>
                    {children} {/* Renders the grid rows with input fields */}
                </div>
            </div>
            {/* Add Row Button */}
            <div className="mt-4">
              <ActionButton onClick={() => addRow(type)} disabled={!isDoctor} color={buttonColor} title={isDoctor ? addItemButtonText : "Only doctors can add items"} >
                + {addItemButtonText}
              </ActionButton>
            </div>
          </div>
        )}
      </section>
    );
  };


  // Order in which sections appear in the UI
  const sectionOrder = [
    "tablets", "injections", "syrups", "drops", "creams", "respules",
    "lotions", "fluids", "powder", "sutureProcedureItems", "dressingItems", "others"
  ];

  // --- Main Component Return JSX ---
  if (!emp_no && !existingPrescription) {
    // Display message if no employee selected or no existing data to show
    return ( <div className="p-6 text-center text-gray-500"> Please select an employee to view or create a prescription. </div> );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 border-b pb-2 mb-6">
        Prescription Details {emp_no && `for Emp #${emp_no}`} {data?.[0]?.name && `(${data[0].name})`}
        {prescriptionId && <span className="text-sm text-gray-500 font-normal ml-2">(ID: {prescriptionId})</span>}
      </h1>

      {/* Render each medication section based on the defined order */}
      {sectionOrder.map((type) => {
        let title, color, items, addItemButtonText;
        // Map type string to state variable
        const stateMap = { tablets, injections, syrups, drops, creams, respules, lotions, fluids, powder, sutureProcedureItems, dressingItems, others };
        items = stateMap[type] || []; // Get the corresponding state array

        // Define title, color, and button text for each section type
        switch (type) {
          case "tablets": title = "Tablets"; color = "blue"; addItemButtonText = "Add Tablet"; break;
          case "injections": title = "Injections"; color = "purple"; addItemButtonText = "Add Injection"; break;
          case "syrups": title = "Syrups"; color = "green"; addItemButtonText = "Add Syrup"; break;
          case "drops": title = "Drops"; color = "teal"; addItemButtonText = "Add Drop"; break;
          case "creams": title = "Creams & Ointments"; color = "orange"; addItemButtonText = "Add Cream/Ointment"; break;
          case "respules": title = "Respules"; color = "cyan"; addItemButtonText = "Add Respule"; break;
          case "lotions": title = "Lotions"; color = "pink"; addItemButtonText = "Add Lotion"; break;
          case "fluids": title = "Fluids"; color = "indigo"; addItemButtonText = "Add Fluid"; break;
          case "powder": title = "Powders"; color = "lime"; addItemButtonText = "Add Powder"; break;
          case "sutureProcedureItems": title = "Suture & Procedure Items"; color = "gray"; addItemButtonText = "Add Suture/Procedure Item"; break;
          case "dressingItems": title = "Dressing Items"; color = "gray"; addItemButtonText = "Add Dressing Item"; break;
          case "others": title = "Others"; color = "gray"; addItemButtonText = "Add Other Item"; break;
          default: return null; // Should not happen with defined sectionOrder
        }

        // Map over the items array for the current type to create the rows
        const children = items.map((_, index) => (
          <div key={`${type}-${index}`} className={`grid gap-x-4 mb-3 items-start`} style={{ gridTemplateColumns: gridTemplateColumns[type] }} >
            {/* Render the input fields for this row */}
            {renderInputFields(type, items, index)}
            {/* Render the remove button column */}
            <div className="flex justify-center items-center h-full pt-1">
              {/* Show remove button only if allowed and more than one row exists, or if the only row has content */}
              {/* Corrected Logic: Allow removing if > 1 row OR if it's the *only* row and it's empty (to effectively clear it via remove->getDefault) */}
              {(items.length > 1 || (items.length === 1 )) ? ( // Simpler: always show if doctor can edit
                <RemoveButton onClick={removeRow} type={type} index={index} disabled={!isDoctor} />
              ) : (
                 // Placeholder to maintain grid alignment if remove button isn't shown
                 <div className="w-8 h-8"></div>
              )}
            </div>
          </div>
        ));

        // Render the collapsible section container
        return ( <React.Fragment key={type}> {renderSection(type, title, color, children, addItemButtonText)} </React.Fragment> );
      })}

      {/* Nurse Notes Section */}
      <section className="border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden bg-white">
        <h2 className={`text-lg font-semibold p-3 bg-teal-50 border-b border-gray-200 text-teal-700`}>
          Nurse Notes
        </h2>
        <div className="p-4">
          <textarea
            value={nurseNotes || ""}
            onChange={(e) => handleInputChange(e, "nurseNotes", null, "nurseNotes")} // Pass specific type identifier
            className={`px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 text-sm resize-y min-h-[80px] ${!isNurse ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-teal-50'}`}
            rows="4"
            placeholder={isNurse ? "Enter relevant nursing notes..." : "(Editable by Nurse only)"}
            disabled={!isNurse}
            title={isNurse ? "Enter nursing notes" : "Read-only for non-nurses"}
          />
        </div>
      </section>

      {/* Submission Info & Actions Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 border-t border-gray-300 pt-6 gap-4">
        {/* Submitted By / Issued By Selects */}
        <div className="flex flex-col sm:flex-row sm:space-x-6 w-full sm:w-auto text-sm">
          <div className="mb-3 sm:mb-0">
            <label htmlFor="submittedBy" className="block font-medium text-gray-700 mb-1">Prescribed By:</label>
            <div className="relative">
                <select
                  id="submittedBy" value={submittedBy}
                  onChange={(e) => { if (isDoctor) setSubmittedBy(e.target.value); }}
                  className={`px-4 py-2 w-full sm:w-48 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none ${!isDoctor ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={!isDoctor}
                >
                  <option value="SK">Dr. SK</option>
                  <option value="AA">Dr. AA</option>
                  {/* Add more doctor options if needed */}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>
          <div>
            <label htmlFor="issuedby" className="block font-medium text-gray-700 mb-1">Issued By:</label>
             <div className="relative">
                <select
                  id="issuedby" value={issuedby}
                  onChange={(e) => { if (isNurse || isPharmacy) setIssuedby(e.target.value); }}
                  className={`px-4 py-2 w-full sm:w-48 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none ${!(isNurse || isPharmacy) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={!(isNurse || isPharmacy)}
                >
                  <option value="Nurse">Nurse</option>
                  <option value="Pharmacy">Pharmacy</option>
                  {/* Add other roles if applicable */}
                </select>
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex space-x-4 w-full sm:w-auto justify-end pt-2 sm:pt-0">
          <ActionButton
            onClick={handleSubmit} color="green"
            title={existingPrescription ? "Save changes to this prescription" : "Submit this new prescription"}
            className="min-w-[120px]"
          >
            {/* Change button text based on context */}
            {existingPrescription ? "Update Prescription" : "Submit Prescription"}
          </ActionButton>
          <ActionButton
            onClick={handleGeneratePrescription} color="blue"
            title="Generate a downloadable PDF of the prescription"
            className="min-w-[120px]"
            // Disable if no data to generate?
            disabled={!emp_no || (!filterEmptyRows(tablets, 'tablets').length && !filterEmptyRows(injections, 'injections').length && /* ... other types ... */ !filterEmptyRows(others, 'others').length && !nurseNotes.trim() )}
          >
            Generate PDF {/* Changed text */}
          </ActionButton>
        </div>
      </div>
    </div> // End of main container
  ); // End of component return
}; // End of Prescription component

export default Prescription;