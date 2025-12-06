import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-title">
          Helpdesk
          {user && (
            <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.8 }}>
              ({user.role})
            </span>
          )}
        </div>
        <nav className="app-nav">
          {user?.role === "client" && <Link to="/client">Meus tickets</Link>}

          {(user?.role === "agent" || user?.role === "admin") && (
            <>
              <Link to="/agent">Painel</Link>
              {user?.role === "admin" && (
                <>
                  {" | "}
                  <Link to="/admin/users">Usuários</Link>{" | "}
                  <Link to="/admin/settings">Configurações</Link>
                </>
              )}
            </>
          )}
          {user && (
            <button className="btn btn-ghost" onClick={logout}>
              Sair
            </button>
          )}
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
