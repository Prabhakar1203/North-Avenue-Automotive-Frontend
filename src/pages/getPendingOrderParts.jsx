import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DashboardNavbar from '../components/DashboardNavbar';
function GetPendingParts() {
    const { user } = useSelector((state) => state.user);
    const [pendingPartsData, setPendingPartsData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:9004/api/getPendingOrderedParts')
            .then(response => setPendingPartsData(response.data))
            .catch(error => console.error('Error fetching average time in inventory:', error));
    }, []);

    return (
        <>
        <DashboardNavbar/>
            <div className='max-w-[1400px] mx-auto flex flex-col items-center justify-center  p-[150px] '>
                <h1 className='text-4xl p-4 font-bold '>Pending Parts Data</h1>
                <table className="border-collapse border-3 border-slate-400 w-full">
                    <thead>
                        <tr className="bg-slate-300 ">
                            <th className="px-4 py-2 border border-slate-400">Order_id</th>
                            <th className="px-4 py-2 border border-slate-400">Vendor_id</th>
                            <th className="px-4 py-2 border border-slate-400">Order_line_number</th>
                            <th className="px-4 py-2 border border-slate-400">Order_status</th>
                            <th className="px-4 py-2 border border-slate-400">Part_number</th>
                            <th className="px-4 py-2 border border-slate-400">Part_unit_price</th>
                            <th className="px-4 py-2 border border-slate-400">Part_quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingPartsData.map((item, index) => (
                            <tr key={index}  className={index % 2 === 0 ? 'bg-white' : 'bg-slate-200'}>
                                <td className="px-4 py-2 border border-slate-400">{item.Order_id}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Vendor_id}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Order_line_number}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Order_status}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Part_number}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Part_unit_price}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Part_quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </>
    );
}

export default GetPendingParts;
