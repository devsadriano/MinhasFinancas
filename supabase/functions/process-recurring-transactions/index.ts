// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

declare const Deno: any

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL ou Service Role Key não configuradas nas variáveis de ambiente.')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const hoje = new Date()
    const diaHoje = hoje.getDate()
    const dataHojeIso = hoje.toISOString().split('T')[0]!

    console.log(`[RECORRÊNCIA] Iniciando processamento para o dia ${diaHoje} (${dataHojeIso})`)

    // 1. Buscar transações recorrentes ativas cujo dia_vencimento coincide com o dia atual
    const { data: recorrentes, error: errRecorrentes } = await supabase
      .from('transacoes_recorrentes')
      .select('*, grupos_familiares(*)')
      .eq('ativo', true)
      .eq('dia_vencimento', diaHoje)

    if (errRecorrentes) {
      throw errRecorrentes
    }

    if (!recorrentes || recorrentes.length === 0) {
      return new Response(
        JSON.stringify({
          sucesso: true,
          mensagem: `Nenhuma despesa recorrente agendada para o dia ${diaHoje}.`,
          processados: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    let processadosCount = 0
    let duplicadosIgnorados = 0
    const logs: string[] = []

    for (const item of recorrentes) {
      const descFormatada = `${item.descricao} (Recorrente)`

      // 2. Trava anti-duplicação (Idempotência): Verificar se já existe lançamento com a mesma descrição, valor e data
      const { data: existente } = await supabase
        .from('transacoes')
        .select('id')
        .eq('user_id', item.user_id)
        .eq('data', dataHojeIso)
        .eq('valor', item.valor)
        .ilike('descricao', `${item.descricao}%`)
        .maybeSingle()

      if (existente) {
        duplicadosIgnorados++
        logs.push(`[IGNORADO - IDEMPOTÊNCIA] "${item.descricao}" já possui lançamento criado hoje (${dataHojeIso}).`)
        continue
      }

      // 3. Inserir a transação do dia na tabela transacoes
      const novaTransacao = {
        user_id: item.user_id,
        grupo_id: item.grupo_id,
        conta_id: item.conta_id || null,
        cartao_id: item.cartao_id || null,
        categoria_id: item.categoria_id || null,
        descricao: descFormatada,
        valor: Number(item.valor),
        tipo: item.tipo || 'despesa',
        data: dataHojeIso,
        pago: true,
        observacao: `Gerado automaticamente via Motor de Recorrência em ${dataHojeIso}`
      }

      const { data: transInserida, error: errInserir } = await supabase
        .from('transacoes')
        .insert([novaTransacao])
        .select()
        .single()

      if (errInserir || !transInserida) {
        console.error(`Erro ao inserir transação recorrente "${item.descricao}":`, errInserir)
        logs.push(`[ERRO] Falha ao inserir "${item.descricao}": ${errInserir?.message}`)
        continue
      }

      // 4. Rateio 50/50: Se a flag dividir_50_50 estiver ativada, gera os rateios na tabela rateios_transacao
      if (item.dividir_50_50 && item.grupo_id) {
        const { data: membros } = await supabase
          .from('membros_grupo')
          .select('user_id')
          .eq('grupo_id', item.grupo_id)

        if (membros && membros.length > 0) {
          const valorPorMembro = Math.round((Number(item.valor) / membros.length) * 100) / 100
          const porcentagem = Math.round((100 / membros.length) * 100) / 100

          const rateiosParaInserir = membros.map((m: any) => ({
            transacao_id: transInserida.id,
            user_id: m.user_id,
            valor: valorPorMembro,
            porcentagem: porcentagem
          }))

          await supabase.from('rateios_transacao').insert(rateiosParaInserir)
        }
      }

      processadosCount++
      logs.push(`[SUCESSO] Transação "${item.descricao}" de R$ ${item.valor} gerada com sucesso!`)
    }

    return new Response(
      JSON.stringify({
        sucesso: true,
        data: dataHojeIso,
        total_agendados: recorrentes.length,
        processados: processadosCount,
        duplicados_ignorados: duplicadosIgnorados,
        logs
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    console.error('[ERRO EDGE FUNCTION]', error)
    return new Response(
      JSON.stringify({ sucesso: false, erro: error?.message || 'Erro interno na Edge Function' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
