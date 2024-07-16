import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import emailIcon from "../../../assets/email.png";
import passwordIcon from "../../../assets/password.png";

const authenticateUser = async (email, password) => {
  const isCredentialValid = await invoke("is_credential_valid", {
    email,
    password,
  });

  if (!isCredentialValid) {
    throw new Error("Correo o contraseña incorrectos.");
  }
};

const getUserRole = async (email) => {
  try {
    const role = await invoke("get_rol_user", { email });
    return role;
  } catch (error) {
    console.error("Error getting user role:", error);
    return "Error"; // Manejo de errores
  }
};

const LoginSignup = ({
  setAuthenticated,
  setEmailUserCurrent,
  setUserRoleCurrent,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await authenticateUser(email, password);
      setAuthenticated(true);
      const roleUser = await getUserRole(email);
      setUserRoleCurrent(roleUser.name);
      setEmailUserCurrent(email);
      navigate("/loading");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-login">
      <div className="login">
        <header className="header">
          <h1 className="text">Inventario</h1>
          <div className="underline"></div>
        </header>
        <div className="inputs">
          <InputField
            icon={emailIcon}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            icon={passwordIcon}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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

const InputField = ({ icon, type, placeholder, value, onChange }) => (
  <div className="input">
    <img src={icon} alt={placeholder} className={`${type}-icon`} />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default LoginSignup;
