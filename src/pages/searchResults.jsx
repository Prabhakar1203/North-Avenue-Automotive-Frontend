import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const SearchResults = ({ results }) => {
  const [customerData, setCustomerData] = useState({
    Customer_id: '',
    Username: '',
    Selling_Price: '',
    Sold_date: new Date().toISOString().split('T')[0], // Default to current date
  });

  const handleSellClick = async (vehicle) => {
    const { VIN, Selling_Price } = vehicle;
  
    // Show Swal input form for customer details
    const { value: formValues } = await Swal.fire({
      title: 'Enter Sale Details',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Customer ID" required>
        <input id="swal-input2" class="swal2-input" placeholder="Employee ID" required>
        <input id="swal-input3" class="swal2-input" placeholder="Sale Price" value="${Selling_Price}" required>
        <input id="swal-input4" type="date" class="swal2-input" placeholder="Sale Date" value="${new Date().toISOString().split('T')[0]}" required>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          Customer_id: document.getElementById('swal-input1').value,
          Username: document.getElementById('swal-input2').value,
          Selling_Price: parseFloat(document.getElementById('swal-input3').value),
          Sold_date: document.getElementById('swal-input4').value,
        };
      },
    });
  
    if (formValues) {
      try {
        // 1. Send the data to sell the car, matching the backend's expected keys
        const response = await axios.post('http://localhost:9004/api/sellConfirmation', {
          Customer_id: formValues.Customer_id,   // Correct key
          Username: formValues.Username,         // Correct key
          Selling_Price: formValues.Selling_Price, // Correct key
          Sold_date: formValues.Sold_date,       // Correct key
          VIN,                                   // Pass the vehicle VIN
        });
  
        if (response.data.message === "Car successfully sold and vehicle data updated") {
          // Show success message for the sale operation
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Car successfully sold.',
          });
        } else {
          throw new Error('Failed to sell the car');
        }
      } catch (error) {
        console.error('Error during car sale:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An error occurred while selling the car.',
        });
      }
    }
  };

  return (
    <div className="absolute w-full min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4">
      <h3 className="text-lg font-bold mb-4">Search Results</h3>
      
      {/* Full-screen flex container with a responsive grid layout */}
      <div className="grid grid-cols-2  gap-4 w-full max-w-screen-xl">
        {results.map((vehicle) => (
          <div
            key={vehicle.VIN}
            className="border p-4 rounded-lg shadow-lg bg-white flex flex-col gap-4 justify-between"
          >
            <h4 className="font-semibold">
              <p><strong>Vehicle Type:</strong> {vehicle.Manufacturer_name}</p>
            </h4>
            <p><strong>Model:</strong> {vehicle.Model_year}</p>
            <p><strong>VIN:</strong> {vehicle.VIN}</p>
            <p><strong>Type:</strong> {vehicle.Vehicle_Type}</p>
            <p><strong>Fuel:</strong> {vehicle.Fuel_type}</p>
            <p><strong>Color:</strong> {vehicle.Color}</p>
            <p><strong>Price:</strong> ${vehicle.Selling_Price ? vehicle.Selling_Price.toLocaleString() : 'N/A'}</p>
            <button
              type="button"
              onClick={() => handleSellClick(vehicle)} // Trigger the sell function on button click
              className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Sell
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
