"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./styles.module.css"

interface Empresa {
  id: number
  nomeDaEmpresa: string
}

interface ColaboradorDto {
  nomeCompleto: string
  dataNascimento: string
  email: string
  tel: string
  empresaId: number
  avatar?: string
}

const urlEmpresas = "https://gestorappbarber.onrender.com/appBarber/listaDeEmpresas"
const urlRegisterColaborador = "https://gestorappbarber.onrender.com/appBarber/saveColaborador"

export default function CadastroUsuario() {
  const router = useRouter()
  const [tipoCadastro, setTipoCadastro] = useState<"empresa" | "colaborador" | null>(null)
  const [empresas, setEmpresas] = useState<Empresa[]>([])

  const [formColaborador, setFormColaborador] = useState<ColaboradorDto>({
    nomeCompleto: "",
    dataNascimento: "",
    email: "",
    tel: "",
    empresaId: 0
  })

  useEffect(() => {
    if (tipoCadastro === "colaborador") {
      buscarEmpresas()
    }
  }, [tipoCadastro])

  const buscarEmpresas = async () => {
    try {
      const res = await fetch(urlEmpresas)
      const data = await res.json()
      setEmpresas(data.mensagem)
    } catch (err) {
      console.error("Erro ao carregar empresas:", err)
      alert("Erro ao carregar empresas.")
    }
  }

  const registrarColaborador = async () => {
    if (!formColaborador.empresaId) {
      alert("Selecione uma empresa válida.")
      return
    }

    try {
      const payload: ColaboradorDto = { ...formColaborador }

      const res = await fetch(urlRegisterColaborador, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Erro ao registrar colaborador")
        return
      }

      alert("Colaborador registrado com sucesso!")
      router.push("/login")
    } catch (err) {
      console.error(err)
      alert("Erro na conexão com o servidor.")
    }
  }

  if (tipoCadastro === "empresa") {
    router.push("/cadastroEmpresa")
    return null
  }

  if (!tipoCadastro) {
    return (
      <div className={styles.typeContainer}>
        <h2>Escolha o tipo de cadastro</h2>
        <div className={styles.btnGroup}>
          <button
            onClick={() => setTipoCadastro("empresa")}
            className={styles.primaryBtn}
          >
            Cadastrar nova empresa
          </button>

          <button
            onClick={() => setTipoCadastro("colaborador")}
            className={styles.primaryBtn}
          >
            Sou colaborador
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.registerContainer}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          registrarColaborador()
        }}
        className={styles.registerForm}
      >
        <div className={styles.header}>
          <div className={styles.containerImgLogo}>✂️</div>
          <h2 className={styles.title}>Cadastro de Colaborador</h2>
          <p>Preencha os dados para se registrar</p>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nome Completo</label>
          <input
            type="text"
            value={formColaborador.nomeCompleto}
            onChange={(e) =>
              setFormColaborador({ ...formColaborador, nomeCompleto: e.target.value })
            }
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Data de Nascimento</label>
          <input
            type="date"
            value={formColaborador.dataNascimento}
            onChange={(e) =>
              setFormColaborador({ ...formColaborador, dataNascimento: e.target.value })
            }
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={formColaborador.email}
            onChange={(e) =>
              setFormColaborador({ ...formColaborador, email: e.target.value })
            }
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Telefone</label>
          <input
            type="text"
            value={formColaborador.tel}
            onChange={(e) =>
              setFormColaborador({ ...formColaborador, tel: e.target.value })
            }
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Selecione a empresa</label>
          <select
            value={formColaborador.empresaId || ""}
            onChange={(e) =>
              setFormColaborador({ ...formColaborador, empresaId: Number(e.target.value) })
            }
            className={styles.selectField}
          >
            <option value="">Selecione...</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nomeDaEmpresa}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.btnRow}>
          <button type="submit" className={styles.primaryBtn}>
            Registrar Colaborador
          </button>
          <button type="button" onClick={() => router.push("/login")} className={styles.secondaryBtn}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  )
}
