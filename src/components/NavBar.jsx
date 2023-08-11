import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import SvgIcon from "@mui/material/SvgIcon";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MessageIcon from "@mui/icons-material/Message";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import Logo from "./../../img/logo.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ({ util }) {
  let { activePage, navigate, setUser, MetaData, setLoder } = util;
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const screens = {
    Dashboard: <DashboardIcon sx={{ m: "auto" }} color="neutral" />,
    // 'Viewer':
    //     <SettingsIcon sx={{ m: 'auto' }} color="neutral" />,
    Messaging: <MessageIcon sx={{ m: "auto" }} color="neutral" />,
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  let navWidth = "5rem";

  return (
    <AppBar
      sx={{
        color: "#503535",
        position: "fixed",
        top: 0,
        left: 0,
        height: 1,
        width: "5rem",
        display: "flex",
        flexDirection: "column",
        bgcolor: "neutral.dark",
      }}
    >
      <List
        color="#c8c0c0"
        component="nav"
        aria-label="main mailbox folders"
        sx={{ width: 1, height: 1, p: 0 }}
      >
        <ListItemButton
          sx={{ overflow: "hiden", width: "100%", height: "4rem" }}
        >
          <ListItemIcon sx={{ width: 1, height: 1 }}>
            <Box
              component="img"
              src={Logo}
              sx={{ width: "3rem !important", margin: "auto" }}
            />
          </ListItemIcon>
        </ListItemButton>

        <Divider />

        {Object.keys(screens).map((screen) => {
          return (
            <ListItemButton
              key={screen}
              selected={screen === activePage}
              onClick={() => navigate(screen)}
              sx={{ overflow: "hiden", width: "100%", height: "4rem" }}
            >
              <ListItemIcon sx={{ width: 1, height: 1 }}>
                {screens[screen]}
              </ListItemIcon>
            </ListItemButton>
          );
        })}

        <ListItemButton
          selected={selectedIndex === 3}
          onClick={(event) => {
            handleListItemClick(event, 3);
            setUser(false);
            electron.auth.logout();
            navigate("Login");
          }}
          sx={{ overflow: "hiden", width: "100%", height: "4rem" }}
        >
          <ListItemIcon sx={{ width: 1, height: 1 }}>
            <LogoutIcon sx={{ m: "auto" }} color="neutral" />
          </ListItemIcon>
        </ListItemButton>

        {/*<ListItemButton
                    selected={selectedIndex === 3}
                    onClick={(event) => { navigate('Back'); }}
                    sx={{ overflow: 'hiden', width: '100%', height: '4rem' }}
                >
                    <ListItemIcon sx={{ width: 1, height: 1 }}>
                        <ArrowBackIcon sx={{ m: 'auto' }} color="neutral" />
                    </ListItemIcon>
                </ListItemButton>
            */}
      </List>
    </AppBar>
  );
}
