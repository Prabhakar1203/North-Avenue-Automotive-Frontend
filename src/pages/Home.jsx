import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 lg:p-8 overflow-x-hidden">
      <div className="relative flex flex-col justify-center items-center text-center md:max-w-[800px] mt-[50px] md:mt-[80px] p-6 sm:p-10 mx-auto w-full">
        {/* Welcome Message */}
        <h1 className="text-gray-700 text-3xl sm:text-4xl font-bold p-5">
          Welcome to the Public Page
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl">
          You can search any car here. Want to buy? Please contact a Salesman.
        </p>
        <p className="text-gray-600 text-lg sm:text-xl mt-4">
          Are you an Employee?{" "}
          <Link to="/login" className="text-blue-600 underline">
            <span>Login here</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Home;
