"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./styles.module.css"

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

      alert(" Empresa registrada com sucesso!")
      setCreatedEmpresaId(data.id)
      setStepNumber(2)
    } catch (err) {
      console.error(err)
      alert("Erro de conexão ao registrar empresa")
    }
  }

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

  // Passo 1 — Cadastro da empresa
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
              value={empresaForm.cnpj}
              onChange={(e) => setEmpresaForm({ ...empresaForm, cnpj: e.target.value })}
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
              type="text"
              value={empresaForm.telefone}
              onChange={(e) => setEmpresaForm({ ...empresaForm, telefone: e.target.value })}
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

  // Passo 2 — Cadastro do dono
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
            value={ownerForm.telefone}
            onChange={(e) => setOwnerForm({ ...ownerForm, telefone: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>CPF</label>
          <input
            className={styles.input}
            type="text"
            value={ownerForm.cpf}
            onChange={(e) => setOwnerForm({ ...ownerForm, cpf: e.target.value })}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} type="submit">Registrar Dono</button>
        </div>
      </form>
    </div>
  )
}
