import React, { useState, useEffect, useRef } from "react";

import UploadButton from "./UploadButton.jsx";
import Box from "@mui/material/Box";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

export default function FormDialog({ util }) {
  // console.log(util)
  let { closeAddAppointmentModal, AddAppointmentModal, patientId } = util;

  const handleClose = () => {
    closeAddAppointmentModal();
  };

  let [Patient, setPatient] = useState({});
  const appointmentRef = useRef({
    examination_type: false,
    reports: [],
  });

  useEffect(async () => {
    const patientData = await electron.db.getPatient(patientId);
    if (
      !patientData ||
      patientData.objectNotFound ||
      !patientData.resp.patient
    ) {
      // console.log(patientData)
    } else {
      setPatient(patientData.resp.patient);
    }
  }, [patientId]);

  const reportFiles = [];

  function onFileChange(event) {
    // Update the state
    const fileList = event.target.files; // type is fileList , not normal array
    console.log(fileList);

    for (let index = 0; index < fileList.length; index++) {
      const element = fileList.item(index);
      let file = {
        path: element.path,
        name: element.name,
        mimeType: element.type,
      };
      reportFiles.push(file);
    }
  }

  function uploadReportFiles() {
    reportFiles.forEach((file, index) => {
      try {
        let resp = electron.fileHandler.upload(file);
        console.log("uploadReportFiles", resp);
        if (!resp.fileUploaded) {
          console.error(resp);
          return;
        }
        file.path = resp.resp.file.path;
        if (!appointmentRef.current.reports) {
          appointmentRef.current.reports = [];
        }
        appointmentRef.current.reports.push({
          _id: appointmentRef.current._id + "-" + index,
          timestamp: appointmentRef.current.timestamp,
          report_data: {
            report_type: "dicom",
            // report_type: file.mimeType.indexOf('image/') != -1 ? 'image' : 'dicom',
            label: file.name,
            sub_label: "img sub label",
            path: file.path,
          },
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  function addAppointment() {
    let timestamp = {
      created_at: Date.now(),
      last_modified: Date.now(),
    };

    appointmentRef.current.timestamp = timestamp;
    appointmentRef.current._id = patientId + "-" + Patient.appointments.length;

    // setLoder(true)
    console.log("addAppointment", JSON.stringify(appointmentRef.current));

    uploadReportFiles();

    console.log("addAppointment2", JSON.stringify(appointmentRef.current));

    let tPatient = JSON.parse(JSON.stringify(Patient));
    tPatient.appointments.push(appointmentRef.current);

    try {
      electron.db
        .editPatient(patientId, tPatient)
        .then((res) => {
          console.log(res);
          if (res.objectEdited) {
            alert("added");
            closeAddAppointmentModal(appointmentRef.current);
          } else {
            alert(res.error.instancePath + " " + res.error.message);
          }
          appointmentRef.current = { reports: [], examination_type: false };
          // setLoder(false)
        })
        .catch((e) => {
          // setLoder(false)
          // console.log(e);
          alert("some error!!");
        });
    } catch (e) {
      console.error(e);
      console.log(JSON.stringify(e));
    }
  }

  function inputAppointmentData(field, value) {
    appointmentRef.current[field] = value;
    console.log(
      " appointmentRef.current[field], value",
      appointmentRef.current[field],
      value
    );
  }

  return (
    <div>
      <Modal open={AddAppointmentModal} onClose={handleClose}>
        <Box sx={{ bgcolor: "primary.light", ...sx }}>
          <Typography
            sx={{
              mx: "auto",
              my: "1rem",
              textAlign: "center",
              color: "primary.main",
            }}
          >
            {/* {`new appointmentRef.current details`} */}
            {/* ? ` Add New Appointment : ${Patient.name}` */}
            {Patient
              ? ` Add New Appointment `
              : `no valid patient found for given patientId: ${patientId}`}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box
              component={"div"}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                width: "69.8%",
                justifyContent: "space-between",
              }}
            >
              <TextField
                sx={{ m: "1rem" }}
                type="text"
                label="Examination Type"
                variant="standard"
                required
                onInput={(e) => {
                  inputAppointmentData("examination_type", e.target.value);
                }}
              />

              {/* <FormControl fullWidth sx={{ m: "1rem" }}>
                <InputLabel id="demo-simple-select-label">
                  Examination Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  // value={age}
                  label="Examination Type"
                  // onChange={handleChange}.
                  onSelect={(e) => {
                    inputAppointmentData("examination_type", e.target.value);
                  }}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl> */}

              <TextField
                sx={{ m: "1rem" }}
                type="text"
                label="Notes"
                variant="standard"
                fullWidth
                onInput={(e) => {
                  inputAppointmentData("notes", e.target.value);
                }}
              />

              {/*<TextField sx={{ m: '1rem' }} type="text" label="laterality" variant="standard"
                                onInput={(e) => { inputAppointmentData('laterality', e.target.value) }}
                    />*/}
            </Box>

            <UploadButton util={{ onFileChange }} multiple />
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              addAppointment();
            }}
            sx={{ mx: "auto", my: "1rem" }}
          >
            <AddIcon sx={{ pr: "1rem" }} />
            Add Appointment
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
  width: "35vw",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};
