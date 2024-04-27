import Image from "next/image";

export default function Comments({ comments }) {
  return (
    <div className="mt-16 mb-16">
      <div className="flex flex-col md:flex-row items-center">
        <div className="text-black md:mr-4 md:mb-0 mb-2 p-2 rounded-md border border-gray-300">
          {comments && comments.length} Comments
        </div>
        <div className="w-full md:w-5/6 md:ml-4">
          <hr className="mt-2 md:mt-0 border-t border-gray-300" />
          <hr className="mt-2 border-t border-gray-300" />
        </div>
      </div>

      {comments &&
        comments.map((comment) => (
          <div key={comment.id} className="flex items-center mt-4">
            <div className="rounded-full">
              <Image
                className="object-cover rounded-full"
                src="/Images/profile.png"
                alt="user profile"
                width={65}
                height={65}
              />
            </div>
            <div className="ml-5">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold">{comment.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString("en-US", options);

  return formattedDate;
}
