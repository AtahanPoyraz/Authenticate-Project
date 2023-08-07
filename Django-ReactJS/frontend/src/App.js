import React from "react";
import Login from "./jsx/login";
import CreateUser from "./jsx/register";
import ResetPassword from "./jsx/reset";
import EmailSender from "./jsx/sendmail";
import Home from "./jsx/home";
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';

function App() {
  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <Router>
      <div>
        <h1>Welcome Please Login</h1>
        <ul>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </ul>

        <Routes>
          <Route path="/emailsend" element={<EmailSender />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CreateUser />} />
          {isAuthenticated ? (
            <React.Fragment>
              <Route path="/home/:token" element={<Home />} />
              <Route path="/resetpasswd/:token" element={<ResetPassword />} /> 
            </React.Fragment>
          ) : (
            <Route path="/*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </div>
    </Router>
  )
}

export default App;