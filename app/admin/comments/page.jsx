"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import Skeleton from "@mui/material/Skeleton";

export default function Comments() {
  const [rows, setRows] = useState([]);
  function extractName(imageLink) {
    const parts = imageLink.split("/");
    const imageName = parts[parts.length - 1];
    return imageName;
  }
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    setLoading(true);
    console.log("Fetching data...");
    try {
      const { data, error } = await supabase.from("comments").select("*");

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
          timer: 5000,
          timerProgressBar: true,
        });
      }
      setRows(
        data.map((comment) => ({
          id: comment.id,
          Post_ID: comment.postId,
          content: comment.content,
          name: comment.name,
          Date: formatDate(comment.created_at),
          email: comment.email,
          website: comment.website,
          status: comment.status,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error testing Supabase connection:", error.message);
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString("en-US", options);

    return formattedDate;
  }
  useEffect(() => {
    fetchData();
  }, []);
  const getRowHeight = () => 100;

  const columns = [
    { field: "id", headerName: "ID", minWidth: 50, flex: 0.1, sort: "desc" },
    {
      field: "Post_ID",
      headerName: "Post ID",
      minWidth: 80,
      flex: 0.1,
      sort: "desc",
    },
    {
      field: "Date",
      headerName: "Date",
      minWidth: 140,
      flex: 0.1,
      sort: "desc",
    },
    { field: "name", headerName: "name", minWidth: 90, flex: 1 },
    { field: "email", headerName: "email", minWidth: 150, flex: 1 },
    { field: "content", headerName: "content", minWidth: 160, flex: 1 },
    { field: "website", headerName: "website", minWidth: 100, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 70,
      flex: 1,
      renderCell: (params) => (
        <div
          className={`flex justify-center space-x-4  ${
            params.value === "Accepted" ? "text-green-500 " : "text-red-500"
          }`}
        >
          {params.value}
        </div>
      ),
    },

    {
      field: "Actions",
      headerName: "Actions",
      minWidth: 160,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Button
            variant="contained"
            color="error"
            onClick={() => Delete(params)}
            style={{ display: "flex", alignItems: "center" }}
          >
            Delete
          </Button>
          {params.row && params.row.status == "Pending" && (
            <Button
              variant="contained"
              color="success"
              onClick={() => Accept(params)}
              style={{ display: "flex", alignItems: "center" }}
            >
              Accept
            </Button>
          )}
        </div>
      ),
    },
  ];
  const columns1 = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 50,
      flex: 0.1,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={25} height={25} />
        </div>
      ),
    },
    {
      field: "Post_ID",
      headerName: "Post ID",
      minWidth: 80,
      flex: 0.1,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={30} height={30} />
        </div>
      ),
    },
    {
      field: "Date",
      headerName: "Date",
      minWidth: 140,
      flex: 0.1,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={140} height={35} />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 90,
      flex: 1,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={140} height={35} />
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={150} height={35} />
        </div>
      ),
    },
    {
      field: "content",
      headerName: "Content",
      minWidth: 160,
      flex: 1,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={160} height={35} />
        </div>
      ),
    },
    {
      field: "website",
      headerName: "Website",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={160} height={35} />
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 70,
      flex: 1,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={100} height={35} />
        </div>
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      minWidth: 160,
      flex: 0.5,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={70} height={35} />
          <Skeleton variant="rectangular" width={70} height={35} />
        </div>
      ),
    },
  ];
  const rows1 = [
    {
      id: 1,
      Date: "2024-05-01",
      name: "John Doe",
      email: "john@example.com",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      website: "example.com",
      status: "Accepted",
    },
    {
      id: 2,
      Date: "2024-05-02",
      name: "Jane Smith",
      email: "jane@example.com",
      content:
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      website: "example.com",
      status: "Refused",
    },
    {
      id: 3,
      Date: "2024-05-03",
      name: "Alice Johnson",
      email: "alice@example.com",
      content: "Nullam quis risus eget urna mollis ornare vel eu leo.",
      website: "example.com",
      status: "Accepted",
    },
    {
      id: 4,
      Date: "2024-05-04",
      name: "Bob Brown",
      email: "bob@example.com",
      content:
        "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
      website: "example.com",
      status: "Refused",
    },
    {
      id: 5,
      Date: "2024-05-05",
      name: "Eve Wilson",
      email: "eve@example.com",
      content:
        "Maecenas sed diam eget risus varius blandit sit amet non magna.",
      website: "example.com",
      status: "Pending",
    },
  ];

  return (
    <div className="bg-white">
      <div>
        <div className="m-5 font-bold text-2xl">Gestions Des Commentaires</div>
        <div className="flex flex-row ml-10 mb-5 w-fit">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RestartAltRoundedIcon />}
            onClick={fetchData}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="error"
            className="ml-5"
            onClick={DeleteAll}
          >
            Delete All
          </Button>
        </div>
      </div>
      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          getRowHeight={getRowHeight}
          rows={loading ? rows1 : rows}
          columns={loading ? columns1 : columns}
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
  async function Accept(params1) {
    try {
      const { data, error } = await supabase
        .from("comments")
        .update({ status: "Accepted" })
        .eq("id", params1.row.id);
      if (error) {
        console.error("Error accepting comment:", error.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          timer: 5000,
          timerProgressBar: true,
          heightAuto: true,
        });
      }
      Swal.fire({
        icon: "success",
        title: "The comment accepted successfully",
        timer: 5000,
        timerProgressBar: true,
        heightAuto: true,
      });
      fetchData();
    } catch (error) {
      console.error("Error updating comment:", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        timer: 5000,
        timerProgressBar: true,
        heightAuto: true,
      });
    }
  }
  async function Delete(params1) {
    console.log(params);
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
          const { data, error } = await supabase
            .from("comments")
            .delete()
            .eq("id", params1.row.id);
          if (error) {
            console.error("Error accepting comment:", error.message);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              timer: 5000,
              timerProgressBar: true,
              heightAuto: true,
            });
          }
          Swal.fire({
            icon: "success",
            title: "The comment deleted successfully",
            timer: 5000,
            timerProgressBar: true,
            heightAuto: true,
          });
          fetchData();
        } catch (error) {
          console.error("Error updating comment:", error.message);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            timer: 5000,
            timerProgressBar: true,
            heightAuto: true,
          });
        }
      }
    });
  }
  async function DeleteAll(params1) {
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
          const { data, error } = await supabase
            .from("comments")
            .delete()
            .eq("status", "Pending");

          if (error) {
            console.error("Error accepting comment:", error.message);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              timer: 5000,
              timerProgressBar: true,
              heightAuto: true,
            });
          }
          Swal.fire({
            icon: "success",
            title: "The comment deleted successfully",
            timer: 5000,
            timerProgressBar: true,
            heightAuto: true,
          });
          fetchData();
        } catch (error) {
          console.error("Error updating comment:", error.message);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            timer: 5000,
            timerProgressBar: true,
            heightAuto: true,
          });
        }
      }
    });
  }
}
