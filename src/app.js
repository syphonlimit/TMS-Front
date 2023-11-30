import { useReducer } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AccountManagement from "./AccountManagement.js";
import DispatchContext from "./DispatchContext.js";
import Home from "./Home.js";
import Login from "./Login.js";
import MyAccount from "./MyAccount.js";

function App() {
  const navigate = useNavigate();
  //Using a reducer, manage the navigation of any error response depending on the status code
  function reducer(state, action) {
    switch (action.type) {
      case "401":
        navigate("/");
      case "403":
        navigate("/home");
      case "404":
        navigate("/home");
      case "500":
        console.log("500");
      default:
        console.log(action);
    }
  }

  const [state, dispatch] = useReducer(reducer, { error: null });

  return (
    <DispatchContext.Provider value={dispatch}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/accountmanagement" element={<AccountManagement />} />
      </Routes>
    </DispatchContext.Provider>
  );
}

export default App;
