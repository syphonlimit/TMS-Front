import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateTask(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const task = {
      name: data.get("name"),
      description: data.get("description"),
      acronym: props.acronym,
    };
    try {
      //Communicate with backend using Axios request
      const res = await axios.post("http://localhost:8080/controller/createTask", task);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errMessage);
      } else {
        toast.error("Server has issues.");
      }
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create Task
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <Container maxWidth="lg">
          <CssBaseline />
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid container spacing={1}>
              <Grid xs={12}>
                <Typography component="h1" variant="h3" align="center" paddingBottom={5}>
                  Create Task for App {props.acronym}
                </Typography>
              </Grid>
              <Typography variant="h6">Task Name*</Typography>
              <Grid xs={12}>
                <TextField id="name" name="name" margin="normal" required fullWidth autoFocus />
              </Grid>
              <Typography variant="h6">Task Description</Typography>
              <Grid xs={12}>
                <TextField id="description" name="description" margin="normal" fullWidth multiline={true} rows={10} />
              </Grid>
              <Grid xs={2}>
                <Button variant="outlined" size="large" onClick={handleClose}>
                  Close
                </Button>
              </Grid>
              <Grid xs={9}></Grid>
              <Grid xs={1}>
                <Button variant="outlined" size="large" type="submit">
                  Create
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Dialog>
    </React.Fragment>
  );
}
