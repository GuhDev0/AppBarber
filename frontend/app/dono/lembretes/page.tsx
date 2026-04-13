'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';
import {
  Bell,
  BellOff,
  Plus,
  X,
  Trash2,
  CheckCircle,
  Clock,
  Mail,
  MessageCircle,
  Calendar,
  AlertCircle,
  Settings
} from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';

interface Lembrete {
  id: string;
  agendamento_id: string;
  tipo: 'notificacao' | 'email' | 'whatsapp';
  tempo_antes_minutos: number;
  mensagem?: string;
  enviado: boolean;
  data_envio?: string;
  erro_envio?: string;
  user_id: string;
  created_at: string;
  agendamento?: {
    titulo: string;
    cliente_nome: string;
    data_agendamento: string;
    hora_inicio: string;
  };
}

interface Notificacao {
  id: string;
  user_id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'success' | 'warning' | 'error' | 'agendamento';
  lida: boolean;
  link?: string;
  agendamento_id?: string;
  created_at: string;
}

interface UserSettings {
  id?: string;
  tema: 'light' | 'dark' | 'system';
  notificacoes_ativas: boolean;
  lembretes_email: boolean;
  lembretes_whatsapp: boolean;
  tempo_lembrete_padrao: number;
}

interface Agendamento {
  id: string;
  titulo: string;
  cliente_nome: string;
  data_agendamento: string;
  hora_inicio: string;
}

const TIPO_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  notificacao: { label: 'Notificação', icon: <Bell size={16} /> },
  email: { label: 'E-mail', icon: <Mail size={16} /> },
  whatsapp: { label: 'WhatsApp', icon: <MessageCircle size={16} /> }
};

const TEMPO_OPTIONS = [
  { value: 15, label: '15 minutos antes' },
  { value: 30, label: '30 minutos antes' },
  { value: 60, label: '1 hora antes' },
  { value: 120, label: '2 horas antes' },
  { value: 1440, label: '1 dia antes' },
  { value: 2880, label: '2 dias antes' }
];

