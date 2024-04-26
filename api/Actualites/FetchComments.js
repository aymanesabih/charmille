import { supabase } from "../../utils/supabaseClient";

export async function FetchComments(postId) {
  console.log("Feccthing comment +" + postId);
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("status", "Accepted")
      .eq("postId", postId);

    if (error) {
      return error.message;
    } else {
      return data;
    }
  } catch (error) {
    return error.message;
  }
}
