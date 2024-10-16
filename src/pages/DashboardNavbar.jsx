import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome } from "react-icons/fa"; 
import SalesmanHero from "./salesmanHero";
import Manager from "./manager";
import Owner from "./owner";
import InventeryClerk from "./InventeryClerk";
const DashboardNavbar = () => {
  const [nav, setNav] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    // setTimeout(() => {
    //   Swal.fire({
    //     title: "Logged Out Successfully!!!",
    //     icon: "success",
    //   });
    // }, 4000);
    navigate("/login");
    window.location.reload();
  };

    // const role = useSelector(state => state.user.role); 
    const { user } = useSelector((state) => state.user);
    console.log("it is navigated to Dashbord Navbar");

    console.log(user)
 

  const ownerMenu = [
    { name: "Seller History", path: "/sellerhistory", icon: FaHome },
    { name: "Average Time Inventery", path: "/averagetimeinventery", icon: FaHome },
    { name: "Average Price Per Condition", path: "/averagepricepercondition", icon: FaHome },
    { name: "Parts Statistics", path: "/partsstatistics", icon: FaHome },
    { name: "Monthly Sales", path: "/monthlysales", icon: FaHome }
    // { name: "My Profile", path: `/profile/${user?._id}`, icon: FaHome },
  ];

  const managerMenu = [
    { name: "Dashboard", path: "/managerMenu", icon: FaHome },
    { name: "Manager Task 1", path: "/manager/task1", icon: FaHome },
    { name: "Manager Task 2", path: "/manager/task2", icon: FaHome },
    { name: "Manager Task 3", path: "/manager/task3", icon: FaHome },
    // { name: "My Profile", path: `/profile/${user?._id}`, icon: FaHome },
  ];

  const salesmanMenu = [
    { name: "Dashboard", path: "/salesmanMenu", icon: FaHome },
    { name: "Seller History", path: "/sellerhistory", icon: FaHome },
    // { name: "Sales Task 2", path: "/salesman/task2", icon: FaHome },
    { name: "My Profile", path: `/profile`, icon: FaHome },
  ];

  const inventoryClerkMenu = [
    { name: "Dashboard", path: "/inventoryClerkMenu", icon: FaHome },
    { name: "Inventory Task 1", path: "/inventory/task1", icon: FaHome },
    { name: "Inventory Task 2", path: "/inventory/task2", icon: FaHome },
    // { name: "My Profile", path: `/profile/${user?._id}`, icon: FaHome },
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
      user?.role === "Salesman" ? <SalesmanHero /> 
      : user?.role === "Manager" ? <Manager/>
      : user?.role === "Owner" ? <Owner/>
      : user?.role === "Inventory Clerks" ? <InventeryClerk/>
      : null;

  return (
    <div>
      <div className="z-20 fixed w-full bg-white">
        <div className="w-full mx-auto max-w-[1400px]">
          <div className="justify-center w-full">
            <div className="text-black flex justify-between items-center h-[80px] w-full md:top-0 top-0 bg-white max-w-[1400px] mx-auto ">
              <div className="ml-8">
                <div className="text-xl block">
                  <h2 className="text-green-700 text-3xl font-bold">North Avenue.</h2>
                </div>
              </div>

              <div className="lg:ml-12 lg:flex hidden">
                {NavbarMenu.map((item) => (
                  <a
                    key={item}
                    href={item.path}
                    className="lg:p-4 p-[11px] cursor-pointer text-green-700 text-2xl font-semibold lg:text-base text-xs tracking-wider"
                  >
                    {item?.name}
                  </a>
                ))}
              </div>

              <div className="lg:block hidden mr-8">
                <button
                  onClick={handleLogout}
                  class=" bg-green-600 p-5 hover:bg-green-600 transition duration-1000 text-white py-2 px-6 rounded-full"
                >
                  Logout
                </button>
              </div>
              {/* 
              <div className="cursor-pointer lg:block hidden">
                <button
                  onClick={() => navigate(`/profile/${user?._id}`)}
                  className="flex justify-center items-center w-12 h-12 rounded-full font-extrabold text-[#ffffff] bg-colorFour"
                >
                  {firstNameInitial} {lastNameInitial}
                </button>
              </div> */}

              
            </div>
          </div>
        </div>
      </div>

      {renderHeroSection}

    </div>



    // <nav>
    //   <h1>North Avenue</h1>

    //   {/* Render the menu only when user data is available */}
    //   <ul>
    //     {NavbarMenu.map((menuItem, index) => (
    //       <li key={index} onClick={() => navigate(menuItem.path)}>
    //         <menuItem.icon />
    //         {menuItem.name}
    //       </li>
    //     ))}
    //   </ul>

    //   <h1 onClick={() => {
    //     navigate("/login"); // Redirect to login page
    //   }}>
    //     Logout
    //   </h1>
    // </nav>
  );
};

export default DashboardNavbar;
