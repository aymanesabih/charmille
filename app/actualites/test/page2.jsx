"use client";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Instafeed from "instafeed.js"; // Make sure to install instafeed.js package

const InstagramFeed = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      const userFeed = new Instafeed({
        get: "user",
        target: "instafeed-container",
        resolution: "high_resolution",
        accessToken:
          "IGQWROV1hqQlp6SFBJSXpBd3hydUVKLXcwLURJd2M3VGZA0LTJFZAzVqbGtZAdGRhNlNyV0UzRzNqRTBzLXl5QWpQODYyaXVPMjMxVGpnb2VPNjM3bDFFTUhaakNMaTBTcTRzaDduZAjhHcmNSRDEwaldvRkRtS3hiR3MZD",
      });

      userFeed.run();
      isMounted.current = true;
    }
    return () => {
      const container = document.getElementById("instafeed-container");
      if (container) {
        container.innerHTML = ""; // Remove all child elements
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Instafeed on Your Website</title>
      </Head>
      <div id="instafeed-container" className="grid grid-cols-4 gap-4"></div>
    </>
  );
};

export default InstagramFeed;
