'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Scissors,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle,
  LayoutDashboard,
  LogOut
} from "lucide-react";

import style from "./styles.module.css";

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function NavBar() {
  const [userData, setUserData] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Pega o token de localStorage ou sessionStorage
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (!token) return;
    const dados = parseJwt(token);
    if (dados) setUserData(dados);
  }, []);

  return (
    <aside className={style.sidebar}>
      <div className={style.sidebarTop}>
        <div className={style.sidebarHeader}>
          <Scissors className={style.logoIcon} size={22} />
          <h2 className={style.sidebarTitle}>
            {userData?.nameEmpresa || "Barber Shop"}
          </h2>
        </div>

        <nav className={style.sidebarNav}>
          <h3 className={style.sidebarSection}>Menu</h3>
          <ul className={style.sidebarList}>
            <li>
              <Link
                href="/dashboard"
                className={`${style.navLink} ${pathname === "/dashboard" ? style.active : ""}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/controleDeServicos"
                className={`${style.navLink} ${pathname === "/dashboard/controleDeServicos" ? style.active : ""}`}
              >
                <Scissors size={18} />
                <span>Serviços</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/clientes"
                className={`${style.navLink} ${pathname === "/dashboard/clientes" ? style.active : ""}`}
              >
                <Users size={18} />
                <span>Clientes</span>
              </Link>
            </li>
           
            <li>
              <Link
                href="/dashboard/colaboradores"
                className={`${style.navLink} ${pathname === "/dashboard/colaboradores" ? style.active : ""}`}
              >
                <Users size={18} />
                <span>Funcionários</span>
              </Link>
            </li>
          </ul>

          <h3 className={style.sidebarSection}>Geral</h3>
          <ul className={style.sidebarList}>
            <li>
              <Link
                href="/dashboard/configuracaoDaBarbearia"
                className={`${style.navLink} ${pathname === "/dashboard/configuracaoDaBarbearia" ? style.active : ""}`}
              >
                <Settings size={18} />
                <span>Configurações</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className={style.sidebarFooter}>
        <li>
          <Link href="/login" className={`${style.navLink} ${style.logout}`}>
            <LogOut size={18} />
            <span>Sair</span>
          </Link>
        </li>
      </div>
    </aside>
  );
}
