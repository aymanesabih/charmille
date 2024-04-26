import { supabase } from "../../utils/supabaseClient";

export async function FetchPost(postId) {
  try {
    // Fetch post data from Supabase table
    const { data, error } = await supabase
      .from("post")
      .select("*")
      .eq("id", postId);

    if (error) {
      throw error;
    } else {
      return data[0];
    }
  } catch (error) {
    // Handle error
    console.error("Error fetching post:", error.message);
    throw error; // Throw the error to handle it in the calling code
  }
}
