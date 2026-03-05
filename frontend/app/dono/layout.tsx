
import NavBar from "./componentes/siderBar";
import Header from "@/app/components/header/header";
import styles from "./styles/AnaliseBarbeariaStyles.module.css";
import { cookies } from "next/headers";
import { api } from "@/app/lib/api";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  nomeCompleto: string;
  email: string;
};

export default async function LayoutDashboard({ children }: { children: React.ReactNode }) {

  const cookieStore = await cookies();
  const token = cookieStore.get("userToken")?.value;

  if (!token) {
    return <div>Não autenticado</div>;
  }

  const decoded = jwtDecode<TokenPayload>(token);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <NavBar />
      <div className="mainContainer">
        <Header userData={decoded} />
        <main
          className={styles.main}
          style={{ flex: 1, padding: "20px", backgroundColor: "#13161bff" }}
        >
          {children}

        </main>
      </div>
    </div>
  );
}
