'use client'
import React, { useState } from 'react';


const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white p-4 fixed top-0 left-0 right-0 text-xl">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex items-center">
          <a href="/" className="  font-style: italic text-violet-900 mr-4  hover:text-black">École</a>
          <div className="relative inline-block text-left mr-7" role="menu">
            <span
              className="font-style: italic text-violet-900 cursor-pointer hover:text-black flex items-center "
              onClick={toggleDropdown}
              role="menuitem"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen ? 'true' : 'false'}
            >
              Cycles
              <svg
                width="20"
                height="20"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-4 absolute left-9 top-5 transform -translate-y-1/2"
              >
                <path
                  d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-40 bg-white rounded-md shadow-lg">
                <a href="/maternelle" className="block px-4 py-2 font-style: italic text-violet-900 hover:bg-gray-200">Maternelle</a>
                <a href="/elementaire" className="block px-4 py-2 font-style: italic text-violet-900 hover:bg-gray-200">Élémentaire</a>
              </div>
            )}
          </div>
          <a href="#" className="font-style: italic text-violet-900 mr-4 hover:text-black">Actualités</a>
          <a href="#" className="font-style: italic text-violet-900 mr-4  hover:text-black">Galerie</a>
          <a href="#" className="font-style: italic text-violet-900 mr-4 hover:text-black">Vie Scolaire</a>
        </div>
        <img src="/ecologoo.png" alt="Logo de l'école" className="w-14 h-12 mr-4" />
        <div className="flex items-center">
          <a href="#" className="font-style: italic text-violet-900 mr-4 hover:text-black">Recrutement</a>
          <a href="#" className="font-style: italic text-violet-900 mr-4 hover:text-black">Contact</a>
          <a href="#" className="font-style: italic text-violet-900 mr-4">
            <span style={{ color: 'green' }}>P</span>
            <span style={{ color: 'purple' }}>r</span>
            <span style={{ color: 'blue' }}>o</span>
            <span style={{ color: 'red' }}>n</span>
            <span style={{ color: 'blue' }}>o</span>
            <span style={{ color: 'purple' }}>t</span>
            <span style={{ color: 'orange' }}>e</span></a>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Inscription</button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
