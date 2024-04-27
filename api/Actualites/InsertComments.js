import Swal from "sweetalert2";
import { supabase } from "../../utils/supabaseClient";

export async function InsertComments({
  postId,
  content,
  name,
  email,
  website,
}) {
  try {
    // Insert form data into Supabase table
    const { data, error } = await supabase.from("comments").insert([
      {
        postId: postId,
        content: content,
        name: name,
        email: email,
        website: website,
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
        title: "Your comment is awaiting moderation",
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
