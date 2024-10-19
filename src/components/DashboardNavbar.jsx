import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome } from "react-icons/fa";
import { RiMenu2Fill } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import SalesmanHero from "../pages/SalesmanHero";
import InventeryClerk from "../pages/InventeryClerk";
import Owner from "../pages/Owner";
import Manager from "../pages/Manager";

const DashboardNavbar = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const ownerMenu = [
    { name: "Seller History", path: "/sellerhistory", icon: <FaHome /> },
    { name: "Average Time Inventory", path: "/averagetimeinventory", icon: <FaHome /> },
    { name: "Average Price Per Condition", path: "/averagepricepercondition", icon: <FaHome /> },
    { name: "Parts Statistics", path: "/partsstatistics", icon: <FaHome /> },
    { name: "Monthly Sales", path: "/monthlysales", icon: <FaHome /> }
  ];

  const managerMenu = [
    { name: "Seller History", path: "/sellerhistory", icon: <FaHome /> },
    { name: "Average Time Inventory", path: "/averagetimeinventory", icon: <FaHome /> },
    { name: "Average Price Per Condition", path: "/averagepricepercondition", icon: <FaHome /> },
    { name: "Parts Statistics", path: "/partsstatistics", icon: <FaHome /> },
    { name: "Monthly Sales", path: "/monthlysales", icon: <FaHome /> }
  ];

  const salesmanMenu = [
    { name: "Seller History", path: "/saleshistory", icon: <FaHome /> }
  ];

  const inventoryClerkMenu = [
    { name: "Check Pending Parts", path: "/getpendingparts", icon: <FaHome /> },
    { name: "Check Customers", path: "/getCustomers", icon: <FaHome /> },
    { name: "Check Vendors", path: "/getVendors", icon: <FaHome /> }
  ];

  const NavbarMenu =
    user?.role === "Owner"
      ? ownerMenu
      : user?.role === "Manager"
      ? managerMenu
      : user?.role === "Salesman"
      ? salesmanMenu
      : user?.role === "Inventory Clerks"
      ? inventoryClerkMenu
      : [];

  const renderHeroSection =
    user?.role === "Salesman"
      ? <SalesmanHero />
      : user?.role === "Manager"
      ? <Manager />
      : user?.role === "Owner"
      ? <Owner />
      : user?.role === "Inventory Clerks"
      ? <InventeryClerk />
      : null;

  return (
    <div>
      <div className="z-20 fixed w-full bg-white shadow">
        <div className="w-full mx-auto max-w-[1400px]">
          <div className="flex justify-between items-center h-[90px] w-full max-w-[1400px] mx-auto">
            <h2 className="text-green-700 text-3xl font-bold ml-8">
              North Avenue
            </h2>

            {/* Mobile Menu Button */}
            <div className="lg:hidden mr-8">
              <button 
                onClick={() => setNav(!nav)} 
                className="text-green-700 text-4xl">
                {nav ? <IoIosCloseCircle /> : <RiMenu2Fill />}
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:ml-12">
              {NavbarMenu.map((item) => (
                <Link 
                  key={item.name}
                  to={item.path}
                  className="p-4 cursor-pointer text-green-700 text-2xl font-semibold lg:text-base text-xs tracking-wider"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Logout Button */}
            <div className="hidden lg:block mr-8">
              <button
                onClick={handleLogout}
                className="bg-green-600 hover:bg-green-700 transition duration-1000 text-white py-2 px-6 rounded-full"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {nav && (
        <div className="lg:hidden fixed left-0 top-0 w-[75%] h-full bg-white shadow-lg z-30 p-8">
          <h1 className="text-2xl text-green-700 font-bold mb-4">Menu</h1>
          {NavbarMenu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block p-4 text-green-700 text-lg font-semibold"
              onClick={() => setNav(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-green-600 hover:bg-green-700 transition duration-1000 text-white py-3 px-6 rounded-full"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {renderHeroSection}
    </div>
  );
};

export default DashboardNavbar;
