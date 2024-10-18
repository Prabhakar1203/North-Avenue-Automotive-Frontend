import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; 
import DashboardNavbar from '../components/DashboardNavbar';
function AveragePricePerCondition() {
    const [averagePrices, setAveragePrices] = useState([]);
    const { user } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchAveragePrices = async () => {
            try {
                const response = await axios.get('http://localhost:9004/api/getAveragePricePerCondition');
                setAveragePrices(response.data);
            } catch (error) {
                console.error('Error fetching average prices:', error);
            }
        };

        fetchAveragePrices();
    }, []);

    return (
        <>
        <DashboardNavbar/>
        <div>
           
            <div className='max-w-[1400px] mx-auto flex flex-col items-center justify-center  p-[150px] '>
                <h1 className='text-4xl p-4 font-bold '>Average Price Per Condition</h1>
                <table className="border-collapse border-3 border-spacing-8 border-slate-400">
                    <thead>
                        <tr className="bg-slate-300 ">
                            <th className="px-4 py-2 border border-slate-400">Vehicle Type</th>
                            <th className="px-4 py-2 border border-slate-400">Avg Price (Excellent)</th>
                            <th className="px-4 py-2 border border-slate-400">Avg Price (Very Good)</th>
                            <th className="px-4 py-2 border border-slate-400">Avg Price (Good)</th>
                            <th className="px-4 py-2 border border-slate-400">Avg Price (Fair)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {averagePrices.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-200'}>
                                <td className="px-4 py-2 border border-slate-400">{item.Vehicle_type}</td>
                                <td className="px-4 py-2 border border-slate-400">${item.Avg_Price_Excellent}</td>
                                <td className="px-4 py-2 border border-slate-400">${item.Avg_Price_Very_Good}</td>
                                <td className="px-4 py-2 border border-slate-400">${item.Avg_Price_Good}</td>
                                <td className="px-4 py-2 border border-slate-400">${item.Avg_Price_Fair}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}

export default AveragePricePerCondition;
