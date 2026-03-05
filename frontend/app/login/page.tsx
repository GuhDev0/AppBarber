'use client'

import { useState } from "react";
import styles from "./styles.module.css";
import{ api }from "../lib/api";
import Login_Register from "../login_register/page";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await api.post("/login", 
      {
      loginEmail: email,
      loginSenha: password,
    });

    const usuario = response.data.usuario;

    console.log(response.data)
    
    if (usuario?.tipoDaConta === "ADMIN") {
      router.push("/dono");
    } else {
      router.push("/colaborador/dashboard");
    }

  } catch (error: any) {
    console.error("Erro no login:", error.message);

    if (error.response?.status === 401) {
      alert("Credenciais inválidas.");
    } else {
      alert("Erro ao conectar com o servidor.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    
      <div className={styles.loginContainer}>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.containerImgLogo}>✂️</div>
          <h2 className={styles.title}>Gestor<strong>PRO</strong></h2>
          <p>Sistema de Gestão Profissional</p>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.optionsRow}>
            <label className={styles.remember}>
              <input type="checkbox" checked={lembrar} onChange={e => setLembrar(e.target.checked)} />
              Relembrar senha
            </label>
            <a href="/recuperar-senha" className={styles.forgotPassword}>
              Esqueceu a senha?
            </a>
          </div>
          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <p>
            Não tem uma conta? <Link href={"/login_register"}>Registre aqui !</Link>

          </p>

        </form>
      </div>
    
  );
}
