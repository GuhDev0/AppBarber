import styles from "./styles.module.css"

export default function Carregamento(){

    return(
    <div className={styles.loader}>
  <div className={styles.loadingText}>
    Loading<span className={styles.dot}>.</span><span className={styles.dot}>.</span
    ><span className={styles.dot}>.</span>
  </div>
  <div className={styles.loadingBarBackground}>
    <div className={styles.loadingBar}>
      <div className={styles.whiteBarsContainer}>
        <div className={styles.whiteBar}></div>
        <div className={styles.whiteBar}></div>
        <div className={styles.whiteBar}></div>
        <div className={styles.whiteBar}></div>
        <div className={styles.whiteBar}></div>
        <div className={styles.whiteBar}></div>
        <div className={styles.whiteBar}></div>
        <div className={styles.whiteBar}></div>
        <div className={styles.whiteBar}></div>
        <div className={styles.whiteBar}></div>
      </div>
    </div>
  </div>
</div>
)
}