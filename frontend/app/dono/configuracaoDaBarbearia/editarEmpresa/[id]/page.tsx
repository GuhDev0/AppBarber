"use client";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { IoCheckmark, IoCloseSharp } from "react-icons/io5";
import { api } from "@/app/lib/api";
import { useParams } from "next/navigation";
interface Empresa {
  id: number;
  nomeDaEmpresa: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
}

export default function EditarEmpresa() {
  const params = useParams();
  const id = Number(params.id);

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
  if (id) {
    fetchEmpresa();
  }
}, [id]);
const fetchEmpresa = async () => {
  try {
    setLoading(true);

    const response = await api.get(`/empresa/${id}`);
    console.log(response.data)
    setEmpresa(response.data);
    setFormData(response.data);

  } catch (error: any) {
    setMessage({
      type: "error",
      text: "Erro ao carregar dados da empresa"
    });

    console.error(error);

  } finally {
    setLoading(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setSaving(true);
      await api.put(`/empresa/${empresa?.id}`, formData);
      setEmpresa(formData);
      setIsEditing(false);
      setMessage({ type: "success", text: "Empresa atualizada com sucesso!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: "error", text: "Erro ao atualizar empresa" });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(empresa);
    setIsEditing(false);
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Editar Informações da Empresa</h3>
        {!isEditing && (
          <button className={styles.btnEdit} onClick={() => setIsEditing(true)}>
            Editar
          </button>
        )}
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nome da Empresa</label>
            <input
              type="text"
              name="nomeDaEmpresa"
              value={formData?.nomeDaEmpresa || ""}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>CNPJ</label>
            <input
              type="text"
              name="cnpj"
              value={formData?.cnpj || ""}
              onChange={handleChange}
              required
              minLength={14}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData?.email || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={formData?.telefone || ""}
              onChange={handleChange}
              required
              minLength={10}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Endereço</label>
            <textarea
              name="endereco"
              value={formData?.endereco || ""}
              onChange={handleChange}
              required
              minLength={5}
              rows={4}
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" disabled={saving} className={styles.btnSave}>
              <IoCheckmark /> {saving ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={handleCancel} className={styles.btnCancel}>
              <IoCloseSharp /> Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.viewContainer}>
          <div className={styles.infoGroup}>
            <label>Nome da Empresa</label>
            <p>{empresa?.nomeDaEmpresa}</p>
          </div>

          <div className={styles.infoGroup}>
            <label>CNPJ</label>
            <p>{empresa?.cnpj}</p>
          </div>

          <div className={styles.infoGroup}>
            <label>Email</label>
            <p>{empresa?.email}</p>
          </div>

          <div className={styles.infoGroup}>
            <label>Telefone</label>
            <p>{empresa?.telefone}</p>
          </div>

          <div className={styles.infoGroup}>
            <label>Endereço</label>
            <p>{empresa?.endereco}</p>
          </div>
        </div>
      )}
    </div>
  );
}
