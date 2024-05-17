"use client";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { Button } from "@mui/material";
import RemoveRedEyeSharpIcon from "@mui/icons-material/RemoveRedEyeSharp";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabaseClient";

export function Test({
  selectedDate,
  selectedStartHour,
  selectedEndHour,
  selectedClass = null,
  selectedSubject,
}) {
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
    console.log("Updating .....");
    console.log("selected class ,subject", selectedClass, selectedSubject);
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

  return (
    <div>
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
const columns = [
  { field: "id", headerName: "ID", width: 70 },
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
        <div>
          <div className=" mt-2">
            <Button
              variant="contained"
              color="success"
              style={{ display: "flex", alignItems: "center" }}
            >
              <RemoveRedEyeSharpIcon />
            </Button>
          </div>
        </div>
      );
    },
  },
];
