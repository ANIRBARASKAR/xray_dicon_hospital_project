import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import UploadButton from "./UploadButton.jsx";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";

import FormControl from "@mui/material/FormControl";

import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

export default function FormDialog({ util }) {
  // console.log(util)
  let { closeAddPatientModal, AddPatientModal } = util;

  const handleClose = () => {
    closeAddPatientModal();
  };

  const patientRef = React.useRef({
    name: "",
    age: 400,
    gender: "male",
    appointments: [],
    contact_number: undefined,
    referance_id: undefined,
    laterality: undefined,
    firstVisited: Date.now(),
  });

  const reportFiles = [];

  function addPatient() {
    // console.log(patientRef.current, 'ppp')

    let timestamp = {
      created_at: Date.now(),
      last_modified: Date.now(),
    };

    // patientRef.current.appointments[0].timestamp = timestamp

    // console.log(JSON.stringify(patientRef.current))
    // setLoder(true)
    electron.db.setPatient(patientRef.current).then((res) => {
      console.log(res);
      if (res.objectCreated) {
        alert("added");
        closeAddPatientModal(res.resp.patientData);
      } else {
        window.alert(res.error.instancePath + " " + res.error.message);
      }
      // setLoder(false)
    });
  }

  function inputPatientData(field, value) {
    console.log(patientRef.current, field, value);
    patientRef.current[field] = value;
  }

  const handleGenderChange = (event) => {
    inputPatientData("gender", event.target.value);
  };

  return (
    <div>
      <Modal open={AddPatientModal} onClose={handleClose}>
        <Box sx={{ bgcolor: "primary.light", ...sx }}>
          <Typography
            sx={{
              mx: "auto",
              my: "1rem",
              textAlign: "center",
              color: "primary.main",
            }}
          >
            NEW PATIENT DETAILS
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Box
              component={"div"}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <TextField
                sx={{ m: "1rem" }}
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                required
                onInput={(e) => {
                  inputPatientData("name", e.target.value);
                }}
              />

              <TextField
                sx={{ m: "1rem" }}
                type="number"
                label="Age"
                variant="standard"
                required
                onInput={(e) => {
                  inputPatientData("age", parseInt(e.target.value));
                }}
              />

              <FormControl sx={{ m: "1rem", width: 120 }}>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Gender"
                  onChange={handleGenderChange}
                >
                  <MenuItem value={"male"}>Male</MenuItem>
                  <MenuItem value={"female"}>Female</MenuItem>
                  <MenuItem value={"other"}>Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                sx={{ m: "1rem" }}
                type="text"
                label="Phone"
                variant="standard"
                onInput={(e) => {
                  inputPatientData("contact_number", e.target.value);
                }}
              />

              <TextField
                sx={{ m: "1rem" }}
                type="text"
                label="Referance_id"
                variant="standard"
                onInput={(e) => {
                  inputPatientData("referance_id", e.target.value);
                }}
              />
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              addPatient();
            }}
            sx={{ mx: "auto", my: "1rem" }}
          >
            <AddIcon sx={{ pr: "1rem" }} />
            Add Patient
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

const sx = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "45vw",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};
