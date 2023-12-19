import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IconButton, Paper, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ViewTask(props) {
  const [open, setOpen] = React.useState(false);
  const [taskValue, setTaskValue] = React.useState([]);
  const [groupOptions, setGroupOptions] = React.useState([]);
  const [taskPlan, setTaskPlan] = React.useState(null);
  const [butt, setButt] = React.useState("Edit");
  const [disable, setDisable] = React.useState(true);
  const [openedByArrow, setOpenedByArrow] = useState(false);
  const [arrowDirection, setArrowDirection] = useState("none");
  const [selectedTask, setSelectedTask] = useState(null);
  const location = useLocation();
  const [updatedNotes, setUpdatedNotes] = useState("");
  const [call, setCall] = useState(0);

  const initialTaskStates = {
    Open: [],
    ToDo: [],
    Doing: [],
    Done: [],
    Close: [],
  };
  const [tasks, setTasks] = useState(initialTaskStates);
  const { task, taskState, taskIndex, acronym, state } = props;

  //Permission states
  const [isUserPL, setIsUserPL] = useState(false);
  const [isUserPM, setIsUserPM] = useState(false);
  const [permitCreate, setPermitCreate] = useState(false);
  const [permitOpen, setPermitOpen] = useState(false);
  const [permitToDo, setPermitToDo] = useState(false);
  const [permitDoing, setPermitDoing] = useState(false);
  const [permitDone, setPermitDone] = useState(false);

  const taskStates = {
    Open: [],
    ToDo: [],
    Doing: [],
    Done: [],
    Close: [],
  };

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
  }, []);

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
  }, []);

  useEffect(() => {
    //Checkgroup function here for App Permit Create
    const checkGroup = async () => {
      try {
        const res2 = await axios.post("http://localhost:8080/controller/getApp", { acronym: acronym }, config);
        const res = await axios.post("http://localhost:8080/controller/checkGroup", { group: res2.data.data[0].App_permit_create }, config);
        if (res.data) {
          setPermitCreate(true);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) navigate("/");
        }
      }
    };
    checkGroup();
  }, []);

  useEffect(() => {
    //Checkgroup function here for App Permit Open
    const checkGroup = async () => {
      try {
        const res2 = await axios.post("http://localhost:8080/controller/getApp", { acronym: acronym }, config);
        const res = await axios.post("http://localhost:8080/controller/checkGroup", { group: res2.data.data[0].App_permit_Open }, config);
        if (res.data) {
          setPermitOpen(true);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) navigate("/");
        }
      }
    };
    checkGroup();
  }, []);

  useEffect(() => {
    //Checkgroup function here for App Permit Todo
    const checkGroup = async () => {
      try {
        const res2 = await axios.post("http://localhost:8080/controller/getApp", { acronym: acronym }, config);
        const res = await axios.post("http://localhost:8080/controller/checkGroup", { group: res2.data.data[0].App_permit_toDoList }, config);
        if (res.data) {
          setPermitToDo(true);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) navigate("/");
        }
      }
    };
    checkGroup();
  }, []);

  useEffect(() => {
    //Checkgroup function here for App Permit Doing
    const checkGroup = async () => {
      try {
        const res2 = await axios.post("http://localhost:8080/controller/getApp", { acronym: acronym }, config);
        const res = await axios.post("http://localhost:8080/controller/checkGroup", { group: res2.data.data[0].App_permit_Doing }, config);
        if (res.data) {
          setPermitDoing(true);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) navigate("/");
        }
      }
    };
    checkGroup();
  }, []);

  useEffect(() => {
    //Checkgroup function here for App Permit Done
    const checkGroup = async () => {
      try {
        const res2 = await axios.post("http://localhost:8080/controller/getApp", { acronym: acronym }, config);
        const res = await axios.post("http://localhost:8080/controller/checkGroup", { group: res2.data.data[0].App_permit_Done }, config);
        if (res.data) {
          setPermitDone(true);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) navigate("/");
        }
      }
    };
    checkGroup();
  }, []);

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

  const fetchData = async () => {
    try {
      const res = await axios.post("http://localhost:8080/controller/getAllTask", { acronym: acronym }, config);
      if (res.data && res.data.data) {
        const processedTasks = processData(res.data.data);
        setTasks(processedTasks);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.errMessage);
      } else {
        toast.error("Server has gibbit");
      }
    }
  };

  const renderArrowForward = (taskState, task, taskIndex) => {
    const keys = Object.keys(task);
    if (taskIndex < keys.length - 1 && checkPermitForLane(taskState)) {
      return (
        <IconButton onClick={(event) => handleMoveTask(event, task, Object.keys(taskStates)[taskIndex + 1], "right")}>
          <ArrowForwardIcon />
        </IconButton>
      );
    }
    return null;
  };

  const renderArrowBack = (taskState, task, taskIndex) => {
    const keys = Object.keys(task);
    if (canDemoteTask(taskState) && checkPermitForLane(taskState)) {
      return (
        <IconButton key={permitCreate} onClick={(event) => handleMoveTask(event, task, Object.keys(taskStates)[taskIndex - 1], "left")}>
          <ArrowBackIcon />
        </IconButton>
      );
    }
    return null;
  };

  const handleMoveTask = async (event, task, nextState, direction) => {
    event.stopPropagation();
    // Fetch the task details again if necessary
    try {
      const res = await axios.post("http://localhost:8080/controller/getTask", { taskId: task.id }, config);
      console.log(...res.data.data);
      console.log(nextState);
      setSelectedTask({ ...res.data.data, nextState });
      setOpenedByArrow(true);
      setArrowDirection(direction); // Set the direction of the arrow clicked
      handleClickOpen();
    } catch (err) {
      // handle error
    }
  };

  const canDemoteTask = (taskState) => {
    return taskState === "Doing" || taskState === "Done";
  };

  const checkPermitForLane = (lane) => {
    switch (lane) {
      case "Open":
        return permitOpen;
      case "ToDo":
        return permitToDo;
      case "Doing":
        return permitDoing;
      case "Done":
        return permitDone;
      default:
        return false;
    }
  };

  const renderActionButton = () => {
    if (arrowDirection === "left") {
      return (
        <Button onClick={handlePromoteDemote} variant="outlined" color="secondary">
          Demote
        </Button>
      );
    } else if (arrowDirection === "right") {
      return (
        <Button onClick={handlePromoteDemote} variant="outlined" color="secondary">
          Promote
        </Button>
      );
    }
    return null;
  };

  const handlePromoteDemote = async () => {
    if (!selectedTask || !selectedTask.nextState) {
      console.error("Selected task or nextState is not defined.");
      return;
    }

    if (updatedNotes === "") {
      setUpdatedNotes(null);
    }

    let url;
    switch (arrowDirection) {
      case "right": // Promote
        url = `http://localhost:8080/controller/promoteTask/${selectedTask[0].Task_id}`;
        break;
      case "left": // Demote
        if (selectedTask.Task_state === "Done") {
          url = `http://localhost:8080/controller/rejectTask/${selectedTask[0].Task_id}`;
        } else if (selectedTask.Task_state === "Doing") {
          url = `http://localhost:8080/controller/returnTask/${selectedTask[0].Task_id}`;
        }
        break;
      default:
        console.error("Invalid arrow direction for task movement.");
        return;
    }

    if (!url) {
      console.error("No URL defined for task movement.");
      return;
    }

    //if demoting, we want to check if the project lead reassigned a new task plan

    try {
      const res = await axios.put(url, { Task_notes: updatedNotes, Task_plan: taskPlan?.value || null }, config);
      toast.success(res.data.message, { autoClose: 1500 });
      setCall(call + 1);
      fetchData(); // Refresh data

      handleClose();
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.errMessage);
        if (err.response.data.errMessage === "You are not authorised") {
          fetchData();
          //Close the modal
          handleClose();
        }
      } else {
        toast.error("Server has flibby");
      }
    }
  };

  const handleChange = (event) => {
    setTaskPlan(event);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setButt("Edit");
    setDisable(true);
    setOpen(false);
  };

  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };

  const enableEdit = () => {
    setButt("Save");
    setDisable(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const task = {
      note: data.get("newNote"),
      acronym: props.acronym,
    };

    try {
      //Communicate with backend using Axios request
      if (taskPlan?.value !== null && taskPlan?.value !== taskValue?.Task_plan) {
        const plan = {
          plan: taskPlan.value,
          note: data.get("newNote"),
          acronym: props.acronym,
        };
        const res2 = await axios.post("http://localhost:8080/controller/assignTaskToPlan/" + task.id, plan, config);
      } else {
        const res = await axios.post("http://localhost:8080/controller/updateTasknotes/" + task.id, task, config);
      }

      toast.success("Task updated successfully", { autoClose: 1500 });
      setButt("Edit");
      setDisable(true);

      setOpen(false);
      getTask();
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errMessage, { autoClose: 1500 });
      } else {
        toast.error("Server has issues.", { autoClose: 1500 });
      }
    }
  };
  async function getTask() {
    try {
      const res = await axios.post("http://localhost:8080/controller/getTask", { taskId: task.id }, config);
      setTaskValue(res.data.data[0]);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errMessage, { autoClose: 1500 });
      }
    }
  }
  React.useEffect(() => {
    getTask();
    getPlans();
  }, [call]);

  function getPlanName(value) {
    return { value: value.Plan_MVP_name, label: value.Plan_MVP_name };
  }

  const getPlans = async () => {
    try {
      const planAcronym = { Plan_app_Acronym: props.acronym };
      const res = await axios.post("http://localhost:8080/controller/getPlans", planAcronym, config);
      setGroupOptions(res.data.data.map(getPlanName));
    } catch (error) {
      if (error.response) {
        if (error.response.taskState === 401) navigate("/");
      }
    }
  };

  return (
    <React.Fragment>
      <ToastContainer hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <Paper
        key={task.id}
        elevation={1}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", // Enable wrapping
          padding: "8px",
          marginBottom: "8px",
          wordWrap: "break-word",
          borderTop: `6px solid ${task.Plan_color}`,
          backgroundColor: "#fff",
        }}
        onClick={(e) => handleClickOpen(task.id)}
      >
        {renderArrowBack(taskState, task, taskIndex, task.length)}
        {/* Task Name and ID */}
        <Box
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            wordBreak: "break-all", // Break long words
          }}
        >
          <Typography variant="body1" style={{ maxWidth: "100%" }}>
            {task.name}
          </Typography>
          <Typography variant="body2" style={{ fontSize: "0.8em", color: "gray" }}>
            {task.id}
          </Typography>
        </Box>
        {renderArrowForward(taskState, task, taskIndex, task.length)}
      </Paper>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <Container maxWidth="lg">
          <CssBaseline />
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid container spacing={1}>
              <Grid xs={4}>
                <Typography variant="h6">App Acronym</Typography>
                <Typography>{props.acronym}</Typography>
                <Typography variant="h6" paddingTop={2}>
                  Task Name
                </Typography>
                <Typography>{taskValue.Task_name}</Typography>
                <Typography variant="h6" paddingTop={2}>
                  Task ID
                </Typography>
                <Typography>{props.taskId}</Typography>
                <Typography variant="h6" paddingTop={2}>
                  Task State
                </Typography>
                <Typography>{taskValue.Task_state}</Typography>
                <Typography variant="h6" paddingTop={2}>
                  Task Plan
                </Typography>
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <Select
                    className="basic-single-select"
                    classNamePrefix="select"
                    isDisabled={disable}
                    options={groupOptions}
                    onChange={handleChange}
                    isClearable={true}
                    defaultValue={taskValue.Task_plan !== null ? { label: taskValue.Task_plan, value: taskValue.Task_plan } : null}
                  />
                </FormControl>
                <Typography variant="h6" paddingTop={2}>
                  Task Owner
                </Typography>
                <Typography>{taskValue.Task_owner}</Typography>
                <Typography variant="h6" paddingTop={2}>
                  Task Creator
                </Typography>
                <Typography>{taskValue.Task_state}</Typography>
                <Typography variant="h6" paddingTop={2}>
                  Task Create Date
                </Typography>
                <Typography>{taskValue.Task_createDate && taskValue.Task_createDate.split("T")[0]}</Typography>
              </Grid>
              <Grid xs={8}>
                <Typography variant="h6">Task Description</Typography>
                <TextField value={taskValue.Task_description} multiline rows={3} fullWidth disabled></TextField>
                <Typography variant="h6" paddingTop={1}>
                  Task Notes
                </Typography>
                <TextField value={taskValue.Task_notes} multiline rows={9} fullWidth disabled></TextField>
                <Typography variant="h6" paddingTop={1}>
                  New Notes
                </Typography>
                <TextField id="newNote" name="newNote" className="newNote" multiline rows={3} fullWidth disabled={disable}></TextField>
              </Grid>
              <Grid xs={2} paddingTop={3}>
                <Button variant="outlined" size="large" onClick={handleClose}>
                  Close
                </Button>
              </Grid>
              <Grid xs={7} paddingTop={3}></Grid>
              <Grid xs={2} paddingTop={3}>
                {selectedTask && selectedTask.nextState && renderActionButton()}
              </Grid>
              <Grid xs={1} paddingTop={3}>
                {butt === "Edit" ? (
                  <Button key="edit" variant="outlined" type="button" size="large" onClick={() => enableEdit()}>
                    {butt}
                  </Button>
                ) : (
                  <Button key="submit" variant="outlined" size="large" type="submit">
                    {butt}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Dialog>
    </React.Fragment>
  );
}
