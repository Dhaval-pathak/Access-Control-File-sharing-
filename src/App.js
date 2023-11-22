// src/pages/index.js
import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import { auth } from './firebase';

const Home = () => {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleRegisterClick = () => {
    setShowRegister(true);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md p-4 bg-white shadow-md rounded-md">
        {user ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Welcome, {user.email}!</h2>
            <Logout />
          </>
        ) : (
          <>
            {!showRegister && <Login />}
            {showRegister && <Register />}
            {!showRegister && (
              <div className="text-center mt-4 cursor-pointer text-blue-500">
                <span onClick={handleRegisterClick}>Don't have an account? Register here.</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
