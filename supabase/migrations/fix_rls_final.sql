-- ====================================================================
-- SCRIPT DEFINITIVO: RESET COMPLETO DAS POLÍTICAS RLS
-- Projeto: Minhas Finanças
-- ====================================================================

-- PASSO 1: Criar funções auxiliares SECURITY DEFINER (quebram recursão)
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

-- PASSO 2: Remover TODAS as políticas existentes (limpeza dinâmica)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'grupos_familiares' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.grupos_familiares', r.policyname);
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'membros_grupo' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.membros_grupo', r.policyname);
    END LOOP;
END $$;

-- PASSO 3: Garantir RLS ativado
ALTER TABLE public.grupos_familiares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros_grupo ENABLE ROW LEVEL SECURITY;

-- PASSO 4: Políticas para "grupos_familiares"
-- INSERT: qualquer usuário autenticado pode criar um grupo
CREATE POLICY "gf_insert" ON public.grupos_familiares
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- SELECT: criador ou membro do grupo
CREATE POLICY "gf_select" ON public.grupos_familiares
  FOR SELECT 
  USING (
    user_criador_id = auth.uid() 
    OR public.usuario_pertence_ao_grupo(id)
  );

-- UPDATE: criador ou membro do grupo
CREATE POLICY "gf_update" ON public.grupos_familiares
  FOR UPDATE 
  USING (
    user_criador_id = auth.uid() 
    OR public.usuario_pertence_ao_grupo(id)
  );

-- DELETE: somente o criador
CREATE POLICY "gf_delete" ON public.grupos_familiares
  FOR DELETE 
  USING (user_criador_id = auth.uid());

-- PASSO 5: Políticas para "membros_grupo"
-- INSERT: qualquer usuário autenticado pode adicionar membros (RPC controla a lógica de negócio)
CREATE POLICY "mg_insert" ON public.membros_grupo
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- SELECT: próprio usuário ou membros do grupo
CREATE POLICY "mg_select" ON public.membros_grupo
  FOR SELECT 
  USING (
    user_id = auth.uid()
    OR public.usuario_pertence_ao_grupo(grupo_id)
  );

-- UPDATE: próprio usuário ou admin do grupo
CREATE POLICY "mg_update" ON public.membros_grupo
  FOR UPDATE 
  USING (
    user_id = auth.uid()
    OR public.usuario_e_admin_do_grupo(grupo_id)
  );

-- DELETE: próprio usuário ou admin do grupo
CREATE POLICY "mg_delete" ON public.membros_grupo
  FOR DELETE 
  USING (
    user_id = auth.uid()
    OR public.usuario_e_admin_do_grupo(grupo_id)
  );

-- PASSO 6: Garantir FK entre membros_grupo e perfis (para joins automáticos)
ALTER TABLE public.membros_grupo
  DROP CONSTRAINT IF EXISTS fk_membros_grupo_perfis;

ALTER TABLE public.membros_grupo
  ADD CONSTRAINT fk_membros_grupo_perfis
  FOREIGN KEY (user_id)
  REFERENCES public.perfis(id)
  ON DELETE CASCADE;

-- PASSO 6B: Garantir políticas RLS na tabela "perfis" (permitir leitura dos parceiros)
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

DO $$ 
DECLARE r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'perfis' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.perfis', r.policyname);
    END LOOP;
END $$;

CREATE POLICY "perfis_select" ON public.perfis FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "perfis_insert" ON public.perfis FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "perfis_update" ON public.perfis FOR UPDATE USING (id = auth.uid());

-- PASSO 7: Sincronizar perfis para usuários já existentes
INSERT INTO public.perfis (id, nome, email)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'nome', split_part(email, '@', 1)), 
  email
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- PASSO 8: Atualizar/Criar função RPC vincular_parceiro
CREATE OR REPLACE FUNCTION public.vincular_parceiro(
    email_convidado TEXT, 
    p_grupo_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_ja_membro BOOLEAN;
    v_nome_convidado TEXT;
BEGIN
    email_convidado := LOWER(TRIM(email_convidado));

    IF email_convidado IS NULL OR email_convidado = '' THEN
        RAISE EXCEPTION 'O e-mail do parceiro(a) é obrigatório.';
    END IF;

    SELECT id, nome INTO v_user_id, v_nome_convidado 
    FROM public.perfis 
    WHERE LOWER(email) = email_convidado;

    IF v_user_id IS NULL THEN
        SELECT id, COALESCE(raw_user_meta_data->>'nome', split_part(email, '@', 1)) 
        INTO v_user_id, v_nome_convidado
        FROM auth.users 
        WHERE LOWER(email) = email_convidado;

        IF v_user_id IS NOT NULL THEN
            INSERT INTO public.perfis (id, nome, email)
            VALUES (v_user_id, v_nome_convidado, email_convidado)
            ON CONFLICT (id) DO NOTHING;
        END IF;
    END IF;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Conta não encontrada com o e-mail "%". Peça para seu parceiro(a) se cadastrar no app primeiro.', email_convidado;
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.membros_grupo 
        WHERE grupo_id = p_grupo_id AND user_id = v_user_id
    ) INTO v_ja_membro;

    IF v_ja_membro THEN
        RAISE EXCEPTION 'O e-mail "%" já faz parte do seu grupo familiar!', email_convidado;
    END IF;

    INSERT INTO public.membros_grupo (grupo_id, user_id, papel)
    VALUES (p_grupo_id, v_user_id, 'membro');

    RETURN jsonb_build_object(
        'sucesso', true,
        'user_id', v_user_id,
        'mensagem', format('Parceiro(a) %s foi vinculado(a) com sucesso ao seu workspace!', COALESCE(v_nome_convidado, email_convidado))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.vincular_parceiro(TEXT, UUID) TO authenticated;

-- VERIFICAÇÃO FINAL: Listar todas as políticas criadas
SELECT tablename, policyname, cmd
FROM pg_policies 
WHERE tablename IN ('grupos_familiares', 'membros_grupo') 
  AND schemaname = 'public'
ORDER BY tablename, policyname;
