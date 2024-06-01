import React from "react";
import './Panel.css';

const AdminPanel = ({ adminName }) => {
    return (
        <div className="admin-panel">
            <div className="admin-info">
                <div className="admin-name">{adminName || "Admin"}</div>
            </div>
            <h1>Panel de Administración</h1>
            {/* Agrega aquí el contenido específico del panel de administración */}
        </div>
    );
};

export default AdminPanel;
