-- =============================================
-- Automação no Supabase (pg_cron + pg_net)
-- Execução diária da Edge Function às 01:00 AM (UTC)
-- =============================================

-- 1. Habilitar extensões necessárias no Supabase
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Agendar a chamada HTTP POST para a Edge Function usando pg_cron
-- Cron Expression: 0 1 * * * -> Todo dia às 01:00 da manhã
SELECT cron.schedule(
  'processar-despesas-recorrentes-diario',
  '0 1 * * *',
  $$
  SELECT net.http_post(
    url := 'https://zhldshlvhrqytartkpfs.supabase.co/functions/v1/process-recurring-transactions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.jwt.claim.sub', true)
    ),
    body := '{}'::jsonb
  );
  $$
);

-- =============================================
-- INSTRUÇÕES DE EXECUÇÃO:
-- 1. Abra o SQL Editor no Dashboard do Supabase
-- 2. Execute as instruções acima para agendar o gatilho diário
-- 3. Para verificar os agendamentos existentes no banco:
--    SELECT * FROM cron.job;
-- 4. Para testar manualmente a execução da Edge Function via curl:
--    curl -i --location --request POST 'https://zhldshlvhrqytartkpfs.supabase.co/functions/v1/process-recurring-transactions' \
--      --header 'Authorization: Bearer SUA_ANON_KEY'
-- =============================================
