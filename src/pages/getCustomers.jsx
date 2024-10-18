import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DashboardNavbar from '../components/DashboardNavbar';

function GetCustomers() {
    const [customersData, setCustomersData] = useState([]);
    const { user } = useSelector((state) => state.user);
    useEffect(() => {
        axios.get('http://localhost:9004/api/getCustomers')
            .then(response => setCustomersData(response.data))
            .catch(error => console.error('Error fetching average time in inventory:', error));
    }, []);

    return (
        <>
            <DashboardNavbar/>
            <div className='max-w-[1400px] mx-auto flex flex-col items-center justify-center  p-[150px] '>
                <h1 className='text-4xl p-4 font-bold '> Customers Data</h1>
                <table className="border-collapse border-3 border-slate-400 w-full">
                    <thead>
                        <tr className="bg-slate-300 ">
                            <th className="px-4 py-2 border border-slate-400">Customer_id</th>
                            <th className="px-4 py-2 border border-slate-400">First_name</th>
                            <th className="px-4 py-2 border border-slate-400">Last_name</th>
                            <th className="px-4 py-2 border border-slate-400">Phone_number</th>
                            <th className="px-4 py-2 border border-slate-400"> Customer_type_Bus_Or_Ind</th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        {customersData.map((item, index) => (
                            <tr key={index}  className={index % 2 === 0 ? 'bg-white' : 'bg-slate-200'}>
                                <td className="px-4 py-2 border border-slate-400">{item.Customer_id}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.First_name}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Last_name}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Phone_number}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Customer_type_Bus_Or_Ind}</td>
                    
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </>
    );
}

export default GetCustomers;
