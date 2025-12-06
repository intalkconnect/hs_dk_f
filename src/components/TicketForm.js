import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function TicketForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("media");
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch("/tickets/meta/categories")
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const ticket = await apiFetch("/tickets", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          priority,
          category_id: categoryId || null
        })
      });

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f));
        await fetch(`/api/tickets/${ticket.id}/attachments`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: formData
        });
      }

      setTitle("");
      setDescription("");
      setPriority("media");
      setFiles([]);
      setCategoryId("");
      onCreated && onCreated(ticket);
      alert("Ticket criado com sucesso!");
    } catch (err) {
      alert(err.error || "Erro ao criar ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2>Novo ticket</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ex.: Problema para acessar o sistema"
          />
        </div>
        <div className="form-group">
          <label>Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Descreva o problema com o máximo de detalhes possível..."
          />
        </div>
        <div className="form-group">
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
        <div className="form-group">
          <label>Categoria</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">(sem categoria)</option>
            {categories.map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Anexos</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Abrir ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}
