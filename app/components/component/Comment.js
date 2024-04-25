import Image from "next/image";

export default function Comment(comment) {
  console.log("comments ", comment);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-center justify-center sm:justify-start">
        <div className="rounded-full">
          <Image
            className="object-cover rounded-full"
            src="/Images/profile.png"
            alt="user profile"
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold">{comment.id}</span>
            <span className="text-xs text-muted-foreground">
              {comment.created_at}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}
