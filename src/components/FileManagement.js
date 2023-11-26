// FileManagement.js
import React, { useState } from 'react';
import { db,fire } from '../firebase';

const FileManagement = ({ file, onClose, user }) => {
  const [sharedUsers, setSharedUsers] = useState(file.sharedUsers || []);
  const [shareEmail, setShareEmail] = useState('');
    const [accessType, setAccessType] = useState('View Only'); 

  const handleShare = async () => {
    if (!shareEmail || sharedUsers.includes(shareEmail)) {
      console.log('Invalid or already shared email');
      return;
    }

    try {
      await db.collection('userFiles').doc(file.id).update({
        sharedUsers: [...sharedUsers, shareEmail],
      });

      setSharedUsers((prevUsers) => [...prevUsers, shareEmail]);
      setShareEmail('');
    } catch (error) {
      console.error('Error sharing file:', error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">File Management</h2>
      <p>File Name: {file.fileName}</p>
      {/* Add owner details if available */}
      {file.ownerName && <p>Owner: {file.ownerName}</p>}

      <h3 className="text-lg font-semibold mt-4 mb-2">Shared Users:</h3>
      <ul>
        {sharedUsers.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>

      <div className="mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">Share with:</label>
        <div className="flex">
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none"
            placeholder="Enter email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
          
        </div>
      </div>
      <div className="flex">
    <select
      className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none"
      value={accessType}
      onChange={(e) => setAccessType(e.target.value)}
    >
      <option value="View Only">View Only</option>
      <option value="Full Access">Full Access</option>
    </select>
    <button
      className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
      onClick={handleShare}
    >
      Share
    </button>
  </div>

      <button
        className="mt-4 bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 focus:outline-none"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default FileManagement;
