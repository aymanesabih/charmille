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
import { useRouter } from "next/navigation";
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
export default function Students({
  teacher_id,
  classroom_id,
  subject_id,
  start_hour,
  end_hour,
  date,
}) {
  const router = useRouter();
  function formatTimeToHHMMSS(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  const [rows, setRows] = useState([]);
  const saveAbsance = async () => {
    try {
      const { data, error } = await supabase
        .from("absences_enseignants")
        .insert({
          date: date,
          start_hour: formatTimeToHHMMSS(start_hour),
          end_hour: formatTimeToHHMMSS(end_hour),
          teacher_id: teacher_id,
          subject_id: subject_id,
          classroom_id: classroom_id,
        })
        .select();
      console.log("success", data);
      const updatedData = rows.map((row) => ({
        student_id: row.id,
        type: row.Type,
        remark: row.remark,
        absences_enseignants_id: data[0].id,
      }));
      const { data1, error1 } = await supabase
        .from("attendance")
        .insert(updatedData)
        .select();

      if (error) {
        console.error("Error updating attendance:", error.message);
      }
      console.log("Updated", data);
      Toast.fire({
        icon: "success",
        title: "Absence enregistrée avec succès",
      });
      router.push("/enseignant/absence/VerifierAbsence");
    } catch (error) {
      console.error("Error updating attendance:", error.message);
    }
  };

  useEffect(() => {
    console.log("Updating .....");
    const fetchData = async () => {
      try {
        const data = await fetchStudents(classroom_id);
        console.log("students", data);
        setRows(
          data.map((student) => ({
            id: student.students.id,
            Full_name: `${student.students.last_name} ${student.students.first_name}`,
            Image: student.students.photo,
            Type: "Présent",
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [classroom_id, subject_id]);

  return (
    <div className="bg-white">
      <div className="flex justify-center my-5 p-5">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<BookmarkIcon />}
          onClick={saveAbsance}
        >
          Enregistrer
        </Button>
      </div>

      <DataGrid
        className="bg-white border border-gray-200 rounded-lg shadow-md mx-5"
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[5, 10, 15, 20, 30]}
        checkboxSelection={false}
        getRowHeight={() => 100}
      />
    </div>
  );
}
const columns = [
  { field: "Full_name", headerName: "Full name", width: 130 },

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

      return <CustomSelectCell params={params.row} />;
    },
  },
  {
    field: "Remarque",
    headerName: "Remarque",
    width: 250,
    autoHeight: true,
    renderCell: (params) => {
      console.log("params ", params);
      return (
        <TextField
          className="mt-4 w-full"
          id="outlined-multiline-flexible"
          label="Comment"
          multiline
          onBlur={(e) => (params.row.remark = e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          maxRows={4}
        />
      );
    },
  },
];

async function fetchStudents(classroom_id) {
  console.log("Fetch students");
  try {
    const { data, error } = await supabase
      .from("classroom_student")
      .select("students(*)")
      .eq("classroom_id", classroom_id);
    if (error) {
      console.log(error);
      return null;
    }
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
function CustomSelectCell({ params }) {
  console.log(params);
  const [typeAbsence, setTypeAbsence] = useState("Présent");

  const handleChange = (event) => {
    const newType = event.target.value;
    setTypeAbsence(newType);
    params.Type = newType;
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
