import React, { useEffect, useState, useContext } from "react";
import { ViewerContext, NavContext } from "./ContextProvider.js";
import Box from "@mui/material/Box";
import IconWraper from "./IconWraper.jsx";

import NavActions from "./NavActions.jsx";
import View from "./View.jsx";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import SvgIcon from "@mui/material/SvgIcon";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/styles";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

import AddReactionIcon from '@mui/icons-material/AddReaction';
import CircleIcon from '@mui/icons-material/Circle';
import { capitalize } from "@material-ui/core";
let Length = (
  <svg
    name="measure-temp"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    stroke="currentColor"
    fill="none"
  >
    <title>Measure Temp</title>
    <g strokeLinecap="round" stroke-linejoin="round">
      <circle cx="6.5" cy="6.5" r="6"></circle>
      <path d="M6.5 3v7M3 6.5h7"></path>
      <path
        d="M22.5 6L6 22.5"
        strokeWidth="3"
        strokeDasharray="0.6666,5"
      ></path>
    </g>
  </svg>
);

let Angle = (
  <svg
    name="angle-left"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 512"
    width="1em"
    height="1em"
    fill="currentColor"
  >
    <title>Angle Left</title>
    <path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path>
  </svg>
);

let Eraser = (
  <svg
    name="eraser"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 2048 1792"
    width="1em"
    height="1em"
    fill="currentColor"
  >
    <title>Eraser</title>
    <path
      fill="ACTIVE_COLOR"
      d="M960 384l336 384H528L192 384h768zm1013 1077q15-34 9.5-71.5T1952 1324L1056 300q-38-44-96-44H192q-38 0-69.5 20.5T75 331q-15 34-9.5 71.5T96 468l896 1024q38 44 96 44h768q38 0 69.5-20.5t47.5-54.5z"
    ></path>
  </svg>
);

let RectangleRoi = (
  <svg
    name="square-o"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    width="1em"
    height="1em"
    fill="currentColor"
  >
    <title>Square Outline</title>
    <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"></path>
  </svg>
);
// ******************   ArrowAnnotate
let ArrowAnnotate = (
  <svg
    name="measure-non-target"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    stroke-linejoin="round"
  >
    <title>Measure Non-Target</title>
    <circle cx="6.5" cy="6.5" r="6"></circle>
    <path d="M6.5 3v7M3 6.5h7"></path>
    <path d="M23 7L8 22m-1-5v6h6" stroke-width="2"></path>
  </svg>
);
//  ******************* Magnify
let Magnify = (
  <span class="mr-4"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" transform="translate(1 1)"><circle cx="8.75" cy="8.749" r="8.333"></circle><path d="m19.583 19.582-4.94-4.94M4.583 8.749h8.334M8.75 4.582v8.334"></path></g></svg></span>
);
//  ************************ Wwwc
let Wwwc = (
  <svg
    name="level"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    width="1em"
    height="1em"
    fill="currentColor"
    stroke="currentColor"
  >
    <title>Level</title>
    <path d="M14.5 3.5a1 1 0 0 1-11 11z" opacity=".8" stroke="none"></path>
    <circle cx="9" cy="9" r="8" fill="none" stroke-width="2"></circle>
  </svg>
);

let Pan = <OpenWithIcon />;
let Zoom = <ZoomInIcon />;
let InvertColorTool = <InvertColorsIcon />;
let ResetTool = <SettingsBackupRestoreIcon />;
let CrosshairTool = <AddReactionIcon/>
let BidirectionalTool = <AddReactionIcon/>
let AnnotationTool = <AddReactionIcon/>
let CircleTool = <CircleIcon/>
// let EllipseTool= <CircleIcon/>
let EllipseTool = <span class="mr-4"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 25"><g fill="none" fill-rule="evenodd" stroke="currentColor" transform="translate(1 1)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.833 14.625v8.333M24 18.792h-8.333"></path><ellipse cx="10.5" cy="7" stroke-width="1.5" rx="6.5" ry="10" transform="rotate(89 10.5 7)"></ellipse></g></svg></span>

let Probe =  <span class="mr-4"><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" transform="translate(1 1)"><path d="M10 0v3.333m0 13.334V20M0 10h3.333m13.334 0H20"></path><circle cx="10" cy="10" r="6.667"></circle><path d="M10 9.583a.417.417 0 1 1 0 .835.417.417 0 0 1 0-.835"></path></g></svg></span>

