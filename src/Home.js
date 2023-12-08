import { Button, TableBody, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import Appbar from "./Appbar";

const defaultTheme = createTheme();

export default function Home() {
  const navigate = useNavigate();
  //Authorization
  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };

  //kanban
  const kanban = () => {
    navigate("/kanban");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Appbar title="Home" />
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 6,
            pb: 6,
          }}
        >
          <Container maxWidth="lg">
            <Table sx={{ minWidth: 850 }} size="medium" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  {/* Table heading names */}
                  <TableCell align="center">App Name / Rnum</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <TextField placeholder="App Name / Rnum"></TextField>
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={1}>
                      <Grid xs={12} align="center">
                        <TextField type="date"></TextField>
                      </Grid>
                      <Grid xs={12} align="center">
                        <TextField type="date"></TextField>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell width={400}>
                    <TextField fullWidth disabled={true}></TextField>
                  </TableCell>
                  <TableCell align="center">
                    <Button variant="outlined">Create</Button>
                  </TableCell>
                </TableRow>
                {/* Table rows for listing the current apps */}
                <TableRow>
                  <TableCell>
                    <TextField placeholder="App Name / Rnum"></TextField>
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={1}>
                      <Grid xs={12} align="center">
                        <TextField type="date"></TextField>
                      </Grid>
                      <Grid xs={12} align="center">
                        <TextField type="date"></TextField>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell width={400}>
                    <TextField fullWidth disabled={true}></TextField>
                  </TableCell>
                  <TableCell align="center">
                    <Grid container spacing={1}>
                      <Grid xs={12} align="center">
                        <Button variant="outlined">Edit</Button>
                      </Grid>
                      <Grid xs={12}>
                        <Button variant="outlined" onClick={kanban}>
                          Enter
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}
