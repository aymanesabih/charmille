// 'use client'
// import React, { useState } from 'react';


// const NavBar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <nav className="bg-gray-10 p-4 fixed top-0 left-0 right-0">
//       <div className="container mx-auto flex items-center justify-center">
//         <div className="flex items-center">
//           <a href="/" className="text-black mr-4">Ecole</a>
//           <div className="relative inline-block text-left mr-4" role="menu">
//             <span
//               className="text-blue-300 cursor-pointer"
//               onClick={toggleDropdown}
//               role="menuitem"
//               aria-haspopup="true"
//               aria-expanded={isDropdownOpen ? 'true' : 'false'}
//             >
//               Cycles
//             </span>
//             {isDropdownOpen && (
//               <div className="absolute z-10 mt-2 w-40 bg-white rounded-md shadow-lg">
//                 <a href="/maternelle" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Maternelle</a>
//                 <a href="/elementaire" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Élémentaire</a>
//               </div>
//             )}
//           </div>
//           <a href="#" className="text-black mr-4">Actualités</a>
//           <a href="#" className="text-black mr-4">Galerie</a>
//           <a href="#" className="text-black mr-4">Vie Scolaire</a>
//         </div>
//         <img src="/ecologoo.png" alt="Logo de l'école" className="w-14 h-12 mr-4" />
//         <div className="flex items-center">
//           <a href="#" className="text-black mr-4">Recrutement</a>
//           <a href="#" className="text-black mr-4">Contact</a>
//           <a href="#" className="text-black mr-4">Pronote</a>
//           <button className="bg-green-500 text-white px-4 py-2 rounded">Inscription</button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
