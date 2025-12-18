'use client'

import styles from "./styles.module.css";
import { IoSearchSharp } from "react-icons/io5";
import { IoMdNotifications, IoMdNotificationsOff } from "react-icons/io";
import NavBar from "../siderBar/page";

import { useState } from "react";
type HeaderProps = {
  userData?: { name?: string; email?: string };
};

export default function Header({ userData }: HeaderProps) {
  const [notification, setNotification] = useState(true);
  
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1>Bem-vindo de volta, <span>{userData?.name || "Usuário"}</span>!</h1>
      </div>

      <div className={styles.right}>
        
        <button className={styles.iconBtn} onClick={() => setNotification(!notification)}>
          {notification ? <IoMdNotifications /> : <IoMdNotificationsOff />}
        </button>

        <div className={styles.userInfo}>
          <p className={styles.userName}>{userData?.name || "Usuário"}</p>
          <p className={styles.userEmail}>{userData?.email || "email@exemplo.com"}</p>
        </div>
      </div>
    </header>
  );
}
