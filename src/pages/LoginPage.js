import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { setUserAndToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fromRegister =
    location.state && location.state.from === "register-company";

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setUserAndToken(data.user, data.token);

      if (data.user.role === "client") {
        navigate("/client");
      } else {
        navigate("/agent");
      }
    } catch (err) {
      setError(err.error || "Erro ao entrar. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* LADO ESQUERDO: LOGIN */}
        <div className="auth-card-main">
          <div className="auth-card-main-header">
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#9ca3af",
                marginBottom: 10
              }}
            >
              Helpdesk • Portal
            </div>
            <div className="auth-card-main-title">Entrar na sua conta</div>
            <div className="auth-card-main-subtitle">
              Acompanhe seus tickets, responda clientes e mantenha o atendimento
              organizado em um só lugar.
            </div>
          </div>

          {fromRegister && (
            <div
              style={{
                marginBottom: 12,
                padding: "0.5rem 0.7rem",
                borderRadius: 10,
                border: "1px solid rgba(34,197,94,0.4)",
                background: "rgba(22,163,74,0.08)",
                fontSize: 12,
                color: "#bbf7d0"
              }}
            >
              Empresa criada com sucesso. Faça login com o usuário administrador
              que você acabou de cadastrar.
            </div>
          )}

          {error && (
            <div
              style={{
                marginBottom: 12,
                padding: "0.5rem 0.7rem",
                borderRadius: 10,
                border: "1px solid rgba(248,113,113,0.5)",
                background: "rgba(127,29,29,0.4)",
                fontSize: 12,
                color: "#fee2e2"
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="voce@empresa.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 4
              }}
            >
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                Ambiente seguro. Seus dados são protegidos.
              </span>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ paddingInline: 10, fontSize: 11 }}
              >
                Esqueci a senha
              </button>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>

          <div
            style={{
              marginTop: 18,
              fontSize: 12,
              color: "#9ca3af",
              display: "flex",
              gap: 6
            }}
          >
            <span>Primeiro acesso?</span>
            <Link
              to="/register-company"
              style={{ color: "#c4b5fd", fontWeight: 500 }}
            >
              Criar conta para minha empresa
            </Link>
          </div>
        </div>

        {/* LADO DIREITO: COPY / VALOR */}
        <div className="auth-card-side">
          <div className="auth-chip">Painel de atendimento</div>
          <div className="auth-side-title">
            Menos caos no WhatsApp, mais controle no suporte.
          </div>
          <div className="auth-side-text">
            Centralize demandas, acompanhe SLA, histórico de tickets e
            desempenho da sua equipe em um sistema pensado para times enxutos.
          </div>

          <div style={{ marginTop: 26, fontSize: 11, color: "#9ca3af" }}>
            • Abertura de tickets por clientes{" "}
            <br />
            • Fila única e atribuição para atendentes
            <br />
            • Linha do tempo completa de cada atendimento
            <br />
            • Notificações por e-mail a cada atualização
          </div>
        </div>
      </div>
    </div>
  );
}
