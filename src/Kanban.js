import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Container, Grid, IconButton, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Appbar from "./Appbar";
import CreateTask from "./CreateTask";
import ViewTask from "./ViewTask";

const defaultTheme = createTheme();

const initialTasks = {
  open: [
    { id: "task-1", content: "Nigeru?" },
    { id: "task-2", content: "Dare da!?" },
    { id: "task-11", content: "Douko e?" },
    { id: "task-12", content: "Naze!!!" },
    { id: "task-13", content: "Beat down, Rise up" },
    { id: "task-14", content: "Task 14" },
    { id: "task-15", content: "Task 15" },
  ],
  todo: [
    { id: "task-3", content: "Task 3" },
    { id: "task-4", content: "Task 4" },
  ],
  doing: [
    { id: "task-5", content: "What am I doing" },
    { id: "task-6", content: "Beat down, Rise up" },
  ],
  done: [
    { id: "task-7", content: "Task 7" },
    { id: "task-8", content: "Task 8" },
  ],
  close: [
    { id: "task-9", content: "Task 9" },
    { id: "task-10", content: "Task 10" },
  ],
};

export default function Kanban() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { acronym } = state;

  //Authorization
  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };

  const createPlan = () => {
    navigate("/plan", { state: { acronym: acronym } });
  };

  const [tasks, setTasks] = useState(initialTasks);

  const promoteTask = (columnId, index) => {
    if (index > 0 && columnId !== "open" && columnId !== "todo" && columnId !== "close") {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        const taskToPromote = updatedTasks[columnId][index];
        updatedTasks[columnId] = updatedTasks[columnId].filter((_, i) => i !== index);
        updatedTasks[Object.keys(updatedTasks)[Object.keys(updatedTasks).indexOf(columnId) - 1]] = [
          ...updatedTasks[Object.keys(updatedTasks)[Object.keys(updatedTasks).indexOf(columnId) - 1]],
          taskToPromote,
        ];
        return updatedTasks;
      });
    }
  };

  const demoteTask = (columnId, index) => {
    const columnKeys = Object.keys(tasks);
    if (index < tasks[columnId].length - 1 && columnKeys.indexOf(columnId) < columnKeys.length - 1 && (columnId === "doing" || columnId === "done")) {
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        const taskToDemote = updatedTasks[columnId][index];
        updatedTasks[columnId] = updatedTasks[columnId].filter((_, i) => i !== index);
        updatedTasks[columnKeys[columnKeys.indexOf(columnId) + 1]] = [...updatedTasks[columnKeys[columnKeys.indexOf(columnId) + 1]], taskToDemote];
        return updatedTasks;
      });
    }
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
            <Box mb={2} paddingLeft={20}>
              {/* Leave space for buttons */}
              <CreateTask acronym={acronym} />
              <Button onClick={createPlan} variant="outlined">
                Create Plan
              </Button>
              <ViewTask taskId="farm9009" acronym={acronym} />
            </Box>
            <Grid container spacing={1} justifyContent="center">
              {Object.keys(tasks).map((columnId) => (
                <Grid item key={columnId} xs={12} sm={6} md={6} lg={2}>
                  <Paper elevation={3} style={{ padding: "16px", minHeight: "200px", textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom>
                      {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
                    </Typography>
                    <List>
                      {tasks[columnId].map((task, index) => (
                        <Paper key={task.id} variant="outlined" style={{ margin: "5px" }}>
                          <ListItem>
                            <ListItemText>{task.content}</ListItemText>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              {columnId !== "open" && columnId !== "todo" && columnId !== "close" && (
                                <IconButton size="small" color="primary" onClick={() => promoteTask(columnId, index)}>
                                  <ArrowBackIcon />
                                </IconButton>
                              )}
                              {columnId !== "close" && (
                                <IconButton size="small" color="primary" onClick={() => demoteTask(columnId, index)}>
                                  <ArrowForwardIcon />
                                </IconButton>
                              )}
                            </div>
                          </ListItem>
                        </Paper>
                      ))}
                    </List>
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
