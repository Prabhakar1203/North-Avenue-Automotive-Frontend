import { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";

function Manager() {
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

                // Fetch Sold Cars Count
                fetch('http://localhost:9004/api/getSoldCars')
                    .then((response) => response.json())
                    .then((data) => setSoldCarsCount(data[0].sold_Vehicles_Count))
                    .catch((error) => console.error('Error fetching sold cars:', error));

                // Fetch Unsold Cars Count
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

    // Function to handle VIN search
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchedCar) return;

        try {
            // Fetch data from all four APIs using the VIN
            const [managerResponse, sellerResponse, buyerResponse, partsResponse] = await Promise.all([
                fetch(`http://localhost:9004/api/getManagerSearchByVIN`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ searched_Car: searchedCar })
                }).then(res => res.json()),

                fetch(`http://localhost:9004/api/getSellerDetailsByVIN`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ searched_Car: searchedCar })
                }).then(res => res.json()),

                fetch(`http://localhost:9004/api/getBuyerDetailsByVIN`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ searched_Car: searchedCar })
                }).then(res => res.json()),

                fetch(`http://localhost:9004/api/totalCostOfParts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ VIN: searchedCar })
                }).then(res => res.json())
            ]);

            // Store the data in state
            setManagerData(managerResponse);
            setSellerData(sellerResponse);
            setBuyerData(buyerResponse);
            setPartsData(partsResponse);

            // Show the modal with the grid
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching vehicle details:', error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setManagerData(null);
        setSellerData(null);
        setBuyerData(null);
        setPartsData(null);
    };

    return (
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
                    <div className="bg-green-500 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold">Available Cars</h3>
                        <p className="text-4xl">{availableCarsCount}</p>
                    </div>
                    <div className="bg-yellow-500 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold">Pending Cars</h3>
                        <p className="text-4xl">{pendingCarsCount}</p>
                    </div>
                    <div className="bg-blue-500 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold">Sold Cars</h3>
                        <p className="text-4xl">{soldCarsCount}</p>
                    </div>
                    <div className="bg-red-500 text-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold">Unsold Cars</h3>
                        <p className="text-4xl">{unsoldCarsCount}</p>
                    </div>
                </div>

                {/* Display modal with grid data when a VIN is searched */}
                {showModal && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white w-11/12 md:w-4/5 h-4/5 max-h-full overflow-auto p-5 rounded-lg relative">
                            <button onClick={closeModal} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full">Close</button>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                                {/* Grid 1: Manager Search by VIN */}
                                <div className="bg-gray-100 p-5 overflow-auto m-5">
                                    <h2 className="text-lg font-semibold mb-3 text-center font-bold text-2xl">Vehicle Details</h2>
                                    <div style={{ textAlign: 'center' }}>
                                        {managerData && Object.keys(managerData).map((key) => {
                                            const value = managerData[key];
                                            if (typeof value === 'object' && value !== null) {
                                                return (
                                                    <div key={key}>
                                                        {Object.keys(value).map((nestedKey) => (
                                                            <div key={nestedKey}>
                                                                {nestedKey}: {value[nestedKey]}
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div key={key}>
                                                    {key}: {value}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                {/* Grid 2: Seller Details by VIN */}
                                <div className="bg-gray-100 p-5 overflow-auto">
                                    <h2 className="text-lg font-semibold mb-3 text-center font-bold text-2xl">Seller Details</h2>
                                    <div style={{ textAlign: 'center' }}>
                                        {sellerData && Object.keys(sellerData).map((key) => {
                                            const value = sellerData[key];
                                            if (typeof value === 'object' && value !== null) {
                                                return (
                                                    <div key={key}>
                                                        {Object.keys(value).map((nestedKey) => (
                                                            <div key={nestedKey}>
                                                                {nestedKey}: {value[nestedKey]}
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div key={key}>
                                                    {key}: {value}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                {/* Grid 3: Buyer Details by VIN */}
                                <div className="bg-gray-100 p-5 overflow-auto">
                                    <h2 className="text-lg font-semibold mb-3 text-center font-bold text-2xl">Buyer Details</h2>
                                    <div style={{ textAlign: 'center' }}>
                                        {buyerData && Object.keys(buyerData).map((key) => {
                                            const value = buyerData[key];
                                            if (typeof value === 'object' && value !== null) {
                                                return (
                                                    <div key={key}>
                                                        {Object.keys(value).map((nestedKey) => (
                                                            <div key={nestedKey}>
                                                                {nestedKey}: {value[nestedKey]}
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div key={key}>
                                                    {key}: {value}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Grid 4: Total Cost of Parts */}
                                <div className="bg-gray-100 p-5 overflow-auto">
                                    <h2 className="text-lg font-semibold mb-3 text-center font-bold text-2xl">Parts Cost</h2>
                                    <div style={{ textAlign: 'center' }}>
                                        {partsData && Object.keys(partsData).map((key) => {
                                            const value = partsData[key];
                                            if (typeof value === 'object' && value !== null) {
                                                return (
                                                    <div key={key}>
                                                        {Object.keys(value).map((nestedKey) => (
                                                            <div key={nestedKey}>
                                                                {nestedKey}: {value[nestedKey]}
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div key={key}>
                                                    {key}: {value}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Manager;
