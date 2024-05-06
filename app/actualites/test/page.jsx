"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { supabase } from "../../../utils/supabaseClient";
import Swal from "sweetalert2";

export default function Test() {
  const [rows, setRows] = useState([
    {
      id: 1,
      eleve: "John Doe",
      Date: "2024-05-01",
      Remarque: "Fièvre",
      Type: "",
    },
    {
      id: 2,
      eleve: "Jane Doe",
      Date: "2024-05-02",
      Remarque: "Consultation",
      Type: "",
    },
    {
      id: 3,
      eleve: "Alice Smith",
      Date: "2024-05-03",
      Remarque: "N/A",
      Type: "",
    },
    {
      id: 4,
      eleve: "Bob Johnson",
      Date: "2024-05-04",
      Remarque: "N/A",
      Type: "",
    },
    {
      id: 5,
      eleve: "Emily Brown",
      Date: "2024-05-05",
      Remarque: "Sortie éducative",
      Type: "",
    },
  ]);

  function handleTypeChange(id, newType) {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, Type: newType } : row))
    );
  }

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "eleve", headerName: "Élève", width: 130 },
    { field: "Date", headerName: "Date", width: 130 },
    {
      field: "Type",
      headerName: "Type d'absence",
      width: 200,
      renderCell: (params) => {
        return <CustomSelectCell Myparams={params.row} />;
      },
    },
    {
      field: "Remarque",
      headerName: "Remarque",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="mt-2">
            <TextField
              className="mt-4"
              id="outlined-multiline-flexible"
              label="Comment"
              multiline
              onKeyDown={(e) => e.stopPropagation()}
              maxRows={4}
            />
          </div>
        );
      },
    },
    {
      field: "Justificatif",
      headerName: "Justificatif",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 250,
      renderCell: (params) => {
        const VisuallyHiddenInput = styled("input")({
          clip: "rect(0 0 0 0)",
          clipPath: "inset(50%)",
          height: 1,
          overflow: "hidden",
          position: "absolute",
          bottom: 0,
          left: 0,
          whiteSpace: "nowrap",
          width: 1,
        });
        if (params.row.Type === "Absence justifiée") {
          return (
            <div className="flex justify-center space-x-4 mt-4 ">
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                onChange={(event) => AddJustification(event, "hhhh")}
              >
                <CloudUploadIcon />
                <VisuallyHiddenInput type="file" />
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => DeletePost(params)}
                style={{ display: "flex", alignItems: "center" }}
              >
                <AutoFixHighRoundedIcon />
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => DeletePost(params)}
                style={{ display: "flex", alignItems: "center" }}
              >
                <DeleteRoundedIcon />
              </Button>
            </div>
          );
        } else {
          return "No justifiation";
        }
      },
    },
  ];

  function CustomSelectCell({ Myparams }) {
    const [typeAbsence, setTypeAbsence] = useState(Myparams.Type);
    const handleChange = (event) => {
      const newType = event.target.value;
      setTypeAbsence(newType);
      handleTypeChange(Myparams.id, newType);
    };

    return (
      <div className="flex justify-center space-x-4">
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-autowidth-label">
            Type d&apos;absence
          </InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={typeAbsence}
            onChange={handleChange}
            autoWidth
            label="Type d'absence"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Présent">Présent</MenuItem>
            <MenuItem value="En retard avec mot d'excuse">
              En retard avec mot d&apos;excuse
            </MenuItem>
            <MenuItem value="En retard">En retard</MenuItem>
            <MenuItem value="Absence justifiée">Absence justifiée</MenuItem>
            <MenuItem value="Absence non justifiée">
              Absence non justifiée
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }

  return (
    <div className="bg-white" style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        getRowHeight={() => 90}
        disableSelectionOnClick={true}
      />
    </div>
  );
}

async function AddJustification(event, date) {
  console.log("date  ", date);
  const file = event.target.files[0];
  if (file) {
    try {
      const { data, error } = await supabase.storage
        .from("justificationAbsence/Maternelle")
        .upload("test1", file);
      if (error) {
        throw error;
      }
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Jusitifcation uploaded successfully",
      });
    } catch (error) {
      throw error;
    }
  }
}
