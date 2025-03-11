import React, { useState, useEffect } from "react";

const ReviewPeople = () => {
    const [reviews, setReviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeStatus, setActiveStatus] = useState("Today");
    const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category

    // Fetch categories
    useEffect(() => {
        fetch("https://occupational-health-center-1.onrender.com/categories/")
            .then((res) => res.json())
            .then((data) => setCategories(data.categories))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // Fetch reviews based on activeStatus & selectedCategory
    useEffect(() => {
        let url = `https://occupational-health-center-1.onrender.com/reviews/${activeStatus}/`;
        if (selectedCategory) {
            url += `?category=${selectedCategory}`; // Append category as a query param
        }

        fetch(url)
            .then((res) => res.json())
            .then((data) => setReviews(data.reviews))
            .catch((err) => console.error("Error fetching reviews:", err));
    }, [activeStatus, selectedCategory]);

    return (
        <div className="flex p-5">
            {/* Left Sidebar: Categories */}
            <div className="w-1/4 bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold">Categories</h2>
                <ul className="mt-4">
                    <li 
                        className={`p-2 border-b cursor-pointer ${selectedCategory === "" ? "font-bold text-blue-600" : ""}`}
                        onClick={() => setSelectedCategory("")} // Show all reviews
                    >
                        📁 All Categories
                    </li>
                    {categories.map((category) => (
                        <li 
                            key={category.id} 
                            className={`p-2 border-b cursor-pointer ${selectedCategory === category.name ? "font-bold text-blue-600" : ""}`}
                            onClick={() => setSelectedCategory(category.name)}
                        >
                            📁 {category.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Content: Reviews */}
            <div className="w-3/4 p-4">
                {/* Filter Buttons */}
                <div className="flex gap-4 mb-4">
                    {["Today", "Tomorrow", "Not Attempted"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveStatus(status)}
                            className={`px-4 py-2 rounded-md ${
                                activeStatus === status ? "bg-gray-800 text-white" : "bg-gray-300"
                            }`}
                        >
                            {status} Reviews
                        </button>
                    ))}
                </div>

                {/* Review Table */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-2">{activeStatus} Reviews</h2>
                    <h3 className="text-md text-gray-500">{selectedCategory || "All Categories"}</h3>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Profile</th>
                                <th className="border p-2">PID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Gender</th>
                                <th className="border p-2">Appointments</th>
                                <th className="border p-2">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <tr key={review.id} className="border">
                                        <td className="p-2 text-center">👤</td>
                                        <td className="p-2">{review.pid}</td>
                                        <td className="p-2">{review.name}</td>
                                        <td className="p-2">{review.gender}</td>
                                        <td className="p-2">{review.appointment_date}</td>
                                        <td className="p-2">
                                            <button className="bg-gray-800 text-white px-3 py-1 rounded-md">
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-4">No reviews found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReviewPeople;
