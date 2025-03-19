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

const Summary = () => {
    const {emp_no, date} = useLocation().state || "";
    const [visitData, setVisitData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://occupational-health-center-1.onrender.com/visitData/${emp_no}/${date}`);
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
                    <BasicDetails  data = {visitData.employee}/>
                    <Vitals data = {visitData.vitals}/>
                    <MedicalHistory data = {visitData}/>
                    <Investigation data = {visitData}/>
                    <Fitness data = {visitData.fitnessassessment}/>
                    <Vaccination data = {visitData.vaccination}/>
                </motion.div>
        </div>
        </div>
    </div>
  )
}

export default Summary


