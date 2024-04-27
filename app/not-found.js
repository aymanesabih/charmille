import * as React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className=" bg-white">
      <div className="relative w-full mt-5 mb-5">
        {/* Container for the image */}
        <div className="relative w-full aspect-w-16 aspect-h-9">
          {/* Image */}
          <img
            src="/Images/Cover-header.jpg"
            alt={"Page not found"}
            className="w-full h-full object-cover"
          />
          {/* Overlay for text */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Text */}
            <div className="text-white text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl">
              {"Error 404 Page"}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center mb-10">
        <h2 className="text-violet-950 text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl">
          Oops, This Page Could Not Be Found!
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center  text-gray-200 justify-center text-red-500  text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold">
          404
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-violet-950 hover:text-purple-700 hover:underline text-xl font-bold mb-2">
            Helpful Links
          </h2>
          <ul className="flex flex-col gap-1">
            <li className="flex items-center gap-2">
              <img
                src="/Images/click.png"
                alt="Click icon"
                className="w-6 h-6"
              />
              <Link
                href="#"
                className="text-violet-950 hover:text-purple-700 hover:underline"
              >
                L’école
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <img
                src="/Images/click.png"
                alt="Click icon"
                className="w-6 h-6"
              />
              <Link
                href="#"
                className="text-violet-950 hover:text-purple-700 hover:underline"
              >
                Actualités
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <img
                src="/Images/click.png"
                alt="Click icon"
                className="w-6 h-6"
              />
              <Link
                href="#"
                className="text-violet-950 hover:text-purple-700 hover:underline"
              >
                Galerie
              </Link>
            </li>{" "}
            <li className="flex items-center gap-2">
              <img
                src="/Images/click.png"
                alt="Click icon"
                className="w-6 h-6"
              />
              <Link
                href="#"
                className="text-violet-950 hover:text-purple-700 hover:underline"
              >
                Vie Scolaire
              </Link>
            </li>{" "}
            <li className="flex items-center gap-2">
              <img
                src="/Images/click.png"
                alt="Click icon"
                className="w-6 h-6"
              />
              <Link
                href="#"
                className="text-violet-950 hover:text-purple-700 hover:underline"
              >
                Recrutement
              </Link>
            </li>{" "}
            <li className="flex items-center gap-2">
              <img
                src="/Images/click.png"
                alt="Click icon"
                className="w-6 h-6"
              />
              <Link
                href="#"
                className="text-violet-950 hover:text-purple-700 hover:underline"
              >
                Contact
              </Link>
            </li>{" "}
            <li className="flex items-center gap-2">
              <img
                src="/Images/click.png"
                alt="Click icon"
                className="w-6 h-6"
              />
              <Link
                href="#"
                className="text-violet-950 hover:text-purple-700 hover:underline"
              >
                Inscription
              </Link>
            </li>{" "}
          </ul>
        </div>
      </div>
    </div>
  );
}
