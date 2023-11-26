// Dashboard.js
import React, { useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import { auth, db } from '../firebase';
import Logout from './Logout';
import FileManagement from './FileManagement';
import SharedFiles from './SharedFiles';

const Dashboard = () => {
  const [userFiles, setUserFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]); // Add this line to store shared files
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileManagement, setShowFileManagement] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserFiles = async () => {
      if (user) {
        try {
          const userFilesSnapshot = await db.collection('userFiles').where('userId', '==', user.uid).get();
          const files = userFilesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserFiles(files);

          const sharedFilesSnapshot = await db.collection('userFiles').where('sharedUsers', 'array-contains', user.email).get();
          const sharedFiles = sharedFilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setSharedFiles(sharedFiles); // Set the shared files
        } catch (error) {
          console.error('Error fetching files:', error.message);
        }
      }
    };

    fetchUserFiles();
  }, [user]);

  const isFullAccess = (file) => {
    return file.ownerId === user.uid || (file.sharedUsers && file.sharedUsers.some(sharedUser => sharedUser.email === user.email && sharedUser.accessType === 'Full Access'));
  };

  const handleFileUpload = async (uploadedFile, fileId) => {
    setUserFiles((prevUserFiles) => [...prevUserFiles, { ...uploadedFile, id: fileId }]);
    try {
      const fileRef = db.collection('userFiles').doc(fileId);
      const fileSnapshot = await fileRef.get();

      if (fileSnapshot.exists) {
        const updatedFile = { id: fileSnapshot.id, ...fileSnapshot.data() };
        setUserFiles((prevUserFiles) =>
          prevUserFiles.map((file) => (file.id === fileId ? updatedFile : file))
        );
      }
    } catch (error) {
      console.error('Error fetching updated file:', error.message);
    }
  };

  const openFileManagement = (file) => {
    setSelectedFile(file);
    setShowFileManagement(true);
  };

  const closeFileManagement = () => {
    setSelectedFile(null);
    setShowFileManagement(false);
  };

  const handleShareFile = async (fileId, sharedUser) => {
    try {
      if (!selectedFile || !selectedFile.sharedUsers) {
        console.error('Invalid selected file or shared users array.');
        return;
      }
  
      // Check if the file is already shared with the user
      const isAlreadyShared = selectedFile.sharedUsers.some(
        (user) => user.email === sharedUser.email
      );
  
      if (isAlreadyShared) {
        console.log(`${selectedFile.fileName} is already shared with ${sharedUser.email}`);
        return;
      }
  
      // Update Firestore to add the shared user
      const fileRef = db.collection('userFiles').doc(fileId);
      await fileRef.update({
        sharedUsers: [...selectedFile.sharedUsers, sharedUser],
      });
  
      // Update state to reflect the change
      setSelectedFile((prevFile) => ({

        ...prevFile,
        sharedUsers: [...prevFile.sharedUsers, sharedUser],
      }));
  
      // Add the shared file to the sharedFiles collection
      const sharedFileData = {
        fileId: fileId,
        recipientId: sharedUser.userId, // Assuming userId is the unique identifier for users
      };
  
      await db.collection('sharedFiles').add(sharedFileData);
  
      console.log(`${selectedFile.fileName} shared with ${sharedUser.email}`);
    } catch (error) {
      console.error('Error sharing file:', error.message);
    }
  };

  return (
    <div>
      <nav className="bg-blue-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">
            Welcome to the Dashboard, {user ? user.email : 'Guest'}!
          </h2>
          <Logout />
        </div>
      </nav>

      <div className="container mx-auto mt-8">
        <FileUpload user={user} onFileUpload={handleFileUpload} />
        <h3 className="text-lg font-semibold mb-4">Your Uploaded Files:</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userFiles.map((file) => (
    <div key={file.id} className="bg-white p-4 rounded-md shadow-md relative">
      <a
        href={file.fileURL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {file.fileName}
      </a>
      {isFullAccess(file) && (
        <button
          className="absolute top-0 right-0 p-2 focus:outline-none"
          onClick={() => openFileManagement(file)}
        >
          ⋮
        </button>
      )}
    </div>
  ))}
        </div>

        {showFileManagement && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <FileManagement
              file={selectedFile}
              onClose={closeFileManagement}
              onShare={handleShareFile}
              user={user.uid}
            />
          </div>
        )}
        <SharedFiles sharedFiles={sharedFiles} />

      </div>
    </div>
  );
};

export default Dashboard;
