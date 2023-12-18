import { TextField } from "@mui/material";
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
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
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
        const res2 = await axios.post("http://localhost:8080/controller/assignTaskToPlan/" + props.taskId, plan, config);
      } else {
        const res = await axios.post("http://localhost:8080/controller/updateTasknotes/" + props.taskId, task, config);
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
      const res = await axios.post("http://localhost:8080/controller/getTask", { taskId: props.taskId }, config);
      setTaskValue(res.data.data[0]);
      console.log(taskPlan);
    } catch (err) {
      if (err.response.status === 401) {
        navigate("/");
      }
    }
  }
  React.useEffect(() => {
    getTask();
    getPlans();
  }, []);

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
        if (error.response.status === 401) navigate("/");
      }
    }
  };

  return (
    <React.Fragment>
      <ToastContainer hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <Button variant="outlined" onClick={handleClickOpen}>
        View Task
      </Button>
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
              <Grid xs={9} paddingTop={3}></Grid>
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
