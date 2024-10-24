import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import DashboardNavbar from '../components/DashboardNavbar';

const SearchResults = ({ results }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate(); // React Router's navigation hook

  const [customerData, setCustomerData] = useState({
    Customer_id: '',
    Username: '',
    Selling_Price: '',
    Sold_date: new Date().toISOString().split('T')[0], // Default to current date
  });

  const handleSellClick = async (vehicle) => {
    const { VIN, Selling_Price } = vehicle;

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
        const response = await axios.post('http://localhost:9004/api/sellConfirmation', {
          Customer_id: formValues.Customer_id,
          Username: formValues.Username,
          Selling_Price: formValues.Selling_Price,
          Sold_date: formValues.Sold_date,
          VIN,
        });

        if (response.data.message === "Car successfully sold and vehicle data updated") {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Car successfully sold.',
          });
        } else {
          throw new Error('Failed to sell the car');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An error occurred while selling the car.',
        });
      }
    }
  };

  const handleClose = () => {
    // Navigate back to the previous page or home
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
      <div className="absolute w-full flex flex-col items-center justify-start bg-gray-100 p-4 mx-4">
        <h3 className="text-lg font-bold mb-4">Search Results</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full max-w-screen-xl max-h-[500px] overflow-y-auto">
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
              <p className="text-red-600 text-center font-semibold">Want to buy? Please Contact Salesman</p>
              {/* Uncomment if you want the Sell button */}
              {/* <button
                type="button"
                onClick={() => handleSellClick(vehicle)}
                className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Sell
              </button> */}
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </>
  );
};

export default SearchResults;
