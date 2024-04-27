import { supabase } from "../../utils/supabaseClient";

export async function FetchPost(postId) {
  console.log("Fetching post with id:", postId);
  try {
    // Fetch post data from Supabase table
    const { data, error } = await supabase
      .from("post")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) {
      throw error;
    } else if (data) {
      console.log("Post data:", data);
      return data;
    } else {
      throw error; // Return null if no data is returned (post not found)
    }
  } catch (error) {
    throw error;
  }
}
