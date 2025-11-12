import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} EsportsCart. All rights reserved.</p>
        <p className="text-sm mt-1">
          This is a fictional website for demonstration purposes. 
          Not affiliated with any official esports league or game publisher.
        </p>
      </div>
    </footer>
  );
};