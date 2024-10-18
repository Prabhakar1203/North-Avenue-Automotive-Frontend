import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DashboardNavbar from '../components/DashboardNavbar';

function GetVendors() {
    const [vendorsData, setVendorsData] = useState([]);
    const { user } = useSelector((state) => state.user);
    useEffect(() => {
        axios.get('http://localhost:9004/api/getVendors')
            .then(response => setVendorsData(response.data))
            .catch(error => console.error('Error fetching average time in inventory:', error));
    }, []);

    return (
        <>
            <DashboardNavbar/>
            <div className='max-w-[1400px] mx-auto flex flex-col items-center justify-center  p-[150px] '>
                <h1 className='text-4xl p-4 font-bold '> Vendors Data</h1>
                <table className="border-collapse border-3 border-slate-400 w-full">
                    <thead>
                        <tr className="bg-slate-300 ">
                            <th className="px-4 py-2 border border-slate-400">Vendor_id</th>
                            <th className="px-4 py-2 border border-slate-400">Vendor_Name</th>
                            <th className="px-4 py-2 border border-slate-400">Vendor_City</th>
                            <th className="px-4 py-2 border border-slate-400">Vendor_Phone_Number</th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        {vendorsData.map((item, index) => (
                            <tr key={index}  className={index % 2 === 0 ? 'bg-white' : 'bg-slate-200'}>
                                <td className="px-4 py-2 border border-slate-400">{item.Vendor_id}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Vendor_Name}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Vendor_City}</td>
                                <td className="px-4 py-2 border border-slate-400">{item.Vendor_Phone_Number}</td>
                            
                    
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </>
    );
}

export default GetVendors;
