import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DashboardNavbar from '../components/DashboardNavbar';
function AverageTimeInInventory() {
    const { user } = useSelector((state) => state.user);
    const [inventoryData, setInventoryData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:9004/api/getAverageTimeInInventory')
            .then(response => setInventoryData(response.data))
            .catch(error => console.error('Error fetching average time in inventory:', error));
    }, []);

    return (
        <>
        <DashboardNavbar/>
            <div className='max-w-[1400px] mx-auto flex flex-col items-center justify-center  p-[150px] '>
                <h1 className='text-4xl p-4 font-bold '>Average Inventery Time</h1>
                <table className="border-collapse border-3 border-slate-400 w-full">
                    <thead>
                        <tr className="bg-slate-300 ">
                            <th className="px-4 py-2 border border-slate-400">Vehicle Type</th>
                            <th className="px-4 py-2 border border-slate-400">Average Days In Inventory</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData.map((item, index) => (
                            <tr key={index}  className={index % 2 === 0 ? 'bg-white' : 'bg-slate-200'}>
                                <td className="px-4 py-2 border border-slate-400">{item.Vehicle_type}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Avg_Days_In_Inventory}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </>
    );
}

export default AverageTimeInInventory;
