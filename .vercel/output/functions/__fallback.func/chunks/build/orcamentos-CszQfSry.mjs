import { u as useFinancas } from './useFinancas-C7KH4i6q.mjs';
import { _ as _sfc_main$1 } from './Header-DO9G6iKM.mjs';
import { ref, computed, reactive, watch, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
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

//#region app/pages/orcamentos.vue
var _sfc_main = {
	__name: "orcamentos",
	__ssrInlineRender: true,
	setup(__props) {
		const { transacoes, categorias, orcamentos, metas, carregarOrcamentos} = useFinancas();
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
		const agora = /* @__PURE__ */ new Date();
		const mesSelecionado = ref(agora.getMonth() + 1);
		const anoSelecionado = ref(agora.getFullYear());
		const anos = computed(() => {
			const a = (/* @__PURE__ */ new Date()).getFullYear();
			return [
				a - 1,
				a,
				a + 1
			];
		});
		const periodoLabel = computed(() => `${nomesMeses[mesSelecionado.value - 1]} ${anoSelecionado.value}`);
		const modalOrcamento = ref(false);
		const modalNovaMeta = ref(false);
		const modalAporte = ref(false);
		const modoEditarOrc = ref(false);
		const metaAporte = ref(null);
		const valorAporte = ref(200);
		const formOrc = reactive({
			categoria_nome: "",
			icone: "💰",
			cor: "#3ecf8e",
			limite: 500
		});
		const formMeta = reactive({
			titulo: "",
			icone: "🎯",
			alvo: 5e3,
			prazo: "",
			cor: "#3b82f6"
		});
		const categoriasDespesa = computed(() => categorias.value.filter((c) => c.tipo === "despesa"));
		watch([mesSelecionado, anoSelecionado], async () => {
			await carregarOrcamentos(mesSelecionado.value, anoSelecionado.value);
		});
		const transacoesDoPeriodo = computed(() => transacoes.value.filter((t) => {
			if (!t.data) return false;
			const [ano, mes] = t.data.split("-").map(Number);
			return mes === mesSelecionado.value && ano === anoSelecionado.value;
		}));
		const orcamentosProcessados = computed(() => orcamentos.value.map((orc) => {
			const gasto = transacoesDoPeriodo.value.filter((t) => t.tipo === "despesa" && t.categoria && t.categoria.toLowerCase() === orc.categoria_nome.toLowerCase()).reduce((acc, t) => acc + t.valor, 0);
			const percentual = orc.limite > 0 ? gasto / orc.limite * 100 : 0;
			const disponivel = orc.limite - gasto;
			let status = "normal";
			let statusText = `${percentual.toFixed(0)}%`;
			if (percentual >= 100) {
				status = "excedido";
				statusText = `+${(percentual - 100).toFixed(0)}% Excedido`;
			} else if (percentual >= 75) {
				status = "alerta";
				statusText = `Atenção ${percentual.toFixed(0)}%`;
			}
			return {
				...orc,
				gasto,
				percentual,
				disponivel,
				status,
				statusText
			};
		}));
		const formatData = (str) => {
			if (!str) return "";
			const parts = str.split("-");
			return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str;
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Header = _sfc_main$1;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			_push(ssrRenderComponent(_component_Header, {
				title: "Orçamentos & Metas de Economia",
				subtitle: "Planeje o teto de gastos por categoria e acompanhe o progresso das suas metas",
				showAction: false
			}, null, _parent));
			_push(`<main class="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8"><div class="flex items-center justify-between flex-wrap gap-3"><h3 class="text-base font-bold text-white flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Orçamento de ${ssrInterpolate(periodoLabel.value)}</h3><div class="flex items-center gap-2"><select class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand"><!--[-->`);
			ssrRenderList(nomesMeses, (nome, idx) => {
				_push(`<option${ssrRenderAttr("value", idx + 1)}${ssrIncludeBooleanAttr(Array.isArray(mesSelecionado.value) ? ssrLooseContain(mesSelecionado.value, idx + 1) : ssrLooseEqual(mesSelecionado.value, idx + 1)) ? " selected" : ""}>${ssrInterpolate(nome)}</option>`);
			});
			_push(`<!--]--></select><select class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand"><!--[-->`);
			ssrRenderList(anos.value, (a) => {
				_push(`<option${ssrRenderAttr("value", a)}${ssrIncludeBooleanAttr(Array.isArray(anoSelecionado.value) ? ssrLooseContain(anoSelecionado.value, a) : ssrLooseEqual(anoSelecionado.value, a)) ? " selected" : ""}>${ssrInterpolate(a)}</option>`);
			});
			_push(`<!--]--></select><button class="text-xs text-gray-400 hover:text-white px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-lg transition-colors" title="Copiar orçamentos do mês anterior"> ← Copiar mês anterior </button></div></div><div class="space-y-4"><div class="flex items-center justify-between"><p class="text-xs text-gray-400">Defina o limite máximo que pretende gastar em cada categoria por mês</p><button class="bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg> Novo Orçamento </button></div>`);
			if (orcamentosProcessados.value.length === 0) _push(`<div class="py-12 text-center bg-dark-800 border border-dark-700/80 rounded-2xl"><div class="text-4xl mb-3">📊</div><p class="text-white font-bold mb-1">Nenhum orçamento para ${ssrInterpolate(periodoLabel.value)}</p><p class="text-gray-400 text-sm mb-4">Crie orçamentos para acompanhar seus gastos por categoria</p><button class="bg-amber-500 text-dark-950 font-bold px-6 py-2.5 rounded-lg text-sm"> + Criar Orçamento </button></div>`);
			else _push(`<!---->`);
			_push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
			ssrRenderList(orcamentosProcessados.value, (orc) => {
				_push(`<div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-5 shadow-supabase flex flex-col justify-between space-y-4"><div><div class="flex items-center justify-between mb-3"><div class="flex items-center gap-3"><span class="text-2xl">${ssrInterpolate(orc.icone)}</span><div><h4 class="text-sm font-bold text-white leading-tight">${ssrInterpolate(orc.categoria_nome)}</h4><span class="text-[11px] text-gray-400 font-mono">Limite Mensal</span></div></div><div class="flex items-center gap-1"><span class="${ssrRenderClass([[orc.status === "excedido" ? "bg-expense/15 text-expense border-expense/30 animate-pulse" : orc.status === "alerta" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-income/15 text-income border-income/30"], "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border"])}">${ssrInterpolate(orc.statusText)}</span><button class="p-1 rounded text-gray-600 hover:text-expense hover:bg-expense/10 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div></div><div class="space-y-2"><div class="flex items-center justify-between text-xs font-mono"><span class="text-gray-400">Gasto: <b class="text-white">R\$ ${ssrInterpolate(orc.gasto.toFixed(2))}</b></span><span class="text-gray-400">Teto: <b class="text-brand">R\$ ${ssrInterpolate(orc.limite.toFixed(2))}</b></span></div><div class="w-full bg-dark-950 rounded-full h-3 overflow-hidden border border-dark-700/60 relative"><div class="${ssrRenderClass([[orc.status === "excedido" ? "bg-expense shadow-glow-expense" : orc.status === "alerta" ? "bg-amber-400" : "bg-brand shadow-glow-emerald"], "h-full rounded-full transition-all duration-500"])}" style="${ssrRenderStyle({ width: `${Math.min(orc.percentual, 100)}%` })}"></div></div></div></div><div class="pt-3 border-t border-dark-700/60 flex items-center justify-between text-xs font-mono"><span class="${ssrRenderClass(orc.disponivel >= 0 ? "text-gray-400" : "text-expense font-bold")}">${ssrInterpolate(orc.disponivel >= 0 ? "Disponível: R$ " + orc.disponivel.toFixed(2) : "Estourou: R$ " + Math.abs(orc.disponivel).toFixed(2))}</span><button class="text-brand hover:underline font-semibold"> Ajustar Teto </button></div></div>`);
			});
			_push(`<!--]--></div></div><div class="space-y-4 pt-4 border-t border-dark-700/60"><div class="flex items-center justify-between"><div><h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Metas de Economia &amp; Caixinhas </h3><p class="text-xs text-gray-400">Objetivos financeiros e reservas</p></div><button class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg> Nova Meta </button></div>`);
			if (unref(metas).length === 0) _push(`<div class="py-12 text-center bg-dark-800 border border-dark-700/80 rounded-2xl"><div class="text-4xl mb-3">🎯</div><p class="text-white font-bold mb-1">Nenhuma meta criada</p><p class="text-gray-400 text-sm mb-4">Crie metas para guardar dinheiro de forma organizada</p><button class="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm"> + Nova Meta </button></div>`);
			else _push(`<!---->`);
			_push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-6"><!--[-->`);
			ssrRenderList(unref(metas), (meta) => {
				_push(`<div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase space-y-4 relative overflow-hidden group hover:border-dark-600 transition-all"><div class="absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none" style="${ssrRenderStyle({ backgroundColor: meta.cor })}"></div><div class="flex items-center justify-between"><div class="flex items-center gap-3"><span class="text-3xl">${ssrInterpolate(meta.icone)}</span><div><h4 class="text-base font-bold text-white">${ssrInterpolate(meta.titulo)}</h4><span class="text-xs text-gray-400 font-mono">Alvo: R\$ ${ssrInterpolate(meta.alvo.toFixed(2))}</span></div></div><div class="flex items-center gap-1"><span class="text-xs font-mono font-bold px-2.5 py-1 rounded-md border" style="${ssrRenderStyle({
					color: meta.cor,
					backgroundColor: meta.cor + "15",
					borderColor: meta.cor + "30"
				})}">${ssrInterpolate((meta.atual / meta.alvo * 100).toFixed(0))}% </span><button class="p-1 rounded text-gray-600 hover:text-expense hover:bg-expense/10 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></div><div class="space-y-1.5"><div class="flex items-center justify-between text-xs font-mono"><span class="text-gray-400">Acumulado:</span><span class="font-bold text-white">R\$ ${ssrInterpolate(meta.atual.toFixed(2))}</span></div><div class="w-full bg-dark-950 rounded-full h-3 overflow-hidden border border-dark-700/60"><div class="h-full rounded-full transition-all duration-500" style="${ssrRenderStyle({
					width: `${Math.min(meta.atual / meta.alvo * 100, 100)}%`,
					backgroundColor: meta.cor
				})}"></div></div><div class="text-[11px] text-gray-500 font-mono text-right"> Faltam: R\$ ${ssrInterpolate(Math.max(meta.alvo - meta.atual, 0).toFixed(2))} `);
				if (meta.prazo) _push(`<span> · Prazo: ${ssrInterpolate(formatData(meta.prazo))}</span>`);
				else _push(`<!---->`);
				_push(`</div></div><button class="w-full bg-dark-900 hover:bg-dark-750 border border-dark-700 text-gray-200 font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"><span>+ Guardar Dinheiro</span></button></div>`);
			});
			_push(`<!--]--></div></div></main>`);
			if (modalOrcamento.value) {
				_push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"><div class="flex items-center justify-between border-b border-dark-700 pb-3"><h3 class="text-base font-bold text-white">${ssrInterpolate(modoEditarOrc.value ? "Ajustar Teto" : "Novo Orçamento")}: ${ssrInterpolate(formOrc.categoria_nome)}</h3><button class="text-gray-400 hover:text-white">✕</button></div>`);
				if (!modoEditarOrc.value) {
					_push(`<div class="space-y-3"><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Categoria de Despesa</label><select class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"><!--[-->`);
					ssrRenderList(categoriasDespesa.value, (cat) => {
						_push(`<option${ssrRenderAttr("value", cat.nome)}${ssrIncludeBooleanAttr(Array.isArray(formOrc.categoria_nome) ? ssrLooseContain(formOrc.categoria_nome, cat.nome) : ssrLooseEqual(formOrc.categoria_nome, cat.nome)) ? " selected" : ""}>${ssrInterpolate(cat.icone)} ${ssrInterpolate(cat.nome)}</option>`);
					});
					_push(`<!--]--></select></div></div>`);
				} else _push(`<!---->`);
				_push(`<div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Teto Máximo Mensal (R\$)</label><input${ssrRenderAttr("value", formOrc.limite)} type="number" step="50" min="0" required class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand"></div><div class="flex items-center justify-end gap-2 pt-3"><button class="px-4 py-2 text-xs text-gray-400">Cancelar</button><button class="bg-amber-500 text-dark-950 font-bold px-5 py-2 rounded-lg text-xs">${ssrInterpolate(modoEditarOrc.value ? "Salvar Teto" : "Criar Orçamento")}</button></div></div></div>`);
			} else _push(`<!---->`);
			if (modalNovaMeta.value) _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"><div class="flex items-center justify-between border-b border-dark-700 pb-3"><h3 class="text-base font-bold text-white">Nova Meta de Economia</h3><button class="text-gray-400 hover:text-white">✕</button></div><div class="space-y-3"><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Título da Meta</label><input${ssrRenderAttr("value", formMeta.titulo)} type="text" placeholder="Ex: Reserva de Emergência, Viagem..." required class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Emoji</label><input${ssrRenderAttr("value", formMeta.icone)} type="text" maxLength="2" placeholder="🎯" class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-white text-center text-xl focus:outline-none focus:border-brand"></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Valor Alvo (R\$)</label><input${ssrRenderAttr("value", formMeta.alvo)} type="number" step="100" required class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand"></div></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Prazo (opcional)</label><input${ssrRenderAttr("value", formMeta.prazo)} type="date" class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Cor</label><input${ssrRenderAttr("value", formMeta.cor)} type="color" class="w-full h-10 bg-dark-900 border border-dark-700 rounded-lg p-1 cursor-pointer"></div></div></div><div class="flex items-center justify-end gap-2 pt-2"><button class="px-4 py-2 text-xs text-gray-400">Cancelar</button><button class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-lg text-xs">Criar Meta</button></div></div></div>`);
			else _push(`<!---->`);
			if (modalAporte.value) _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4"><div class="flex items-center gap-3"><span class="text-3xl">${ssrInterpolate(metaAporte.value?.icone)}</span><div><h3 class="text-base font-bold text-white">Guardar na Meta</h3><p class="text-xs text-gray-400">${ssrInterpolate(metaAporte.value?.titulo)}</p></div></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Valor para Guardar (R\$)</label><input${ssrRenderAttr("value", valorAporte.value)} type="number" step="0.01" min="0.01" class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand"></div><div class="flex items-center justify-end gap-2"><button class="px-4 py-2 text-xs text-gray-400">Cancelar</button><button class="bg-brand text-dark-950 font-bold px-5 py-2 rounded-lg text-xs">Guardar</button></div></div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orcamentos.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=orcamentos-CszQfSry.mjs.map
