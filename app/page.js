import Image from "next/image";

export default function Home() {
  return (
    <main>
      <header className="bg-white">
        <script
          async
          defer
          crossorigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v11.0"
          nonce="XXX"
        ></script>
      </header>
      <body className="bg-white">
        {" "}
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
      </body>
    </main>
  );
}
