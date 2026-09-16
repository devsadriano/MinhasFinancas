-- =============================================
-- Função RPC SQL: obter_progresso_orcamentos
-- Calcula o gasto de despesas x limite orçado por grupo/mês/ano
-- (Ignora transferências internas de acerto de contas)
-- =============================================

CREATE OR REPLACE FUNCTION public.obter_progresso_orcamentos(
  p_grupo_id UUID,
  p_mes INT,
  p_ano INT
)
RETURNS TABLE (
  orcamento_id UUID,
  categoria_id UUID,
  categoria_nome VARCHAR,
  icone VARCHAR,
  cor VARCHAR,
  limite DECIMAL,
  total_gasto DECIMAL,
  porcentagem_utilizada DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH gastos AS (
    SELECT 
      t.categoria_id,
      c.nome AS cat_nome_join,
      COALESCE(SUM(t.valor), 0) AS soma_gasto
    FROM public.transacoes t
    LEFT JOIN public.categorias c ON t.categoria_id = c.id
    WHERE t.tipo = 'despesa' -- Ignora 'transferencia_interna' e 'receita'
      AND (t.grupo_id = p_grupo_id OR (p_grupo_id IS NULL AND t.user_id = auth.uid()))
      AND EXTRACT(MONTH FROM t.data) = p_mes
      AND EXTRACT(YEAR FROM t.data) = p_ano
    GROUP BY t.categoria_id, c.nome
  )
  SELECT 
    o.id AS orcamento_id,
    o.categoria_id,
    o.categoria_nome,
    o.icone,
    o.cor,
    o.limite,
    COALESCE(g.soma_gasto, 0) AS total_gasto,
    CASE 
      WHEN o.limite > 0 THEN ROUND((COALESCE(g.soma_gasto, 0) / o.limite) * 100, 2)
      ELSE 0
    END AS porcentagem_utilizada
  FROM public.orcamentos o
  LEFT JOIN gastos g ON (o.categoria_id IS NOT NULL AND o.categoria_id = g.categoria_id) 
                     OR (LOWER(o.categoria_nome) = LOWER(g.cat_nome_join))
  WHERE (o.grupo_id = p_grupo_id OR (p_grupo_id IS NULL AND o.user_id = auth.uid()))
    AND o.mes = p_mes
    AND o.ano = p_ano
  ORDER BY porcentagem_utilizada DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exemplo de teste:
-- SELECT * FROM public.obter_progresso_orcamentos('ID_DO_GRUPO', 9, 2026);
