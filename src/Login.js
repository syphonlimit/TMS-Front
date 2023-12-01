import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultTheme = createTheme();
export default function SignIn() {
  const navigate = useNavigate();

  //Authorization
  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };

  //Check for when user is already logged in
  useEffect(() => {
    async function checkLogin() {
      try {
        const isLogin = await axios.get("http://localhost:8080/controller/checkLogin", config);
        if (isLogin.data) {
          navigate("/home");
        }
      } catch (error) {
        //If there is a response and is error, output this
        if (error.response) {
          toast.error(error.response.data.errMessage, { autoClose: false });
        }
        //Fallback logging error if all else fails (eg. server down)
        else {
          toast.error("Server has issues.", { autoClose: false });
        }
      }
    }
    if (Cookies.get("token")) {
      //check with server
      checkLogin();
    }
  }, []);

  //Handling what happens during the submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = {
      username: data.get("username"),
      password: data.get("password"),
    };
    try {
      //Communicate with backend using Axios request
      //post login
      const res = await axios.post("http://localhost:8080/controller/login", user);

      //Removes any existing cookies and set new cookie
      Cookies.remove("token");
      Cookies.remove("username");
      Cookies.set("token", res.data.token, { expires: 7 });
      //Cookies.set("username", res.data.username, { expires: 7 });
      navigate("/home");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errMessage, { autoClose: false });
      } else {
        toast.error("Server has issues.", { autoClose: false });
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h3">
            TMS
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* textfield area for username */}
            <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoComplete="username" autoFocus />
            {/* textfield area for password */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* Creating 'sign in' button */}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            {/* Modifies toast with additional props */}
            <ToastContainer closeOnClick theme="colored" />
            <Grid container>
              <Grid item xs></Grid>
              <Grid item></Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
