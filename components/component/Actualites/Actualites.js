"use client";
import Image from "next/image";
import Card from "../../ui/Atcualite/PostCard";
import { useState } from "react";
import FetchPosts from "../../../api/Actualites/FetchData";

export default function Actualites() {
  return (
    <div>
      {/* Header Image */}
      <header>
        <OpeningPost
          MyImage="/images/actualite-header-image.jpg"
          title={"Toujours quelque chose de nouveau !"}
          Text="Toujours quelque chose de nouveau !"
        />
      </header>
      {/* Grid of Cards */}
      <section className="bg-white">
        <FetchPosts />
      </section>
    </div>
  );
}

function OpeningPost({ MyImage, title, Text }) {
  return (
    <div className="relative w-full mt-5 mb-5">
      {/* Container for the image */}
      <div className="relative w-full aspect-w-16 aspect-h-9">
        {/* Image */}
        <img src={MyImage} alt={title} className="w-full h-full object-cover" />
        {/* Overlay for text */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Text */}
          <div className="text-white text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl">
            {Text}
          </div>
        </div>
      </div>
    </div>
  );
}
