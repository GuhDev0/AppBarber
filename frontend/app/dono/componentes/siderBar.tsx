'use client';

import style from "../styles/SiderBar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Scissors, 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  LogOut, 
  Calendar, 
  Settings,
  Bell
} from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dono') {
      return pathname === '/dono';
    }
    return pathname?.startsWith(path);
  };

  return (
    <aside className={style.sidebar}>
      
      {/* TOPO */}
      <div className={style.sidebarTop}>
        <div className={style.sidebarHeader}>
          <Scissors className={style.logoIcon} size={22} />
          <h2 className={style.sidebarTitle}>Barber Shop</h2>
        </div>

        {/* NAVEGAÇÃO */}
        <nav className={style.sidebarNav}>
          
          {/* MENU */}
          <h3 className={style.sidebarSection}>Menu</h3>
          <ul className={style.sidebarList}>
            
            <li>
              <Link 
                href="/dono" 
                className={`${style.navLink} ${isActive('/dono') && pathname === '/dono' ? style.active : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link 
                href="/dono/agendamentos" 
                className={`${style.navLink} ${isActive('/dono/agendamentos') ? style.active : ''}`}
              >
                <Calendar size={18} />
                <span>Agendamentos</span>
              </Link>
            </li>

            <li>
              <Link 
                href="/dono/controleDeServicos" 
                className={`${style.navLink} ${isActive('/dono/controleDeServicos') ? style.active : ''}`}
              >
                <BarChart3 size={18} />
                <span>Serviços</span>
              </Link>
            </li>

            <li>
              <Link 
                href="/dono/clientes" 
                className={`${style.navLink} ${isActive('/dono/clientes') ? style.active : ''}`}
              >
                <Users size={18} />
                <span>Clientes</span>
              </Link>
            </li>

            <li>
              <Link 
                href="/dono/colaboradores" 
                className={`${style.navLink} ${isActive('/dono/colaboradores') ? style.active : ''}`}
              >
                <Users size={18} />
                <span>Colaboradores</span>
              </Link>
            </li>

          </ul>

          {/* GERAL */}
          <h3 className={style.sidebarSection}>Geral</h3>
          <ul className={style.sidebarList}>
            <li>
              <Link 
                href="/dono/lembretes" 
                className={`${style.navLink} ${isActive('/dono/lembretes') ? style.active : ''}`}
              >
                <Bell size={18} />
                <span>Lembretes</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/dono/configuracaoDaBarbearia" 
                className={`${style.navLink} ${isActive('/dono/configuracaoDaBarbearia') ? style.active : ''}`}
              >
                <Settings size={18} />
                <span>Configurações</span>
              </Link>
            </li>
          </ul>

        </nav>
      </div>

      {/* RODAPÉ */}
      <div className={style.sidebarFooter}>
        <ul className={style.sidebarList}>
          <li>
            <Link href="/login" className={`${style.navLink} ${style.logout}`}>
              <LogOut size={18} />
              <span>Sair</span>
            </Link>
          </li>
        </ul>
      </div>

    </aside>
  );
}
