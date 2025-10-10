import React, { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { NavLink } from "react-router-dom";

let Dashboard = () => {
  useEffect(() => {
    document.title = "Dashboard - RT-Chat";
  }, []);

  let userContext = useContext(UserContext);
  // console.log("UserContext in Dashboard:", userContext);

  return (
    <div>
      <h1>Dashboard</h1>
      {userContext.user && (
        <div>
          <h2>
            Welcome, {userContext.user.username}! to{" "}
            <NavLink to="/chat">RT-Chat </NavLink>
            <NavLink to="/AiGenerater">.... AI RT-Content Generator</NavLink>
          </h2>
          <p>Your email: {userContext.user.email}</p>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
