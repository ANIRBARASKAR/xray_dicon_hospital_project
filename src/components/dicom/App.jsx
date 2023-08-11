import React, { useContext, useState, useRef } from "react";

import ErrorPage from "../ErrorPage.jsx";

import Nav from "./Nav.jsx";
import Viewer from "./Viewer.jsx";
import AddAppointmentModal from "./AddAppointmentModal.jsx";

import DicomContext from "./ContextProvider.js";

import Box from "@mui/material/Box";

export default function App({ util }) {
  let { navigate, setUser, MetaData, setLoder } = util;

  if (!MetaData) {
    alert("no data given to the dicom viewer!");
    return <ErrorPage />;
  }
  let { nodeList } = MetaData;
  // console.log(JSON.stringify(MetaData))

  // let resp = validateTree(nodeList)
  // if (resp.error != {}) return <ErrorPage error={{ resp }} />
  async function getLableName() {}

  window.prompt = function () {
    return "loading...";
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        bgcolor: "black",
        color: "white",
      }}
    >
      <DicomContext nodeList={nodeList}>
        <Nav util={{ setLoder }} />
        {/* <h1>        Aniruddha
</h1> */}
        <Viewer />
        <AddAppointmentModal util={{ setLoder }} />
        {/* <Info /> */}
      </DicomContext>
    </Box>
  );
}
