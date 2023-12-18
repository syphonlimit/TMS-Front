import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Appbar from "./Appbar";
import CreateTask from "./CreateTask";
import ViewTask from "./ViewTask";

const defaultTheme = createTheme();

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
            <Grid container spacing={1} justifyContent="center"></Grid>
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}
