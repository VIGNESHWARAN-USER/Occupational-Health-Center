import React, { useEffect, useState } from "react";

const FitnessPage = ({ data }) => {
  const [fitnessData, setFitnessData] = useState({
    tremors: "",
    romberg_test: "",
    acrophobia: "",
    trendelenberg_test: "",
    jobNature: [],
  });

  useEffect(() => {
    if (data) {
      setFitnessData({
        tremors: data.tremors || "N/A",
        romberg_test: data.romberg_test || "N/A",
        acrophobia: data.acrophobia || "N/A",
        trendelenberg_test: data.trendelenberg_test || "N/A",
        jobNature: data.job_nature ? data.job_nature.split(", ") : [],
        comments: data.comments,
      });
    }
  }, [data]);

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-100 min-h-screen p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Fitness Details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {["Tremors", "Romberg Test", "Acrophobia", "Trendelenberg Test"].map((test, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl"
            >
              <h2 className="text-xl font-semibold text-blue-800 mb-2">{test}</h2>
              <p className="text-gray-700 text-lg">{fitnessData[test.toLowerCase().replace(/ /g, "_")]}</p>
            </div>
          ))}
        </div>

        {/* Job Nature */}
        <div
          className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg mt-8 transition-all duration-300 hover:shadow-2xl"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Job Nature</h2>
          {fitnessData.jobNature.length > 0 ? (
            <ul className="list-disc pl-6 text-gray-700 text-lg">
              {fitnessData.jobNature.map((job, index) => (
                <li key={index}>{job}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 text-lg">No job nature specified.</p>
          )}
        </div>

        {/* Comments */}
        <div
          className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg mt-8 transition-all duration-300 hover:shadow-2xl"
        >
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Comments</h2>
          <p className="text-gray-700 text-lg">{fitnessData.comments || "No comments available."}</p>
        </div>
      </div>
    </div>
  );
};

export default FitnessPage;
