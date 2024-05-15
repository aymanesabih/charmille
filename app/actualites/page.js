import Actualites from "../../components/component/Actualites/Actualites";
import InstagramFeed from "../galerie/galerie";
export default function HomePageActualites() {
  console.log("Actualites");
  return (
    <body className="bg-gray-100 ">
      <div className="bg-white">
        <Actualites />
        <hr className="mt-5" />
        <InstagramFeed />
      </div>
    </body>
  );
}
