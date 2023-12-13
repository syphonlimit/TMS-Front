import * as React from "react";
import { Route, Routes } from "react-router-dom";
import AccountManagement from "./AccountManagement.js";
import Home from "./Home.js";
import Kanban from "./Kanban.js";
import Login from "./Login.js";
import MyAccount from "./MyAccount.js";
import Plan from "./Plan.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/myaccount" element={<MyAccount />} />
      <Route path="/accountmanagement" element={<AccountManagement />} />
      <Route path="/kanban" element={<Kanban />} />
      <Route path="/plan" element={<Plan />} />
    </Routes>
  );
}

export default App;
