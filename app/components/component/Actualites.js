import Image from "next/image";
import Card from "../ui/Atcualite/PostCard";
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
      <section className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:4 w-full">
        <Card
          imageUrl="/images/event.jpg"
          title="Célébration de la 48ème anniversaire de la glorieuse marche verte"
          Date="March 30, 2024"
        />
      
        <Card
          imageUrl="/images/event.jpg"
          title="Célébration de la 48ème anniversaire de la glorieuse marche verte"
          Date="March 30, 2024"
        />
        <Card
          imageUrl="/images/event.jpg"
          title="Célébration de la 48ème anniversaire de la glorieuse marche verte"
          Date="March 30, 2024"
        />
        <Card
          imageUrl="/images/event.jpg"
          title="Célébration de la 48ème anniversaire de la glorieuse marche verte"
          Date="March 30, 2024"
        />
      </section>
    </div>
  );
}



function OpeningPost({ MyImage, title, Text }) {
  return (
    <div className="relative w-full mt-5">
      {/* Container for the image */}
      <div className="relative w-full h-64">
        {/* Image */}
        <img src={MyImage} alt={title} className="w-full h-full object-cover" />
        {/* Overlay for text */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Text */}
          <div className="text-white text-center text-5xl">{Text}</div>
        </div>
      </div>
    </div>
  );
}