export default function Viewer({ util }) {
  let { viewReports, activateTool, ActiveTool } = useContext(ViewerContext);
  let { showNav, setShowNav } = useContext(NavContext);

  // console.log("activateTool from 🌟🌟🌟🌟 ",activateTool);
  // console.log(ActiveTool)

  let actions = {
    Length: Length,
    Angle: Angle,
    Eraser: Eraser,
    RectangleRoi: RectangleRoi,
    ArrowAnnotate: ArrowAnnotate,
    Magnify: Magnify,
    Window_Level: Wwwc,
    Pan: Pan,
    Zoom: Zoom,
    InvertColor: InvertColorTool,
    Reset: ResetTool,
    EllipticalRoi : EllipseTool,
    Probe : Probe,
    // Rotate : EllipseTool,
    // Annotation: AnnotationTool,
    
    // StackScroll : CrosshairTool,
    // Capture : CrosshairTool,
    // Crosshairs : CrosshairTool,
    // Bidirectional : BidirectionalTool,
    // CircleScissorsTool : CircleTool,  

  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "fill-available",
        height: "-webkit-fill-available",
        flexDirection: "column",
      }}
    >
      <NavActions>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
          }}
        >
          {showNav ? (
            <IconWraper label={"hide list"}>
              <IconButton
                aria-label="upload picture"
                component="label"
                color={"inherit"}
                onClick={() => {
                  setShowNav(false);
                }}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
            </IconWraper>
          ) : (
            <IconWraper label={"view list"}>
              <IconButton
                aria-label="upload picture"
                component="label"
                color={"inherit"}
                onClick={() => {
                  setShowNav(true);
                }}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            </IconWraper>
          )}
          <GridLayoutSelector />

          {Object.keys(actions).map((action) => {
            return (
              <IconWraper label={action} key={action}>
              
                <IconButton
                  key={action}
                  aria-label="upload picture"
                  component="p"
                  sx={{
                    width: "fit-content",
                    textAlign: "center",
                    backgroundColor:
                      action == ActiveTool ? "#0387fb2e" : "#ffffff00",
                    color: "#535151",
                  }}
                  onClick={() => {
                    console.log("action 🥰🥰",action);
                    activateTool(action);
                  }}
                >
                
                  <Icon sx={{ textAlign: "center" }}>{actions[action]}</Icon>
                </IconButton>
              </IconWraper>
            );
          })}
          <IconWraper label={"reset"}>
            <IconButton
              key={"reset"}
              aria-label="upload picture"
              component="p"
              sx={{
                width: "fit-content",
                textAlign: "center",
              }}
              onClick={() => {
                alert("tool under work...");
              }}
            >
              <Icon sx={{ textAlign: "center", color: "#535151" }}>
                <AutoFixHighIcon sx={{ color: "#535151" }} />{" "}
                {/*this is for upcoming feature */}
              </Icon>
            </IconButton>
          </IconWraper>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
          }}
        ></Box>
      </NavActions>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          width: "fill-available",
          height: "calc(100% - 4rem)",
        }}
      >
        {viewReports.map((viewReport, index) => {
          return (<>
          
            <View
              key={index + "_" + viewReport._id}
              report={{ ...viewReport, index }}
            />
            </>
          );
        })}
      </Box>
    </Box>
  );
}

function GridLayoutSelector() {
  let { Layout, setLayout, Mode, setMode, activateTool, ActiveTool } =
    useContext(ViewerContext);

  const [anchorEl, setAnchorEl] = useState(null);
  let [Hoveringlayout, setHoveringLayout] = useState({ rows: 0, columns: 0 });
  const open = Boolean(anchorEl);

  function isLit(index) {
    let t = { rows: parseInt(index / 3) + 1, columns: (index % 3) + 1 };
    return t.rows <= Hoveringlayout.rows && t.columns <= Hoveringlayout.columns;
  }

  let GridSelector = [];
  for (let index = 0; index < 9; index++) {
    GridSelector.push(
      <Box
        sx={{
          width: "1rem",
          height: "1rem",
          border: "1px solid black",
          backgroundColor: isLit(index) ? "blue" : "initial",
        }}
        key={index}
        onClick={() => {
          setLayout({
            rows: parseInt(index / 3) + 1,
            columns: (index % 3) + 1,
          });
          setAnchorEl(null);
        }}
        onMouseEnter={() => {
          setHoveringLayout({
            rows: parseInt(index / 3) + 1,
            columns: (index % 3) + 1,
          });
        }}
      />
    );
  }
  return (
    <div style={{textTransform : capitalize}}>
    <IconWraper label={"Layout"} >
      <IconButton
        aria-label="select grid"
        component="label"
        color={"inherit"}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <ViewModuleIcon />
      </IconButton>

      <Popover
        id={"id"}
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      > 
        <Box
          sx={{
            width: "4rem",
            height: "4rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "center",
          }}
          onMouseOut={() => {
            setHoveringLayout({ rows: 0, columns: 0 });
          }}
        >
          {GridSelector} 
        </Box>
      </Popover>
    </IconWraper>
    </div>
  );
}
