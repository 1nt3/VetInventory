import "./App.css";
import LoginSignup from "./components/LoginSignup/LoginSignup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Panel from "./components/Panel/Panel";
import ProductEntry from "./components/RegisterProduct/ProductEntry";

function App() {
  return (
    <Router>
      <Routes>
        {/* 
          <Route path="/" element={<ProductEntry />} />
        */}
        <Route path="/" element={<LoginSignup />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </Router>
  );
}

export default App;
