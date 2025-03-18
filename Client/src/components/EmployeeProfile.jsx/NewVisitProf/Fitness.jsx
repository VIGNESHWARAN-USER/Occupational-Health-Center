import React, { useEffect, useState } from "react";

const FitnessPage = ({ data }) => {
  const [fitnessData, setFitnessData] = useState({
    tremors: "",
    romberg_test: "",
    acrophobia: "",
    trendelenberg_test: "",
    jobNature: [],
    comments: "", // Added comments to initial state
  });

  useEffect(() => {
    if (data) {
      setFitnessData({
        tremors: data.tremors || "N/A",
        romberg_test: data.romberg_test || "N/A",
        acrophobia: data.acrophobia || "N/A",
        trendelenberg_test: data.trendelenberg_test || "N/A",
        jobNature: data.job_nature ? data.job_nature.split(", ") : [],
        comments: data.comments || "N/A", // Handle undefined comments
      });
    }
  }, [data]);

  console.log(fitnessData);

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Fitness Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {[
          { label: 'Tremors', value: fitnessData.tremors },
          { label: 'Romberg Test', value: fitnessData.romberg_test },
          { label: 'Acrophobia', value: fitnessData.acrophobia },
          { label: 'Trendelenberg Test', value: fitnessData.trendelenberg_test },
        ].map((item, index) => (
          <DetailCard key={index} label={item.label} value={item.value} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Job Nature</h2>
      <div className="mb-12">
        {fitnessData.jobNature.length > 0 ? (
          <ul className="list-disc pl-6 text-gray-700">
            {fitnessData.jobNature.map((job, index) => (
              <li key={index}>{job}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No job nature specified.</p>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Comments</h2>
      <div className="mb-6">
        <DetailCard label="Comments" value={fitnessData.comments} />
      </div>
    </div>
  );
};

const DetailCard = ({ label, value }) => (
  <div>
    <label className="block text-gray-700 text-sm font-semibold mb-1">{label}</label>
    <div className="px-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-900 flex items-center">
      {value || 'No data available'}
    </div>
  </div>
);

export default FitnessPage;