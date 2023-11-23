// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import { auth, db } from '../firebase';
import Logout from './Logout';

const Dashboard = () => {
  const [userFiles, setUserFiles] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up an authentication observer to listen for changes in the user's login state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch user-uploaded files from the database when the user is available
    if (user) {
      const fetchUserFiles = async () => {
        try {
          const snapshot = await db.collection('userFiles').where('userId', '==', user.uid).get();
          const files = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserFiles(files);
        } catch (error) {
          console.error('Error fetching user files:', error.message);
        }
      };

      fetchUserFiles();
    }
  }, [user]);

  return (
    <div>
      <h2>Welcome to the Dashboard, {user ? user.email : 'Guest'}!</h2>
      <FileUpload user={user} />
      <h3>Your Uploaded Files:</h3>
      <ul>
        {userFiles.map((file) => (
          <li key={file.id}>
            <a href={file.fileURL} target="_blank" rel="noopener noreferrer">
              {file.fileName}
            </a>
          </li>
        ))}
      </ul>
      <Logout/>
    </div>
  );
};

export default Dashboard;
