'use client';

import styles from "./styles.module.css";
import { Bell, BellOff, Calendar, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ThemeToggleSimple } from "@/app/components/ThemeToggle/ThemeToggle";
import ThemeToggle from "@/app/components/ThemeToggle/ThemeToggle";

type HeaderProps = {
  userData?: { nomeCompleto?: string; name?: string; email?: string };
};

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'success' | 'warning' | 'error' | 'agendamento';
  lida: boolean;
  created_at: string;
  link?: string;
}

export default function Header({ userData }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev => 
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  };

  const formatarTempo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    return `${days}d atrás`;
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'warning':
      case 'error':
        return <AlertCircle size={18} />;
      case 'agendamento':
        return <Calendar size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  const displayName = userData?.nomeCompleto || userData?.name || "Usuário";

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1>Bem-vindo de volta, <span>{displayName}</span>!</h1>
      </div>

      <div className={styles.right}>
        <ThemeToggle />
        <ThemeToggleSimple />
        
        <div className={styles.notificationBadge} ref={dropdownRef}>
          <button 
            className={styles.iconBtn} 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label={`Notificações ${naoLidas > 0 ? `(${naoLidas} não lidas)` : ''}`}
          >
            {naoLidas > 0 ? <Bell /> : <BellOff />}
          </button>
          
          {naoLidas > 0 && (
            <span className={styles.badge}>{naoLidas > 9 ? '9+' : naoLidas}</span>
          )}

          {notificationsOpen && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <h3>Notificações</h3>
                {naoLidas > 0 && (
                  <button 
                    className={styles.markAllRead}
                    onClick={marcarTodasComoLidas}
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>

              <div className={styles.notificationList}>
                {notificacoes.length === 0 ? (
                  <div className={styles.emptyNotifications}>
                    <Bell size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <p>Nenhuma notificação</p>
                  </div>
                ) : (
                  notificacoes.map(notif => (
                    <div 
                      key={notif.id}
                      className={`${styles.notificationItem} ${!notif.lida ? styles.unread : ''}`}
                      onClick={() => marcarComoLida(notif.id)}
                    >
                      <div className={`${styles.notificationIcon} ${styles[notif.tipo]}`}>
                        {getNotificationIcon(notif.tipo)}
                      </div>
                      <div className={styles.notificationContent}>
                        <p className={styles.notificationTitle}>{notif.titulo}</p>
                        <p className={styles.notificationMessage}>{notif.mensagem}</p>
                        <span className={styles.notificationTime}>
                          {formatarTempo(notif.created_at)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.userInfo}>
          <p className={styles.userName}>{displayName}</p>
          <p className={styles.userEmail}>{userData?.email || "email@exemplo.com"}</p>
        </div>
      </div>
    </header>
  );
}
