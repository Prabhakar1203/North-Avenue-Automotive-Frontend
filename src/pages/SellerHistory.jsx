import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SellerHistory() {
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:9004/api/getSellerHistory')
            .then(response => setSellers(response.data))
            .catch(error => console.error('Error fetching seller history:', error));
    }, []);

    return (
            <div className='max-w-[1400px] mx-auto p-[150px] '>
              <table className='border-collapse border-0  border-spacing-8 border-slate-400'>
                    <thead>
                        <tr className='bg-slate-300'>
                            <th className='px-4 py-2 border border-slate-400'>Name</th>
                            <th className='px-4 py-2 border border-slate-400'>Seller Type</th>
                            <th className='px-4 py-2 border border-slate-400'>Total Vehicles Sold</th>
                            <th className='px-4 py-2 border border-slate-400'>Average Purchase Price</th>
                            <th className='px-4 py-2 border border-slate-400'>Average Parts Per Vehicle</th>
                            <th className='px-4 py-2 border border-slate-400'>Average Part Cost Per Vehicle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellers.map((seller, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-200'} style={{ backgroundColor: seller.needs_attention ? 'red' : 'white' }}>
                                <td className='px-4 py-2 border border-slate-400'>{seller.Name}</td>
                                <td className='px-4 py-2 border border-slate-400'>{seller.Seller_Type}</td>
                                <td className='px-4 py-2 border border-slate-400'>{seller.Total_Vehicles_Sold}</td>
                                <td className='px-4 py-2 border border-slate-400'>{seller.Avg_Purchase_Price}</td>
                                <td className='px-4 py-2 border border-slate-400'>{seller.Avg_Parts_Per_Vehicle}</td>
                                <td className='px-4 py-2 border border-slate-400'>{seller.Avg_Part_Cost_Per_Vehicle}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
    );
}

export default SellerHistory;
