"use client";
import FacebookPostCompononent from "../../../components/component/Actualites/FacebookPostCompononent";
import { FetchComments } from "../../../api/Actualites/FetchComments";
import { useEffect } from "react";
import { useRouter, notFound } from "next/navigation";
import { useState } from "react";
import { FetchPost } from "../../../api/Actualites/FetchPost";

export default function FacebookPost({ params }) {
  console.log("number format ", Number(params["postID"]));
  if (isNaN(Number(params["postID"]))) {
    notFound();
  }

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postData = await FetchPost(Number(params["postID"]));
        setPost(postData);
      } catch (error) {
        console.error("Error fetching post:", error.message);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [params]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && post === null) {
      notFound();
    }
  }, [loading, post]);

  console.log("Post id : ", params["postID"]);
  useEffect(() => {
    // Create a <script> element
    const script = document.createElement("script");
    script.src =
      "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0&appId=1079056626765845";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.nonce = "M1jobWwC";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main className=" bg-white">
      <div className="mx-auto md:mx-20">
        <div id="fb-root"></div>
        {post && <FacebookPostCompononent postID={params.postID} />}
      </div>
    </main>
  );
}
