import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";

import Logo from "./../../../img/logoFull.png";
import Box from "@mui/material/Box";

export default function Signup({ util }) {
  let { navigate, setUser, MetaData, setLoder } = util;
  let email = "";
  let password = "";
  let name = "";

  function handleSignup(email, password, name) {
    setLoder(true);
    // electron.auth.login('a@a.a', 'aaaa')
    electron.auth
      .signup(email, password, name)
      .then((result) => {
        setLoder(false);
        // console.log(result);
        if (result && result.user && result.user._id) {
          setUser(result.user);
          navigate("Dashboard", { user: result.user });
        } else {
          // window.alert(res.error.instancePath + " " + res.error.message);
          
          alert("Unable to signup...");

          alert("Kindely Fill All Field's")
        }
      })
      .catch((error) => {
        // console.log("error", error);
        // alert("Unable to signup...");
        alert("Kindely Fill All Field's")


        setLoder(false);
      });
  }

  return (
    <>
      <Box
        component="img"
        src={Logo}
        sx={{
          height: "30vh",
          position: "fixed",
          left: "40%",
          width: "20%",
        }}
      />

      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 0.5,
          alignSelf: "center",
          position: "relative",
          top: "20vh",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            width: 0.8,
          }}
        >
          <Typography
            variant="h3"
            sx={{ textTransform: "uppercase", textAlign: "center" }}
            gutterBottom
          >
            Signup
          </Typography>

          <TextField
            id="standard-basic"
            label="Email"
            variant="standard"
            defaultValue={""}
            sx={{ mb: "1rem" }}
            type="email"
            onChange={(e) => {
              email = e.target.value;
            }}
          />

          <TextField
            id="standard-basic"
            label="Password"
            variant="standard"
            defaultValue={""}
            sx={{ mb: "1rem" }}
            type="password"
            onChange={(e) => {
              password = e.target.value;
            }}
          />

          <TextField
            id="standard-basic"
            label="Name"
            variant="standard"
            defaultValue={""}
            sx={{ mb: "1rem" }}
            type="text"
            onChange={(e) => {
              name = e.target.value;
            }}
          />
        </CardContent>

        <CardActions>
          <Button
            onClick={() => {
              navigate("Login");
            }}
            sx={{ mb: "1rem", px: "5rem" }}
          >
            Login instead
          </Button>
          <Button
            variant="contained"
            sx={{ mb: "1rem", px: "5rem" }}
            onClick={(e) => {
              handleSignup(email, password, name);
            }}
          >
            Signup
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
