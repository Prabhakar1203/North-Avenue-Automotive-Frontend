import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MonthlySales(){
     const [MonthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:9004/api/getMontlySales')
            .then(response => setMonthlyData(response.data))
            .catch(error => console.error('Error fetching average time in inventory:', error));
    }, []);

    return (
        <div className='max-w-[1400px] mx-auto flex items-center justify-center  p-[150px] '>
            <table className="border-collapse border-3 border-slate-400 w-full">
                <thead>
                    <tr className="bg-slate-300 ">
                        <th className="px-4 py-2 border border-slate-400"> Sale Year</th>
                        <th className="px-4 py-2 border border-slate-400">Sale Month</th>
                        <th className="px-4 py-2 border border-slate-400">Total_Vehicles_Sold</th>
                        <th className="px-4 py-2 border border-slate-400">Gross Sales Income</th>
                        <th className="px-4 py-2 border border-slate-400">Total Net Income</th>
                    </tr>
                </thead>
                <tbody>
                    {MonthlyData.map((item, index) => (
                        <tr key={index}  className={index % 2 === 0 ? 'bg-white' : 'bg-slate-200'}>
                            <td className="px-4 py-2 border border-slate-400">{item.Sale_Year}</td>
                            <td className="px-4 py-2 border border-slate-400">{item.Sale_Month}</td>
                            <td className="px-4 py-2 border border-slate-400">{item.Total_Vehicles_Sold}</td>
                            <td className="px-4 py-2 border border-slate-400">{item.Gross_Sales_Income}</td>
                            <td className="px-4 py-2 border border-slate-400">{item.Total_Net_Income}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default MonthlySales;





