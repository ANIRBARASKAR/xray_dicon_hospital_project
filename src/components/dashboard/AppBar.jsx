import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

function DrawerAppBar({ children }) {
  // console.log("children", children);
  return (
    <AppBar
      component="nav"
      sx={{
        height: "4rem",
        position: "relative",
        top: 0,
        left: 0,
        bgcolor: "neutral.main",
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          display: "flex",
          justifyContent: "space-around",
        }}
      >
      
        {children}
      </Toolbar>
    </AppBar>
  );
}

export default DrawerAppBar;
