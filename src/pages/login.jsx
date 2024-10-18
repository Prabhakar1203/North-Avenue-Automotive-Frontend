// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
// import { setRole } from './userSlice'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/features/userSlice';
import Navbar from '../components/Navbar';
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the login endpoint
      const response = await axios.post('http://localhost:9004/api/login', {
        username,
        password,
      });
      console.log(username)
      console.log(password)
      // Display success message  
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: response.data.message || 'Welcome!',
      });
      localStorage.setItem("token", response.data.token);
      console.log(response.data.token);

      // Dispatch the role to Redux
    //   dispatch(setRole(userRole));
      // Optionally redirect or update the UI here
      dispatch(setUser(response.data.user))
      console.log(response.data.user)
      navigate('/dashboard')
    } catch (error) {
      // Display error message
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid username or password.',
      });
    }
  };

  return (
      <>
          <Navbar/>
      
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
