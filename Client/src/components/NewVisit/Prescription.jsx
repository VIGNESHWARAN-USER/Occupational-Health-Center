import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { debounce } from "lodash";
import jsPDF from "jspdf";

const Prescription = ({ data, onPrescriptionUpdate, condition }) => {
  console.log(condition)
  let mrdNo = data?.[0]?.mrdNo || "";
  let aadhar = data?.[0]?.aadhar || "";
  const emp_no = data?.[0]?.emp_no;
  const existingPrescription = data?.[0];
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
  const [nurseNotes, setNurseNotes] = useState("");
  const [error, setError] = useState("");
  // State for suggestions
  const [brandSuggestions, setBrandSuggestions] = useState({});
  const [chemicalSuggestions, setChemicalSuggestions] = useState({}); // Kept for potential future use, though fetch logic is commented out
  const [doseSuggestions, setDoseSuggestions] = useState({});
  const [qtySuggestions, setQtySuggestions] = useState({}); // New: Quantity Suggestions
  const [showBrandSuggestions, setShowBrandSuggestions] = useState({});
  const [showChemicalSuggestions, setShowChemicalSuggestions] = useState({}); // Kept for potential future use
  const [showDoseSuggestions, setShowDoseSuggestions] = useState({});
  const [showQtySuggestions, setShowQtySuggestions] = useState({}); // New: Show Qty Suggestions
  const [doseManuallyEntered, setDoseManuallyEntered] = useState({});
  const [qtyManuallyEntered, setQtyManuallyEntered] = useState({}); // New:

  // New State for Expiry Date Suggestions
  const [expiryDateSuggestions, setExpiryDateSuggestions] = useState({});
  const [showExpiryDateSuggestions, setShowExpiryDateSuggestions] = useState({});

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
      days: "",
      serving: "",
      issuedIn: "",
      issuedOut: "",
      prescriptionOut: "",
      expiryDate: "",
    }),
    []
  );

  // Initialize prescription data
  useEffect(() => {
    const initializePrescription = () => {
      const initialData = {
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
        nurse_notes: "",
      };

      if (condition) {
        const mapTiming = (timing) => {
          if (!timing) return [];
          if (Array.isArray(timing)) return timing;
          // Handle string format (M,A,E,N)
          return timing.split(",").map(t => {
            t = t.trim();
            if (t === "M") return "morning";
            if (t === "A") return "afternoon";
            if (t === "E") return "evening";
            if (t === "N") return "night";
            return t;
          });
        };

        const createItem = (type, item) => ({
          chemicalName: item.chemicalName || "",
          brandName: item.brandName || "",
          doseVolume: item.doseVolume || "",
          serving: item.serving || "",
          qty: item.qty || "",
          timing: mapTiming(item.timing),
          food: item.food || "",
          days: item.days || "",
          expiryDate: item.expiryDate || "",
          issuedIn: item.issuedIn || "",
          issuedOut: item.issuedOut || "",
          prescriptionOut: item.prescriptionOut || "",
        });

        // Map existing prescription items
        initialData.tablets = existingPrescription.tablets?.length > 0 
          ? existingPrescription.tablets.map(item => createItem("tablets", item))
          : [getDefaultRow("tablets")];

        initialData.injections = existingPrescription.injections?.length > 0
          ? existingPrescription.injections.map(item => createItem("injections", item))
          : [getDefaultRow("injections")];

        initialData.syrups = existingPrescription.syrups?.length > 0
          ? existingPrescription.syrups.map(item => createItem("syrups", item))
          : [getDefaultRow("syrups")];

        initialData.drops = existingPrescription.drops?.length > 0
          ? existingPrescription.drops.map(item => createItem("drops", item))
          : [getDefaultRow("drops")];

        initialData.creams = existingPrescription.creams?.length > 0
          ? existingPrescription.creams.map(item => createItem("creams", item))
          : [getDefaultRow("creams")];

        initialData.respules = existingPrescription.respules?.length > 0
          ? existingPrescription.respules.map(item => createItem("respules", item))
          : [getDefaultRow("respules")];

        initialData.lotions = existingPrescription.lotions?.length > 0
          ? existingPrescription.lotions.map(item => createItem("lotions", item))
          : [getDefaultRow("lotions")];

        initialData.fluids = existingPrescription.fluids?.length > 0
          ? existingPrescription.fluids.map(item => createItem("fluids", item))
          : [getDefaultRow("fluids")];

        initialData.powder = existingPrescription.powder?.length > 0
          ? existingPrescription.powder.map(item => createItem("powder", item))
          : [getDefaultRow("powder")];

        initialData.sutureProcedureItems = existingPrescription.suture_procedure?.length > 0
          ? existingPrescription.suture_procedure.map(item => createItem("sutureProcedureItems", item))
          : [getDefaultRow("sutureProcedureItems")];

        initialData.dressingItems = existingPrescription.dressing?.length > 0
          ? existingPrescription.dressing.map(item => createItem("dressingItems", item))
          : [getDefaultRow("dressingItems")];

        initialData.others = existingPrescription.others?.length > 0
          ? existingPrescription.others.map(item => createItem("others", item))
          : [getDefaultRow("others")];

        initialData.nurse_notes = existingPrescription.nurse_notes || "";
      }

      // Set state for each medicine type
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
      setNurseNotes(initialData.nurse_notes);
    };

    initializePrescription();
  }, [emp_no, existingPrescription, getDefaultRow]);

  // Function to add a new row (Doctor only)
  const addRow = (type) => {
    if (!isDoctor) return;
    const newRow = getDefaultRow(type);
    const setState = (setter) => setter((prev) => [...prev, newRow]);

    switch (type) {
      case "tablets":
        setState(setTablets);
        break;
      case "injections":
        setState(setInjections);
        break;
      case "syrups":
        setState(setSyrups);
        break;
      case "drops":
        setState(setDrops);
        break;
      case "creams":
        setState(setCreams);
        break;
      case "respules":
        setState(setRespules);
        break;
      case "lotions":
        setState(setLotions);
        break;
      case "fluids":
        setState(setFluids);
        break;
      case "powder":
        setState(setPowder);
        break;
      case "sutureProcedureItems":
        setState(setSutureProcedureItems);
        break;
      case "dressingItems":
        setState(setDressingItems);
        break;
      case "others":
        setState(setOthers);
        break;
      default:
        console.warn("Attempted to add row for unknown type:", type);
        break;
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
        setBrandSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: [] },
        }));
        setShowBrandSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: false },
        }));
        return;
      }
      try {
        const response = await axios.get(
          `https://occupational-health-center-1.onrender.com/get-brand-names/?chemical_name=${encodeURIComponent(
            chemicalName
          )}&medicine_form=${encodeURIComponent(medicineForm)}`
        );
        setBrandSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: response.data.suggestions },
        }));
        setShowBrandSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: true },
        }));
      } catch (error) {
        console.error("Error fetching brand name suggestions:", error);
        setBrandSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: [] },
        }));
        setShowBrandSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: false },
        }));
      }
    }, 500),
    []
  );

  // --- Fetch Dose Suggestions ---
  const fetchDoseSuggestions = useCallback(
    debounce(async (brandName, chemicalName, medicineForm, type, index) => {
      const requiresDoseFetch = [
        "tablets",
        "syrups",
        "drops",
        "creams",
        "lotions",
        "powder",
        "others",
        "injections",
        "respules",
        "fluids",
      ].includes(type);

      if (!requiresDoseFetch || !brandName || !chemicalName || !medicineForm) {
        setDoseSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: [] },
        }));
        setShowDoseSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: false },
        }));
        return;
      }

      try {
        const response = await axios.get(
          `https://occupational-health-center-1.onrender.com/get-dose-volume/?brand_name=${encodeURIComponent(
            brandName
          )}&chemical_name=${encodeURIComponent(
            chemicalName
          )}&medicine_form=${encodeURIComponent(medicineForm)}`
        );
        const suggestions = response.data.suggestions;
        setDoseSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: suggestions },
        }));
        // Only show suggestions if there are any AND dose wasn't manually entered recently
        if (!doseManuallyEntered?.[type]?.[index]) {
          setShowDoseSuggestions((prev) => ({
            ...prev,
            [type]: { ...prev[type], [index]: suggestions.length > 0 },
          }));
        } else {
          setShowDoseSuggestions((prev) => ({
            ...prev,
            [type]: { ...prev[type], [index]: false },
          }));
        }
      } catch (error) {
        console.error("Error fetching dose volume suggestions:", error);
        setDoseSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: [] },
        }));
        setShowDoseSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: false },
        }));
      }
    }, 500),
    [doseManuallyEntered] // Re-create debounce if manual entry state changes
  );

    // --- New Function: Fetch Quantity Suggestions ---
    const fetchQtySuggestions = useCallback(
        debounce(async (chemicalName, brandName, expiryDate, type, index) => {
            if (!chemicalName || !brandName || !expiryDate) {
                setQtySuggestions((prev) => ({
                    ...prev,
                    [type]: { ...prev[type], [index]: [] },
                }));
                setShowQtySuggestions((prev) => ({
                    ...prev,
                    [type]: { ...prev[type], [index]: false },
                }));
                return;
            }

            try {
                const response = await axios.get(
                    `https://occupational-health-center-1.onrender.com/get-quantity-suggestions/?chemical_name=${encodeURIComponent(chemicalName)}&brand_name=${encodeURIComponent(brandName)}&expiry_date=${encodeURIComponent(expiryDate)}`
                );

                setQtySuggestions((prev) => ({
                    ...prev,
                    [type]: { ...prev[type], [index]: response.data.suggestions },
                }));
                setShowQtySuggestions((prev) => ({
                    ...prev,
                    [type]: { ...prev[type], [index]: response.data.suggestions.length > 0 },
                }));
            } catch (error) {
                console.error("Error fetching quantity suggestions:", error);
                setQtySuggestions((prev) => ({
                    ...prev,
                    [type]: { ...prev[type], [index]: [] },
                }));
                setShowQtySuggestions((prev) => ({
                    ...prev,
                    [type]: { ...prev[type], [index]: false },
                }));
            }
        }, 500),
        []
    );

  // --- New Function: Fetch Expiry Date Suggestions ---
  const fetchExpiryDateSuggestions = useCallback(
    debounce(async (chemicalName, brandName, doseVolume, type, index) => {
      if (!chemicalName || !brandName || !doseVolume) {
        setExpiryDateSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: [] },
        }));
        setShowExpiryDateSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: false },
        }));
        return;
      }

      try {
        const response = await axios.get(
          `https://occupational-health-center-1.onrender.com/get-expiry-dates/?chemical_name=${encodeURIComponent(chemicalName)}&brand_name=${encodeURIComponent(brandName)}&dose_volume=${encodeURIComponent(doseVolume)}`
        );  //  <--  MODIFY THIS URL

        setExpiryDateSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: response.data.suggestions },
        }));
        setShowExpiryDateSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: response.data.suggestions.length > 0 },
        }));
      } catch (error) {
        console.error("Error fetching expiry date suggestions:", error);
        setExpiryDateSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: [] },
        }));
        setShowExpiryDateSuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: false },
        }));
      }
    }, 500),
    []
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
      case "tablets":
        setTablets(getUpdater(setTablets));
        break;
      case "injections":
        setInjections(getUpdater(setInjections));
        break;
      case "syrups":
        setSyrups(getUpdater(setSyrups));
        break;
      case "drops":
        setDrops(getUpdater(setDrops));
        break;
      case "creams":
        setCreams(getUpdater(setCreams));
        break;
      case "respules":
        setRespules(getUpdater(setRespules));
        break;
      case "lotions":
        setLotions(getUpdater(setLotions));
        break;
      case "fluids":
        setFluids(getUpdater(setFluids));
        break;
      case "powder":
        setPowder(getUpdater(setPowder));
        break;
      case "sutureProcedureItems":
        setSutureProcedureItems(getUpdater(setSutureProcedureItems));
        break;
      case "dressingItems":
        setDressingItems(getUpdater(setDressingItems));
        break;
      case "others":
        setOthers(getUpdater(setOthers));
        break;
      default:
        console.warn(`Attempted to update state for unknown type: ${type}`);
        break;
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

    const isPharmacyField = [
      "issuedIn",
      "issuedOut",
      "prescriptionOut",
    ].includes(field);
    const isMedicineType = Object.keys(medicineForms).includes(type);
    if (!isMedicineType) return;

    // Role-based input restriction
    if (isPharmacyField && !isPharmacy) return;
    if (!isPharmacyField && !isDoctor) return;

    let value;
    if (field === "timing") {
      value = e; // react-select passes the whole selected options array/object
    } else if (e && e.target) {
      value = e.target.value;
    } else {
      value = e;
    }

      // If doctor manually types in qty, mark it and hide suggestions
      if (field === "qty" && isDoctor) {
          setQtyManuallyEntered((prev) => ({
              ...prev,
              [type]: { ...prev[type], [index]: true },
          }));
          setShowQtySuggestions((prev) => ({
              ...prev,
              [type]: { ...prev[type], [index]: false },
          }));
      }

    // Update the specific row's state
    updateRowState(type, index, field, value);

    // --- Trigger Suggestions AFTER updating the state
    if (isDoctor) {
      setTimeout(() => {
        let currentStateForType;
        switch (type) {
          case "tablets":
            currentStateForType = tablets;
            break;
          case "injections":
            currentStateForType = injections;
            break;
          case "syrups":
            currentStateForType = syrups;
            break;
          case "drops":
            currentStateForType = drops;
            break;
          case "creams":
            currentStateForType = creams;
            break;
          case "respules":
            currentStateForType = respules;
            break;
          case "lotions":
            currentStateForType = lotions;
            break;
          case "fluids":
            currentStateForType = fluids;
            break;
          case "powder":
            currentStateForType = powder;
            break;
          case "sutureProcedureItems":
            currentStateForType = sutureProcedureItems;
            break;
          case "dressingItems":
            currentStateForType = dressingItems;
            break;
          case "others":
            currentStateForType = others;
            break;
          default:
            currentStateForType = [];
            break;
        }

        const currentItem = currentStateForType[index];
        if (!currentItem) return;

        const medicineFormValue = medicineForms[type];
        const currentChemicalName = currentItem.chemicalName;
        const currentBrandName = currentItem.brandName;
        const currentDoseVolume = currentItem.doseVolume;
          const currentExpiryDate = currentItem.expiryDate; //New expiry date value
        const standardSuggestionTypes = [
          "tablets",
          "syrups",
          "drops",
          "creams",
          "lotions",
          "powder",
          "others",
          "injections",
          "respules",
          "fluids",
        ];

        if (standardSuggestionTypes.includes(type)) {
          if (field === "chemicalName") {
            fetchBrandSuggestions(value, medicineFormValue, type, index);
            if (currentBrandName) {
              fetchDoseSuggestions(
                currentBrandName,
                value,
                medicineFormValue,
                type,
                index
              );
            }
            // Reset manual dose entry flag when chemical name changes
            setDoseManuallyEntered((prev) => ({
              ...prev,
              [type]: { ...prev[type], [index]: false },
            }));
          } else if (field === "brandName") {
            fetchBrandSuggestions(
              currentChemicalName,
              medicineFormValue,
              type,
              index
            ); // Fetch brands based on chemical

            // If a chemical/primary ID also exists, fetch/update dose suggestions
            if (currentChemicalName) {
              fetchDoseSuggestions(
                value,
                currentChemicalName,
                medicineFormValue,
                type,
                index
              );
            }
            // Reset manual dose entry flag when brand name changes
            setDoseManuallyEntered((prev) => ({
              ...prev,
              [type]: { ...prev[type], [index]: false },
            }));
          } else if (field !== "doseVolume") {
            // For changes in other fields (like Qty, Timing, etc.),
            // re-fetch dose suggestions if both identifiers are present
            if (currentChemicalName && currentBrandName) {
              fetchDoseSuggestions(
                currentBrandName,
                currentChemicalName,
                medicineFormValue,
                type,
                index
              );
            }
          }

          // NEW: Fetch Expiry Date Suggestions
          if (["chemicalName", "brandName", "doseVolume"].includes(field)) {
            fetchExpiryDateSuggestions(
              currentChemicalName,
              currentBrandName,
              currentDoseVolume,
              type,
              index
            );
          }

            // NEW: Fetch Qty Suggestions - AFTER Expiry Date has been entered
            if (["chemicalName", "brandName", "expiryDate"].includes(field)) {
                fetchQtySuggestions(
                    currentChemicalName,
                    currentBrandName,
                    currentExpiryDate,
                    type,
                    index
                );
            }

        }
      }, 0);
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
          return prev.map((item, i) =>
            i === index ? getDefaultRow(type) : item
          );
          // Alternatively, to keep the prevention:
          // return prev;
        }
        return prev.filter((_, i) => i !== index);
      });
    switch (type) {
      case "tablets":
        setState(setTablets);
        break;
      case "injections":
        setState(setInjections);
        break;
      case "syrups":
        setState(setSyrups);
        break;
      case "drops":
        setState(setDrops);
        break;
      case "creams":
        setState(setCreams);
        break;
      case "respules":
        setState(setRespules);
        break;
      case "lotions":
        setState(setLotions);
        break;
      case "fluids":
        setState(setFluids);
        break;
      case "powder":
        setState(setPowder);
        break;
      case "sutureProcedureItems":
        setState(setSutureProcedureItems);
        break;
      case "dressingItems":
        setState(setDressingItems);
        break;
      case "others":
        setState(setOthers);
        break;
      default:
        console.warn("Attempted to remove row for unknown type:", type);
        break;
    }
  };

  // --- getCurrentItemState ---
  // Helper to get the current state of an item, needed for suggestion clicks
  const getCurrentItemState = (type, index) => {
    // Use a direct state access pattern similar to handleInputChange timeout
    switch (type) {
      case "tablets":
        return tablets[index];
      case "injections":
        return injections[index];
      case "syrups":
        return syrups[index];
      case "drops":
        return drops[index];
      case "creams":
        return creams[index];
      case "respules":
        return respules[index];
      case "lotions":
        return lotions[index];
      case "fluids":
        return fluids[index];
      case "powder":
        return powder[index];
      case "sutureProcedureItems":
        return sutureProcedureItems[index];
      case "dressingItems":
        return dressingItems[index];
      case "others":
        return others[index];
      default:
        return null;
    }
  };

  // --- handleSuggestionClick ---
  const handleSuggestionClick = (suggestion, type, index, field) => {
    if (!isDoctor) return;

    updateRowState(type, index, field, suggestion);

    // Reset manual dose entry flag when a suggestion is clicked
    setDoseManuallyEntered((prev) => ({
      ...prev,
      [type]: { ...prev[type], [index]: false },
    }));

      // Also reset manual qty entry when any other suggestion is clicked
      setQtyManuallyEntered((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: false },
      }));

    const medicineFormValue = medicineForms[type];
    if (!medicineFormValue) return;

    // Use setTimeout to allow the state update from updateRowState to likely propagate
    setTimeout(() => {
      const updatedItem = getCurrentItemState(type, index); // Get the item *after* the state update
      if (!updatedItem) return;

      const primaryIdentifierValue = updatedItem.chemicalName;
      const brandValue = updatedItem.brandName;
        const expiryValue = updatedItem.expiryDate; // new value after expiryDate selected
      const standardSuggestionTypes = [
        "tablets",
        "syrups",
        "drops",
        "creams",
        "lotions",
        "powder",
        "others",
        "injections",
        "respules",
        "fluids",
      ];

      if (standardSuggestionTypes.includes(type)) {
        if (field === "brandName") {
          // If chemical name exists, fetch dose suggestions based on the *selected* brand
          if (primaryIdentifierValue) {
            fetchDoseSuggestions(
              suggestion,
              primaryIdentifierValue,
              medicineFormValue,
              type,
              index
            );
          }
        } else if (field === "chemicalName") {
          // Fetch brand suggestions based on the *selected* chemical name
          fetchBrandSuggestions(suggestion, medicineFormValue, type, index);
          // If brand name exists, fetch dose suggestions based on the *selected* chemical name
          if (brandValue) {
            fetchDoseSuggestions(
              brandValue,
              suggestion,
              medicineFormValue,
              type,
              index
            );
          }
        }
          // New: After handling changes to Brand or Chemical, update the Qty suggestions too
          if(["chemicalName", "brandName", "expiryDate"].includes(field)) {
              fetchQtySuggestions(
                  primaryIdentifierValue,
                  brandValue,
                  expiryValue,
                  type,
                  index
              );
          }
      }

      // Hide the suggestion list after selection
      setTimeout(() => {
        if (field === "brandName") {
          setShowBrandSuggestions((prev) => ({
            ...prev,
            [type]: { ...prev[type], [index]: false },
          }));
        } else if (field === "chemicalName") {
          setShowBrandSuggestions((prev) => ({
            ...prev,
            [type]: { ...prev[type], [index]: false },
          }));
        }
      }, 150); // Adjust delay if needed
    }, 50); // Small delay for state update
  };

  // --- handleDoseSuggestionClick ---
  const handleDoseSuggestionClick = (suggestion, type, index) => {
    const requiresDose = [
      "tablets",
      "syrups",
      "drops",
      "creams",
      "lotions",
      "powder",
      "others",
      "injections",
      "respules",
      "fluids",
    ].includes(type);
    if (!requiresDose || !isDoctor) return;

    // Mark that dose was selected from suggestion, not manually entered
    setDoseManuallyEntered((prev) => ({
      ...prev,
      [type]: { ...prev[type], [index]: false },
    }));
    updateRowState(type, index, "doseVolume", suggestion);
    setShowDoseSuggestions((prev) => ({
      ...prev,
      [type]: { ...prev[type], [index]: false },
    }));
  };

  // --- New Function: Handle Quantity Suggestion Click ---
  const handleQtySuggestionClick = (suggestion, type, index) => {
      if (!isDoctor) return;

      // Mark that qty was selected from suggestion, not manually entered
      setQtyManuallyEntered((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: false },
      }));
      updateRowState(type, index, "qty", suggestion);
      setShowQtySuggestions((prev) => ({
          ...prev,
          [type]: { ...prev[type], [index]: false },
      }));
  };

  // --- New Function: Handle Expiry Date Suggestion Click ---
  const handleExpiryDateSuggestionClick = (suggestion, type, index) => {
    if (!isDoctor) return;

    updateRowState(type, index,"expiryDate", suggestion); // Use string value

      // New: After selecting an Expiry Date, update the Qty suggestions!
        const updatedItem = getCurrentItemState(type, index);
        if(updatedItem){
            fetchQtySuggestions(
                updatedItem.chemicalName,
                updatedItem.brandName,
                suggestion,
                type,
                index
            );
        }

    setShowExpiryDateSuggestions((prev) => ({
      ...prev,
      [type]: { ...prev[type], [index]: false },
    }));
  };

  // --- Rendering Functions ---

  // Render Chemical/Brand Suggestions Dropdown
  const renderSuggestions = (type, index, field) => {
    let suggestions = [],
      showSuggestions = false;
    let suggestionsList, showSuggestionsState;

    const hasBrandChemicalSuggestions = [
      "tablets",
      "syrups",
      "drops",
      "creams",
      "lotions",
      "powder",
      "others",
      "injections",
      "respules",
      "fluids",
    ].includes(type);

    if (!hasBrandChemicalSuggestions) return null;

    if (field === "brandName") {
      const currentItem = getCurrentItemState(type, index);
      const chemicalName = currentItem?.chemicalName;
      // Only fetch/show brand suggestions if chemical name exists
      if (chemicalName) {
          suggestionsList = brandSuggestions;
          showSuggestionsState = showBrandSuggestions;
      } else {
          // If no chemical name, don't show brand suggestions for brand input
          suggestionsList = {};
          showSuggestionsState = {};
      }
    } else if (field === "chemicalName") {
      // When typing in Chemical field, show Brand suggestions
      suggestionsList = brandSuggestions;
      showSuggestionsState = showBrandSuggestions;
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
              onMouseDown={(e) => {
                e.preventDefault();
                handleSuggestionClick(suggestion, type, index, field);
              }}
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
      "tablets",
      "syrups",
      "drops",
      "creams",
      "lotions",
      "powder",
      "others",
      "injections",
      "respules",
      "fluids",
    ].includes(type);
    if (!requiresDose) return null;

    const suggestions = doseSuggestions?.[type]?.[index] || [];
    const show = showDoseSuggestions?.[type]?.[index] || false;

    // Only show if doctor, suggestions exist, and dose wasn't manually entered
    if (
      isDoctor &&
      show &&
      suggestions.length > 0 &&
      !doseManuallyEntered?.[type]?.[index]
    ) {      return (
      <div className="absolute z-20 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-48 overflow-y-auto">
        {suggestions.map((suggestion, i) => (
          <div
            key={`${type}-${index}-dose-sugg-${i}`}
            className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
            onMouseDown={(e) => {
              e.preventDefault();
              handleDoseSuggestionClick(suggestion, type, index);
            }}
          >
            {suggestion}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

  // --- New Function: Render Quantity Suggestions ---
  const renderQtySuggestions = (type, index) => {
      const suggestions = qtySuggestions?.[type]?.[index] || [];
      const show = showQtySuggestions?.[type]?.[index] || false;

      // Only show if doctor, suggestions exist, and qty wasn't manually entered
      if (isDoctor && show && suggestions.length > 0 && !qtyManuallyEntered?.[type]?.[index]) {
          return (
              <div className="absolute z-20 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, i) => (
                      <div
                          key={`${type}-${index}-qty-sugg-${i}`}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                          onMouseDown={(e) => {
                              e.preventDefault();
                              handleQtySuggestionClick(suggestion, type, index);
                          }}
                      >
                          {suggestion}
                      </div>
                  ))}
              </div>
          );
      }
      return null;
  };

// --- New Function: Render Expiry Date Suggestions ---
const renderExpiryDateSuggestions = (type, index) => {
  const suggestions = expiryDateSuggestions?.[type]?.[index] || [];
  const show = showExpiryDateSuggestions?.[type]?.[index] || false;

  if (isDoctor && show && suggestions.length > 0) {
    return (
      <div className="absolute z-20 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-48 overflow-y-auto">
        {suggestions.map((suggestion, i) => (
          <div
            key={`${type}-${index}-expiry-sugg-${i}`}
            className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
            onMouseDown={(e) => {
              e.preventDefault();
              handleExpiryDateSuggestionClick(suggestion, type, index);
            }}
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
  if (!item) return null;

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
      minHeight: "38px", // Match approx height of text inputs
      height: "auto", // Allow wrapping
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // Tailwind blue-500 and gray-300
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : provided.boxShadow,
      borderRadius: "0.375rem", // rounded-md
      fontSize: "0.875rem", // text-sm
      backgroundColor: isDoctorFieldDisabled ? "#f3f4f6" : "white", // bg-gray-100 or white
      opacity: isDoctorFieldDisabled ? 0.7 : 1,
      cursor: isDoctorFieldDisabled ? "not-allowed" : "default",
      "&:hover": {
        borderColor: state.isFocused ? "#3b82f6" : "#9ca3af", // blue-500 or gray-400
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "1px 6px", // Adjust vertical padding if needed
      alignItems: "center", // Vertically center selected items
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
      padding: "0px",
      alignSelf: "stretch", // Ensure input takes full height
    }),
    indicatorSeparator: () => ({
      display: "none", // Hide the vertical line separator
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      alignSelf: "stretch", // Align dropdown arrow vertically
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
      alignItems: "center", // Center text/remove icon in multi-value pill
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      padding: "2px",
      paddingLeft: "4px",
      whiteSpace: "normal", // Allow wrapping within the pill if needed
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      "&:hover": {
        backgroundColor: "#be123c", // bg-red-700 on hover
        color: "white",
      },
      alignSelf: "center", // Center the 'x' button vertically
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af", // text-gray-400
    }),
  };

  // --- Placeholder Logic ---
  let primaryIdentifierPlaceholder = "Chemical Name"; // Default

  // --- Reusable Field Renderers ---

  // Renders Chemical Name input with Brand suggestions logic
  const renderChemicalInput = () => (
    <div className="relative">
      <input
        type="text"
        placeholder={primaryIdentifierPlaceholder}
        value={item.chemicalName || ""}
        onChange={(e) => handleInputChange(e, type, index, "chemicalName")}
        onFocus={() => {
          if (item.chemicalName?.length >= 3 && isDoctor) {
            fetchBrandSuggestions(
              item.chemicalName,
              medicineForms[type],
              type,
              index
            );
          }
        }}
        onBlur={() =>
          setTimeout(
            () =>
              setShowBrandSuggestions((prev) => ({
                ...prev,
                [type]: { ...prev[type], [index]: false },
              })),
            200
          )
        } // Increased delay slightly
        className={`${inputBaseClass} ${doctorDisabledClass}`}
        disabled={isDoctorFieldDisabled}
        autoComplete="off"
      />
      {renderSuggestions(type, index, "chemicalName")}
    </div>
  );

  // Renders Brand Name input with its specific suggestion logic (currently just showing brand suggestions again)
  const renderBrandInput = () => {
    const showField = [
      "tablets",
      "syrups",
      "drops",
      "creams",
      "lotions",
      "powder",
      "others",
      "injections",
      "respules",
      "fluids",
    ].includes(type);
    if (!showField) return null;
    return (
      <div className="relative">
        <input
          type="text"
          placeholder="Brand Name"
          value={item.brandName || ""}
          onChange={(e) => handleInputChange(e, type, index, "brandName")}
          onFocus={() => {
            // If chemical name exists, show relevant brands again on focus
            if (item.chemicalName && isDoctor) {
              fetchBrandSuggestions(
                item.chemicalName,
                medicineForms[type],
                type,
                index
              );
            }
          }}
          onBlur={() =>
            setTimeout(() => {
              setShowBrandSuggestions((prev) => ({
                ...prev,
                [type]: { ...prev[type], [index]: false },
              }));
            }, 200)
          }
          className={`${inputBaseClass} ${doctorDisabledClass}`}
          disabled={isDoctorFieldDisabled}
          autoComplete="off"
        />
        {renderSuggestions(type, index, "brandName")}{" "}
        {/* This now shows brand suggestions */}
      </div>
    );
  };

  // Renders Dose/Volume input with Dose suggestions logic
  const renderDoseInput = () => {
    const showField = [
      "tablets",
      "syrups",
      "drops",
      "creams",
      "lotions",
      "powder",
      "others",
      "injections",
      "respules",
      "fluids",
    ].includes(type);
    if (!showField) return null;
    return (
      <div className="relative">
        <input
          type="text"
          placeholder="Dose/Vol"
          value={item.doseVolume || ""}
          onChange={(e) => handleInputChange(e, type, index, "doseVolume")}
          onFocus={() => {
            if (item.brandName && item.chemicalName && isDoctor) {
              fetchDoseSuggestions(
                item.brandName,
                item.chemicalName,
                medicineForms[type],
                type,
                index
              );
            }
          }}
          onBlur={() =>
            setTimeout(
              () =>
                setShowDoseSuggestions((prev) => ({
                  ...prev,
                  [type]: { ...prev[type], [index]: false },
                })),
              200
            )
          }
          className={`${inputBaseClass} ${doctorDisabledClass}`}
          disabled={isDoctorFieldDisabled}
          autoComplete="off"
        />
        {renderDoseVolumeSuggestions(type, index)}
      </div>
    );
  };

    // Renders Qty input
    const renderQtyInput = () => {
        return (
            <div className="relative">
                <input
                    type="text"
                    placeholder="Qty"
                    value={item.qty || ""}
                    onChange={(e) => handleInputChange(e, type, index, "qty")}
                    onFocus={() => {
                        if (item.chemicalName && item.brandName && item.expiryDate && isDoctor) {
                            fetchQtySuggestions(
                                item.chemicalName,
                                item.brandName,
                                item.expiryDate,
                                type,
                                index
                            );
                        }
                    }}
                    onBlur={() =>
                        setTimeout(
                            () =>
                                setShowQtySuggestions((prev) => ({
                                    ...prev,
                                    [type]: { ...prev[type], [index]: false },
                                })),
                            200
                        )
                    }
                    className={`${inputBaseClass} ${doctorDisabledClass}`}
                    disabled={isDoctorFieldDisabled}
                    autoComplete="off"
                />
                {renderQtySuggestions(type, index)}
            </div>
        );
    };

  // Renders Serving/Application input
  const renderServingInput = () => {
      // Only show Serving for specific types
      const showField = ["tablets", "syrups", "drops", "lotions"].includes(type);
      if (!showField) return null;

      let placeholder = "Serving";
      let fieldName = "serving";

      if (type === "tablets") {
          placeholder = "(eg. 200mg)"; // Changed placeholder for tablets
      } else if (type === "syrups") {
          placeholder = "(e.g., 5ml)";
      } else if (type === "drops") {
          placeholder = "(e.g., 1 drop)";
      } else if (type === "lotions") {
          placeholder = "Application"; // More appropriate for lotions
      }

    return (
      <input
        type="text"
        placeholder={placeholder}
        value={item[fieldName] || ""}
        onChange={(e) => handleInputChange(e, type, index, fieldName)}
        className={`${inputBaseClass} ${doctorDisabledClass}`}
        disabled={isDoctorFieldDisabled}
      />
    );
  };

  // Renders Timing multi-select
  const renderTimingSelect = () => {
    const showField = [
      "tablets",
      "syrups",
      "drops",
      "creams",
      "powder",
      // Add others if needed, e.g., 'respules' if they sometimes have timing
    ].includes(type);
    if (!showField) return null;
    return (
      <Select
        name="timing"
        isMulti
        options={timingOptions}
        value={item.timing || []}
        onChange={(selectedOptions) =>
          handleInputChange(selectedOptions, type, index, "timing")
        }
        className={`${selectBaseClass} ${doctorDisabledClass}`} // Apply disabled styles to the container
        styles={reactSelectStyles}
        isDisabled={isDoctorFieldDisabled}
        placeholder="Timing"
        closeMenuOnSelect={false}
        isClearable={false}
      />
    );
  };

  // Renders Food native select
  const renderFoodSelect = () => {
    const showField = ["tablets", "syrups", "drops", "creams"].includes(type); // Add others if needed
    if (!showField) return null;
    return (
      <div className="relative">
        {" "}
        {/* Add wrapper for custom arrow */}
        <select
          value={item.food || ""}
          onChange={(e) => handleInputChange(e, type, index, "food")}
          className={`${nativeSelectBaseClass} ${doctorDisabledClass}`}
          disabled={isDoctorFieldDisabled}
        >
          <option value="">Food</option>
          {foodOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {/* Custom arrow overlay */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    );
  };

  // Renders Days input
  const renderDaysInput = () => {
    const showField = [
      "tablets",
      "syrups",
      "drops",
      "creams",
      "respules",
      "lotions",
      "powder",
    ].includes(type);
    if (!showField) return null;
    return (
      <input
        type="text"
        placeholder="Days"
        value={item.days || ""}
        onChange={(e) => handleInputChange(e, type, index, "days")}
        className={`${inputBaseClass} ${doctorDisabledClass}`}
        disabled={isDoctorFieldDisabled}
      />
    );
  };

  //  ---  NEW:  Render Expiry Date Input  ---
  const renderExpiryDateInput = () => {
      return (
          <div className="relative">
              <input
                  type="date"  //Keep it as date for date picker
                  placeholder="Expiry Date"
                  value={item.expiryDate || ""}
                  onChange={(e) => handleInputChange(e, type, index, "expiryDate")}
                  onFocus={() => { //Show suggestions on focus
                    if(item.chemicalName && item.brandName && item.doseVolume && isDoctor) {
                      fetchExpiryDateSuggestions(item.chemicalName, item.brandName, item.doseVolume, type, index);
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowExpiryDateSuggestions(prev => ({
                    ...prev,
                    [type]: { ...prev[type], [index]: false}
                  })), 200)} // Hide after a delay
                  className={`${inputBaseClass} ${doctorDisabledClass} `}

                  disabled={isDoctorFieldDisabled}
                  autoComplete="off"
              />
              {renderExpiryDateSuggestions(type, index)}
          </div>
      );
  };

  // Renders Pharmacy-specific textareas
  const renderPharmacyFields = () => (
    <>
      <textarea
        placeholder="Issued In"
        value={item.issuedIn || ""}
        onChange={(e) => handleInputChange(e, type, index, "issuedIn")}
        className={`${textareaBaseClass} ${pharmacyDisabledClass} ${
          isPharmacy ? pharmacyEnabledClass : ""
        }`}
        disabled={isPharmacyFieldDisabled}
        rows="1"
        title="Pharmacy Use Only: Issued In Details"
      />
      <textarea
        placeholder="Issued Out"
        value={item.issuedOut || ""}
        onChange={(e) => handleInputChange(e, type, index, "issuedOut")}
        className={`${textareaBaseClass} ${pharmacyDisabledClass} ${
          isPharmacy ? pharmacyEnabledClass : ""
        }`}
        disabled={isPharmacyFieldDisabled}
        rows="1"
        title="Pharmacy Use Only: Issued Out Details"
      />
      <textarea
        placeholder="Presc. Out"
        value={item.prescriptionOut || ""}
        onChange={(e) => handleInputChange(e, type, index, "prescriptionOut")}
        className={`${textareaBaseClass} ${pharmacyDisabledClass} ${
          isPharmacy ? pharmacyEnabledClass : ""
        }`}
        disabled={isPharmacyFieldDisabled}
        rows="1"
        title="Pharmacy Use Only: Prescription Out Details"
      />
    </>
  );

  // --- Type-Specific Layout ---
  // Use the reusable render functions based on the 'type'
  switch (type) {
    case "tablets":
    case "syrups":
    case "drops":
      return ( // Chem, Brand, Dose, Qty, Serving, Timing, Food, Days,  Expiry, Pharm x3 = 12 fields
        <>
          {renderChemicalInput()}
          {renderBrandInput()}
          {renderDoseInput()}
          {renderExpiryDateInput()}  {/* ADDED */}
          {renderQtyInput()}
          {renderServingInput()}
          {renderTimingSelect()}
          {renderFoodSelect()}
          {renderDaysInput()}
          {renderPharmacyFields()}
        </>
      );
      case "creams":
      case "powder": // Assuming powder might have timing/days
       return ( // Chem, Brand, Dose, Qty, Timing, Food/-, Days, Expiry, Pharm x3 = 11/10 fields
          <>
              {renderChemicalInput()}
              {renderBrandInput()}
              {renderDoseInput()}
              {renderExpiryDateInput()} {/* ADDED */}
              {renderQtyInput()}
              {/* No Serving Input */}
              {renderTimingSelect()}
              {type === 'creams' && renderFoodSelect()} {/* Food only for creams here */}
              {renderDaysInput()}
              {renderPharmacyFields()}
          </>
       );

    case "injections":
    case "fluids": // Assuming fluids have Chem, Brand, Dose, Qty, Expiry, Pharm x3 = 8 fields
      return (
        <>
          {renderChemicalInput()}
          {renderBrandInput()}
          {renderDoseInput()}
          {renderExpiryDateInput()} {/* ADDED */}
          {renderQtyInput()}
          {/* No Serving, Timing, Food, Days */}
          {renderPharmacyFields()}
        </>
      );
    case "respules": // Assuming respules have Chem, Brand, Dose, Qty, Days, Expiry, Pharm x3 = 9 fields
        return (
          <>
            {renderChemicalInput()}
            {renderBrandInput()}
            {renderDoseInput()}
            {renderExpiryDateInput()} {/* ADDED */}
            {renderQtyInput()}
            {/* No Serving, Timing, Food */}
            {renderDaysInput()} {/* Add Days input specifically for Respules */}
            {renderPharmacyFields()}
          </>
        );

    case "lotions": // Lotions: Chem, Brand, Dose, Qty, Serving(App), Days, Expiry, Pharm x3 = 10 fields
      return (
        <>
          {renderChemicalInput()}
          {renderBrandInput()}
          {renderDoseInput()}
          {renderExpiryDateInput()} {/* ADDED */}
          {renderQtyInput()}
          {renderServingInput()} {/* Serving as Application */}
          {/* No Timing, Food */}
          {renderDaysInput()}
          {renderPharmacyFields()}
        </>
      );

    case "others": // Others: Chem, Brand, Dose, Qty, Expiry, Pharm x3 = 8 fields (Generic)
      return (
        <>
          {renderChemicalInput()}
          {renderBrandInput()}
          {renderDoseInput()}
          {renderExpiryDateInput()} {/* ADDED */}
          {renderQtyInput()}
          {/* No Serving, Timing, Food, Days */}
          {renderPharmacyFields()}
        </>
      );

    case "sutureProcedureItems":
    case "dressingItems": // These have only Item Name (as chemicalName), Qty, Expiry, Pharm x3 = 6 fields
      return (
        <>
          {/* Using renderChemicalInput but placeholder is 'Item Name' */}
          <div className="relative">
            <input
              type="text"
              placeholder="Item Name"
              value={item.chemicalName || ""}
              onChange={(e) =>
                handleInputChange(e, type, index, "chemicalName")
              }
              className={`${inputBaseClass} ${doctorDisabledClass}`}
              disabled={isDoctorFieldDisabled}
              autoComplete="off"
            />
            {/* No suggestions needed for these typically */}
          </div>
          {/* Qty input */}
          {renderExpiryDateInput()} {/* ADDED */}
          {renderQtyInput()}
          {/* No Brand, Dose, Serving, Timing, Food, Days */}
          {renderPharmacyFields()}
        </>
      );

    default:
      return null; // Should not be reached
  }
};

// --- filterEmptyRows ---
// Filters out rows where the primary identifier (chemicalName) is empty AND quantity is empty
const filterEmptyRows = (items, type) => {
  if (!Array.isArray(items) || items.length === 0) return [];

  let keyField = "chemicalName";

  return items.filter((item) => {
    const hasIdentifier = item && typeof item[keyField] === "string" && item[keyField].trim() !== "";
    const hasQty = item && item.qty != null && String(item.qty).trim() !== "";
    const hasExpiryDate = item && item.expiryDate != null && String(item.expiryDate).trim() !== "";
    const hasPharmacyData = item && (
      (item.issuedIn && String(item.issuedIn).trim() !== "") ||
      (item.issuedOut && String(item.issuedOut).trim() !== "") ||
      (item.prescriptionOut && String(item.prescriptionOut).trim() !== "")
    );

    return hasIdentifier || hasQty || hasPharmacyData || hasExpiryDate;
  });
};

// --- handleSubmit ---
const handleSubmit = async () => {
  try {
    // Validate MRD number
    if (!mrdNo) {
      setError("MRD number is required to save prescription");
      alert("Please ensure MRD number is available before saving prescription");
      return;
    }

    // Filter out empty rows
    const filteredTablets = filterEmptyRows(tablets, "tablets");
    const filteredInjections = filterEmptyRows(injections, "injections");
    const filteredSyrups = filterEmptyRows(syrups, "syrups");
    const filteredDrops = filterEmptyRows(drops, "drops");
    const filteredCreams = filterEmptyRows(creams, "creams");
    const filteredRespules = filterEmptyRows(respules, "respules");
    const filteredLotions = filterEmptyRows(lotions, "lotions");
    const filteredFluids = filterEmptyRows(fluids, "fluids");
    const filteredPowder = filterEmptyRows(powder, "powder");
    const filteredSutureProcedure = filterEmptyRows(sutureProcedureItems, "sutureProcedureItems");
    const filteredDressing = filterEmptyRows(dressingItems, "dressingItems");
    const filteredOthers = filterEmptyRows(others, "others");

    // Format timing for submission
    const formatTimingForSubmit = (timingArray) =>
      Array.isArray(timingArray)
        ? timingArray.map((t) => {
            if (t === "morning") return "M";
            if (t === "afternoon") return "A";
            if (t === "evening") return "E";
            if (t === "night") return "N";
            return t;
          })
        : [];

    // Get username from localStorage
    const username = localStorage.getItem("username") || "Unknown";

    // Prepare data for submission
    const prescriptionData = {
      emp_no: emp_no,
      name: data?.[0]?.name || "",
      aadhar: aadhar,
      mrdNo: mrdNo,
      tablets: filteredTablets.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      injections: filteredInjections.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      syrups: filteredSyrups.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      drops: filteredDrops.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      creams: filteredCreams.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      respules: filteredRespules.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      lotions: filteredLotions.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      fluids: filteredFluids.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      powder: filteredPowder.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      suture_procedure: filteredSutureProcedure.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      dressing: filteredDressing.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      others: filteredOthers.map((item) => ({
        ...item,
        timing: formatTimingForSubmit(item.timing),
      })),
      nurse_notes: nurseNotes,
      submitted_by: username,
      issued_by: username,
      issued_status: 0
    };
    if(condition){
      prescriptionData.issued_status = 1;
    }
    // Send data to backend
    const response = await axios.post(
      `https://occupational-health-center-1.onrender.com/prescriptions/add/`,
      prescriptionData
    );

    if (response.status != 201 && response.status != 200) {
      throw new Error(response.data.message || 'Failed to update stock');
    }

    // Collect all issued items for stock update
    const allItems = [
      ...filteredTablets.map(item => ({ ...item, type: 'Tablet' })),
      ...filteredInjections.map(item => ({ ...item, type: 'Injection' })),
      ...filteredSyrups.map(item => ({ ...item, type: 'Syrup' })),
      ...filteredDrops.map(item => ({ ...item, type: 'Drop' })),
      ...filteredCreams.map(item => ({ ...item, type: 'Cream' })),
      ...filteredRespules.map(item => ({ ...item, type: 'Respule' })),
      ...filteredLotions.map(item => ({ ...item, type: 'Lotion' })),
      ...filteredFluids.map(item => ({ ...item, type: 'Fluid' })),
      ...filteredPowder.map(item => ({ ...item, type: 'Powder' })),
      ...filteredSutureProcedure.map(item => ({ ...item, type: 'Suture/Procedure' })),
      ...filteredDressing.map(item => ({ ...item, type: 'Dressing' })),
      ...filteredOthers.map(item => ({ ...item, type: 'Other' })),
    ];

    // Filter items that have been issued (have issuedIn value)
    const issuedItems = allItems.filter(item => item.issuedIn && parseInt(item.issuedIn) > 0);

    if (response.data) {
      alert("Prescription saved successfully!");
      if (onPrescriptionUpdate) {
        onPrescriptionUpdate(issuedItems);
      }
    }
  } catch (error) {
    console.error("Error saving prescription:", error);
    setError(error.response?.data?.error || "Error saving prescription");
    alert(error.response?.data?.error || "Error saving prescription");
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
    const finalSutureProcedureItems = filterEmptyRows(
      sutureProcedureItems,
      "sutureProcedureItems"
    );
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

    const hasItems = Object.values(allSections).some((arr) => arr.length > 0);

    if (!hasItems  && !nurseNotes.trim()) {
      alert(
        "Cannot generate an empty prescription. Please add medication or notes."
      );
      return;
    }

    // 2. Initialize jsPDF
    const doc = new jsPDF("p", "mm", "a4"); // Portrait, millimeters, A4 size
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15; // Page margin (mm)
    const lineHeight = 7; // Line height (mm)
    const sectionSpacing = 10; // Space between sections (mm)
    let y = margin; // Current Y position on the page (mm)

    // Helper function to add text and handle page breaks
    const addText = (text, x, currentY, options = {}) => {
      const {
        isBold = false,
        isTitle = false,
        fontSize = 10,
        isCentered = false,
        maxWidth,
      } = options;

      // Ensure text is a string
      const textString = String(text ?? ""); // Convert null/undefined to empty string

      // Estimate text height (simple approach)
      const lines = maxWidth ? doc.splitTextToSize(textString, maxWidth) : [textString];
      const textHeight = lines.length * lineHeight * 0.8 + (isTitle ? lineHeight * 0.5 : 0); // Adjust for line height and title spacing

      // Check if new page is needed *before* adding text
      if (currentY + textHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
        // Optional: Add continuation header on new page
        doc.setFontSize(8);
        doc.setFont(undefined, "italic");
        doc.text(
          `Prescription for ${
            data[0].name
          } (${emp_no}) - Page ${doc.internal.getNumberOfPages()}`,
          pageWidth - margin,
          margin / 2,
          { align: "right" }
        );
        doc.setFont(undefined, "normal"); // Reset font style
        currentY += lineHeight / 2; // Adjust starting Y on new page slightly
      }

      doc.setFontSize(fontSize);
      doc.setFont(undefined, isBold || isTitle ? "bold" : "normal");

      let textX = x;
      let textAlign = "left";
      if (isCentered) {
        textX = pageWidth / 2;
        textAlign = "center";
      }

      const textOptions = { align: textAlign };
      if (maxWidth) {
        // Use the pre-calculated lines
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
    y = addText("PRESCRIPTION", margin, y, {
      isTitle: true,
      fontSize: 16,
      isCentered: true,
    });
    y += lineHeight / 2; // Add a bit more space after title

    // Patient Info Box
    const patientBoxStartY = y;
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    y = addText("Patient Information", margin, y);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    y = addText(`Employee No: ${emp_no}`, margin + 5, y);
    y = addText(`Patient Name: ${data[0].name}`, margin + 5, y);
    y = addText(
      `Date: ${new Date().toLocaleDateString("en-GB")}`,
      margin + 5,
      y
    ); // dd/mm/yyyy format
    const patientBoxEndY = y;
    doc.setDrawColor(150, 150, 150); // Gray border
    doc.rect(
      margin - 2,
      patientBoxStartY - lineHeight * 0.8,
      pageWidth - (margin - 2) * 2,
      patientBoxEndY - patientBoxStartY + lineHeight * 0.5
    ); // Draw rect around info
    y += sectionSpacing / 1.5; // Add space after the box

    // Rx Symbol
    doc.setFontSize(24); // Larger Rx
    doc.setFont(undefined, "bold");
    y = addText("Rx", margin, y);
    y += lineHeight / 2; // Space after Rx

    // Medication Sections
    const formatTimingForPDF = (timing) => { // Use the same mapping logic as initialization
        if (!timing) return "N/A";
        if (Array.isArray(timing)) {
            return timing.map(t => t.label || t.value).join(", ") || "N/A";
        }
        if (typeof timing === 'string') { // If timing is already a string from db
            return timing.split(',').map(t => t.trim()).filter(Boolean).join(", ") || "N/A";
        }
        return "N/A";
    };


    for (const [title, items] of Object.entries(allSections)) {
      if (items.length > 0) {
        // Section Title
        y = addText(title, margin, y, { isBold: true, fontSize: 12 });

        items.forEach((item, index) => {
          // Check for page break *before* adding item details
          const estimatedItemHeight = lineHeight * 3; // Increase estimate slightly
          if (y + estimatedItemHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
            // Continuation header
            doc.setFontSize(8);
            doc.setFont(undefined, "italic");
            doc.text(
              `Prescription for ${
                data[0].name
              } (${emp_no}) - Page ${doc.internal.getNumberOfPages()}`,
              pageWidth - margin,
              margin / 2,
              { align: "right" }
            );
            doc.setFont(undefined, "normal");
            y += lineHeight / 2;

            y = addText(title + " (cont.)", margin, y, {
              isBold: true,
              fontSize: 12,
            });
          }

          // Item Details
          let mainLine = `${index + 1}. ${item.chemicalName || "N/A"}`;
          if (item.brandName) mainLine += ` (${item.brandName})`;
          if (item.doseVolume) mainLine += ` - ${item.doseVolume}`;

          y = addText(mainLine, margin + 5, y); // Indent item name line

          // Combine Qty and Serving if applicable
          let qtyServingLineParts = [];
          if (item.qty) qtyServingLineParts.push(`Qty: ${item.qty}`);
          if (item.serving) qtyServingLineParts.push(`Serving: ${item.serving}`); // Or 'Application' for lotions
          if (qtyServingLineParts.length > 0) {
            y = addText(`   ${qtyServingLineParts.join(" | ")}`, margin + 10, y, { fontSize: 9 }); // Indented further
          }

          // Sig (Instructions) Line
          let sigLineParts = [];
          const formattedTiming = formatTimingForPDF(item.timing);
          if (formattedTiming && formattedTiming !== "N/A") {
            sigLineParts.push(`Timing: ${formattedTiming}`);
          }
          if (item.food) sigLineParts.push(`Food: ${item.food}`);
          if (item.days) sigLineParts.push(`Days: ${item.days}`);

          if (sigLineParts.length > 0) {
            y = addText(`   Sig: ${sigLineParts.join(" | ")}`, margin + 10, y, {
              fontSize: 9,
            }); // Indented further
          }

           // Expiry Date
          if (item.expiryDate) {
            y = addText(`   Expiry: ${item.expiryDate}`, margin + 10, y, { fontSize: 9 });
          }

          // Add a little space between items
          y += lineHeight * 0.4;
        });
        y += sectionSpacing / 1.5; // Space after the section
      }
    }

    // Draw line before notes/footer
    doc.setDrawColor(150, 150, 150);
    doc.line(
      margin,
      y - lineHeight / 2,
      pageWidth - margin,
      y - lineHeight / 2
    );
    y += lineHeight / 2;

    // Nurse Notes
    if (nurseNotes && nurseNotes.trim()) {
      y = addText("Nurse Notes:", margin, y, { isBold: true, fontSize: 11 });
      // Use splitTextToSize with maxWidth for wrapping long notes
      y = addText(nurseNotes, margin, y, {
        fontSize: 10,
        maxWidth: pageWidth - margin * 2,
      });
      y += sectionSpacing / 2;
    }

    // Prescribed By & Signature Area
    const footerStartY = y;
    // Check for page break *before* adding footer/signature
    const footerHeightEstimate = lineHeight * 4;
    if (footerStartY + footerHeightEstimate > pageHeight - margin) {
        doc.addPage();
        y = margin; // Reset y for the new page
        // Optional: Add continuation header or footer info here if needed
        doc.setFontSize(8);
        doc.setFont(undefined, "italic");
        doc.text(
            `Prescription for ${
            data[0].name
            } (${emp_no}) - Page ${doc.internal.getNumberOfPages()}`,
            pageWidth - margin,
            margin / 2,
            { align: "right" }
        );
        doc.setFont(undefined, "normal"); // Reset font style
        y += lineHeight;
    } else {
        y = footerStartY; // Use the original y position if no page break needed
    }

    // Add Prescribed By
    

    // Add Signature Line further to the right and slightly lower
    const signatureX = pageWidth / 2 + 10; // Start signature line around the middle-right
    const signatureY = y + lineHeight * 1.5; // Position signature below 'Prescribed By'

    doc.setDrawColor(0, 0, 0); // Black line for signature
    doc.line(signatureX, signatureY, pageWidth - margin, signatureY); // Draw the signature line
    addText( // Use addText to handle potential page break if signature label itself causes overflow (unlikely)
        "Doctor's Signature",
        signatureX,
        signatureY + lineHeight / 2, // Add label below line
        { fontSize: 9 }
    );


    // 3. Save the PDF
    const filename = `prescription-${emp_no}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(filename);
  }; // End of handleGeneratePrescription

  // --- Button Components ---
  const ActionButton = ({
    onClick,
    disabled = false,
    children,
    color = "blue",
    title = "",
    className = "",
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`bg-${color}-600 hover:bg-${color}-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out text-sm focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-opacity-50 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      } ${className}`}
    >
      {children}
    </button>
  );

  const RemoveButton = ({ onClick, disabled = false, type, index }) => (
    <button
      type="button"
      onClick={() => onClick(type, index)}
      disabled={disabled}
      title={`Remove this row`}
      className={`bg-red-500 hover:bg-red-700 text-white font-bold p-1 rounded w-8 h-8 flex items-center justify-center transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      <FaTrash size={12} />
    </button>
  );

  // --- Section Expansion Logic ---
  const toggleSection = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };
  const isSectionExpanded = (section) => expandedSections.includes(section);

  // --- Define grid templates (REVISED after adding expiry date) ---
  // Columns: Chemical, Brand, Dose, Qty, [Serving], [Timing], [Food], [Days], Expiry, 3x Pharmacy, Action
  const gridTemplateColumns = {
    // Chem(1), Brand(2), Dose(3), Qty(4), Serving(5), Timing(6), Food(7), Days(8), Expiry(9), Pharm x3(10-12), Action(13)
    tablets: "repeat(4, minmax(140px, 1.5fr)) repeat(2, minmax(80px, 0.8fr)) repeat(3, minmax(100px, 1fr)) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 9th column
    syrups: "repeat(4, minmax(140px, 1.5fr)) repeat(2, minmax(80px, 0.8fr)) repeat(3, minmax(100px, 1fr)) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 9th column
    drops: "repeat(4, minmax(140px, 1.5fr)) repeat(2, minmax(80px, 0.8fr)) repeat(3, minmax(100px, 1fr)) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 9th column
    // Chem(1), Brand(2), Dose(3), Qty(4), Timing(5), Food(6), Days(7), Expiry(8), Pharm x3(9-11), Action(12)
    creams: "repeat(4, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) repeat(3, minmax(100px, 1fr)) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 8th column
    // Chem(1), Brand(2), Dose(3), Qty(4), Timing(5), Days(6), Expiry(7), Pharm x3(8-10), Action(11)
    powder: "repeat(4, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) repeat(2, minmax(100px, 1fr)) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 7th column
    // Chem(1), Brand(2), Dose(3), Qty(4), Expiry(5), Pharm x3(6-8), Action(9)
    injections: "repeat(4, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 5th column
    fluids: "repeat(4, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 5th column
    others: "repeat(4, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 5th column
    // Chem(1), Brand(2), Dose(3), Qty(4), Days(5), Expiry(6), Pharm x3(7-9), Action(10)
    respules: "repeat(4, minmax(140px, 1.5fr)) minmax(80px, 0.8fr) minmax(100px, 1fr) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 6th column
    // Chem(1), Brand(2), Dose(3), Qty(4), Serving(5), Days(6), Expiry(7), Pharm x3(8-10), Action(11)
    lotions: "repeat(4, minmax(140px, 1.5fr)) repeat(2, minmax(80px, 0.8fr)) minmax(100px, 1fr) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 7th column
    // Item Name(1), Qty(2), Expiry(3), Pharm x3(4-6), Action(7)
    sutureProcedureItems: "minmax(150px, 2fr) minmax(80px, 1fr) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 3rd column
    dressingItems: "minmax(150px, 2fr) minmax(80px, 1fr) minmax(100px, 1.2fr) repeat(3, minmax(120px, 1fr)) minmax(40px, auto)", // Increased 3rd column
  };

  // --- renderSection ---
  const renderSection = (type, title, color, children, addItemButtonText) => {
    const isExpanded = isSectionExpanded(type);
    const headerColor = color || "gray"; // Default color if none provided
    const buttonColor = "blue"; // Consistent add button color

    // Function to dynamically generate headers based on type
    const getHeaders = () => {
      const baseHeaders = [
        {
          title: "Chemical Name",
          gridSpan: "span 1",
          tooltip: "Generic or chemical name of the medication/item",
        },
      ];
      const brandDoseHeaders = [
        {
          title: "Brand Name",
          gridSpan: "span 1",
          tooltip: "Specific brand name (if applicable)",
        },
        {
          title: "Dose/Vol",
          gridSpan: "span 1",
          tooltip: "Dosage strength or volume",
        },
      ];
      const expiryHeader = {
        title: "Expiry Date",
        gridSpan: "span 1",
        tooltip: "Expiration date of the medication/item",
      };
      const qtyHeader = {
        title: "Qty",
        gridSpan: "span 1",
        tooltip: "Quantity to dispense",
      };
      const servingHeader = {
        title: "Serving", // Title adjusted for broader meaning (Serving/Application)
        gridSpan: "span 1",
        tooltip: "Dosage per administration (e.g., 5ml, 1 drop, application)",
      };
      const timingHeader = {
        title: "Timing",
        gridSpan: "span 1",
        tooltip: "When to take the medication",
      };
      const foodHeader = {
        title: "Food",
        gridSpan: "span 1",
        tooltip: "Relation to food intake",
      };
      const daysHeader = {
        title: "Days",
        gridSpan: "span 1",
        tooltip: "Duration of treatment",
      };
      const pharmacyHeaders = [
        {
          title: "Issued In",
          gridSpan: "span 1",
          tooltip: "Pharmacy Use Only: Details of item arrival/check-in",
        },
        {
          title: "Issued Out",
          gridSpan: "span 1",
          tooltip: "Pharmacy Use Only: Details of item dispensing/check-out",
        },
        {
          title: "Presc. Out",
          gridSpan: "span 1",
          tooltip: "Pharmacy Use Only: Prescription status/tracking",
        },
      ];
      const actionHeader = {
        title: "Action",
        gridSpan: "span 1",
        tooltip: "Remove row",
      };

      let headers = [];

      switch (type) {
        case "tablets":
        case "syrups":
        case "drops":
          headers = [ // Chem, Brand, Dose, Qty, Serving, Timing, Food, Days, Expiry, Pharm x3, Action
            ...baseHeaders,
            ...brandDoseHeaders,
            expiryHeader,
            qtyHeader,
            servingHeader,
            timingHeader,
            foodHeader,
            daysHeader,
            ...pharmacyHeaders,
            actionHeader,
          ];
          break;
        case "creams":
          headers = [ // Chem, Brand, Dose, Qty, Timing, Food, Days, Expiry, Pharm x3, Action
            ...baseHeaders,
            ...brandDoseHeaders,
            expiryHeader,
            qtyHeader,
            // No Serving
            timingHeader,
            foodHeader,
            daysHeader,
            ...pharmacyHeaders,
            actionHeader,
          ];
          break;
        case "powder":
          headers = [ // Chem, Brand, Dose, Qty, Timing, Days, Expiry, Pharm x3, Action
            ...baseHeaders,
            ...brandDoseHeaders,
            expiryHeader,
            qtyHeader,
            // No Serving, Food
            timingHeader,
            daysHeader,
            ...pharmacyHeaders,
            actionHeader,
          ];
          break;
        case "injections":
        case "fluids":
        case "others": // Generic Others layout
          headers = [ // Chem, Brand, Dose, Qty, Expiry, Pharm x3, Action
            ...baseHeaders,
            ...brandDoseHeaders,
            expiryHeader,
            qtyHeader,
            // No Serving, Timing, Food, Days
            ...pharmacyHeaders,
            actionHeader,
          ];
          break;
        case "respules":
          headers = [ // Chem, Brand, Dose, Qty, Days, Expiry, Pharm x3, Action
            ...baseHeaders,
            ...brandDoseHeaders,
            expiryHeader,
            qtyHeader,
            // No Serving, Timing, Food
            daysHeader,
            ...pharmacyHeaders,
            actionHeader,
          ];
          break;
        case "lotions":
            headers = [ // Chem, Brand, Dose, Qty, Serving(App), Days, Expiry, Pharm x3, Action
            ...baseHeaders,
            ...brandDoseHeaders,
            expiryHeader,
            qtyHeader,
            servingHeader, // Serving represents Application
            // No Timing, Food
            daysHeader,
            ...pharmacyHeaders,
            actionHeader,
          ];
          break;
        case "sutureProcedureItems":
        case "dressingItems":
          headers = [ // Item Name, Qty, Expiry, Pharm x3, Action
            {
              title: "Item Name", // Adjusted title for clarity
              gridSpan: "span 1",
              tooltip: "Name of the item",
            },
            expiryHeader,
            qtyHeader,
            // No Brand, Dose, Serving, Timing, Food, Days
            ...pharmacyHeaders,
            actionHeader,
          ];
          break;
        default:
          return null;
      }

      // Filter out null/undefined headers just in case
      return headers.filter(h => h).map((h, i) => (
        <div
          key={`${type}-header-${i}`}
          className="font-medium text-xs text-gray-600 truncate uppercase tracking-wider" // Styling tweak
          title={h.tooltip}
          style={{ gridColumn: h.gridSpan }}
        >
          {h.title}
        </div>
      ));
    };

    return (
      <section className="border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden bg-white">
        <h2
          className={`text-lg font-semibold p-3 bg-${headerColor}-50 border-b border-gray-200 text-${headerColor}-700 flex justify-between items-center cursor-pointer hover:bg-${headerColor}-100 transition-colors duration-150`}
          onClick={() => toggleSection(type)}
          aria-expanded={isExpanded}
          aria-controls={`section-content-${type}`}
        >
          {title}
          <span
            className={`text-sm text-gray-500 transition-transform duration-200 transform ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </h2>
        {isExpanded && (
          <div id={`section-content-${type}`} className="p-4">
            <div className="overflow-x-auto pb-2">
              {/* Header Row */}
              <div
                className={`grid gap-x-4 items-center mb-3 pb-2 border-b border-gray-200 px-1`} // Added slight padding
                style={{ gridTemplateColumns: gridTemplateColumns[type] }}
              >
                {getHeaders()}
              </div>
              {/* Data Rows */}
              <div>
                {children} {/* Renders the grid rows with input fields */}
              </div>
            </div>
            {/* Add Row Button */}
            <div className="mt-4">
              <ActionButton
                onClick={() => addRow(type)}
                disabled={!isDoctor}
                color={buttonColor}
                title={
                  isDoctor ? addItemButtonText : "Only doctors can add items"
                }
              >
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
    "tablets",
    "injections",
    "syrups",
    "drops",
    "creams",
    "respules",
    "lotions",
    "fluids",
    "powder",
    "sutureProcedureItems",
    "dressingItems",
    "others",
  ];
  // --- Main Component Return JSX ---
  if (!aadhar && !existingPrescription) {
    // Display message if no employee selected or no existing data to show
    return (
      <div className="p-6 text-center text-gray-500">
        {" "}
        Please select an employee to view or create a prescription.{" "}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6 space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 border-b pb-2 mb-6">
        Prescription Details {emp_no && `for Emp #${emp_no}`}{" "}
        {data?.[0]?.name && `(${data[0].name})`}
        {prescriptionId && (
          <span className="text-sm text-gray-500 font-normal ml-2">
            (ID: {prescriptionId})
          </span>
        )}
      </h1>

      {/* Render each medication section based on the defined order */}
      {sectionOrder.map((type) => {
        let title, color, items, addItemButtonText;
        // Map type string to state variable
        const stateMap = {
          tablets,
          injections,
          syrups,
          drops,
          creams,
          respules,
          lotions,
          fluids,
          powder,
          sutureProcedureItems,
          dressingItems,
          others,
        };
        items = stateMap[type] || []; // Get the corresponding state array

        // Define title, color, and button text for each section type
        switch (type) {
          case "tablets":
            title = "Tablets";
            color = "blue";
            addItemButtonText = "Add Tablet";
            break;
          case "injections":
            title = "Injections";
            color = "purple";
            addItemButtonText = "Add Injection";
            break;
          case "syrups":
            title = "Syrups";
            color = "green";
            addItemButtonText = "Add Syrup";
            break;
          case "drops":
            title = "Drops";
            color = "teal";
            addItemButtonText = "Add Drop";
            break;
          case "creams":
            title = "Creams & Ointments";
            color = "orange";
            addItemButtonText = "Add Cream/Ointment";
            break;
          case "respules":
            title = "Respules";
            color = "cyan";
            addItemButtonText = "Add Respule";
            break;
          case "lotions":
            title = "Lotions";
            color = "pink";
            addItemButtonText = "Add Lotion";
            break;
          case "fluids":
            title = "Fluids";
            color = "indigo";
            addItemButtonText = "Add Fluid";
            break;
          case "powder":
            title = "Powders";
            color = "lime";
            addItemButtonText = "Add Powder";
            break;
          case "sutureProcedureItems":
            title = "Suture & Procedure Items";
            color = "gray";
            addItemButtonText = "Add Suture/Procedure Item";
            break;
          case "dressingItems":
            title = "Dressing Items";
            color = "gray";
            addItemButtonText = "Add Dressing Item";
            break;
          case "others":
            title = "Others";
            color = "gray";
            addItemButtonText = "Add Other Item";
            break;
          default:
            return null; // Should not happen with defined sectionOrder
        }

        // Map over the items array for the current type to create the rows
        const children = items.map((_, index) => (
          <div
            key={`${type}-${index}`}
            className={`grid gap-x-4 mb-3 items-start px-1`} // Added slight padding
            style={{ gridTemplateColumns: gridTemplateColumns[type] }}
          >
            {/* Render the input fields for this row */}
            {renderInputFields(type, items, index)}
            {/* Render the remove button column */}
            <div className="flex justify-center items-center h-full pt-1">
              {/* Show remove button only if doctor is allowed */}
              {isDoctor ? (
                <RemoveButton
                  onClick={removeRow}
                  type={type}
                  index={index}
                  disabled={!isDoctor} // Technically redundant, but good practice
                />
              ) : (
                // Placeholder to maintain grid alignment if remove button isn't shown
                <div className="w-8 h-8"></div>
              )}
            </div>
          </div>
        ));

        // Render the collapsible section container
        return (
          <React.Fragment key={type}>
            {" "}
            {renderSection(
              type,
              title,
              color,
              children,
              addItemButtonText
            )}{" "}
          </React.Fragment>
        );
      })}

      {/* Nurse Notes Section */}
      <section className="border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden bg-white">
        <h2
          className="text-lg font-semibold p-3 bg-yellow-50 border-b border-gray-200 text-yellow-700 flex justify-between items-center cursor-pointer hover:bg-yellow-100 transition-colors duration-150"
        >
          Nurse Notes
        </h2>
        <div className="p-4">
          <textarea
            placeholder="Enter nurse notes here..."
            value={nurseNotes}
            onChange={(e) => handleInputChange(e, "nurseNotes")}
            className="px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-vertical min-h-[80px]"
            disabled={!isNurse}
          />
        </div>
      </section>

      {/* Footer Action Buttons */}
      <div className="flex justify-end space-x-4 mt-8">
        {!isPharmacy && (
          <ActionButton onClick={handleGeneratePrescription} color="green">
            Generate Prescription
          </ActionButton>
        )}
        <ActionButton onClick={handleSubmit} color="blue">
          {condition ? "Update Prescription" : "Submit Prescription"}
        </ActionButton>
      </div>
    </div>
  );
};
export default Prescription;