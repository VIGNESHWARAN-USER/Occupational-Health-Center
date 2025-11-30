import Sidebar from '../Sidebar';
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { useLocation } from 'react-router-dom'
import axios from 'axios';
import BasicDetails from './NewVisitProf/BasicDetails';
import Vitals from './NewVisitProf/Vitals';
import MedicalHistory from './NewVisitProf/MedicalHistory'
import Fitness from './NewVisitProf/Fitness'
import Vaccination from './NewVisitProf/Vaccination'
import ConsultationDisplay from './NewVisitProf/Consultation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Summary = () => {
    const {aadhar, date, visit} = useLocation().state || "";
    const [visitData, setVisitData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://occupational-health-center-1.onrender.com/visitData/${aadhar}/${date}`);
                console.log(response)
                console.log(response.data.data)
                const data = await response.data.data;
                console.log(data);
                setVisitData(data);
                setFilteredData(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUserData();
    }, [])

  return (
    <div className='h-screen flex bg-[#8fcadd]'>
        <Sidebar/>
        <div className='w-4/5 p-8 overflow-y-auto'>
        <div className="mb-8 justify-between items-center">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Summary</h1>
                <motion.div
                    className="bg-white p-8 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {
                        (loading) ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-xl border border-dashed border-gray-300">
                                  <FontAwesomeIcon icon={faSpinner} spin className="text-5xl text-blue-500 mb-4" />
                                  <p className="text-gray-600 font-semibold text-lg animate-pulse">Preparing summary...</p>
                                </div>
                        ):
                        ((visit === "Curative") ?(
                        <>
                            <BasicDetails  data = {visitData.employee}/>
                            <Vitals data = {visitData.vitals}/>
                            {/* FIX: Pass an object with the correct structure */}
                            <MedicalHistory data={{ medicalhistory: visitData.msphistory, sex: visitData.employee?.sex }} />
                            
                            <Vaccination data = {visitData.vaccination}/>
                            <ConsultationDisplay data = {visitData}/>
                        </>
                        ):(
                        <> 
                            <BasicDetails  data = {visitData.employee}/>
                            <Vitals data = {visitData.vitals}/>
                            {/* FIX: Pass an object with the correct structure */}
                            <MedicalHistory data={{ medicalhistory: visitData.msphistory, sex: visitData.employee?.sex }} />
                            
                            <Vaccination data = {visitData.vaccination}/>
                            <Fitness data = {visitData.fitnessassessment}/>
                        </>))
                    }
                </motion.div>
        </div>
        </div>
    </div>
  )
}

export default Summary