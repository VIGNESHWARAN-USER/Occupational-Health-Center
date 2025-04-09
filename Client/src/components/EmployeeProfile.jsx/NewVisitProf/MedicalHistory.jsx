import React from 'react';
import Select from 'react-select';

const MedicalHistory = ({ data }) => {
    console.log("Data in MedicalHistoryView:", data);

    const msphistory = data?.msphistory || {};
    const personalHistory = msphistory?.personal_history || {};
    const medicalData = msphistory?.medical_data || {};
    const femaleWorker = msphistory?.female_worker || {};
    const surgicalHistory = msphistory?.surgical_history || {};
    const familyHistory = msphistory?.family_history || {};
    const submissionDetails = msphistory?.submission_details || {};
    const allergyFields = msphistory?.allergy_fields || {};
    const allergyComments = msphistory?.allergy_comments || {};
    const childrenData = msphistory?.children_data || [];
    const conditions = msphistory?.conditions || {};

    const relationshipOptions1 = [
        { value: "brother", label: "Brother" },
        { value: "sister", label: "Sister" },
        { value: "wife", label: "Wife" },
        { value: "father", label: "Father" },
        { value: "mother", label: "Mother" },
        { value: "paternalGrandFather", label: "Paternal Grand Father" },
        { value: "paternalGrandMother", label: "Paternal Grand Mother" },
        { value: "maternalGrandFather", label: "Maternal Grand Father" },
        { value: "maternalGrandMother", label: "Maternal Grand Mother" },
    ];
    const relationshipOptions2 = [
      { value: "G1 P1 L1 A1", label: "G1 P1 L1 A1" },
      { value: "G2 P1 L1 A1", label: "G2 P1 L1 A1" },
      { value: "G3 P1 L1 A1", label: "G3 P1 L1 A1" },
      { value: "P2 L1 A1", label: "P2 L1 A1" },
    ];

    const cardStyle = {
      backgroundColor: "#f8f9fa", // Light gray background
      borderRadius: "8px", // Rounded corners
      padding: "1rem", // Padding inside the card
      marginBottom: "1rem", // Margin below the card
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
    };

    const titleStyle = {
      fontSize: "1.25rem",
      fontWeight: "600",
    };

    const AllergyDisplay = ({ allergyType, fields, comments }) => (
        <div className="mb-4 border rounded p-3 bg-white shadow-sm">
            <div className="font-semibold">{allergyType} Allergy:</div>
            <div className="grid grid-cols-2 gap-2">
                <div>Response: <span className="font-medium">{fields?.yesNo || 'N/A'}</span></div>
                <div>Comments: <span className="font-medium">{comments || 'N/A'}</span></div>
            </div>
        </div>
    );

    const FamilyHistoryDisplay = ({ label, relative, history }) => (
        <div className="mb-6 border rounded p-3 bg-white shadow-sm">
            <label className="block mb-2 font-semibold text-gray-700">
                {label}
            </label>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                <div>Status: <span className="font-medium">{history[relative]?.status || 'N/A'}</span></div>
                <div>Reason: <span className="font-medium">{history[relative]?.reason || 'N/A'}</span></div>
                <div>Remarks: <span className="font-medium">{history[relative]?.remarks || 'N/A'}</span></div>
            </div>
        </div>
    );

    const MedicalConditionDisplay = ({ condition, conditions, familyHistory, relationshipOptions1 }) => {
      const selectedRelationships = conditions[condition] || [];
      const conditionComment = familyHistory[condition]?.comment || '';

      return (
          <tr className="border">
              <td className="p-2 border">{condition}</td>
              <td className="p-2 border">
                  {selectedRelationships.map(relationship => {
                      const option = relationshipOptions1.find(opt => opt.value === relationship);
                      return option ? option.label : relationship; // Display label if found, otherwise value
                  }).join(', ') || 'None'}
              </td>
              <td className="p-2 border">{conditionComment || 'N/A'}</td>
          </tr>
      );
  };

    const ChildDisplay = ({ child }) => (
        <tr className="border">
            <td className="p-2 border">{child.sex || 'N/A'}</td>
            <td className="p-2 border">{child.dob || 'N/A'}</td>
            <td className="p-2 border">{child.Age || 'N/A'}</td>
            <td className="p-2 border">{child.status || 'N/A'}</td>
            <td className="p-2 border">{child.reason || 'N/A'}</td>
            <td className="p-2 border">{child.remarks || 'N/A'}</td>
        </tr>
    );

    return (
        <div className="p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Medical History</h1>

            <div style={cardStyle}>
              <h2 style={titleStyle}>Personal History</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>Smoking: <span className="font-medium">   - {personalHistory?.smoking?.yesNo || 'N/A'}, Years - {personalHistory?.smoking?.years || 'N/A'}, Per Day - {personalHistory?.smoking?.perDay || 'N/A'}</span></div>
                <div>Alcohol: <span className="font-medium"> -  {personalHistory?.alcohol?.yesNo || 'N/A'}, Years - {personalHistory?.alcohol?.years || 'N/A'}, Frequency - {personalHistory?.alcohol?.frequency || 'N/A'}</span></div>
                <div>Paan/Beetle Chewer: <span className="font-medium"> - {personalHistory?.paan?.yesNo || 'N/A'}, Years - {personalHistory?.paan?.years || 'N/A'}</span></div>
                <div>Diet: <span className="font-medium">{personalHistory?.diet || 'N/A'}</span></div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={titleStyle}>Medical History</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border bg-white shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-3 font-semibold text-gray-700">Condition</th>
                      <th className="p-3 font-semibold text-gray-700">Detail</th>
                      <th className="p-3 font-semibold text-gray-700">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3">{medicalData?.HTN?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.HTN?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">DM</td>
                      <td className="p-3">{medicalData?.DM?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.DM?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Epileptic</td>
                      <td className="p-3">{medicalData?.Epileptic?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.Epileptic?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Hyper Thyroid</td>
                      <td className="p-3">{medicalData?.Hyper_Thyroid?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.Hyper_Thyroid?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Hypo Thyroid</td>
                      <td className="p-3">{medicalData?.Hypo_Thyroid?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.Hypo_Thyroid?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Asthma</td>
                      <td className="p-3">{medicalData?.Asthma?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.Asthma?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">CVS</td>
                      <td className="p-3">{medicalData?.CVS?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.CVS?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">CNS</td>
                      <td className="p-3">{medicalData?.CNS?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.CNS?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">RS</td>
                      <td className="p-3">{medicalData?.RS?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.RS?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">GIT</td>
                      <td className="p-3">{medicalData?.GIT?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.GIT?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">KUB</td>
                      <td className="p-3">{medicalData?.KUB?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.KUB?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Cancer</td>
                      <td className="p-3">{medicalData?.Cancer?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.Cancer?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Defective Colour Vision</td>
                      <td className="p-3">{medicalData?.Defective_Colour_Vision?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.Defective_Colour_Vision?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="p-3">Others</td>
                      <td className="p-3">{medicalData?.Others?.detail || 'N/A'}</td>
                      <td className="p-3">{medicalData?.Others?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="p-3">Obstetric</td>
                        <td className="p-3">{medicalData?.Obstetric?.detail || 'N/A'}</td>
                        <td className="p-3">{medicalData?.Obstetric?.comment || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="p-3">Gynaec</td>
                        <td className="p-3">{medicalData?.Gynaec?.detail || 'N/A'}</td>
                        <td className="p-3">{medicalData?.Gynaec?.comment || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={cardStyle}>
              
              <div>Number of Children: ({childrenData.length})</div>
              {childrenData.length > 0 && (
                  <div className="overflow-x-auto mt-4">
                      <table className="w-full border-collapse border bg-white shadow-md rounded-lg">
                          <thead>
                              <tr className="bg-gray-200 text-left">
                                  <th className="p-3 font-semibold text-gray-700">Sex</th>
                                  <th className="p-3 font-semibold text-gray-700">DOB</th>
                                  <th className="p-3 font-semibold text-gray-700">Age</th>
                                  <th className="p-3 font-semibold text-gray-700">Status</th>
                                  <th className="p-3 font-semibold text-gray-700">Reason (If Expired)</th>
                                  <th className="p-3 font-semibold text-gray-700">Remarks (Health Condition)</th>
                              </tr>
                          </thead>
                          <tbody>
                              {childrenData.map((child, index) => (
                                  <ChildDisplay key={index} child={child} />
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}
              <h2 style={titleStyle} className='mt-8'>Surgical History</h2>
              <div className="mt-4">
                <div>Comments: <span className="font-medium">{surgicalHistory?.comments || 'N/A'}</span></div>
                <div>History: <span className="font-medium">{(surgicalHistory.children || []).join(', ') || 'N/A'}</span></div>
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={titleStyle}>Allergy History</h2>
              <AllergyDisplay allergyType="Drug" fields={allergyFields.drug} comments={allergyComments.drug} />
              <AllergyDisplay allergyType="Food" fields={allergyFields.food} comments={allergyComments.food} />
              <AllergyDisplay allergyType="Other" fields={allergyFields.others} comments={allergyComments.others} />
            </div>

            <div style={cardStyle}>
              <h2 style={titleStyle}>Family History</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FamilyHistoryDisplay label="Father" relative="father" history={familyHistory} />
                <FamilyHistoryDisplay label="Paternal Grand Father" relative="paternalGrandFather" history={familyHistory} />
                <FamilyHistoryDisplay label="Paternal Grand Mother" relative="paternalGrandMother" history={familyHistory} />
                <FamilyHistoryDisplay label="Mother" relative="mother" history={familyHistory} />
                <FamilyHistoryDisplay label="Maternal Grand Father" relative="maternalGrandFather" history={familyHistory} />
                <FamilyHistoryDisplay label="Maternal Grand Mother" relative="maternalGrandMother" history={familyHistory} />
              </div>

                  <table className="w-full border-collapse border bg-white shadow-md rounded-lg">
                      <thead>
                          <tr className="bg-gray-200 text-left">
                              <th className="p-3 font-semibold text-gray-700">Condition</th>
                              <th className="p-3 font-semibold text-gray-700">Releation Ship</th>
                              <th className="p-3 font-semibold text-gray-700">Comments</th>
                          </tr>
                      </thead>
                      <tbody>
                          <MedicalConditionDisplay
                              condition="HTN"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="DM"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="Epileptic"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="Hyper_Thyroid"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="Hypo_Thyroid"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="Asthma"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="CVS"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="CNS"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="RS"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="GIT"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="KUB"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="Cancer"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="Defective_Colour_Vision"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          <MedicalConditionDisplay
                              condition="Others"
                              conditions={conditions}
                              familyHistory={familyHistory}
                              relationshipOptions1={relationshipOptions1}
                          />
                          </tbody>
                      </table>
            </div>

            <div style={cardStyle}>
              <h2 style={titleStyle}>Submission Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>Submitted By Nurse: <span className="font-medium">{submissionDetails?.submittedBy || 'N/A'}</span></div>
                <div>Patient Booked to Dr.: <span className="font-medium">{submissionDetails?.bookedTo || 'N/A'}</span></div>
              </div>
            </div>
        </div>
    );
};

export default MedicalHistory;