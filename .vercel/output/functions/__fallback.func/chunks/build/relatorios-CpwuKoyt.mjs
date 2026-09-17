import { u as useFinancas } from './useFinancas-C7KH4i6q.mjs';
import { _ as _sfc_main$1 } from './Header-DO9G6iKM.mjs';
import { ref, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import '../virtual/entry.mjs';
import 'nostics';
import 'nostics/formatters/ansi';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';
import '@vue/shared';
import 'pinia';
import '@supabase/ssr';
import 'unhead/utils';
import './useSupabaseClient-VW3GFU14.mjs';
import './useWorkspace-CnSCU5qX.mjs';

//#region app/pages/relatorios.vue
var _sfc_main = {
	__name: "relatorios",
	__ssrInlineRender: true,
	setup(__props) {
		const { transacoes, categorias} = useFinancas();
		const hoje = /* @__PURE__ */ new Date();
		const dataInicio = ref(`${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`);
		const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
		const dataFim = ref(`${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${ultimoDia}`);
		const periodosRapidos = [
			{
				label: "Este Mês",
				inicio: () => {
					const h = /* @__PURE__ */ new Date();
					return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, "0")}-01`;
				},
				fim: () => {
					const h = /* @__PURE__ */ new Date();
					const d = new Date(h.getFullYear(), h.getMonth() + 1, 0);
					return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getDate()}`;
				}
			},
			{
				label: "Mês Passado",
				inicio: () => {
					const h = /* @__PURE__ */ new Date();
					const d = new Date(h.getFullYear(), h.getMonth() - 1, 1);
					return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
				},
				fim: () => {
					const h = /* @__PURE__ */ new Date();
					const d = new Date(h.getFullYear(), h.getMonth(), 0);
					return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getDate()}`;
				}
			},
			{
				label: "Este Ano",
				inicio: () => `${(/* @__PURE__ */ new Date()).getFullYear()}-01-01`,
				fim: () => `${(/* @__PURE__ */ new Date()).getFullYear()}-12-31`
			}
		];
		const transacoesFiltradas = computed(() => transacoes.value.filter((t) => t.data >= dataInicio.value && t.data <= dataFim.value));
		const totalReceitas = computed(() => transacoesFiltradas.value.filter((i) => i.tipo === "receita").reduce((a, c) => a + c.valor, 0));
		const totalDespesas = computed(() => transacoesFiltradas.value.filter((i) => i.tipo === "despesa").reduce((a, c) => a + c.valor, 0));
		const balanco = computed(() => totalReceitas.value - totalDespesas.value);
		const despesasEssenciais = computed(() => {
			return transacoesFiltradas.value.filter((t) => t.tipo === "despesa").filter((t) => {
				const cat = categorias.value.find((c) => c.nome === t.categoria || c.id === t.categoria_id);
				if (cat && typeof cat.essencial === "boolean") return cat.essencial;
				const catNome = (t.categoria || "").toLowerCase();
				return catNome.includes("alimenta") || catNome.includes("moradia") || catNome.includes("saúde") || catNome.includes("saude") || catNome.includes("transporte") || catNome.includes("luz") || catNome.includes("água") || catNome.includes("agua");
			}).reduce((a, c) => a + c.valor, 0);
		});
		const despesasNaoEssenciais = computed(() => Math.max(0, totalDespesas.value - despesasEssenciais.value));
		const despesasPorCategoria = computed(() => {
			const mapa = {};
			transacoesFiltradas.value.filter((t) => t.tipo === "despesa").forEach((t) => {
				const cat = categorias.value.find((c) => c.nome === t.categoria);
				if (!mapa[t.categoria]) mapa[t.categoria] = {
					nome: t.categoria,
					total: 0,
					icone: cat?.icone || "📦",
					cor: cat?.cor || "#94a3b8"
				};
				mapa[t.categoria].total += t.valor;
			});
			return Object.values(mapa).sort((a, b) => b.total - a.total).map((i) => ({
				...i,
				perc: totalDespesas.value > 0 ? i.total / totalDespesas.value * 100 : 0
			}));
		});
		const receitasPorCategoria = computed(() => {
			const mapa = {};
			transacoesFiltradas.value.filter((t) => t.tipo === "receita").forEach((t) => {
				const cat = categorias.value.find((c) => c.nome === t.categoria);
				if (!mapa[t.categoria]) mapa[t.categoria] = {
					nome: t.categoria,
					total: 0,
					icone: cat?.icone || "💰",
					cor: cat?.cor || "#3ecf8e"
				};
				mapa[t.categoria].total += t.valor;
			});
			return Object.values(mapa).sort((a, b) => b.total - a.total).map((i) => ({
				...i,
				perc: totalReceitas.value > 0 ? i.total / totalReceitas.value * 100 : 0
			}));
		});
		const formatData = (str) => {
			if (!str) return "";
			const parts = str.split("-");
			return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str;
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Header = _sfc_main$1;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			_push(ssrRenderComponent(_component_Header, {
				title: "Relatórios Financeiros",
				subtitle: "Análise detalhada das suas finanças por período com exportação de dados",
				showAction: false
			}, null, _parent));
			_push(`<main class="p-4 md:p-8 max-w-7xl mx-auto space-y-6"><div class="bg-dark-800 border border-dark-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"><div class="flex items-center gap-3 flex-wrap"><div><label class="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Data Inicial</label><input${ssrRenderAttr("value", dataInicio.value)} type="date" class="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"></div><div><label class="block text-[10px] text-gray-400 uppercase font-semibold mb-1">Data Final</label><input${ssrRenderAttr("value", dataFim.value)} type="date" class="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"></div><div class="flex gap-1.5 flex-wrap self-end pb-0.5"><!--[-->`);
			ssrRenderList(periodosRapidos, (p) => {
				_push(`<button class="px-3 py-2 rounded-lg text-xs font-semibold bg-dark-700 hover:bg-dark-600 text-gray-300 transition-colors">${ssrInterpolate(p.label)}</button>`);
			});
			_push(`<!--]--></div></div><div class="flex-1"></div><button class="flex items-center gap-2 px-4 py-2 bg-brand/10 hover:bg-brand/20 border border-brand/30 text-brand font-bold rounded-lg text-xs transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Exportar CSV </button></div><div class="grid grid-cols-2 lg:grid-cols-4 gap-4"><div class="bg-dark-800 border border-income/20 rounded-xl p-5"><p class="text-xs text-gray-400 mb-1">Total Receitas</p><p class="text-xl font-extrabold font-mono text-income">+ R\$ ${ssrInterpolate(totalReceitas.value.toFixed(2))}</p></div><div class="bg-dark-800 border border-expense/20 rounded-xl p-5"><p class="text-xs text-gray-400 mb-1">Total Despesas</p><p class="text-xl font-extrabold font-mono text-expense">- R\$ ${ssrInterpolate(totalDespesas.value.toFixed(2))}</p></div><div class="bg-dark-800 border border-dark-700/80 rounded-xl p-5"><p class="text-xs text-gray-400 mb-1">Balanço</p><p class="${ssrRenderClass([balanco.value >= 0 ? "text-brand" : "text-expense", "text-xl font-extrabold font-mono"])}">${ssrInterpolate(balanco.value >= 0 ? "+" : "")}R\$ ${ssrInterpolate(balanco.value.toFixed(2))}</p></div><div class="bg-dark-800 border border-dark-700/80 rounded-xl p-5"><p class="text-xs text-gray-400 mb-1">Lançamentos</p><p class="text-xl font-extrabold font-mono text-white">${ssrInterpolate(transacoesFiltradas.value.length)}</p></div></div><div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-5 shadow-supabase grid grid-cols-1 md:grid-cols-3 gap-4 items-center"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-lg font-bold"> ⚡ </div><div><span class="text-xs text-amber-400 font-bold uppercase tracking-wider block">Custo Básico Essencial</span><p class="text-lg font-black font-mono text-white">R\$ ${ssrInterpolate(despesasEssenciais.value.toFixed(2))}</p><p class="text-[11px] text-gray-400">${ssrInterpolate(totalDespesas.value > 0 ? (despesasEssenciais.value / totalDespesas.value * 100).toFixed(0) : 0)}% das despesas totais </p></div></div><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-lg font-bold"> 🎈 </div><div><span class="text-xs text-purple-400 font-bold uppercase tracking-wider block">Gastos Supérfluos</span><p class="text-lg font-black font-mono text-white">R\$ ${ssrInterpolate(despesasNaoEssenciais.value.toFixed(2))}</p><p class="text-[11px] text-gray-400">${ssrInterpolate(totalDespesas.value > 0 ? (despesasNaoEssenciais.value / totalDespesas.value * 100).toFixed(0) : 0)}% das despesas totais </p></div></div><div class="bg-dark-900 border border-dark-700 rounded-xl p-3 space-y-1"><div class="flex items-center justify-between text-xs"><span class="text-gray-300 font-semibold">Reserva de Emergência Ideal (6x)</span></div><p class="text-base font-extrabold font-mono text-amber-400">R\$ ${ssrInterpolate((despesasEssenciais.value * 6).toFixed(2))}</p><p class="text-[10px] text-gray-500 font-mono">Calculada sobre as despesas essenciais do período</p></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase"><h3 class="text-base font-bold text-white mb-5 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-expense"></span> Despesas por Categoria </h3><div class="space-y-3"><!--[-->`);
			ssrRenderList(despesasPorCategoria.value, (cat) => {
				_push(`<div class="space-y-1"><div class="flex items-center justify-between text-xs"><span class="text-gray-300 font-medium">${ssrInterpolate(cat.icone)} ${ssrInterpolate(cat.nome)}</span><span class="font-mono font-bold text-white">R\$ ${ssrInterpolate(cat.total.toFixed(2))} <span class="text-gray-500">(${ssrInterpolate(cat.perc.toFixed(1))}%)</span></span></div><div class="w-full bg-dark-950 rounded-full h-2 overflow-hidden"><div class="h-full rounded-full transition-all" style="${ssrRenderStyle({
					width: `${cat.perc}%`,
					backgroundColor: cat.cor
				})}"></div></div></div>`);
			});
			_push(`<!--]-->`);
			if (despesasPorCategoria.value.length === 0) _push(`<div class="py-8 text-center text-gray-400 text-sm"> Sem despesas no período selecionado </div>`);
			else _push(`<!---->`);
			_push(`</div></div><div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase"><h3 class="text-base font-bold text-white mb-5 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-income"></span> Receitas por Categoria </h3><div class="space-y-3"><!--[-->`);
			ssrRenderList(receitasPorCategoria.value, (cat) => {
				_push(`<div class="space-y-1"><div class="flex items-center justify-between text-xs"><span class="text-gray-300 font-medium">${ssrInterpolate(cat.icone)} ${ssrInterpolate(cat.nome)}</span><span class="font-mono font-bold text-white">R\$ ${ssrInterpolate(cat.total.toFixed(2))} <span class="text-gray-500">(${ssrInterpolate(cat.perc.toFixed(1))}%)</span></span></div><div class="w-full bg-dark-950 rounded-full h-2 overflow-hidden"><div class="h-full rounded-full transition-all" style="${ssrRenderStyle({
					width: `${cat.perc}%`,
					backgroundColor: cat.cor
				})}"></div></div></div>`);
			});
			_push(`<!--]-->`);
			if (receitasPorCategoria.value.length === 0) _push(`<div class="py-8 text-center text-gray-400 text-sm"> Sem receitas no período selecionado </div>`);
			else _push(`<!---->`);
			_push(`</div></div></div><div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase"><div class="flex items-center justify-between mb-5"><h3 class="text-base font-bold text-white flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-brand"></span> Lançamentos do Período </h3><span class="text-xs text-gray-400 font-mono">${ssrInterpolate(transacoesFiltradas.value.length)} registros</span></div><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400"><th class="pb-3">Data</th><th class="pb-3">Descrição</th><th class="pb-3">Categoria</th><th class="pb-3">Conta/Cartão</th><th class="pb-3 text-right">Valor</th></tr></thead><tbody class="divide-y divide-dark-700/60 text-sm"><!--[-->`);
			ssrRenderList(transacoesFiltradas.value, (item) => {
				_push(`<tr class="hover:bg-dark-750/60 transition-colors"><td class="py-3 text-xs text-gray-400 font-mono">${ssrInterpolate(formatData(item.data))}</td><td class="py-3 font-medium text-white">${ssrInterpolate(item.descricao)}</td><td class="py-3"><span class="text-xs px-2 py-0.5 rounded bg-dark-900 border border-dark-700 text-gray-300">${ssrInterpolate(item.categoria)}</span></td><td class="py-3 text-xs text-gray-400">`);
				if (item.cartao_nome) _push(`<span class="text-purple-400">💳 ${ssrInterpolate(item.cartao_nome)}</span>`);
				else _push(`<span>${ssrInterpolate(item.conta || "—")}</span>`);
				_push(`</td><td class="${ssrRenderClass([item.tipo === "receita" ? "text-income" : "text-expense", "py-3 text-right font-bold font-mono"])}">${ssrInterpolate(item.tipo === "receita" ? "+" : "-")} R\$ ${ssrInterpolate(item.valor.toFixed(2))}</td></tr>`);
			});
			_push(`<!--]-->`);
			if (transacoesFiltradas.value.length === 0) _push(`<tr><td colspan="5" class="py-8 text-center text-gray-400 text-sm">Nenhum lançamento no período selecionado</td></tr>`);
			else _push(`<!---->`);
			_push(`</tbody></table></div></div></main></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/relatorios.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=relatorios-CpwuKoyt.mjs.map
