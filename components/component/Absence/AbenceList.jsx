"use client";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { Button } from "@mui/material";
import RemoveRedEyeSharpIcon from "@mui/icons-material/RemoveRedEyeSharp";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";
import Link from "next/link";
import Skeleton from "@mui/material/Skeleton";

export function AbenceList({
  selectedDate,
  selectedStartHour,
  selectedEndHour,
  selectedClass = null,
  selectedSubject,
}) {
  const [loading, setLoading] = useState(true);

  function removeSeconds(timeString) {
    const [hours, minutes] = timeString.split(":");
    const newTimeString = `${hours}:${minutes}`;
    return newTimeString;
  }
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${year}-${formattedMonth}-${formattedDay}`;
  }
  function extractTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  }

  const [rows, setRows] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await initAbsance();
        console.log("students", data);
        setRows(
          data.map((attendance) => ({
            id: attendance.id,
            nbrP: attendance.nbrP,
            nbrA: attendance.nbrA,
            Date: attendance.date,
            Subject: attendance.subject.name,
            Classe: `${attendance.classroom.grade.name}-${attendance.classroom.section}`,
            Période: `${removeSeconds(attendance.start_hour)} - ${removeSeconds(
              attendance.end_hour
            )}`,
          }))
        );
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [
    selectedClass,
    selectedSubject,
    selectedDate,
    selectedStartHour,
    selectedEndHour,
    loading,
  ]);
  async function initAbsance() {
    try {
      let absencesQuery = supabase
        .from("absences_enseignants")
        .select("*,classroom(grade(name),section),subject(id,name)")
        .eq("teacher_id", 72);

      if (selectedClass !== null) {
        absencesQuery = absencesQuery.eq("classroom_id", selectedClass);
      }
      if (selectedSubject !== null) {
        absencesQuery = absencesQuery.eq("subject_id", selectedSubject);
      }
      if (selectedDate !== null) {
        console.log("selected date", formatDate(selectedDate));
        absencesQuery = absencesQuery.eq("date", formatDate(selectedDate));
      }
      if (selectedStartHour !== null) {
        console.log("selected start hour", extractTime(selectedStartHour));
        absencesQuery = absencesQuery.eq(
          "start_hour",
          extractTime(selectedStartHour)
        );
      }
      if (selectedEndHour !== null) {
        console.log("selected end hour", extractTime(selectedEndHour));
        absencesQuery = absencesQuery.eq(
          "end_hour",
          extractTime(selectedEndHour)
        );
      }

      const { data, error } = await absencesQuery;

      if (error) {
        throw new Error(error.message);
      }

      await Promise.all(
        data.map(async (attendance) => {
          const { data: attendanceData, error: attendanceError } =
            await supabase
              .from("attendance")
              .select("*")
              .eq("absences_enseignants_id", attendance.id);
          if (attendanceError) {
            throw new Error(attendanceError.message);
          }

          let nbrT = attendanceData.length;
          let nbrP = attendanceData.filter(
            (student) => student.type === "Présent"
          ).length;
          attendance.nbrP = nbrP;
          attendance.nbrA = nbrT - nbrP;
        })
      );

      return data;
    } catch (error) {
      console.error("Error fetching classes:", error.message);
      return [];
    }
  }
  const rows1 = [
    {
      id: 1,
      Date: "2024-05-15",
      Classe: "A",
      Période: "Morning",
      Subject: "Math",
      nbrP: 20,
      nbrA: 5,
      Actions: "",
      Comments: "",
    },
    {
      id: 2,
      Date: "2024-05-15",
      Classe: "B",
      Période: "Morning",
      Subject: "Science",
      nbrP: 18,
      nbrA: 2,
      Actions: "",
      Comments: "",
    },
    {
      id: 3,
      Date: "2024-05-15",
      Classe: "C",
      Période: "Afternoon",
      Subject: "English",
      nbrP: 22,
      nbrA: 3,
      Actions: "",
      Comments: "",
    },
    {
      id: 4,
      Date: "2024-05-15",
      Classe: "D",
      Période: "Afternoon",
      Subject: "History",
      nbrP: 19,
      nbrA: 1,
      Actions: "",
      Comments: "",
    },
    {
      id: 5,
      Date: "2024-05-15",
      Classe: "E",
      Période: "Evening",
      Subject: "Geography",
      nbrP: 21,
      nbrA: 4,
      Actions: "",
      Comments: "",
    },
  ];

  const columns1 = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-3">
          <Skeleton variant="rectangular" width={25} height={25} />
        </div>
      ),
    },
    {
      field: "Date",
      headerName: "Date",
      width: 130,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-3">
          <Skeleton variant="rectangular" width={200} height={20} />
        </div>
      ),
    },
    {
      field: "Classe",
      headerName: "Classe",
      width: 130,
      renderCell: (params) => (
        <Skeleton
          variant="rectangular"
          className="flex justify-center space-x-4 mt-3"
          width={140}
          height={20}
        />
      ),
    },
    {
      field: "Période",
      headerName: "Période",
      width: 130,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-3">
          <Skeleton variant="rectangular" width={100} height={20} />
        </div>
      ),
    },
    {
      field: "Subject",
      headerName: "Subject",
      width: 130,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-3">
          <Skeleton variant="rectangular" width={100} height={20} />
        </div>
      ),
    },
    {
      field: "nbrP",
      headerName: "Nbr  presents",
      width: 130,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-3">
          <Skeleton variant="rectangular" width={160} height={20} />
        </div>
      ),
    },
    {
      field: "nbrA",
      headerName: "Nbr  absents/retards",
      width: 160,
      renderCell: (params) => (
        <div className="flex justify-center space-x-4 mt-3">
          <Skeleton variant="rectangular" width={160} height={20} />
        </div>
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      minWidth: 130,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Skeleton
          variant="rectangular"
          className="flex justify-center space-x-4 mt-3"
          width={100}
          height={20}
        />
      ),
    },
  ];
  return (
    <div className="  bg-gray-300 p-5">
      <DataGrid
        className="bg-white border border-gray-200 rounded-lg shadow-md mx-auto"
        rows={loading ? rows1 : rows}
        columns={loading ? columns1 : columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection={false}
      />
    </div>
  );
}
const columns = [
  { field: "Date", headerName: "Date", width: 130 },
  { field: "Classe", headerName: "Classe", width: 130 },
  { field: "Période", headerName: "Période", width: 130 },
  { field: "Subject", headerName: "Subject", width: 130 },
  { field: "nbrP", headerName: "Nbr  presents", width: 130 },
  { field: "nbrA", headerName: "Nbr  absents/retards", width: 160 },
  {
    field: "Action",
    headerName: "Action",
    width: 130,
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

      return (
        <Link
          href="/enseignant/absence/VerifierAbsence/[key]"
          as={`/enseignant/absence/VerifierAbsence/${params.row.id}`}
          className="inline-flex items-center bg-blue-600 hover:bg-white hover:text-blue-600 hover:border-blue-600 border-2 font-semibold py-2 px-5 rounded-2xl text-white text-xs mt-auto m-auto"
        >
          <RemoveRedEyeSharpIcon />
        </Link>
      );
    },
  },
];
