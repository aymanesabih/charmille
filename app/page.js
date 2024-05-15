import Image from "next/image";
import Layout from "./layout";
import TextAndTable from "@/components/contenu";
import { Fragment } from "react";

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
       < Fragment className="flex justify-center items-center mt-20">
        <div className="ml-auto mr-auto">
          <Image
            src="/propos.png"
            alt="Description de votre image"
            width={1999}
            height={259}
          />
        </div>
         <TextAndTable/> {/* ajoute le contenu ou bien les composants que vous voulez ici  */}
      </Fragment>
      </body>
    </main>

  );
}
