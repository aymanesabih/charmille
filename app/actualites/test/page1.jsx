"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import AddActualite from "../../components/component/Actualites/AddActualite";
import EditActualite from "../../components/component/Actualites/EditActualite";
import Skeleton from "@mui/material/Skeleton";

export default function DataTable1() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  function extractName(imageLink) {
    const parts = imageLink.split("/");
    const imageName = parts[parts.length - 1];
    return imageName;
  }
  const HandleDeleteImage = async (ImgName) => {
    console.log("delete", [`Images/${ImgName}`]);
    try {
      const { data, error } = await supabase.storage
        .from("Posts")
        .remove([`Images/${ImgName}`]);
      if (error) {
        throw error;
      }
      console.log("Deletion Success");
    } catch (error) {
      throw error;
    }
  };
  const HandleDeletePdf = async (pdfName) => {
    console.log("delete", [`Images/${pdfName}`]);
    try {
      const { data, error } = await supabase.storage
        .from("Posts")
        .remove([`Pdfs/${pdfName}`]);
      if (error) {
        throw error;
      }
      console.log("Deletion Success");
    } catch (error) {
      throw error;
    }
  };
  async function DeletePost(post) {
    console.log("post strcuture ", post);
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
          let imageName = extractName(post.row.image);
          const deleteImage = await HandleDeleteImage(imageName);

          if (post.row.postType == "Pdf") {
            let pdfName = extractName(post.row.postUrl);
            const deletePdf = HandleDeletePdf(pdfName);
          }
          console.log("deleting", post.row.image);
          const { error } = await supabase
            .from("post")
            .delete()
            .eq("id", post.id);

          if (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message,
              timer: 5000,
              timerProgressBar: true,
            });
          }

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          const updatedRows = rows.filter((row) => row.id !== post.id);
          setRows(updatedRows);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
            timer: 5000,
            timerProgressBar: true,
          });
        }
      }
    });
  }
  function extractName(url) {
    if (!url) {
      return "";
    }
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    const filename = lastPart.split("?")[0];
    return filename;
  }
  const fetchData = async () => {
    setLoading(true);
    console.log("Fetching data...");
    try {
      let { data, error } = await supabase.from("post").select("*");
      if (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          timer: 5000,
          timerProgressBar: true,
        });
      }
      setRows(
        data.map((post) => ({
          id: post.id,
          description: post.description,
          image: post.postImage,
          postDate: post.postDate,
          postType: post.postType,
          postUrl:
            post.postType == "Pdf" ? extractName(post.postUrl) : post.postUrl,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error testing Supabase connection:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const getRowHeight = () => 100;

  const columns = [
    { field: "id", headerName: "ID", minWidth: 70, flex: 0.1, sort: "desc" },
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
    {
      field: "postUrl",
      headerName: "Post URL OR PDF ",
      minWidth: 130,
      flex: 0.5,
    },
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
            onClick={() => DeletePost(params)} // Pass a callback function to be executed onClick
            style={{ display: "flex", alignItems: "center" }}
          >
            Delete
          </Button>
          <EditActualite CurrentPost={params} Onsave={fetchData} />
        </div>
      ),
    },
  ];
  const rows1 = [
    {
      id: 1,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: "https://via.placeholder.com/140x120",
      postDate: "2024-05-01",
      postType: "News",
      postUrl: "https://example.com",
    },
    {
      id: 2,
      description:
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      image: "https://via.placeholder.com/140x120",
      postDate: "2024-05-02",
      postType: "Blog",
      postUrl: "https://example.com",
    },
    {
      id: 3,
      description: "Nullam quis risus eget urna mollis ornare vel eu leo.",
      image: "https://via.placeholder.com/140x120",
      postDate: "2024-05-03",
      postType: "Article",
      postUrl: "https://example.com",
    },
    {
      id: 4,
      description:
        "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
      image: "https://via.placeholder.com/140x120",
      postDate: "2024-05-04",
      postType: "Event",
      postUrl: "https://example.com",
    },
    {
      id: 5,
      description:
        "Maecenas sed diam eget risus varius blandit sit amet non magna.",
      image: "https://via.placeholder.com/140x120",
      postDate: "2024-05-05",
      postType: "Tutorial",
      postUrl: "https://example.com",
    },
  ];
  const columns1 = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 70,
      flex: 0.1,
      sort: "desc",
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={25} height={25} />
        </div>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 230,
      flex: 1,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={170} height={20} />
        </div>
      ),
    },
    {
      field: "image",
      headerName: "Image",
      minWidth: 130,
      flex: 0.5,
      renderCell: (params) => (
        <Skeleton variant="rectangular" className="" width={140} height={120} />
      ),
    },
    {
      field: "postDate",
      headerName: "Post Date",
      minWidth: 10,
      flex: 0.5,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={100} height={20} />
        </div>
      ),
    },
    {
      field: "postType",
      headerName: "Post Type",
      minWidth: 50,
      flex: 0.5,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={100} height={20} />
        </div>
      ),
    },
    {
      field: "postUrl",
      headerName: "Post URL OR PDF ",
      minWidth: 130,
      flex: 0.5,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={160} height={20} />
        </div>
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      minWidth: 130,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-9">
          <Skeleton variant="rectangular" width={100} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white">
      <div>
        <div className="m-5 font-bold text-2xl">Gestions Des Postes</div>
        <div className="flex flex-row ml-10 mb-5 w-fit">
          <AddActualite />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<RestartAltRoundedIcon />}
            onClick={fetchData}
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
}

export async function InsertPost(post) {
  console.log(post);
  try {
    // Insert form data into Supabase table
    const { data, error } = await supabase.from("post").insert([
      {
        postDate: post.postDate,
        postImage: post.postImage,
        postType: post.postType,
        description: post.description,
        postUrl: post.postUrl,
      },
    ]);
    if (error) {
      setMessage(error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        timer: 5000,
        timerProgressBar: true,
        heightAuto: true,
      });
    } else {
      // Display toast notification
      Swal.fire({
        icon: "success",
        title: "The post created successfully",
        timer: 5000,
        timerProgressBar: true,
        heightAuto: true,
      });
    }
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
