"use client";
import { useEffect, useState } from "react";

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
    <div id="instafeed-container" className="grid grid-cols-4 gap-4">
      {posts.map((post) => (
        <a key={post.id} href={post.permalink}>
          {post.media_type === "VIDEO" ? (
            <video controls>
              <source src={post.media_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={post.media_url} alt={post.caption} title={post.caption} />
          )}
        </a>
      ))}
    </div>
  );
};

export default InstagramFeed;
