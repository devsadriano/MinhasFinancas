-- ====================================================================
-- SCRIPT DE CORREÇÃO DEFINITIVA: REMOVER RECURSÃO INFINITA EM RLS
-- Projeto: Minhas Finanças - Workspace & Grupos Familiares
-- Error Code: 42P17 (infinite recursion detected in policy for relation "membros_grupo")
-- ====================================================================

-- 1. FUNÇÕES AUXILIARES COM "SECURITY DEFINER" (Bypass RLS para evitar loops infinitos)
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

-- 2. GARANTIR A CHAVE ESTRANGEIRA PARA JOINS AUTOMÁTICOS DO SUPABASE JS
ALTER TABLE public.membros_grupo
  DROP CONSTRAINT IF EXISTS fk_membros_grupo_perfis;

ALTER TABLE public.membros_grupo
  ADD CONSTRAINT fk_membros_grupo_perfis
  FOREIGN KEY (user_id)
  REFERENCES public.perfis(id)
  ON DELETE CASCADE;

-- 3. RESET DE POLÍTICAS DE RLS NA TABELA "grupos_familiares"
DROP POLICY IF EXISTS "Membros leem o proprio grupo" ON public.grupos_familiares;
DROP POLICY IF EXISTS "Criador gerencia o grupo" ON public.grupos_familiares;
DROP POLICY IF EXISTS "Todos membros atualizam o grupo" ON public.grupos_familiares;
DROP POLICY IF EXISTS "Usuarios autenticados criam grupo" ON public.grupos_familiares;
DROP POLICY IF EXISTS "Criador deleta o grupo" ON public.grupos_familiares;

CREATE POLICY "Leitura_Grupos_Familiares" ON public.grupos_familiares 
  FOR SELECT USING (
    user_criador_id = auth.uid() 
    OR public.usuario_pertence_ao_grupo(id)
  );

CREATE POLICY "Criacao_Grupos_Familiares" ON public.grupos_familiares
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Atualizacao_Grupos_Familiares" ON public.grupos_familiares
  FOR UPDATE USING (
    user_criador_id = auth.uid() 
    OR public.usuario_pertence_ao_grupo(id)
  );

CREATE POLICY "Exclusao_Grupos_Familiares" ON public.grupos_familiares
  FOR DELETE USING (
    user_criador_id = auth.uid()
  );

-- 4. RESET DE POLÍTICAS DE RLS NA TABELA "membros_grupo"
DROP POLICY IF EXISTS "Membros leem participantes do grupo" ON public.membros_grupo;
DROP POLICY IF EXISTS "Admin adiciona membros" ON public.membros_grupo;
DROP POLICY IF EXISTS "Inserir proprio membro ao criar grupo" ON public.membros_grupo;
DROP POLICY IF EXISTS "Inserir membros no grupo" ON public.membros_grupo;

CREATE POLICY "Leitura_Membros_Grupo" ON public.membros_grupo
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.usuario_pertence_ao_grupo(grupo_id)
  );

CREATE POLICY "Insercao_Membros_Grupo" ON public.membros_grupo
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR public.usuario_pertence_ao_grupo(grupo_id)
  );

CREATE POLICY "Atualizacao_Membros_Grupo" ON public.membros_grupo
  FOR UPDATE USING (
    user_id = auth.uid()
    OR public.usuario_e_admin_do_grupo(grupo_id)
  );

CREATE POLICY "Exclusao_Membros_Grupo" ON public.membros_grupo
  FOR DELETE USING (
    user_id = auth.uid()
    OR public.usuario_e_admin_do_grupo(grupo_id)
  );

-- 5. ASSEGURAR QUE PERFIL EXISTA PARA TODOS OS USUÁRIOS DO AUTH
INSERT INTO public.perfis (id, nome, email)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'nome', split_part(email, '@', 1)), 
  email
FROM auth.users
ON CONFLICT (id) DO NOTHING;
