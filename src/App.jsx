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
          Comentado para probar la función (command) create_product que se encuentra en el componente ProductEntry (que es temporal).
          <Route path="/" element={<LoginSignup />} />
        */}
        <Route path="/" element={<ProductEntry />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </Router>
  );
}

export default App;
