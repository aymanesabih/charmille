"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { motion } from "framer-motion";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Swal from "sweetalert2";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { exportDataToExcel } from "./exportDataToExcel";
import CircularProgress from "@mui/joy/CircularProgress";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 7000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});
export function ElevesAbsents({
  teacher_id,
  classroom,
  subject_id,
  start_hour,
  end_hour,
  date,
  AbsenceId,
}) {
  const [excelData, setExcelData] = useState([]);
  const [Loaded, setLoaded] = useState(true);
  const [nbrP, setnbrP] = useState(0);
  const [nbrA, setnbrA] = useState(0);
  const [nbrR, setnbrR] = useState(0);
  const [nbrANJ, setnbrANJ] = useState(0);
  const [nbrRM, setnbrRM] = useState(0);
  const [nbrAJ, setnbrAJ] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  function handleTypeChange(id, newType, firstName, lastName, oldType) {
    if (oldType == "Présent") {
      setnbrP(nbrP - 1);
    } else if (oldType == "Absence non justifiée") {
      setnbrANJ(nbrANJ - 1);
    } else if (oldType == "Absence justifiée") {
      setnbrAJ(nbrAJ - 1);
    } else if (oldType == "En retard") {
      setnbrR(nbrR - 1);
    } else if (oldType == "En retard avec mot d'excuse") {
      setnbrRM(nbrRM - 1);
    }
    if (newType == "Présent") {
      setnbrP(nbrP + 1);
    } else if (newType == "Absence non justifiée") {
      setnbrANJ(nbrANJ + 1);
    } else if (newType == "Absence justifiée") {
      setnbrAJ(nbrAJ + 1);
    } else if (newType == "En retard") {
      setnbrR(nbrR + 1);
    } else if (newType == "En retard avec mot d'excuse") {
      setnbrRM(nbrRM + 1);
    }
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, Type: newType } : row))
    );
    setExcelData((prevData) =>
      prevData.map((rowData) =>
        rowData[0] === lastName && rowData[1] === firstName
          ? [rowData[0], rowData[1], newType, rowData[3], rowData[4]]
          : rowData
      )
    );
  }
  function handleJuatification(id, url) {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, justification_url: url } : row
      )
    );
  }

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStudents();

        if (data) {
          data.map((student) => {
            if (student.type == "Présent") {
              setnbrP(nbrP + 1);
            } else if (student.type == "Absence non justifiée") {
              setnbrANJ(nbrANJ + 1);
            } else if (student.type == "Absence justifiée") {
              setnbrAJ(nbrAJ + 1);
            } else if (student.type == "En retard") {
              setnbrR(nbrR + 1);
            } else if (student.type == "En retard avec mot d'excuse") {
              setnbrRM(nbrRM + 1);
            }
          });
          setExcelData(
            data.map((student) => [
              student.students.last_name,
              student.students.first_name,
              student.type,
              student.remark,
              student.justification_url,
            ])
          );

          setRows(
            data.map((student) => ({
              id: student.students.id,
              FullName: `${student.students.last_name} ${student.students.first_name}`,
              Image: student.students.photo,
              Type: student.type,
              Date: student.absences_enseignants.date,

              Remarque: student.remark,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  function CustomSelectCell({ params }) {
    const [typeAbsence, setTypeAbsence] = useState(params.Type);

    const handleChange = async (event) => {
      const newType = event.target.value;
      setTypeAbsence(newType);
      handleTypeChange(
        params.id,
        newType,
        params.firstName,
        params.lastName,
        params.Type
      );

      try {
        const { data, error } = await supabase
          .from("attendance")
          .update({ type: newType })
          .eq("absences_enseignants_id", AbsenceId)
          .eq("student_id", params.id)
          .select();

        if (error) {
          console.log(error);
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
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      }
    };

    const statusColors = {
      Présent: "bg-blue-600",
      "En retard avec mot d'excuse": "bg-pink-600",
      "En retard": "bg-orange-600",
      "Absence justifiée": "bg-purple-700",
      "Absence non justifiée": "bg-red-600",
    };
    const containerVariants = {
      hidden: {
        opacity: 0,
        y: -20,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 10,
        },
      },
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-center space-x-4"
      >
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={typeAbsence}
            onChange={handleChange}
            autoWidth
            label="Type d'absence"
            className={`rounded ${statusColors[typeAbsence]}`}
            style={{ color: "white" }}
          >
            <MenuItem value="Présent">Présent</MenuItem>
            <MenuItem value="En retard avec mot d'excuse">
              En retard avec mot d&apos;excuse
            </MenuItem>
            <MenuItem value="En retard">En retard</MenuItem>
            <MenuItem value="Absence non justifiée">
              Absence non justifiée
            </MenuItem>
          </Select>
        </FormControl>
      </motion.div>
    );
  }
  const handleComment = async (event, params) => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .update({ remark: event.target.value })
        .eq("absences_enseignants_id", AbsenceId)
        .eq("student_id", params.id)
        .select();
      if (error) {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      }
      Toast.fire({
        icon: "success",
        title: "Comments updated successfully",
      });
      setExcelData((prevData) =>
        prevData.map((rowData) =>
          rowData[0] === params.lastName && rowData[1] === params.firstName
            ? [
                rowData[0],
                rowData[1],
                rowData[2],
                event.target.value,
                rowData[4],
              ]
            : rowData
        )
      );
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: "Something went wrong!",
      });
    }
  };

  const columns = [
    { field: "FullName", headerName: "Full Name", width: 150 },
    {
      field: "Image",
      headerName: "Image",
      width: 130,
      renderCell: (params) => {
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={params.row.Image}
              alt={params.row.firstName}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        );
      },
    },
    {
      field: "Type Absence",
      headerName: "Type Absence",
      width: 200,
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

        return <CustomSelectCell params={params.row} />;
      },
    },
    {
      field: "Remarque",
      headerName: "Remarque",
      width: 250,
      autoHeight: true,
      renderCell: (params) => {
        return (
          <TextField
            className=" w-full"
            id="outlined-multiline-flexible"
            multiline
            defaultValue={params.row.Remarque}
            onBlur={(e) => handleComment(e, params.row)}
            onKeyDown={(e) => e.stopPropagation()}
            maxRows={4}
          />
        );
      },
    },
  ];

  return (
    <div className="bg-white">
      <div className="flex justify-center p-5">
        <Button
          variant="contained"
          className="ml-5  bg-gradient-to-bl"
          onClick={() =>
            excelData &&
            exportDataToExcel(
              excelData,
              `${classroom.name}${classroom.section}_${classroom.subject}_${date}.xlsx`
            )
          }
          startIcon={<FileDownloadIcon />}
        >
          Télécharger xlsx
        </Button>
      </div>
      <div className="flex flex-wrap justify-center gap-2 md:justify-start md:gap-4 m-2">
        <button
          disabled
          className="flex-grow bg-pink-600 text-white font-bold p-3 rounded-xl"
        >
          {nbrRM} En retard avec mot d&rsquo;excuse
        </button>
        <button
          disabled
          className="flex-grow bg-orange-600 text-white font-bold p-3 rounded-xl"
        >
          {nbrR} En retard
        </button>
        <button
          disabled
          className="flex-grow bg-purple-700 text-white font-bold p-3 rounded-xl"
        >
          {nbrAJ} Absence justifiée
        </button>
        <button
          disabled
          className="flex-grow bg-red-600 text-white font-bold p-3 rounded-xl"
        >
          {nbrANJ} Absence non justifiée
        </button>
        <button
          disabled
          className="flex-grow bg-blue-600 text-white font-bold p-3 rounded-xl"
        >
          {nbrP} Présent
        </button>
      </div>

      <div className=" bg-gray-300 p-5">
        <DataGrid
          className="bg-white border border-gray-200 rounded-lg shadow-md mx-auto"
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 20 },
            },
          }}
          pageSizeOptions={[5, 10, 15, 20, 30]}
          getRowHeight={() => 100}
          checkboxSelection={false}
        />
      </div>
    </div>
  );

  async function fetchStudents() {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*,students(*),absences_enseignants(date)")
        .eq("absences_enseignants_id", AbsenceId);
      if (error) {
        console.log(error);
        return null;
      }
      console.log("sucess 111 ", data);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
async function SaveJustificationUrl(justUrl, params, AbsenceId) {
  try {
    const { data, error } = await supabase
      .from("attendance")
      .update({ justification_url: justUrl })
      .eq("absences_enseignants_id", AbsenceId)
      .eq("student_id", params.id)
      .select();

    if (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: "Something went wrong!",
      });
    }
    Toast.fire({
      icon: "success",
      title: "Justification updated successfully",
    });
  } catch (error) {
    console.log(error);
    Toast.fire({
      icon: "error",
      title: "Something went wrong!",
    });
  }
}
