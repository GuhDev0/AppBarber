
import styles from "./styles/AnaliseBarbeariaStyles.module.css";
import { cookies } from "next/headers";
import AnalycisBarber from "./view/analiseBarbearia"; 



export default async function LayoutDashboard() {
  return (
      <AnalycisBarber/>  
  );
}
