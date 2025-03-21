import React, { useEffect, useState } from "react";

const FitnessPage = ({ data }) => {
  const [fitnessData, setFitnessData] = useState({
    tremors: "N/A",
    romberg_test: "N/A",
    acrophobia: "N/A",
    trendelenberg_test: "N/A",
    jobNature: [],
    conditionalFitFields: [],
    overallFitness: "N/A",
    comments: "N/A",
    validity: "N/A",
  });

  useEffect(() => {
    if (data) {
      try {
        setFitnessData({
          tremors: data.tremors || "N/A",
          romberg_test: data.romberg_test || "N/A",
          acrophobia: data.acrophobia || "N/A",
          trendelenberg_test: data.trendelenberg_test || "N/A",
          jobNature: data.job_nature || [],
          conditionalFitFields: data.conditional_fit_feilds || [],
          overallFitness: data.overall_fitness || "N/A",
          comments: data.comments || "N/A",
          validity: data.validity || "N/A",
        });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        // Provide a default value or an empty array
        setFitnessData((prevFitnessData) => ({
          ...prevFitnessData,
          jobNature: [],
        }));
      }
    } else {
      // Handle the case where `data` is null or undefined
      setFitnessData({
        tremors: "No data available",
        romberg_test: "No data available",
        acrophobia: "No data available",
        trendelenberg_test: "No data available",
        jobNature: [],
        conditionalFitFields: [],
        overallFitness: "No data available",
        comments: "No data available",
        validity: "No data available",
      });
    }
  }, [data]);

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Fitness Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {[
          { label: "Tremors", value: fitnessData.tremors },
          { label: "Romberg Test", value: fitnessData.romberg_test },
          { label: "Acrophobia", value: fitnessData.acrophobia },
          { label: "Trendelenberg Test", value: fitnessData.trendelenberg_test },
          { label: "Overall Fitness", value: fitnessData.overallFitness },
          { label: "Validity", value: fitnessData.validity },
        ].map((item, index) => (
          <DetailCard key={index} label={item.label} value={item.value} />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Job Nature</h2>
      <div className="mb-12">
        {fitnessData?.jobNature.length > 0 ? (
          <ul className="list-disc pl-6 text-gray-700">
            {fitnessData.jobNature.map((job, index) => (
              <li key={index}>{job}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No job nature specified.</p>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Conditional Fit Fields</h2>
      <div className="mb-12">
        {fitnessData.conditionalFitFields.length > 0 ? (
          <ul className="list-disc pl-6 text-gray-700">
            {fitnessData.conditionalFitFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No conditional fit fields specified.</p>
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
      {value || "No data available"}
    </div>
  </div>
);

export default FitnessPage;