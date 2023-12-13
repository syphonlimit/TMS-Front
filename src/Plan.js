import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Appbar from "./Appbar";

const defaultTheme = createTheme();
const components = {
  DropdownIndicator: null,
};

export default function Plan() {
  const { state } = useLocation();
  const { acronym } = state;
  const navigate = useNavigate();
  const [call, setCall] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [hexValue, setHexValue] = useState([]);
  const [plan, setPlan] = useState({
    plan: "",
    startDate: "",
    endDate: "",
    colors: "",
  });
  const [table, setTable] = useState([]);
  const [groupOptions, setGroupOptions] = React.useState([]);

  useEffect(() => {
    setHexValue(getRandomColor());
  }, []);

  // Random Color generator
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };

  //Getting the info from database to populate the table
  async function fetchData() {
    try {
      const res = await axios.get("http://localhost:8080/controller/getApps/", config);
      console.log(res);
      //set user to table default edit disabled
      setTable(
        res.data.data.map((plan) => {
          return { ...plan, editDisabled: true };
        })
      );
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/");
        }
      }
    }
  }

  async function handleSubmit(e, row) {
    e.preventDefault();
    //strip the _button from the id
    const id = e.target.id.replace("_button", "");
    const disabled = table.find((row) => row.App_Acronym === id).editDisabled;
    if (disabled) {
      //set edit disabled to false for the specific row
      setTable(
        table.map((row) => {
          if (row.App_Acronym === id) {
            row.editDisabled = false;
          }
          return row;
        })
      );
    } else if (!disabled) {
      //get the values for the row from the table state
      const startDate = table.find((row) => row.App_Acronym === id).App_startDate;
      const endDate = table.find((row) => row.App_Acronym === id).App_endDate;
      const description = table.find((row) => row.App_Acronym === id).App_Description;
      const permCreate = table.find((row) => row.App_Acronym === id).App_permit_create;
      const permOpen = table.find((row) => row.App_Acronym === id).App_permit_Open;
      const permToDo = table.find((row) => row.App_Acronym === id).App_permit_toDoList;
      const permDoing = table.find((row) => row.App_Acronym === id).App_permit_Doing;
      const permDone = table.find((row) => row.App_Acronym === id).App_permit_Done;
      const body = {};
      if (startDate !== "" && startDate !== undefined) {
        body.startDate = startDate;
      }
      if (endDate !== "" && endDate !== undefined) {
        body.endDate = endDate;
      }
      if (description !== "" && description !== undefined) {
        body.description = description;
      }
      body.permCreate = permCreate;
      body.permOpen = permOpen;
      body.permToDo = permToDo;
      body.permDoing = permDoing;
      body.permDone = permDone;
      try {
        const response = await axios.put("http://localhost:8080/controller/updateApp/" + row.App_Acronym, body, config);
        toast.success(response.data.message, { autoClose: 1500 });
        setCall(call + 1);
        setTable(
          table.map((row) => {
            if (row.App_Acronym === id) {
              row.App_startDate = startDate;
              row.App_endDate = endDate;
              row.App_Description = description;
              row.editDisabled = true;
            }
            return row;
          })
        );
      } catch (error) {
        toast.error(error.response.data.errMessage);
        if (error.response.status === 401) {
          navigate("/");
        }
      }
    }
  }

  //'Create plan' event
  async function createPlan(e) {
    //we need to reinit the config incase the token has changed
    config.headers.Authorization = "Bearer " + Cookies.get("token");
    e.preventDefault();
    const body = {
      plan: plan.plan,
      startDate: plan.startDate,
      endDate: plan.endDate,
      acronym: acronym,
      colors: hexValue,
    };
    try {
      const res = await axios.post("http://localhost:8080/controller/createPlan", body, config);
      toast.success(res.data.message, { autoClose: 1500 });
      setPlan({
        plan: "",
        startDate: "",
        endDate: "",
        colors: "",
      });
      setHexValue(getRandomColor());
      fetchData();
    } catch (error) {
      toast.error(error.response.data.errMessage);
      if (error.response.status === 401) {
        navigate("/");
      }
    }
  }

  //Authorization
  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };

  //kanban
  const kanban = (acronym) => {
    navigate("/kanban", { state: { acronym: acronym } });
  };

  //Run once on page load
  //use Axios to get all user
  useEffect(() => {
    fetchData();
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      const res = await axios.get("http://localhost:8080/controller/getGroups", config);
      setGroupOptions(res.data.data.map(getGroupsValue));
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) navigate("/");
      }
    }
  };

  function Child(props) {
    useEffect(() => {});
    const [item, setItem] = useState(props.item);

    const onChange = (event) => {
      let newValue = event.target.value;
      setItem((prevState) => {
        let newItem = { type: props.id, content: newValue };

        props.onChange(props.index, newItem);

        return newValue;
      });
    };
    return (
      <TextField
        value={item}
        onChange={onChange}
        margin="dense"
        fullWidth
        disabled={props.disabled}
        type={props.id}
        placeholder={props.placeDate}
        multiline={props.multilines}
        rows={props.multirows}
        label={props.label}
      ></TextField>
    );
  }
  function CreateRow(props) {
    const [state, setState] = useState(plan, []);

    useEffect(() => {});

    const onInputChange = (index, item) => {
      state[item.type] = item.content;
    };

    //plan creation fields
    return (
      <>
        <TableRow key={state.plan} noValidate>
          <TableCell align="center">
            <Child id={"plan"} item={state.plan} onChange={onInputChange} disabled={false} />
          </TableCell>
          <TableCell align="center">
            <Grid xs={12} align="center">
              <Child id={"startDate"} item={state.startDate} onChange={onInputChange} disabled={false} placeDate={"dd/mm/yyyy"} label={"Start"} />
            </Grid>
            <Grid xs={12} align="center">
              <Child id={"endDate"} item={state.endDate} onChange={onInputChange} disabled={false} placeDate={"dd/mm/yyyy"} label={"End"} />
            </Grid>
          </TableCell>
          <TableCell align="center">
            <Paper id={"colors"} item={state.colors} variant="outlined" sx={{ width: 170, height: 50, bgcolor: hexValue }} />
          </TableCell>
          <TableCell align="center">
            <Button variant="outlined" onClick={createPlan}>
              Create
            </Button>
          </TableCell>
        </TableRow>
      </>
    );
  }

  function Parent(props) {
    const [state, setState] = useState(table, []);

    useEffect(() => {});

    const onInputChange = (index, item) => {
      state[index][item.type] = item.content;
      console.log(item.type);
    };

    //Update field behaviour upon clicking 'Edit'
    return (
      <>
        {state.map((item, index) => (
          <TableRow key={item.App_Acronym} noValidate>
            <TableCell align="center">{item.App_Acronym}</TableCell>
            <TableCell align="center">
              <Grid xs={12} align="center">
                <Child id={"App_startDate"} item={item.App_startDate} index={index} onChange={onInputChange} disabled={item.editDisabled} />
              </Grid>
              <Grid xs={12} align="center">
                <Child id={"App_endDate"} item={item.App_endDate} index={index} onChange={onInputChange} disabled={item.editDisabled} />
              </Grid>
            </TableCell>
            <TableCell align="center">{item.App_Rnumber}</TableCell>
            {/* Edit and disable/enable button */}
            <TableCell align="center">
              <Button id={item.App_Acronym + "_button"} variant="outlined" onClick={(e) => handleSubmit(e, item)}>
                {item.editDisabled ? "Edit" : "Save"}
              </Button>
              <Button id={item.App_Acronym + "_button"} variant="outlined" onClick={() => kanban(item.App_Acronym)}>
                Kanban
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Appbar />
      <main>
        <Container maxWidth="md">
          <Box
            sx={{
              marginTop: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ToastContainer
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

            <Typography component="h1" variant="h5" align="center" paddingBottom={5}>
              Manage Plan for App {acronym}
            </Typography>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  {/* Table heading names */}
                  <TableCell align="center">Plan Name*</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Color (Hex)</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <CreateRow />

                <Parent />
              </TableBody>
            </Table>
          </Box>
        </Container>
      </main>
    </ThemeProvider>
  );
}
