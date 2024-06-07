import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await authenticateUser(email, password);
      navigate("/panel");
    } catch (error) {
      setError("Error login.");
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
      <div className="header">
        <div className="text">Inventario</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
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
        <div className="submit" onClick={handleLogin}>
          Ingresar
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
