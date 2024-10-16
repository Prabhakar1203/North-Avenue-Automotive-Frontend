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
        <div className="w-full h-full flex items-center justify-center ">
            <div className="absolute max-w-[1400px] mt-[150px] flex flex-col p-5 mx-auto">
                <h1 className="text-gray-550 text-3xl text-center font-bold p-5">Welcome to Salesman Page</h1>

                {/* Render this section only if showResults is false */}
                {!showResults && (
                    <div className="flex justify-between gap-[30px] mt-5">
                        <div>
                            <form onSubmit={handleSearch} className="relative w-full max-w-[450px]">
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

                        <div className="flex justify-between w-2/3 mx-auto gap-[25px]">
                            <div>
                                <form onSubmit={handleCustomer} className="relative w-full max-w-[450px]">
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
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700"
                            >
                                Add a Customer
                            </button>
                        </div>
                    </div>
                )}

                {/* Conditional rendering of the add customer form */}
                {!showResults && showAddCustomerForm && (
                   <div className="absolute  flex justify-center items-center bg-opacity-0 p-10 rounded-lg">
                   <div className="max-w-[800px] p-5 bg-white text-center shadow-lg rounded-lg mt-[20px] p-10">
                       <h2 className="text-lg font-bold mb-4">Add Customer</h2>
                       <form onSubmit={handleAddCustomer} className='h-[740px] '>
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
                               value={customerData.street}
                               onChange={(e) => setCustomerData({ ...customerData, street: e.target.value })}
                               required
                           />
                           <input
                               type="text"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="City"
                               value={customerData.city}
                               onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                               required
                           />
                           <input
                               type="text"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="State"
                               value={customerData.state}
                               onChange={(e) => setCustomerData({ ...customerData, state: e.target.value })}
                               required
                           />
                           <input
                               type="text"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="Postal Code"
                               value={customerData.postal_code}
                               onChange={(e) => setCustomerData({ ...customerData, postal_code: e.target.value })}
                               required
                           />
                           <input
                               type="text"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="Phone Number"
                               value={customerData.phone_number}
                               onChange={(e) => setCustomerData({ ...customerData, phone_number: e.target.value })}
                               required
                           />
                           <input
                               type="email"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="Email"
                               value={customerData.email}
                               onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                           />
                           <input
                               type="text"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="Customer Type"
                               value={customerData.customer_type}
                               onChange={(e) => setCustomerData({ ...customerData, customer_type: e.target.value })}
                               required
                           />
                           <input
                               type="text"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="First Name"
                               value={customerData.first_name}
                               onChange={(e) => setCustomerData({ ...customerData, first_name: e.target.value })}
                               required
                           />
                           <input
                               type="text"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="Last Name"
                               value={customerData.last_name}
                               onChange={(e) => setCustomerData({ ...customerData, last_name: e.target.value })}
                               required
                           />
                           <input
                               type="text"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="Driver License"
                               value={customerData.driver_license}
                               onChange={(e) => setCustomerData({ ...customerData, driver_license: e.target.value })}
                           />
                           <input
                               type="text"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="Business Name"
                               value={customerData.business_name}
                               onChange={(e) => setCustomerData({ ...customerData, business_name: e.target.value })}
                           />
                           <input
                               type="text"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="Contact Name"
                               value={customerData.contact_name}
                               onChange={(e) => setCustomerData({ ...customerData, contact_name: e.target.value })}
                           />
                           <input
                               type="text"
                               className="w-full mb-2 p-2 border border-gray-300 rounded"
                               placeholder="Contact Title"
                               value={customerData.contact_title}
                               onChange={(e) => setCustomerData({ ...customerData, contact_title: e.target.value })}
                           />
                           <div className="flex justify-between mt-4">
                               <button
                                   type="submit"
                                   className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                               >
                                   Add Customer
                               </button>
                               <button
                                   type="button"
                                   className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                   onClick={handleCancel}
                               >
                                   Cancel
                               </button>
                           </div>
                       </form>
                   </div>
               </div>
               
                )}

                {/* Conditionally render SearchResults */}
                {showResults && <SearchResults results={results} />}
            </div>
        </div>
    );
}

export default SalesmanHero;
