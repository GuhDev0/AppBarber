import React from "react";
import styles from "./styles.module.css";

type Props = {
    event: any;
    onClose: () => void;
};

const ModalAtividade = ({
    event,
    onClose,
}: Props) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>

                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        Agendamento
                    </h2>

                    <button onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.field}>
                    <label>Início</label>

                    <input
                        type="text"
                        value={new Date(
                            event.start
                        ).toLocaleString("pt-BR")}
                        readOnly
                    />
                </div>

                <div className={styles.field}>
                    <label>Fim</label>

                    <input
                        type="text"
                        value={new Date(
                            event.end
                        ).toLocaleString("pt-BR")}
                        readOnly
                    />
                </div>

                <div className={styles.field}>
                    <label>Serviço</label>

                    <input
                        type="text"
                        value={event.title || ""}
                        readOnly
                    />
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAtividade;