import React, { useState } from "react";
import './LoginSignup.css'

import email_icon from '../../assets/email.png'
import password_icon from '../../assets/password.png'

const LoginSignup = () => {

    const [action, setAction] = useState("Login");

    return (
        <div className="container">
            <div className="header">
                <div className="text">Inventario</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email" />
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Contraseña" />
                </div>
            </div>

            <div className="submit-container">
                <div className={action === "Login" ? "submit large" : "submit"} onClick={() => setAction("Login")}>Ingresar</div>
            </div>
        </div>
    )
}

export default LoginSignup
