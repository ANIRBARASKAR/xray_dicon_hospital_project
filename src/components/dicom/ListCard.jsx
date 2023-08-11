import React, { useState, useContext } from "react";
import { flushSync } from "react-dom";
import DicomThumbnail from "./DicomThumbnail.jsx";

import CornerstoneViewport from "react-cornerstone-viewport";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";

import { ViewerContext, NavContext } from "./ContextProvider.js";

export default function ({ util }) {
  let { node, select } = util;
  let report = node;

  // let [checked, setChecked] = useState(false)

  let { selectNode, unselectNode, SelectedReports, cancelSelection } =
    useContext(NavContext);
  // console.log('rf', select, report);

  let { Layout, editViewReports, Mode, getCornerstoneImageId } =
    useContext(ViewerContext);

  function handleClick() {
    if (SelectedReports[node._id]) {
      //todo: code to unselect the node
      unselectNode(node);
    } else if (select) {
      selectNode(node);
    }
  }

  function handleDragStart(event) {
    if (select) return;
    selectNode(node);
    event.dataTransfer.clearData();
    // Set the drag's format and data.
    // Use the event target's id for the data
    event.dataTransfer.setData("text/plain", node._id);
  }

  function handleDragEnd() {
    cancelSelection();
  }

  // useEffect(()=>{
  //     // console.log('useEffect fired!')
  //     setChecked(SelectedReports[node._id]!=undefined)
  // },[SelectedReports])

  const labelId = `checkbox-list-label-${node._id}`;

  let dicomView = "drop  here ...";
  let mode = report?.report_data?.report_type;

  if (report?.report_data?.path) {
    // console.log(report);
    let imageId = getCornerstoneImageId(report);

    // console.log("imageId 🌟🌟🌟🌟",imageId);

    if (imageId) {
      dicomView = (
        <DicomThumbnail
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          imageIds={[imageId]}
        />  
      );
    } else {
      // console.log('no imageId generated!')
    }
  }

  return (
    <Box
      sx={{ padding: "0", width: "80px", height: "80px" }}
      onClick={handleClick}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ width: "100%" }}>
        <CardActionArea
          sx={{ position: "relative", zIndex: "initial", height: "80px" }}
        >
          {dicomView}_

          {/** this box is here for drag event listning, as cornerstone element dosnt handle it properly...  */}
          <Box
            sx={{
              height: "80px",
              width: "80px",
              position: "relative",
              top: "-80px",
              left: 0,
            }}
          ></Box>

          <Checkbox
            edge="start"
            checked={SelectedReports[node._id] != undefined}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": labelId }}
            sx={{
              position: "absolute",
              top: "40px",
            }}
          />
        </CardActionArea>
      </Box>
    </Box>
  );
}
