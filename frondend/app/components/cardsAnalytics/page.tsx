import styles from "./styles.module.css"

interface CardAnalytics{
    titulo:String;
    valor:number | string;
    descricao?:String;
    icon:React.ReactNode;

}

export default function CardAnalytics({ titulo, valor, descricao, icon }: CardAnalytics) {
  return (
    <div className={styles.cardAnalytics}>
      <p className={styles.text}>{titulo}</p>
      <div className={styles.valor}>{valor}</div>
      <div className={styles.informationAnalytics}>
        <i>{icon}</i>
        <p>{descricao || '+8 desde o mês passado'}</p>
      </div>
    </div>
  );
}
