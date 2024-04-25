import Actualites from "../components/component/Actualites";
import Comments from "../components/component/comment";

export default function HomePageActualites() {
  console.log("Actualites");
  return (
    <body className="bg-gray-100 ">
      <Comments />
      <div className="bg-white">
        <Actualites />
      </div>
    </body>
  );
}
