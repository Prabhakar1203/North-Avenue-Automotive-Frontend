import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DashboardNavbar from '../components/DashboardNavbar';

function SalesHistory() {
    const [salesData, setSalesData] = useState([]);
    const { user } = useSelector((state) => state.user);
    useEffect(() => {
        axios.get('http://localhost:9004/api/salesmanhistory')
            .then(response => setSalesData(response.data))
            .catch(error => console.error('Error fetching average time in inventory:', error));
    }, []);

    return (
        <> 
        <DashboardNavbar/>
        <div className='max-w-[1400px] mx-auto flex flex-col items-center justify-center  p-[150px] '>
            <h1 className='text-4xl p-4 font-bold '>Sales History</h1>
            <table className="border-collapse border-3 border-slate-400 w-full">
                <thead>
                    <tr className="bg-slate-300 ">
                        <th className="px-4 py-2 border border-slate-400">VIN</th>
                        <th className="px-4 py-2 border border-slate-400">Employee_Id</th>
                        <th className="px-4 py-2 border border-slate-400">Customer_Id</th>
                        <th className="px-4 py-2 border border-slate-400">Last_Name</th>
                        <th className="px-4 py-2 border border-slate-400"> First_Name</th>
                        <th className="px-4 py-2 border border-slate-400">Sold_date</th>
                        <th className="px-4 py-2 border border-slate-400">Selling_Price</th>
                    </tr>
                </thead>
                <tbody>
                    {salesData.map((item, index) => (
                        <tr key={index}  className={index % 2 === 0 ? 'bg-white' : 'bg-slate-200'}>
                            <td className="px-4 py-2 border border-slate-400">{item.VIN}</td>
                            <td className="px-4 py-2 border border-slate-400">{item.Employee_Id}</td>
                            <td className="px-4 py-2 border border-slate-400">{item.Customer_Id}</td>
                            <td className="px-4 py-2 border border-slate-400">{item.Last_Name}</td>
                            <td className="px-4 py-2 border border-slate-400">{item.First_Name}</td>
                            <td className="px-4 py-2 border border-slate-400">{item.Sold_date}</td>
                            <td className="px-4 py-2 border border-slate-400">{item.Selling_Price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
        </>
    );
}

export default SalesHistory;
