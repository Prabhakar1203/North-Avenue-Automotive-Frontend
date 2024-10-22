import { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { useSelector } from 'react-redux';
import DashboardNavbar from '../components/DashboardNavbar';
import axios from 'axios';
function Manager() {
    const { user } = useSelector((state) => state.user);
    const [availableCarsCount, setAvailableCarsCount] = useState(0);
    const [pendingCarsCount, setPendingCarsCount] = useState(0);
    const [soldCarsCount, setSoldCarsCount] = useState(0);
    const [unsoldCarsCount, setUnsoldCarsCount] = useState(0);
    const [searchedCar, setSearchedCar] = useState('');
    const [showModal, setShowModal] = useState(false);

    // States for storing the fetched data for grids
    const [managerData, setManagerData] = useState(null);
    const [sellerData, setSellerData] = useState(null);
    const [buyerData, setBuyerData] = useState(null);
    const [partsData, setPartsData] = useState(null);

    // Fetch Available Cars Count
    useEffect(() => {
        const fetchAvailableCars = async () => {
            try {
                const response = await fetch('http://localhost:9004/api/getAvailableCars');
                const data = await response.json();
                setAvailableCarsCount(data[0]["available cars"]);
            } catch (error) {
                console.error('Error fetching available cars:', error);
            }
        };
        fetchAvailableCars();
    }, []);

    // Fetch Pending Cars Count
    useEffect(() => {
        const fetchPendingCars = async () => {
            try {
                const response = await fetch('http://localhost:9004/api/getPendingCars');
                const data = await response.json();
                setPendingCarsCount(data[0].Pending_Parts_Count);
            } catch (error) {
                console.error('Error fetching pending cars:', error);
            }
        };
        fetchPendingCars();
    }, []);

    // Fetch Sold Cars Count
    useEffect(() => {
        const fetchSoldCars = async () => {
            try {
                const response = await fetch('http://localhost:9004/api/getSoldCars');
                const data = await response.json();
                setSoldCarsCount(data[0].sold_Vehicles_Count);
            } catch (error) {
                console.error('Error fetching sold cars:', error);
            }
        };
        fetchSoldCars();
    }, []);

    // Fetch Unsold Cars Count
    useEffect(() => {
        const fetchUnsoldCars = async () => {
            try {
                const response = await fetch('http://localhost:9004/api/getUnsoldCars');
                const data = await response.json();
                setUnsoldCarsCount(data[0].Unsold_Vehicles_Count);
            } catch (error) {
                console.error('Error fetching unsold cars:', error);
            }
        };
        fetchUnsoldCars();
    }, []);

    // Function to handle VIN search and fetch data for individual grids
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchedCar) return;

        // Fetch Manager Data
        const fetchManagerData = async () => {
            try {
                const response = await fetch(`http://localhost:9004/api/getManagerSearchByVIN`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ searched_Car: searchedCar }),
                });
                const data = await response.json();
                setManagerData(data);
            } catch (error) {
                console.error('Error fetching vehicle details:', error);
                setManagerData(null);  // If failed, reset to null
            }
        };

        // Fetch Seller Data
        const fetchSellerData = async () => {
            try {
                const response = await fetch(`http://localhost:9004/api/getSellerDetailsByVIN`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ searched_Car: searchedCar }),
                });
                const data = await response.json();
                setSellerData(data);
            } catch (error) {
                console.error('Error fetching seller details:', error);
                setSellerData(null);  // If failed, reset to null
            }
        };

        // Fetch Buyer Data
        const fetchBuyerData = async () => {
            try {
                const response = await fetch(`http://localhost:9004/api/getBuyerDetailsByVIN`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ searched_Car: searchedCar }),
                });
                const data = await response.json();
                setBuyerData(data);
            } catch (error) {
                console.error('Error fetching buyer details:', error);
                setBuyerData(null);  // If failed, reset to null
            }
        };

        // Fetch Parts Data
        const fetchPartsData = async () => {
            try {
                const response = await fetch(`http://localhost:9004/api/totalCostOfParts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ VIN: searchedCar }),
                });
                const data = await response.json();
                setPartsData(data);
            } catch (error) {
                console.error('Error fetching parts cost:', error);
                setPartsData(null);  // If failed, reset to null
            }
        };

        // Call all APIs after search
        await Promise.all([fetchManagerData(), fetchSellerData(), fetchBuyerData(), fetchPartsData()]);

        // Show the modal with the grid data
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setManagerData(null);
        setSellerData(null);
        setBuyerData(null);
        setPartsData(null);
    };

    // displaying VIN list

    // State for handling modal and VIN data
    const [vinList, setVinList] = useState([]);
    const [modalTitle, setModalTitle] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to fetch VIN list from API
    const fetchVinList = async (apiUrl, title) => {
        try {
            const response = await axios.get(apiUrl);
            setVinList(response.data); // Assuming API returns array of VINs
            setModalTitle(title);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching VIN list', error);
        }
    };

    // Handlers for each dashboard click
    const handleAvailableCarsClick = () => {
        fetchVinList('http://localhost:9004/api/getAvailableCarList', 'Available VIN List');
    };

    const handlePendingCarsClick = () => {
        fetchVinList('http://localhost:9004/api/getPendingCarList', 'Pending VIN List');
    };

    const handleSoldCarsClick = () => {
        fetchVinList('http://localhost:9004/api/getSoldCarList', 'Sold VIN List');
    };

    const handleUnsoldCarsClick = () => {
        fetchVinList('http://localhost:9004/api/getUnSoldCarList', 'Unsold VIN List');
    };

    // Function to close modal
    const closeModalVinList = () => {
        setIsModalOpen(false);
        setVinList([]);
    };


    return (
        <>
            {/* <DashboardNavbar /> */}
            <div className="w-full h-full flex items-center justify-center p-5 md:p-[200px] p-[270px]">
                <div className="absolute max-w-[1400px] mx-auto mt-[150px] flex flex-col p-5">
                    <h1 className="text-gray-550 text-3xl text-center font-bold p-5">Welcome to Manager Page</h1>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative w-full max-w-[450px] mx-auto mb-10">
                        <input
                            className="p-3 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200"
                            type="text"
                            value={searchedCar}
                            onChange={(e) => setSearchedCar(e.target.value)}
                            required
                            placeholder="Search Vehicle by VIN"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">
                            <FaSearch />
                        </button>
                    </form>

                    {/* Show the car count dashboard */}

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                            <div className="bg-green-500 text-white p-6 rounded-lg cursor-pointer" onClick={handleAvailableCarsClick}>
                                <h3 className="text-lg font-semibold">Available Cars</h3>
                                <p className="text-4xl">{availableCarsCount}</p>
                            </div>
                            <div className="bg-yellow-500 text-white p-6 rounded-lg cursor-pointer" onClick={handlePendingCarsClick}>
                                <h3 className="text-lg font-semibold">Pending Cars</h3>
                                <p className="text-4xl">{pendingCarsCount}</p>
                            </div>
                            <div className="bg-blue-500 text-white p-6 rounded-lg cursor-pointer" onClick={handleSoldCarsClick}>
                                <h3 className="text-lg font-semibold">Sold Cars</h3>
                                <p className="text-4xl">{soldCarsCount}</p>
                            </div>
                            <div className="bg-red-500 text-white p-6 rounded-lg cursor-pointer" onClick={handleUnsoldCarsClick}>
                                <h3 className="text-lg font-semibold">Unsold Cars</h3>
                                <p className="text-4xl">{unsoldCarsCount}</p>
                            </div>
                        </div>

            {/* Modal for displaying VIN list */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{modalTitle}</h2>
                            <button className="text-gray-500" onClick={closeModalVinList}>
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-80">
                            {vinList.length > 0 ? (
                                <ul>
                                    {vinList.map((vin, index) => (
                                        <li key={index} className="border-b p-2">
                                            {vin.vinlist}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No VINs available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

                    {/* Display modal with grid data when a VIN is searched */}
                    {showModal && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white w-11/12 md:w-4/5 h-4/5 max-h-full overflow-auto p-5 rounded-lg relative">
                                <button onClick={closeModal} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full">Close</button>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                                    {/* Grid 1: Manager Search by VIN */}
                                    <div className="bg-gray-100 p-5 m-5">
    <h2 className="text-lg font-semibold mb-3 text-center font-bold text-4xl">Vehicle Details</h2>
    <div className="overflow-auto p-5">
        <div className="flex space-x-4">
            {managerData && managerData.length > 0 ? (
                managerData.map((item, index) => (
                    <div key={index} className="flex-none text-left">
                        <p>VIN: {item.VIN}</p>
                        <p>Manufacturer: {item.Manufacturer_name}</p>
                        <p>Year: {item.Model_year}</p>
                        <p>Fuel: {item.Fuel_type}</p>
                        <p>Color: {item.Color}</p>
                    </div>
                ))
            ) : (
                <p>No vehicle data available.</p>
            )}
        </div>
    </div>
</div>


                                    {/* Grid 2: Seller Details */}
                                 {/* Seller Details */}
<div className="bg-gray-100 p-5 overflow-auto m-5">
    <h2 className="text-lg font-semibold mb-3 text-center font-bold text-2xl">Seller Details</h2>
    <div className="overflow-auto p-5">
    <div className="flex space-x-4 p-5">
        {sellerData ? (
            sellerData.map((item, index) => (
                <div key={index} className="flex-none text-left space-y-1">
                    <p>Seller_Customer_ID = {item.Seller_Customer_ID}</p>
                    <p>Seller_First_Name = {item.Seller_First_Name}</p>
                    <p>Seller_Last_Name = {item.Seller_Last_Name}</p>
                    <p>Seller_Street = {item.Seller_Street}</p>
                    <p>Seller_City = {item.Seller_City}</p>
                    <p>Purchase_date = {new Date(item.Purchase_date).toLocaleDateString()}</p>
                    <p>Purchase_Price = {item.Purchase_Price}</p>
                    <p>Seller_State = {item.Seller_State}</p>
                    <p>Seller_Postal_Code = {item.Seller_Postal_Code}</p>
                    <p>Seller_Phone_Number = {item.Seller_Phone_Number}</p>
                    <p>Inventory_Clerk_First_Name = {item.Inventory_Clerk_First_Name}</p>
                    <p>Inventory_Clerk_Last_Name = {item.Inventory_Clerk_Last_Name}</p>
                </div>
            ))
        ) : (
            <p>No seller data available.</p>
        )}
        </div>
    </div>
</div>

{/* Buyer Details */}
<div className="bg-gray-100 p-5 overflow-auto m-5">
    <h2 className="text-lg font-semibold mb-3 text-center font-bold text-2xl">Buyer Details</h2>
    <div className="overflow-auto p-5">
    <div className="flex space-x-4 p-5">
        {buyerData && buyerData.length > 0 ? (
            buyerData[0].Buyer_Customer_ID === null ? (
                <p>Car is still in inventory.</p>
            ) : (
                <div className="flex-none text-left space-y-1">
                    <p>Buyer_Customer_ID = {buyerData[0].Buyer_Customer_ID}</p>
                    <p>Buyer_First_Name = {buyerData[0].Buyer_First_Name}</p>
                    <p>Buyer_Last_Name = {buyerData[0].Buyer_Last_Name}</p>
                    <p>Buyer_Street = {buyerData[0].Buyer_Street}</p>
                    <p>Buyer_City = {buyerData[0].Buyer_City}</p>
                    <p>Buyer_State = {buyerData[0].Buyer_State}</p>
                    <p>Buyer_Postal_Code = {buyerData[0].Buyer_Postal_Code}</p>
                    <p>Buyer_Phone_Number = {buyerData[0].Buyer_Phone_Number}</p>
                    <p>Buyer_Email = {buyerData[0].Buyer_Email}</p>
                    <p>Purchase_date = {new Date(buyerData[0].Purchase_date).toLocaleDateString()}</p>
                    <p>Purchase_Price = {buyerData[0].Purchase_Price}</p>
                    <p>Salesperson_First_Name = {buyerData[0].Salesperson_First_Name}</p>
                    <p>Salesperson_Last_Name = {buyerData[0].Salesperson_Last_Name}</p>
                </div>
            )
        ) : (
            <p>No buyer data available.</p>
        )}
        </div>
    </div>
</div>

{/* Parts Details */}
<div className="bg-gray-100 p-5 overflow-auto m-5">
    <h2 className="text-lg font-semibold mb-3 text-center font-bold text-2xl">Total Parts Cost</h2>
    <div className="overflow-auto p-5">
    <div className="flex space-x-4 p-5">
        {partsData ? (
            <div className="flex-none text-left space-y-1">
                <p>VIN = {partsData.VIN}</p>
                <p>Actual Parts Price = ${parseFloat(partsData.parts_price_actual).toFixed(2)}</p>
                <p>Total Parts Price = ${parseFloat(partsData.total_parts_price).toFixed(2)}</p>
            </div>
        ) : (
            <p>No parts data ordered.</p>
        )}
        </div>
    </div>
</div>



                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Manager;
