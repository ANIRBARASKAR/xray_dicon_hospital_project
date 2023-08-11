import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    neutral: {
      main: "#535150",
      contrastText: "#726b6d",
      light: "#312836",
      dark: "#26232f",
      success: "#8b8989",
    },
    primary: {
      main: "#00d297",
      light: "white",
      contrastText: "white",
    },
    secondary: {
      main: "#1976d2",
      contrastText: "white",
    },
    danger: {
      main: "rgb(255 0 0)",
    },
    dicom: {
      main: "#535151",
    },
  },
});
/**
 * grey: #53515 1 (current)
 * purple: #50104 8
 * green: #10f26 8
 * red: #ff000 0
 * sky: #0be7b 2
 *
 */
