import React, { useEffect, useState, useContext } from "react";
import ListCard from "./ListCard.jsx";
import { NavContext } from "./ContextProvider.js";
  
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
import Box from "@mui/material/Box";

import AppointmentIcon from "@mui/icons-material/Event";
import PatientIcon from "@mui/icons-material/Person";
import ReportIcon from "@mui/icons-material/Summarize";

function ListRecursive({ util }) {
  let { node, select } = util;
  let { toggleNode, OpenNodes } = useContext(NavContext);

  let nodeList = node.reports;
  // console.log(nodeList, 'nodeList in appointment');
  let nodeLable =
    node.examination_type +
      " " +
      new Date(node.timestamp?.created_at).toDateString().slice(4) || // for apointment
    node.nodeLable; // for future

  // console.log('re-rendering as ', node._id, select)

  const handleClick = () => {
    toggleNode(node._id);
  };

  let ListBody = null;

  if (node.report_data) {
    ListBody = <ListCard util={{ node, select }} />;
  } else if (!node.appointments && !node.reports) {
    // console.log(util)
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
        </ListItemButton>
        <Collapse
          in={OpenNodes[node._id]}
          timeout="auto"
          unmountOnExit
          sx={{ color: "#535151" }}
        >
          {nodeList.map((node) => (
            <ListRecursive util={{ node, select }} key={node._id} />
          ))}
        </Collapse>
      </>
    );
  }

  return (
    //todo sx the overflow, remove 'card' based styling, and its components, carry On!
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
      </ListItemButton>
      <Collapse
        in={OpenNodes[node._id]}
        timeout="auto"
        unmountOnExit
        sx={{ color: "#535151" }}
      >
        <Box
          sx={{
            padding: "10px",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {nodeList.map((report) => {
            return (
              <ListCard
                key={report._id || Math.random()}
                util={{ node: report, select }}
              />
            );
          })}
        </Box>
      </Collapse>
    </>
  );
}

export default ListRecursive;
