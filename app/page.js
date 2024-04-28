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
      <body className="bg-white">Hello</body>
    </main>
  );
}
