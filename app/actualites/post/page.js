"use client";
import FacebookPostCompononent from "../../components/component/FacebookPostCompononent";
import Head from "next/head";
import InsertComments from "../../../api/Actualites/InsertComments";
import { useEffect } from "react";

export default function FacebookPost(post) {
  useEffect(() => {
    // Create a <script> element
    const script = document.createElement("script");
    script.src =
      "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0&appId=1079056626765845";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.nonce = "M1jobWwC";

    // Append the <script> element to the document body
    document.body.appendChild(script);

    // Clean up the <script> element when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <main className=" bg-white">
      <div className=" mx-20">
        <div id="fb-root"></div>
        <FacebookPostCompononent post={post} />
      </div>
    </main>
  );
}
