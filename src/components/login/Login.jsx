import React, { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";

import Logo from "./../../../img/logoFull.png";
import Box from "@mui/material/Box";

export default function Login({ util }) {
  let { navigate, setUser, MetaData, setLoder } = util;
  let emailRef = useRef();
  let passwordRef = useRef();

  function handleLogin() {
    setLoder(true);
    // electron.auth.login('a@a.a', 'aaaa')
    electron.auth
      .login(emailRef.current.value, passwordRef.current.value)
      .then((result) => {
        setLoder(false);
        // console.log(result)
        // alert(result.message);
        if (result && result.user && result.user._id) {
          setUser(result.user);
          navigate("Dashboard", { user: result.user });
        } else {
          // console.log('unable to login...');
          alert("Kindely Fill All Field's")
          alert("unable to login...");
          // alert("unable to login...");
        }
      })
      .catch((error) => {
        alert("unable to login...");
        console.log("error", error);
        setLoder(false);
      });
  }

  useEffect(() => {
    // alert("Hello");
  }, []);

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
            Login
          </Typography> 

          <TextField
            id="standard-basic"
            label="Email"
            variant="standard"
            defaultValue={""}
            sx={{ mb: "1rem" }}
            inputRef={emailRef}
            type="email"
          />

          <TextField
            id="standard-basic"
            label="Password"
            variant="standard"
            defaultValue={""}
            sx={{ mb: "1rem" }}
            inputRef={passwordRef}
            type="password"
          />
        </CardContent>

        <CardActions>
          <Button
            sx={{ mb: "1rem", px: "5rem" }}
            onClick={() => {
              navigate("Signup");
            }}
          >
            signup instead
          </Button>
          <Button
            variant="contained"
            sx={{ mb: "1rem", px: "5rem" }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
