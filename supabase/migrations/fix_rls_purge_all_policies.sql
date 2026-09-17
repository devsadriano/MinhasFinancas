-- ====================================================================
-- MIGRATION: REMOVER TODAS AS POLÍTICAS ANTIGAS E REAPLICAR RLS LIMPO
-- Projeto: Minhas Finanças - Workspaces & Grupos
-- ====================================================================

-- 1. FUNÇÕES AUXILIARES COM "SECURITY DEFINER" (Bypass RLS para evitar recursão)
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

CREATE OR REPLACE FUNCTION public.usuario_e_admin_do_grupo(p_grupo_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.membros_grupo mg
        WHERE mg.grupo_id = p_grupo_id
          AND mg.user_id = auth.uid()
          AND mg.papel = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. GARANTIR A CHAVE ESTRANGEIRA DE MEMBROS_GRUPO COM PERFIS
ALTER TABLE public.membros_grupo
  DROP CONSTRAINT IF EXISTS fk_membros_grupo_perfis;

ALTER TABLE public.membros_grupo
  ADD CONSTRAINT fk_membros_grupo_perfis
  FOREIGN KEY (user_id)
  REFERENCES public.perfis(id)
  ON DELETE CASCADE;

-- 3. LIMPEZA TOTAL DE POLÍTICAS ANTIGAS NAS TABELAS CONFLITANTES
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Limpa todas as políticas existentes em grupos_familiares
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'grupos_familiares' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.grupos_familiares', r.policyname);
    END LOOP;
    
    -- Limpa todas as políticas existentes em membros_grupo
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'membros_grupo' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.membros_grupo', r.policyname);
    END LOOP;
END $$;

-- 4. HABILITAR RLS NAS TABELAS
ALTER TABLE public.grupos_familiares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros_grupo ENABLE ROW LEVEL SECURITY;

-- 5. NOVAS POLÍTICAS LIMPAS E PERMISSIVAS PARA "grupos_familiares"
CREATE POLICY "gf_insert" ON public.grupos_familiares
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "gf_select" ON public.grupos_familiares
  FOR SELECT USING (user_criador_id = auth.uid() OR public.usuario_pertence_ao_grupo(id));

CREATE POLICY "gf_update" ON public.grupos_familiares
  FOR UPDATE USING (user_criador_id = auth.uid() OR public.usuario_pertence_ao_grupo(id));

CREATE POLICY "gf_delete" ON public.grupos_familiares
  FOR DELETE USING (user_criador_id = auth.uid());

-- 6. NOVAS POLÍTICAS LIMPAS E PERMISSIVAS PARA "membros_grupo"
CREATE POLICY "mg_insert" ON public.membros_grupo
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "mg_select" ON public.membros_grupo
  FOR SELECT USING (user_id = auth.uid() OR public.usuario_pertence_ao_grupo(grupo_id));

CREATE POLICY "mg_update" ON public.membros_grupo
  FOR UPDATE USING (user_id = auth.uid() OR public.usuario_e_admin_do_grupo(grupo_id));

CREATE POLICY "mg_delete" ON public.membros_grupo
  FOR DELETE USING (user_id = auth.uid() OR public.usuario_e_admin_do_grupo(grupo_id));

-- 7. SINCRONIZAR PERFIS PARA USUÁRIOS EXISTENTES
INSERT INTO public.perfis (id, nome, email)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'nome', split_part(email, '@', 1)), 
  email
FROM auth.users
ON CONFLICT (id) DO NOTHING;
