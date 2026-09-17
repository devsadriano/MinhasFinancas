-- ====================================================================
-- MIGRATION: AJUSTE DE CHAVE ESTRANGEIRA E POLÍTICAS RLS DO WORKSPACE
-- Projeto: Minhas Finanças
-- ====================================================================

-- 1. Garante a Chave Estrangeira entre membros_grupo(user_id) e perfis(id)
-- Isso permite que o PostgREST (Supabase JS) faça joins automáticos .select('*, perfis(*)')
ALTER TABLE public.membros_grupo
  DROP CONSTRAINT IF EXISTS fk_membros_grupo_perfis;

ALTER TABLE public.membros_grupo
  ADD CONSTRAINT fk_membros_grupo_perfis
  FOREIGN KEY (user_id)
  REFERENCES public.perfis(id)
  ON DELETE CASCADE;

-- 2. Atualizar Políticas de RLS em grupos_familiares
DROP POLICY IF EXISTS "Membros leem o proprio grupo" ON public.grupos_familiares;
DROP POLICY IF EXISTS "Criador gerencia o grupo" ON public.grupos_familiares;
DROP POLICY IF EXISTS "Todos membros atualizam o grupo" ON public.grupos_familiares;
DROP POLICY IF EXISTS "Usuarios autenticados criam grupo" ON public.grupos_familiares;

-- Leitura: Qualquer membro do grupo ou o criador
CREATE POLICY "Membros leem o proprio grupo" ON public.grupos_familiares 
  FOR SELECT USING (
    user_criador_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.membros_grupo mg 
      WHERE mg.grupo_id = grupos_familiares.id AND mg.user_id = auth.uid()
    )
  );

-- Criação: Qualquer usuário autenticado pode criar um grupo
CREATE POLICY "Usuarios autenticados criam grupo" ON public.grupos_familiares
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_criador_id = auth.uid());

-- Atualização (Ex: Mudar nome do workspace): Qualquer membro do grupo ou criador
CREATE POLICY "Todos membros atualizam o grupo" ON public.grupos_familiares
  FOR UPDATE USING (
    user_criador_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.membros_grupo mg 
      WHERE mg.grupo_id = grupos_familiares.id AND mg.user_id = auth.uid()
    )
  );

-- Exclusão: Apenas o criador
CREATE POLICY "Criador deleta o grupo" ON public.grupos_familiares
  FOR DELETE USING (user_criador_id = auth.uid());

-- 3. Atualizar Políticas de RLS em membros_grupo
DROP POLICY IF EXISTS "Membros leem participantes do grupo" ON public.membros_grupo;
DROP POLICY IF EXISTS "Admin adiciona membros" ON public.membros_grupo;
DROP POLICY IF EXISTS "Inserir proprio membro ao criar grupo" ON public.membros_grupo;

-- Leitura: Membro do próprio grupo ou o próprio usuário
CREATE POLICY "Membros leem participantes do grupo" ON public.membros_grupo
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.membros_grupo mg 
      WHERE mg.grupo_id = membros_grupo.grupo_id AND mg.user_id = auth.uid()
    )
  );

-- Inserção: O próprio usuário ao criar grupo OU admin do grupo
CREATE POLICY "Inserir membros no grupo" ON public.membros_grupo
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.grupos_familiares gf 
      WHERE gf.id = membros_grupo.grupo_id AND gf.user_criador_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.membros_grupo mg 
      WHERE mg.grupo_id = membros_grupo.grupo_id AND mg.user_id = auth.uid() AND mg.papel = 'admin'
    )
  );

-- 4. Garantir que perfis existam para todos os usuários do auth
INSERT INTO public.perfis (id, nome, email)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'nome', split_part(email, '@', 1)), 
  email
FROM auth.users
ON CONFLICT (id) DO NOTHING;
