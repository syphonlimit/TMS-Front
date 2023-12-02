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
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Appbar from "./Appbar";

const defaultTheme = createTheme();
export default function MyAccount() {
  const navigate = useNavigate();
  //defining the details that the const variable is going to hold
  const [defAccInfo, setDefAccInfo] = useState({
    username: "",
    email: "",
    group_list: "",
    password: "",
  });
  const [fieldDisabled, setFieldDisabled] = useState(true);
  const [editButton, setEditButton] = useState("Edit");

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
        //populates setDefAccInfo variable with the currently fetched data
        setDefAccInfo(response.data.data);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) navigate("/");
        } else {
          //toast.error("Server has issues.");
        }
      }
    }
    fetchData();
  }, []);

  //Handling submission of email and/or password
  const handleSubmit = async (event) => {
    event.preventDefault();
    //Enables field to be editable to change from 'Edit' to 'Save'
    if (fieldDisabled) {
      setFieldDisabled(false);
      setEditButton("Save");
    }
    //Once button is named 'Save', this will run after pressing the button
    else {
      const data = new FormData(event.currentTarget);
      //updateEmail holds the new value
      const updateEmail = { email: data.get("email") };
      try {
        //updateEmail and config send to backend, backend check for token from config
        const res = await axios.put("http://localhost:8080/controller/updateUserEmail/", updateEmail, config);
        if (data.get("password") !== null && data.get("password") !== "") {
          const updatePassword = { password: data.get("password") };
          //Same as the above email but passing updatePassword instead
          await axios.put("http://localhost:8080/controller/updateUserPassword/", updatePassword, config);
        }
        //After pressing 'Save', 'Save' changes back to 'Edit'
        setFieldDisabled(true);
        setEditButton("Edit");
        //if password field is not empty, set it to empty
        setDefAccInfo({
          ...defAccInfo,
          password: "",
        });
        toast.success("Account updated successfully");
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.errMessage);
        } else {
          toast.error("Server has issues.");
        }
      }
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Appbar title="My Account" />
      <main>
        {/*Set props for toast */}
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
