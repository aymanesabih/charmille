import Image from "next/image";

export default function Comments({ comments }) {
  return (
    <div className="mt-16 mb-16">
      <div className="flex items-center">
        <div className="text-black">{comments && comments.length} Comments</div>
        <div className="w-5/6 ml-1">
          <hr className="mt-1 border-gray-300 border-2" />
          <hr className="mt-1 border-gray-300 border-2" />
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
