-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_telefone VARCHAR(20),
  cliente_email VARCHAR(255),
  colaborador_id INTEGER,
  colaborador_nome VARCHAR(255),
  servico_id INTEGER,
  servico_nome VARCHAR(255),
  data_agendamento DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME,
  valor DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado', 'nao_compareceu')),
  observacoes TEXT,
  user_id UUID NOT NULL,
  empresa_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de lembretes
CREATE TABLE IF NOT EXISTS public.lembretes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agendamento_id UUID NOT NULL REFERENCES public.agendamentos(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('notificacao', 'email', 'whatsapp')),
  tempo_antes_minutos INTEGER NOT NULL DEFAULT 60,
  mensagem TEXT,
  enviado BOOLEAN DEFAULT FALSE,
  data_envio TIMESTAMP WITH TIME ZONE,
  erro_envio TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações in-app
CREATE TABLE IF NOT EXISTS public.notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'info' CHECK (tipo IN ('info', 'success', 'warning', 'error', 'agendamento')),
  lida BOOLEAN DEFAULT FALSE,
  link VARCHAR(500),
  agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do usuário (tema, preferências)
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  tema VARCHAR(20) DEFAULT 'dark' CHECK (tema IN ('light', 'dark', 'system')),
  notificacoes_ativas BOOLEAN DEFAULT TRUE,
  lembretes_email BOOLEAN DEFAULT TRUE,
  lembretes_whatsapp BOOLEAN DEFAULT FALSE,
  tempo_lembrete_padrao INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_agendamentos_user_id ON public.agendamentos(user_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON public.agendamentos(data_agendamento);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON public.agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_lembretes_agendamento_id ON public.lembretes(agendamento_id);
CREATE INDEX IF NOT EXISTS idx_lembretes_enviado ON public.lembretes(enviado);
CREATE INDEX IF NOT EXISTS idx_notificacoes_user_id ON public.notificacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON public.notificacoes(lida);

-- Habilitar RLS
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para agendamentos
CREATE POLICY "agendamentos_select_own" ON public.agendamentos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "agendamentos_insert_own" ON public.agendamentos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "agendamentos_update_own" ON public.agendamentos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "agendamentos_delete_own" ON public.agendamentos FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para lembretes
CREATE POLICY "lembretes_select_own" ON public.lembretes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "lembretes_insert_own" ON public.lembretes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lembretes_update_own" ON public.lembretes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "lembretes_delete_own" ON public.lembretes FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para notificações
CREATE POLICY "notificacoes_select_own" ON public.notificacoes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notificacoes_insert_own" ON public.notificacoes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notificacoes_update_own" ON public.notificacoes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notificacoes_delete_own" ON public.notificacoes FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para user_settings
CREATE POLICY "user_settings_select_own" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_settings_insert_own" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_settings_update_own" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_settings_delete_own" ON public.user_settings FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_agendamentos_updated_at ON public.agendamentos;
CREATE TRIGGER update_agendamentos_updated_at
  BEFORE UPDATE ON public.agendamentos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
