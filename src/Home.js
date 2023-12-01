import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import { useEffect, useState } from "react";
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

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Appbar title="Home" />
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm"></Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Typography variant="h1" align="center">
            [List of Apps]
          </Typography>
        </Container>
      </main>
    </ThemeProvider>
  );
}
