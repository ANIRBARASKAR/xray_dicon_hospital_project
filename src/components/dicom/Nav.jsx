import React, { useEffect, useState, useContext } from "react";

import PatientDisplay from "./PatientDisplay.jsx";
import { NavContext, ViewerContext, DataContext } from "./ContextProvider.js";

import AddPatient from "../modals/AddPatient.jsx";
import NavActions from "./NavActions.jsx";
import IconWraper from "./IconWraper.jsx";

import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuIcon from "@mui/icons-material/Menu";
import ViewListIcon from "@mui/icons-material/ViewList";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import MotionPhotosAutoIcon from "@mui/icons-material/MotionPhotosAuto";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Popover from "@mui/material/Popover";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import scrollbarstyle from "./scrollbarstyle.js";
export default function Nav({ util }) {
  let { setLoder } = util;
  let { cancelSelection, showNav } = useContext(NavContext);
  let { displaySelected } = useContext(ViewerContext);
  let { viewAddPatient, viewAddAppointment, getSelectedReportFiles, NodeList } =
    useContext(DataContext);
  // todo use refs

  const [select, setSelect] = useState(false);
  function enableSelect() {
    setSelect(true);
  }
  function disableSelect() {
    setSelect(false);
  }

  let [AddPatientModal, setAddPatientModal] = useState(); // add patients modal dailogue box

  function closeAddPatientModal(patient) {
    setAddPatientModal(false);

    if (!patient) viewAddPatient(patient);
  }
  function openAddPatientModal() {
    setAddPatientModal(true);
  }

  // note: we have default sort mode to sort report list by id, so that selections apear in order

  // console.log('rrrr', select, NodeList);

  async function handleAiSelect(script) {
    try {
      // console.log(script);
      let patientId = NodeList[0]._id;
      electron.scripts.inputFiles(getSelectedReportFiles());

      setLoder(true);
      let runLog = await electron.scripts.runScript(script);

      let appointment = await electron.scripts.fetchOutputFor(
        patientId,
        script
      );
      viewAddAppointment(patientId, appointment);
    } catch (e) {
      console.error(e);
    }
    disableSelect();
    cancelSelection();
    setLoder(false);
  }

  return (
    <>
      <Box
        sx={{
          display: showNav ? "flex" : "none",
          flexDirection: "column",
          maxWidth: "280px",
          width: "280px",
          minWidth: "280px",
          overflowY: "scroll",
          zIndex: (theme) => theme.zIndex.drawer + 200,
          "&::-webkit-scrollbar": { scrollbarstyle },
          bgcolor: "black",
          color: "white",
        }}
      >
        <NavActions
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 200,
            position: "sticky",
            top: "0px",
            background: "black",
          }}
        >
          <Box component="nav"></Box>

          <Box sx={{ display: "flex" }}>
            {!select && (
              <IconWraper label={"select multiple"}>
                <IconButton
                  aria-label="select multiple"
                  component="label"
                  color={"inherit"}
                  onClick={enableSelect}
                >
                  <LibraryAddIcon />
                </IconButton>
              </IconWraper>
            )}
            {select && (
              <IconWraper label={"display Selected"}>
                <IconButton
                  aria-label="display Selected"
                  component="label"
                  color={"inherit"}
                  onClick={() => {
                    displaySelected();
                    disableSelect();
                  }}
                >
                  <AddToQueueIcon />
                </IconButton>
              </IconWraper>
            )}
            {select && <AiRunner handleAiSelect={handleAiSelect} />}
          </Box>
        </NavActions>

        {NodeList.map((node) => {
          return <PatientDisplay util={{ node, select }} key={node._id} />;
        })}
      </Box>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100 }}
        open={select}
        onClick={() => {
          cancelSelection();
          disableSelect();
        }}
      />
      <AddPatient util={{ AddPatientModal, closeAddPatientModal, setLoder }} />
    </>
  );
}

function AiRunner({ handleAiSelect }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [scripts, setScripts] = useState([]);
  useEffect(() => {
    let scripts = electron.scripts.getAllScriptNames();
    // console.log(scripts)

    if (!scripts || scripts.length == 0) {
      alert("no scripts added!");
      setScripts(["close"]);
    } else setScripts(scripts);
  }, []);

  function handleClose() {
    setAnchorEl(null);
  }

  let ScriptSelector = [];

  scripts.forEach((script) => {
    ScriptSelector.push(
      <MenuItem key={script} onClick={() => handleAiSelect(script)}>
        {script}
      </MenuItem>
    );
  });

  return (
    <IconWraper
      label={"AI tools"}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 205 }}
    >
      <IconButton
        aria-label="display tools"
        component="label"
        color={"inherit"}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <MotionPhotosAutoIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {ScriptSelector}
      </Menu>
    </IconWraper>
  );
}
