import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EventsAndCamps = () => {

  const accessLevel = localStorage.getItem('accessLevel');
  const navigate = useNavigate();
  if(accessLevel === "nurse")
  {
  const [formDatas, setFormDatas] = useState({
    camp_name: "",
    start_date: "",
    end_date: "",
    camp_details: "",
    select_option: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/add-camp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDatas),
      });

      if (!response.ok) {
        throw new Error("Error saving data");
      }

      alert("Event & Camp data saved successfully");

      // Resetting the form
      setFormDatas({
        camp_name: "",
        start_date: "",
        end_date: "",
        camp_details: "",
        select_option: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#8fcadd]">
      <Sidebar />
      <div
        className="w-4/5 p-8 overflow-y-auto"
        
      >
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Camps</h1>
        <motion.div className="bg-white p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Add a New Camp</h2>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Camp Name</label>
                <input
                  type="text"
                  name="camp_name"
                  value={formDatas.camp_name}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formDatas.start_date}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formDatas.end_date}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Camp Details</label>
              <textarea
                name="camp_details"
                value={formDatas.camp_details}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Select</label>
                <select
                  name="select_option"
                  value={formDatas.select_option}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border animation-smooth border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Previous">Previous</option>
                  <option value="Live">Live</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              <div className="mt-6 md:mt-0">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
else if(accessLevel === "doctor")
{
  const [formDatas, setFormDatas] = useState({
    camp_name: "",
    start_date: "",
    end_date: "",
    camp_details: "",
    select_option: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/add-camp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDatas),
      });

      if (!response.ok) {
        throw new Error("Error saving data");
      }

      alert("Event & Camp data saved successfully");

      // Resetting the form
      setFormDatas({
        camp_name: "",
        start_date: "",
        end_date: "",
        camp_details: "",
        select_option: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#8fcadd]">
      <Sidebar />
      <div
        className="w-4/5 p-8 overflow-y-auto"
        
      >
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Camps</h1>
        <motion.div className="bg-white p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Add a New Camp</h2>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Camp Name</label>
                <input
                  type="text"
                  name="camp_name"
                  value={formDatas.camp_name}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formDatas.start_date}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formDatas.end_date}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Camp Details</label>
              <textarea
                name="camp_details"
                value={formDatas.camp_details}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Select</label>
                <select
                  name="select_option"
                  value={formDatas.select_option}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border animation-smooth border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Previous">Previous</option>
                  <option value="Live">Live</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
              <div className="mt-6 md:mt-0">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
else{
  return(
    <section class="bg-white h-full flex items-center dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
            <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-900 md:text-4xl dark:text-white">404</h1>
            <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
            <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
            <button onClick={()=>navigate(-1)} class="inline-flex text-white bg-primary-600 hover:cursor-pointer hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">Back</button>
        </div>   
    </div>
</section>
  );
}
};

export default EventsAndCamps;