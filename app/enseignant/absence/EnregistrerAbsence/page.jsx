"use client";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/joy/Autocomplete";
import { Button, Typography, TextField } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import { supabase } from "../../../../utils/supabaseClient";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import Students from "../../../../components/component/Absence/students";
import Link from "next/link";

export default function EnregistrerAbsence() {
  const [classesOptions, setClassesOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [classroomId, setClassroomId] = useState(null);
  const [teacherId, setTeacherId] = useState(74);
  const [subjectId, setsubjectId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs(Date.now()));
  const [startHour, setStartHour] = useState(null);
  const [endHour, setEndHour] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [currentData, setCurrentData] = useState(new Date());

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
    const selectedClassroom = classesOptions.find(
      (option) => option.name === value
    );

    if (selectedClassroom) {
      setClassroomId(selectedClassroom.id);
      setsubjectId(selectedClassroom.subject_id);
      console.log(selectedClassroom.id, "classoom id");
    } else {
      setClassroomId(null);
      setsubjectId(null);
    }
  };

  const handleSubmit = () => {
    const errors = {};

    if (!selectedClass) {
      errors.classe = "Class is required";
    }
    if (!selectedDate) {
      errors.date = "Date is required";
    }
    if (!startHour || !endHour) {
      errors.time = "Start and end time are required";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setFormSubmitted(true);
    }
  };

  return (
    <div>
      <div className="bg-white flex flex-col sm:flex-row items-center p-4 space-y-4 md:space-y-0 md:space-x-10">
        <div className="flex flex-col  w-full md:w-48">
          <div className="w-full">
            <Autocomplete
              id="classes"
              className="h-14 w-full bg-white"
              value={selectedClass}
              defaultValue={"Arab"}
              onChange={handleSelectedClass}
              placeholder="Classes"
              options={classesOptions.map((option) => option.name)}
              required
            />
          </div>
          {formErrors.classe && (
            <Typography variant="caption" color="error">
              {formErrors.classe}
            </Typography>
          )}
        </div>
        <div className="flex flex-col w-full">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                <DatePicker
                  label="Date de l'absence"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  required
                  disablePast
                  disableFuture
                  className="w-full"
                />
                {formErrors.date && (
                  <Typography variant="caption" color="error">
                    {formErrors.date}
                  </Typography>
                )}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                  <TimePicker
                    label="Start Hour"
                    value={startHour}
                    onChange={(newValue) => setStartHour(newValue)}
                    required
                    className="w-full"
                  />
                  <TimePicker
                    label="End Hour"
                    value={endHour}
                    onChange={(newValue) => setEndHour(newValue)}
                    required
                    className="w-full"
                  />
                  {formErrors.time && (
                    <Typography variant="caption" color="error">
                      {formErrors.time}
                    </Typography>
                  )}
                </div>
              </div>
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div className="w-full sm:w-20">
          <Button
            variant="contained"
            className="w-full h-14 bg-sky-600"
            onClick={handleSubmit}
          >
            <CoPresentIcon />
          </Button>
        </div>
      </div>

      {formSubmitted && (
        <Students
          teacher_id={teacherId}
          classroom_id={classroomId}
          subject_id={subjectId}
          start_hour={startHour}
          end_hour={endHour}
          date={selectedDate}
        />
      )}
    </div>
  );
}

async function initClasses() {
  try {
    const { data, error } = await supabase
      .from("classroom_teacher_subject")
      .select(
        "classroom_id,teacher_id,classroom(grade(name),section),subject(id,name)"
      )
      .eq("teacher_id", 74);

    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
    return data.map((item) => ({
      id: item.classroom_id,
      subject_id: item.subject.id,
      teacher_id: item.teacher_id,
      name: `${item.classroom.grade.name}${item.classroom.section} - ${item.subject.name}`,
    }));
  } catch (error) {
    console.error("Error fetching classes:", error.message);
    return [];
  }
}
