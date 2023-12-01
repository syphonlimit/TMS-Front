import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Appbar(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };
  useEffect(() => {
    const checkGroup = async () => {
      try {
        const res = await axios.post("http://localhost:8080/controller/checkGroup", { group: "admin" }, config);
        if (res.data) {
          setOpen(true);
        }
      } catch (err) {
        if (err.response.status === 401) {
          navigate("/");
        }
      }
    };
    checkGroup();
  }, [props.call]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await axios.get("http://localhost:8080/controller/checkLogin", config);
      } catch (err) {
        if (err.response.status === 401) {
          navigate("/");
        }
      }
    };
    checkLogin();
  }, [props.call]);
  useEffect(() => {
    const checkGroup = async () => {
      if (props.group !== undefined && props.group !== null && props.group !== "") {
        try {
          const res = await axios.post("http://localhost:8080/controller/checkGroup", { group: props.group }, config);
          if (!res.data) {
            navigate("/");
          }
        } catch (err) {
          if (err.response.status === 401) {
            navigate("/");
          }
        }
      }
    };
    checkGroup();
  }, [props.call]);
  //home
  const homePage = () => {
    navigate("/home");
  };

  //accountManagement
  const accountManagement = () => {
    navigate("/accountmanagement");
  };

  //myaccount
  const myAccount = () => {
    navigate("/myaccount");
  };

  //logout
  const logOut = () => {
    axios.get("http://localhost:8080/controller/_logout", config);
    Cookies.remove("token");
    navigate("/");
  };

  return (
    <AppBar position="relative">
      <Toolbar>
        <Button variant="Contained" onClick={homePage}>
          <Typography variant="h3" color="inherit" noWrap>
            TMS
          </Typography>
        </Button>
        <Typography variant="h6" color="inherit" noWrap component="div" sx={{ flexGrow: 1 }}>
          {props.title}
        </Typography>
        {open && (
          <Button color="inherit" onClick={accountManagement}>
            Account Management
          </Button>
        )}
        <Button color="inherit" onClick={myAccount}>
          My Account
        </Button>
        <Button color="inherit" onClick={logOut}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
