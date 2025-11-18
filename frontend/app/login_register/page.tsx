"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./styles.module.css"

interface Empresa {
  id: number
  nomeDaEmpresa: string
  cnpj: string
}

interface ColaboradorDto {
  nomeCompleto: string
  dataNascimento: string
  email: string
  tel: string
  empresaId: number
  avatar?: string
}
const urlEmpresaPorCNPJ = "http://localhost:3000/appBarber/verificaEmpresaCnpj"
const urlBuscarEmpresa = "https://gestorappbarber.onrender.com/appBarber/buscarEmpresaPorCNPJ"
const urlRegisterColaborador = "https://gestorappbarber.onrender.com/appBarber/saveColaborador"

export default function CadastroUsuario() {
  const router = useRouter()
  const [tipoCadastro, setTipoCadastro] = useState<"empresa" | "colaborador" | null>(null)
  const [step, setStep] = useState(1)
  const [cnpj, setCnpj] = useState("")
  const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null)

  const [formColaborador, setFormColaborador] = useState<ColaboradorDto>({
    nomeCompleto: "",
    dataNascimento: "",
    email: "",
    tel: "",
    empresaId: 0
  })

  // Função para validar se a empresa existe pelo CNPJ
  const validarEmpresa = async () => {
    try {
      const res = await fetch(`${urlEmpresaPorCNPJ}?cnpj=${encodeURIComponent(cnpj)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      const data = await res.json()

      if (!res.ok) {
        alert(data.mensagem || "Erro ao validar empresa")
        return
      }
      setEmpresaSelecionada(data.empresa)
       setStep(2)
    }catch (err) {
      console.error(err)
      alert("Erro na conexão com o servidor.")
      return
    }

    
  }

  const registrarColaborador = async () => {
  if (!empresaSelecionada) {
    alert("Selecione uma empresa antes de registrar o colaborador.");
    return;
  }

  try {
    const payload: ColaboradorDto = { 
      ...formColaborador, 
      empresaId: empresaSelecionada.id 
    };

    const res = await fetch(urlRegisterColaborador, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || data.mensagem || "Erro ao registrar colaborador");
      return;
    }

    alert("Colaborador registrado com sucesso!");
    router.push("/login");
  } catch (err) {
    console.error(err);
    alert("Erro na conexão com o servidor.");
  }
};


  // Redirecionar para cadastro de empresa
  if (tipoCadastro === "empresa") {
    router.push("/cadastroEmpresa")
    return null
  }

  // Escolha do tipo de cadastro
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
      {step === 1 && (
        <div className={styles.registerForm}>
          <div className={styles.header}>
            <div className={styles.containerImgLogo}>✂️</div>
            <h2 className={styles.title}>Informe o CNPJ da empresa</h2>
            <p>Vamos verificar se a empresa existe antes de prosseguir</p>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>CNPJ</label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className={styles.inputField}
              placeholder="Digite o CNPJ da empresa"
            />
          </div>

          <div className={styles.btnRow}>
            <button onClick={validarEmpresa} className={styles.primaryBtn}>
              Próximo
            </button>
            <button onClick={() => router.push("/login")} className={styles.secondaryBtn}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {step === 2 && empresaSelecionada && (
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
            <p>Empresa selecionada: {empresaSelecionada.nomeDaEmpresa}</p>
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
              required
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
              required
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
              required
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
              required
            />
          </div>

          <div className={styles.btnRow}>
            <button type="button" onClick={() => setStep(1)} className={styles.secondaryBtn}>
              Voltar
            </button>
            <button type="submit" className={styles.primaryBtn}>
              Finalizar Cadastro
            </button>
            <button type="button" onClick={() => router.push("/login")} className={styles.secondaryBtn}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
