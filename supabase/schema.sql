-- =============================================
-- Schema SQL para Minhas Finanças no Supabase
-- Projeto: zhldshlvhrqytartkpfs | Região: sa-east-1 (São Paulo)
-- =============================================

-- =============================================
-- 1. Tabela de Perfis de Usuário
-- =============================================
CREATE TABLE IF NOT EXISTS public.perfis (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  moeda VARCHAR(10) DEFAULT 'BRL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 2. Tabela de Contas / Bancos
-- =============================================
CREATE TABLE IF NOT EXISTS public.contas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) DEFAULT 'Conta Corrente',
  saldo DECIMAL(12, 2) DEFAULT 0.00,
  cor VARCHAR(20) DEFAULT '#3ecf8e',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 3. Tabela de Cartões de Crédito
-- =============================================
CREATE TABLE IF NOT EXISTS public.cartoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome VARCHAR(100) NOT NULL,
  bandeira VARCHAR(50) DEFAULT 'Mastercard',
  limite DECIMAL(12, 2) DEFAULT 5000.00,
  dia_fechamento INT DEFAULT 1,
  dia_vencimento INT DEFAULT 10,
  cor VARCHAR(20) DEFAULT '#820ad1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 4. Tabela de Categorias
-- =============================================
CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  icone VARCHAR(10) DEFAULT '💰',
  cor VARCHAR(20) DEFAULT '#3ecf8e',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 5. Tabela de Transações / Lançamentos
-- =============================================
CREATE TABLE IF NOT EXISTS public.transacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  conta_id UUID REFERENCES public.contas(id) ON DELETE SET NULL,
  cartao_id UUID REFERENCES public.cartoes(id) ON DELETE SET NULL,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(12, 2) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  data DATE NOT NULL,
  pago BOOLEAN DEFAULT true,
  observacao TEXT,
  parcela_atual INT DEFAULT 1,
  total_parcelas INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 6. Tabela de Orçamentos por Categoria/Mês
-- =============================================
CREATE TABLE IF NOT EXISTS public.orcamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE CASCADE,
  categoria_nome VARCHAR(100) NOT NULL,
  limite DECIMAL(12, 2) NOT NULL DEFAULT 0,
  mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INT NOT NULL,
  icone VARCHAR(10) DEFAULT '💰',
  cor VARCHAR(20) DEFAULT '#3ecf8e',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, categoria_nome, mes, ano)
);

-- =============================================
-- 7. Tabela de Metas de Economia (Caixinhas)
-- =============================================
CREATE TABLE IF NOT EXISTS public.metas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  icone VARCHAR(10) DEFAULT '🎯',
  alvo DECIMAL(12, 2) NOT NULL,
  atual DECIMAL(12, 2) DEFAULT 0,
  prazo DATE,
  cor VARCHAR(20) DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 8. Tabela de Transferências Entre Contas
-- =============================================
CREATE TABLE IF NOT EXISTS public.transferencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  conta_origem_id UUID REFERENCES public.contas(id) ON DELETE CASCADE NOT NULL,
  conta_destino_id UUID REFERENCES public.contas(id) ON DELETE CASCADE NOT NULL,
  valor DECIMAL(12, 2) NOT NULL,
  descricao VARCHAR(255) DEFAULT 'Transferência entre contas',
  data DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 9. Row Level Security (RLS)
-- =============================================
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transferencias ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem (evitar conflito)
DROP POLICY IF EXISTS "Usuário acessa próprio perfil" ON public.perfis;
DROP POLICY IF EXISTS "Usuário acessa próprias contas" ON public.contas;
DROP POLICY IF EXISTS "Usuário acessa próprios cartões" ON public.cartoes;
DROP POLICY IF EXISTS "Usuário acessa próprias categorias" ON public.categorias;
DROP POLICY IF EXISTS "Usuário acessa próprias transações" ON public.transacoes;

-- Políticas de RLS
CREATE POLICY "Usuário acessa próprio perfil" ON public.perfis FOR ALL USING (auth.uid() = id);
CREATE POLICY "Usuário acessa próprias contas" ON public.contas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário acessa próprios cartões" ON public.cartoes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário acessa próprias categorias" ON public.categorias FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Usuário acessa próprias transações" ON public.transacoes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário acessa próprios orçamentos" ON public.orcamentos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário acessa próprias metas" ON public.metas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuário acessa próprias transferências" ON public.transferencias FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 10. Trigger: Criar perfil automaticamente ao registrar usuário
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfis (id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 11. Categorias Padrão Globais (user_id NULL = todos os usuários)
-- =============================================
INSERT INTO public.categorias (nome, tipo, icone, cor, user_id) VALUES
  -- Receitas
  ('Salário',             'receita', '💼', '#3ecf8e', NULL),
  ('Freelance',           'receita', '💻', '#3b82f6', NULL),
  ('Investimentos',       'receita', '📈', '#10b981', NULL),
  ('Outros Rendimentos',  'receita', '💰', '#06b6d4', NULL),
  -- Despesas
  ('Alimentação',         'despesa', '🍽️', '#ef4444', NULL),
  ('Transporte',          'despesa', '🚗', '#f97316', NULL),
  ('Moradia',             'despesa', '🏠', '#8b5cf6', NULL),
  ('Saúde',               'despesa', '🏥', '#ec4899', NULL),
  ('Educação',            'despesa', '📚', '#6366f1', NULL),
  ('Lazer',               'despesa', '🎮', '#f59e0b', NULL),
  ('Roupas',              'despesa', '👕', '#84cc16', NULL),
  ('Contas e Serviços',   'despesa', '💡', '#14b8a6', NULL),
  ('Mercado',             'despesa', '🛒', '#f43f5e', NULL),
  ('Outros Gastos',       'despesa', '💸', '#94a3b8', NULL)
ON CONFLICT DO NOTHING;

-- =============================================
-- INSTRUÇÕES DE EXECUÇÃO NO SUPABASE:
-- 1. Acesse: https://supabase.com/dashboard/project/zhldshlvhrqytartkpfs/sql
-- 2. Cole este arquivo e execute
-- 3. As tabelas orcamentos, metas e transferencias serão criadas
-- =============================================
