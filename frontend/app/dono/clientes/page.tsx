"use client";

import { useEffect, useState } from "react";
import styles from "../styles/ClientesStyle.module.css"
import { api } from "@/app/lib/api";
import Carregamento from "@/app/components/carragamento/carregamento";
interface Cliente {
  id?: number;
  nome: string;
  Sobrenome: string;
  telefone: string;
  email: string;
}

export default function Clientes() {
  const [listaDeClientes, setlistaDeClientes] = useState<Cliente[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [formData, setFormData] = useState<Cliente>({
    nome: "",
    Sobrenome: "",
    telefone: "",
    email: "",
  });

 

  // FUNÇÃO PARA BUSCAR CLIENTES
 const buscarListaDeClientes = async () =>{
   
   try{
   const response = await api.get('/cliente/listaDeClientes')
    setlistaDeClientes(response.data)
   }catch(error:any){
     console.log(error.message)
   }
 }

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try{
    alert("Deseja Realmente deletar Esse cliente da lista ?")     
        const response = await api.post<Cliente>(
            "/cliente/registraCliente",
            formData
        )

       const novoCliente = response.data
       
        setlistaDeClientes((prev) => [novoCliente, ...prev]);

      setFormData({ nome: "", Sobrenome: "", telefone: "", email: "" });
      await buscarListaDeClientes()
    } catch {
      alert("Erro ao registrar cliente");
    }
  };

  const deleteCliente = async (id: number) => {
  try {
    await api.delete(`/cliente/deleteCliente/${id}`);
    await buscarListaDeClientes()
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
};

  useEffect(() => {
   buscarListaDeClientes()
  }, []);   
  

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
            name="Sobrenome"
            placeholder="Sobrenome"
            value={formData.Sobrenome}
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
          {listaDeClientes.length > 0 ? (
            listaDeClientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.Sobrenome}</td>
                <td>{cliente.telefone}</td>
                <td>{cliente.email}</td>
                <td>
                  <button
                    className={styles.deleteBtnFinanceiro}
                    onClick={() => deleteCliente(Number(cliente.id))}
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
