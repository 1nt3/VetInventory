import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Loading.css";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/panel");
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-container">
      <div className="loading-message">
        <img className="loading-logo" />
        <h1>Bienvenido</h1>
        <p>Cargando...</p>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Loading;
