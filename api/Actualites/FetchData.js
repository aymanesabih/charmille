import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import Card from "../../components/ui/Atcualite/PostCard";
import TextField from "@mui/material/TextField";
import { Skeleton } from "@mui/material";
const itemsPerPage = 8;

export default function FetchPosts() {
  const [postData, setPostData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [Rest, setRest] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // State to keep track of sorting order
  const [years, setYears] = useState([]); // State to store unique years from the data

  // Function to fetch data
  const fetchData = async () => {
    try {
      let { data, error } = await supabase.from("post").select("*");

      if (error) {
        throw error;
      }

      // Update the years array with unique years from the original data
      const uniqueYears = [
        ...new Set(data.map((post) => new Date(post.postDate).getFullYear())),
      ];
      setYears(uniqueYears);

      // Sort data based on sorting selection
      if (sortBy === "latest") {
        data.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
      } else if (sortBy === "oldest") {
        data.sort((a, b) => new Date(a.postDate) - new Date(b.postDate));
      } else if (Number.isInteger(parseInt(sortBy))) {
        // Filter posts by the selected year
        data = data.filter(
          (post) => new Date(post.postDate).getFullYear() === parseInt(sortBy)
        );
      }

      setPostData(data);
      setLoading(false);
      setRest(data.length - itemsPerPage);
    } catch (error) {
      console.error("Error testing Supabase connection:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortBy]); // Fetch data whenever sortBy state changes

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
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
        <div className="inline-block relative">
          <select
            className="block appearance-none w-full md:w-48 lg:w-64 bg-white border border-gray-400 text-gray-800 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option disabled value="">
              Sort by
            </option>
            <optgroup label="Sort by">
              <option className="text-gray-900" value="latest">
                Latest
              </option>
              <option className="text-gray-900" value="oldest">
                oldest
              </option>
            </optgroup>
            <optgroup label="Sort by year">
              {years.map((year) => (
                <option className="text-gray-900" key={year} value={year}>
                  {year}
                </option>
              ))}
            </optgroup>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center mr-2 text-gray-600">
            {/* Add your sorting image here */}
            <img src="/Images/sort.png" alt="Sort Icon" className="h-4 w-4" />
          </div>
        </div>
      </div>

      {loading && (
        <div className="grid m-10 sm:grid-cols-1 grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(itemsPerPage)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              className=" ml-2 w-9/12"
              height={250}
            />
          ))}
        </div>
      )}
      <div className="grid  sm:grid-cols-1 grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
          className="flex flex-col ease-in items-center border-2 border-gray-500  text-gray-600  bg-white hover:bg-white hover:text-[#06278c] hover:border-[#06278c] font-semibold py-2 px-6  text-xs mt-4 mx-auto block"
          onClick={loadMore}
        >
          Voir plus ({Rest})
        </button>
      )}
    </div>
  );
}
