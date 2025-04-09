import Sidebar from '../Sidebar';
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { useLoaderData, useLocation } from 'react-router-dom'
import axios from 'axios';
import BasicDetails from './NewVisitProf/BasicDetails';
import Vitals from './NewVisitProf/Vitals';
import MedicalHistory from './NewVisitProf/MedicalHistory'
import Investigation from './NewVisitProf/Investigation'
import Fitness from './NewVisitProf/Fitness'
import Vaccination from './NewVisitProf/Vaccination'
import ConsultationDisplay from './NewVisitProf/Consultation';

const Summary = () => {
    const {emp_no, date, visit} = useLocation().state || "";
    const [visitData, setVisitData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/visitData/${emp_no}/${date}`);
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
    //console.log(visitData?.employee.name);
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
                            <div className="flex justify-center p-6 items-center">
                                <div className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                            </div>
                        ):
                        ((visit === "Curative") ?(
                        <>
                        <BasicDetails  data = {visitData.employee}/>
                        <Vitals data = {visitData.vitals}/>
                        <MedicalHistory data = {visitData}/>
                        <Investigation data = {visitData}/>
                        <Vaccination data = {visitData.vaccination}/>
                        <ConsultationDisplay data = {visitData}/>
                        </>
                        ):(
                        <> 
                        <BasicDetails  data = {visitData.employee}/>
                        <Vitals data = {visitData.vitals}/>
                        <MedicalHistory data = {visitData}/>
                        <Investigation data = {visitData}/>
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


