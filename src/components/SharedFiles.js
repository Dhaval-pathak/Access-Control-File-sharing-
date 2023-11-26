// SharedFiles.js
import React from 'react';

const SharedFiles = ({ sharedFiles }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Shared with You:</h3>
      <ul>
        {sharedFiles.map((file) => (
          <li key={file.id}>
            <a href={file.fileURL} target="_blank" rel="noopener noreferrer">
              {file.fileName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SharedFiles;
