"use client";
import { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { useRouter, notFound } from "next/navigation";
import { supabase } from "../../../../utils/supabaseClient";
import { Absence } from "../../../../components/component/Absence/Absence";
import Autocomplete from "@mui/joy/Autocomplete";
import Swal from "sweetalert2";
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});
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
  const [subjectName, setSubjectName] = useState("");
  const [exists, setExists] = useState(false);
  const router = useRouter();
  const [classesOptions, setClassesOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(subjectName);

  function formatTimeToDate(timeString) {
    const currentDate = new Date();
    const [hours, minutes] = timeString.split(":");
    currentDate.setHours(Number(hours) + 1);
    currentDate.setMinutes(Number(minutes));
    const formattedDate = currentDate.toISOString().slice(0, 16);
    return formattedDate;
  }

  function changeDateFormat(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }
  const handleSelectedClass = async (event, value) => {
    console.log("handle selected value", value);
    setSelectedClass(value);
    const selectedClassroom = classesOptions.find((option) => option === value);
    if (selectedClassroom) {
      setClassroomId(selectedClassroom.id);
      setSubjectId(selectedClassroom.subject_id);
    } else {
      setClassroomId(null);
      setSubjectId(null);
    }
    await updateSubject(value.subject_id);
  };
  async function fetchData() {
    try {
      const data = await initAbsence();

      if (!data) {
        router.push("/404");
        return;
      }
      setExists(true);
      setStartTime(dayjs(formatTimeToDate(data.start_hour)));
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
  useEffect(() => {
    if (classroomId !== null && teacherId !== null) {
      async function fetchData() {
        const classes = await initClasses();
        setClassesOptions(classes);
        console.log(classes);
      }

      fetchData();
    }
  }, [classroomId, teacherId]);

  return (
    <div>
      {exists && (
        <div className="bg-white flex flex-col md:flex-row items-center p-4 space-y-4 md:space-y-0 md:space-x-10">
          <div className="flex flex-col  md:w-48">
            <Autocomplete
              id="classes"
              className="h-14 w-48 bg-white"
              value={selectedClass}
              onChange={handleSelectedClass}
              placeholder="Classes"
              options={classesOptions}
              groupBy={(option) => option.grade}
              getOptionLabel={(option) => (option ? option.name : "")}
              required
            />
          </div>
          <div className="flex flex-col">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <DatePicker
                  label="Date de l'absence"
                  value={dayjs(startDate)}
                  onChange={(value) => updateDate(value)}
                  required
                />

                <TimePicker
                  label="Start Hour"
                  required
                  value={startTime}
                  onChange={updateStartHour}
                />
                <TimePicker
                  label="End Hour"
                  value={dayjs(endTime)}
                  onChange={updateEdnHour}
                  required
                />
              </div>
            </LocalizationProvider>
          </div>
        </div>
      )}
      {exists && (
        <Absence
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
  async function initClasses() {
    try {
      const { data, error } = await supabase
        .from("classroom_teacher_subject")
        .select(
          "classroom_id,teacher_id,classroom(grade(name),section),subject(id,name)"
        )
        .eq("classroom_id", classroomId)
        .eq("teacher_id", teacherId);

      if (error) {
        console.log(error.message);
        return null;
      }

      setSelectedClass(data.filter((option) => (option.name = subjectName))[0]);

      return data.map((item) => ({
        id: item.classroom_id,
        subject_id: item.subject.id,
        teacher_id: item.teacher_id,
        name: `${item.subject.name}`,
        grade: `${item.classroom.grade.name}${item.classroom.section}`,
        section: item.classroom.section,
      }));
    } catch (error) {
      console.error("Error fetching classes:", error.message);
      return null;
    }
  }
  async function updateSubject(SubjectID) {
    try {
      console.log(SubjectID);
      const { data, error } = await supabase
        .from("absences_enseignants")
        .update({ subject_id: SubjectID })
        .eq("id", AbsenceId)
        .select();

      if (error) {
        console.error("Error deleting justification:", error.message);
        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      } else {
        Toast.fire({
          icon: "success",
          title: "Subject updated successfully",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting justification:", error.message);
      Toast.fire({
        icon: "error",
        title: "Something went wrong!",
      });
    }
  }
  async function updateDate(Date) {
    console.log(Date);

    try {
      const { data, error } = await supabase
        .from("absences_enseignants")
        .update({ date: formattedDate })
        .eq("id", AbsenceId)
        .select();

      if (error) {
        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      } else {
        Toast.fire({
          icon: "success",
          title: "Date updated successfully",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error updating date:", error.message);
      Toast.fire({
        icon: "error",
        title: "Something went wrong!",
      });
    }
  }
  function formatTimeToHHMMSS(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    console.log("Format time to date ", `${hours}:${minutes}:${seconds}`);
    return `${hours}:${minutes}:${seconds}`;
  }
  async function updateStartHour(StartHour) {
    setStartTime(StartHour);
    try {
      const { data, error } = await supabase
        .from("absences_enseignants")
        .update({ start_hour: formatTimeToHHMMSS(StartHour) })
        .eq("id", AbsenceId)
        .select();

      if (error) {
        console.error("Error updating date:", error.message);

        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      } else {
        Toast.fire({
          icon: "success",
          title: "Date updated successfully",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error updating date:", error.message);
      Toast.fire({
        icon: "error",
        title: "Something went wrong!",
      });
    }
  }
  async function updateEdnHour(EndHour) {
    setStartTime(EndHour);
    try {
      const { data, error } = await supabase
        .from("absences_enseignants")
        .update({ end_hour: formatTimeToHHMMSS(EndHour) })
        .eq("id", AbsenceId)
        .select();

      if (error) {
        console.error("Error updating date:", error.message);

        Toast.fire({
          icon: "error",
          title: "Something went wrong!",
        });
      } else {
        Toast.fire({
          icon: "success",
          title: "Date updated successfully",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error updating date:", error.message);
      Toast.fire({
        icon: "error",
        title: "Something went wrong!",
      });
    }
  }
}
