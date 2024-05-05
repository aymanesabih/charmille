"use client";
import { useEffect, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Replace 'YOUR_ACCESS_TOKEN' with your actual Instagram access token
        const accessToken =
          "IGQWROV1hqQlp6SFBJSXpBd3hydUVKLXcwLURJd2M3VGZA0LTJFZAzVqbGtZAdGRhNlNyV0UzRzNqRTBzLXl5QWpQODYyaXVPMjMxVGpnb2VPNjM3bDFFTUhaakNMaTBTcTRzaDduZAjhHcmNSRDEwaldvRkRtS3hiR3MZD";
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${accessToken}`
        );
        const data = await response.json();
        setPosts(data.data);
      } catch (error) {
        console.error("Error fetching Instagram posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4">
      {posts.map((post) => (
        <div key={post.id} className="post">
          {post.media_type === "VIDEO" && (
            <FaPlayCircle className="play-icon" />
          )}
          <img src={post.media_url} alt={post.caption} />
          <p>{post.caption}</p>
        </div>
      ))}
    </div>
  );
};

export default InstagramFeed;
