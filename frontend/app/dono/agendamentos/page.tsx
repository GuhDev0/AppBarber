'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  List, 
  ChevronLeft, 
  ChevronRight,
  X,
  Edit2,
  Trash2,
  Eye,
  Clock,
  User,
  Phone,
  Mail,
  Bell
} from 'lucide-react';
import { api } from '@/app/lib/api';
import { createClient } from '@/app/lib/supabase/client';

// Tipos
interface Agendamento {
  id: string;
  titulo: string;
  descricao?: string;
  cliente_nome: string;
  cliente_telefone?: string;
  cliente_email?: string;
  colaborador_id?: number;
  colaborador_nome?: string;
  servico_id?: number;
  servico_nome?: string;
  data_agendamento: string;
  hora_inicio: string;
  hora_fim?: string;
  valor?: number;
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado' | 'nao_compareceu';
  observacoes?: string;
  user_id: string;
  empresa_id?: number;
  created_at: string;
  updated_at: string;
}

interface Colaborador {
  id: number;
  nomeCompleto: string;
}

interface ServicoConfig {
  id: number;
  nome: string;
  preco: number;
}

interface Cliente {
  id: number;
  nome: string;
  sobrenome: string;
  email?: string;
  tel?: string;
}

interface FormData {
  titulo: string;
  descricao: string;
  cliente_nome: string;
  cliente_telefone: string;
  cliente_email: string;
  colaborador_id: number | null;
  colaborador_nome: string;
  servico_id: number | null;
  servico_nome: string;
  data_agendamento: string;
  hora_inicio: string;
  hora_fim: string;
  valor: string;
  status: Agendamento['status'];
  observacoes: string;
  criar_lembrete: boolean;
  tempo_lembrete: number;
}

type ViewMode = 'calendar' | 'list';
type ModalMode = 'create' | 'edit' | 'view' | null;

const STATUS_LABELS: Record<Agendamento['status'], string> = {
  agendado: 'Agendado',
  confirmado: 'Confirmado',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  nao_compareceu: 'Não Compareceu'
};

const initialFormData: FormData = {
  titulo: '',
  descricao: '',
  cliente_nome: '',
  cliente_telefone: '',
  cliente_email: '',
  colaborador_id: null,
  colaborador_nome: '',
  servico_id: null,
  servico_nome: '',
  data_agendamento: new Date().toISOString().split('T')[0],
  hora_inicio: '09:00',
  hora_fim: '',
  valor: '',
  status: 'agendado',
  observacoes: '',
  criar_lembrete: true,
  tempo_lembrete: 60
};