export default function LembretesPage() {
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    tema: 'dark',
    notificacoes_ativas: true,
    lembretes_email: true,
    lembretes_whatsapp: false,
    tempo_lembrete_padrao: 60
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lembretes' | 'notificacoes' | 'config'>('lembretes');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    agendamento_id: '',
    tipo: 'notificacao' as 'notificacao' | 'email' | 'whatsapp',
    tempo_antes_minutos: 60,
    mensagem: ''
  });

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Buscar lembretes com dados do agendamento
      const { data: lembretesData, error: lembretesError } = await supabase
        .from('lembretes')
        .select(`
          *,
          agendamento:agendamentos(titulo, cliente_nome, data_agendamento, hora_inicio)
        `)
        .order('created_at', { ascending: false });

      if (lembretesError) throw lembretesError;
      setLembretes(lembretesData || []);

      // Buscar notificações
      const { data: notificacoesData, error: notificacoesError } = await supabase
        .from('notificacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (notificacoesError) throw notificacoesError;
      setNotificacoes(notificacoesData || []);

      // Buscar agendamentos para o formulário
      const { data: agendamentosData } = await supabase
        .from('agendamentos')
        .select('id, titulo, cliente_nome, data_agendamento, hora_inicio')
        .gte('data_agendamento', new Date().toISOString().split('T')[0])
        .order('data_agendamento', { ascending: true });

      setAgendamentos(agendamentosData || []);

      // Buscar configurações do usuário
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('*')
        .single();

      if (settingsData) {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreateLembrete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agendamento_id) {
      showToast('Selecione um agendamento', 'error');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showToast('Usuário não autenticado', 'error');
        return;
      }

      const agendamento = agendamentos.find(a => a.id === formData.agendamento_id);
      const mensagemPadrao = `Lembrete: ${agendamento?.titulo} com ${agendamento?.cliente_nome} às ${agendamento?.hora_inicio.slice(0, 5)}`;

      const { error } = await supabase.from('lembretes').insert({
        agendamento_id: formData.agendamento_id,
        tipo: formData.tipo,
        tempo_antes_minutos: formData.tempo_antes_minutos,
        mensagem: formData.mensagem || mensagemPadrao,
        user_id: user.id
      });

      if (error) throw error;

      showToast('Lembrete criado com sucesso!', 'success');
      setModalOpen(false);
      setFormData({
        agendamento_id: '',
        tipo: 'notificacao',
        tempo_antes_minutos: 60,
        mensagem: ''
      });
      fetchData();
    } catch (error) {
      console.error('Erro ao criar lembrete:', error);
      showToast('Erro ao criar lembrete', 'error');
    }
  };

  const handleDeleteLembrete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este lembrete?')) return;

    try {
      const { error } = await supabase.from('lembretes').delete().eq('id', id);
      if (error) throw error;
      showToast('Lembrete excluído!', 'success');
      fetchData();
    } catch (error) {
      console.error('Erro ao excluir lembrete:', error);
      showToast('Erro ao excluir lembrete', 'error');
    }
  };

  const handleMarkNotificacaoAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Erro ao marcar notificação:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ lida: true })
        .eq('lida', false);

      if (error) throw error;
      showToast('Todas as notificações marcadas como lidas', 'success');
      fetchData();
    } catch (error) {
      console.error('Erro ao marcar notificações:', error);
      showToast('Erro ao marcar notificações', 'error');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showToast('Usuário não autenticado', 'error');
        return;
      }

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          ...settings,
          user_id: user.id
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      showToast('Configurações salvas!', 'success');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      showToast('Erro ao salvar configurações', 'error');
    }
  };

  const formatarData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
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

  const naoLidas = notificacoes.filter(n => !n.lida).length;

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
          <h1>Lembretes e Notificações</h1>
          <p>Gerencie seus lembretes e configurações de notificação</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setModalOpen(true)}>
          <Plus size={18} />
          Novo Lembrete
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'lembretes' ? styles.active : ''}`}
          onClick={() => setActiveTab('lembretes')}
        >
          <Clock size={18} />
          Lembretes
          {lembretes.filter(l => !l.enviado).length > 0 && (
            <span className={styles.badge}>{lembretes.filter(l => !l.enviado).length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'notificacoes' ? styles.active : ''}`}
          onClick={() => setActiveTab('notificacoes')}
        >
          <Bell size={18} />
          Notificações
          {naoLidas > 0 && <span className={styles.badge}>{naoLidas}</span>}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'config' ? styles.active : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <Settings size={18} />
          Configurações
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'lembretes' && (
        <div className={styles.content}>
          {lembretes.length === 0 ? (
            <div className={styles.emptyState}>
              <Bell size={48} />
              <h3>Nenhum lembrete configurado</h3>
              <p>Crie lembretes para ser notificado antes dos seus agendamentos</p>
              <button className={styles.primaryBtn} onClick={() => setModalOpen(true)}>
                <Plus size={18} />
                Criar Lembrete
              </button>
            </div>
          ) : (
            <div className={styles.lembretesList}>
              {lembretes.map(lembrete => (
                <div key={lembrete.id} className={`${styles.lembreteCard} ${lembrete.enviado ? styles.enviado : ''}`}>
                  <div className={styles.lembreteIcon}>
                    {TIPO_LABELS[lembrete.tipo].icon}
                  </div>
                  <div className={styles.lembreteContent}>
                    <div className={styles.lembreteHeader}>
                      <h3>{lembrete.agendamento?.titulo || 'Agendamento'}</h3>
                      <span className={`${styles.tipoBadge} ${styles[lembrete.tipo]}`}>
                        {TIPO_LABELS[lembrete.tipo].label}
                      </span>
                    </div>
                    <p className={styles.lembreteCliente}>
                      <Calendar size={14} />
                      {lembrete.agendamento?.cliente_nome} - {formatarData(lembrete.agendamento?.data_agendamento || '')} às {lembrete.agendamento?.hora_inicio.slice(0, 5)}
                    </p>
                    <p className={styles.lembreteTempo}>
                      <Clock size={14} />
                      {TEMPO_OPTIONS.find(t => t.value === lembrete.tempo_antes_minutos)?.label || `${lembrete.tempo_antes_minutos} minutos antes`}
                    </p>
                    {lembrete.mensagem && (
                      <p className={styles.lembreteMensagem}>{lembrete.mensagem}</p>
                    )}
                    <div className={styles.lembreteFooter}>
                      {lembrete.enviado ? (
                        <span className={styles.statusEnviado}>
                          <CheckCircle size={14} />
                          Enviado {lembrete.data_envio && `em ${formatarTempo(lembrete.data_envio)}`}
                        </span>
                      ) : (
                        <span className={styles.statusPendente}>
                          <Clock size={14} />
                          Pendente
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteLembrete(lembrete.id)}
                    title="Excluir lembrete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notificacoes' && (
        <div className={styles.content}>
          {notificacoes.length === 0 ? (
            <div className={styles.emptyState}>
              <BellOff size={48} />
              <h3>Nenhuma notificação</h3>
              <p>Suas notificações aparecerão aqui</p>
            </div>
          ) : (
            <>
              <div className={styles.notificacoesHeader}>
                <span>{naoLidas} não lidas</span>
                {naoLidas > 0 && (
                  <button className={styles.markAllBtn} onClick={handleMarkAllAsRead}>
                    Marcar todas como lidas
                  </button>
                )}
              </div>
              <div className={styles.notificacoesList}>
                {notificacoes.map(notif => (
                  <div
                    key={notif.id}
                    className={`${styles.notificacaoCard} ${!notif.lida ? styles.unread : ''}`}
                    onClick={() => handleMarkNotificacaoAsRead(notif.id)}
                  >
                    <div className={`${styles.notificacaoIcon} ${styles[notif.tipo]}`}>
                      {notif.tipo === 'success' && <CheckCircle size={20} />}
                      {notif.tipo === 'warning' && <AlertCircle size={20} />}
                      {notif.tipo === 'error' && <AlertCircle size={20} />}
                      {notif.tipo === 'agendamento' && <Calendar size={20} />}
                      {notif.tipo === 'info' && <Bell size={20} />}
                    </div>
                    <div className={styles.notificacaoContent}>
                      <h4>{notif.titulo}</h4>
                      <p>{notif.mensagem}</p>
                      <span className={styles.notificacaoTime}>{formatarTempo(notif.created_at)}</span>
                    </div>
                    {!notif.lida && <div className={styles.unreadDot} />}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'config' && (
        <div className={styles.content}>
          <div className={styles.configSection}>
            <h3>Preferências de Notificação</h3>

            <label className={styles.switchLabel}>
              <div className={styles.switchInfo}>
                <Bell size={20} />
                <div>
                  <span>Notificações Ativas</span>
                  <p>Receber notificações no aplicativo</p>
                </div>
              </div>
              <input
                type="checkbox"
                className={styles.switch}
                checked={settings.notificacoes_ativas}
                onChange={(e) => setSettings(prev => ({ ...prev, notificacoes_ativas: e.target.checked }))}
              />
            </label>

            <label className={styles.switchLabel}>
              <div className={styles.switchInfo}>
                <Mail size={20} />
                <div>
                  <span>Lembretes por E-mail</span>
                  <p>Receber lembretes no seu e-mail</p>
                </div>
              </div>
              <input
                type="checkbox"
                className={styles.switch}
                checked={settings.lembretes_email}
                onChange={(e) => setSettings(prev => ({ ...prev, lembretes_email: e.target.checked }))}
              />
            </label>

            <label className={styles.switchLabel}>
              <div className={styles.switchInfo}>
                <MessageCircle size={20} />
                <div>
                  <span>Lembretes por WhatsApp</span>
                  <p>Receber lembretes pelo WhatsApp (requer configuração)</p>
                </div>
              </div>
              <input
                type="checkbox"
                className={styles.switch}
                checked={settings.lembretes_whatsapp}
                onChange={(e) => setSettings(prev => ({ ...prev, lembretes_whatsapp: e.target.checked }))}
              />
            </label>

            <div className={styles.formGroup}>
              <label>Tempo Padrão de Lembrete</label>
              <select
                value={settings.tempo_lembrete_padrao}
                onChange={(e) => setSettings(prev => ({ ...prev, tempo_lembrete_padrao: Number(e.target.value) }))}
              >
                {TEMPO_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <button className={styles.primaryBtn} onClick={handleSaveSettings}>
              Salvar Configurações
            </button>
          </div>
        </div>
      )}

      {/* Modal de Criar Lembrete */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Novo Lembrete</h2>
              <button className={styles.iconBtn} onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateLembrete}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Agendamento *</label>
                  <select
                    value={formData.agendamento_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, agendamento_id: e.target.value }))}
                    required
                  >
                    <option value="">Selecione um agendamento</option>
                    {agendamentos.map(ag => (
                      <option key={ag.id} value={ag.id}>
                        {ag.titulo} - {ag.cliente_nome} ({formatarData(ag.data_agendamento)} {ag.hora_inicio.slice(0, 5)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Tipo de Lembrete</label>
                  <div className={styles.tipoOptions}>
                    {Object.entries(TIPO_LABELS).map(([value, { label, icon }]) => (
                      <label
                        key={value}
                        className={`${styles.tipoOption} ${formData.tipo === value ? styles.selected : ''}`}
                      >
                        <input
                          type="radio"
                          name="tipo"
                          value={value}
                          checked={formData.tipo === value}
                          onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as 'notificacao' | 'email' | 'whatsapp' }))}
                        />
                        {icon}
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Tempo de Antecedência</label>
                  <select
                    value={formData.tempo_antes_minutos}
                    onChange={(e) => setFormData(prev => ({ ...prev, tempo_antes_minutos: Number(e.target.value) }))}
                  >
                    {TEMPO_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Mensagem Personalizada (opcional)</label>
                  <textarea
                    value={formData.mensagem}
                    onChange={(e) => setFormData(prev => ({ ...prev, mensagem: e.target.value }))}
                    placeholder="Deixe em branco para usar a mensagem padrão"
                    rows={3}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Criar Lembrete
                </button>
              </div>
            </form>
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
