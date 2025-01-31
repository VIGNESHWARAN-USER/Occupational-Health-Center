import React, { useState } from 'react';
import DocSidebar from '../Sidebar/DocSideBar';

const ReviewPeople = () => {
  const [selectedReview, setSelectedReview] = useState('Today Review');

  const handleButtonClick = (reviewType) => {
    setSelectedReview(reviewType);
    console.log(`Selected: ${reviewType}`);
    // Add logic here to filter data based on the review type
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      
        <DocSidebar />

      {/* Main Content */}
      <div className="w-4/5 bg-gray-100 p-8">
        {/* Horizontal Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => handleButtonClick('Today Review')}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              selectedReview === 'Today Review' ? 'bg-blue-600' : 'bg-gray-400 hover:bg-blue-500'
            }`}
          >
            Today Review
          </button>
          <button
            onClick={() => handleButtonClick('Tomorrow Review')}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              selectedReview === 'Tomorrow Review' ? 'bg-blue-600' : 'bg-gray-400 hover:bg-blue-500'
            }`}
          >
            Tomorrow Review
          </button>
          <button
            onClick={() => handleButtonClick('Not Attempted')}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              selectedReview === 'Not Attempted' ? 'bg-blue-600' : 'bg-gray-400 hover:bg-blue-500'
            }`}
          >
            Not Attempted
          </button>
        </div>

        {/* Display Content Based on Selection */}
        <div className="text-center mt-8">
          <h2 className="text-lg font-bold">{selectedReview}</h2>
          <p className="text-gray-600 mt-2">
            {selectedReview === 'Today Review' && 'Displaying reviews scheduled for today.'}
            {selectedReview === 'Tomorrow Review' && 'Displaying reviews scheduled for tomorrow.'}
            {selectedReview === 'Not Attempted' && 'Displaying reviews that have not been attempted yet.'}
          </p>
          {/* You can replace this text with a table, list, or any other data */}
        </div>
      </div>
    </div>
  );
};

export default ReviewPeople;
