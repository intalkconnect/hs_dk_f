import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client"
  });

  const load = () => {
    setLoading(true);
    apiFetch("/users")
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setForm({ name: "", email: "", password: "", role: "client" });
      load();
      alert("Usuário criado!");
    } catch (err) {
      alert(err.error || "Erro ao criar usuário");
    }
  };

  return (
    <>
      <div className="card">
        <h2>Novo usuário</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Nome</label>
            <input value={form.name} onChange={handleChange("name")} required />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={form.password}
              onChange={handleChange("password")}
              required
            />
          </div>
          <div className="form-group">
            <label>Papel</label>
            <select value={form.role} onChange={handleChange("role")}>
              <option value="client">Cliente</option>
              <option value="agent">Atendente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              Criar usuário
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Usuários da empresa</h2>
        {loading && <div className="loading">Carregando...</div>}
        {!loading && users.length === 0 && (
          <div className="empty">Nenhum usuário cadastrado.</div>
        )}
        {!loading && users.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Papel</th>
                <th>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {u.created_at
                      ? new Date(u.created_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
