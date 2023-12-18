import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
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
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Appbar from "./Appbar";

const defaultTheme = createTheme();
const components = {
  DropdownIndicator: null,
};

export default function Home() {
  const navigate = useNavigate();
  const [call, setCall] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [createValue, setCreateValue] = useState([]);
  const [app, setApp] = useState({
    application: "",
    startDate: "",
    endDate: "",
    rNum: "",
    description: "",
    permCreate: "",
    permOpen: "",
    permToDo: "",
    permDoing: "",
    permDone: "",
  });
  const [table, setTable] = useState([]);
  const [groupOptions, setGroupOptions] = React.useState([]);

  //Getting the info from database to populate the table
  async function fetchData() {
    try {
      const res = await axios.get("http://localhost:8080/controller/getApps/", config);
      console.log(res);
      //set user to table default edit disabled
      setTable(
        res.data.data.map((application) => {
          return { ...application, editDisabled: true };
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

  function getGroupsValue(value) {
    return { value: value.group_name, label: value.group_name };
  }

  //'Create App' event
  async function createApp(e) {
    //we need to reinit the config incase the token has changed
    config.headers.Authorization = "Bearer " + Cookies.get("token");
    e.preventDefault();
    const body = {
      application: app.application,
      startDate: app.startDate,
      endDate: app.endDate,
      rNum: app.rNum,
      description: app.description,
      permCreate: app.permCreate,
      permOpen: app.permOpen,
      permToDo: app.permToDo,
      permDoing: app.permDoing,
      permDone: app.permDone,
    };
    try {
      const res = await axios.post("http://localhost:8080/controller/createApp", body, config);
      toast.success(res.data.message, { autoClose: 1500 });
      setApp({
        application: "",
        startDate: "",
        endDate: "",
        rNum: "",
        description: "",
        permCreate: "",
        permOpen: "",
        permToDo: "",
        permDoing: "",
        permDone: "",
      });
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
    const [state, setState] = useState(app, []);

    useEffect(() => {});

    const onInputChange = (index, item) => {
      state[item.type] = item.content;
    };

    //App creation fields
    return (
      <>
        <TableRow key={state.application} noValidate>
          <TableCell align="center" width={150}>
            <Child id={"application"} item={state.application} onChange={onInputChange} disabled={false} />
          </TableCell>
          <TableCell align="center" width={150}>
            <Grid xs={12} align="center">
              <Child id={"startDate"} item={state.startDate} onChange={onInputChange} disabled={false} placeDate={"dd/mm/yyyy"} label={"Start"} />
            </Grid>
            <Grid xs={12} align="center" width={150}>
              <Child id={"endDate"} item={state.endDate} onChange={onInputChange} disabled={false} placeDate={"dd/mm/yyyy"} label={"End"} />
            </Grid>
          </TableCell>
          <TableCell align="center" width={100}>
            <Child id={"rNum"} item={state.rNum} onChange={onInputChange} disabled={false} />
          </TableCell>
          <TableCell align="center" width={350}>
            <Child id={"description"} item={state.description} onChange={onInputChange} disabled={false} multilines={true} multirows={3} />
          </TableCell>
          <TableCell align="center">
            <Select
              onChange={(event) =>
                //combine the values into a comma separated string
                setApp({
                  ...app,
                  permCreate: event ? event.value : "",
                })
              }
              name="colors"
              options={groupOptions}
              className="basic-single-select"
              classNamePrefix="select"
              isClearable={true}
              //read from user.group_list and match exactly
              value={groupOptions.find((option) => option.value === app.permCreate)}
            />
          </TableCell>
          <TableCell align="center">
            <Select
              onChange={(event) =>
                //combine the values into a comma separated string
                setApp({
                  ...app,
                  permOpen: event ? event.value : "",
                })
              }
              name="colors"
              options={groupOptions}
              className="basic-single-select"
              classNamePrefix="select"
              isClearable={true}
              //read from user.group_list and match exactly
              value={groupOptions.find((option) => option.value === app.permOpen)}
            />
          </TableCell>
          <TableCell align="center">
            <Select
              onChange={(event) =>
                //combine the values into a comma separated string
                setApp({
                  ...app,
                  permToDo: event ? event.value : "",
                })
              }
              name="colors"
              options={groupOptions}
              className="basic-single-select"
              classNamePrefix="select"
              isClearable={true}
              //read from user.group_list and match exactly
              value={groupOptions.find((option) => option.value === app.permToDo)}
            />
          </TableCell>
          <TableCell align="center">
            <Select
              onChange={(event) =>
                //combine the values into a comma separated string
                setApp({
                  ...app,
                  permDoing: event ? event.value : "",
                })
              }
              name="colors"
              options={groupOptions}
              className="basic-single-select"
              classNamePrefix="select"
              isClearable={true}
              //read from user.group_list and match exactly
              value={groupOptions.find((option) => option.value === app.permDoing)}
            />
          </TableCell>
          <TableCell align="center">
            <Select
              onChange={(event) =>
                //combine the values into a comma separated string
                setApp({
                  ...app,
                  permDone: event ? event.value : "",
                })
              }
              name="colors"
              options={groupOptions}
              className="basic-single-select"
              classNamePrefix="select"
              isClearable={true}
              //read from user.group_list and match exactly
              value={groupOptions.find((option) => option.value === app.permDone)}
            />
          </TableCell>
          <TableCell align="center">
            <Button variant="outlined" onClick={createApp}>
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
            <TableCell align="center" width={150}>
              {item.App_Acronym}
            </TableCell>
            <TableCell align="center" width={150}>
              <Grid xs={12} align="center">
                <Child id={"App_startDate"} item={item.App_startDate} index={index} onChange={onInputChange} disabled={item.editDisabled} />
              </Grid>
              <Grid xs={12} align="center" width={150}>
                <Child id={"App_endDate"} item={item.App_endDate} index={index} onChange={onInputChange} disabled={item.editDisabled} />
              </Grid>
            </TableCell>
            <TableCell align="center" width={100}>
              {item.App_Rnumber}
            </TableCell>
            <TableCell align="center" width={350}>
              <Child
                id={"App_Description"}
                index={index}
                item={item.App_Description}
                onChange={onInputChange}
                disabled={item.editDisabled}
                multilines={true}
                multirows={3}
              />
            </TableCell>
            <TableCell align="center">
              <Select
                isDisabled={item.editDisabled}
                onChange={(event) =>
                  //combine the values into a comma separated string
                  setTable(
                    table.map((row) => {
                      if (row.App_Acronym === item.App_Acronym) {
                        row.App_permit_create = event ? event.value : "";
                      }
                      return row;
                    })
                  )
                }
                name="colors"
                options={groupOptions}
                className="basic-single-select"
                classNamePrefix="select"
                isClearable={true}
                //read from user.group_list and match exactly
                value={groupOptions.find((option) => option.value === item.App_permit_create)}
              />
            </TableCell>
            <TableCell align="center">
              <Select
                isDisabled={item.editDisabled}
                onChange={(event) =>
                  //combine the values into a comma separated string
                  setTable(
                    table.map((row) => {
                      if (row.App_Acronym === item.App_Acronym) {
                        row.App_permit_Open = event ? event.value : "";
                      }
                      return row;
                    })
                  )
                }
                name="colors"
                options={groupOptions}
                className="basic-single-select"
                classNamePrefix="select"
                isClearable={true}
                //read from user.group_list and match exactly
                value={groupOptions.find((option) => option.value === item.App_permit_Open)}
                //value={groupOptions.filter((option) => item.permOpen.split(",").includes(option.value))}
              />
            </TableCell>
            <TableCell align="center">
              <Select
                isDisabled={item.editDisabled}
                onChange={(event) =>
                  //combine the values into a comma separated string
                  setTable(
                    table.map((row) => {
                      if (row.App_Acronym === item.App_Acronym) {
                        row.App_permit_toDoList = event ? event.value : "";
                      }
                      return row;
                    })
                  )
                }
                name="colors"
                options={groupOptions}
                className="basic-single-select"
                classNamePrefix="select"
                isClearable={true}
                //read from user.group_list and match exactly
                value={groupOptions.find((option) => option.value === item.App_permit_toDoList)}
                //value={groupOptions.filter((option) => item.permToDo.split(",").includes(option.value))}
              />
            </TableCell>
            <TableCell align="center">
              <Select
                isDisabled={item.editDisabled}
                onChange={(event) =>
                  //combine the values into a comma separated string
                  setTable(
                    table.map((row) => {
                      if (row.App_Acronym === item.App_Acronym) {
                        row.App_permit_Doing = event ? event.value : "";
                      }
                      return row;
                    })
                  )
                }
                name="colors"
                options={groupOptions}
                className="basic-single-select"
                classNamePrefix="select"
                isClearable={true}
                //read from user.group_list and match exactly
                value={groupOptions.find((option) => option.value === item.App_permit_Doing)}
                //value={groupOptions.filter((option) => item.permDoing.split(",").includes(option.value))}
              />
            </TableCell>
            <TableCell align="center">
              <Select
                isDisabled={item.editDisabled}
                onChange={(event) =>
                  //combine the values into a comma separated string
                  setTable(
                    table.map((row) => {
                      if (row.App_Acronym === item.App_Acronym) {
                        row.App_permit_Done = event ? event.value : "";
                      }
                      return row;
                    })
                  )
                }
                name="colors"
                options={groupOptions}
                className="basic-single-select"
                classNamePrefix="select"
                isClearable={true}
                //read from user.group_list and match exactly
                value={groupOptions.find((option) => option.value === item.App_permit_Done)}
                //value={groupOptions.filter((option) => item.permDone.split(",").includes(option.value))}
              />
            </TableCell>
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
      <Appbar title="Home" />
      <main>
        <Container maxWidth={false}>
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
              Application List
            </Typography>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  {/* Table heading names */}
                  <TableCell align="center">App*</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Rnum*</TableCell>
                  <TableCell align="center">Description*</TableCell>
                  <TableCell align="center">Create</TableCell>
                  <TableCell align="center">Open</TableCell>
                  <TableCell align="center">ToDo</TableCell>
                  <TableCell align="center">Doing</TableCell>
                  <TableCell align="center">Done</TableCell>
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
