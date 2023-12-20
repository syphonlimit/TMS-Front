import { Container, Grid, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Appbar from "./Appbar";
import CreateTask from "./CreateTask";
import ViewTask from "./ViewTask";

const defaultTheme = createTheme();

export default function Kanban(props) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { acronym } = state;
  const [call, setCall] = useState(0);

  //Authorization
  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };

  const initialTaskStates = {
    Open: [],
    ToDo: [],
    Doing: [],
    Done: [],
    Close: [],
  };

  const [tasks, setTasks] = useState(initialTaskStates);
  const [newTask, setNewTask] = useState("");
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);
  const [openTaskDetailsModal, setOpenTaskDetailsModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = React.useState(false);

  //Permission states
  const [isUserPL, setIsUserPL] = useState(false);
  const [isUserPM, setIsUserPM] = useState(false);

  useEffect(() => {
    //Checkgroup function here for Create Task button
    const checkGroup = async () => {
      try {
        const res = await axios.post("http://localhost:8080/controller/checkGroup", { group: "PL" }, config);
        if (res.data) {
          setIsUserPL(true);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) navigate("/");
        }
      }
    };
    checkGroup();
  }, [call]);

  useEffect(() => {
    //Checkgroup function here for Manage Plan button
    const checkGroup = async () => {
      try {
        const res = await axios.post("http://localhost:8080/controller/checkGroup", { group: "PM" }, config);
        if (res.data) {
          setIsUserPM(true);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) navigate("/");
        }
      }
    };
    checkGroup();
  }, [call]);

  const fetchData = async () => {
    try {
      const res = await axios.post("http://localhost:8080/controller/getAllTask", { acronym: state.acronym }, config);
      if (res.data && res.data.data) {
        const processedTasks = processData(res.data.data);
        setTasks(processedTasks);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.errMessage);
      } else {
        toast.error("Server has issues");
      }
    }
  };

  //Function to process the tasks retrieved from the database into the format required by the board
  const processData = (data) => {
    const taskStates = {
      Open: [],
      ToDo: [],
      Doing: [],
      Done: [],
      Close: [],
    };

    data.forEach((task) => {
      const state = task.Task_state;
      taskStates[state].push({
        id: task.Task_id,
        name: task.Task_name,
        Plan_color: task.Plan_color,
      });
    });

    return taskStates;
  };

  useEffect(() => {
    fetchData();
  }, [call]);

  const createPlan = () => {
    navigate("/plan", { state: { acronym: acronym } });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Appbar title={acronym} />
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 1,
            pb: 6,
          }}
        >
          <Container maxWidth="false" style={{ padding: "16px" }}>
            <Box mb={2} paddingLeft={1}>
              {/* Leave space for buttons */}
              {isUserPL && <CreateTask acronym={acronym} call={call} setCall={setCall} />}
              {isUserPM && (
                <Button onClick={createPlan} variant="outlined">
                  Manage Plan
                </Button>
              )}
            </Box>
            <Grid container spacing={3}>
              {Object.keys(tasks).map((status, index, array) => (
                <Grid item key={status} xs={12 / array.length} style={{ height: "80vh" }}>
                  <Paper elevation={3} style={{ padding: "16px", height: "100%", overflow: "auto" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      align="center"
                      style={{
                        borderBottom: "2px solid #ccc",
                        padding: "8px",
                        borderRadius: "4px",
                      }}
                    >
                      {status}
                    </Typography>
                    {tasks[status].length > 0 ? (
                      tasks[status].map((tasks) => (
                        <ViewTask task={tasks} taskState={status} taskIndex={index} acronym={acronym} setCall={setCall} call={call} array={array} />
                      ))
                    ) : (
                      <Typography style={{ textAlign: "center", marginTop: "20px" }}>No tasks in "{status}"</Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}
