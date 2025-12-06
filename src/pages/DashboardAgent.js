import React, { useEffect, useState } from "react";
import TicketList from "../components/TicketList";
import { apiFetch } from "../api/client";

export default function DashboardAgent() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    apiFetch("/tickets/reports/summary")
      .then(setReport)
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1>Painel do Atendente</h1>
      {report && (
        <div style={{ marginBottom: 20 }}>
          <h3>Resumo</h3>
          <div>
            <strong>Por status:</strong>
            <ul>
              {report.byStatus.map((s) => (
                <li key={s.status}>
                  {s.status}: {s.count}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Tempo médio de resolução (minutos):</strong>
            <ul>
              {report.avgResolution.map((r) => (
                <li key={r.priority}>
                  {r.priority}: {Math.round(r.avg_minutes)} min
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Tickets por atendente:</strong>
            <ul>
              {report.byAgent.map((a) => (
                <li key={a.id}>
                  {a.name}: {a.tickets}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <TicketList />
    </div>
  );
}
