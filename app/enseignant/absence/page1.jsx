"use client";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import { supabase } from "../../../utils/supabaseClient";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import Swal from "sweetalert2";
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
function extractHourAndMinute(isoDateString) {
  const date = new Date(isoDateString);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
  return formattedTime;
}

const isoDate = "2024-05-06T07:00:50+00:00";
const time = extractHourAndMinute(isoDate);
console.log(time);

export default function Test() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  function handleTypeChange(id, newType) {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, Type: newType } : row))
    );
  }
  const handleComment = async (event, id) => {
    console.log(id);
    try {
      const { data, error } = await supabase
        .from("attendance")
        .update({ remark: event.target.value })
        .eq("id", id)
        .select();
      if (error) {
        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      }
      Toast.fire({
        icon: "success",
        title: "Comments added successfully",
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Something went wrong!",
      });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "eleve", headerName: "Élève", width: 130 },
    { field: "Date", headerName: "Date", width: 130 },
    { field: "Time", headerName: "Time", width: 130 },
    {
      field: "Type",
      headerName: "Type d'absence",
      width: 200,
      renderCell: (params) => {
        initClasses();
        return <CustomSelectCell Myparams={params.row} />;
      },
    },
    {
      field: "Remarque",
      headerName: "Remarque",
      width: 200,
      renderCell: (params) => {
        return (
          <TextField
            className="mt-4"
            id="outlined-multiline-flexible"
            label="Comment"
            multiline
            defaultValue={params.row.Remarque}
            onBlur={(e) => handleComment(e, params.row.id)}
            onKeyDown={(e) => e.stopPropagation()}
            maxRows={4}
          />
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
            <div>
              <div className="flex justify-center space-x-4 mt-4 ">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => window.open(params.row.justificationUrl)}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <RemoveRedEyeRoundedIcon />
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
    const handleChange = async (event) => {
      const newType = event.target.value;
      setTypeAbsence(newType);
      handleTypeChange(Myparams.id, newType);
      try {
        const { data, error } = await supabase
          .from("attendance")
          .update({ type: event.target.value })
          .eq("id", Myparams.id)
          .select();

        if (error) {
          Toast.fire({
            icon: "error",
            title: "Something went wrong!",
          });
        }
        Toast.fire({
          icon: "success",
          title: "Type d'absence updated successfully",
        });
      } catch (error) {
        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      }
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
  const [startDate, setStartDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [chosenClass, setChosesnClass] = useState("");
  function AbsanceTime() {
    const handleStartDateChange = (event) => {
      setStartDate(event.target.value);
      fetchData();
    };

    const handleEndDateChange = (event) => {
      setEndDate(event.target.value);
      fetchData();
    };

    return (
      <div className="flex gap-4 items-center bg-white ">
        <label htmlFor="start-date" className="text-lg font-semibold">
          De{""}
        </label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={handleStartDateChange}
          className="border border-gray-300 rounded-md h-14 px-3 py-2 focus:outline-none focus:border-blue-500"
        />

        <label htmlFor="end-date" className="text-lg font-semibold">
          À{""}
        </label>

        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={handleEndDateChange}
          className="border border-gray-300  h-14 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>
    );
  }

  function AbsanceClass() {
    const [classOptions, setClassOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState("");
    const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };

    useEffect(() => {
      async function fetchClasses() {
        const options = await initClasses();
        setClassOptions(options);
        setSelectedValue(options[0] || "");
      }

      fetchClasses();
    }, []);

    return (
      <div className="">
        <Select
          value={selectedValue}
          className="w-fit h-fit"
          onChange={handleChange}
        >
          {classOptions.map((className) => (
            <MenuItem key={className} value={className}>
              {className}
            </MenuItem>
          ))}
        </Select>
      </div>
    );
  }

  const fetchData = async () => {
    try {
      let { data, error } = await supabase
        .from("attendance")
        .select(
          "id,date,justification_url,type,remark,end_hour,start_hour,course_id,student_id,students(*),course(grade(name))"
        )
        .lte("date", endDate)
        .gte("date", startDate);
      if (error) {
        console.log(error);
      }

      setRows(
        data.map((absence) => ({
          id: absence.id,
          Date: absence.date,
          eleve: absence.students.first_name,
          Type: absence.type,
          Remarque: absence.remark,
          Time: `${extractHourAndMinute(
            absence.start_hour
          )} - ${extractHourAndMinute(absence.end_hour)}`,
          justificationUrl: absence.justification_url,
        }))
      );
      console.log(data);
    } catch (error) {
      console.error("Error testing Supabase connection:", error);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex justify-center  space-x-20 my-5 ">
        <AbsanceTime />
        <AbsanceClass />
      </div>

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
    </div>
  );
}
async function initClasses() {
  try {
    let { data, error } = await supabase
      .from("classroom_teacher")
      .select("classroom_id,teacher_id,classroom(grade(name))")
      .eq("teacher_id", 62);

    if (error) {
      console.log(error);
      return [];
    }

    return data.map((item) => item.classroom.grade.name);
  } catch (error) {
    console.error("Error testing Supabase connection:", error);
    return [];
  }
}

async function AddJustification(event, date) {
  const file = event.target.files[0];
  if (file) {
    try {
      const { data, error } = await supabase.storage
        .from("justificationAbsence/Maternelle")
        .upload("test1", file);
      if ((error.statusCode = "409")) {
        Toast.fire({
          icon: "error",
          title: "The Jusitifcation already exists",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      }

      Toast.fire({
        icon: "success",
        title: "Jusitifcation uploaded successfully",
      });
    } catch (error) {
      if ((error.statusCode = "409")) {
        Toast.fire({
          icon: "error",
          title: "The Jusitifcation already exists",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      }
    }
  }
}
