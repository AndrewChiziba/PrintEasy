import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { QrCode, Download, Printer } from 'lucide-react';

const Success = () => {
  const { fileId } = useParams();

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <QrCode className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Files Uploaded Successfully!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Your files have been uploaded and are ready for printing. Use the QR code
          below to access your files at any PrintEasy location.
        </p>

        {/* Placeholder for QR Code */}
        <div className="bg-gray-100 w-48 h-48 mx-auto mb-8 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">QR Code for {fileId}</span>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Download className="h-5 w-5 mr-2" />
            Download QR
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            <Printer className="h-5 w-5 mr-2" />
            Print Now
          </button>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm text-gray-500 mb-4">
            Your files will be available for 7 days. Make sure to save your QR code!
          </p>
          <Link
            to="/upload"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Upload more files
          </Link>
        </div>
      </div>

      {/* Ad Placeholder */}
      <div className="mt-8 bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-500">Advertisement Space</p>
      </div>
    </div>
  );
};

export default Success;