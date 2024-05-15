"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/joy/Autocomplete";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AllAbsenceList } from "../../../components/component/Absence/AllAbsenceList";

export default function VerifierAbsence() {
  const [classesOptions, setClassesOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [classroomId, setClassroomId] = useState(null);
  const [subjectId, setsubjectId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const classes = await initClasses();
        setClassesOptions(classes);
      } catch (error) {
        console.error("Error fetching classes:", error.message);
      }
    }

    fetchData();
  }, []);
  const handleSelectedClass = (event, value) => {
    setSelectedClass(value);
    console.log("value", value);
    console.log(classesOptions);
    const selectedClassroom = classesOptions.find((option) => option === value);

    if (selectedClassroom) {
      setClassroomId(selectedClassroom.id);
      setsubjectId(selectedClassroom.subject_id);
    } else {
      setClassroomId(null);
      setsubjectId(null);
    }
  };
  useEffect(() => {
    async function fetchData() {
      const classes = await initClasses();
      setClassesOptions(classes);
    }
    fetchData();
  }, []);
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  return (
    <div>
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
                label="Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                required
              />
              <TimePicker
                label="Heure de début"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                required
              />
              <TimePicker
                label="Heure de fin"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                required
              />
            </div>
          </LocalizationProvider>
        </div>
      </div>
      <div>
        <AllAbsenceList
          selectedSubject={subjectId}
          selectedClass={classroomId}
          selectedDate={startDate}
          selectedStartHour={startTime}
          selectedEndHour={endTime}
        />
      </div>
    </div>
  );
}

async function initClasses() {
  try {
    const { data, error } = await supabase
      .from("classroom_teacher_subject")
      .select(
        "classroom_id,teacher_id,classroom(grade(name),section),subject(id,name)"
      );

    if (error) {
      throw new Error(error.message);
    }
    console.log("initclasses ", data);
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
    return [];
  }
}
