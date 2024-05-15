"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { supabase } from "../../../utils/supabaseClient";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useState } from "react";

import { useEffect } from "react";
class CustomError extends Error {
  constructor(message, type, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;

    this.statusCode = statusCode;
  }
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
export default function AddActualite({ Onsave }) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  let imageUrL = "";
  let pdfUrl = "";
  const [selectedFile, setSelectedFile] = useState(null);
  const Url = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from("Posts/Images")
        .getPublicUrl(path);
      if (error) {
        throw error;
      }

      console.log("Image url set ", data.publicUrl);
      imageUrL = data.publicUrl;
    } catch (error) {
      throw error;
    }
  };
  const Url1 = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from("Posts/Pdfs")
        .getPublicUrl(path);
      if (error) {
        throw error;
      }
      pdfUrl = data.publicUrl;
      console.log("public url set ", data.publicUrl);
      console.log("Public url set ", pdfUrl);
    } catch (error) {
      throw error;
    }
  };
  const uploadImage = async (imageFile) => {
    try {
      const { data, error } = await supabase.storage
        .from("Posts/Images")
        .upload(imageFile.name, imageFile);
      if (error) {
        throw new CustomError(
          "Image  Exist: Please Rename and Retry Upload",
          error.statusCode
        );
      }
      Url(data.path);
    } catch (error) {
      throw new CustomError(
        "Image  Exist: Please Rename and Retry Upload",

        error.statusCode
      );
    }
  };
  const HandleuploadPdf = async (pdfFile) => {
    try {
      // Upload PDF file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("Posts/Pdfs")
        .upload(pdfFile.name, pdfFile);
      if (error) {
        const deleteImage = await HandleDeleteImage();
        throw new CustomError(
          "Pdf  Exist: Please Rename and Retry Upload",
          error.statusCode
        );
      }
      Url1(data.path);
      console.log("Upload Success pdf", data);
      console.log("Upload Success pdf");
    } catch (error) {
      const deleteImage = await HandleDeleteImage();
      throw new CustomError(
        "Pdf  Exist: Please Rename and Retry Upload",
        error.statusCode
      );
    }
  };
  const HandleDeleteImage = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("Posts")
        .remove([`Images/${selectedFile.name}`]);
      if (error) {
        throw error;
      }
      console.log("Deletion Success");
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log("uploading form data");
    try {
      const uploadedImageUrl = await uploadImage(selectedFile);
      if (pdfFile) {
        const uploadPdf = await HandleuploadPdf(pdfFile);
      }
      InsertPost(formJson);
      handleClose();
    } catch (error) {
      handleClose();
      if ((error.statusCode = "409")) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
          timer: 5000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          timer: 5000,
          timerProgressBar: true,
        });
      }
    }
  };
  const [imagePreview, setImagePreview] = useState(null);
  const [ImageFile, setImageFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
      setSelectedFile(file);
    }
  };
  const [postType, setPostType] = useState(null);
  const PostTypeChange = (event) => {
    setPostType(event.target.value);
  };
  const [pdfFileName, setPdfFileName] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const onPdfChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };
  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="success"
        onClick={handleOpen}
        className="mr-5"
        endIcon={<AddRoundedIcon />}
      >
        Add
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details for the new post.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="postDate"
              name="postDate"
              label="Post Date"
              type="date"
              fullWidth
              variant="standard"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
            <TextField
              required
              margin="dense"
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              fullWidth
              variant="standard"
            />
            <div className="">
              <Button
                className="mt-5"
                component="label"
                margin="dense"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                type="file"
                onChange={handleFileChange}
                startIcon={<CloudUploadIcon />}
              >
                Upload Post Image
                <VisuallyHiddenInput type="file" />
              </Button>
              <div className="mt-2">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    style={{
                      marginLeft: "8px",
                    }} // Adjust the size of the image preview
                  />
                )}
              </div>
            </div>

            <TextField
              select
              required
              margin="dense"
              id="postType"
              name="postType"
              label="Post Type"
              fullWidth
              variant="standard"
              onChange={PostTypeChange}
            >
              <MenuItem value="Facebook">Facebook</MenuItem>
              <MenuItem value="Pdf">Pdf</MenuItem>
            </TextField>
            {postType && postType === "Pdf" && (
              <div className="mt-5">
                <label className="cursor-pointer">
                  <input
                    className="hidden"
                    type="file"
                    onChange={onPdfChange}
                    accept=".pdf"
                  />
                  <div className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-400 transition duration-300 ease-in-out">
                    <CloudUploadIcon className="mr-2" />
                    Upload PDF
                  </div>
                </label>
                {pdfFileName && (
                  <div className="mt-2 text-sm text-gray-600">
                    Uploaded PDF:{" "}
                    <span className="font-semibold">{pdfFileName}</span>
                  </div>
                )}
              </div>
            )}

            {postType && postType === "Facebook" && (
              <TextField
                required
                margin="dense"
                id="postUrl"
                name="postUrl"
                label="Post URL"
                type="url"
                fullWidth
                variant="standard"
              />
            )}
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Add Post</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
  async function InsertPost(post) {
    let postUrl = "";
    if (post.postType == "Pdf") {
      postUrl = pdfUrl;
    } else {
      postUrl = post.postUrl;
    }
    console.log("post url ", postUrl);
    try {
      const { data, error } = await supabase.from("post").insert([
        {
          postDate: post.postDate,
          postImage: imageUrL,
          postType: post.postType,
          description: post.description,
          postUrl: postUrl,
        },
      ]);
      if (error) {
        console.log(error.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          timer: 5000,
          timerProgressBar: true,
          heightAuto: true,
        });
      } else {
        Onsave();
        Swal.fire({
          icon: "success",
          title: "The post created successfully",
          timer: 5000,
          timerProgressBar: true,
          heightAuto: true,
        });
      }
    } catch (error) {
      console.log(error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        timer: 5000,
        timerProgressBar: true,
      });
    }
  }
}
