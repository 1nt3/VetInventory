import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import emailIcon from "../../assets/email.png";
import passwordIcon from "../../assets/password.png";

const LoginSignup = ({ setAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await authenticateUser(email, password);
      setAuthenticated(true); 
      navigate("/loading"); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const authenticateUser = async (email, password) => {
    const isValid = await invoke("is_credential_valid", {
      email,
      password,
    });

    if (!isValid) {
      throw new Error("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="container">
      <div className="login">
        <header className="header">
          <h1 className="text">Inventario</h1>
          <div className="underline"></div>
        </header>
        <div className="inputs">
          <div className="input">
            <img src={emailIcon} alt="Email" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={passwordIcon} alt="Password" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        {loading && (
          <div className="loading">
            <div className="loader"></div>
            <p>Cargando...</p>
          </div>
        )}
        <div className="submit-container">
          <button className="submit" onClick={handleLogin} disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;