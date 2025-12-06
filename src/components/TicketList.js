import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    apiFetch("/tickets")
      .then(setTickets)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDuration = (t) => {
    if (!t.started_at || !t.resolved_at) return "-";
    const start = new Date(t.started_at);
    const end = new Date(t.resolved_at);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / 1000 / 60 / 60);
    const diffMinutes = Math.floor((diffMs / 1000 / 60) % 60);
    return `${diffHours}h ${diffMinutes}m`;
  };

  const filtered = tickets.filter((t) => {
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    return true;
  });

  const renderStatusBadge = (status) => (
    <span className={`badge badge-status-${status}`}>{status}</span>
  );

  const renderPriorityBadge = (p) => (
    <span className={`badge badge-priority-${p}`}>{p}</span>
  );

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Tickets</h2>
      </div>

      <div className="filters-row">
        <div>
          <span className="text-muted" style={{ fontSize: 12 }}>
            Filtros
          </span>
        </div>
        <select
          className="input-inline"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Status: todos</option>
          <option value="aberto">Aberto</option>
          <option value="em_andamento">Em andamento</option>
          <option value="aguardando_cliente">Aguardando cliente</option>
          <option value="resolvido">Resolvido</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <select
          className="input-inline"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">Prioridade: todas</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
          <option value="critica">Crítica</option>
        </select>
      </div>

      {loading && <div className="loading">Carregando tickets...</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty">Nenhum ticket encontrado.</div>
      )}

      {!loading && filtered.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Status</th>
              <th>Prioridade</th>
              {user?.role !== "client" && <th>Criado por</th>}
              <th>Tempo resolução</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>
                  <Link to={`/tickets/${t.id}`}>{t.id.slice(0, 8)}</Link>
                </td>
                <td>{t.title}</td>
                <td>{renderStatusBadge(t.status)}</td>
                <td>{renderPriorityBadge(t.priority)}</td>
                {user?.role !== "client" && <td>{t.created_by}</td>}
                <td>{formatDuration(t)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
