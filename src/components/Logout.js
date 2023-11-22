// src/components/Logout.js
import React from 'react';
import { auth } from '../firebase';

const Logout = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully!');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Logout</h2>
      <button
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Logout;
