import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaSearch } from "react-icons/fa";
import SearchResults from './searchResults'; // Import the new component
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardNavbar from '../components/DashboardNavbar';

function InventeryClerk() {
    const { user } = useSelector((state) => state.user);
    const [availableCarsCount, setAvailableCarsCount] = useState(0);
    const [pendingCarsCount, setPendingCarsCount] = useState(0);
    const [unsoldCarsCount, setUnsoldCarsCount] = useState(0);

    const [vin, setVin] = useState('');
    const [partsData, setPartsData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchedWord, setSearchedWord] = useState('');
    const [searchedCustomer, setSearchedCustomer] = useState('');
    const [results, setResults] = useState([]); // State to hold search results
    const [showAddVehicleForm, setShowAddVehicleForm] = useState(false); // State to control form visibility
    const [vehicleData, setVehicleData] = useState({ // State for the vehicle data
        VIN:'', 
        Vehicle_type:'', 
        Manufacturer_name:'', 
        Model_name:'', 
        Model_year:'', 
        Fuel_type:'',
        Color:'',
        Mileage:'', 
        Additional_description:'', 
        Bought_from_customer_id:'', 
        Purchase_date:'', 
        Purchased_by_employee:'', 
        Updated_by_employee:'', 
        Vehicle_condition:'', 
        Purchase_Price:''
    });

    const fetchPartsData = async () => {
        if (!vin) {
          Swal.fire({
            icon: 'warning',
            title: 'VIN Required',
            text: 'Please enter a VIN to fetch the details.',
          });
          return;
        }
    
        try {
          const response = await axios.post('http://localhost:9004/api/totalPartsAndCost', {
            VIN: vin,
          });
          
          console.log(response.data);
          if (response.data) {
            setPartsData(response.data);
            setIsModalOpen(true);
          } else {
            Swal.fire({
              icon: 'info',
              title: 'No Results Found',
              text: 'No parts data found for this VIN.',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while fetching the data.',
          });
          console.error("Error fetching parts data:", error);
        }
      };
 
    const [showResults, setShowResults] = useState(false); // New state to control the visibility of the SearchResults component

    // Fetch car counts (Available, Pending, Sold, Unsold) when the component mounts
    useEffect(() => {
        const fetchCarCounts = async () => {
            try {
                // Fetch Available Cars Count
                fetch('http://localhost:9004/api/getAvailableCars')
                    .then((response) => response.json())
                    .then((data) => setAvailableCarsCount(data[0]["available cars"]))
                    .catch((error) => console.error('Error fetching available cars:', error));

                // Fetch Pending Cars Count
                fetch('http://localhost:9004/api/getPendingCars')
                    .then((response) => response.json())
                    .then((data) => setPendingCarsCount(data[0].Pending_Parts_Count))
                    .catch((error) => console.error('Error fetching pending cars:', error));
                fetch('http://localhost:9004/api/getUnsoldCars')
                    .then((response) => response.json())
                    .then((data) => setUnsoldCarsCount(data[0].Unsold_Vehicles_Count))
                    .catch((error) => console.error('Error fetching unsold cars:', error));
               
            } catch (error) {
                console.error('Error fetching car counts:', error);
            }
        };

        fetchCarCounts();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        console.log("Searching for:", searchedWord);

        try {
            const response = await axios.post('http://localhost:9004/api/search', {
                searched_word: searchedWord,
            });

            console.log("API Response:", response.data);

            if (response.status === 404) {
                Swal.fire({
                    icon: 'info',
                    title: 'No Results Found',
                    text: 'No cars matching your search were found.',
                });
                setResults([]);
                setShowResults(false);
            } else {
                setResults(response.data);
                setShowResults(true);
            }
        } catch (error) {
            console.error("Error during API call:", error);
            Swal.fire({
                icon: 'error',
                title: 'Search Failed',
                text: error.response?.data?.message || 'No cars matching your search were found.',
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

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        console.log("Adding Vehicle:", vehicleData);

        try {
            const response = await axios.post('http://localhost:9004/api/addingVehicle', vehicleData);
            console.log("Add Vehicle Response:", response.data);
            Swal.fire({
                icon: 'success',
                title: 'Vehicle Added',
                text: 'Vehicle added successfully.',
            });

            // Reset the form and hide it
            setVehicleData({
                VIN:'', 
                Vehicle_type:'', 
                Manufacturer_name:'', 
                Model_name:'', 
                Model_year:'', 
                Fuel_type:'',
                Color:'',
                Mileage:'', 
                Additional_description:'', 
                Bought_from_customer_id:'', 
                Purchase_date:'', 
                Purchased_by_employee:'', 
                Updated_by_employee:'', 
                Vehicle_condition:'', 
                Purchase_Price:''
            });
            setShowAddVehicleForm(false);
        } catch (error) {
            console.error("Error adding vehicle:", error);
            Swal.fire({
                icon: 'error',
                title: 'Add Failed',
                text: error.response?.data?.message || 'An error occurred while adding the vehicle.',
            });
        }
    };

    const handleCancel = () => {
       setShowAddVehicleForm(false);
    };

    //  parts and items
    const [orderDetails, setOrderDetails] = useState({
        Order_id: '',
        VIN: '',
        Vendor_id: '',
      });
    
      const [parts, setParts] = useState([]);
      const [showForm, setShowForm] = useState(false); // State to control form visibility
    
      const handleOrderDetailsChange = (e) => {
        setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
      };
    
      const handlePartChange = (index, e) => {
        const updatedParts = [...parts];
        updatedParts[index][e.target.name] = e.target.value;
        setParts(updatedParts);
      };
    
      const addPart = () => {
        setParts([
          ...parts,
          {
            Order_line_number: '',
            Purchase_order_number: '',
            Order_status: 'Ordered',
            Part_unit_price: '',
            Part_quantity: '',
            Part_description: '',
          },
        ]);
      };
    
      const removePart = (index) => {
        const updatedParts = parts.filter((_, partIndex) => partIndex !== index);
        setParts(updatedParts);
      };
    
      // Handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        Swal.fire({
          title: 'Are you sure?',
          text: 'You are about to submit the order!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, submit it!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await axios.post('http://localhost:9004/api/partOrderDetailsWithItems', {
                ...orderDetails,
                parts,
              });
              Swal.fire('Success!', response.data.message, 'success');
            } catch (error) {
              Swal.fire('Error!', 'Failed to submit order.', 'error');
            }
          }
        });
      };
    
      // Toggle form visibility when the button is clicked
      const handleOrderButtonClick = () => {
        setShowForm(true); // Display the form
      };

      const handleCloseForm = () => {
        setShowForm(false); // Hide the form
      };


      // Adding Vendors

      const [vendorDetails, setVendorDetails] = useState({
        Vendor_id: '',
        Vendor_Name: '',
        Vendor_Address: '',
        Vendor_City: '',
        Vendor_State: '',
        Vendor_Post_Code: '',
        Vendor_Phone_Number: '',
      });
    
      const [showVendorForm, setShowVendorForm] = useState(false); // State to control form visibility
    
      // Handle input change for vendor form
      const handleVendorInputChange = (e) => {
        setVendorDetails({ ...vendorDetails, [e.target.name]: e.target.value });
      };
    
      // Handle form submission
      const handleVendorSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:9004/api/addingVendors', vendorDetails);
          Swal.fire('Success!', response.data.message, 'success');
          setShowVendorForm(false); // Hide form after successful submission
        } catch (error) {
          Swal.fire('Error!', 'Failed to add vendor. Please try again.', 'error');
        }
      };
    
      // Show form when "Add Vendors" button is clicked
      const handleVendorAddClick = () => {
        setShowVendorForm(true);
      };
    
      // Hide form when "Cancel" button is clicked
      const handleVendorCancel = () => {
        setShowVendorForm(false);
      };
    

      // Updating selling price

      const [showVINForm, setShowVINForm] = useState(false);
      const [VIN, setVIN] = useState('');
      const [sellingPrice, setSellingPrice] = useState('');
    
      // Show the VIN form when the Update button is clicked
      const handleUpdateClick = () => {
        setShowVINForm(true);
      };
    
      // Handle VIN input change
      const handleVINInputChange = (e) => {
        setVIN(e.target.value);
      };
    
      // Handle VIN form submission
      const handleVINSubmit = async (e) => {
        e.preventDefault();
    
        try {
          // Call API to update selling price directly with VIN
          const response = await axios.post('http://localhost:9004/api/UpdateSellingPrice', {
            VIN
          });
    
          if (response.data.message === 'Selling price updated successfully') {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Selling price updated successfully!',
            });
            // Optionally, reset the form or the state here
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update selling price.',
            });
          }
        } catch (error) {
          console.error('Error updating selling price:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update selling price. Please try again.',
          });
        }
      };
    
    
      // Cancel the update operation
      const handleCancelUpdate = () => {
        setShowVINForm(false);
        setVIN('');
      };

      // update Parts Order Status

      const [Order_id, setOrderId] = useState('');
      const [Order_line_number, setOrderLineNumber] = useState('');
      const [Order_status, setOrderStatus] = useState(''); // 'Ordered', 'Received', 'Installed'
      const [showPartsForm, setShowPartsForm] = useState(false);
  
      const handlePartsStatus = () => {
          setShowPartsForm(!showPartsForm);
      };
  

  
      const handleOrderIdChange = (e) => {
          setOrderId(e.target.value);
      };
  
      const handleOrderLineNumberChange = (e) => {
          setOrderLineNumber(e.target.value);
      };
  
      const handleOrderStatusChange = (e) => {
          setOrderStatus(e.target.value);
      };
  
      const handlePartSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await axios.post('http://localhost:9004/api/updatingOrderStatus', {
            Order_id,
            Order_line_number,
            Order_status
          });
      
          if (response.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Order Status Updated Successfully',
            });
            // Reset form fields after successful submission
            setOrderId('');
            setOrderLineNumber('');
            setOrderStatus('');
            setShowPartsForm(false); // Close the form after successful submission
          }
        } catch (error) {
          console.error('Error while updating Order Status:', error);
      
          // Check if there's a response and handle specific error cases
          if (error.response) {
            if (error.response.status === 400) {
              Swal.fire({
                icon: 'info',
                title: 'Not Valid!',
                text: 'Invalid status transition. Cannot move Reverse',
              });
            } else if (error.response.status === 404) {
              Swal.fire({
                icon: 'info',
                title: 'Not Found',
                text: 'Please Check Order ID and Order Line number!',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update Order Status. Please try again later.',
              });
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Something went wrong. Please try again later.',
            });
          }
        }
      };
      
  
      const handleCanelParts = () => {
          setShowPartsForm(false);
          setOrderId('');
          setOrderLineNumber('');
          setOrderStatus('');
         
      };
  

    return (
      <> 
        <DashboardNavbar/>
      <div className="w-full h-full flex items-center justify-center p-4 lg:p-8 overflow-x-hidden">
  <div className="relative md:max-w-[1400px] mt-[50px] md:mt-[80px] flex flex-col p-4 sm:p-10 mx-auto w-full">
      <h1 className="text-gray-550 text-2xl sm:text-3xl text-center font-bold p-5">Welcome to Inventory Clerk Page</h1>

      {!showResults && (
          <div className="flex flex-col sm:flex-row gap-6 mt-5 w-full">
              <div className="w-full">
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

              <div className="flex flex-col sm:flex-row gap-6 w-full sm:justify-between">
                  <div className="w-full">
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
                      onClick={() => setShowAddVehicleForm(true)}
                      className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                      Add a Vehicle
                  </button>
              </div>
          </div>
      )}

                 {/* Show the car count dashboard */}
                 <div className='w-full flex items-center justify-center'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 mt-[20px] text-center w-full px-4">
                      <div className="bg-green-500 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold">Available Cars</h3>
                        <p className="text-4xl">{availableCarsCount}</p>
                      </div>
                      <div className="bg-yellow-500 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold">Pending Cars</h3>
                        <p className="text-4xl">{pendingCarsCount}</p>
                      </div>
                      <div className="bg-red-500 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold">Unsold Cars</h3>
                        <p className="text-4xl">{unsoldCarsCount}</p>
                      </div>
                    </div>
                  </div>
                              

                  <div className='flex flex-col gap-[25px]'>
                    <h1 className='text-center text-2xl text-gray-700 font-bold'>
                      Want to Update Selling Price and See the Items Quantity & Price
                    </h1>

                    <input
                      className="p-3 w-full lg:w-7/12 mx-auto border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200"
                      type='text'
                      placeholder='Enter VIN to see the Parts Item Cost'
                      value={vin}
                      onChange={(e) => setVin(e.target.value)}
                    />

                    <button
                      className="w-1/2 lg:w-1/4 mx-auto p-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
                      onClick={fetchPartsData}
                    >
                      Fetch Parts Data
                    </button>

                    {isModalOpen && (
                      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                        <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
                          <h2 className='text-xl font-semibold text-gray-800'>Parts and Sale Price Information</h2>
                          <p><strong>VIN:</strong> {partsData.VIN}</p>
                          <p><strong>Purchase Price:</strong> ${partsData.Purchase_Price}</p>
                          <p><strong>Part Name:</strong> {partsData.each_part}</p>
                          <p><strong>Part Cost:</strong> ${partsData.each_part_cost}</p>
                          <p><strong>Total Parts Cost:</strong> ${partsData.total_cost_of_parts}</p>
                          <p><strong>Sale Price:</strong> ${partsData.sale_price}</p>

                          {/* Close button */}
                          <button
                            className="mt-4 p-2 bg-red-500 text-white rounded-lg w-full"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

               


           

                {/* // grid for parts orders and vendors */}
            <div className='md:grid grid-cols-4 p-4 md:gap-0 gap-10'>
                {/* // Parts Order Items  */}
                <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[20px]">
                    {/* Button to display the form */}
                    <div className="flex flex-col gap-[25px] mt-[30px]">
                        <h1 className="text-center text-2xl text-gray-700 font-bold">You Want to Place Order Parts</h1>
                        <div className="text-center">
                        <button
                            className="p-4 bg-blue-700 text-white rounded-lg"
                            onClick={handleOrderButtonClick}
                        >
                            Order Parts
                        </button>
                        </div>
                    </div>

                    {/* Form to be displayed only when "Order Parts" is clicked */}
                    {showForm && (
                        <form onSubmit={handleSubmit}>
                        {/* Order Details */}
                        <div className="mb-4 mt-8">
                            <label className="block text-sm font-medium text-gray-700">Order ID</label>
                            <input
                            type="text"
                            name="Order_id"
                            value={orderDetails.Order_id}
                            onChange={handleOrderDetailsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">VIN</label>
                            <input
                            type="text"
                            name="VIN"
                            value={orderDetails.VIN}
                            onChange={handleOrderDetailsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Vendor ID</label>
                            <input
                            type="text"
                            name="Vendor_id"
                            value={orderDetails.Vendor_id}
                            onChange={handleOrderDetailsChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                            />
                        </div>

                        {/* Parts Section */}
                        <h2 className="text-xl font-semibold mb-4">Parts</h2>
                        {parts.map((part, index) => (
                            <div key={index} className="mb-4 border-t border-gray-200 pt-4">
                            <h3 className="text-lg font-semibold mb-2">Part {index + 1}</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Order Line Number</label>
                                <input
                                type="text"
                                name="Order_line_number"
                                value={part.Order_line_number}
                                onChange={(e) => handlePartChange(index, e)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Purchase Order Number</label>
                                <input
                                type="text"
                                name="Purchase_order_number"
                                value={part.Purchase_order_number}
                                onChange={(e) => handlePartChange(index, e)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Order Status</label>
                                <select
                                name="Order_status"
                                value={part.Order_status}
                                onChange={(e) => handlePartChange(index, e)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                >
                                <option value="Ordered">Ordered</option>
                                <option value="Received">Received</option>
                                <option value="Installed">Installed</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Part Unit Price</label>
                                <input
                                type="number"
                                name="Part_unit_price"
                                value={part.Part_unit_price}
                                onChange={(e) => handlePartChange(index, e)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Part Quantity</label>
                                <input
                                type="number"
                                name="Part_quantity"
                                value={part.Part_quantity}
                                onChange={(e) => handlePartChange(index, e)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Part Description</label>
                                <textarea
                                name="Part_description"
                                value={part.Part_description}
                                onChange={(e) => handlePartChange(index, e)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>

                            <button
                                type="button"
                                className="text-red-500"
                                onClick={() => removePart(index)}
                            >
                                Remove Part
                            </button>
                            </div>
                        ))}

                        <div className='flex justify-between'>
                            <button
                                type="button"
                                onClick={addPart}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow"
                            >
                                Add Part
                            </button>

                            <button
                                type="submit"
                                className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md shadow"
                            >
                                Submit Order
                            </button>

                            <button
                                type="button"
                                onClick={handleCloseForm}
                                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md shadow"
                            >
                            Close
                            </button>

                        </div>

                        </form>
                    )}
                 </div>

                    {/* grid for adding vendors */}

                    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[20px]">
                        {/* Button to display the form */}
                        <div className="flex flex-col gap-[25px] mt-[30px]">
                            <h1 className="text-center text-2xl text-gray-700 font-bold">Want to add Vendors</h1>
                            <div className="text-center">
                            <button
                                className="p-4 bg-blue-700 text-white rounded-lg"
                                onClick={handleVendorAddClick}
                            >
                                Add Vendors
                            </button>
                            </div>
                        </div>

                        {/* Form to be displayed only when "Add Vendors" is clicked */}
                        {showVendorForm && (
                            <div className="mt-8">
                            <form onSubmit={handleVendorSubmit}>
                                <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Vendor ID</label>
                                <input
                                    type="text"
                                    name="Vendor_id"
                                    value={vendorDetails.Vendor_id}
                                    onChange={handleVendorInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                                </div>

                                <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                                <input
                                    type="text"
                                    name="Vendor_Name"
                                    value={vendorDetails.Vendor_Name}
                                    onChange={handleVendorInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                                </div>

                                <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Vendor Address</label>
                                <input
                                    type="text"
                                    name="Vendor_Address"
                                    value={vendorDetails.Vendor_Address}
                                    onChange={handleVendorInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                                </div>

                                <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Vendor City</label>
                                <input
                                    type="text"
                                    name="Vendor_City"
                                    value={vendorDetails.Vendor_City}
                                    onChange={handleVendorInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                                </div>

                                <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Vendor State</label>
                                <input
                                    type="text"
                                    name="Vendor_State"
                                    value={vendorDetails.Vendor_State}
                                    onChange={handleVendorInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                                </div>

                                <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Vendor Post Code</label>
                                <input
                                    type="text"
                                    name="Vendor_Post_Code"
                                    value={vendorDetails.Vendor_Post_Code}
                                    onChange={handleVendorInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                                </div>

                                <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Vendor Phone Number</label>
                                <input
                                    type="text"
                                    name="Vendor_Phone_Number"
                                    value={vendorDetails.Vendor_Phone_Number}
                                    onChange={handleVendorInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                                </div>

                                {/* Submit and Cancel buttons */}
                                <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded-md shadow"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={handleVendorCancel}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md shadow"
                                >
                                    Cancel
                                </button>
                                </div>
                            </form>
                            </div>
                        )}
                        </div>

                       {/* 3rd grid  */}
                      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[20px]">
                        <div className="flex flex-col gap-[25px] mt-[30px]">
                          <h1 className="text-center text-2xl text-gray-700 font-bold">Update Selling Price</h1>
                          <div className="text-center">
                            <button
                              className="p-4 bg-blue-700 text-white rounded-lg"
                              onClick={handleUpdateClick}
                            >
                              Update
                            </button>
                          </div>
                        </div>

                        {/* Form to enter VIN, shown when "Update" is clicked */}
                        {showVINForm && (
                          <div className="mt-8">
                            <form onSubmit={handleVINSubmit}>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">VIN Number</label>
                                <input
                                  type="text"
                                  value={VIN}
                                  onChange={handleVINInputChange}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                  required
                                />
                              </div>

                              {/* Submit and Cancel buttons */}
                              <div className="flex justify-between">
                                <button
                                  type="submit"
                                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow"
                                >
                                  Submit
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelUpdate}
                                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>

                            {/* 4rd grid  */}
                            <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[20px]">
            <div className="flex flex-col gap-[25px] mt-[30px]">
                <h1 className="text-center text-2xl text-gray-700 font-bold">Update Parts Status</h1>
                <div className="text-center">
                    <button
                        className="p-4 bg-blue-700 text-white rounded-lg"
                        onClick={handlePartsStatus}
                    >
                        Update
                    </button>
                </div>
            </div>

            {/* Form to enter Part Details, shown when "Update" is clicked */}
            {showPartsForm && (
                <div className="mt-8">
                    <form onSubmit={handlePartSubmit}>
                        {/* Order ID */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Order ID</label>
                            <input
                                type="text"
                                value={Order_id}
                                onChange={handleOrderIdChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        {/* Order Line Number */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Order Line Number</label>
                            <input
                                type="number"
                                value={Order_line_number}
                                onChange={handleOrderLineNumberChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>

                        {/* Order Status */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Order Status</label>
                            <select
                                value={Order_status}
                                onChange={handleOrderStatusChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            >
                                <option value="" disabled>Select Status</option>
                                <option value="Ordered">Ordered</option>
                                <option value="Received">Received</option>
                                <option value="Installed">Installed</option>
                            </select>
                        </div>

                        {/* Submit and Cancel buttons */}
                        <div className="flex justify-between">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-md shadow"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={handleCanelParts}
                                className="bg-red-500 text-white px-4 py-2 rounded-md shadow"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>

                </div>

                {/* Add Vehicle Form */}
                {!showResults && showAddVehicleForm && (
                    <div className="absolute flex justify-center items-center bg-opacity-0 p-[8px] rounded-lg">
                        <div className="max-w-[800px] p-5 bg-white text-center shadow-lg rounded-lg mt-[20px]">
                            <h2 className="text-lg font-bold mb-4">Add Vehicle</h2>
                            <form onSubmit={handleAddVehicle}>
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="VIN"
                                    value={vehicleData.VIN}
                                    onChange={(e) => setVehicleData({ ...vehicleData, VIN: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Vehicle Type"
                                    value={vehicleData.Vehicle_type}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Vehicle_type: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Manufacturer Name"
                                    value={vehicleData.Manufacturer_name}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Manufacturer_name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Model Name"
                                    value={vehicleData.Model_name}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Model_name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Model Year"
                                    value={vehicleData.Model_year}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Model_year: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Fuel Type"
                                    value={vehicleData.Fuel_type}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Fuel_type: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Color"
                                    value={vehicleData.Color}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Color: e.target.value })}
                                    required
                                />
                                <input
                                    type="number"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Mileage"
                                    value={vehicleData.Mileage}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Mileage: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Additional Description"
                                    value={vehicleData.Additional_description}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Additional_description: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Bought from Customer ID"
                                    value={vehicleData.Bought_from_customer_id}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Bought_from_customer_id: e.target.value })}
                                    required
                                />
                                <input
                                    type="date"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    value={vehicleData.Purchase_date}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Purchase_date: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Purchased by Employee"
                                    value={vehicleData.Purchased_by_employee}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Purchased_by_employee: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Updated by Employee"
                                    value={vehicleData.Updated_by_employee}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Updated_by_employee: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Vehicle Condition"
                                    value={vehicleData.Vehicle_condition}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Vehicle_condition: e.target.value })}
                                    required
                                />
                                <input
                                    type="number"
                                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                                    placeholder="Purchase Price"
                                    value={vehicleData.Purchase_Price}
                                    onChange={(e) => setVehicleData({ ...vehicleData, Purchase_Price: e.target.value })}
                                    required
                                />

                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add Vehicle</button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg ml-4"
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Display Search Results */}
                {showResults && <SearchResults results={results} />}
            </div>
        </div>
        </> 
    );
}

export default InventeryClerk;
