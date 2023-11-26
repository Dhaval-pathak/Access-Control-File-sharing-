// FileUpload.js
import React, { useState } from 'react';
import { storage, db } from '../firebase';

const FileUpload = ({ user, onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setError(null); // Clear error when a new file is selected
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

      setUploading(true); // Set uploading state to true

      // Upload the file to Firebase Storage
      const storageRef = storage.ref(`userFiles/${user.uid}/${file.name}`);
      await storageRef.put(file);

      // Get the file URL from Firebase Storage
      const fileURL = await storageRef.getDownloadURL();

      // Save the file information to the database
      const uploadedFile = {
        userId: user.uid,
        ownerId: user.uid,
        fileName: file.name,
        fileURL,
        sharedUsers: [],
      };
      const docRef = await db.collection('userFiles').add(uploadedFile);

      // Notify the parent component about the uploaded file
      onFileUpload(uploadedFile, docRef.id);

      setSuccessMessage('File uploaded successfully!');
      setFile(null);
      setError(null);
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setError('Error uploading file. Please try again.');
    } finally {
      setUploading(false); // Set uploading state back to false regardless of success or failure
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="mb-2">
        <div className="flex items-center justify-center w-full">
          <label
            className="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300"
          >
            <div className="flex flex-col items-center justify-center pt-7">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                {file ? file.name : 'Select a file'}
              </p>
            </div>
            <input type="file" className="opacity-0" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 "
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUpload;
