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

export default function EditActualite({ CurrentPost, Onsave }) {
  function extractImageName(url = "") {
    if (!url) {
      return "";
    }
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    const filenameWithExtension = lastPart.split("?")[0];
    return filenameWithExtension;
  }

  const [postType, setPostType] = useState(null);
  const PostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  function init() {
    setPostType(CurrentPost.row.postType);
    setImagePreview(CurrentPost.row.image);

    if (CurrentPost.row.postType == "Pdf") {
      setPdfFileName(extractName(CurrentPost.row.postUrl));
    }
  }
  useEffect(() => init(), []);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  function extractName(url) {
    if (!url) {
      return "";
    }
    const parts = url.split("/");

    const lastPart = parts[parts.length - 1];

    const filename = lastPart.split("?")[0];

    return filename;
  }
  let imageUrL = CurrentPost.row.image;
  let pdfUrl = CurrentPost.row.postType == "Pdf" ? CurrentPost.row.postUrl : "";
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
      console.log("pdf url set ", data.publicUrl);
      pdfUrl = data.publicUrl;
    } catch (error) {
      throw error;
    }
  };

  const updateImage = async (imageFile) => {
    try {
      const deleteImage = await HandleDeleteImage(
        extractImageName(CurrentPost.row.image)
      );
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
    console.log("post type ", CurrentPost.row.postType);
    try {
      if (CurrentPost.row.postType == "Pdf") {
        const deletePdf = HandleDeletePdf(extractName(CurrentPost.row.postUrl));
      }
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
      console.log("Upload Success pdf");
    } catch (error) {
      const deleteImage = await HandleDeleteImage();
      throw new CustomError(
        "Pdf  Exist: Please Rename and Retry Upload",
        error.statusCode
      );
    }
  };
  const HandleDeleteImage = async (ImageName) => {
    try {
      const { data, error } = await supabase.storage
        .from("Posts")
        .remove([`Images/${ImageName}`]);
      if (error) {
        throw error;
      }
      console.log("Deletion Success");
    } catch (error) {
      throw error;
    }
  };
  const HandleDeletePdf = async (PdfName) => {
    try {
      const { data, error } = await supabase.storage
        .from("Posts")
        .remove([`Pdfs/${PdfName}`]);
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
    formJson["id"] = CurrentPost.row.id;
    console.log(selectedFile && selectedFile.name);
    try {
      if (
        selectedFile &&
        selectedFile.name != extractImageName(CurrentPost.row.image)
      ) {
        console.log("The images aren't the same");
        const updateImageUrl = await updateImage(selectedFile);
      }
      if (pdfFile) {
        const uploadPdf = await HandleuploadPdf(pdfFile);
      }
      UpdatePost(formJson);
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
          text: error.message,
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
        color="primary"
        onClick={handleOpen}
        className="mr-5"
      >
        Edit
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
              defaultValue={CurrentPost.row.postDate}
              id="postDate"
              name="postDate"
              label="Post Date"
              type="date"
              fullWidth
              variant="standard"
            />

            <TextField
              required
              margin="dense"
              defaultValue={CurrentPost.row.description}
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
                    }}
                  />
                )}
              </div>
            </div>

            <TextField
              select
              required
              margin="dense"
              defaultValue={CurrentPost.row.postType}
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
                defaultValue={CurrentPost.row.postUrl}
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
  async function UpdatePost(post) {
    console.log("pdf url", pdfUrl);
    console.log(post);
    console.log("url post ", CurrentPost.row);
    let postUrl = post.postType === "Pdf" ? pdfUrl : post.postUrl;
    const updatedFields = {};
    if (CurrentPost.row.postDate !== post.postDate) {
      updatedFields.postDate = post.postDate;
    }
    if (CurrentPost.row.Image !== imageUrL) {
      updatedFields.postImage = imageUrL;
    }
    if (CurrentPost.row.postType !== post.postType) {
      updatedFields.postType = post.postType;
    }
    if (CurrentPost.row.description !== post.description) {
      updatedFields.description = post.description;
    }
    if (CurrentPost.row.postUrl !== postUrl) {
      updatedFields.postUrl = postUrl;
    }

    if (Object.keys(updatedFields).length > 0) {
      try {
        const { data, error } = await supabase
          .from("post")
          .update(updatedFields)
          .eq("id", post.id)
          .select();
        if (error) {
          console.log(error.message);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message,
            timer: 5000,
            timerProgressBar: true,
            heightAuto: true,
          });
        } else {
          Onsave();
          Swal.fire({
            icon: "success",
            title: "The post updated successfully",
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
          text: error.message,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    } else {
      console.log("No changes to update.");
      Swal.fire({
        icon: "info",
        title: "No changes",
        text: "No changes detected in the post.",
        timer: 5000,
        timerProgressBar: true,
      });
    }
  }
}
