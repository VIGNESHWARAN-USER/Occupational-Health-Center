import React, { useState, useEffect, useCallback } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { debounce } from "lodash"; // Import debounce (if not already imported)
import Sidebar from "../Sidebar";

function Viewprescription() {

  //  ---  Prescription Component code starts here  ---
  const PrescriptionComponent = ({ data }) => {
    const emp_no = data?.[0]?.emp_no;
    const existingPrescription = data?.[0]?.prescription;
    const prescriptionId = existingPrescription?.id;

    const [tablets, setTablets] = useState([]);
    const [syrups, setSyrups] = useState([]);
    const [injections, setInjections] = useState([]);
    const [creams, setCreams] = useState([]);
    const [drops, setDrops] = useState([]);
    const [fluids, setFluids] = useState([]);
    const [others, setOthers] = useState([]);
    const [submittedBy, setSubmittedBy] = useState('SK');
    const [issuedby, setIssuedby] = useState('Nurse');
    const [nurseNotes, setNurseNotes] = useState('');

    // Suggestion states - same as AddStock
    const [brandSuggestions, setBrandSuggestions] = useState({});  // Object to hold brand suggestions for each row
    const [chemicalSuggestions, setChemicalSuggestions] = useState({}); // Object to hold chemical suggestions for each row
    const [doseSuggestions, setDoseSuggestions] = useState({}); // Object to hold dose suggestions for each row
    const [showBrandSuggestions, setShowBrandSuggestions] = useState({});  // Object to control visibility
    const [showChemicalSuggestions, setShowChemicalSuggestions] = useState({}); // Object to control visibility
    const [showDoseSuggestions, setShowDoseSuggestions] = useState({}); // Object to control visibility
    const [medicineForm, setMedicineForm] = useState('');
    const [doseManuallyEntered, setDoseManuallyEntered] = useState({});

    const medicineForms = {
      tablets: 'Tablet',
      syrups: 'Syrup',
      injections: 'Injection',
      creams: 'Creams',
      drops: 'Drops',
      fluids: 'Fluids',
      others: 'Other',
    };

    const timingOptions = ["FN", "AN", "N", "Stat"];
    const foodOptions = ["BF", "AF", "WF"];
    const accessLevel = localStorage.getItem('accessLevel');
    const isDoctor = accessLevel === 'doctor';
    const isNurse = accessLevel === 'nurse';

    const getDefaultRow = useCallback((type) => {
      switch (type) {
        case 'tablets': return { drugName: '', brandName: '', doseVolume: '', qty: '', timing: '', food: '', days: '', comments: '', issuedIn: '', issuedOut: '', prescriptionOut: '' };
        case 'syrups': return { drugName: '', brandName: '', doseVolume: '', serving: '', timing: '', food: '', days: '', issuedIn: '', issuedOut: '', prescriptionOut: '' };
        case 'injections': return { drugName: '', brandName: '', doseVolume: '', qty: '', issuedIn: '', issuedOut: '', prescriptionOut: '' };
        case 'creams': return { drugName: '', brandName: '', doseVolume: '', qty: '', issuedIn: '', issuedOut: '', prescriptionOut: '' };
        case 'drops': return { dropName: '', brandName: '', doseVolume: '', numberOfTimes: '', hourGap: '', issuedIn: '', issuedOut: '', prescriptionOut: '' };
        case 'fluids': return { fluidsName: '', brandName: '', doseVolume: '', qty: '', issuedIn: '', issuedOut: '', prescriptionOut: '' };
        case 'others': return { drugName: '', brandName: '', doseVolume: '', qty: '', issuedIn: '', issuedOut: '', prescriptionOut: '' };
        default: return {};
      }
    }, []);

    useEffect(() => {
      if (emp_no && existingPrescription) {  // Check emp_no before accessing existingPrescription
        // Load existing prescription data
        const { tablets, syrups, injections, creams, drops, fluids, others, submitted_by, issued_by, nurse_notes } = existingPrescription;

        setTablets(tablets?.length ? tablets : [getDefaultRow('tablets')]);
        setSyrups(syrups?.length ? syrups : [getDefaultRow('syrups')]);
        setInjections(injections?.length ? injections : [getDefaultRow('injections')]);
        setCreams(creams?.length ? creams : [getDefaultRow('creams')]);
        setDrops(drops?.length ? drops : [getDefaultRow('drops')]);
        setFluids(fluids?.length ? fluids : [getDefaultRow('fluids')]);
        setOthers(others?.length ? others : [getDefaultRow('others')]);

        setSubmittedBy(submitted_by || 'SK');
        setIssuedby(issued_by || 'Nurse');
        setNurseNotes(nurse_notes || '');
      } else if (emp_no) {
        // Initialize with default rows only if emp_no is available
        setTablets([getDefaultRow('tablets')]);
        setSyrups([getDefaultRow('syrups')]);
        setInjections([getDefaultRow('injections')]);
        setCreams([getDefaultRow('creams')]);
        setDrops([getDefaultRow('drops')]);
        setFluids([getDefaultRow('fluids')]);
        setOthers([getDefaultRow('others')]);
        setSubmittedBy('SK');
        setIssuedby('Nurse');
        setNurseNotes('');
      }
    }, [emp_no, existingPrescription, getDefaultRow]); // Add emp_no as a dependency

    if (!emp_no) {
      return <div className="p-6 text-center text-gray-500">Please select an employee to view or create a prescription.</div>;
    }

    const addRow = (type) => {
      if (!isDoctor) return;
      const newRow = getDefaultRow(type); // Get a default row for the specific type
      switch (type) {
        case 'tablets': setTablets(prev => [...prev, newRow]); break;
        case 'syrups': setSyrups(prev => [...prev, newRow]); break;
        case 'injections': setInjections(prev => [...prev, newRow]); break;
        case 'creams': setCreams(prev => [...prev, newRow]); break;
        case 'drops': setDrops(prev => [...prev, newRow]); break;
        case 'fluids': setFluids(prev => [...prev, newRow]); break;
        case 'others': setOthers(prev => [...prev, newRow]); break;
        default: break;
      }
    };

    // ---  AddStock Suggestion Logic  ---
    const fetchBrandSuggestions = useCallback(debounce(async (chemicalName, medicineForm, type, index) => {
      if (chemicalName.length < 3 || !medicineForm) {
        setBrandSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: [] } }));
        setShowBrandSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
        return;
      }

      try {
        const response = await axios.get(`https://occupational-health-center-1.onrender.com/get-brand-names/?chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
        setBrandSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: response.data.suggestions } }));
        setShowBrandSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: true } }));
      } catch (error) {
        console.error("Error fetching brand name suggestions:", error);
      }
    }, 500), []);

    const fetchChemicalSuggestions = useCallback(debounce(async (brandName, medicineForm, type, index) => {
      if (brandName.length < 3 || !medicineForm) {
        setChemicalSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: [] } }));
        setShowChemicalSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: false } }));
        return;
      }

      try {
        const response = await axios.get(`https://occupational-health-center-1.onrender.com/get-chemical-name-by-brand/?brand_name=${brandName}&medicine_form=${medicineForm}`);
        setChemicalSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: response.data.suggestions } }));
        setShowChemicalSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: true } }));
      } catch (error) {
        console.error("Error fetching chemical name suggestions:", error);
      }
    }, 500), []);

    const fetchDoseSuggestions = useCallback(debounce(async (brandName, chemicalName, medicineForm, type, index) => {
      if (!brandName || !chemicalName || !medicineForm) return;

      try {
        const response = await axios.get(`https://occupational-health-center-1.onrender.com/get-dose-volume/?brand_name=${brandName}&chemical_name=${chemicalName}&medicine_form=${medicineForm}`);
        setDoseSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: response.data.suggestions } }));
        setShowDoseSuggestions(prev => ({ ...prev, [type]: { ...prev[type], [index]: response.data.suggestions.length > 1 } }));

        // Auto-fill the dose if there's only one suggestion and the dose wasn't manually entered
        if (response.data.suggestions.length === 1 && !doseManuallyEntered?.[type]?.[index]) {
          updateRowState(type, index, 'doseVolume', response.data.suggestions[0]);
        }
      } catch (error) {
        console.error("Error fetching dose suggestions:", error);
      }
    }, 500), []);
    const handleDoseSuggestionClick = (suggestion, type, index) => {
      setDoseManuallyEntered(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [index]: false, // Reset manual entry flag
        },
      }));
      updateRowState(type, index, 'doseVolume', suggestion);
      setShowDoseSuggestions(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [index]: false, // Explicitly hide dose suggestions
        },
      }));
    };

    const updateRowState = (type, index, field, value) => {
      switch (type) {
        case 'tablets': setTablets(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item)); break;
        case 'syrups': setSyrups(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item)); break;
        case 'injections': setInjections(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item)); break;
        case 'creams': setCreams(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item)); break;
        case 'drops': setDrops(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item)); break;
        case 'fluids': setFluids(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item)); break;
        case 'others': setOthers(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item)); break;
        default: break;
      }
    };

    const handleInputChange = (e, type, index, field) => {
      if ((type === 'nurseNotes' && !isNurse) || (type !== 'nurseNotes' && !isDoctor)) return;

      const { value } = e.target;

      // Set dose manually entered flag
      if (field === 'doseVolume') {
        setDoseManuallyEntered(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            [index]: true,
          },
        }));
      }

      const updateState = (prevState) => {
        return prevState.map((item, i) => i === index ? { ...item, [field]: value } : item);
      };

      const medicineFormValue = medicineForms[type];
      setMedicineForm(medicineFormValue);

      switch (type) {
        case 'tablets': setTablets(prev => updateState(prev)); break;
        case 'syrups': setSyrups(prev => updateState(prev)); break;
        case 'injections': setInjections(prev => updateState(prev)); break;
        case 'creams': setCreams(prev => updateState(prev)); break;
        case 'drops': setDrops(prev => updateState(prev)); break;
        case 'fluids': setFluids(prev => updateState(prev)); break;
        case 'others': setOthers(prev => updateState(prev)); break;
        case 'nurseNotes': setNurseNotes(value); break;
        default: break;
      }

      // Trigger suggestions - use AddStock logic
      if (field === 'drugName') {
        fetchBrandSuggestions(value, medicineFormValue, type, index);
      } else if (field === 'brandName') {
        fetchChemicalSuggestions(value, medicineFormValue, type, index);
        fetchDoseSuggestions(value, item.drugName, medicineFormValue, type, index);  // drugName == chemicalName
      }
      else if (field === 'drugName') {
        fetchBrandSuggestions(value, medicineForm, type, index);
      } else if (field === 'brandName') {
        fetchChemicalSuggestions(value, medicineForm, type, index);
        fetchDoseSuggestions(value, item.drugName, medicineForm, type, index); // Use item.drugName
      }
    };

    const removeRow = (type, index) => {
      if (!isDoctor) return;
      const currentState = { tablets, syrups, injections, creams, drops, fluids, others };
      const stateArray = currentState[type];
      if (stateArray && stateArray.length > 1) {
        const newState = stateArray.filter((_, i) => i !== index);
        switch (type) {
          case 'tablets': setTablets(newState); break;
          case 'syrups': setSyrups(newState); break;
          case 'injections': setInjections(newState); break;
          case 'creams': setCreams(newState); break;
          case 'drops': setDrops(newState); break;
          case 'fluids': setFluids(newState); break;
          case 'others': setOthers(newState); break;
          default: break;
        }
      }
    };

    const handleSuggestionClick = (suggestion, type, index, field) => {
      updateRowState(type, index, field, suggestion);
      // Hide the specific suggestion list after a selection
      if (field === 'brandName') {
        setShowBrandSuggestions(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            [index]: false,
          },
        }));
        // After brand name is selected, fetch chemical and dose suggestions
        let item;
        switch (type) {
          case 'tablets': item = tablets[index]; break;
          case 'syrups': item = syrups[index]; break;
          case 'injections': item = injections[index]; break;
          case 'creams': item = creams[index]; break;
          case 'drops': item = drops[index]; break;
          case 'fluids': item = fluids[index]; break;
          case 'others': item = others[index]; break;
          default: item = {}; break;
        }
        fetchChemicalSuggestions(suggestion, medicineForm, type, index);
        fetchDoseSuggestions(suggestion, item.drugName, medicineForm, type, index);

      } else if (field === 'drugName') {
        setShowChemicalSuggestions(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            [index]: false,
          },
        }));
        // After drug name is selected, fetch brand suggestions
        fetchBrandSuggestions(suggestion, medicineForm, type, index);
      }
    };

    const renderSuggestions = (type, index, field) => {
      let suggestions = [];
      let showSuggestions = false;

      if (field === 'brandName') {
        suggestions = brandSuggestions?.[type]?.[index] || [];
        showSuggestions = showBrandSuggestions?.[type]?.[index] || false;
      } else if (field === 'drugName') {
        suggestions = chemicalSuggestions?.[type]?.[index] || [];
        showSuggestions = showChemicalSuggestions?.[type]?.[index] || false;
      }

      if (showSuggestions && suggestions.length > 0) {
        return (
          <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md mt-1 w-full">
            {suggestions.map((suggestion, i) => (
              <div
                key={i}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion, type, index, field)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        );
      }
      return null;
    };
    const renderDoseVolumeSuggestions = (type, index) => {
      const suggestions = doseSuggestions?.[type]?.[index] || [];
      const showSuggestions = showDoseSuggestions?.[type]?.[index] || false;

      if (showSuggestions && suggestions.length > 0) {
        return (
          <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md mt-1 w-full">
            {suggestions.map((suggestion, i) => (
              <div
                key={i}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleDoseSuggestionClick(suggestion, type, index)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        );
      }
      return null;
    };

    const renderInputFields = (type, items, index) => {
      const item = items[index];
      const isDisabled = !isDoctor;
      const inputBaseClass = `px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white focus:ring-blue-500`;
      const selectBaseClass = `px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white focus:ring-blue-500`;
      const textareaBaseClass = `px-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-white focus:ring-blue-500 resize-none`;
      const disabledClass = 'bg-gray-100 cursor-not-allowed';

      const sharedFields = (
        <>
          <div className="relative">
            <input
              type="text"
              placeholder="Brand Name"
              value={item.brandName}
              onChange={(e) => handleInputChange(e, type, index, 'brandName')}
              className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`}
              disabled={isDisabled}
            />
            {renderSuggestions(type, index, 'brandName')}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Dose Volume"
              value={item.doseVolume}
              onChange={(e) => handleInputChange(e, type, index, 'doseVolume')}
              className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`}
              disabled={isDisabled}
            />
            {renderDoseVolumeSuggestions(type, index)}
          </div>
        </>
      );

      switch (type) {
        case 'tablets':
          return (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Chemical Name"
                  value={item.drugName}
                  onChange={(e) => handleInputChange(e, type, index, 'drugName')}
                  className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`}
                  disabled={isDisabled}
                />
                {renderSuggestions(type, index, 'drugName')}
              </div>
              {sharedFields}
              <input type="text" placeholder="Qty" value={item.qty} onChange={(e) => handleInputChange(e, type, index, 'qty')} className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} />
              <select value={item.timing} onChange={(e) => handleInputChange(e, type, index, 'timing')} className={`${selectBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled}>
                <option value="">Timing</option> {timingOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <select value={item.food} onChange={(e) => handleInputChange(e, type, index, 'food')} className={`${selectBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled}>
                <option value="">Food</option> {foodOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <input type="text" placeholder="Days" value={item.days} onChange={(e) => handleInputChange(e, type, index, 'days')} className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} />
              <input type="text" placeholder="Comments" value={item.comments} onChange={(e) => handleInputChange(e, type, index, 'comments')} className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} />
              <textarea placeholder="Issued In" value={item.issuedIn} onChange={(e) => handleInputChange(e, type, index, 'issuedIn')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Issued Out" value={item.issuedOut} onChange={(e) => handleInputChange(e, type, index, 'issuedOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Prescription Out" value={item.prescriptionOut} onChange={(e) => handleInputChange(e, type, index, 'prescriptionOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
            </>
          );
        case 'syrups':
          return (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Syrup Name"
                  value={item.drugName}
                  onChange={(e) => handleInputChange(e, type, index, 'drugName')}
                  className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`}
                  disabled={isDisabled}
                />
                {renderSuggestions(type, index, 'drugName')}
              </div>
              {sharedFields}
              <input type="text" placeholder="Serving (e.g., 5ml)" value={item.serving} onChange={(e) => handleInputChange(e, type, index, 'serving')} className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} />
              <select value={item.timing} onChange={(e) => handleInputChange(e, type, index, 'timing')} className={`${selectBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled}>
                <option value="">Timing</option> {timingOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <select value={item.food} onChange={(e) => handleInputChange(e, type, index, 'food')} className={`${selectBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled}>
                <option value="">Food</option> {foodOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <input type="text" placeholder="Days" value={item.days} onChange={(e) => handleInputChange(e, type, index, 'days')} className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} />
              <textarea placeholder="Issued In" value={item.issuedIn} onChange={(e) => handleInputChange(e, type, index, 'issuedIn')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Issued Out" value={item.issuedOut} onChange={(e) => handleInputChange(e, type, index, 'issuedOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Prescription Out" value={item.prescriptionOut} onChange={(e) => handleInputChange(e, type, index, 'prescriptionOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
            </>
          );
        case 'injections':
          return (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Injection Name"
                  value={item.drugName}
                  onChange={(e) => handleInputChange(e, type, index, 'drugName')}
                  className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`}
                  disabled={isDisabled}
                />
                {renderSuggestions(type, index, 'drugName')}
              </div>
              {sharedFields}
              <input type="text" placeholder="Qty / Dose" value={item.qty} onChange={(e) => handleInputChange(e, type, index, 'qty')} className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} />
              <textarea placeholder="Issued In" value={item.issuedIn} onChange={(e) => handleInputChange(e, type, index, 'issuedIn')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Issued Out" value={item.issuedOut} onChange={(e) => handleInputChange(e, type, index, 'issuedOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Prescription Out" value={item.prescriptionOut} onChange={(e) => handleInputChange(e, type, index, 'prescriptionOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
            </>
          );
        case 'creams':
          return (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cream/Ointment Name"
                  value={item.drugName}
                  onChange={(e) => handleInputChange(e, type, index, 'drugName')}
                  className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`}
                  disabled={isDisabled}
                />
                {renderSuggestions(type, index, 'drugName')}
              </div>
              {sharedFields}
              <input type="text" placeholder="Qty / Application" value={item.qty} onChange={(e) => handleInputChange(e, type, index, 'qty')} className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} />
              <textarea placeholder="Issued In" value={item.issuedIn} onChange={(e) => handleInputChange(e, type, index, 'issuedIn')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Issued Out" value={item.issuedOut} onChange={(e) => handleInputChange(e, type, index, 'issuedOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Prescription Out" value={item.prescriptionOut} onChange={(e) => handleInputChange(e, type, index, 'prescriptionOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
            </>
          );
        case 'drops':
          return (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Drop Name"
                  value={item.dropName}
                  onChange={(e) => handleInputChange(e, type, index, 'dropName')}
                  className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`}
                  disabled={isDisabled}
                />
                {renderSuggestions(type, index, 'drugName')}
              </div>
              {sharedFields}
              <input type="text" placeholder="# Times / Day" value={item.numberOfTimes} onChange={(e) => handleInputChange(e, type, index, 'numberOfTimes')} className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} />
              <input type="text" placeholder="Hour Gap (e.g., 4h)" value={item.hourGap} onChange={(e) => handleInputChange(e, type, index, 'hourGap')} className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} />
              <textarea placeholder="Issued In" value={item.issuedIn} onChange={(e) => handleInputChange(e, type, index, 'issuedIn')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Issued Out" value={item.issuedOut} onChange={(e) => handleInputChange(e, type, index, 'issuedOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Prescription Out" value={item.prescriptionOut} onChange={(e) => handleInputChange(e, index, 'prescriptionOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
            </>
          );
        case 'fluids':
          return (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Fluid Name"
                  value={item.fluidsName}
                  onChange={(e) => handleInputChange(e, type, index, 'fluidsName')}
                  className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`}
                  disabled={isDisabled}
                />
                {renderSuggestions(type, index, 'drugName')}
              </div>
              {sharedFields}
              <input type="text" placeholder="Qty / Rate" value={item.qty} onChange={(e) => handleInputChange(e, type, index, 'qty')} className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} />
              <textarea placeholder="Issued In" value={item.issuedIn} onChange={(e) => handleInputChange(e, type, index, 'issuedIn')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Issued Out" value={item.issuedOut} onChange={(e) => handleInputChange(e, type, index, 'issuedOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Prescription Out" value={item.prescriptionOut} onChange={(e) => handleInputChange(e, type, index, 'prescriptionOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
            </>
          );
        case 'others':
          return (
            <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={item.drugName}
                  onChange={(e) => handleInputChange(e, type, index, 'drugName')}
                  className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`}
                  disabled={isDisabled}
                />
                {renderSuggestions(type, index, 'drugName')}
              </div>
              {sharedFields}
              <input type="text" placeholder="Qty / Instructions" value={item.qty} onChange={(e) => handleInputChange(e, type, index, 'qty')} className={`${inputBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} />
              <textarea placeholder="Issued In" value={item.issuedIn} onChange={(e) => handleInputChange(e, type, index, 'issuedIn')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Issued Out" value={item.issuedOut} onChange={(e) => handleInputChange(e, type, index, 'issuedOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
              <textarea placeholder="Prescription Out" value={item.prescriptionOut} onChange={(e) => handleInputChange(e, type, index, 'prescriptionOut')} className={`${textareaBaseClass} ${isDisabled ? disabledClass : ''}`} disabled={isDisabled} rows="1" />
            </>
          );
        default:
          return null;
      }
    };

    const filterEmptyRows = (items, keyField) => {
      if (!items || items.length === 0) return [];
      return items.filter(item => item && typeof item[keyField] === 'string' && item[keyField].trim() !== '');
    };

    const handleSubmit = async () => {
      const finalTablets = filterEmptyRows(tablets, 'drugName');
      const finalSyrups = filterEmptyRows(syrups, 'drugName');
      const finalInjections = filterEmptyRows(injections, 'drugName');
      const finalCreams = filterEmptyRows(creams, 'drugName');
      const finalDrops = filterEmptyRows(drops, 'dropName');
      const finalFluids = filterEmptyRows(fluids, 'fluidsName');
      const finalOthers = filterEmptyRows(others, 'drugName');

      if (isDoctor && finalTablets.length === 0 && finalSyrups.length === 0 && finalInjections.length === 0 && finalCreams.length === 0 && finalDrops.length === 0 && finalFluids.length === 0 && finalOthers.length === 0) {
        alert('Please add at least one medication item before submitting.');
        return;
      }

      const prescriptionData = {
        emp_no,
        tablets: finalTablets,
        syrups: finalSyrups,
        injections: finalInjections,
        creams: finalCreams,
        drops: finalDrops,
        fluids: finalFluids,
        others: finalOthers,
        submitted_by: submittedBy,
        issued_by: issuedby,
        nurse_notes: nurseNotes,
      };

      if (prescriptionId) {
        prescriptionData.id = prescriptionId;
      }

      try {
        const url = prescriptionId
          ? `https://occupational-health-center-1.onrender.com/prescriptions/${prescriptionId}/`
          : 'https://occupational-health-center-1.onrender.com/prescriptions/';
        const method = prescriptionId ? 'put' : 'post';

        console.log(`Submitting ${method.toUpperCase()} request to ${url} with data:`, prescriptionData);

        const response = await axios[method](url, prescriptionData, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('Prescription data submission successful:', response.data);
        alert(`Prescription ${prescriptionId ? 'updated' : 'submitted'} successfully!`);
        // No longer clearing all fields - this prevents unintentional data loss
      } catch (error) {
        console.error('Error submitting prescription data:', error.response ? error.response.data : error.message);
        let errorMsg = 'Error submitting prescription data. Please try again.';
        if (error.response && error.response.data) {
          errorMsg += ` Server responded with: ${JSON.stringify(error.response.data)}`;
        } else {
          errorMsg += ` Message: ${error.message}`;
        }
        alert(errorMsg);
      }
    };

    const handleGeneratePrescription = () => {
      console.log("Generating prescription view with current data:", {
        emp_no, tablets, syrups, injections, creams, drops, fluids, others, nurseNotes, submittedBy, issuedby
      });
      alert("Prescription 'Generate View' button clicked. See console for data. Implement actual generation logic.");
    };

    const ActionButton = ({ onClick, disabled, children, color = 'blue', title = '' }) => (
      <button
        type="button"
        onClick={onClick}
        className={`bg-${color}-500 hover:bg-${color}-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={disabled}
        title={title}
      >
        {children}
      </button>
    );

    const RemoveButton = ({ onClick, disabled, type, index }) => (
      <button
        type="button"
        onClick={() => onClick(type, index)}
        className={`bg-red-500 hover:bg-red-700 text-white font-bold py1 px-2 rounded w-8 h-8 flex items-center justify-center transition duration-150 ease-in-out ${!isDoctor ? 'cursor-not-allowed opacity-50' : ''}`}
        disabled={!isDoctor}
        title={`Remove ${type.slice(0, -1)} Row`}
      >
        <FaTrash size={12} />
      </button>
    );

    const gridTemplateColumns = {
      tablets: 'repeat(11, minmax(100px, 1fr))',
      syrups: 'repeat(10, minmax(100px, 1fr))',
      injections: 'repeat(7, minmax(100px, 1fr))',
      creams: 'repeat(7, minmax(100px, 1fr))',
      drops: 'repeat(8, minmax(100px, 1fr))',
      fluids: 'repeat(7, minmax(100px, 1fr))',
      others: 'repeat(7, minmax(100px, 1fr))',
    };

    // HandleChange within the PrescriptionComponent
    const handlePrescriptionChange = (e, type, index, field) => {
      handleInputChange(e, type, index, field); // Use the existing handleInputChange
    };

    return (
      <div className="bg-white min-h-screen p-4 md:p-6 space-y-6">
        <h1 className="text-xl md:text-2xl font-bold">
          Prescription
        </h1>

        {/* Tablets Section */}
        <section className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-blue-700">Tablets</h2>
          <div className="overflow-x-auto">
            <div className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.tablets }}>
              {/* Headers for Tablets */}
              <div>Chemical Name</div>
              <div>Brand</div>
              <div>Dose</div>
              <div>Qty</div>
              <div>Timing</div>
              <div>Food</div>
              <div>Days</div>
              <div>Comments</div>
              <div>Issued In</div>
              <div>Issued Out</div>
              <div>Prescription Out</div>
              <div></div>
            </div>
            {tablets.map((_, index) => (
              <div key={`tablet-${index}`} className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.tablets }}>
                {renderInputFields('tablets', tablets, index)}
                {isDoctor && tablets.length > 1 ? <RemoveButton onClick={removeRow} type="tablets" index={index} /> : <div className="w-8 h-8"></div>}
              </div>
            ))}
          </div>
          <ActionButton onClick={() => addRow('tablets')} disabled={!isDoctor} color="blue">Add Tablet</ActionButton>
        </section>

        {/* Syrups Section */}
        <section className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-green-700">Syrups</h2>
          <div className="overflow-x-auto">
            <div className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.syrups }}>
              {/* Headers for Syrups */}
              <div>Chemical Name</div>
              <div>Brand</div>
              <div>Dose</div>
              <div>Serving</div>
              <div>Timing</div>
              <div>Food</div>
              <div>Days</div>
              <div>Issued In</div>
              <div>Issued Out</div>
              <div>Prescription Out</div>
              <div></div>
            </div>
            {syrups.map((_, index) => (
              <div key={`syrup-${index}`} className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.syrups }}>
                {renderInputFields('syrups', syrups, index)}
                {isDoctor && syrups.length > 1 ? <RemoveButton onClick={removeRow} type="syrups" index={index} /> : <div className="w-8 h-8"></div>}
              </div>
            ))}
          </div>
          <ActionButton onClick={() => addRow('syrups')} disabled={!isDoctor} color="green">Add Syrup</ActionButton>
        </section>

        {/* Injections Section */}
        <section className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-purple-700">Injections</h2>
          <div className="overflow-x-auto">
            <div className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.injections }}>
              {/* Headers for Injections */}
              <div>Chemical Name</div>
              <div>Brand</div>
              <div>Dose</div>
              <div>Qty/Dose</div>
              <div>Issued In</div>
              <div>Issued Out</div>
              <div>Prescription Out</div>
              <div></div>
            </div>
            {injections.map((_, index) => (
              <div key={`injection-${index}`} className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.injections }}>
                {renderInputFields('injections', injections, index)}
                {isDoctor && injections.length > 1 ? <RemoveButton onClick={removeRow} type="injections" index={index} /> : <div className="w-8 h-8"></div>}
              </div>
            ))}
          </div>
          <ActionButton onClick={() => addRow('injections')} disabled={!isDoctor} color="purple">Add Injection</ActionButton>
        </section>

        {/* Creams Section */}
        <section className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-orange-700">Creams/Ointments</h2>
          <div className="overflow-x-auto">
            <div className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.creams }}>
              {/* Headers for Creams */}
              <div>Chemical Name</div>
              <div>Brand</div>
              <div>Dose</div>
              <div>Qty</div>
              <div>Issued In</div>
              <div>Issued Out</div>
              <div>Prescription Out</div>
              <div></div>
            </div>
            {creams.map((_, index) => (
              <div key={`cream-${index}`} className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.creams }}>
                {renderInputFields('creams', creams, index)}
                {isDoctor && creams.length > 1 ? <RemoveButton onClick={removeRow} type="creams" index={index} /> : <div className="w-8 h-8"></div>}
              </div>
            ))}
          </div>
          <ActionButton onClick={() => addRow('creams')} disabled={!isDoctor} color="orange">Add Cream</ActionButton>
        </section>

        {/* Drops Section */}
        <section className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-indigo-700">Drops</h2>
          <div className="overflow-x-auto">
            <div className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.drops }}>
              {/* Headers for Drops */}
              <div>Chemical Name</div>
              <div>Brand</div>
              <div>Dose</div>
              <div>Times/Day</div>
              <div>Hour Gap</div>
              <div>Issued In</div>
              <div>Issued Out</div>
              <div>Prescription Out</div>
              <div></div>
            </div>
            {drops.map((_, index) => (
              <div key={`drop-${index}`} className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.drops }}>
                {renderInputFields('drops', drops, index)}
                {isDoctor && drops.length > 1 ? <RemoveButton onClick={removeRow} type="drops" index={index} /> : <div className="w-8 h-8"></div>}
              </div>
            ))}
          </div>
          <ActionButton onClick={() => addRow('drops')} disabled={!isDoctor} color="indigo">Add Drop</ActionButton>
        </section>

        {/* Fluids Section */}
        <section className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-cyan-700">Fluids</h2>
          <div className="overflow-x-auto">
            <div className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.fluids }}>
              {/* Headers for Fluids */}
              <div>Chemical Name</div>
              <div>Brand</div>
              <div>Dose</div>
              <div>Qty/Rate</div>
              <div>Issued In</div>
              <div>Issued Out</div>
              <div>Prescription Out</div>
              <div></div>
            </div>
            {fluids.map((_, index) => (
              <div key={`fluid-${index}`} className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.fluids }}>
                {renderInputFields('fluids', fluids, index)}
                {isDoctor && fluids.length > 1 ? <RemoveButton onClick={removeRow} type="fluids" index={index} /> : <div className="w-8 h-8"></div>}
              </div>
            ))}
          </div>
          <ActionButton onClick={() => addRow('fluids')} disabled={!isDoctor} color="blue">Add Fluid</ActionButton>
        </section>

        {/* Others Section */}
        <section className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Others</h2>
          <div className="overflow-x-auto">
            <div className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.others }}>
              {/* Headers for Others */}
              <div>Chemical Name</div>
              <div>Brand</div>
              <div>Dose</div>
              <div>Qty</div>
              <div>Issued In</div>
              <div>Issued Out</div>
              <div>Prescription Out</div>
              <div></div>
            </div>
            {others.map((_, index) => (
              <div key={`other-${index}`} className={`grid gap-3 mb-3 items-center`} style={{ gridTemplateColumns: gridTemplateColumns.others }}>
                {renderInputFields('others', others, index)}
                {isDoctor && others.length > 1 ? <RemoveButton onClick={removeRow} type="others" index={index} /> : <div className="w-8 h-8"></div>}
              </div>
            ))}
          </div>
          <ActionButton onClick={() => addRow('others')} disabled={!isDoctor} color="gray">Add Other</ActionButton>
        </section>

        {/* Nurse Notes Section */}
        <section className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-teal-700">Nurse Notes</h2>
          <textarea
            value={nurseNotes}
            onChange={(e) => handleInputChange(e, 'nurseNotes', null, 'nurseNotes')}
            className={`px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${!isNurse ? 'bg-gray-100 cursor-not-allowed' : 'bg-teal-50'}`}
            rows="4"
            placeholder={isNurse ? "Enter relevant notes..." : "(Read-only)"}
            disabled={!isNurse}
          />
        </section>

        {/* Submission Info & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 border-t pt-6 gap-4">
          {/* Left Side: Submitted By / Issued By */}
          <div className="flex flex-col sm:flex-row sm:space-x-6 w-full sm:w-auto">
            <div className="mb-3 sm:mb-0">
              <label htmlFor="submittedBy" className="block text-sm font-medium text-gray-700 mb-1">Prescribed By:</label>
              <select
                id="submittedBy"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
                className={`px-3 py-2 w-full sm:w-auto rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isDoctor ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                disabled={!isDoctor}
              >
                <option value="SK">SK</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>
            <div>
              <label htmlFor="issuedby" className="block text-sm font-medium text-gray-700 mb-1">Drugs Issued By:</label>
              <select
                id="issuedby"
                value={issuedby}
                onChange={(e) => setIssuedby(e.target.value)}
                className={`px-3 py-2 w-full sm:w-auto rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isNurse ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                disabled={!isNurse}
              >
                <option value="Nurse">Nurse</option>
              </select>
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex space-x-3 w-full sm:w-auto justify-end">
            <ActionButton onClick={handleGeneratePrescription} color="gray">
              Generate View
            </ActionButton>
            <ActionButton onClick={handleSubmit} disabled={!isDoctor} color="blue">
              {prescriptionId ? 'Update Prescription' : 'Submit Prescription'}
            </ActionButton>
          </div>
        </div>
      </div>
    );
  };

  //  ---  Prescription Component code ends here  ---

    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPrescriptionData, setSelectedPrescriptionData] = useState(null); // State to hold the selected prescription's *full* data
    const [isUpdating, setIsUpdating] = useState(false); // State to control whether we are in update mode

    useEffect(() => {
        const fetchPrescriptions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('https://occupational-health-center-1.onrender.com/prescriptions/view/');
                setPrescriptions(response.data.prescriptions);
            } catch (err) {
                setError(err);
                console.error('Error fetching prescriptions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrescriptions();
    }, []);

    const handleInitiate = async (prescriptionId) => {
        try {
            const response = await axios.get(`https://occupational-health-center-1.onrender.com/prescriptions/${prescriptionId}`);  // Get the full prescription data

            setSelectedPrescriptionData([response.data]); // Set state with *full* prescription data, wrapped in an array
            setIsUpdating(true); // Enable update mode by default

            console.log('Selected Prescription Data:', response.data);  // Log the data
        } catch (error) {
            console.error('Error fetching prescription details:', error);
            setError(error);
        }
    };


    const handleIssue = (prescriptionId) => {
        // Implement your "Issue" logic here (e.g., API call to mark as issued)
        console.log(`Issuing prescription with ID: ${prescriptionId}`);
    };

    const handleUpdate = async () => {
        try {
            // Send a PUT or PATCH request to update the prescription on the backend
            await axios.put(`https://occupational-health-center-1.onrender.com/prescriptions/${selectedPrescriptionData[0].id}`, selectedPrescriptionData[0]); // Ensure your API supports PUT/PATCH
            // Assuming your API returns the updated prescription on success:
            // setPrescriptions(prescriptions.map(p => (p.id === selectedPrescription.id ? selectedPrescription : p))); // Update the prescriptions array in the state

            //or
            const response = await axios.get('https://occupational-health-center-1.onrender.com/prescriptions/view/');
            setPrescriptions(response.data.prescriptions);

            setSelectedPrescriptionData(null); // Clear the selected prescription state
            setIsUpdating(false);
            console.log('Prescription updated successfully!');

        } catch (error) {
            console.error('Error updating prescription:', error);
            setError(error);
        }
    };

    // Modified HandleChange to pass to PrescriptionComponent
    const handleChange = (e, type, index, field) => {
      setSelectedPrescriptionData(prevState => {
        const { name, value } = e.target; // Destructure name and value from the event target
        const updatedData = [...prevState]; // Create a copy of the array

        // Directly update the specific field in the first element's data
        updatedData[0] = {
          ...updatedData[0],
          [name]: value // Assuming 'name' matches the backend's expected field names
        };
        return updatedData;
      });
    };


    const handleCancel = () => {
        setSelectedPrescriptionData(null);
        setIsUpdating(false);
    };

    if (loading) {
        return <div className="text-center py-4">Loading prescriptions...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-4">
                <h1 className="text-2xl font-semibold mb-4">View Prescriptions</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b text-left" style={{ width: '50px' }}>S.ID</th>
                                <th className="py-2 px-4 border-b text-left" style={{ width: '100px' }}>Emp No</th>
                                <th className="py-2 px-4 border-b text-left" style={{ width: '200px' }}>Name</th>
                                <th className="py-2 px-4 border-b text-left" style={{ width: '150px' }}>Generated At</th>
                                <th className="py-2 px-4 border-b text-left" style={{ width: '100px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptions.map((prescription) => (
                                <tr key={prescription.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b" style={{ width: '50px' }}>{prescription.id}</td>
                                    <td className="py-2 px-4 border-b" style={{ width: '100px' }}>{prescription.emp_no}</td>
                                    <td className="py-2 px-4 border-b" style={{ width: '200px' }}>{prescription.name}</td>
                                    <td className="py-2 px-4 border-b" style={{ width: '150px' }}>{prescription.entry_date}</td>
                                    <td className="py-2 px-4 border-b" style={{ width: '100px' }}>
                                        {prescription.status === 0 ? (
                                            <button
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                onClick={() => handleInitiate(prescription.id)}
                                            >
                                                Initiate
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                onClick={() => handleIssue(prescription.id)}
                                            >
                                                Issue
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {selectedPrescriptionData && (
                    <div>
                        <PrescriptionComponent data={selectedPrescriptionData}/>
                         {isUpdating ? (
                            <div>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                    onClick={handleUpdate}
                                >
                                    Update
                                </button>
                                <button
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => handleIssue(selectedPrescriptionData[0].id)}
                            >
                                Issue
                            </button>
                        )}

                    </div>

                )}
            </div>
        </div>
    );
}

export default Viewprescription;