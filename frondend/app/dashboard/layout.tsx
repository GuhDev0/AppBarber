'use client'

import { useEffect, useState } from "react";
import Header from "../components/header/page";
import NavBar from "../components/siderBar/page";

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
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* NavBar recebe userData */}
      <NavBar  />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header recebe userData */}
        <Header userData={userData || undefined} />

        <main style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
