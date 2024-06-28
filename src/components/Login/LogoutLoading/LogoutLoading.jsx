import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LogoutLoading.css"; // Puedes reutilizar los estilos de carga del componente Loading

const LogoutLoading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // Aumentar el tiempo de espera a 3 segundos

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-container">
      <div className="loading-message">
        <img className="loading-logo" />
        <h1>Hasta luego</h1>
        <p>Cerrando sesión...</p>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default LogoutLoading;
