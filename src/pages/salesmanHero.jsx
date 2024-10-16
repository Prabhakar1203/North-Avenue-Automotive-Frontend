import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaSearch } from "react-icons/fa";
import SearchResults from './searchResults'; // Import the new component

function SalesmanHero() {
    const [searchedWord, setSearchedWord] = useState('');
    const [searchedCustomer, setSearchedCustomer] = useState('');
    const [results, setResults] = useState([]); // State to hold search results
    const [showAddCustomerForm, setShowAddCustomerForm] = useState(false); // State to control form visibility
    const [customerData, setCustomerData] = useState({ // State for the customer data
        Customer_id:'',
        Street: '',
        City: '',
        State: '',
        Postal_code: '',
        Phone_number: '',
        Email: '',
        Customer_type_Bus_Or_Ind: '',
        First_name: '',
        Last_name: '',
        Driver_License: '',
        Business_tax_identification: '',
        Business_Name: '',
        Contact_Name: '',
        Contact_Title: '',
    });

    const [showResults, setShowResults] = useState(false); // New state to control the visibility of the SearchResults component

    const handleSearch = async (e) => {
        e.preventDefault();
        console.log("Searching for:", searchedWord); // Log the searched word

        try {
            const response = await axios.post('http://localhost:9004/api/search', {
                searched_word: searchedWord,
            });

            console.log("API Response:", response.data); // Log the API response

            if (response.data.length < 1) {
                Swal.fire({
                    icon: 'info',
                    title: 'No Results Found',
                    text: 'No cars matching your search were found.',
                });
                setResults([]); // Clear results when no results are found
                setShowResults(false); // Hide results
            } else {
                setResults(response.data);
                setShowResults(true); // Show results
            }
        } catch (error) {
            console.error("Error during API call:", error); // Log the error
            Swal.fire({
                icon: 'error',
                title: 'Search Failed',
                text: error.response?.data?.message || 'An error occurred during the search.',
            });
        }
    };

    const handleCustomer = async (e) => {
        e.preventDefault();
        console.log("Searching for:", searchedCustomer);

       try {
            const response = await axios.post('http://localhost:9004/api/serachingCustomer', {
                searched_name: searchedCustomer,
            });

            console.log("API Response:", response.data);
            const customerId = response.data.data[0].customer_id;
            console.log(customerId)
            if (response.status === 404) {
                Swal.fire({
                    icon: 'info',
                    title: 'No Results Found',
                    text: 'Customer Not found.',
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Results Found',
                    text: `Customer found, You can sell to ${searchedCustomer} \n and Customer_Id ${customerId}`,
                });
            }
        } catch (error) {
            console.error("Error during API call:", error);
            Swal.fire({
                icon: 'error',
                title: 'Search Failed',
                text: error.response?.data?.message || 'An error occurred during the search.',
            });
        }
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        console.log("Adding Customer:", customerData);

        try {
            const response = await axios.post('http://localhost:9004/api/addingUser', customerData);
            console.log("Add Customer Response:", response.data);
            Swal.fire({
                icon: 'success',
                title: 'Customer Added',
                text: 'Customer added successfully.',
            });

            // Reset the form and hide it
            setCustomerData({
                Customer_id:'',
                Street: '',
                City: '',
                State: '',
                Postal_code: '',
                Phone_number: '',
                Email: '',
                Customer_type_Bus_Or_Ind: '',
                First_name: '',
                Last_name: '',
                Driver_License: '',
                Business_tax_identification: '',
                Business_Name: '',
                Contact_Name: '',
                Contact_Title: '',
            });
            setShowAddCustomerForm(false);
        } catch (error) {
            console.error("Error adding customer:", error);
            Swal.fire({
                icon: 'error',
                title: 'Add Failed',
                text: error.response?.data?.message || 'An error occurred while adding the customer.',
            });
        }
    };

    const handleCancel = () => {
       setShowAddCustomerForm(false)
    };
    

    return (
        <div className="w-full h-full flex items-center justify-center p-4 md:p-10">
            <div className="relative max-w-[1400px] mt-[50px] flex flex-col p-5 mx-auto">
                <h1 className="text-gray-550 text-3xl text-center font-bold p-5">Welcome to Salesman Page</h1>

                {/* Render this section only if showResults is false */}
                {!showResults && (
                    <div className="flex flex-col md:flex-row justify-between gap-4 mt-5">
                        <div className="flex-1">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <input
                                    className="p-3 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200"
                                    type="text"
                                    value={searchedWord}
                                    onChange={(e) => setSearchedWord(e.target.value)}
                                    required
                                    placeholder="Search a Car"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">
                                    <FaSearch />
                                </button>
                            </form>
                        </div>

                        <div className="flex flex-col md:flex-row w-full md:w-auto gap-4">
                            <div className="flex-1">
                                <form onSubmit={handleCustomer} className="relative w-full">
                                    <input
                                        className="p-3 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200"
                                        type="text"
                                        value={searchedCustomer}
                                        onChange={(e) => setSearchedCustomer(e.target.value)}
                                        required
                                        placeholder="Search a Customer"
                                    />
                                    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">
                                        <FaSearch />
                                    </button>
                                </form>
                            </div>

                            <button
                                onClick={() => setShowAddCustomerForm(true)} // Show the form when clicked
                                className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700"
                            >
                                Add a Customer
                            </button>
                        </div>
                    </div>
                )}

                {/* Conditional rendering of the add customer form */}
                {!showResults && showAddCustomerForm && (
                   <div className="flex justify-center items-center bg-opacity-0 p-10 rounded-lg">
                       <div className="max-w-[800px] p-5 bg-white text-center shadow-lg rounded-lg mt-4">
                           <h2 className="text-lg font-bold mb-4">Add Customer</h2>
                           <form onSubmit={handleAddCustomer}>
                             <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Customer Id"
                                   value={customerData.Customer_id}
                                   onChange={(e) => setCustomerData({ ...customerData, Customer_id: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Street"
                                   value={customerData.Street}
                                   onChange={(e) => setCustomerData({ ...customerData, Street: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="City"
                                   value={customerData.City}
                                   onChange={(e) => setCustomerData({ ...customerData, City: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="State"
                                   value={customerData.State}
                                   onChange={(e) => setCustomerData({ ...customerData, State: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Postal Code"
                                   value={customerData.Postal_code}
                                   onChange={(e) => setCustomerData({ ...customerData, Postal_code: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Phone Number"
                                   value={customerData.Phone_number}
                                   onChange={(e) => setCustomerData({ ...customerData, Phone_number: e.target.value })}
                                   required
                               />
                               <input
                                   type="email"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Email"
                                   value={customerData.Email}
                                   onChange={(e) => setCustomerData({ ...customerData, Email: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Customer Type (Bus/Ind)"
                                   value={customerData.Customer_type_Bus_Or_Ind}
                                   onChange={(e) => setCustomerData({ ...customerData, Customer_type_Bus_Or_Ind: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="First Name"
                                   value={customerData.First_name}
                                   onChange={(e) => setCustomerData({ ...customerData, First_name: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Last Name"
                                   value={customerData.Last_name}
                                   onChange={(e) => setCustomerData({ ...customerData, Last_name: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Driver License"
                                   value={customerData.Driver_License}
                                   onChange={(e) => setCustomerData({ ...customerData, Driver_License: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Business Tax ID"
                                   value={customerData.Business_tax_identification}
                                   onChange={(e) => setCustomerData({ ...customerData, Business_tax_identification: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Business Name"
                                   value={customerData.Business_Name}
                                   onChange={(e) => setCustomerData({ ...customerData, Business_Name: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Contact Name"
                                   value={customerData.Contact_Name}
                                   onChange={(e) => setCustomerData({ ...customerData, Contact_Name: e.target.value })}
                                   required
                               />
                               <input
                                   type="text"
                                   className="w-full mb-2 p-2 border border-gray-300 rounded"
                                   placeholder="Contact Title"
                                   value={customerData.Contact_Title}
                                   onChange={(e) => setCustomerData({ ...customerData, Contact_Title: e.target.value })}
                                   required
                               />
                               <div className="flex justify-between mt-4">
                                   <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700">Add Customer</button>
                                   <button type="button" onClick={handleCancel} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">Cancel</button>
                               </div>
                           </form>
                       </div>
                   </div>
                )}

                {/* Render the SearchResults component if showResults is true */}
                {showResults && (
                    <SearchResults results={results} />
                )}
            </div>
        </div>
    );
}

export default SalesmanHero;
