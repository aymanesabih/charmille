import React, { useState, useEffect } from "react";
import { FetchPost } from "../../../api/Actualites/FetchPost";
import { InsertComments } from "../../../api/Actualites/InsertComments";
import Comments from "./Comments";
import { FetchComments } from "../../../api/Actualites/FetchComments";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function FacebookPostComponent({ postID }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    }
  }, [post]);

  const [comment, setcomment] = useState(null);
  useEffect(() => {
    const fetchcommentData = async () => {
      try {
        const commentData = await FetchComments(3);
        setcomment(commentData);
        console.log("set comments : ", commentData);
      } catch (error) {
        console.error("Error fetching comment:", error.message);
      }
    };

    fetchcommentData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1">
      {loading ? (
        <Stack spacing={1}>
          {/* For variant="text", adjust the height via font-size */}

          <Skeleton animation="wave" className="w-4/6 mt-10" height={60} />

          <div>
            <Skeleton
              variant="rectangular"
              className=" ml-20"
              width={842}
              height={842}
            />
          </div>
        </Stack>
      ) : (
        <div className="text-xl md:text-4xl w-full text-violet-950 mt-10">
          {post && post.description}
          {console.log("post type ", post && post.postType)}
          {post && (
            <div className="mt-5  border-non">
              {post.postType === "Facebook" && (
                <div
                  className="fb-post sm:w-20 border-none w-full"
                  data-href={post.postUrl}
                  data-show-text="true"
                ></div>
              )}
              {post.postType === "Pdf" && (
                <div className="flex justify-center items-center">
                  <embed
                    className=""
                    width="842"
                    height="842"
                    src={post.postUrl}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-10 text-violet-950">
        <hr />
        By Noaman Makhlouf | {post && post.postDate} | Actualité, Évènement |{" "}
        {comment && comment.length} Comment
        <hr className="mb-5" />
        <div>
          {loading ? (
            <div>
              <div className="flex flex-row w-full">
                <Skeleton
                  variant="text"
                  className="  "
                  width={100}
                  height={70}
                />
                <Skeleton
                  variant="text"
                  className=" ml-2 mt-6 w-5/6"
                  height={20}
                />
              </div>
              <div className="flex flex-row">
                <div>
                  <Skeleton
                    variant="circular"
                    width={65}
                    height={65}
                    className=" mt-3"
                  />
                </div>

                <Skeleton
                  variant="text"
                  sx={{ fontSize: "2rem" }}
                  className="m-1   w-96  h-16 mt-2 ml-5"
                />
              </div>
            </div>
          ) : (
            <Comments comments={comment} />
          )}

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
          className=" bg-violet-950 hover:text-violet-950 hover:bg-white hover:border-2 border-violet-950 text-white font-bold py-2 px-4 rounded-lg"
        >
          Post a comment
        </button>
      </form>
    </div>
  );
}
