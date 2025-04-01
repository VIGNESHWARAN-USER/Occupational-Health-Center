import React, { useState, useRef } from "react";
import Select from 'react-select';
import Sidebar from "../Sidebar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function AddMember() {
    const accessLevel = localStorage.getItem('accessLevel');
    const navigate = useNavigate();

    const [memberType, setMemberType] = useState('');
    const [ohcFormData, setOHCFormData] = useState({
        employee_number: "",
        name: "",
        designation: "",
        email: "",
        role: [],
        doj: "",
        date_exited: "",
        job_nature: ""
    });

    const [externalFormData, setExternalFormData] = useState({
        name: "",
        designation: "",
        email: "",
        role: [],
        hospital_name: "",
        contact_number: "",
        aadhar: "",
        phone_number: "",
        do_access: "",
        date_exited: "",
        job_nature: ""
    });

    const roleOptions = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Registration', label: 'Registration' },
        { value: 'Nurse', label: 'Nurse' },
        { value: 'Doctor', label: 'Doctor' },
        { value: 'Pharmacy', label: 'Pharmacy' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (memberType === 'ohc') {
            setOHCFormData({ ...ohcFormData, [name]: value });
        } else if (memberType === 'external') {
            setExternalFormData({ ...externalFormData, [name]: value });
        }
    };

    const handleSelectChange = (selectedOptions, { name }) => {
        if (memberType === 'ohc') {
            setOHCFormData({ ...ohcFormData, [name]: selectedOptions });
        } else if (memberType === 'external') {
            setExternalFormData({ ...externalFormData, [name]: selectedOptions });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let dataToSend = {};

        if (memberType === 'ohc') {
            const roleValues = ohcFormData.role.map(option => option.value);
            dataToSend = { ...ohcFormData, role: roleValues, memberType: 'ohc' }; // Add memberType
        } else if (memberType === 'external') {
            const roleValues = externalFormData.role.map(option => option.value);
            dataToSend = { ...externalFormData, role: roleValues, memberType: 'external' }; // Add memberType
        }

        try {
            const response = await fetch("https://occupational-health-center-1.onrender.com/members/add/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Member added successfully!");
                if (memberType === 'ohc') {
                    setOHCFormData({
                        employee_number: "",
                        name: "",
                        designation: "",
                        email: "",
                        role: [],
                        doj: "",
                        date_exited: "",
                        job_nature: ""
                    });
                } else if (memberType === 'external') {
                    setExternalFormData({
                        name: "",
                        designation: "",
                        email: "",
                        role: [],
                        hospital_name: "",
                        contact_number: "",
                        aadhar: "",
                        phone_number: "",
                        do_access: "",
                        date_exited: "",
                        job_nature: ""
                    });
                }
                setMemberType('');
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error adding member:", error);
            alert("Failed to add member");
        }
    };

    const handleBack = () => {
        setMemberType('');
    };

    const renderOHCStaffFields = () => (
        <>
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="block text-black mb-1">Enter Employee Number</label>
                    <input
                        type="text"
                        name="employee_number"
                        value={ohcFormData.employee_number}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-black mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={ohcFormData.name}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="block text-black mb-1">Designation</label>
                    <input
                        type="text"
                        name="designation"
                        value={ohcFormData.designation}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-black mb-1">Enter Mail ID</label>
                    <input
                        type="email"
                        name="email"
                        value={ohcFormData.email}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="block text-black mb-1">DOJ</label>
                    <input
                        type="date"
                        name="doj"
                        value={ohcFormData.doj}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-black mb-1">DO(Exit)</label>
                    <input
                        type="date"
                        name="date_exited"
                        value={ohcFormData.date_exited}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Job Nature and Role in the same row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Job Nature</label>
                <input
                  type="text"
                  name="job_nature"
                  value={ohcFormData.job_nature}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>
              <div className="flex-1">
                  <label className="block text-black mb-1">Role ( For Give the Access )</label>
                  <Select
                      name="role"
                      isMulti
                      options={roleOptions}
                      value={ohcFormData.role}
                      onChange={handleSelectChange}
                      className="w-full "
                  />
              </div>
            </div>
        </>
    );

    const renderExternalHospitalFields = () => (
        <>
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="block text-black mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={externalFormData.name}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-black mb-1">Name of Hospital</label>
                    <input
                        type="text"
                        name="hospital_name"
                        value={externalFormData.hospital_name}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="block text-black mb-1">Designation</label>
                    <input
                        type="text"
                        name="designation"
                        value={externalFormData.designation}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex-1">
                    <label className="block text-black mb-1">Aadhar</label>
                    <input
                        type="text"
                        name="aadhar"
                        value={externalFormData.aadhar}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="block text-black mb-1">Mail ID</label>
                    <input
                        type="email"
                        name="email"
                        value={externalFormData.email}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-black mb-1">Phone No.</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={externalFormData.phone_number}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* DO Access and DO Exit in the same row */}
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="block text-black mb-1">DO Access</label>
                    <input
                        type="date"
                        name="do_access"
                        value={externalFormData.do_access}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-black mb-1">DO(Exit)</label>
                    <input
                        type="date"
                        name="date_exited"
                        value={externalFormData.date_exited}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Job Nature and Role in the same row */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-black mb-1">Job Nature</label>
                <input
                  type="text"
                  name="job_nature"
                  value={externalFormData.job_nature}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>
              <div className="flex-1">
                  <label className="block text-black mb-1">Role ( For Give the Access )</label>
                  <Select
                      name="role"
                      isMulti
                      options={roleOptions}
                      value={externalFormData.role}
                      onChange={handleSelectChange}
                      className="w-full"
                  />
              </div>
            </div>
        </>
    );

    if (accessLevel === "admin") {
        return (
            <div className="flex h-screen bg-[#8fcadd]">
                <Sidebar />
                <div className="m-8 w-4/5">
                    <h1 className="text-3xl font-bold text-black mb-6">Add Member</h1>
                    <motion.div
                        className="bg-white p-8 rounded-lg shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
                    >
                        <form className="space-y-6" onSubmit={handleSubmit}>

                            {/* Member Type Selection */}
                            <div>
                                <label className="block text-black mb-1">Member Type</label>
                                <select
                                    value={memberType}
                                    onChange={(e) => {
                                        setMemberType(e.target.value);
                                    }}
                                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Member Type</option>
                                    <option value="ohc">For OHC Staff</option>
                                    <option value="external">For External Hospital People</option>
                                </select>
                            </div>

                            {memberType === 'ohc' && renderOHCStaffFields()}
                            {memberType === 'external' && renderExternalHospitalFields()}

                            {memberType && (
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300 transition-colors duration-200"
                                        onClick={handleBack}
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-200"
                                    >
                                        Add Member
                                    </button>
                                </div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        );
    } else {
        return (
            <section className="bg-white h-full flex items-center dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div className="mx-auto max-w-screen-sm text-center">
                        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
                        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
                        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
                        <button onClick={() => navigate(-1)} className="inline-flex text-white bg-primary-600 hover:cursor-pointer hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back</button>
                    </div>
                </div>
            </section>
        );
    }
}

export default AddMember;