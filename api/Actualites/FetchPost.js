import { supabase } from "../../utils/supabaseClient";

export async function FetchPost(postId) {
  try {
    // Fetch post data from Supabase table
    const { data, error } = await supabase
      .from("post")
      .select("*")
      .eq("id", postId);

    if (error) {
      throw error; // Throw the error instead of returning it
    } else {
      return data[0]; // Assuming postId is unique, return the first item in data array
    }
  } catch (error) {
    // Handle error
    console.error("Error fetching post:", error.message);
    throw error; // Throw the error to handle it in the calling code
  }
}
