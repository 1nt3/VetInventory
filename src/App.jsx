import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Panel from "./components/AdminPanel/Panel";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </Router>
  );
}

export default App;
