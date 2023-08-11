import React, { useState, useContext, useEffect, useRef } from "react";

import {
  ConnectionsContext,
  ChatContext,
  PatientContext,
} from "./ContextProvider.js";
import PersonIcon from "@mui/icons-material/Person";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/system/Box";
import InputAdornment from "@mui/material/InputAdornment";
import { alpha, styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

import IconWraper from "../dicom/IconWraper.jsx";

import scrollbarstyle from "../dicom/scrollbarstyle";

import NavActions from "../dicom/NavActions.jsx";

export default function LeftPane({ util }) {
  let { ConnectionsList, setConnectionsList, addConnection } =
    useContext(ConnectionsContext);
  let { setActiveConnectionId, markSeenAllMessages } = useContext(ChatContext);
  let { markSeenAllPatients } = useContext(PatientContext);
  let showNav = true;
  let emailInputRef = useRef();
  const [ActivateSearch, setActivateSearch] = React.useState(false);

  const handleClickActivateSearch = () => setActivateSearch((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
    // setFocused(false)
    // alert('boom')
    ActivateSearch
      ? searchUser(emailInputRef.current.value)
      : addConnection(emailInputRef.current.value);
  };

  function handleConnectionSelect(connection) {
    if (connection?._id) {
      setActiveConnectionId(connection._id);
      markSeenAllPatients(connection._id);
    }
  }

  return (
    <Box
      sx={{
        display: showNav ? "flex" : "none",
        flexDirection: "column",
        width: "26rem",
        overflowY: "scroll",
        "&::-webkit-scrollbar": { scrollbarstyle },
        bgcolor: "#d2dcf0",
      }}
    >
      <NavActions
        sx={{
          justifyContent: "space-between",
          zIndex: (theme) => theme.zIndex.drawer + 200,
          position: "sticky",
          top: "0px",
          color: "#535151",
        }}
      >
        <FormControl
          sx={{ m: 1, width: "-webkit-fill-available" }}
          variant="outlined"
        >
          <InputLabel size="small" htmlFor="outlined-adornment-password">
            email id
          </InputLabel>
          <OutlinedInput
            inputRef={emailInputRef}
            size="small"
            id="outlined-adornment-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {!ActivateSearch ? <PersonAddIcon /> : <PersonSearchIcon />}
                </IconButton>
              </InputAdornment>
            }
            label="email id"
          />
        </FormControl>

        <IconButton
          aria-label="toggle password visibility"
          onClick={handleClickActivateSearch}
          edge="end"
          sx={{ margin: "0" }}
        >
          {ActivateSearch ? <PersonAddIcon /> : <PersonSearchIcon />}
        </IconButton>
      </NavActions>

      {Object.keys(ConnectionsList).length > 0 ? (
        <List sx={{ height: "100%", paddingTop: "0" }}>
          {Object.keys(ConnectionsList).map((connectonId) => {
            let connection = ConnectionsList[connectonId];
            let unseenMessagesCount = 0;
            if (
              connection &&
              connection.messages &&
              connection.messages.length > 0
            ) {
              unseenMessagesCount =
                connection.messages.filter(
                  (m) => m.status == "unseen" && m.senderId == connectonId
                )?.length || 0;
            }
            return (
              <ListItemButton
                key={connection?.email}
                onClick={() => handleConnectionSelect(connection)}
                sx={{
                  fontSize: "small",
                  height: "3rem",
                  borderBottom: "1px solid #535151",
                }}
              >
              {/* <h1>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates minima quam ab saepe quaerat voluptatem, ratione non omnis incidunt? Quas iure ullam, a eveniet aut fugit repellendus cum dolorem repudiandae?</h1> */}
                <ListItemIcon sx={{ minWidth: "2rem", color: "#535151" }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={connection?.name} />
                <p>{unseenMessagesCount ? unseenMessagesCount : ""}</p>
              </ListItemButton>
            );
          })}
        </List>
      ) : (
        <span sx={{mx: 'auto'}}> loding... </span>
      )}
    </Box>
  );
}
