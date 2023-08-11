import React, { useEffect, useState, useContext } from "react";

import AddPatient from "../modals/AddPatient.jsx";
import AddAppointment from "../modals/AddAppointment.jsx";

import AppBar from "./AppBar.jsx";
import TableStyled from "./TableStyled.jsx";

import { alpha, styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";

import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";

import AddIcon from "@mui/icons-material/Add";
import { Appcontext } from "../../App.js";

export default function Dashboard({ util }) {
  const {
    anir,
    patientData,
    setpatientData,
    setsearchValue,
    searchValue,
    setFilteredStudents,
  } = useContext(Appcontext);
  let { navigate, setUser, MetaData, setLoder } = util;

  let [page, setPage] = useState(1); // pagination
  let [PageSize, setPageSize] = useState(5); // pagination
  let [TotalPatients, setTotalPatients] = useState(0);
  let [patient, setPatient] = useState();
  let [patients, setPatients] = useState();
  let [AddPatientModal, setAddPatientModal] = useState(); // add patients modal dailogue box
  let [AddAppointmentModal, setAddAppointmentModal] = useState(); // add appointment modal dailogue box
  let [refresh, setrefresh] = useState(); // add patients modal dailogue box

  useEffect(() => {
    electron.db.getPatients(page, PageSize).then((patientsData) => {
      setFilteredStudents(patientsData);
      console.log("patientsData🌟🌟", patientsData);
      setPatients(patientsData.resp.patients);
      setTotalPatients(patientsData.resp.TotalPatients);
    });
  }, [page, refresh]);
  // console.log("🌟🌟🌟🌟🌟🌟 Anir  patientData from Dashboard",patientData);

  function openPatient(patient) {
    // navigate('Profile', { patient })
    openDicom(patient);
  }
  function openDicom(patient) {
    electron.db.getPatient(patient._id).then((resp) => {
      console.log(resp);
      if (resp.objectFetched) {
        navigate("Viewer", { nodeList: [resp.resp.patient] });
      }
    });
  }
  function closeAddPatientModal(PatientData) {
    setAddPatientModal(false);
    openPatient(PatientData);
    // setrefresh(!refresh)
  }
  function openAddPatientModal() {
    setAddPatientModal(true);
  }

  function closeAddAppointmentModal() {
    setAddAppointmentModal(false);
    setrefresh(!refresh);
  }
  function openAddAppointmentModal(patientId) {
    setAddAppointmentModal(patientId);
  }

  function handlePageChange(e, page) {
    setPage(page);
  }

  async function deletePatient(patientId) {
    window.confirm("Do you really want to delete patient ?") &&
      (await electron.db.deletePatient(patientId));
    setrefresh(!refresh);
  }

  // setsearchValue(1)

  const Input1 = styled(TextField)({
    "& label.Mui-focused": {
      color: "#49474d", //#49474d neutral.main value
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#49474d",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#49474d",
      },
      "&:hover fieldset": {
        borderColor: "#49474d",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#49474d",
      },
    },
    input: {
      color: "#726b6d",
      fontWeight: "1200",
      fontFamily: "sans-serif",
      textTransform: "uppercase",
    },
    "& .MuiInputBase-root": {
      borderRadius: "inherit",
    },
  });

  const handleInputChange = (e) => {
    // alert("Hello")
    console.log("🌟🌟🌟🌟🌟 🥳🥳e", e.target.value);
    setsearchValue(e.target.value);
  };

  useEffect(() => {
    //  console.log("Hello Anir🎉🎉");

    setpatientData(patients);
  }, [patients]);

  return (
    <>
      <AppBar>
        {/* <h1>Hello Anir How are you {anir} 🥰</h1> */}
        {
          /*
                    todo: implement the search, API is already there, sjust handle how it will be displayed...
                    */

          <TextField
            placeholder="Search patient "
            type="text"
            sx={{
              flexDirection: "row",
              height: "60%",
              bgcolor: "neutral.dark",
              color: "white",
              // color: "red",
              // color:"red",
              borderRadius: "50px",
            }}
            onChange={handleInputChange}
            value={searchValue}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  // onChange={ handleInputChange}
                  position="start"
                  sx={{ borderRadius: "50px" }}
                >
                  <IconButton
                    onClick={() => {
                      // console.log("Aniruddha");
                      // alert("search feature under construction...kskkg");
                    }}
                  >
                    <SearchIcon color="neutral" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        }

        <Button
          variant="contained"
          color="primary"
          sx={{ height: "60%" }}
          onClick={() => {
            openAddPatientModal();
          }}
        >
          <AddIcon sx={{ pr: "1rem" }} />
          {"new patient"}
        </Button>
      </AppBar>
      <Box
        component="h1"
        sx={{
          margin: "2rem",
          color: "rgb(167 209 167 / 33%)",
          fontFamily: "sans-serif",
          fontSize: "3rem",
        }}
      >
        DASHBOARD
      </Box>
      <TableStyled
        util={{
          navigate,
          setUser,
          MetaData,
          setLoder,
          patients,
          openPatient,
          openAddAppointmentModal,
          deletePatient,
        }}
      />

      <Box component="div" sx={{ display: "contents" }}>
        <Pagination
          count={Math.ceil(TotalPatients / PageSize)}
          page={page}
          onChange={handlePageChange}
          sx={{ margin: "3rem auto 1rem auto;", position: "sticky" }}
        />
      </Box>

      <AddPatient util={{ AddPatientModal, closeAddPatientModal, setLoder }} />
      <AddAppointment
        util={{
          patientId: AddAppointmentModal,
          AddAppointmentModal:
            AddAppointmentModal && AddAppointmentModal.length > 0,
          closeAddAppointmentModal,
          setLoder,
        }}
      />
    </>
  );
}
