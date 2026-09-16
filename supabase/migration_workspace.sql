-- =============================================
-- Migration: Arquitetura Workspace / Casal (Multi-Usuário & Rateio 50/50)
-- Projeto: MinhasFinanças no Supabase
-- =============================================

-- 1. Tabela de Grupos Familiares (Workspaces)
CREATE TABLE IF NOT EXISTS public.grupos_familiares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  user_criador_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Relacionamento (Membros do Grupo)
CREATE TABLE IF NOT EXISTS public.membros_grupo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  grupo_id UUID REFERENCES public.grupos_familiares(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  papel VARCHAR(20) DEFAULT 'membro' CHECK (papel IN ('admin', 'membro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (grupo_id, user_id)
);

-- 3. Adicionar coluna grupo_id nas tabelas existentes
ALTER TABLE public.contas ADD COLUMN IF NOT EXISTS grupo_id UUID REFERENCES public.grupos_familiares(id) ON DELETE CASCADE;
ALTER TABLE public.cartoes ADD COLUMN IF NOT EXISTS grupo_id UUID REFERENCES public.grupos_familiares(id) ON DELETE CASCADE;
ALTER TABLE public.categorias ADD COLUMN IF NOT EXISTS grupo_id UUID REFERENCES public.grupos_familiares(id) ON DELETE CASCADE;
ALTER TABLE public.transacoes ADD COLUMN IF NOT EXISTS grupo_id UUID REFERENCES public.grupos_familiares(id) ON DELETE CASCADE;
ALTER TABLE public.orcamentos ADD COLUMN IF NOT EXISTS grupo_id UUID REFERENCES public.grupos_familiares(id) ON DELETE CASCADE;
ALTER TABLE public.metas ADD COLUMN IF NOT EXISTS grupo_id UUID REFERENCES public.grupos_familiares(id) ON DELETE CASCADE;
ALTER TABLE public.transferencias ADD COLUMN IF NOT EXISTS grupo_id UUID REFERENCES public.grupos_familiares(id) ON DELETE CASCADE;

-- Atualizar CHECK de tipo em transacoes para permitir 'transferencia_interna' (acerto de contas)
ALTER TABLE public.transacoes DROP CONSTRAINT IF EXISTS transacoes_tipo_check;
ALTER TABLE public.transacoes ADD CONSTRAINT transacoes_tipo_check CHECK (tipo IN ('receita', 'despesa', 'transferencia_interna'));

-- 4. Tabela de Rateios por Transação (Consumo Real por Pessoa)
CREATE TABLE IF NOT EXISTS public.rateios_transacao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transacao_id UUID REFERENCES public.transacoes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  valor DECIMAL(12, 2) NOT NULL,
  porcentagem DECIMAL(5, 2) DEFAULT 50.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (transacao_id, user_id)
);

-- 5. Tabela de Transações Recorrentes (Processamento Agendado via Edge Function)
CREATE TABLE IF NOT EXISTS public.transacoes_recorrentes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  grupo_id UUID REFERENCES public.grupos_familiares(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  conta_id UUID REFERENCES public.contas(id) ON DELETE SET NULL,
  cartao_id UUID REFERENCES public.cartoes(id) ON DELETE SET NULL,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(12, 2) NOT NULL,
  tipo VARCHAR(20) DEFAULT 'despesa' CHECK (tipo IN ('receita', 'despesa')),
  frequencia VARCHAR(20) DEFAULT 'mensal' CHECK (frequencia IN ('semanal', 'mensal', 'anual')),
  dia_vencimento INT CHECK (dia_vencimento BETWEEN 1 AND 31),
  dividir_50_50 BOOLEAN DEFAULT true,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. VIEW SQL: Acerto de Contas (Saldo entre membros do grupo)
-- Calcula: Total Pago de Bolso (quem pagou) minus Total Consumido (rateio real)
CREATE OR REPLACE VIEW public.v_acerto_de_contas AS
WITH pagamentos AS (
  -- Total pago de bolso por cada usuário em transações de despesa do grupo
  SELECT 
    t.grupo_id,
    t.user_id AS pagador_user_id,
    COALESCE(SUM(t.valor), 0) AS total_pago
  FROM public.transacoes t
  WHERE t.tipo = 'despesa' AND t.grupo_id IS NOT NULL
  GROUP BY t.grupo_id, t.user_id
),
consumos AS (
  -- Total consumido por cada usuário via rateios_transacao
  SELECT 
    t.grupo_id,
    r.user_id AS consumidor_user_id,
    COALESCE(SUM(r.valor), 0) AS total_consumido
  FROM public.rateios_transacao r
  JOIN public.transacoes t ON r.transacao_id = t.id
  WHERE t.tipo = 'despesa' AND t.grupo_id IS NOT NULL
  GROUP BY t.grupo_id, r.user_id
),
acertos AS (
  -- Transferências internas já efetuadas para liquidação
  SELECT 
    t.grupo_id,
    t.user_id AS pagador_user_id,
    COALESCE(SUM(t.valor), 0) AS total_liquidado
  FROM public.transacoes t
  WHERE t.tipo = 'transferencia_interna' AND t.grupo_id IS NOT NULL
  GROUP BY t.grupo_id, t.user_id
)
SELECT 
  m.grupo_id,
  m.user_id,
  COALESCE(p.total_pago, 0) AS total_pago,
  COALESCE(c.total_consumido, 0) AS total_consumido,
  COALESCE(a.total_liquidado, 0) AS total_liquidado,
  (COALESCE(p.total_pago, 0) - COALESCE(c.total_consumido, 0) + COALESCE(a.total_liquidado, 0)) AS saldo_acerto
FROM public.membros_grupo m
LEFT JOIN pagamentos p ON m.grupo_id = p.grupo_id AND m.user_id = p.pagador_user_id
LEFT JOIN consumos c ON m.grupo_id = c.grupo_id AND m.user_id = c.consumidor_user_id
LEFT JOIN acertos a ON m.grupo_id = a.grupo_id AND m.user_id = a.pagador_user_id;

-- 7. Função Auxiliar RLS: Verificar se usuário pertence ao grupo
CREATE OR REPLACE FUNCTION public.pertence_ao_grupo(p_grupo_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.membros_grupo 
    WHERE grupo_id = p_grupo_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Row Level Security (RLS) baseada em grupo_id
ALTER TABLE public.grupos_familiares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros_grupo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rateios_transacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes_recorrentes ENABLE ROW LEVEL SECURITY;

-- Políticas Grupos e Membros
CREATE POLICY "Membros leem o proprio grupo" ON public.grupos_familiares 
  FOR SELECT USING (public.pertence_ao_grupo(id) OR user_criador_id = auth.uid());

CREATE POLICY "Criador gerencia o grupo" ON public.grupos_familiares 
  FOR ALL USING (user_criador_id = auth.uid());

CREATE POLICY "Membros leem participantes do grupo" ON public.membros_grupo 
  FOR SELECT USING (public.pertence_ao_grupo(grupo_id));

CREATE POLICY "Admin adiciona membros" ON public.membros_grupo 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.membros_grupo 
      WHERE grupo_id = membros_grupo.grupo_id AND user_id = auth.uid() AND papel = 'admin'
    ) OR EXISTS (
      SELECT 1 FROM public.grupos_familiares 
      WHERE id = membros_grupo.grupo_id AND user_criador_id = auth.uid()
    )
  );

-- Atualização das políticas RLS para tabelas compartilhadas por grupo_id
CREATE POLICY "Acesso por grupo ou individual - Contas" ON public.contas 
  FOR ALL USING (user_id = auth.uid() OR (grupo_id IS NOT NULL AND public.pertence_ao_grupo(grupo_id)));

CREATE POLICY "Acesso por grupo ou individual - Cartoes" ON public.cartoes 
  FOR ALL USING (user_id = auth.uid() OR (grupo_id IS NOT NULL AND public.pertence_ao_grupo(grupo_id)));

CREATE POLICY "Acesso por grupo ou individual - Categorias" ON public.categorias 
  FOR ALL USING (user_id = auth.uid() OR user_id IS NULL OR (grupo_id IS NOT NULL AND public.pertence_ao_grupo(grupo_id)));

CREATE POLICY "Acesso por grupo ou individual - Transacoes" ON public.transacoes 
  FOR ALL USING (user_id = auth.uid() OR (grupo_id IS NOT NULL AND public.pertence_ao_grupo(grupo_id)));

CREATE POLICY "Acesso por grupo ou individual - Rateios" ON public.rateios_transacao 
  FOR ALL USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.transacoes t WHERE t.id = rateios_transacao.transacao_id AND public.pertence_ao_grupo(t.grupo_id)
  ));

CREATE POLICY "Acesso por grupo ou individual - Recorrentes" ON public.transacoes_recorrentes 
  FOR ALL USING (user_id = auth.uid() OR public.pertence_ao_grupo(grupo_id));
