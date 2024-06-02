import React, { useState } from "react";
import './LoginSignup.css'
import { useNavigate } from "react-router-dom";


import email_icon from '../../assets/email.png'
import password_icon from '../../assets/password.png'

const LoginSignup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const adminUser = {
        email: "admin@example.com",
        password: "admin123"
    };

    const handleLogin = () => {
        if (email === adminUser.email && password === adminUser.password) {
            navigate("/panel");
        } else {
            setError("Correo o contraseña incorrectos");
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
            <div className="submit-container">
                <div className="submit" onClick={handleLogin}>
                    Ingresar
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;