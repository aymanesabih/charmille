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
import Swal from "sweetalert2";

import { useEffect } from "react";

export  function FormDialog() {
  const [open, setOpen] = React.useState(true);
  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    InsertPost(formJson);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
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
              defaultValue={new Date().toISOString().split("T")[0]} // Set default value to today's date
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
            <TextField
              required
              margin="dense"
              id="postImage"
              name="postImage"
              label="Post Image URL"
              type="url"
              fullWidth
              variant="standard"
            />
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
            <TextField
              select
              required
              margin="dense"
              id="postType"
              name="postType"
              label="Post Type"
              fullWidth
              variant="standard"
            >
              <MenuItem value="Facebook">Facebook</MenuItem>
              <MenuItem value="Pdf">Pdf</MenuItem>
            </TextField>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Add Post</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
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
