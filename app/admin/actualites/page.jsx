"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

export default function DataTable1() {
  const [rows, setRows] = useState([]);

  async function DeletePost(postId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase
            .from("post")
            .delete()
            .eq("id", postId);
          if (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              timer: 5000,
              timerProgressBar: true,
            });
          }
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          const updatedRows = rows.filter((row) => row.id !== postId);
          setRows(updatedRows);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            timer: 5000,
            timerProgressBar: true,
          });
        }
      }
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data, error } = await supabase.from("post").select("*");
        if (error) {
          console.log(error);
          throw error;
        }
        setRows(
          data.map((post) => ({
            id: post.id,
            description: post.description,
            image: post.postImage,
            postDate: post.postDate,
            postType: post.postType,
            postUrl: post.postUrl,
          }))
        );
      } catch (error) {
        console.error("Error testing Supabase connection:", error.message);
      }
    };

    fetchData();
  }, []);

  const getRowHeight = () => 100;

  const columns = [
    { field: "id", headerName: "ID", minWidth: 70, flex: 0.1 },
    { field: "description", headerName: "Description", minWidth: 230, flex: 1 },
    {
      field: "image",
      headerName: "Image",
      minWidth: 130,
      flex: 0.5,
      renderCell: (params) => (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={params.value}
            alt="Post Image"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      ),
    },
    { field: "postDate", headerName: "Post Date", minWidth: 10, flex: 0.5 },
    { field: "postType", headerName: "Post Type", minWidth: 50, flex: 0.5 },
    { field: "postUrl", headerName: "Post URL", minWidth: 130, flex: 0.5 },
    {
      field: "Actions",
      headerName: "Actions",
      minWidth: 130,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Button
            variant="contained"
            color="error"
            onClick={() => DeletePost(params.id)} // Pass a callback function to be executed onClick
            style={{ display: "flex", alignItems: "center" }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditAction(params)} // Call your edit function here
            style={{ display: "flex", alignItems: "center" }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white">
      <div>
        <div className="m-5 font-bold text-2xl">Gestions Des Postes</div>
        <div className="flex flex-row ml-10 mb-5 w-fit">
          <Button
            variant="contained"
            color="success"
            onClick={() => handleEditAction(params)}
            className="mr-5" // Add margin to the right of the button
            endIcon={<AddRoundedIcon />}
          >
            Add
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RestartAltRoundedIcon />}
            onClick={() => handleEditAction(params)}
          >
            Refresh
          </Button>
        </div>
      </div>
      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          getRowHeight={getRowHeight}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </div>
    </div>
  );