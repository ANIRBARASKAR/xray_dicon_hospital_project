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
import SendIcon from "@mui/icons-material/Send";

import scrollbarstyle from "../dicom/scrollbarstyle";

import NavActions from "../dicom/NavActions.jsx";

export default function MidPane({ util }) {
  let { ConnectionsList, setConnectionsList, addConnection } =
    useContext(ConnectionsContext);
  let { getActiveConnection, setActiveConnectionId, markSeenAllMessages } =
    useContext(ChatContext);
  let { sendPatient, markSeenAllPatientMessages } = useContext(PatientContext);
  let showNav = true;
  let emailInputRef = useRef();
  let ActiveConnection = getActiveConnection();

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

  function handleConnectionPatientSelect(patient) {
    if (patient?._id) {
      setActiveConnectionPatientId(patient._id);
      markSeenAllPatientMessages(patient._id);
    }
  }

  let chatInputRef = useRef();
  function handleSendPatientClick() {
    let messageString = chatInputRef.current.value;
    // let errors = sanatizeChatMessage(toSend);
    if (ActiveConnection) {
      sendPatient(messageString);
      chatInputRef.current.value = "";
    } else {
      alert("No chat selected!");
    }
    //change to
  }

  return (
    <Box
      sx={{
        display: showNav ? "flex" : "none",
        flexDirection: "column",
        width: "30rem",
        overflowY: "scroll",
        "&::-webkit-scrollbar": { scrollbarstyle },
        bgcolor: "white",
        color: "black",
      }}
    >
      <NavActions
        sx={{
          width: "-webkit-fill-available",
          borderTop: "1px solid #535151",
          color: "black",
        }}
      >
      {/* <h6>Hello NidOan</h6> */}
        <Box
          component="div"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "1rem",
          }}
        >
          <div>
            <Box component="h3" sx={{ marginBottom: 0, marginTop: "10px" }}>
              {ActiveConnection?.name || "Select connection"}
            </Box>
            <Box
              component="h6"
              sx={{
                margin: "3px",
                color:
                  ActiveConnection?.status == "online" ? "#00ff22" : "grey",
                marginLeft: 0,
              }}
            >
              {ActiveConnection?.status || "Select chat"}
            </Box>
          </div>
        </Box>
      </NavActions>

      <List sx={{ height: "100%", paddingTop: "0" }}>
        <ListItemButton
          key={"connection?.email"}
          onClick={() => handleConnectionPatientSelect("generalChat")}
          sx={{
            fontSize: "small",
            height: "3rem",
            borderBottom: "1px solid #535151",
          }}
        >
          <ListItemIcon sx={{ minWidth: "2rem", color: "#535151" }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary={"General chat"} />
        </ListItemButton>

        {Object.keys(ActiveConnection?.PatientsList || {}).length > 0
          ? Object.keys(ConnectionsList).map((connectonId) => {
              let connection = ConnectionsList[connectonId];
              return (
                <ListItemButton
                  key={connection?.email}
                  onClick={() => handleConnectionPatientSelect(connection)}
                  sx={{
                    fontSize: "small",
                    height: "3rem",
                    borderBottom: "1px solid #535151",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "2rem", color: "#535151" }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary={connection?.name} />
                </ListItemButton>
              );
            })
          : "loding..."}
      </List>

      <NavActions
        sx={{
          width: "-webkit-fill-available",
          borderTop: "1px solid #535151",
        }}
      >
        <FormControl sx={{ m: 1, width: "70%" }} variant="outlined">
          <InputLabel size="small" htmlFor="outlined-adornment-password">
            enter patient id
          </InputLabel>
          <OutlinedInput
            inputRef={chatInputRef}
            size="small"
            id="outlined-adornment-password"
            label="enter patient id"
          />
        </FormControl>

        <Button
          variant="contained"
          sx={{ margin: "auto" }}
          endIcon={<SendIcon />}
          onClick={handleSendPatientClick}
        >
          Send
        </Button>
      </NavActions>
    </Box>
  );
}
