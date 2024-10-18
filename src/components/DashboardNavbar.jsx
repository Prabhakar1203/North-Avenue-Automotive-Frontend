import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome } from "react-icons/fa"; 
import { RiMenu2Fill } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import SalesmanHero from "../pages/salesmanHero"
import InventeryClerk from "../pages//InventeryClerk";
import Owner from "../pages/owner";
import Manager from "../pages/manager";
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
    // { name: "Dashboard", path: "/owner", icon: <FaHome /> },
    { name: "Seller History", path: "/sellerhistory", icon: <FaHome /> },
    { name: "Average Time Inventery", path: "/averagetimeinventery", icon: <FaHome /> },
    { name: "Average Price Per Condition", path: "/averagepricepercondition", icon: <FaHome /> },
    { name: "Parts Statistics", path: "/partsstatistics", icon: <FaHome /> },
    { name: "Monthly Sales", path: "/monthlysales", icon: <FaHome /> }
  ];

  const managerMenu = [
    // { name: "Dashboard", path: "/manager", icon: <FaHome /> },
    { name: "Seller History", path: "/sellerhistory", icon: <FaHome /> },
    { name: "Average Time Inventery", path: "/averagetimeinventery", icon: <FaHome /> },
    { name: "Average Price Per Condition", path: "/averagepricepercondition", icon: <FaHome /> },
    { name: "Parts Statistics", path: "/partsstatistics", icon: <FaHome /> },
    { name: "Monthly Sales", path: "/monthlysales", icon: <FaHome /> }
  ];

  const salesmanMenu = [
    // { name: "Dashboard", path: "/salesman", icon: <FaHome /> },
    { name: "Seller History", path: "/saleshistory", icon: <FaHome /> }
  ];

  const inventoryClerkMenu = [
    // { name: "Dashboard", path: "/inventoryClerk", icon: <FaHome /> },
    { name: "Check Pending Parts", path: "/getpendingparts", icon: <FaHome /> },
    { name: "Check Customers", path: "/getCustomers", icon: <FaHome /> },
    { name: "Check Vendors", path: "/getVendors", icon: <FaHome /> }
  ];

  // Ensure consistent role naming
  const NavbarMenu =
    user?.role === "Owner" ? ownerMenu :
    user?.role === "Manager" ? managerMenu :
    user?.role === "Salesman" ? salesmanMenu :
    user?.role === "Inventory Clerks" ? inventoryClerkMenu :
    [];

  const renderHeroSection =
    user?.role === "Salesman" ? <SalesmanHero /> :
    user?.role === "Manager" ? <Manager /> :
    user?.role === "Owner" ? <Owner /> :
    user?.role === "Inventory Clerks" ? <InventeryClerk /> : 
    null;

  return (
    <div>
      <div className="z-20 fixed w-full bg-white">
        <div className="w-full mx-auto max-w-[1400px]">
          <div className="flex justify-between items-center h-[80px] w-full max-w-[1400px] mx-auto">
            <h2 className="text-green-700 text-3xl font-bold ml-8">North Avenue.</h2>

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
                className="bg-green-600 p-5 hover:bg-green-700 transition duration-1000 text-white py-2 px-6 rounded-full"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {nav && (
        <div className="lg:hidden bg-white shadow-xl md:p-4 p-[130px] rounded-lg  z-30">
          {NavbarMenu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center cursor-pointer p-4 text-green-700 text-lg font-semibold"
              onClick={() => setNav(false)} // Close menu on click
            >
               {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="block w-3/4 mx-auto rounded-lg bg-green-600 text-white p-4 text-lg font-semibold shadow-md"
          >
            Logout
          </button>
        </div>
      )}

      {renderHeroSection}

      {/* Overlay to hide background when the mobile menu is open */}
      {nav && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={() => setNav(false)}
        />
      )}
    </div>
  );
};

export default DashboardNavbar;
