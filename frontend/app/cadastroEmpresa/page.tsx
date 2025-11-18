"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./styles.module.css"
import InputMask from "react-input-mask"


interface Empresa {
  nomeDaEmpresa: string
  cnpj: string
  email: string
  telefone: string
  endereco: string
}

interface User {
  nomeCompleto: string
  email: string
  senha: string
  telefone: string
  cpf: string
  tipoDaConta: "ADMIN"
}



const urlRegisterEmpresa = "https://gestorappbarber.onrender.com/appBarber/createEmpresa"
const urlRegisterUsuario = "https://gestorappbarber.onrender.com/appBarber/registrarUsuario"

export default function CadastroEmpresa() {
  const router = useRouter()

  const [stepNumber, setStepNumber] = useState<1 | 2>(1)
  const [createdEmpresaId, setCreatedEmpresaId] = useState<number | null>(null)
 
  const [empresaForm, setEmpresaForm] = useState<Empresa>({
    nomeDaEmpresa: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: ""
  })

  const [ownerForm, setOwnerForm] = useState<User>({
    nomeCompleto: "",
    email: "",
    senha: "",
    telefone: "",
    cpf: "",
    tipoDaConta: "ADMIN"
  })

  // --------------------------------------------------
  // Passo 1 — Registrar empresa
  // --------------------------------------------------
  const registerCompany = async () => {
    try {
      const res = await fetch(urlRegisterEmpresa, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empresaForm)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Erro ao registrar empresa")
        return
      }

      alert("Empresa registrada com sucesso!")
      setCreatedEmpresaId(data.id)
      setStepNumber(2)
    } catch (err) {
      console.error(err)
      alert("Erro de conexão ao registrar empresa")
    }
  }

  // --------------------------------------------------
  // Passo 2 — Registrar dono
  // --------------------------------------------------
  const registerOwner = async () => {
    if (!createdEmpresaId) {
      alert("Erro: empresaId não encontrado.")
      return
    }

    try {
      const res = await fetch(urlRegisterUsuario, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ownerForm,
          empresaId: createdEmpresaId
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Erro ao registrar dono da barbearia")
        return
      }

      alert("Dono registrado com sucesso!")

      router.push("/login")
    } catch (err) {
      console.error(err)
      alert("Erro ao registrar o dono.")
    }
  }

  // ==================================================
  // UI — Passo 1: Cadastro da Empresa
  // ==================================================
  if (stepNumber === 1) {
    return (
      <div className={styles.container}>
        <div className={styles.containerImgLogo}>✂️</div>
        <h2 className={styles.title}>Cadastro da Empresa</h2>

        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); registerCompany() }}>

          <div className={styles.field}>
            <label className={styles.label}>Nome da Empresa</label>
            <input
              className={styles.input}
              type="text"
              value={empresaForm.nomeDaEmpresa}
              onChange={(e) => setEmpresaForm({ ...empresaForm, nomeDaEmpresa: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>CNPJ</label>


            <input
              className={styles.input}
              type="text"
              maxLength={18}
              value={empresaForm.cnpj
                .replace(/\D/g, "")
                .slice(0,14)                             
                .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, "$1.$2.$3/$4-$5")
              }
              onChange={(e) =>
                setEmpresaForm({
                  ...empresaForm,
                  cnpj: e.target.value.replace(/\D/g, "") // mantém só números no estado
                })
              }
            />

          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={empresaForm.email}
              onChange={(e) => setEmpresaForm({ ...empresaForm, email: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Telefone</label>
            <input
              className={styles.input}
              type="tel"
              value={empresaForm.telefone.
                replace(/\D/g, "")
                .replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3")}
              onChange={(e) => setEmpresaForm({ ...empresaForm, telefone: e.target.value.replace(/\D/g, "") })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Endereço</label>
            <input
              className={styles.input}
              type="text"
              value={empresaForm.endereco}
              onChange={(e) => setEmpresaForm({ ...empresaForm, endereco: e.target.value })}
            />
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryBtn} type="submit">Registrar Empresa</button>
          </div>
        </form>
      </div>
    )
  }

  // ==================================================
  // UI — Passo 2: Cadastro do Dono
  // ==================================================
  if (stepNumber === 2 && createdEmpresaId !== null) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Cadastro do Dono da Barbearia</h2>

        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); registerOwner() }}>

          <div className={styles.field}>
            <label className={styles.label}>Nome Completo</label>
            <input
              className={styles.input}
              type="text"
              value={ownerForm.nomeCompleto}
              onChange={(e) => setOwnerForm({ ...ownerForm, nomeCompleto: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={ownerForm.email}
              onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input
              className={styles.input}
              type="password"
              value={ownerForm.senha}
              onChange={(e) => setOwnerForm({ ...ownerForm, senha: e.target.value })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Telefone</label>
            <input
              className={styles.input}
              type="text"
              value={ownerForm.telefone.replace(/\D/g, "")
                .replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3")}
              onChange={(e) => setOwnerForm({ ...ownerForm, telefone: e.target.value.replace(/\D/g, "") })}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>CPF</label>
            <input
              className={styles.input}
              type="text"
              maxLength={12}
              value={ownerForm.cpf.replace(/\D/g, "")
                .slice(0,11)
                .replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4")}
              onChange={(e) => setOwnerForm({ ...ownerForm, cpf: e.target.value.replace(/\D/g, "") })}
            />
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryBtn} type="submit">Registrar Dono</button>
          </div>
        </form>
      </div>
    )
  }



}
