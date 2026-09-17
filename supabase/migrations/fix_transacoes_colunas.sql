-- ====================================================================
-- MIGRATION: Garantir colunas da tabela transacoes + Refresh Schema Cache
-- Projeto: MinhasFinanças
-- ====================================================================

-- Adicionar cartao_id se não existir (FK para cartoes)
ALTER TABLE public.transacoes
  ADD COLUMN IF NOT EXISTS cartao_id UUID REFERENCES public.cartoes(id) ON DELETE SET NULL;

-- Adicionar grupo_id se não existir (FK para grupos_familiares)
ALTER TABLE public.transacoes
  ADD COLUMN IF NOT EXISTS grupo_id UUID REFERENCES public.grupos_familiares(id) ON DELETE CASCADE;

-- Adicionar conta_id se não existir (FK para contas)
ALTER TABLE public.transacoes
  ADD COLUMN IF NOT EXISTS conta_id UUID REFERENCES public.contas(id) ON DELETE SET NULL;

-- Adicionar categoria_id se não existir (FK para categorias)
ALTER TABLE public.transacoes
  ADD COLUMN IF NOT EXISTS categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL;

-- Adicionar pago se não existir
ALTER TABLE public.transacoes
  ADD COLUMN IF NOT EXISTS pago BOOLEAN DEFAULT true;

-- Adicionar observacao se não existir
ALTER TABLE public.transacoes
  ADD COLUMN IF NOT EXISTS observacao TEXT;

-- Adicionar parcela_atual se não existir
ALTER TABLE public.transacoes
  ADD COLUMN IF NOT EXISTS parcela_atual INT DEFAULT 1;

-- Adicionar total_parcelas se não existir
ALTER TABLE public.transacoes
  ADD COLUMN IF NOT EXISTS total_parcelas INT DEFAULT 1;

-- Atualizar CHECK de tipo para permitir 'transferencia_interna'
ALTER TABLE public.transacoes DROP CONSTRAINT IF EXISTS transacoes_tipo_check;
ALTER TABLE public.transacoes ADD CONSTRAINT transacoes_tipo_check
  CHECK (tipo IN ('receita', 'despesa', 'transferencia_interna'));

-- Forçar reload do schema cache do PostgREST
-- Isso faz o PostgREST recarregar as definições de tabela imediatamente
NOTIFY pgrst, 'reload schema';

-- Verificar colunas criadas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'transacoes'
ORDER BY ordinal_position;
