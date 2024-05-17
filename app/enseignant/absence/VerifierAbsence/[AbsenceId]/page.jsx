"use client";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { useRouter, notFound } from "next/navigation";
import { supabase } from "../../../../../utils/supabaseClient";
import { ElevesAbsents } from "../../../../../components/component/Absence/ElevesAbsents";

export default function AbsenceID({ params }) {
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [classSubject, setClassSubject] = useState([]);
  const [classroomId, setClassroomId] = useState(null);
  const [teacherId, setTeacherId] = useState(72);
  const [subjectId, setSubjectId] = useState(null);
  const [AbsenceId, setAbsenceId] = useState(Number(params["AbsenceId"]));
  const [className, setClassName] = useState(null);
  const [section, setSection] = useState(null);
  const [subjectName, setSubjectName] = useState(null);
  const [exists, setExists] = useState(false);
  const router = useRouter();

  function formatTimeToDate(timeString) {
    const currentDate = new Date();
    const [hours, minutes] = timeString.split(":");
    currentDate.setHours(Number(hours));
    currentDate.setMinutes(Number(minutes));
    const formattedDate = currentDate.toISOString().slice(0, 16);
    return formattedDate;
  }

  function changeDateFormat(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }

  async function fetchData() {
    try {
      const data = await initAbsence();

      if (!data) {
        router.push("/404");
        return;
      }
      setExists(true);
      setStartTime(formatTimeToDate(data.start_hour));
      setEndTime(formatTimeToDate(data.end_hour));
      setStartDate(changeDateFormat(data.date));
      setClassroomId(data.classroom_id);
      setSubjectId(data.subject_id);
      setTeacherId(data.teacher_id);
      setClassName(data.classroom.grade.name);
      setSubjectName(data.subject.name);
      setSection(data.classroom.section);
      setClassSubject(
        `${data.classroom.grade.name}${data.classroom.section}-${data.subject.name}`
      );
    } catch (error) {
      console.error("Error fetching classes:", error.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {exists && (
        <div className="bg-white flex flex-col sm:flex-row items-center p-4 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col w-full sm:w-48 sm:flex-shrink-0">
            <TextField
              id="classes"
              className="h-14 w-full bg-white"
              placeholder="Classes"
              required
              label="Classes"
              readOnly
              value={classSubject}
            />
          </div>
          <div className="flex flex-col w-full flex-grow">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <DatePicker
                  label="Date de l'absence"
                  value={dayjs(startDate)}
                  required
                  readOnly
                  className="w-full"
                />
                <TimePicker
                  label="Start Hour"
                  required
                  value={dayjs(startTime)}
                  readOnly
                  className="w-full"
                />
                <TimePicker
                  label="End Hour"
                  value={dayjs(endTime)}
                  required
                  readOnly
                  className="w-full"
                />
              </div>
            </LocalizationProvider>
          </div>
        </div>
      )}
      {exists && (
        <ElevesAbsents
          classroom={{
            id: classroomId,
            name: className,
            section: section,
            subject: subjectName,
          }}
          subject_id={subjectId}
          teacher_id={teacherId}
          AbsenceId={AbsenceId}
          date={startDate}
        />
      )}
    </div>
  );

  async function initAbsence() {
    try {
      const { data, error } = await supabase
        .from("absences_enseignants")
        .select("*,classroom(section,grade(name)),subject(name)")
        .eq("id", AbsenceId);

      if (error) {
        console.log(error.message);
        return null;
      }

      console.log("Success", data);
      return data[0];
    } catch (error) {
      console.error("Error fetching classes:", error.message);
      return null;
    }
  }
}
