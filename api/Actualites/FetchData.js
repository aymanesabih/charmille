"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import Card from "../../app/components/ui/Atcualite/PostCard";
import TextField from "@mui/material/TextField";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import IconButton from "@mui/material/IconButton";
import { Button } from "@radix-ui/themes";

const itemsPerPage = 8;

export default function FetchPosts() {
  const [postData, setPostData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [Rest, setRest] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from("post").select("*");

        if (error) {
          throw error;
        }

        setPostData(data);
        setLoading(false);
        setRest(data.length - itemsPerPage);
      } catch (error) {
        console.error("Error testing Supabase connection:", error.message);
      }
    }

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs only once, similar to componentDidMount

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const loadMore = async () => {
    try {
      const { data: newData, error } = await supabase
        .from("post")
        .select("*")
        .range(postData.length, postData.length + itemsPerPage - 1); // Fetch next set of items

      if (error) {
        throw error;
      }

      // Append new data with existing postData
      setPostData((prevData) => [...prevData, ...newData]);
      setRest((prevRest) => prevRest - itemsPerPage);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching more data:", error.message);
    }
  };

  // Filter data based on search query
  const filteredData = postData.filter((post) =>
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="bg-white">
      <div className="flex items-center justify-center bg-white p-4">
        <div className="mr-4">
          <TextField
            id="outlined-basic"
            label="Search..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading && <p>Loading...</p>}
        {!loading &&
          filteredData
            .slice(0, itemsPerPage * currentPage)
            .map((post) => (
              <Card
                key={post.id}
                postId={post.id}
                imageUrl={post.postImage}
                title={post.description}
                Date={post.postDate}
              />
            ))}
      </div>

      {filteredData.length > itemsPerPage * currentPage && (
        <button
          className="flex flex-col ease-in items-center border-2 border-black bg-[#999] hover:bg-white hover:text-[#06278c] hover:border-[#06278c] font-semibold py-2 px-6 text-black text-xs mt-4 mx-auto block"
          onClick={loadMore}
        >
          Voir plus ({Rest})
        </button>
      )}
    </div>
  );
}
