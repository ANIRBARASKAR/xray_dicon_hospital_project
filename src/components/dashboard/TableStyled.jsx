import React, { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";

import NoteAddIcon from "@mui/icons-material/NoteAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { Appcontext } from "../../App.js";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function TableStyled({ util }) {
  const {
    setpatientData,
    searchValue,
    patientData,
    filteredStudents,
    setFilteredStudents,
  } = useContext(Appcontext);
  const [searchTerm, setSearchTerm] = useState("");
  // const [filteredStudents, setFilteredStudents] = useState();

  let {
    navigate,
    setUser,
    MetaData,
    setLoder,
    patients,
    openPatient,
    openAddAppointmentModal,
    deletePatient,
  } = util;

  // console.log(
  //   "patientData from TabelStyle🥳🥳 🤘🤘",
  //   patientData,
  //   patients,
  //   "searchValue",
  //   searchValue
  // );

  // ********** functionality for Search

  useEffect(() => {
    setFilteredStudents(patientData);
  }, []);

  var filteredStudents_;

  

  useEffect(() => {
    if (patientData) {
      // console.log("searchValue from Tabel", searchValue);
      const searchTerm = searchValue;
      setSearchTerm(searchTerm);

      filteredStudents_ = patientData.filter((item) => {
        console.log("item from filter", item);
        const fullName = `${item.name} `;
        return fullName.includes(searchTerm);
      });
      setFilteredStudents(filteredStudents_);
    }
  }, [searchValue]);

  // setpatientData(patients)

  // console.log("patientData from TabelStyle🥳🥳",patientData);
  console.log("filteredStudents  from Tabel style", filteredStudents);
  return (
    <Table
      sx={{ width: "80%", overflow: "hiden", m: "auto" }}
      aria-label="simple table"
    >
      <TableHead>
        <TableRow>
          <TableCell
            sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}
          >
            Name
          </TableCell>
          <TableCell
            sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}
          >
            ID
          </TableCell>
          <TableCell
            sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}
            align="right"
          >
            Age
          </TableCell>
          <TableCell
            sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}
            align="right"
          >
            Gender
          </TableCell>
          <TableCell
            sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}
            align="right"
          >
            Last visited
          </TableCell>
          <TableCell
            sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}
            align="right"
          >
            visits
          </TableCell>
          <TableCell
            sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}
            align="right"
          >
            Appointments
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody
        sx={{
          border: "1px solid lightgrey",
          borderTop: "none",
          borderRadius: "5px",
        }}
      >
       

        {searchValue
          ? filteredStudents && filteredStudents.length > 0
            ? filteredStudents.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "lightgrey",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    openPatient(row);
                  }}
                >
                  <TableCell
                    sx={{ height: "2.5rem" }}
                    component="th"
                    scope="row"
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    sx={{ height: "2.5rem" }}
                    component="th"
                    scope="row"
                  >
                    {row.referance_id || "--"}
                  </TableCell>
                  <TableCell sx={{ height: "2.5rem" }} align="right">
                    {row.age}
                  </TableCell>
                  <TableCell sx={{ height: "2.5rem" }} align="right">
                    {row.gender}
                  </TableCell>
                  <TableCell sx={{ height: "2.5rem" }} align="right">
                    {new Date(row.lastVisited).toDateString()}
                  </TableCell>
                  <TableCell sx={{ height: "2.5rem" }} align="right">
                    {row.visits}
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      variant="contained"
                      color="primary"
                      sx={{ margin: "auto", height: "auto" }}
                      onClick={(e) => {
                        openAddAppointmentModal(row._id);
                        e.stopPropagation();
                      }}
                    >
                      <NoteAddIcon />
                    </IconButton>
                    <IconButton
                      variant="contained"
                      color="danger"
                      sx={{ margin: "auto", height: "auto" }}
                      onClick={() => {
                        deletePatient(row._id);
                        e.stopPropagation();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            : "yet to add patient"
          : patients && patients.length > 0
          ? patients.map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: "lightgrey",
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  openPatient(row);
                }}
              >
                <TableCell sx={{ height: "2.5rem" }} component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell sx={{ height: "2.5rem" }} component="th" scope="row">
                  {row.referance_id || "--"}
                </TableCell>
                <TableCell sx={{ height: "2.5rem" }} align="right">
                  {row.age}
                </TableCell>
                <TableCell sx={{ height: "2.5rem" }} align="right">
                  {row.gender}
                </TableCell>
                <TableCell sx={{ height: "2.5rem" }} align="right">
                  {new Date(row.lastVisited).toDateString()}
                </TableCell>
                <TableCell sx={{ height: "2.5rem" }} align="right">
                  {row.visits}
                </TableCell>

                <TableCell align="right">
                  <IconButton
                    variant="contained"
                    color="primary"
                    sx={{ margin: "auto", height: "auto" }}
                    onClick={(e) => {
                      openAddAppointmentModal(row._id);
                      e.stopPropagation();
                    }}
                  >
                    <NoteAddIcon />
                  </IconButton>
                  <IconButton
                    variant="contained"
                    color="danger"
                    sx={{ margin: "auto", height: "auto" }}
                    onClick={() => {
                      deletePatient(row._id);
                      e.stopPropagation();
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          : "yet to add patient"}
      </TableBody>
    </Table>
  );
}
