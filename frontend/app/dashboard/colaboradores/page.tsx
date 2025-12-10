"use client";

import { useState, useEffect } from "react";
import { RxAvatar } from "react-icons/rx";
import { useRouter } from "next/navigation"
import { AiOutlineEdit } from "react-icons/ai";
import styles from "./AbaColaboradores.module.css";

interface Colaborador {
  id: number;
  nomeCompleto: string;
  dataNascimento: string;
  email: string;
  tel: string;
  totalServicos?: number;
  avatar?: string;
}

interface ColaboradorDto {
  nomeCompleto: string;
  dataNascimento: string;
  email: string;
  tel: string;
  avatar?: string;
  empresaId?: number;
}


export default function AbaColaboradores() {
  const router = useRouter()
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [userData, setUserData] = useState<any>({});
  const [formData, setFormData] = useState<ColaboradorDto>({
    nomeCompleto: "",
    dataNascimento: "",
    email: "",
    tel: "",
    avatar: "",
    empresaId: undefined,
  });

  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const dados = parseJwt(token);
    if (!dados || (dados.exp && Date.now() >= dados.exp * 1000)) {
      localStorage.removeItem("userToken");
      sessionStorage.removeItem("userToken");
      window.location.href = "/login";
      return;
    }

    setUserData(dados);
    fetchColaboradores(token);
  }, []);

  const fetchColaboradores = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:3001/appBarber/listColaboradores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      const lista = Array.isArray(data.list) ? data.list : [];
      const colaboradoresNormalizados = lista.map((c: any) => ({
        id: c.id,
        nomeCompleto: c.nomeCompleto || "",
        dataNascimento: c.dataNascimento || "",
        email: c.email || "",
        tel: c.tel || "",
        avatar: c.avatar || "",
        totalServicos: c.totalServicos || 0,
      }));

      setColaboradores(colaboradoresNormalizados);
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const pageColaborador = (id: number) => {
 router.push(`/dashboard/colaboradores/colaboradorAnalise/${id}`);
};

  const handleAbrirFormulario = () => setMostrarFormulario(!mostrarFormulario);

  const handleEditAvatar = (id: number) => {
    const novaUrl = prompt("Insira a URL do novo avatar:");
    if (!novaUrl) return;

    setColaboradores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, avatar: novaUrl } : c))
    );
  };

  const handleRegistrar = async () => {
    const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
    if (!token || !userData) return;

    if (!formData.nomeCompleto || !formData.dataNascimento || !formData.email || !formData.tel) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const dataNascimentoObj = new Date(formData.dataNascimento);
    if (isNaN(dataNascimentoObj.getTime())) {
      alert("Data de nascimento inválida!");
      return;
    }


    const payload: ColaboradorDto = {
      nomeCompleto: formData.nomeCompleto,
      dataNascimento: dataNascimentoObj.toISOString(),
      email: formData.email,
      tel: formData.tel,
      avatar: formData.avatar,
      empresaId: userData?.empresaId,
    };

    try {
      const response = await fetch("https://gestorappbarber.onrender.com/appBarber/saveColaborador", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Erro ao registrar colaborador:", data);
        alert(data.message || data.mensagem || "Erro ao registrar colaborador");
        return;
      }

      // backend may return { colaborador: {...} } or the object directly
      const saved: any = data.colaborador ?? data;

      const novoColaborador: Colaborador = {
        id: saved.id,
        nomeCompleto: saved.nomeCompleto,
        dataNascimento: saved.dataNascimento ?? payload.dataNascimento,
        email: saved.email,
        tel: saved.tel,
        avatar: saved.avatar,
        totalServicos: saved.totalServicos ?? 0,
      };

      setColaboradores((prev) => [...prev, novoColaborador]);

      setFormData({ nomeCompleto: "", dataNascimento: "", email: "", tel: "", avatar: "", empresaId: undefined });
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro no cadastro:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
    if (!token) return;

    try {
      const response = await fetch(`https://gestorappbarber.onrender.com/appBarber/deleteColaborador/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }

      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Erro ao deletar colaborador:", data);
        alert(data.mensagem || "Erro ao deletar colaborador");
        return;
      }

        setColaboradores((prev) => prev.filter((c) => c.id !== id));
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Colaboradores</h2>
          <button className={styles.addBtn} onClick={handleAbrirFormulario}>
            {mostrarFormulario ? "Fechar Formulário" : "Adicionar Colaborador"}
          </button>
        </div>

        {mostrarFormulario && (
          <form
            className={`${styles.form} ${styles.formCompact}`}
            onSubmit={(e) => {
              e.preventDefault();
              handleRegistrar();
            }}
          >
            <input
              type="text"
              name="nomeCompleto"
              placeholder="Nome Completo"
              value={formData.nomeCompleto}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="dataNascimento"
              placeholder="Data de Nascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="tel"
              placeholder="Telefone"
              value={formData.tel}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="avatar"
              placeholder="URL do Avatar (opcional)"
              value={formData.avatar}
              onChange={handleChange}
            />
            <div className={styles.formBtns}>
              <button type="submit" className={styles.primaryBtn}>
                Registrar
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setMostrarFormulario(false)}
              >
                Fechar
              </button>
            </div>
          </form>
        )}

        <div className={styles.cardsContainer}>
          {colaboradores.length === 0 && <p>Nenhum colaborador registrado.</p>}
          {colaboradores.map((c) => (
            <div key={c.id} className={styles.card}>
              <div className={styles.avatarContainer}>
                {c.avatar ? (
                  <img src={c.avatar} alt="Avatar" className={styles.avatar} />
                ) : (
                  <RxAvatar size={80} className={styles.avatarPlaceholder} />
                )}
              </div>

              <div className={styles.editAvatar}>
                <AiOutlineEdit size={20} onClick={() => handleEditAvatar(c.id)} />
              </div>

              <p><strong>Nome:</strong> {c.nomeCompleto}</p>
              <p><strong>Email:</strong> {c.email}</p>
              <p>
                <strong>Telefone:</strong>{" "}
                {c.tel
                  ? c.tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
                  : "Sem telefone"}
              </p>

              <button className={styles.deleteBtn} onClick={() => handleDelete(c.id)}>
                Deletar
              </button>
              <button className={styles.deleteBtn} onClick={() => pageColaborador(c.id)}>
                  Informações 
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }