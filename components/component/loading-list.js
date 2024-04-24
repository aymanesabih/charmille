import React from "react";
import { Skeleton, Table, TableCell, TableHead, TableRow } from "@mui/material";

export const LoadingList = ({ rowsNum }) => {
  return (
    <Table>
      <TableHead>
        {[...Array(rowsNum)].map((row, index) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              <Skeleton animation="wave" variant="text" />
            </TableCell>
            <TableCell>
              <Skeleton animation="wave" variant="text" />
            </TableCell>
            <TableCell>
              <Skeleton animation="wave" variant="text" />
            </TableCell>
            <TableCell>
              <Skeleton animation="wave" variant="text" />
            </TableCell>
          </TableRow>
        ))}
      </TableHead>
    </Table>
  );
};
