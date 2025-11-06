import { subtle } from "crypto";
import styles from "./styles.module.css"

interface CardAnalytics{
    titulo:String;
    subTitulo:String;
    valor:number | string;
    descricao?:String;
    icon:React.ReactNode;

}

export default function CardAnalytics({ titulo, valor, descricao, icon,subTitulo }: CardAnalytics) {
  return (
    <div className={styles.cardAnalytics}>
      <i>{icon}</i>
      <h3 className={styles.text}>{titulo}</h3>
      <p className={styles.subText}>{subTitulo}</p>
      <div className={styles.valor}>{valor}</div>
      <div className={styles.informationAnalytics}>
        <p>{descricao || '+8 desde o mês passado'}</p>
      </div>
    </div>
  );
}
