import { React, useState } from "react";
import Login from "./Login";
import Register from "./Registration"; // Make sure to uncomment this if you need it
//import RegisterForm from "./RegisterForm";
import NoMatchPage from "./NoMatchPage";
import Dashboard from "./Dashboard";
import { HashRouter, Routes, Route } from "react-router-dom"; // Import Routes and Route from react-router-dom
import NavBar from "./NavBar";
import { UserContext } from "./UserContext";
import Chat from "./Chat";
import AiGenerater from "./Ai";

function App() {
  let [user, setUser] = useState({
    isLoggedIn: false,
    username: null,
    _id: null,
    email: null,
    token: null,
    isAdmin: null,
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <HashRouter>
        <NavBar />
        <div className="container-fluid">
          <Routes>
            <Route path="/" exact={true} element={<Login />} />{" "}
            {/* Use 'element' prop instead of 'component' */}
            <Route path="/Registration" element={<Register />} />{" "}
            <Route path="/chat" element={<Chat />} /> {/* Use 'element' prop */}
            <Route path="/dashboard" element={<Dashboard />} />{" "}
            <Route path="/AiGenerater" element={<AiGenerater />} />{" "}
            {/* Use 'element' prop */}
            {/* Use 'element' prop */}
            <Route path="*" element={<NoMatchPage />} />{" "}
            {/* Handle unknown routes */}
          </Routes>
        </div>
      </HashRouter>
    </UserContext.Provider>
  );
}

export default App;
