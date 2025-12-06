import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#222",
          color: "#fff"
        }}
      >
        <div>
          <strong>Helpdesk</strong>{" "}
          {user && <span style={{ marginLeft: 10 }}>({user.role})</span>}
        </div>
        <nav>
          {user?.role === "client" && <Link to="/client">Meus tickets</Link>}
          {(user?.role === "agent" || user?.role === "admin") && (
            <Link to="/agent" style={{ marginRight: 10 }}>
              Painel
            </Link>
          )}
          <button
            onClick={logout}
            style={{ marginLeft: 10 }}
          >
            Sair
          </button>
        </nav>
      </header>
      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
}
