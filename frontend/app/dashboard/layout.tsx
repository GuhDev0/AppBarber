'use client'

import { useEffect, useState } from "react";
import Header from "../components/header/page";
import NavBar from "../components/siderBar/page";
import Carregamento from "../components/carragamento/page";

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const payload = parseJwt(token);
      if (!payload || (payload.exp && Date.now() >= payload.exp * 1000)) {
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userToken');
        window.location.href = '/login';
        return;
      }

      setUserData(payload);
      setLoading(false);
    };

    // Checa imediatamente ao montar
    checkToken();

    // Checa a cada 30 segundos
    const interval = setInterval(checkToken, 30000);

    // Listener para mudanças no storage (outras abas/janelas)
    const handleStorageChange = () => checkToken();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) return <Carregamento />;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <NavBar />
      <div className="mainContainer">
        <Header userData={userData || undefined} />
        <main style={{ flex: 1, padding: '20px', backgroundColor: '#13161bff' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
