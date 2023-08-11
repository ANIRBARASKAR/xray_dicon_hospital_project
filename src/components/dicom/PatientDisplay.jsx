import React, { useEffect, useState, useContext } from "react";
import ListCard from "./ListCard.jsx";
import { NavContext } from "./ContextProvider.js";
import { DataContext } from "./ContextProvider.js";

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
import IconButton from "@mui/material/IconButton";

import AppointmentDisplay from "./AppointmentDisplay.jsx";

import AppointmentIcon from "@mui/icons-material/Event";
import PatientIcon from "@mui/icons-material/Person";
import ReportIcon from "@mui/icons-material/Summarize";
import PostAddIcon from "@mui/icons-material/PostAdd";
function PatientDisplay({ util }) {
  let { node, select } = util;
  let { toggleNode, OpenNodes } = useContext(NavContext);
  let { openAddAppointmentModal } = useContext(DataContext);

  let nodeList = node.appointments;
  let nodeLable =
    node.name || // for patient
    node.nodeLable; // for future

  // console.log('re-rendering as ', node._id, select)

  const handleClick = () => {
    toggleNode(node._id);
  };

  let ListBody = null;

  if (node.report_data) {
    ListBody = <ListCard util={{ node, select }} />;
  } else if (!node.appointments && !node.reports) {
    console.log(util);
    ListBody = "error, List recursive hit bottom";
  } else {
    ListBody = (
      <>
        <ListItemButton
          onClick={handleClick}
          sx={{
            fontSize: "small",
            height: "3rem",
            borderTop: "1px solid #535151",
          }}
        >
          <ListItemIcon sx={{ minWidth: "2rem", color: "#535151" }}>
            {OpenNodes[node._id] ? <ExpandLess /> : <ExpandMore />}
          </ListItemIcon>
          <ListItemText primary={nodeLable} />
          <IconButton
            onClick={(e) => {
              openAddAppointmentModal(node._id);
              e.stopPropagation();
            }}
          >
            <PostAddIcon sx={{ color: "#535151" }} />
          </IconButton>
        </ListItemButton>
        <Collapse
          in={OpenNodes[node._id]}
          timeout="auto"
          unmountOnExit
          sx={{ color: "#535151" }}
        >
          {nodeList.map((node) => (
            <AppointmentDisplay util={{ node, select }} key={node._id} />
          ))}
        </Collapse>
      </>
    );
  }

  return (
    //todo sx the overflow, remove 'card' based styling, and its components, carry On!
    <List
      sx={{ width: "100%", height: "max-content", pt: 0 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {ListBody}
    </List>
  );
}

export default PatientDisplay;
