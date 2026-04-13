import NavBar from "./componentes/siderBar";
import Header from "@/app/components/header/header";
import styles from "./styles/AnaliseBarbeariaStyles.module.css";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

type TokenPayload = {
  nomeCompleto: string;
  email: string;
  exp?: number;
};

export default async function LayoutDashboard({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("userToken")?.value;

  // Validação de autenticação
  if (!token) {
    redirect('/login');
  }

  let decoded: TokenPayload;
  
  try {
    decoded = jwtDecode<TokenPayload>(token);
    
    // Verificar se o token expirou
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      redirect('/login');
    }
  } catch {
    // Token inválido
    redirect('/login');
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <NavBar />
      <div className="mainContainer">
        <Header userData={decoded} />
        <main
          className={styles.main}
          style={{ 
            flex: 1, 
            padding: "20px", 
            backgroundColor: "var(--bg-primary)",
            transition: "background-color 0.25s ease"
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
