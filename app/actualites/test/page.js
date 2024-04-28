"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Select, Theme } from "@radix-ui/themes";
import { useState } from "react";
const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function DataTable() {
  const [selectedValue, setSelectedValue] = useState("latest");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    // Call your method here based on the selected value
    if (event.target.value === "latest") {
      // Call method for latest
      handleLatest();
    } else if (event.target.value === "newest") {
      // Call method for newest
      handleNewest();
    }
  };

  const handleLatest = () => {
    // Method to handle when "Latest" is selected
    console.log("Latest selected");
  };

  const handleNewest = () => {
    // Method to handle when "Newest" is selected
    console.log("Newest selected");
  };

  return (
    <div className="inline-block relative w-64">
      <select
        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        defaultValue="latest"
        value={selectedValue}
        onChange={handleChange}
      >
        <option value="latest">Latest</option>
        <option value="newest">Newest</option>
      </select>
    </div>
  );
}

export function DataTable1() {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
