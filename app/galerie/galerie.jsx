"use client";
import React, { useEffect, useState } from "react";
import { FaPlay, FaInstagram } from "react-icons/fa";

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(8);

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

  const loadMorePosts = () => {
    setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 8);
  };

  return (
    <div className="mx-4 md:mx-8 lg:mx-20 my-10">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.slice(0, visiblePosts).map((post) => (
          <a key={post.id} href={post.permalink}>
            {post.media_type === "VIDEO" ? (
              <div className="relative">
                <img
                  src={post.thumbnail_url}
                  alt={post.caption}
                  title={post.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FaPlay className="text-white text-5xl" />
                </div>
              </div>
            ) : (
              <img
                src={post.media_url}
                alt={post.caption}
                title={post.caption}
                className="w-full h-full object-cover"
              />
            )}
          </a>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {visiblePosts < posts.length && (
          <button
            onClick={loadMorePosts}
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out mr-2"
          >
            Voir Plus
          </button>
        )}
        <a
          href="https://www.instagram.com/ecolecharmilles/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2"
        >
          <button className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out flex items-center">
            <FaInstagram className="text-white mr-2" />
            Suivez-nous sur Instagram
          </button>
        </a>
      </div>
    </div>
  );
};

export default InstagramFeed;
