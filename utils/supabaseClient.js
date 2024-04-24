// utils/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://doqgfvlrcmvyhjaksyml.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvcWdmdmxyY212eWhqYWtzeW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM3MDM3ODcsImV4cCI6MjAyOTI3OTc4N30.nxREmhOeu1ytMNOZcO58A0kLmFmLkV3D-fop7Xzyu7o";

export const supabase = createClient(supabaseUrl, supabaseKey);
