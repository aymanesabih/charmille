// le composent de la page elementaire 
import Image from "next/image";

export default function Elementaire (){
return (
<div className="flex justify-center items-center mt-20">
        <div className="ml-auto mr-auto">
          <Image
            src="/Elementaire.png"   // add img source 
            alt="Description de votre image"
            width={1838}
            height={260}
          />
        </div>
      </div>
);}