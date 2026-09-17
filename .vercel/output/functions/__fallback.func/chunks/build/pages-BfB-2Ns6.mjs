import { a as useSupabaseUser, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useWorkspace } from './useWorkspace-CnSCU5qX.mjs';
import { u as useFinancas } from './useFinancas-C7KH4i6q.mjs';
import { _ as _sfc_main$7 } from './ModalNovoLancamento-DS8yO2EF.mjs';
import { _ as _sfc_main$6 } from './Header-DO9G6iKM.mjs';
import { _ as _sfc_main$8 } from './ModalImportarExtrato-DqqJkpww.mjs';
import { ref, computed, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderStyle, ssrRenderSlot } from 'vue/server-renderer';
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

//#region app/components/KpiCard.vue
var _sfc_main$5 = {
	__name: "KpiCard",
	__ssrInlineRender: true,
	props: {
		title: {
			type: String,
			required: true
		},
		valor: {
			type: Number,
			default: 0
		},
		variant: {
			type: String,
			default: "neutral"
		},
		badgeText: {
			type: String,
			default: ""
		},
		badgeClass: {
			type: String,
			default: "bg-dark-700 text-gray-300 border-dark-600"
		},
		descricao: {
			type: String,
			default: ""
		}
	},
	setup(__props) {
		const props = __props;
		const valorFormatted = computed(() => {
			return Number(props.valor || 0).toLocaleString("pt-BR", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: ["bg-dark-800/90 border rounded-xl p-5 transition-all duration-200 relative overflow-hidden group hover:border-dark-600", [__props.variant === "brand" ? "border-brand/30 hover:border-brand/50 bg-gradient-to-b from-brand/5 to-transparent" : __props.variant === "income" ? "border-income/30 hover:border-income/50 bg-gradient-to-b from-income/5 to-transparent" : __props.variant === "expense" ? "border-expense/30 hover:border-expense/50 bg-gradient-to-b from-expense/5 to-transparent" : "border-dark-700"]] }, _attrs))}><div class="${ssrRenderClass([[__props.variant === "brand" ? "bg-brand" : __props.variant === "income" ? "bg-income" : __props.variant === "expense" ? "bg-expense" : "bg-blue-500"], "absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"])}"></div><div class="flex items-center justify-between mb-3"><span class="text-xs font-semibold uppercase tracking-wider text-gray-400">${ssrInterpolate(__props.title)}</span><div class="${ssrRenderClass([[__props.variant === "brand" ? "bg-brand/10 border-brand/30 text-brand" : __props.variant === "income" ? "bg-income/10 border-income/30 text-income" : __props.variant === "expense" ? "bg-expense/10 border-expense/30 text-expense" : "bg-dark-700 border-dark-600 text-gray-300"], "w-8 h-8 rounded-lg flex items-center justify-center border"])}">`);
			ssrRenderSlot(_ctx.$slots, "icon", {}, () => {
				_push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>`);
			}, _push, _parent);
			_push(`</div></div><div class="flex items-baseline justify-between"><span class="text-2xl font-extrabold text-white tracking-tight font-mono"> R\$ ${ssrInterpolate(valorFormatted.value)}</span>`);
			if (__props.badgeText) _push(`<span class="${ssrRenderClass([__props.badgeClass, "text-xs font-semibold px-2 py-0.5 rounded-full border"])}">${ssrInterpolate(__props.badgeText)}</span>`);
			else _push(`<!---->`);
			_push(`</div>`);
			if (__props.descricao) _push(`<p class="text-[11px] text-gray-400 mt-2 flex items-center gap-1"><span>${ssrInterpolate(__props.descricao)}</span></p>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/KpiCard.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
//#endregion
//#region app/components/DiagnosticoFinanceiro.vue
var _sfc_main$4 = {
	__name: "DiagnosticoFinanceiro",
	__ssrInlineRender: true,
	props: {
		transacoesDoPeriodo: {
			type: Array,
			default: () => []
		},
		categorias: {
			type: Array,
			default: () => []
		},
		saldoTotal: {
			type: Number,
			default: 0
		}
	},
	setup(__props) {
		const props = __props;
		const totalReceitas = computed(() => props.transacoesDoPeriodo.filter((i) => i.tipo === "receita").reduce((a, c) => a + c.valor, 0));
		const despesasEssenciais = computed(() => {
			return props.transacoesDoPeriodo.filter((t) => t.tipo === "despesa").filter((t) => {
				const cat = props.categorias.find((c) => c.nome === t.categoria || c.id === t.categoria_id);
				if (cat && typeof cat.essencial === "boolean") return cat.essencial;
				const catNome = (t.categoria || "").toLowerCase();
				return catNome.includes("alimenta") || catNome.includes("moradia") || catNome.includes("saúde") || catNome.includes("saude") || catNome.includes("transporte") || catNome.includes("luz") || catNome.includes("água") || catNome.includes("agua");
			}).reduce((a, c) => a + c.valor, 0);
		});
		const despesasTotais = computed(() => props.transacoesDoPeriodo.filter((i) => i.tipo === "despesa").reduce((a, c) => a + c.valor, 0));
		const despesasNaoEssenciais = computed(() => Math.max(0, despesasTotais.value - despesasEssenciais.value));
		const sobraMensal = computed(() => totalReceitas.value - despesasTotais.value);
		const percEssencialDaRenda = computed(() => totalReceitas.value > 0 ? despesasEssenciais.value / totalReceitas.value * 100 : 0);
		const percNaoEssencialDaRenda = computed(() => totalReceitas.value > 0 ? despesasNaoEssenciais.value / totalReceitas.value * 100 : 0);
		const percSobraDaRenda = computed(() => totalReceitas.value > 0 ? sobraMensal.value / totalReceitas.value * 100 : 0);
		const reservaIdeal6Meses = computed(() => despesasEssenciais.value * 6);
		const percReservaConcluida = computed(() => reservaIdeal6Meses.value > 0 ? props.saldoTotal / reservaIdeal6Meses.value * 100 : 0);
		const statusSaude = computed(() => {
			const perc = percEssencialDaRenda.value;
			if (totalReceitas.value === 0) return {
				icone: "ℹ️",
				texto: "Aguardando receitas do mês",
				classe: "bg-dark-700/50 text-gray-400 border-dark-600"
			};
			if (perc <= 55) return {
				icone: "🟢",
				texto: "Orçamento Excelente (Essenciais ≤ 55%)",
				classe: "bg-income/10 text-income border-income/30"
			};
			if (perc <= 70) return {
				icone: "⚠️",
				texto: "Atenção (Essenciais até 70%)",
				classe: "bg-amber-400/10 text-amber-400 border-amber-400/30"
			};
			return {
				icone: "🚨",
				texto: "Custo Básico Elevado (> 70%)",
				classe: "bg-expense/10 text-expense border-expense/30"
			};
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gradient-to-br from-dark-800 to-dark-850 border border-dark-700/80 rounded-2xl p-5 md:p-6 shadow-supabase space-y-6" }, _attrs))}><div class="flex items-center justify-between flex-wrap gap-3 border-b border-dark-700/60 pb-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xl font-bold"> ⚡ </div><div><h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2"> Diagnóstico &amp; Reserva de Emergência <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20"> Método Primo Pobre </span></h3><p class="text-xs text-gray-400">Análise do seu Custo de Vida Básico e meta de segurança para 6 meses</p></div></div><div class="${ssrRenderClass([statusSaude.value.classe, "px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5"])}"><span>${ssrInterpolate(statusSaude.value.icone)}</span><span>${ssrInterpolate(statusSaude.value.texto)}</span></div></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><div class="bg-dark-900/80 border border-dark-700/80 rounded-xl p-4"><div class="flex items-center justify-between text-xs text-gray-400 mb-1"><span>Receitas Totais</span><span class="text-income font-bold">100%</span></div><p class="text-lg font-extrabold font-mono text-income">+ R\$ ${ssrInterpolate(totalReceitas.value.toFixed(2))}</p><p class="text-[10px] text-gray-500 font-mono mt-1">Entradas do mês</p></div><div class="bg-dark-900/80 border border-amber-500/20 rounded-xl p-4 relative overflow-hidden"><div class="flex items-center justify-between text-xs text-gray-400 mb-1"><span class="text-amber-300 font-medium">⚡ Custo Básico (Essencial)</span><span class="text-amber-400 font-mono font-bold">${ssrInterpolate(percEssencialDaRenda.value.toFixed(0))}%</span></div><p class="text-lg font-extrabold font-mono text-amber-400">- R\$ ${ssrInterpolate(despesasEssenciais.value.toFixed(2))}</p><p class="text-[10px] text-gray-400 font-mono mt-1">Moradia, Comida, Saúde, Transp.</p></div><div class="bg-dark-900/80 border border-purple-500/20 rounded-xl p-4"><div class="flex items-center justify-between text-xs text-gray-400 mb-1"><span class="text-purple-300 font-medium">🎈 Supérfluos (Não Essencial)</span><span class="text-purple-400 font-mono font-bold">${ssrInterpolate(percNaoEssencialDaRenda.value.toFixed(0))}%</span></div><p class="text-lg font-extrabold font-mono text-purple-300">- R\$ ${ssrInterpolate(despesasNaoEssenciais.value.toFixed(2))}</p><p class="text-[10px] text-gray-400 font-mono mt-1">Lazer, Assinaturas, Extras</p></div><div class="${ssrRenderClass([sobraMensal.value >= 0 ? "border-brand/30" : "border-expense/30", "bg-dark-900/80 border rounded-xl p-4"])}"><div class="flex items-center justify-between text-xs text-gray-400 mb-1"><span>Sobra Líquida</span><span class="${ssrRenderClass([sobraMensal.value >= 0 ? "text-brand" : "text-expense", "font-mono font-bold"])}">${ssrInterpolate(percSobraDaRenda.value.toFixed(0))}% </span></div><p class="${ssrRenderClass([sobraMensal.value >= 0 ? "text-brand" : "text-expense", "text-lg font-extrabold font-mono"])}">${ssrInterpolate(sobraMensal.value >= 0 ? "+" : "")}R\$ ${ssrInterpolate(sobraMensal.value.toFixed(2))}</p><p class="text-[10px] text-gray-400 font-mono mt-1">Capacidade de investimento</p></div></div><div class="space-y-2"><div class="flex items-center justify-between text-xs font-semibold text-gray-300"><span>Distribuição da sua Renda</span><span class="text-[11px] text-gray-400 font-normal">Recomendado Primo Pobre: Essenciais até 60%</span></div><div class="w-full h-3 bg-dark-950 rounded-full overflow-hidden flex p-0.5 border border-dark-700"><div class="h-full rounded-l-full bg-amber-400 transition-all duration-500" style="${ssrRenderStyle({ width: `${Math.min(percEssencialDaRenda.value, 100)}%` })}"${ssrRenderAttr("title", `Essenciais: ${percEssencialDaRenda.value.toFixed(1)}%`)}></div><div class="h-full bg-purple-500 transition-all duration-500" style="${ssrRenderStyle({ width: `${Math.min(percNaoEssencialDaRenda.value, 100 - percEssencialDaRenda.value)}%` })}"${ssrRenderAttr("title", `Não Essenciais: ${percNaoEssencialDaRenda.value.toFixed(1)}%`)}></div><div class="h-full rounded-r-full bg-brand transition-all duration-500" style="${ssrRenderStyle({ width: `${Math.max(0, Math.min(percSobraDaRenda.value, 100 - percEssencialDaRenda.value - percNaoEssencialDaRenda.value))}%` })}"${ssrRenderAttr("title", `Sobra / Investimentos: ${percSobraDaRenda.value.toFixed(1)}%`)}></div></div><div class="flex items-center justify-between text-[11px] text-gray-400 font-mono pt-1"><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Essenciais (${ssrInterpolate(despesasEssenciais.value.toFixed(2))})</span><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-purple-500"></span> Não Essenciais (${ssrInterpolate(despesasNaoEssenciais.value.toFixed(2))})</span><span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-brand"></span> Sobra (${ssrInterpolate(sobraMensal.value.toFixed(2))})</span></div></div><div class="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/30 rounded-xl p-4 md:p-5 relative overflow-hidden"><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><div class="space-y-1"><div class="flex items-center gap-2"><span class="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">🎯 Meta de Segurança Financeria</span></div><h4 class="text-base font-extrabold text-white"> Reserva de Emergência Ideal (6 meses de custo básico) </h4><p class="text-xs text-gray-300 max-w-xl"> Com base nas suas despesas essenciais deste mês (<strong class="text-amber-300">R\$ ${ssrInterpolate(despesasEssenciais.value.toFixed(2))}</strong>), seu fundo de emergência de 6 meses deve ser: </p></div><div class="bg-dark-900/90 border border-amber-500/40 rounded-xl p-3.5 text-right shrink-0"><span class="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Valor Ideal Calculado</span><p class="text-2xl font-black font-mono text-amber-400">R\$ ${ssrInterpolate(reservaIdeal6Meses.value.toFixed(2))}</p></div></div><div class="mt-4 pt-3 border-t border-amber-500/20 space-y-2"><div class="flex items-center justify-between text-xs"><span class="text-gray-300 font-medium">Saldo Atual em Contas / Investimentos:</span><span class="font-mono font-bold text-white"> R\$ ${ssrInterpolate(__props.saldoTotal.toFixed(2))} de R\$ ${ssrInterpolate(reservaIdeal6Meses.value.toFixed(2))} <span class="text-amber-400">(${ssrInterpolate(percReservaConcluida.value.toFixed(1))}%)</span></span></div><div class="w-full bg-dark-950 rounded-full h-3 overflow-hidden p-0.5 border border-dark-700"><div class="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700" style="${ssrRenderStyle({ width: `${Math.min(percReservaConcluida.value, 100)}%` })}"></div></div><p class="text-[11px] text-gray-400 font-mono">`);
			if (percReservaConcluida.value >= 100) _push(`<span class="text-brand font-bold">🎉 Parabéns! Sua Reserva de Emergência para 6 meses está 100% garantida.</span>`);
			else _push(`<span>Faltam <strong class="text-amber-300">R\$ ${ssrInterpolate(Math.max(0, reservaIdeal6Meses.value - __props.saldoTotal).toFixed(2))}</strong> acumulados para atingir sua meta total de tranquilidade.</span>`);
			_push(`</p></div></div></div>`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DiagnosticoFinanceiro.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
//#endregion
//#region app/components/GraficoCategoria.vue
var _sfc_main$3 = {
	__name: "GraficoCategoria",
	__ssrInlineRender: true,
	props: {
		transacoes: {
			type: Array,
			default: () => []
		},
		categorias: {
			type: Array,
			default: () => []
		}
	},
	setup(__props) {
		const props = __props;
		const hoveredIndex = ref(null);
		const dadosCategorias = computed(() => {
			const despesas = props.transacoes.filter((t) => t.tipo === "despesa");
			const total = despesas.reduce((acc, t) => acc + t.valor, 0);
			if (total === 0) return [];
			const mapa = /* @__PURE__ */ new Map();
			despesas.forEach((t) => {
				const catNome = t.categoria || "Outros";
				const atual = mapa.get(catNome) || 0;
				mapa.set(catNome, atual + t.valor);
			});
			const resultado = [];
			mapa.forEach((valor, nome) => {
				const catInfo = props.categorias.find((c) => c.nome.toLowerCase() === nome.toLowerCase());
				const cor = catInfo?.cor || "#3b82f6";
				const icone = catInfo?.icone || "📦";
				const percentual = valor / total * 100;
				resultado.push({
					nome,
					valor,
					percentual,
					cor,
					icone
				});
			});
			return resultado.sort((a, b) => b.valor - a.valor);
		});
		const totalGeral = computed(() => {
			return dadosCategorias.value.reduce((acc, c) => acc + c.valor, 0);
		});
		const segmentos = computed(() => {
			let offsetAcumulado = 0;
			const circunferência = 2 * Math.PI * 38;
			return dadosCategorias.value.map((item) => {
				const dash = item.percentual / 100 * circunferência;
				const offset = offsetAcumulado / 100 * circunferência;
				offsetAcumulado += item.percentual;
				return {
					cor: item.cor,
					dash,
					offset
				};
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase space-y-4" }, _attrs))}><div class="flex items-center justify-between"><h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-brand"></span> Distribuição de Despesas por Categoria </h3><span class="text-xs text-gray-400 font-mono">Mês Atual</span></div>`);
			if (dadosCategorias.value.length === 0) _push(`<div class="py-12 text-center text-gray-500 text-xs font-mono"> Nenhum gasto registrado neste mês para exibir o gráfico. </div>`);
			else {
				_push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2"><div class="relative w-48 h-48 mx-auto flex items-center justify-center"><svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90"><!--[-->`);
				ssrRenderList(segmentos.value, (seg, idx) => {
					_push(`<circle cx="50" cy="50" r="38" fill="transparent"${ssrRenderAttr("stroke", seg.cor)} stroke-width="14"${ssrRenderAttr("stroke-dasharray", `${seg.dash} ${100 - seg.dash}`)}${ssrRenderAttr("stroke-dashoffset", -seg.offset)} class="transition-all duration-500 hover:opacity-85 cursor-pointer"></circle>`);
				});
				_push(`<!--]--></svg><div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"><span class="text-[10px] text-gray-400 uppercase font-mono tracking-wider">Total Gastos</span><span class="text-base font-extrabold font-mono text-white">R\$ ${ssrInterpolate(totalGeral.value.toFixed(0))}</span></div></div><div class="space-y-2.5 max-h-56 overflow-y-auto pr-1"><!--[-->`);
				ssrRenderList(dadosCategorias.value, (item, idx) => {
					_push(`<div class="${ssrRenderClass([hoveredIndex.value === idx ? "bg-dark-700/80 border-dark-600" : "bg-dark-900/60 border-dark-800 hover:bg-dark-800", "flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border"])}"><div class="flex items-center gap-3 min-w-0"><div class="w-3 h-3 rounded-full shrink-0" style="${ssrRenderStyle({ backgroundColor: item.cor })}"></div><span class="text-xs font-semibold text-gray-200 truncate">${ssrInterpolate(item.icone)} ${ssrInterpolate(item.nome)}</span></div><div class="flex items-center gap-3 font-mono shrink-0 ml-2"><span class="text-xs text-gray-400 font-medium">${ssrInterpolate(item.percentual.toFixed(1))}%</span><span class="text-xs font-bold text-white">R\$ ${ssrInterpolate(item.valor.toFixed(2))}</span></div></div>`);
				});
				_push(`<!--]--></div></div>`);
			}
			_push(`</div>`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GraficoCategoria.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
//#endregion
//#region app/components/GraficoEvolucao.vue
var _sfc_main$2 = {
	__name: "GraficoEvolucao",
	__ssrInlineRender: true,
	props: { transacoes: {
		type: Array,
		default: () => []
	} },
	setup(__props) {
		const props = __props;
		const NOMES_MESES = [
			"Jan",
			"Fev",
			"Mar",
			"Abr",
			"Mai",
			"Jun",
			"Jul",
			"Ago",
			"Set",
			"Out",
			"Nov",
			"Dez"
		];
		const dadosMensais = computed(() => {
			const agora = /* @__PURE__ */ new Date();
			const meses = [];
			for (let i = 5; i >= 0; i--) {
				const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
				const ano = d.getFullYear();
				const mesIndex = d.getMonth();
				const mesNome = NOMES_MESES[mesIndex];
				const transDoMes = props.transacoes.filter((t) => {
					if (!t.data) return false;
					const [tAno, tMes] = t.data.split("-");
					return parseInt(tAno, 10) === ano && parseInt(tMes, 10) === mesIndex + 1;
				});
				const receitas = transDoMes.filter((t) => t.tipo === "receita").reduce((acc, t) => acc + t.valor, 0);
				const despesas = transDoMes.filter((t) => t.tipo === "despesa").reduce((acc, t) => acc + t.valor, 0);
				meses.push({
					nome: `${mesNome}/${String(ano).slice(2)}`,
					receitas,
					despesas
				});
			}
			const maxValor = Math.max(...meses.map((m) => Math.max(m.receitas, m.despesas)), 1e3);
			return meses.map((m) => ({
				...m,
				altReceita: Math.max(m.receitas / maxValor * 100, 4),
				altDespesa: Math.max(m.despesas / maxValor * 100, 4)
			}));
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase space-y-4" }, _attrs))}><div class="flex items-center justify-between"><div><h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Evolução Mensal (Receitas vs Despesas) </h3><p class="text-xs text-gray-400">Comparativo histórico de entradas e saídas</p></div><div class="flex items-center gap-4 text-xs font-mono"><div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-income shadow-glow-emerald"></span><span class="text-gray-300">Receitas</span></div><div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-expense shadow-sm"></span><span class="text-gray-300">Despesas</span></div></div></div><div class="pt-6 pb-2"><div class="h-48 flex items-end justify-between gap-3 md:gap-6 px-2 border-b border-dark-700/80"><!--[-->`);
			ssrRenderList(dadosMensais.value, (mes) => {
				_push(`<div class="flex-1 flex items-end justify-center gap-1.5 h-full relative group"><div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-dark-900 border border-dark-700 text-white text-[11px] font-mono px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 whitespace-nowrap"><span class="text-income font-bold">+R\$ ${ssrInterpolate(mes.receitas.toFixed(0))}</span> | <span class="text-expense font-bold">-R\$ ${ssrInterpolate(mes.despesas.toFixed(0))}</span></div><div class="w-full max-w-[24px] bg-income hover:brightness-110 rounded-t-md transition-all duration-500 shadow-glow-emerald" style="${ssrRenderStyle({ height: `${mes.altReceita}%` })}"></div><div class="w-full max-w-[24px] bg-expense hover:brightness-110 rounded-t-md transition-all duration-500" style="${ssrRenderStyle({ height: `${mes.altDespesa}%` })}"></div></div>`);
			});
			_push(`<!--]--></div><div class="flex items-center justify-between gap-3 md:gap-6 px-2 pt-3 text-xs font-mono text-gray-400"><!--[-->`);
			ssrRenderList(dadosMensais.value, (mes) => {
				_push(`<span class="flex-1 text-center">${ssrInterpolate(mes.nome)}</span>`);
			});
			_push(`<!--]--></div></div></div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GraficoEvolucao.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region app/components/ModuloOrcamento.vue
var _sfc_main$1 = {
	__name: "ModuloOrcamento",
	__ssrInlineRender: true,
	props: {
		transacoes: {
			type: Array,
			default: () => []
		},
		categorias: {
			type: Array,
			default: () => []
		}
	},
	setup(__props) {
		const props = __props;
		const LIMITES_PADRAO = [
			{
				categoria: "Alimentação",
				limite: 1500,
				icone: "🍔"
			},
			{
				categoria: "Moradia",
				limite: 2500,
				icone: "🏠"
			},
			{
				categoria: "Transporte",
				limite: 600,
				icone: "🚗"
			},
			{
				categoria: "Lazer",
				limite: 500,
				icone: "✈️"
			}
		];
		const orcamentosProcessados = computed(() => {
			return LIMITES_PADRAO.map((meta) => {
				const gasto = props.transacoes.filter((t) => t.tipo === "despesa" && t.categoria && t.categoria.toLowerCase() === meta.categoria.toLowerCase()).reduce((acc, t) => acc + t.valor, 0);
				const percentual = meta.limite > 0 ? gasto / meta.limite * 100 : 0;
				let status = "normal";
				let statusText = `${percentual.toFixed(0)}% Utilizado`;
				if (percentual >= 100) {
					status = "excedido";
					statusText = `Estourou +${(percentual - 100).toFixed(0)}%`;
				} else if (percentual >= 75) {
					status = "alerta";
					statusText = `Atenção (${percentual.toFixed(0)}%)`;
				}
				return {
					...meta,
					gasto,
					percentual,
					status,
					statusText
				};
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase space-y-5" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700/80 pb-4"><div><h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Teto de Gastos por Categoria (Orçamentos) </h3><p class="text-xs text-gray-400">Defina limites para não estourar seu orçamento mensal</p></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/orcamentos",
				class: "text-xs font-semibold text-brand hover:underline flex items-center gap-1"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Gerenciar Orçamentos → `);
					else return [createTextVNode(" Gerenciar Orçamentos → ")];
				}),
				_: 1
			}, _parent));
			_push(`</div><div class="space-y-4"><!--[-->`);
			ssrRenderList(orcamentosProcessados.value, (item) => {
				_push(`<div class="bg-dark-900 border border-dark-700/80 rounded-xl p-4 space-y-2.5"><div class="flex items-center justify-between"><div class="flex items-center gap-2.5"><span class="text-lg">${ssrInterpolate(item.icone)}</span><div><span class="text-xs font-bold text-white block leading-tight">${ssrInterpolate(item.categoria)}</span><span class="text-[10px] text-gray-400 font-mono"> Gasto: R\$ ${ssrInterpolate(item.gasto.toFixed(2))} de R\$ ${ssrInterpolate(item.limite.toFixed(2))}</span></div></div><span class="${ssrRenderClass([[item.status === "excedido" ? "bg-expense/15 text-expense border-expense/30 animate-pulse" : item.status === "alerta" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-income/15 text-income border-income/30"], "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border"])}">${ssrInterpolate(item.statusText)}</span></div><div class="w-full bg-dark-950 rounded-full h-2.5 overflow-hidden border border-dark-700/60 relative"><div class="${ssrRenderClass([[item.status === "excedido" ? "bg-expense shadow-glow-expense" : item.status === "alerta" ? "bg-amber-400" : "bg-brand shadow-glow-emerald"], "h-full rounded-full transition-all duration-500"])}" style="${ssrRenderStyle({ width: `${Math.min(item.percentual, 100)}%` })}"></div></div></div>`);
			});
			_push(`<!--]--></div></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ModuloOrcamento.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region app/pages/index.vue
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const modalAberto = ref(false);
		const modalImportarAberto = ref(false);
		const agora = /* @__PURE__ */ new Date();
		const mesSelecionado = ref(agora.getMonth() + 1);
		const anoSelecionado = ref(agora.getFullYear());
		const nomesMeses = [
			"Janeiro",
			"Fevereiro",
			"Março",
			"Abril",
			"Maio",
			"Junho",
			"Julho",
			"Agosto",
			"Setembro",
			"Outubro",
			"Novembro",
			"Dezembro"
		];
		const anosDisponiveis = computed(() => {
			const ano = (/* @__PURE__ */ new Date()).getFullYear();
			return [
				ano - 2,
				ano - 1,
				ano,
				ano + 1
			];
		});
		const mesesRapidos = computed(() => {
			const hoje = /* @__PURE__ */ new Date();
			const resultado = [];
			for (let i = 2; i >= 0; i--) {
				const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
				resultado.push({
					label: nomesMeses[d.getMonth()].substring(0, 3),
					mes: d.getMonth() + 1,
					ano: d.getFullYear()
				});
			}
			return resultado;
		});
		const periodoLabel = computed(() => `${nomesMeses[mesSelecionado.value - 1]} ${anoSelecionado.value}`);
		const { modoVisao } = useWorkspace();
		const user = useSupabaseUser();
		const { transacoes, bancos, cartoes, categorias, carregando, carregarTudo, adicionarLancamento } = useFinancas();
		const transacoesDoPeriodo = computed(() => {
			const filtradas = transacoes.value.filter((t) => {
				if (!t.data) return false;
				const [ano, mes] = t.data.split("-").map(Number);
				return mes === mesSelecionado.value && ano === anoSelecionado.value;
			});
			if (modoVisao.value === "pessoal") {
				const currentUserId = user.value?.id;
				return filtradas.map((t) => {
					if (t.rateios && t.rateios.length > 0) {
						const meuRateio = t.rateios.find((r) => r.user_id === currentUserId);
						const valorCalculado = meuRateio ? Number(meuRateio.valor) : Number(t.valor) / 2;
						return {
							...t,
							valor: valorCalculado
						};
					}
					if (t.tipo === "despesa" && (t.dividir5050 || [
						"Alimentação",
						"Moradia",
						"Pets"
					].includes(t.categoria))) return {
						...t,
						valor: Number(t.valor) / 2
					};
					return t;
				});
			}
			return filtradas;
		});
		const totalReceitas = computed(() => transacoesDoPeriodo.value.filter((i) => i.tipo === "receita").reduce((a, c) => a + c.valor, 0));
		const totalDespesas = computed(() => transacoesDoPeriodo.value.filter((i) => i.tipo === "despesa").reduce((a, c) => a + c.valor, 0));
		const saldoTotal = computed(() => bancos.value.reduce((a, c) => a + c.saldo, 0));
		const economia = computed(() => totalReceitas.value - totalDespesas.value);
		const ultimosLancamentos = computed(() => transacoesDoPeriodo.value.slice(0, 10));
		const cartoesComFatura = computed(() => cartoes.value.map((c) => {
			const fatura = transacoes.value.filter((t) => {
				if (t.cartao_id !== c.id) return false;
				const [ano, mes] = (t.data || "").split("-").map(Number);
				return mes === mesSelecionado.value && ano === anoSelecionado.value;
			}).reduce((a, t) => a + t.valor, 0);
			return {
				...c,
				fatura,
				perc: c.limite > 0 ? fatura / c.limite * 100 : 0
			};
		}));
		const handleSalvar = async (item) => await adicionarLancamento(item);
		const handleImportarEmLote = async (itens) => {
			await carregarTudo(true);
			if (itens && itens.length > 0) {
				const primeiraData = itens[0]?.data;
				if (primeiraData) {
					const parts = primeiraData.split("-").map(Number);
					if (parts[0] && parts[1]) {
						anoSelecionado.value = parts[0];
						mesSelecionado.value = parts[1];
					}
				}
			}
		};
		const formatData = (str) => {
			if (!str) return "";
			const parts = str.split("-");
			return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str;
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Header = _sfc_main$6;
			const _component_KpiCard = _sfc_main$5;
			const _component_DiagnosticoFinanceiro = _sfc_main$4;
			const _component_GraficoCategoria = _sfc_main$3;
			const _component_GraficoEvolucao = _sfc_main$2;
			const _component_ModuloOrcamento = _sfc_main$1;
			const _component_NuxtLink = NuxtLink;
			const _component_ModalNovoLancamento = _sfc_main$7;
			const _component_ModalImportarExtrato = _sfc_main$8;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			_push(ssrRenderComponent(_component_Header, {
				title: "Visão Geral das Finanças",
				subtitle: "Acompanhe seus saldos, receitas e despesas em tempo real",
				onAbrirModal: ($event) => modalAberto.value = true,
				onAbrirModalImportacao: ($event) => modalImportarAberto.value = true
			}, null, _parent));
			_push(`<main class="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8"><div class="flex items-center justify-between flex-wrap gap-3"><div class="flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-xl p-1"><!--[-->`);
			ssrRenderList(mesesRapidos.value, (m) => {
				_push(`<button class="${ssrRenderClass([mesSelecionado.value === m.mes && anoSelecionado.value === m.ano ? "bg-brand text-dark-950 shadow" : "text-gray-400 hover:text-white", "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"])}">${ssrInterpolate(m.label)}</button>`);
			});
			_push(`<!--]--></div><div class="flex items-center gap-2"><select class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand"><!--[-->`);
			ssrRenderList(nomesMeses, (nome, idx) => {
				_push(`<option${ssrRenderAttr("value", idx + 1)}${ssrIncludeBooleanAttr(Array.isArray(mesSelecionado.value) ? ssrLooseContain(mesSelecionado.value, idx + 1) : ssrLooseEqual(mesSelecionado.value, idx + 1)) ? " selected" : ""}>${ssrInterpolate(nome)}</option>`);
			});
			_push(`<!--]--></select><select class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand"><!--[-->`);
			ssrRenderList(anosDisponiveis.value, (a) => {
				_push(`<option${ssrRenderAttr("value", a)}${ssrIncludeBooleanAttr(Array.isArray(anoSelecionado.value) ? ssrLooseContain(anoSelecionado.value, a) : ssrLooseEqual(anoSelecionado.value, a)) ? " selected" : ""}>${ssrInterpolate(a)}</option>`);
			});
			_push(`<!--]--></select></div></div>`);
			if (unref(carregando)) _push(`<div class="flex items-center justify-center py-12 text-brand"><svg class="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`);
			else {
				_push(`<!--[--><div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">`);
				_push(ssrRenderComponent(_component_KpiCard, {
					title: "Saldo Total",
					valor: saldoTotal.value,
					variant: "brand",
					badgeText: "Em Conta",
					badgeClass: "bg-brand/15 text-brand border-brand/30 font-mono",
					descricao: "Soma de todos os saldos de bancos e carteiras"
				}, {
					icon: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg>`);
						else return [(openBlock(), createBlock("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-4 w-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [createVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						})]))];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_KpiCard, {
					title: "Receitas no Mês",
					valor: totalReceitas.value,
					variant: "income",
					badgeText: periodoLabel.value,
					badgeClass: "bg-income/15 text-income border-income/30 font-mono",
					descricao: "Total de entradas e rendimentos no período"
				}, {
					icon: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"${_scopeId}></path></svg>`);
						else return [(openBlock(), createBlock("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-4 w-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [createVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M7 11l5-5m0 0l5 5m-5-5v12"
						})]))];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_KpiCard, {
					title: "Despesas no Mês",
					valor: totalDespesas.value,
					variant: "expense",
					badgeText: periodoLabel.value,
					badgeClass: "bg-expense/15 text-expense border-expense/30 font-mono",
					descricao: "Total de saídas e custos operacionais"
				}, {
					icon: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"${_scopeId}></path></svg>`);
						else return [(openBlock(), createBlock("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-4 w-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [createVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M17 13l-5 5m0 0l-5-5m5 5V6"
						})]))];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_KpiCard, {
					title: "Balanço do Mês",
					valor: economia.value,
					variant: "neutral",
					badgeText: economia.value >= 0 ? "Superávit" : "Déficit",
					badgeClass: economia.value >= 0 ? "bg-blue-500/15 text-blue-400 border-blue-500/30 font-mono" : "bg-expense/15 text-expense border-expense/30 font-mono",
					descricao: "Receitas menos despesas do período"
				}, {
					icon: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"${_scopeId}></path></svg>`);
						else return [(openBlock(), createBlock("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							class: "h-4 w-4",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor"
						}, [createVNode("path", {
							"stroke-linecap": "round",
							"stroke-linejoin": "round",
							"stroke-width": "2",
							d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						})]))];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
				_push(ssrRenderComponent(_component_DiagnosticoFinanceiro, {
					transacoesDoPeriodo: transacoesDoPeriodo.value,
					categorias: unref(categorias),
					saldoTotal: saldoTotal.value
				}, null, _parent));
				_push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
				_push(ssrRenderComponent(_component_GraficoCategoria, {
					transacoes: transacoesDoPeriodo.value,
					categorias: unref(categorias)
				}, null, _parent));
				_push(ssrRenderComponent(_component_GraficoEvolucao, { transacoes: unref(transacoes) }, null, _parent));
				_push(`</div>`);
				_push(ssrRenderComponent(_component_ModuloOrcamento, {
					transacoes: transacoesDoPeriodo.value,
					categorias: unref(categorias),
					mes: mesSelecionado.value,
					ano: anoSelecionado.value
				}, null, _parent));
				_push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"><div class="lg:col-span-2 bg-dark-800 border border-dark-700/80 rounded-2xl p-4 md:p-6 shadow-supabase"><div class="flex items-center justify-between mb-4 md:mb-6"><div><h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-brand"></span> Últimos Lançamentos </h3><p class="text-xs text-gray-400 hidden sm:block">${ssrInterpolate(periodoLabel.value)}</p></div>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/lancamentos",
					class: "text-xs font-semibold text-brand hover:underline flex items-center gap-1 whitespace-nowrap"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(` Ver Extrato → `);
						else return [createTextVNode(" Ver Extrato → ")];
					}),
					_: 1
				}, _parent));
				_push(`</div><div class="sm:hidden space-y-3"><!--[-->`);
				ssrRenderList(ultimosLancamentos.value, (item) => {
					_push(`<div class="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700/80"><div class="flex items-center gap-3 min-w-0"><div class="${ssrRenderClass([item.tipo === "receita" ? "bg-income/15 border-income/30 text-income" : "bg-expense/15 border-expense/30 text-expense", "w-8 h-8 rounded-lg flex items-center justify-center border text-xs font-bold shrink-0"])}">${ssrInterpolate(item.tipo === "receita" ? "+" : "-")}</div><div class="min-w-0"><p class="text-sm font-semibold text-white truncate">${ssrInterpolate(item.descricao)}</p><p class="text-[11px] text-gray-400 font-mono">${ssrInterpolate(item.categoria)} · ${ssrInterpolate(formatData(item.data))}</p></div></div><span class="${ssrRenderClass([item.tipo === "receita" ? "text-income" : "text-expense", "text-sm font-bold font-mono shrink-0 ml-2"])}">${ssrInterpolate(item.tipo === "receita" ? "+" : "-")}R\$${ssrInterpolate(item.valor.toFixed(2))}</span></div>`);
				});
				_push(`<!--]-->`);
				if (ultimosLancamentos.value.length === 0) _push(`<div class="py-8 text-center text-gray-400 text-xs"> Nenhum lançamento em ${ssrInterpolate(periodoLabel.value)}. Clique em &quot;+ Novo Lançamento&quot; para começar. </div>`);
				else _push(`<!---->`);
				_push(`</div><div class="hidden sm:block overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400"><th class="pb-3">Descrição</th><th class="pb-3">Categoria</th><th class="pb-3 hidden md:table-cell">Conta</th><th class="pb-3 hidden md:table-cell">Data</th><th class="pb-3 text-right">Valor</th></tr></thead><tbody class="divide-y divide-dark-700/60 text-sm"><!--[-->`);
				ssrRenderList(ultimosLancamentos.value, (item) => {
					_push(`<tr class="group hover:bg-dark-750/50 transition-colors"><td class="py-3.5 font-medium text-white"><div class="flex items-center gap-3"><div class="${ssrRenderClass([item.tipo === "receita" ? "bg-income/15 border-income/30 text-income" : "bg-expense/15 border-expense/30 text-expense", "w-7 h-7 rounded-lg flex items-center justify-center border text-xs shrink-0"])}">${ssrInterpolate(item.tipo === "receita" ? "+" : "-")}</div><span>${ssrInterpolate(item.descricao)}</span></div></td><td class="py-3.5"><span class="text-xs px-2.5 py-1 rounded-md bg-dark-700 border border-dark-600 text-gray-300 font-medium">${ssrInterpolate(item.categoria)}</span></td><td class="py-3.5 text-xs text-gray-400 font-mono hidden md:table-cell">${ssrInterpolate(item.conta || item.cartao_nome || "—")}</td><td class="py-3.5 text-xs text-gray-400 font-mono hidden md:table-cell">${ssrInterpolate(formatData(item.data))}</td><td class="${ssrRenderClass([item.tipo === "receita" ? "text-income" : "text-expense", "py-3.5 text-right font-bold font-mono"])}">${ssrInterpolate(item.tipo === "receita" ? "+" : "-")} R\$ ${ssrInterpolate(item.valor.toFixed(2))}</td></tr>`);
				});
				_push(`<!--]-->`);
				if (ultimosLancamentos.value.length === 0) _push(`<tr><td colspan="5" class="py-8 text-center text-gray-400 text-xs"> Nenhum lançamento em ${ssrInterpolate(periodoLabel.value)}. </td></tr>`);
				else _push(`<!---->`);
				_push(`</tbody></table></div></div><div class="space-y-6"><div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase"><div class="flex items-center justify-between mb-4"><h3 class="text-base font-bold text-white flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> Saldos por Banco </h3>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/contas",
					class: "text-xs text-brand hover:underline"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Gerenciar →`);
						else return [createTextVNode("Gerenciar →")];
					}),
					_: 1
				}, _parent));
				_push(`</div><div class="space-y-3"><!--[-->`);
				ssrRenderList(unref(bancos), (banco) => {
					_push(`<div class="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700/80"><div class="flex items-center gap-3"><div class="w-3 h-3 rounded-full" style="${ssrRenderStyle({ backgroundColor: banco.cor })}"></div><span class="text-sm font-semibold text-gray-200">${ssrInterpolate(banco.nome)}</span></div><span class="${ssrRenderClass([banco.saldo >= 0 ? "text-white" : "text-expense", "text-sm font-bold font-mono"])}"> R\$ ${ssrInterpolate(banco.saldo.toFixed(2))}</span></div>`);
				});
				_push(`<!--]-->`);
				if (unref(bancos).length === 0) _push(`<div class="text-xs text-gray-400 text-center py-4"> Nenhuma conta cadastrada </div>`);
				else _push(`<!---->`);
				_push(`</div></div><div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase"><div class="flex items-center justify-between mb-4"><h3 class="text-base font-bold text-white flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> Faturas Abertas </h3>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					to: "/cartoes",
					class: "text-xs text-purple-400 hover:underline"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`Ver Cartões →`);
						else return [createTextVNode("Ver Cartões →")];
					}),
					_: 1
				}, _parent));
				_push(`</div><div class="space-y-3"><!--[-->`);
				ssrRenderList(cartoesComFatura.value, (card) => {
					_push(`<div class="p-3 rounded-xl bg-dark-900 border border-dark-700/80"><div class="flex items-center justify-between mb-2"><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full" style="${ssrRenderStyle({ backgroundColor: card.cor })}"></div><span class="text-sm font-semibold text-gray-200">${ssrInterpolate(card.nome)}</span></div><span class="text-sm font-bold font-mono text-purple-400">R\$ ${ssrInterpolate(card.fatura.toFixed(2))}</span></div><div class="w-full bg-dark-950 rounded-full h-1.5 overflow-hidden"><div class="h-full rounded-full transition-all" style="${ssrRenderStyle({
						width: `${Math.min(card.perc, 100)}%`,
						backgroundColor: card.cor
					})}"></div></div><p class="text-[10px] text-gray-500 font-mono mt-1">Vence dia ${ssrInterpolate(card.dia_vencimento)} · ${ssrInterpolate(card.perc.toFixed(0))}% do limite</p></div>`);
				});
				_push(`<!--]-->`);
				if (cartoesComFatura.value.length === 0) _push(`<div class="text-xs text-gray-400 text-center py-4"> Nenhum cartão cadastrado </div>`);
				else _push(`<!---->`);
				_push(`</div></div><div class="bg-gradient-to-br from-dark-800 to-dark-850 border border-brand/20 rounded-2xl p-6 relative overflow-hidden"><div class="absolute -right-8 -bottom-8 w-32 h-32 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div><div class="flex items-center gap-2 text-brand text-xs font-mono font-bold uppercase mb-2"><span>💡 Importação Rápida</span></div><h4 class="text-sm font-bold text-white mb-1">Importe sua fatura bancária</h4><p class="text-xs text-gray-400 leading-relaxed mb-4"> Baixe a fatura do seu cartão ou extrato em OFX/CSV e deixe o sistema organizar tudo por você. </p><button class="w-full bg-brand/10 hover:bg-brand/20 border border-brand/30 text-brand font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><span>+ Importar Extrato (OFX/CSV)</span></button></div></div></div><!--]-->`);
			}
			_push(`</main>`);
			_push(ssrRenderComponent(_component_ModalNovoLancamento, {
				aberto: modalAberto.value,
				onFechar: ($event) => modalAberto.value = false,
				onSalvar: handleSalvar
			}, null, _parent));
			_push(ssrRenderComponent(_component_ModalImportarExtrato, {
				aberto: modalImportarAberto.value,
				onFechar: ($event) => modalImportarAberto.value = false,
				onImportar: handleImportarEmLote
			}, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=pages-BfB-2Ns6.mjs.map
