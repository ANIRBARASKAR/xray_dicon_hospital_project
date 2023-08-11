import React, { useEffect, useState, useRef } from "react";

import ErrorPage from "../ErrorPage.jsx";
import LeftPane from "./LeftPane.jsx";
import MidPane from "./MidPane.jsx";
import RightPane from "./RightPane.jsx";

import MessagingContext from "./ContextProvider.js";

import Box from "@mui/material/Box";

export default function App({ util }) {
  let { navigate, MetaData, setLoder } = util;
  // let { nodeList } = MetaData //! metadata is undefined while navigating via nav pane
  // console.log(JSON.stringify(MetaData))
  // alert("under developement preview!!", "warning");

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        bgcolor: "black",
        color: "white",
      }}
    >
      <MessagingContext
      >
        {/* <LeftPane util={util} /> */}
    {/* <h5>Under developement........</h5> */}
        {/* <MidPane /> */}
        {/* <RightPane /> */}
        <div className="row" style={{
          display : 'flex',
          // justifyContent  : 'center',
          marginLeft : '40%' ,
          alignItems : 'center'
        }}>
          <div className="col-sm-6">
          <h2>Under developement........</h2>

          </div>
        </div>
      </MessagingContext>
    </Box>
  );
}
