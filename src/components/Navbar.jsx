import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaSearch } from "react-icons/fa";
import SearchResults from '../pages/searchResults';

const Navbar = () => {
  const [searchedWord, setSearchedWord] = useState('');
  const [results, setResults] = useState([]); // State to hold search results
  const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("Searching for:", searchedWord); // Log the searched word

    if (!searchedWord) {
      // If the search word is empty, do nothing
      return;
    }

    try {
      // Make a POST request to the search endpoint
      const response = await axios.post('http://localhost:9004/api/search', {
        searched_word: searchedWord,
      });

      console.log("API Response:", response.data); // Log the API response

      // Assuming results are returned directly in response.data
      if (response.data.length < 1) {
        Swal.fire({
          icon: 'info',
          title: 'No Results Found',
          text: 'No cars matching your search were found.',
        });
      } else {
        // Update the results state with the API response
        setResults(response.data);
        setHasSearched(true); // Mark that a search has been performed
      }
    } catch (error) {
      // Log error details
      console.error("Error during API call:", error); // Log the error
      // Display error message for failed search
      Swal.fire({
        icon: 'info',
        title: 'Search Failed',
        text: error.response?.data?.message || 'No cars matching your search were found.',
      });
    }
  };

  return (
    <div className="w-full fixed md:z-20 z-20 bg-white shadow-xl">
      <div className="w-full h-[90px] mx-auto max-w-[1400px] flex justify-between items-center">
        <div className="flex justify-between items-center w-full px-4">
        <div className="text-center">
            <Link to={'/'}>
                <h2 className="font-bold text-green-600 text-[30px]">
                {/* For small screens, display vertically; for medium and larger, display inline */}
                <span className="block  md:inline">North</span> {/* Vertical on small, inline on medium+ */}
                <span className="block md:inline">Avenue</span> {/* Vertical on small, inline on medium+ */}
                </h2>
            </Link>
        </div>


          <form onSubmit={handleSearch} className="relative w-full md:max-w-[450px] max-w-[200px]">
            <input
              className="p-3 w-full border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200"
              type="text"
              value={searchedWord}
              onChange={(e) => {
                console.log("Input changed:", e.target.value); // Log input changes
                setSearchedWord(e.target.value);
              }}
              required
              placeholder="Search a Car"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">
              <FaSearch />
            </button>
          </form>

          <div className="text-center">
            {/* Replace button with Link for navigation */}
            <Link to={'/login'}>
              <button className="p-3 bg-green-600 text-2xl font-bold md:w-[150px] w-[80px] rounded-lg text-white transition-all duration-200 hover:bg-green-700">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Display search results only if a search has been performed and results are present */}
      {hasSearched && (
        <div className="w-full mt-4">
          <SearchResults results={results} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
