import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardNavbar from '../components/DashboardNavbar';

function Owner() {
  const { user } = useSelector((state) => state.user);
  return (
    <>
      {/* <DashboardNavbar/>  */}
      <div className="min-h-screen flex flex-col items-center justify-center mx-auto text-3xl p-[150px]">
        <h1 className="mb-10 text-blue-600  font-bold text-3xl">Welcome to Owner Page</h1>
        <div className="grid grid-cols-1 gap-8 md:w-full w-[450px] md:p-[20px] p-[50px] md:grid-cols-3 mx-2"> {/* Full width with mx-2 for small screens */}
          <div className="p-6 bg-gray-200 rounded-lg shadow-lg hover:bg-slate-500 hover:shadow-xl hover:text-white transition-all duration-300">
            
            <Link to="/inventoryClerk" className="block h-full">Go to Inventory Clerk Page</Link>
          </div>

          <div className="p-6 bg-gray-200 rounded-lg shadow-lg hover:bg-slate-500 hover:shadow-xl hover:text-white transition-all duration-300">
      
            <Link to="/salesman" className="block h-full">Go to Salesman Page</Link>
          </div>

          <div className="p-6 bg-gray-200 rounded-lg shadow-lg hover:bg-slate-500 hover:shadow-xl hover:text-white transition-all duration-300">
        
            <Link to="/manager" className="block h-full">Go to Manager Page</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Owner;
