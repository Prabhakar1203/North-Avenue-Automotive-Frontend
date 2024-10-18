import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DashboardNavbar from '../components/DashboardNavbar';

function MonthlySales() {
    const { user } = useSelector((state) => state.user);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [salesData, setSalesData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    const fetchSalesDrilldown = async (year, month) => {
        try {
            const response = await axios.post('http://localhost:9004/api/getMonthlySalesDrilldown', { year, month });
            console.log(year);
            console.log(month);
            setSalesData(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching sales drilldown:', error);
        }
    };
    // console.log(salesData);
    const fetchMonthlySales = async () => {
        try {
            const response = await axios.get('http://localhost:9004/api/getMontlySales');
            setMonthlyData(response.data);
        } catch (error) {
            console.error('Error fetching monthly sales data:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchSalesDrilldown(year, month);
    };

    useEffect(() => {
        fetchMonthlySales();
    }, []);

    return (
        <> 
        <DashboardNavbar/> 
            <div className="max-w-[1400px] mx-auto flex items-start justify-between p-[150px]">
                <div className="w-[70%]">
                    <h2 className="text-xl font-bold mb-4 text-center ">Monthly Sales Report</h2>
                    <table className="border-collapse border-3 border-slate-400 w-full">
                        <thead>
                            <tr className="bg-slate-300">
                                <th className="px-4 py-2 border border-slate-400">Sale Year</th>
                                <th className="px-4 py-2 border border-slate-400">Sale Month</th>
                                <th className="px-4 py-2 border border-slate-400">Total Vehicles Sold</th>
                                <th className="px-4 py-2 border border-slate-400">Gross Sales Income</th>
                                <th className="px-4 py-2 border border-slate-400">Total Net Income</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyData.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-200'}>
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

                <div className="w-[30%] ml-8">
                    <h2 className="text-xl font-bold mb-4 text-center ">Check Sales Data</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2">Year:</label>
                            <input
                                type="number"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="border p-2 w-full"
                                min="2000"
                                max={new Date().getFullYear()}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Month:</label>
                            <input
                                type="number"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="border p-2 w-full"
                                min="1"
                                max="12"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Get Drilldown</button>
                    </form>

                    <table className="border-collapse border-3 border-slate-400 mt-4">
                        <thead>
                            <tr className="bg-slate-300">
                                <th className="px-4 py-2 border border-slate-400">Salesperson</th>
                                <th className="px-4 py-2 border border-slate-400">Vehicles Sold</th>
                                <th className="px-4 py-2 border border-slate-400">Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesData.length > 0 ? (
                                salesData.map((salesperson, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-200'}>
                                        <td className="px-4 py-2 border border-slate-400">{`${salesperson.First_Name} ${salesperson.Last_Name}`}</td>
                                        <td className="px-4 py-2 border border-slate-400">{salesperson.Vehicles_Sold}</td>
                                        <td className="px-4 py-2 border border-slate-400">${salesperson.Total_Sales}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-4 py-2" colSpan="3">No sales data available for this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default MonthlySales;
