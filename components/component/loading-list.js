import React from "react";
import { Skeleton } from "@mui/material";

export const LoadingList = () => {
  const rows = [];

  for (let i = 0; i < 10; i++) {
    rows.push(
      <tr key={i}>
        <td className="px-4 py-3">
          <Skeleton animation="wave" />
        </td>
        <td className="px-4 py-3">
          <Skeleton animation="wave" />
        </td>
        <td className="px-4 py-3">
          <Skeleton animation="wave" />
        </td>
      </tr>
    );
  }

  return <>{rows}</>;
};
