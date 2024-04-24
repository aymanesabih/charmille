import Actualites from "../components/component/Actualites";
import { Theme } from "@radix-ui/themes";
import Posts from "../../api/Actualites/FetchData";
export default function HomePageActualites() {
  console.log("Actualites");
  return (
    <body className="bg-gray-100">
      <div className="bg-white">
        <Actualites />
      </div>
    </body>
  );
}
