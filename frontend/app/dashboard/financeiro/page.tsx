"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.css";


interface EntradaFinanceira {
  id?: number;
  hora: string;
  descricao: string;
  formaDePagamento: "PIX" | "DINHEIRO" | "CARTAO";
  colaboradorId?: number;
  valor: number;
  servicoAssociadoId?: number | null;
  tipo: "ENTRADA" | "SAIDA";
  categoriaId?: number | null;
  nomeCategoria?: string;
}

interface Categoria {
  id: number;
  nomeCategoria: string;
}

interface Colaborador {
  id: number;
  nomeCompleto: string;
}

export default function AbaEntradas() {
  const URLSAVE = "http://localhost:3003/appBarber/saveLancamento";
  const URLLIST = "http://localhost:3003/appBarber/listaDeLancamento";
  const URLDELETE = "http://localhost:3003/appBarber/deleteLancamento";
  const URLCATEGORIAS = "http://localhost:3003/appBarber/listCATEGORIA";
  const URLCOLABORADORES = "http://localhost:3003/appBarber/listColaboradores";

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [entradas, setEntradas] = useState<EntradaFinanceira[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [novaCategoriaNome, setNovaCategoriaNome] = useState("");

  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroColaborador, setFiltroColaborador] = useState("");

  const [formData, setFormData] = useState<EntradaFinanceira>({
    hora: "",
    descricao: "",
    formaDePagamento: "PIX",
    colaboradorId: undefined,
    valor: 0,
    tipo: "SAIDA",
    servicoAssociadoId: null,
    categoriaId: undefined,
    nomeCategoria: "",
  });

  const getToken = (): string | null => {
    return localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
  };

  // ==== FETCHS ====
  const fetchEntradas = async (token?: string) => {
    const validToken = token || getToken();
    if (!validToken) return;
    try {
      const response = await fetch(URLLIST, { headers: { Authorization: `Bearer ${validToken}` } });
      if (!response.ok) throw new Error("Erro ao buscar entradas");
      const data = await response.json();
      setEntradas(Array.isArray(data.lista) ? data.lista : []);
    } catch (error: any) {
      console.error("Erro ao buscar entradas:", error.message);
    }
  };

  const fetchCategorias = async (token?: string) => {
    const validToken = token || getToken();
    if (!validToken) return;
    try {
      const response = await fetch(URLCATEGORIAS, { headers: { Authorization: `Bearer ${validToken}` } });
      if (!response.ok) throw new Error("Erro ao buscar categorias");
      const data = await response.json();
      setCategorias(Array.isArray(data.list) ? data.list : []);
    } catch (error: any) {
      console.error("Erro ao buscar categorias:", error.message);
    }
  };

  const fetchColaboradores = async (token?: string) => {
    const validToken = token || getToken();
    if (!validToken) return;
    try {
      const response = await fetch(URLCOLABORADORES, { headers: { Authorization: `Bearer ${validToken}` } });
      if (!response.ok) throw new Error("Erro ao buscar colaboradores");
      const data = await response.json();
      setColaboradores(Array.isArray(data.list) ? data.list : Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Erro ao buscar colaboradores:", error.message);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) { window.location.href = "/login"; return; }
    fetchEntradas(token);
    fetchCategorias(token);
    fetchColaboradores(token);
  }, []);

  // ==== HANDLERS ====
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "categoriaId") {
      if (value === "nova") {
        // usuário quer criar nova categoria
        setFormData((prev) => ({
          ...prev,
          categoriaId: null,
          nomeCategoria: "",
        }));
        setNovaCategoriaNome("");
      } else {
        const categoriaSelecionada = categorias.find((cat) => cat.id === Number(value));
        if (categoriaSelecionada) {
          setFormData((prev) => ({
            ...prev,
            categoriaId: categoriaSelecionada.id,
            nomeCategoria: categoriaSelecionada.nomeCategoria,
          }));
        } else {
          setFormData((prev) => ({ ...prev, categoriaId: undefined, nomeCategoria: "" }));
        }
      }
      return;
    }

    if (name === "colaboradorId") {
      setFormData((prev) => ({ ...prev, colaboradorId: value ? Number(value) : undefined }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "valor" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAbrirFormulario = () => {
    const agora = new Date();
    const horaAtual = agora.toTimeString().slice(0, 5);
    setFormData((prev) => ({ ...prev, hora: horaAtual }));
    setMostrarFormulario(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return alert("Usuário não autenticado!");

    let categoriaId = formData.categoriaId;
    let nomeCategoria = formData.nomeCategoria;

    // caso o usuário tenha digitado nova categoria
    if (categoriaId === null && novaCategoriaNome.trim()) {
      nomeCategoria = novaCategoriaNome.trim();
    }

    const dataParaEnviar = { ...formData, categoriaId, nomeCategoria };

    try {
      const response = await fetch(URLSAVE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(dataParaEnviar),
      });

      if (!response.ok) {
        const erro = await response.json();
        alert(erro.message || "Erro ao salvar entrada");
        return;
      }

      const data = await response.json();
      const novaEntrada: EntradaFinanceira = data.entrada || data;

      setEntradas((prev) => [...prev, novaEntrada]);
      setFormData({
        hora: "",
        descricao: "",
        formaDePagamento: "PIX",
        colaboradorId: undefined,
        valor: 0,
        tipo: "ENTRADA",
        servicoAssociadoId: null,
        categoriaId: undefined,
        nomeCategoria: "",
      });
      setNovaCategoriaNome("");
      setMostrarFormulario(false);
    } catch (error: any) {
      console.error("Erro ao salvar entrada:", error.message);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const token = getToken();
    if (!token) return alert("Usuário não autenticado!");
    try {
      const response = await fetch(`${URLDELETE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const erro = await response.json();
        alert(erro.message || "Erro ao deletar entrada");
        return;
      }
      setEntradas((prev) => prev.filter((entrada) => entrada.id !== id));
    } catch (error: any) {
      console.error("Erro ao deletar entrada:", error.message);
    }
  };

  const entradasFiltradas = entradas.filter((e) => {
    const tipoOk = (e.tipo ?? "").toLowerCase().includes(filtroTipo.toLowerCase());
    const categoriaOk = (e.nomeCategoria ?? "").toLowerCase().includes(filtroCategoria.toLowerCase());
    const colaboradorNome = colaboradores.find((c) => c.id === e.colaboradorId)?.nomeCompleto ?? "";
    const colaboradorOk = colaboradorNome.toLowerCase().includes(filtroColaborador.toLowerCase());
    return tipoOk && categoriaOk && colaboradorOk;
  });

  return (
    <div className={styles.containerFinanceiro}>
      <div className={styles.filtrosFinanceiroContainer}>
        <input type="text" placeholder="Filtrar por tipo" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} />
        <input type="text" placeholder="Filtrar por categoria" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} />
        <input type="text" placeholder="Filtrar por colaborador" value={filtroColaborador} onChange={(e) => setFiltroColaborador(e.target.value)} />
     
      </div>

      <div className={styles.containerFinanceiroHeader}>
        <h3 className={styles.titleFinanceiro}>Controle de Custos</h3>
        <div className={styles.actionsFinanceiro}>
          <button onClick={handleAbrirFormulario}>Adicionar Entrada/Saída</button>
        </div>
      </div>

      {mostrarFormulario && (
        <form className={styles.formFinanceiro} onSubmit={handleSubmit}>
          <input type="text" name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} required />
          <input type="number" name="valor" placeholder="Valor" value={formData.valor} onChange={handleChange} required />
          <select name="formaDePagamento" value={formData.formaDePagamento} onChange={handleChange} required>
            <option value="PIX">PIX</option>
            <option value="DINHEIRO">DINHEIRO</option>
            <option value="CARTAO">CARTAO</option>
          </select>

          <select name="categoriaId" value={formData.categoriaId ?? ""} onChange={handleChange} >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => <option key={cat.id} value={cat.id}>{cat.nomeCategoria}</option>)}
            <option value="nova">Adicionar Nova Categoria</option>
          </select>

          {formData.categoriaId === null && (
            <input
              type="text"
              placeholder="Digite nova categoria"
              value={novaCategoriaNome}
              onChange={(e) => setNovaCategoriaNome(e.target.value)}
              required
            />
          )}

          <select name="colaboradorId" value={formData.colaboradorId ?? ""} onChange={handleChange} required>
            <option value="">Selecione o colaborador</option>
            {colaboradores.map((col) => <option key={col.id} value={col.id}>{col.nomeCompleto}</option>)}
          </select>

          <select name="tipo" value={formData.tipo} onChange={handleChange} required>
            <option value="SAIDA">Saída</option>
          </select>

          <input type="time" name="hora" value={formData.hora} readOnly />

          <div className={styles.formBtnsFinanceiro}>
            <button type="submit" className={styles.primaryBtnFinanceiro}>Registrar</button>
            <button type="button" className={styles.secondaryBtnFinanceiro} onClick={() => setMostrarFormulario(false)}>Fechar</button>
          </div>
        </form>
      )}

      <table className={styles.tableFinanceiro}>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Forma de Pagamento</th>
            <th>Categoria</th>
            <th>Colaborador</th>
            <th>Hora</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {entradasFiltradas.length > 0 ? (
            entradasFiltradas.map((entrada) => {
              const colaboradorNome = colaboradores.find((c) => c.id === entrada.colaboradorId)?.nomeCompleto || "—";
              return (
                <tr key={entrada.id}>
                  <td>{entrada.descricao}</td>
                  <td>{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(entrada.valor) || 0)}</td>
                  <td>{entrada.formaDePagamento}</td>
                  <td>{entrada.nomeCategoria || "—"}</td>
                  <td>{colaboradorNome}</td>
                  <td>{entrada.hora}</td>
                  <td>{entrada.tipo}</td>
                  <td>
                    <button className={styles.deleteBtnFinanceiro} onClick={() => handleDelete(entrada.id)}>Deletar</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>Nenhuma entrada registrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
