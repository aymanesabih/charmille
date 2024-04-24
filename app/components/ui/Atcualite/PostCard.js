export default function Card({ imageUrl, title, Date, key }) {
  return (
    <div className="bg-white rounded-lg shadow-md w-10/12 mx-auto mt-4 hover:shadow-2xl hover:cursor-pointer flex flex-col">
      <div key={key} className="h-1/2">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full rounded-t-lg object-cover"
        />
      </div>

      {/* Title and Date container */}
      <div className="flex-grow flex flex-col justify-between">
        {/* Title */}
        <h2 className="text-violet-950 pl-6 pt-4 pb-2 text-base font-semibold line-clamp-3">
          {title}
        </h2>

        {/* Date */}
        <p className="text-red-600 pl-6 pb-4 text-sm">{Date}</p>
      </div>

      {/* "Voir plus" button */}
      <div className="flex justify-center">
        <button className="bg-[#06278c]  hover:bg-white hover:text-[#06278c] hover:border-[#06278c] border-2 font-semibold py-2 px-6 rounded-2xl   w-40  text-white text-xs mt-auto mr-4 mb-4">
          En savoir plus
        </button>
      </div>
    </div>
  );
}
