import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DashboardNavbar from '../components/DashboardNavbar';

function PartsStatistics() {
    const [partsData, setPartsData] = useState([]);
    const { user } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchPartsStatistics = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/getPartsStatistics');
                setPartsData(response.data);
            } catch (error) {
                console.error('Error fetching parts statistics:', error);
            }
        };

        fetchPartsStatistics();
    }, []);

    return (
        <> 
            <DashboardNavbar/>
            <div className='max-w-[1400px] mx-auto flex flex-col items-center justify-center  p-[150px] '>
                    <h1 className='text-4xl p-4 font-bold '> Parts Statistics </h1>
                <table className="border-collapse border-3 border-spacing-4 border-slate-400">
                    <thead>
                        <tr className="bg-slate-300">
                            <th className='px-4 py-2 border border-slate-400'>Vendor Name</th>
                            <th className='px-4 py-2 border border-slate-400'>Total Quantity Supplied</th>
                            <th className='px-4 py-2 border border-slate-400'>Total Amount Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partsData.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-200'}>
                                <td className='px-4 py-2 border border-slate-400'>{item.Vendor_Name}</td>
                                <td className='px-4 py-2 border border-slate-400'>{item.Total_Quantity_Supplied}</td>
                                <td className='px-4 py-2 border border-slate-400'>{item.Total_Amount_Spent}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default PartsStatistics;
