-- ====================================================================
-- SCRIPT DE AUDITORIA E SEGURO DE ROW LEVEL SECURITY (RLS) - SUPABASE
-- MINHAS FINANÇAS - ISOLAMENTO WORKSPACE / CASAL
-- ====================================================================

-- 1. HABILITAR RLS EM TODAS AS TABELAS PRINCIPAIS
ALTER TABLE public.grupos_familiares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros_grupo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rateios_transacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aportes_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes_recorrentes ENABLE ROW LEVEL SECURITY;

-- 2. FUNÇÃO AUXILIAR PARA VERIFICAR PERTENCIMENTO AO GRUPO
CREATE OR REPLACE FUNCTION public.usuario_pertence_ao_grupo(p_grupo_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.membros_grupo mg
        WHERE mg.grupo_id = p_grupo_id
          AND mg.user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. POLÍTICAS RLS PARA TRANSAÇÕES
DROP POLICY IF EXISTS "Acesso_Transacoes_Grupo" ON public.transacoes;

CREATE POLICY "Acesso_Transacoes_Grupo" ON public.transacoes
    FOR ALL
    USING (
        user_id = auth.uid() 
        OR (grupo_id IS NOT NULL AND public.usuario_pertence_ao_grupo(grupo_id))
    )
    WITH CHECK (
        user_id = auth.uid() 
        OR (grupo_id IS NOT NULL AND public.usuario_pertence_ao_grupo(grupo_id))
    );

-- 4. POLÍTICAS RLS PARA ORÇAMENTOS
DROP POLICY IF EXISTS "Acesso_Orcamentos_Grupo" ON public.orcamentos;

CREATE POLICY "Acesso_Orcamentos_Grupo" ON public.orcamentos
    FOR ALL
    USING (
        user_id = auth.uid() 
        OR (grupo_id IS NOT NULL AND public.usuario_pertence_ao_grupo(grupo_id))
    )
    WITH CHECK (
        user_id = auth.uid() 
        OR (grupo_id IS NOT NULL AND public.usuario_pertence_ao_grupo(grupo_id))
    );

-- 5. POLÍTICAS RLS PARA METAS & APORTES
DROP POLICY IF EXISTS "Acesso_Metas_Grupo" ON public.metas;

CREATE POLICY "Acesso_Metas_Grupo" ON public.metas
    FOR ALL
    USING (
        user_criador_id = auth.uid() 
        OR (grupo_id IS NOT NULL AND public.usuario_pertence_ao_grupo(grupo_id))
    )
    WITH CHECK (
        user_criador_id = auth.uid() 
        OR (grupo_id IS NOT NULL AND public.usuario_pertence_ao_grupo(grupo_id))
    );

DROP POLICY IF EXISTS "Acesso_Aportes_Grupo" ON public.aportes_meta;

CREATE POLICY "Acesso_Aportes_Grupo" ON public.aportes_meta
    FOR ALL
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.metas m
            WHERE m.id = aportes_meta.meta_id
              AND (m.user_criador_id = auth.uid() OR public.usuario_pertence_ao_grupo(m.grupo_id))
        )
    )
    WITH CHECK (
        user_id = auth.uid()
    );

-- 6. POLÍTICAS RLS PARA RATEIOS DE TRANSAÇÃO (CASAL 50/50)
DROP POLICY IF EXISTS "Acesso_Rateios_Grupo" ON public.rateios_transacao;

CREATE POLICY "Acesso_Rateios_Grupo" ON public.rateios_transacao
    FOR ALL
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.transacoes t
            WHERE t.id = rateios_transacao.transacao_id
              AND (t.user_id = auth.uid() OR (t.grupo_id IS NOT NULL AND public.usuario_pertence_ao_grupo(t.grupo_id)))
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.transacoes t
            WHERE t.id = rateios_transacao.transacao_id
              AND (t.user_id = auth.uid() OR (t.grupo_id IS NOT NULL AND public.usuario_pertence_ao_grupo(t.grupo_id)))
        )
    );

-- 7. CHECKLIST & AUDITORIA VISUAL DO STATUS RLS
SELECT 
    schemaname, 
    tablename, 
    rowsecurity AS rls_habilitado
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'transacoes', 
    'orcamentos', 
    'metas', 
    'aportes_meta', 
    'rateios_transacao', 
    'contas', 
    'cartoes', 
    'categorias',
    'grupos_familiares',
    'membros_grupo'
  )
ORDER BY tablename;
