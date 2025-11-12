import React from 'react';

export const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 md:p-12 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold text-white text-center mb-6">About EsportsCart</h1>
        <p className="text-lg text-gray-300 mb-4">
          EsportsCart is the number one destination for all pro gaming enthusiasts. 
          We are inspired by the passion and dedication of the global esports community.
        </p>
        <p className="text-lg text-gray-300 mb-4">
          Our mission is to provide players with the coolest, most exclusive in-game items and real-world gear 
          to show off their love for the game. From legendary skins to pro-level hardware, we've got 
          the supplies you need to claim your chicken dinner.
        </p>
        <p className="text-lg text-gray-300">
          This site is a demo project built with React, Tailwind CSS, and React Context, showcasing a
          modern, responsive e-commerce experience with a theme inspired by esports.
        </p>
      </div>
    </div>
  );
};