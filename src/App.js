// src/pages/index.js
import React, {  useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/dashboard';
import { auth } from './firebase';
import { Route, Routes, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // If user is logged in, navigate to the dashboard
      if (user) {
        navigate('/dashboard');
      }
      else{
        navigate('/login')
      }
    });

    return () => unsubscribe();
  }, [navigate]);


  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  );
};

export default Home;
