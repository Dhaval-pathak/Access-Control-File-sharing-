// FileUpload.js
import React, { useState } from 'react';
import { storage, db } from '../firebase'; // Import your Firebase storage and database configuration

const FileUpload = ({ user }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
      setError('Please select a file');
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        setError('Please select a file');
        return;
      }

      // Upload the file to Firebase Storage
      const storageRef = storage.ref(`userFiles/${user.uid}/${file.name}`);
      await storageRef.put(file);

      // Get the file URL from Firebase Storage
      const fileURL = await storageRef.getDownloadURL();

      // Save the file information to the database
      await db.collection('userFiles').add({
        userId: user.uid,
        fileName: file.name,
        fileURL,
      });

      // Clear the file input and error state
      setFile(null);
      setError(null);
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setError('Error uploading file. Please try again.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUpload;
