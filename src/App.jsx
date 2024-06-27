import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import Panel from "./components/Panel/Panel";
import Loading from "./components/LoginSignup/Loading";
import LogoutLoading from "./components/LoginSignup/LogoutLoading"; // Importar el nuevo componente
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup setAuthenticated={setIsAuthenticated} />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/logout-loading" element={<LogoutLoading />} /> {/* Nueva ruta */}
        <Route path="/panel" element={isAuthenticated ? <Panel setAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
