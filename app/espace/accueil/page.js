import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Logout from "../../../components/component/logout"

export default async function Home() {
  const cookieStore =cookies();
   const supabase = createServerComponentClient({cookies:( )=> cookieStore});
   const {
    data: { user },
  } = await supabase.auth.getUser();
   console.log({user})

   if (!user){
    return(
    redirect("/espace/login")
    )
    
   }
  return (
    <><p>hello,{user.email}, u created ur account at : {user.created_at}</p><Logout /></>
  );
}
