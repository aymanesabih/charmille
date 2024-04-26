import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function Variants() {
  return (
    <Stack spacing={1}>
      {/* For variant="text", adjust the height via font-size */}

      <Skeleton animation="wave " className=" w-4/6" height={60} />

      <Skeleton variant="rectangular" className=" w-4/6" height={400} />
    </Stack>
  );
}
