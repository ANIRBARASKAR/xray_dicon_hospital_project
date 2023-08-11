import React, { useEffect, useState, useContext, useMemo } from "react";
import Box from "@mui/material/Box";
import { ViewerContext, NavContext } from "./ContextProvider.js";

import DicomView from "./DicomView.jsx";

export default function View({ report }) {
  let { Layout, editViewReports, Mode, getCornerstoneImageId } =
    useContext(ViewerContext);
  let { SelectedReports } = useContext(NavContext);

  let blackBorder = "1px solid #535151";
  let blueBorder = "1px solid blue";
  let [Border, setBorder] = useState(blackBorder);

  function handleDrop(event) {
    event.preventDefault();
    // Get the data, which is the id of the source element
    const nodeId = event.dataTransfer.getData("text/plain");
    // console.log("handleDrop", nodeId);
    if (SelectedReports[nodeId]) {
      editViewReports(report.index);
    }
    setBorder(blackBorder);
  }

  function handleDragOver(event) {
    // // console.log("dragOver");
    event.preventDefault();
  }

  function handleDragEnter(event) {
    // console.log("handleDragEnter");
    event.preventDefault();
    setBorder(blueBorder);
  }

  function handleDragLeave(event) {
    // console.log("handleDragLeave");
    event.preventDefault();
    setBorder(blackBorder);
  }

  let boxDimentions = {
    height: ` calc(100% / ${Layout.rows} - 2px)`,
    width: `calc(100% / ${Layout.columns}  - 2px)`,
  };

  let dicomView = (
    <Box
      component="p"
      sx={{
        margin: "auto",
        position: "relative",
        top: "50%",
        /* left: 30%; */
        textAlign: "center",
        color: "grey",
      }}
    >
      drop here ...
    </Box>
  );

  if (report?.report_data?.path) {
    let imageId = getCornerstoneImageId(report);

    if (imageId) {
      // alert("Hello Anir")
      dicomView = <DicomView imageIds={[imageId]} reportId={report._id} />;
      // {console.log("Anir",Anir)}

    } else {
      // console.log('no imageId generated!')
    }
  }
  
  return (
    <Box
      sx={{ ...boxDimentions, border: Border, fontSize: "small" }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    > 
    {/* Anir */}
      {dicomView}
    </Box>
  );
}
// const imageId =
//   "https://rawgit.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg";
