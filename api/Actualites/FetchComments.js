import { supabase } from "../../utils/supabaseClient";

export default async function FetchComments({ postId }) {
  try {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("status", "Accepted")
      .eq("postId", postId);

    if (error) {
      <div>{error.message}</div>;
    } else {
      return <div> {data.id}</div>; // Assuming postId is unique, return the first item in data array
    }
  } catch (error) {
    <div>{error.message}</div>;
  }
}
