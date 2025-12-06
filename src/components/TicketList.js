import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    apiFetch("/tickets")
      .then(setTickets)
      .catch((err) => console.error(err));
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

  return (
    <div>
      <h2>Tickets</h2>
      <table border="1" cellPadding="4">
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
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>
                <Link to={`/tickets/${t.id}`}>{t.id.slice(0, 8)}</Link>
              </td>
              <td>{t.title}</td>
              <td>{t.status}</td>
              <td>{t.priority}</td>
              {user?.role !== "client" && <td>{t.created_by}</td>}
              <td>{formatDuration(t)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
