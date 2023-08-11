import React, { useEffect, useState, useContext } from "react";
import { ViewerContext } from "./ContextProvider.js";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function NavActions({ children, sx }) {
  console.log("children 🎉🎉🎉" ,children , "sx 🎉🎉🎉",sx);

  return (
    <Box
      sx={{
        display: "flex",
        height: "4rem",
        minHeight: "4rem",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #535151",
        ...sx,
      }}
    >  
 {/* <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Age</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value='anir'
    label="Age"
    // onChange={handleChange}
    // sx={{color:'white'}}
  >
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
    <MenuItem value={30}>Thirty</MenuItem>
  </Select>
</FormControl> */}  


      {children}
      

     {/* <div class="dropdown">
  <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
    Dropdown link
  </a>

  <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
  </ul>
</div> */}

    
    </Box>
  );
}
