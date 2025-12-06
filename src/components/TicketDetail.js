import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function TicketDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");
  const [agents, setAgents] = useState([]);
  const [canned, setCanned] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    apiFetch(`/tickets/${id}`)
      .then((d) => {
        setData(d);
        setStatus(d.ticket.status);
        setPriority(d.ticket.priority);
        setAssignedTo(d.ticket.assigned_to || "");
      })
      .catch((e) => console.error(e));

    if (user?.role !== "client") {
      apiFetch("/users/agents")
        .then(setAgents)
        .catch(() => {});
      apiFetch("/tickets/meta/canned-responses")
        .then(setCanned)
        .catch(() => {});
    }
  }, [id, user]);

  const refresh = () => {
    apiFetch(`/tickets/${id}`).then(setData);
  };

  const handleSendMessage = async (type) => {
    if (!message) return;
    try {
      await apiFetch(`/tickets/${id}/messages`, {
        method: "POST",
        body: JSON.stringify({ type, message })
      });
      setMessage("");
      refresh();
    } catch (err) {
      alert(err.error || "Erro ao enviar mensagem");
    }
  };

  const handleUpdateTicket = async () => {
    try {
      await apiFetch(`/tickets/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          assigned_to: assignedTo || null,
          priority
        })
      });
      refresh();
    } catch (err) {
      alert(err.error || "Erro ao atualizar ticket");
    }
  };

  const formatDateTime = (s) => {
    if (!s) return "-";
    return new Date(s).toLocaleString();
  };

  if (!data) return <p>Carregando...</p>;

  const { ticket, updates, attachments, slaStatus, sla } = data;

  return (
    <div>
      <h2>Ticket {ticket.id.slice(0, 8)}</h2>
      <p>
        <strong>Título:</strong> {ticket.title}
      </p>
      <p>
        <strong>Descrição:</strong> {ticket.description}
      </p>
      <p>
        <strong>Status:</strong> {ticket.status}
      </p>
      <p>
        <strong>Prioridade:</strong> {ticket.priority}
      </p>
      <p>
        <strong>Criado em:</strong> {formatDateTime(ticket.created_at)}
      </p>
      <p>
        <strong>Início atendimento:</strong> {formatDateTime(ticket.started_at)}
      </p>
      <p>
        <strong>Resolvido em:</strong> {formatDateTime(ticket.resolved_at)}
      </p>

      {sla && (
        <p>
          <strong>SLA:</strong> {sla.target_minutes} minutos ({sla.priority})
          {" - "}
          <strong>Status SLA:</strong> {slaStatus.status}
        </p>
      )}

      {attachments.length > 0 && (
        <div>
          <h3>Anexos</h3>
          <ul>
            {attachments.map((a) => (
              <li key={a.id}>
                <a href={`/uploads/${a.path}`} target="_blank" rel="noreferrer">
                  {a.filename_original}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {user?.role !== "client" && (
        <div style={{ borderTop: "1px solid #ccc", marginTop: 20, paddingTop: 10 }}>
          <h3>Administração</h3>
          <div>
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em andamento</option>
              <option value="aguardando_cliente">Aguardando cliente</option>
              <option value="resolvido">Resolvido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label>Prioridade</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
          <div>
            <label>Atribuído para</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">(não atribuído)</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleUpdateTicket}>Salvar alterações</button>
        </div>
      )}

      <div style={{ borderTop: "1px solid #ccc", marginTop: 20, paddingTop: 10 }}>
        <h3>Mensagens</h3>
        <ul>
          {updates.map((u) => (
            <li key={u.id}>
              <strong>{u.user_name}</strong> ({formatDateTime(u.created_at)}) -{" "}
              <em>{u.type}</em>
              {u.message && <div>{u.message}</div>}
              {u.from_status && u.to_status && (
                <div>
                  Status: {u.from_status} → {u.to_status}
                </div>
              )}
            </li>
          ))}
        </ul>
        <div>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva uma mensagem..."
          />
        </div>
        {user?.role !== "client" && canned.length > 0 && (
          <div>
            <label>Respostas rápidas: </label>
            <select
              onChange={(e) => {
                const id = e.target.value;
                const item = canned.find((c) => c.id === id);
                if (item) setMessage(item.content);
              }}
            >
              <option value="">Selecionar...</option>
              {canned.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <button onClick={() => handleSendMessage("message")}>Enviar</button>
        {user?.role !== "client" && (
          <button onClick={() => handleSendMessage("request_info")}>
            Solicitar mais informações
          </button>
        )}
      </div>
    </div>
  );
}
