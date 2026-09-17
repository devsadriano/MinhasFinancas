-- ====================================================================
-- DATABASE FUNCTION (RPC): VINCULAR PARCEIRO AO GRUPO FAMILIAR
-- Executada com SECURITY DEFINER para ler a tabela de perfis ignorando RLS
-- ====================================================================

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
    -- 1. Normalizar o e-mail recebido
    email_convidado := LOWER(TRIM(email_convidado));

    IF email_convidado IS NULL OR email_convidado = '' THEN
        RAISE EXCEPTION 'O e-mail do parceiro(a) é obrigatório.';
    END IF;

    -- 2. Buscar o id e nome do perfil cadastrado no sistema
    SELECT id, nome INTO v_user_id, v_nome_convidado 
    FROM public.perfis 
    WHERE LOWER(email) = email_convidado;

    -- 3. Se a conta não existir no app, dispara mensagem clara
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Conta não encontrada com o e-mail "%". Peça para seu parceiro(a) se cadastrar no app primeiro.', email_convidado;
    END IF;

    -- 4. Verificar se a pessoa já faz parte deste mesmo grupo
    SELECT EXISTS (
        SELECT 1 
        FROM public.membros_grupo 
        WHERE grupo_id = p_grupo_id 
          AND user_id = v_user_id
    ) INTO v_ja_membro;

    IF v_ja_membro THEN
        RAISE EXCEPTION 'O e-mail "%" já faz parte do seu grupo familiar!', email_convidado;
    END IF;

    -- 5. Inserir o novo membro com o papel de 'membro'
    INSERT INTO public.membros_grupo (grupo_id, user_id, papel)
    VALUES (p_grupo_id, v_user_id, 'membro');

    -- 6. Retornar objeto JSON de sucesso
    RETURN jsonb_build_object(
        'sucesso', true,
        'user_id', v_user_id,
        'mensagem', format('Parceiro(a) %s foi vinculado(a) com sucesso ao seu workspace!', COALESCE(v_nome_convidado, email_convidado))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Conceder permissão de execução para usuários autenticados
GRANT EXECUTE ON FUNCTION public.vincular_parceiro(TEXT, UUID) TO authenticated;
