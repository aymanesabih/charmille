"use client";
import { useEffect, useRef } from "react";
import Instafeed from "instafeed.js";

const HomePage = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      const feed = new Instafeed({
        accessToken:
          "IGQWROV1hqQlp6SFBJSXpBd3hydUVKLXcwLURJd2M3VGZA0LTJFZAzVqbGtZAdGRhNlNyV0UzRzNqRTBzLXl5QWpQODYyaXVPMjMxVGpnb2VPNjM3bDFFTUhaakNMaTBTcTRzaDduZAjhHcmNSRDEwaldvRkRtS3hiR3MZD",
        target: "instafeed",
        limit: 12,
        resolution: "standard_resolution",
        template:
          '<a href="{{link}}" target="_blank"><img src="{{image}}" /></a>',
      });

      feed.run();

      isMounted.current = true;
    }
  }, []);

  return (
    <div>
      <h1>Instagram Feed</h1>
      <div id="instafeed"></div>
    </div>
  );
};

export default HomePage;
