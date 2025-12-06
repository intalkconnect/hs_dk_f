import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function AdminSettingsPage() {
  const [categories, setCategories] = useState([]);
  const [slas, setSlas] = useState([]);
  const [canned, setCanned] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [sla, setSla] = useState({ priority: "media", target_minutes: 120 });
  const [cannedForm, setCannedForm] = useState({ title: "", content: "" });

  const loadAll = () => {
    apiFetch("/tickets/meta/categories").then(setCategories).catch(() => {});
    apiFetch("/tickets/meta/slas").then(setSlas).catch(() => {});
    apiFetch("/tickets/meta/canned-responses").then(setCanned).catch(() => {});
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/tickets/meta/categories", {
        method: "POST",
        body: JSON.stringify({ name: categoryName })
      });
      setCategoryName("");
      loadAll();
    } catch (err) {
      alert(err.error || "Erro ao criar categoria");
    }
  };

  const handleCreateSla = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/tickets/meta/slas", {
        method: "POST",
        body: JSON.stringify({
          priority: sla.priority,
          target_minutes: Number(sla.target_minutes)
        })
      });
      setSla({ priority: "media", target_minutes: 120 });
      loadAll();
    } catch (err) {
      alert(err.error || "Erro ao criar SLA");
    }
  };

  const handleCreateCanned = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/tickets/meta/canned-responses", {
        method: "POST",
        body: JSON.stringify(cannedForm)
      });
      setCannedForm({ title: "", content: "" });
      loadAll();
    } catch (err) {
      alert(err.error || "Erro ao criar resposta rápida");
    }
  };

  return (
    <>
      <div className="card">
        <h2>Categorias</h2>
        <form onSubmit={handleCreateCategory} className="form-grid">
          <div className="form-group">
            <label>Nome da categoria</label>
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              Adicionar categoria
            </button>
          </div>
        </form>
        <div className="chip-row">
          {categories.map((c) => (
            <span key={c.id} className="pill">
              {c.name}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>SLAs por prioridade</h2>
        <form onSubmit={handleCreateSla} className="form-grid">
          <div className="form-group">
            <label>Prioridade</label>
            <select
              value={sla.priority}
              onChange={(e) =>
                setSla((s) => ({ ...s, priority: e.target.value }))
              }
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tempo alvo (minutos)</label>
            <input
              type="number"
              min={1}
              value={sla.target_minutes}
              onChange={(e) =>
                setSla((s) => ({ ...s, target_minutes: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              Definir SLA
            </button>
          </div>
        </form>

        {slas.length > 0 && (
          <ul>
            {slas.map((s) => (
              <li key={s.id}>
                {s.priority}: {s.target_minutes} min
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <h2>Respostas rápidas</h2>
        <form onSubmit={handleCreateCanned} className="form-grid">
          <div className="form-group">
            <label>Título</label>
            <input
              value={cannedForm.title}
              onChange={(e) =>
                setCannedForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Conteúdo</label>
            <textarea
              rows={3}
              value={cannedForm.content}
              onChange={(e) =>
                setCannedForm((f) => ({ ...f, content: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              Salvar resposta rápida
            </button>
          </div>
        </form>

        {canned.length > 0 && (
          <ul>
            {canned.map((c) => (
              <li key={c.id}>
                <strong>{c.title}:</strong> {c.content.slice(0, 80)}
                {c.content.length > 80 ? "..." : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
