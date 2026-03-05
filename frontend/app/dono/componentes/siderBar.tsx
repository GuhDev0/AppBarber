import style from "../styles/SiderBar.module.css";
import Link from "next/link";
import { Scissors, LayoutDashboard, BarChart3, Users, LogOut } from "lucide-react";

export default function NavBar() {
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
              <Link href="/dono" className={style.navLink}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link href="/dono/controleDeServicos" className={style.navLink}>
                <BarChart3 size={18} />
                <span>Serviços</span>
              </Link>
            </li>

            <li>
              <Link href="/dono/clientes" className={style.navLink}>
                <Users size={18} />
                <span>Clientes</span>
              </Link>
            </li>
            <li>
              <Link href="/dono/colaboradores" className={style.navLink}>
                <Users size={18} />
                <span>Colaboradores</span>
              </Link>
            </li>

          </ul>

          {/* GERAL */}
          <h3 className={style.sidebarSection}>Geral</h3>
          <ul className={style.sidebarList}>
            <li>
              <Link href="/dashboard/configuracoes" className={style.navLink}>
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
