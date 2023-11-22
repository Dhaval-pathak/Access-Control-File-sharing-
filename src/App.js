// src/pages/index.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AppRouter from './AppRouter'; // Update the import path
import { auth } from './firebase';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md p-4 bg-white shadow-md rounded-md">
        {user ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Welcome, {user.email}!</h2>
            <AppRouter />
          </>
        ) : (
          <Navigate to="/login" />
        )}
      </div>
    </div>
  );
};

export default Home;
