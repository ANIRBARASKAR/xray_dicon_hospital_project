import React, { useState, createContext, useEffect } from "react";
import Login from "./components/login/Login.jsx";
import Signup from "./components/login/Signup.jsx";
import Loder from "./components/loder/Loder.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/patientProfile/Profile.jsx";
import NavBar from "./components/NavBar.jsx";
import Viewer from "./components/dicom/App.jsx";
import Messaging from "./components/messaging/App.jsx";
import "./style.css";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { theme } from "./components/theme/default.js";
import { SnackbarProvider, enqueueSnackbar, closeSnackbar } from "notistack";

import ErrorBoundary from "./components/ErrorBoundry.jsx";

// const screen = {
//   'Login': Login,
//   'Signup': Signup,
//   'Dashboard': Dashboard,
//   'Profile': Profile,
//   'Viewer': Viewer,
//   'Messaging': Messaging
// }

const Appcontext = createContext();

function copy(obj) {
  // todo add try catch, and make function wraper for JSON.parse for same reasons
  return JSON.parse(JSON.stringify(obj));
}

let testDicom = JSON.parse(
  '{"nodeList":[{"name":"fghj","age":11,"gender":"male","appointments":[{"reports":[{"timestamp":{"created_at":1675958556927,"last_modified":1675958556927},"report_data":{"report_type":"dicom","label":"0012.DCM","sub_label":"img sub label","path":"D:/ai-kalpa/dive-electronJS/uploads/01GRVEM681YDNSVJPQXKJKNY4D.DCM"},"_id":"01GRVEM6BXNWJ7D1P91MW3FKBT-0-0"},{"timestamp":{"created_at":1675958556927,"last_modified":1675958556927},"report_data":{"report_type":"dicom","label":"MRBRAIN.DCM","sub_label":"img sub label","path":"D:/ai-kalpa/dive-electronJS/uploads/01GRVEM68HQ3E3DXYV5FB4DJ6Q.DCM"},"_id":"01GRVEM6BXNWJ7D1P91MW3FKBT-0-1"}],"timestamp":{"created_at":1675958556927,"last_modified":1675958556927},"_id":"01GRVEM6BXNWJ7D1P91MW3FKBT-0"}],"contact_number":"1010101010","referance_id":"2323","laterality":"right","_id":"01GRVEM6BXNWJ7D1P91MW3FKBT"}]}'
);

export default function App() {
  const [NavigationHistory, setNavigationHistory] = useState(["Dashboard"]);
  const [filteredStudents, setFilteredStudents] = useState();

  // const [NavigationHistory, setNavigationHistory] = useState(['Viewer'])
  // const [NavigationHistory, setNavigationHistory] = useState(['Messaging'])
  const [user, setUser] = useState(electron.auth.isLoggedIn());

  // todo loader should not cause re-render!!! make it ref class based component and useEffect loderRef.setLoder
  const [loder, setLoder] = useState(false);
  const [MetaData, setMetaData] = useState(testDicom);

  function deepEqual(o1, o2) {
    return structuredClone(o1) == structuredClone(o2);
  }

  // even if it is referd as page, it is a component. so we keep capital naming and all other things, also direcory name is components
  function navigate(page, metaData) {
    let navHist = copy(NavigationHistory);
    if (page == "Back" && navHist.length > 1) {
      let len = navHist.shift();
    } else if (page != "Back") {
      if (page != navHist[0]) {
        navHist.unshift(page);
      } else {
        // console.log("already on the page: ", page, " with identical metaData");
        // return;
      }
    }

    if (page == "Viewer" && !metaData) {
      alert("displaying dummy data");
      metaData = testDicom;
    }

    console.log(navHist, page, metaData);

    // todo use ref instead
    setMetaData(metaData);
    // todo: implement navhistory as a circular list so that no copy pasting needed!
    setNavigationHistory(navHist);
  }

  function alert(AlertText = "Some message...", severity = "info") {
    let severities = ["default", "error", "warning", "info", "success"];
    if (severities.indexOf(severity) < 0) {
      severity = "info";
      console.log(severities, "given severity out of accepted values");
    }
    enqueueSnackbar(AlertText, {
      variant: severity,
      action,
      preventDuplicate: true,
    });
  }
  window.alert = alert;

  // ************ anir
  const [anir, setanir] = useState("Hello Anir");

  const [patientData, setpatientData] = useState([]);
  const [searchValue, setsearchValue] = useState();

  // useEffect(() => {

  //   searchValue(1)
  // }, [])

  return (
    <>
      <Appcontext.Provider
        value={{
          anir,
          patientData,
          setpatientData,
          searchValue,
          setsearchValue,
          filteredStudents,
          setFilteredStudents,
        }}
      >
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            {user ? (
              <NavBar
                util={{
                  alert,
                  activePage: NavigationHistory[0],
                  navigate,
                  setUser,
                  MetaData,
                  setLoder,
                }}
              />
            ) : (
              ""
            )}

            <Box
              component="main"
              sx={{
                width: user ? "calc(100% - 5rem)" : 1,
                ml: user ? "5rem" : 0,
                px: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                fontFamily: "sans-serif",
              }}
            >
              <SnackbarProvider
                autoHideDuration={7000}
                sx={{
                  zIndex: (theme) => theme.zIndex.drawer + 600,
                  borderRadious: "500px",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              />
              {/* {Home({a:1,b:2})} */}
              {loder ? <Loder /> : ""}

              {!user &&
                (NavigationHistory[0] == "Signup" ? (
                  <Signup
                    util={{ alert, navigate, setUser, MetaData, setLoder }}
                  />
                ) : (
                  <Login
                    util={{ alert, navigate, setUser, MetaData, setLoder }}
                  />
                ))}
              {user && NavigationHistory[0] == "Dashboard" ? (
                <Dashboard
                  util={{ alert, navigate, setUser, MetaData, setLoder }}
                />
              ) : (
                ""
              )}
              {user && NavigationHistory[0] == "Profile" ? (
                <Profile
                  util={{ alert, navigate, setUser, MetaData, setLoder }}
                />
              ) : (
                ""
              )}
              {user && NavigationHistory[0] == "Viewer" ? (
                <Viewer
                  util={{ alert, navigate, setUser, MetaData, setLoder }}
                />
              ) : (
                ""
              )}
              {user && NavigationHistory[0] == "Messaging" ? (
                <Messaging
                  util={{ alert, navigate, setUser, MetaData, setLoder }}
                />
              ) : (
                ""
              )}
            </Box>
          </ThemeProvider>
        </ErrorBoundary>
      </Appcontext.Provider>
    </>
  );
}
const action = (snackbarId) => (
  <button
    onClick={() => {
      closeSnackbar(snackbarId);
    }}
  >
    Dismiss
  </button>
);

export { Appcontext };
