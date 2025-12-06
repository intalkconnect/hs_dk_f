import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function TicketForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("media");
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    apiFetch("/tickets/meta/categories")
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      alert(err.error || "Erro ao criar ticket");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h2>Novo Ticket</h2>
      <div>
        <label>Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
        />
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
      <div>
        <label>Anexos</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
}