export default function AgendamentosPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [servicos, setServicos] = useState<ServicoConfig[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  
  // Estado do calendário
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Filtros
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroData, setFiltroData] = useState<string>('');
  const [filtroColaborador, setFiltroColaborador] = useState<string>('');
  const [filtroCliente, setFiltroCliente] = useState<string>('');

  const supabase = createClient();

  // Buscar dados iniciais
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Buscar agendamentos do Supabase
      const { data: agendamentosData, error: agendamentosError } = await supabase
        .from('agendamentos')
        .select('*')
        .order('data_agendamento', { ascending: true });

      if (agendamentosError) throw agendamentosError;
      setAgendamentos(agendamentosData || []);

      // Buscar colaboradores da API existente
      try {
        const colaboradoresRes = await api.get('/colaborador/listaDeColaboradores');
        setColaboradores(colaboradoresRes.data || []);
      } catch (e) {
        console.log('Erro ao buscar colaboradores:', e);
      }

      // Buscar serviços da API existente
      try {
        const servicosRes = await api.get('/configuracao/catalago');
        setServicos(servicosRes.data || []);
      } catch (e) {
        console.log('Erro ao buscar serviços:', e);
      }

      // Buscar clientes da API existente
      try {
        const clientesRes = await api.get('/cliente/listaDeClientes');
        setClientes(clientesRes.data || []);
      } catch (e) {
        console.log('Erro ao buscar clientes:', e);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      showToast('Erro ao carregar agendamentos', 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.titulo.trim()) {
      errors.titulo = 'Título é obrigatório';
    }
    if (!formData.cliente_nome.trim()) {
      errors.cliente_nome = 'Nome do cliente é obrigatório';
    }
    if (!formData.data_agendamento) {
      errors.data_agendamento = 'Data é obrigatória';
    }
    if (!formData.hora_inicio) {
      errors.hora_inicio = 'Horário é obrigatório';
    }
    if (formData.cliente_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.cliente_email)) {
      errors.cliente_email = 'E-mail inválido';
    }
    if (formData.cliente_telefone && !/^[\d\s()+-]{8,}$/.test(formData.cliente_telefone)) {
      errors.cliente_telefone = 'Telefone inválido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'servico_id') {
      const servico = servicos.find(s => s.id === Number(value));
      setFormData(prev => ({
        ...prev,
        servico_id: value ? Number(value) : null,
        servico_nome: servico?.nome || '',
        valor: servico?.preco?.toString() || prev.valor,
        titulo: servico?.nome || prev.titulo
      }));
    } else if (name === 'colaborador_id') {
      const colaborador = colaboradores.find(c => c.id === Number(value));
      setFormData(prev => ({
        ...prev,
        colaborador_id: value ? Number(value) : null,
        colaborador_nome: colaborador?.nomeCompleto || ''
      }));
    } else if (name === 'cliente_select') {
      const cliente = clientes.find(c => c.id === Number(value));
      if (cliente) {
        setFormData(prev => ({
          ...prev,
          cliente_nome: `${cliente.nome} ${cliente.sobrenome}`,
          cliente_email: cliente.email || '',
          cliente_telefone: cliente.tel || ''
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpar erro do campo
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const openModal = (mode: ModalMode, agendamento?: Agendamento) => {
    setModalMode(mode);
    if (agendamento && (mode === 'edit' || mode === 'view')) {
      setSelectedAgendamento(agendamento);
      setFormData({
        titulo: agendamento.titulo,
        descricao: agendamento.descricao || '',
        cliente_nome: agendamento.cliente_nome,
        cliente_telefone: agendamento.cliente_telefone || '',
        cliente_email: agendamento.cliente_email || '',
        colaborador_id: agendamento.colaborador_id || null,
        colaborador_nome: agendamento.colaborador_nome || '',
        servico_id: agendamento.servico_id || null,
        servico_nome: agendamento.servico_nome || '',
        data_agendamento: agendamento.data_agendamento,
        hora_inicio: agendamento.hora_inicio,
        hora_fim: agendamento.hora_fim || '',
        valor: agendamento.valor?.toString() || '',
        status: agendamento.status,
        observacoes: agendamento.observacoes || '',
        criar_lembrete: false,
        tempo_lembrete: 60
      });
    } else {
      setSelectedAgendamento(null);
      setFormData(initialFormData);
    }
    setFormErrors({});
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedAgendamento(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        showToast('Usuário não autenticado', 'error');
        return;
      }

      const agendamentoData = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim() || null,
        cliente_nome: formData.cliente_nome.trim(),
        cliente_telefone: formData.cliente_telefone.trim() || null,
        cliente_email: formData.cliente_email.trim() || null,
        colaborador_id: formData.colaborador_id,
        colaborador_nome: formData.colaborador_nome || null,
        servico_id: formData.servico_id,
        servico_nome: formData.servico_nome || null,
        data_agendamento: formData.data_agendamento,
        hora_inicio: formData.hora_inicio,
        hora_fim: formData.hora_fim || null,
        valor: formData.valor ? parseFloat(formData.valor) : null,
        status: formData.status,
        observacoes: formData.observacoes.trim() || null,
        user_id: user.id
      };

      if (modalMode === 'create') {
        const { data, error } = await supabase
          .from('agendamentos')
          .insert(agendamentoData)
          .select()
          .single();

        if (error) throw error;

        // Criar lembrete se solicitado
        if (formData.criar_lembrete && data) {
          await supabase
            .from('lembretes')
            .insert({
              agendamento_id: data.id,
              tipo: 'notificacao',
              tempo_antes_minutos: formData.tempo_lembrete,
              mensagem: `Lembrete: ${formData.titulo} às ${formData.hora_inicio}`,
              user_id: user.id
            });
        }

        showToast('Agendamento criado com sucesso!', 'success');
      } else if (modalMode === 'edit' && selectedAgendamento) {
        const { error } = await supabase
          .from('agendamentos')
          .update(agendamentoData)
          .eq('id', selectedAgendamento.id);

        if (error) throw error;
        showToast('Agendamento atualizado com sucesso!', 'success');
      }

      closeModal();
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      showToast('Erro ao salvar agendamento', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

    try {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showToast('Agendamento excluído com sucesso!', 'success');
      fetchData();
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      showToast('Erro ao excluir agendamento', 'error');
    }
  };

  // Funções do calendário
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    
    // Dias do mês anterior
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Dias do próximo mês
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const getAgendamentosForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return agendamentos.filter(a => a.data_agendamento === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  // Filtrar agendamentos
  const agendamentosFiltrados = agendamentos.filter(a => {
    if (filtroStatus && a.status !== filtroStatus) return false;
    if (filtroData && a.data_agendamento !== filtroData) return false;
    if (filtroColaborador && !a.colaborador_nome?.toLowerCase().includes(filtroColaborador.toLowerCase())) return false;
    if (filtroCliente && !a.cliente_nome.toLowerCase().includes(filtroCliente.toLowerCase())) return false;
    return true;
  });

  const formatarValor = (valor?: number) => {
    if (!valor) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Agendamentos</h1>
          <p>Gerencie todos os seus agendamentos</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewToggleBtn} ${viewMode === 'calendar' ? styles.active : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <CalendarIcon size={16} />
              <span>Calendário</span>
            </button>
            <button
              className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
              <span>Lista</span>
            </button>
          </div>
          <button className={styles.primaryBtn} onClick={() => openModal('create')}>
            <Plus size={18} />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <label>Cliente</label>
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Colaborador</label>
          <input
            type="text"
            placeholder="Buscar por colaborador..."
            value={filtroColaborador}
            onChange={(e) => setFiltroColaborador(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Data</label>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <label>Status</label>
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Visualização Calendário */}
      {viewMode === 'calendar' && (
        <div className={styles.calendarContainer}>
          <div className={styles.calendarHeader}>
            <h2>{formatMonthYear(currentDate)}</h2>
            <div className={styles.calendarNav}>
              <button className={styles.iconBtn} onClick={() => navigateMonth('prev')}>
                <ChevronLeft size={20} />
              </button>
              <button className={styles.secondaryBtn} onClick={() => setCurrentDate(new Date())}>
                Hoje
              </button>
              <button className={styles.iconBtn} onClick={() => navigateMonth('next')}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className={styles.calendarGrid}>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className={styles.calendarDayHeader}>{day}</div>
            ))}
            
            {getDaysInMonth(currentDate).map((day, index) => {
              const dayAgendamentos = getAgendamentosForDate(day.date);
              return (
                <div
                  key={index}
                  className={`${styles.calendarDay} ${!day.isCurrentMonth ? styles.otherMonth : ''} ${isToday(day.date) ? styles.today : ''}`}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      data_agendamento: day.date.toISOString().split('T')[0]
                    }));
                    openModal('create');
                  }}
                >
                  <span className={styles.dayNumber}>{day.date.getDate()}</span>
                  <div className={styles.dayEvents}>
                    {dayAgendamentos.slice(0, 3).map(ag => (
                      <div
                        key={ag.id}
                        className={`${styles.eventBadge} ${styles[ag.status]}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('view', ag);
                        }}
                      >
                        {ag.hora_inicio.slice(0, 5)} - {ag.cliente_nome.split(' ')[0]}
                      </div>
                    ))}
                    {dayAgendamentos.length > 3 && (
                      <div className={styles.eventBadge} style={{ backgroundColor: 'var(--bg-hover)' }}>
                        +{dayAgendamentos.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visualização Lista */}
      {viewMode === 'list' && (
        <div className={styles.listContainer}>
          {agendamentosFiltrados.length === 0 ? (
            <div className={styles.emptyState}>
              <CalendarIcon />
              <h3>Nenhum agendamento encontrado</h3>
              <p>Crie um novo agendamento para começar</p>
            </div>
          ) : (
            <>
              <div className={styles.listHeader}>
                <span>Cliente</span>
                <span>Serviço / Colaborador</span>
                <span>Data / Hora</span>
                <span>Valor</span>
                <span>Status</span>
                <span>Ações</span>
              </div>
              {agendamentosFiltrados.map(agendamento => (
                <div key={agendamento.id} className={styles.listItem}>
                  <div className={styles.clienteInfo}>
                    <span className={styles.clienteNome}>{agendamento.cliente_nome}</span>
                    <span className={styles.clienteContato}>
                      {agendamento.cliente_telefone || agendamento.cliente_email || '-'}
                    </span>
                  </div>
                  <div className={styles.servicoInfo}>
                    <span className={styles.servicoNome}>{agendamento.titulo}</span>
                    <span className={styles.colaboradorNome}>{agendamento.colaborador_nome || '-'}</span>
                  </div>
                  <div className={styles.dataHora}>
                    <span className={styles.data}>{formatarData(agendamento.data_agendamento)}</span>
                    <span className={styles.hora}>{agendamento.hora_inicio.slice(0, 5)}</span>
                  </div>
                  <span className={styles.valor}>{formatarValor(agendamento.valor)}</span>
                  <span className={`${styles.statusBadge} ${styles[agendamento.status]}`}>
                    {STATUS_LABELS[agendamento.status]}
                  </span>
                  <div className={styles.listActions}>
                    <button className={styles.iconBtn} onClick={() => openModal('view', agendamento)} title="Ver detalhes">
                      <Eye size={16} />
                    </button>
                    <button className={styles.iconBtn} onClick={() => openModal('edit', agendamento)} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button className={styles.iconBtn} onClick={() => handleDelete(agendamento.id)} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Modal */}
      {modalMode && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                {modalMode === 'create' && 'Novo Agendamento'}
                {modalMode === 'edit' && 'Editar Agendamento'}
                {modalMode === 'view' && 'Detalhes do Agendamento'}
              </h2>
              <button className={styles.iconBtn} onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            {modalMode === 'view' && selectedAgendamento ? (
              <div className={styles.modalBody}>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Título</span>
                    <span className={styles.detailValue}>{selectedAgendamento.titulo}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Status</span>
                    <span className={`${styles.statusBadge} ${styles[selectedAgendamento.status]}`}>
                      {STATUS_LABELS[selectedAgendamento.status]}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><User size={14} /> Cliente</span>
                    <span className={styles.detailValue}>{selectedAgendamento.cliente_nome}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><Phone size={14} /> Telefone</span>
                    <span className={styles.detailValue}>{selectedAgendamento.cliente_telefone || '-'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><Mail size={14} /> E-mail</span>
                    <span className={styles.detailValue}>{selectedAgendamento.cliente_email || '-'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Colaborador</span>
                    <span className={styles.detailValue}>{selectedAgendamento.colaborador_nome || '-'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><CalendarIcon size={14} /> Data</span>
                    <span className={styles.detailValue}>{formatarData(selectedAgendamento.data_agendamento)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><Clock size={14} /> Horário</span>
                    <span className={styles.detailValue}>
                      {selectedAgendamento.hora_inicio.slice(0, 5)}
                      {selectedAgendamento.hora_fim && ` - ${selectedAgendamento.hora_fim.slice(0, 5)}`}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Valor</span>
                    <span className={`${styles.detailValue} ${styles.highlight}`}>
                      {formatarValor(selectedAgendamento.valor)}
                    </span>
                  </div>
                  {selectedAgendamento.observacoes && (
                    <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                      <span className={styles.detailLabel}>Observações</span>
                      <span className={styles.detailValue}>{selectedAgendamento.observacoes}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.modalBody}>
                  {/* Cliente existente */}
                  {clientes.length > 0 && (
                    <div className={styles.formGroup}>
                      <label>Cliente Cadastrado</label>
                      <select name="cliente_select" onChange={handleInputChange} defaultValue="">
                        <option value="">Selecione ou preencha manualmente</option>
                        {clientes.map(c => (
                          <option key={c.id} value={c.id}>{c.nome} {c.sobrenome}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className={styles.formGroup + (formErrors.cliente_nome ? ` ${styles.error}` : '')}>
                    <label>Nome do Cliente <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      name="cliente_nome"
                      value={formData.cliente_nome}
                      onChange={handleInputChange}
                      placeholder="Nome completo do cliente"
                    />
                    {formErrors.cliente_nome && <span className={styles.errorMessage}>{formErrors.cliente_nome}</span>}
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup + (formErrors.cliente_telefone ? ` ${styles.error}` : '')}>
                      <label>Telefone</label>
                      <input
                        type="tel"
                        name="cliente_telefone"
                        value={formData.cliente_telefone}
                        onChange={handleInputChange}
                        placeholder="(00) 00000-0000"
                      />
                      {formErrors.cliente_telefone && <span className={styles.errorMessage}>{formErrors.cliente_telefone}</span>}
                    </div>
                    <div className={styles.formGroup + (formErrors.cliente_email ? ` ${styles.error}` : '')}>
                      <label>E-mail</label>
                      <input
                        type="email"
                        name="cliente_email"
                        value={formData.cliente_email}
                        onChange={handleInputChange}
                        placeholder="email@exemplo.com"
                      />
                      {formErrors.cliente_email && <span className={styles.errorMessage}>{formErrors.cliente_email}</span>}
                    </div>
                  </div>

                  {/* Serviço */}
                  {servicos.length > 0 && (
                    <div className={styles.formGroup}>
                      <label>Serviço</label>
                      <select name="servico_id" value={formData.servico_id || ''} onChange={handleInputChange}>
                        <option value="">Selecione um serviço</option>
                        {servicos.map(s => (
                          <option key={s.id} value={s.id}>{s.nome} - {formatarValor(s.preco)}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className={styles.formGroup + (formErrors.titulo ? ` ${styles.error}` : '')}>
                    <label>Título / Descrição do Serviço <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      placeholder="Ex: Corte de cabelo masculino"
                    />
                    {formErrors.titulo && <span className={styles.errorMessage}>{formErrors.titulo}</span>}
                  </div>

                  {/* Colaborador */}
                  {colaboradores.length > 0 && (
                    <div className={styles.formGroup}>
                      <label>Colaborador</label>
                      <select name="colaborador_id" value={formData.colaborador_id || ''} onChange={handleInputChange}>
                        <option value="">Selecione um colaborador</option>
                        {colaboradores.map(c => (
                          <option key={c.id} value={c.id}>{c.nomeCompleto}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className={styles.formRow}>
                    <div className={styles.formGroup + (formErrors.data_agendamento ? ` ${styles.error}` : '')}>
                      <label>Data <span className={styles.required}>*</span></label>
                      <input
                        type="date"
                        name="data_agendamento"
                        value={formData.data_agendamento}
                        onChange={handleInputChange}
                      />
                      {formErrors.data_agendamento && <span className={styles.errorMessage}>{formErrors.data_agendamento}</span>}
                    </div>
                    <div className={styles.formGroup + (formErrors.hora_inicio ? ` ${styles.error}` : '')}>
                      <label>Horário <span className={styles.required}>*</span></label>
                      <input
                        type="time"
                        name="hora_inicio"
                        value={formData.hora_inicio}
                        onChange={handleInputChange}
                      />
                      {formErrors.hora_inicio && <span className={styles.errorMessage}>{formErrors.hora_inicio}</span>}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Horário de Término</label>
                      <input
                        type="time"
                        name="hora_fim"
                        value={formData.hora_fim}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Valor (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        name="valor"
                        value={formData.valor}
                        onChange={handleInputChange}
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  {modalMode === 'edit' && (
                    <div className={styles.formGroup}>
                      <label>Status</label>
                      <select name="status" value={formData.status} onChange={handleInputChange}>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <label>Observações</label>
                    <textarea
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleInputChange}
                      placeholder="Observações adicionais..."
                    />
                  </div>

                  {modalMode === 'create' && (
                    <>
                      <label className={styles.checkboxGroup}>
                        <input
                          type="checkbox"
                          name="criar_lembrete"
                          checked={formData.criar_lembrete}
                          onChange={handleInputChange}
                        />
                        <Bell size={18} />
                        <span>Criar lembrete para este agendamento</span>
                      </label>

                      {formData.criar_lembrete && (
                        <div className={styles.formGroup}>
                          <label>Lembrar com antecedência de</label>
                          <select
                            name="tempo_lembrete"
                            value={formData.tempo_lembrete}
                            onChange={handleInputChange}
                          >
                            <option value={15}>15 minutos</option>
                            <option value={30}>30 minutos</option>
                            <option value={60}>1 hora</option>
                            <option value={120}>2 horas</option>
                            <option value={1440}>1 dia</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.modalFooter}>
                  <button type="button" className={styles.secondaryBtn} onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.primaryBtn}>
                    {modalMode === 'create' ? 'Criar Agendamento' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            )}

            {modalMode === 'view' && (
              <div className={styles.modalFooter}>
                <button className={styles.secondaryBtn} onClick={closeModal}>
                  Fechar
                </button>
                <button className={styles.primaryBtn} onClick={() => openModal('edit', selectedAgendamento!)}>
                  <Edit2 size={16} />
                  Editar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
