import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
          <div className="h-1 w-24 bg-indigo-500 mx-auto my-6"></div>
          <h2 className="text-3xl font-bold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-500 mb-8">We couldn't find the page you're looking for.</p>
        </div>
        
        <div className="space-y-4">
          <Link 
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </Link>
          
          <div className="mt-8 text-gray-500">
            <p>If you think this is a mistake, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;