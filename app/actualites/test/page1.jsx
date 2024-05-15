"use client";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/joy/Autocomplete";
import { Button } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import { supabase } from "../../../utils/supabaseClient";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

export default function Test() {
  const [classesOptions, setClassesOptions] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState("");
  const [classroomId, setClassroomId] = useState(0);
  const [teacherId, setTeacherId] = useState(0);

  useEffect(() => {
    async function fetchClasses() {
      const options = await initClasses();
      setClassesOptions(options);
      setSelectedClasse(options[0].name || "");
      setClassroomId(options[0].id);
    }

    fetchClasses();
  }, []);

  const handleSelectedValue = (event, value) => {
    if (value) {
      setSelectedClasse(value);
      const selectedClassroom = classesOptions.find(
        (option) => option.name === value
      );
      if (selectedClassroom) {
        setClassroomId(selectedClassroom.id);
        console.log(classroomId);
      }
    }
  };

  return (
    <div className="bg-white flex items-center  p-4 space-x-10">
      <div className="flex flex-col mt-2">
        <Autocomplete
          id="classes"
          className="h-14 w-48"
          defaultValue={selectedClasse}
          value={selectedClasse}
          onChange={handleSelectedValue}
          placeholder="Classes"
          options={classesOptions.map((option) => option.name)}
        />
      </div>
      <div className="flex flex-col">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker label="Basic date picker" />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <div>
        <Button variant="contained" color="secondary" className="w-32 h-14">
          <CoPresentIcon />
        </Button>
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
    return data.map((item) => ({
      id: item.classroom_id,
      name: item.classroom.grade.name,
    }));
  } catch (error) {
    console.error("Error testing Supabase connection:", error);
    return [];
  }
}
function CustomSelectCell() {
  const [typeAbsence, setTypeAbsence] = useState("Présent");
  const handleChange = async (event) => {
    const newType = event.target.value;
    setTypeAbsence(newType);
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
