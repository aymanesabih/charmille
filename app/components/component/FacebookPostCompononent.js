import React, { useState, useEffect } from "react";
import { FetchPost } from "../../../api/Actualites/FetchPost";
import { InsertComments } from "../../../api/Actualites/InsertComments";

export default function FacebookPostComponent({ postID }) {
  const [post, setPost] = useState(null);
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postData = await FetchPost(postID);
        setPost(postData);
      } catch (error) {
        console.error("Error fetching post:", error.message);
      }
    };

    fetchPostData();
  }, [postID]);

  useEffect(() => {
    // After post data is fetched and post state is updated, initialize Facebook SDK
    if (post) {
      window.FB && window.FB.XFBML.parse();
    }
  }, [post]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1">
      <div className="text-xl md:text-4xl w-full text-violet-950 mt-10">
        {post && post.description}
      </div>
      {post && ( // Render the post div only when post is not null
        <div
          className="fb-post mt-5 sm:w-20 border-2"
          data-href={post.postUrl}
          data-show-text="true"
        ></div>
      )}
      <div className="mt-10 text-violet-950">
        <hr />
        By Noaman Makhlouf | Date | Actualité, Évènement | 0 Comments |{" "}
        {post && post.id}
        <hr className="mb-5" />
        <div>
          <MyForm postID={postID} />
        </div>
      </div>
    </div>
  );
}

function MyForm({ postID }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    Comment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    InsertComments({
      postId: postID, // Use the postID prop
      content: formData.Comment,
      name: formData.name,
      email: formData.email,
      website: formData.website,
    });
    setFormData({
      name: "",
      email: "",
      website: "",
      Comment: "",
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-lg shadow-lg"
      >
        <div className="text-lg font-bold mb-4">Leave a comment</div>

        <hr className="mb-4" />

        <div className="bg-white p-4 rounded-lg mb-4">
          <textarea
            id="Comment"
            name="Comment"
            value={formData.Comment}
            onChange={handleChange}
            required
            placeholder="Comment..."
            className="bg-transparent focus:border-none ml-2 h-36 text-gray-800 focus:outline-none w-full resize-none"
          ></textarea>
        </div>
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/3 px-2 mb-4">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name (required)"
              className="bg-white h-10 focus:border-none ml-2 text-gray-800 focus:outline-none w-full border rounded-lg px-4"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email (required)"
              className="bg-white h-10 focus:border-none ml-2 text-gray-800 focus:outline-none w-full border rounded-lg px-4"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4">
            <input
              type="text"
              id="website"
              name="website"
              placeholder="Website (optional)"
              className="bg-white h-10 focus:border-none ml-2 text-gray-800 focus:outline-none w-full border rounded-lg px-4"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Post a comment
        </button>
      </form>
    </div>
  );
}
