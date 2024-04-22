

export default function Card({ imageUrl, title, Date }) {
  return (
    <div className="bg-white rounded-lg shadow-md w-10/12  mx-auto  mt-12  hover:shadow-2xl hover:cursor-pointer">
      {/* Image */}
      <div>
        <img
          src={imageUrl}
          alt={title}
          className="   w-full rounded-t-lg object-cover"
        />
      </div>

      {/* Title */}
      <h2 className="text-violet-950 pl-6 pt-4 pb-2 text-base">{title}</h2>

      {/* Date */}
      <p className="text-red-600 pl-6 pb-4 text-sm">{Date}</p>

      {/* "Voir plus" button */}
      <button className="bg-[#06278c] hover:bg-white hover:text-[#06278c]   mb-5 hover:border-[#06278c] border-2 font-semibold py-2 px-6 rounded-2xl ml-6 text-white text-xs">
        En savoir plus
      </button>
    </div>
  );
}
