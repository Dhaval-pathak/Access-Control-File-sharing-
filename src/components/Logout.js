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
      <button
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
        onClick={handleLogout}
      >
        Logout
      </button>
  );
};

export default Logout;
