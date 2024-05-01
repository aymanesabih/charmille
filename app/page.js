import Image from "next/image";


export default function Home() {
  return (
      <div className="flex justify-center items-center mt-20">
        <div className="ml-auto mr-auto">
          <Image
            src="/propos.png"
            alt="Description de votre image"
            width={1843}
            height={259}
          />
        </div>
      </div>
   
  );
}