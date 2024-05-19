"use client";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const Logout = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 ">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-96 text-center ">
        <h1 className="mb-4 text-xl font-bold text-gray-700 dark:text-gray-300">
          your're already logged in
        </h1>
        <button
          onClick={handleLogout}
          className="w-full p-3 rounded-md bg-red-500 text-white hover:bg-red-600"
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
