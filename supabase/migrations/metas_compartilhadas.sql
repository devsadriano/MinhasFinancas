-- ====================================================================
-- TABELA DE METAS COMPARTILHADAS (CAIXINHAS)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.metas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id UUID REFERENCES public.grupos_familiares(id) ON DELETE CASCADE,
    user_criador_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    valor_alvo NUMERIC(12, 2) NOT NULL CHECK (valor_alvo > 0),
    icone VARCHAR(50) DEFAULT '🎯',
    cor VARCHAR(50) DEFAULT '#3ecf8e',
    prazo_data DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index para buscas rápidas por grupo
CREATE INDEX IF NOT EXISTS idx_metas_grupo_id ON public.metas(grupo_id);

-- RLS para Metas
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Membros do grupo podem ver metas" ON public.metas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.membros_grupo mg
            WHERE mg.grupo_id = metas.grupo_id
              AND mg.user_id = auth.uid()
        )
    );

CREATE POLICY "Membros do grupo podem criar metas" ON public.metas
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.membros_grupo mg
            WHERE mg.grupo_id = metas.grupo_id
              AND mg.user_id = auth.uid()
        )
    );

CREATE POLICY "Membros do grupo podem atualizar metas" ON public.metas
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.membros_grupo mg
            WHERE mg.grupo_id = metas.grupo_id
              AND mg.user_id = auth.uid()
        )
    );

CREATE POLICY "Membros do grupo podem deletar metas" ON public.metas
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.membros_grupo mg
            WHERE mg.grupo_id = metas.grupo_id
              AND mg.user_id = auth.uid()
        )
    );

-- ====================================================================
-- TABELA DE APORTES DE METAS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.aportes_meta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meta_id UUID NOT NULL REFERENCES public.metas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conta_origem_id UUID REFERENCES public.contas(id) ON DELETE SET NULL,
    valor NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index para buscas de aportes por meta e usuário
CREATE INDEX IF NOT EXISTS idx_aportes_meta_id ON public.aportes_meta(meta_id);
CREATE INDEX IF NOT EXISTS idx_aportes_user_id ON public.aportes_meta(user_id);

-- RLS para Aportes
ALTER TABLE public.aportes_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Membros do grupo podem ver aportes da meta" ON public.aportes_meta
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.metas m
            JOIN public.membros_grupo mg ON mg.grupo_id = m.grupo_id
            WHERE m.id = aportes_meta.meta_id
              AND mg.user_id = auth.uid()
        )
    );

CREATE POLICY "Membros do grupo podem realizar aportes" ON public.aportes_meta
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.metas m
            JOIN public.membros_grupo mg ON mg.grupo_id = m.grupo_id
            WHERE m.id = aportes_meta.meta_id
              AND mg.user_id = auth.uid()
        )
    );
