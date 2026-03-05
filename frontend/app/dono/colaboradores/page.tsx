"use client";

import { useState, useEffect } from "react";
import { RxAvatar } from "react-icons/rx";
import { useRouter } from "next/navigation"
import { AiOutlineEdit } from "react-icons/ai";
import styles from "./AbaColaboradores.module.css";
import { api } from "@/app/lib/api";

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

  

  const fetchColaboradores = async () => {
    try{
      const response = await api.get('/colaborador/listaDeColaboradores')
      console.log(response.data)
      setColaboradores(response.data)
    }catch(error:any){
      console.log("Error ao buscar lista de colaborador" , error.message)
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
     try {
       const response = await api.post<Colaborador>(
         "/colaborador/registrarColaborador",
         formData
       );
       
       const novoColaborador = response.data;
       console.log(novoColaborador)
       
      setColaboradores((prev) => [novoColaborador, ...prev]); 
       await fetchColaboradores();}
       catch(error:any){
        alert("Desculpa mas não foi possivel registra colaborador")
        console.log("error Ao Registra Colaborador", error.message)
       }
  };

  const handleDelete = async (id:number) => {
    try{
      await api.delete(`/colaborador/deleteColaborador/${id}`);
      await fetchColaboradores()
    }
       catch (error) {
        console.error(error);
      }
    };
     useEffect(() => {
      fetchColaboradores()
     }, []);

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

              <p><strong>Nome:</strong> {c?.nomeCompleto}</p>
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