import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Appbar from "./Appbar";
import DispatchContext from "./DispatchContext";

const defaultTheme = createTheme();

export default function MyAccount() {
  const [defAccInfo, setDefAccInfo] = useState({
    username: "",
    email: "",
    group_list: "",
    password: "",
  });
  const [fieldDisabled, setFieldDisabled] = useState(true);
  const [editButton, setEditButton] = useState("Edit");
  //const [errorMessage, setErrorMessage] = useState("");
  //const [open, setOpen] = React.useState(false);
  const appDispatch = React.useContext(DispatchContext);
  //Authorization
  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };
  //get default account values
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:8080/controller/getUser/", config);
        //set password in response to empty
        response.data.data.password = "";
        setDefAccInfo(response.data.data);
      } catch (err) {
        appDispatch({ type: err.response.status });
      }
    }
    fetchData();
  }, []);

  //Handling submission of email and/or password
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (fieldDisabled) {
      setFieldDisabled(false);
      setEditButton("Save");
    } else {
      const data = new FormData(event.currentTarget);
      const updateEmail = { email: data.get("email") };
      try {
        const res = await axios.put("http://localhost:8080/controller/updateUserEmail/", updateEmail, config);
        if (data.get("password") !== null && data.get("password") !== "") {
          const updatePassword = { password: data.get("password") };

          await axios.put("http://localhost:8080/controller/updateUserPassword/", updatePassword, config);
        }
        setFieldDisabled(true);
        setEditButton("Edit");
        //if password field is not empty, set it to empty
        setDefAccInfo({
          ...defAccInfo,
          password: "",
        });
        //setOpen(false);
        //setErrorMessage("");
        toast.success("Account updated successfully");
      } catch (error) {
        toast.error(error.response.data.errMessage);
        //setErrorMessage(error.response.data.errMessage);
        //setOpen(true);
      }
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Appbar title="My Account" />
      <main>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* Creating box to output read-only username and group list */}
            <Box sx={{ border: 1, align: "left", p: 1 }}>
              <Typography component="h1" variant="h5">
                Username: {defAccInfo.username}
              </Typography>
              <Typography component="h1" variant="h5">
                Groups: {defAccInfo.group_list}
              </Typography>
            </Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={defAccInfo.email}
              onChange={(e) =>
                setDefAccInfo({
                  ...defAccInfo,
                  email: e.target.value,
                })
              }
              disabled={fieldDisabled}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={defAccInfo.password}
              disabled={fieldDisabled}
              onChange={(e) =>
                setDefAccInfo({
                  ...defAccInfo,
                  password: e.target.value,
                })
              }
            />
            {/*error message*/}
            {/*{open && <Alert severity="error">{errorMessage}</Alert>}*/}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              {editButton}
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item></Grid>
            </Grid>
          </Box>
        </Box>
      </main>
    </ThemeProvider>
  );
}
