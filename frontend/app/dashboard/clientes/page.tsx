"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css"

interface Cliente {
  id?: number;
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [formData, setFormData] = useState<Cliente>({
    nome: "",
    sobrenome: "",
    telefone: "",
    email: "",
  });

  // FUNÇÃO PARA BUSCAR CLIENTES
  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
      if (!token) {
        // No token available — user should log in
        console.warn("Token ausente ao buscar clientes. Redirecionando para login.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch("https://gestorappbarber.onrender.com/appBarber/listaDeClientes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Erro ao buscar clientes:", res.status, errorBody);
        alert(errorBody.mensagem || "Erro ao carregar clientes");
        return;
      }

      const data = await res.json();
      // Backend may return an array or an object; handle both shapes
      if (Array.isArray(data)) setClientes(data);
      else if (data.lista) setClientes(data.lista);
      else if (data.clientes) setClientes(data.clientes);
      else setClientes([]);
    } catch (err) {
      console.error("Erro ao carregar clientes");
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
      if (!token) {
        alert("Sua sessão expirou. Faça login novamente.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch("https://gestorappbarber.onrender.com/appBarber/cadastroDeCliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: formData.nome,
          Sobrenome: formData.sobrenome,
          email: formData.email,
          telefone: formData.telefone,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Erro ao registrar cliente:", res.status, err);
        alert(err.mensagem || "Erro ao registrar cliente");
        return;
      }

      // Only refresh and clear on success
      fetchClientes();
      setMostrarFormulario(false);

      setFormData({ nome: "", sobrenome: "", telefone: "", email: "" });
    } catch {
      alert("Erro ao registrar cliente");
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (!confirm("Deseja realmente excluir este cliente?")) return;

    try {
      const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
      if (!token) {
        alert("Sua sessão expirou. Faça login novamente.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch(`https://gestorappbarber.onrender.com/appBarber/deletarCliente/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.mensagem || "Erro ao excluir cliente");
        return;
      }

      fetchClientes();
    } catch {
      alert("Erro ao excluir cliente");
    }
  };

  return (
    <div className={styles.containerFinanceiro}>
      <div className={styles.containerFinanceiroHeader}>
        <h3 className={styles.titleFinanceiro}>Clientes</h3>
        <div className={styles.actionsFinanceiro}>
          <button onClick={() => setMostrarFormulario(true)}>
            Registrar Cliente
          </button>
        </div>
      </div>

      {mostrarFormulario && (
        <form className={styles.formFinanceiro} onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="sobrenome"
            placeholder="Sobrenome"
            value={formData.sobrenome}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="telefone"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className={styles.formBtnsFinanceiro}>
            <button type="submit" className={styles.primaryBtnFinanceiro}>
              Registrar
            </button>
            <button
              type="button"
              className={styles.secondaryBtnFinanceiro}
              onClick={() => setMostrarFormulario(false)}
            >
              Fechar
            </button>
          </div>
        </form>
      )}

      <table className={styles.tableFinanceiro}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Sobrenome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.sobrenome}</td>
                <td>{cliente.telefone}</td>
                <td>{cliente.email}</td>
                <td>
                  <button
                    className={styles.deleteBtnFinanceiro}
                    onClick={() => handleDelete(cliente.id)}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Nenhum cliente registrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
