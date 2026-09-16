# 💎 MinhasFinancas — Gestão e Inteligência Financeira (Pessoal & Casal)

![Nuxt 3](https://img.shields.io/badge/Nuxt-3.x-00DC82?logo=nuxt.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-18181b?logo=progressive-web-apps&logoColor=white)

O **MinhasFinancas** é uma plataforma moderna e inteligente de gestão financeira pessoal e de casal, construída com **Nuxt 3**, **Supabase** e **TailwindCSS**. O sistema inclui visão unificada de casal (Workspace), liquidação automática de acerto de contas, leitura inteligente de extratos bancários (OFX/CSV), teto de gastos, caixinhas compartilhadas e suporte a PWA.

---

## ✨ Principais Funcionalidades

- 👥 **Workspace Casal / Pessoal**: Alternância com 1 clique entre "Visão Casal" e "Minha Visão".
- ⚖️ **Acerto de Contas Autônomo**: Cálculo transparente de saldo acumulado de quem pagou vs quem consumiu no casal.
- 🪄 **Importação Inteligente (OFX / CSV)**:
  - Leitura e sanitização automática de descrições poluídas de extratos bancários.
  - Auto-categorização inteligente e pré-seleção de divisão 50/50.
  - Auto-detecção de instituições (Nubank, Itaú, Inter, Mercado Pago, Santander, Bradesco, C6, etc.).
- 🎯 **Caixinhas & Metas Compartilhadas**: Metas em grupo com barras de progresso e detalhamento de contribuições por participante.
- 🔄 **Motor de Recorrências**: Automação autônoma para lançamento de assinaturas e despesas fixas.
- 📊 **Orçamentos & Tetos de Gastos**: Comparativo em tempo real do consumido vs limite mensal por categoria.
- 📱 **PWA Nativo**: Suporte para instalação direta na tela inicial no iOS e Android.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Nuxt 3 (Composition API), Vue 3, TypeScript
- **Estilização**: TailwindCSS (Dark Mode, Glassmorphism & Micro-animações)
- **Backend & Banco de Dados**: Supabase (PostgreSQL, Row Level Security, Auth)
- **PWA**: `@vite-pwa/nuxt`
- **Deploy**: Vercel / Serverless

---

## 🚀 Como Rodar o Projeto Localmente

```bash
# 1. Clonar o repositório
git clone https.github.com/devsadriano/MinhasFinancas.git
cd MinhasFinancas

# 2. Instalar as dependências
npm install

# 3. Configurar as variáveis de ambiente
cp .env.example .env
# Preencha suas credenciais do Supabase no arquivo .env

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

---

## 🔒 Banco de Dados & Migrações

Os scripts SQL de migração e auditoria RLS estão disponíveis na pasta `supabase/migrations/`:
- `metas_compartilhadas.sql`: Estrutura das Caixinhas e Aportes de Casal.
- `rls_security_audit.sql`: Políticas de isolamento de segurança por `grupo_id`.
