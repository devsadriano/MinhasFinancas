import { u as useFinancas } from './useFinancas-C7KH4i6q.mjs';
import { _ as _sfc_main$2 } from './ModalNovoLancamento-DS8yO2EF.mjs';
import { _ as _sfc_main$1 } from './Header-DO9G6iKM.mjs';
import { _ as _sfc_main$3 } from './ModalImportarExtrato-DqqJkpww.mjs';
import { ref, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/pages/lancamentos.vue
var _sfc_main = {
	__name: "lancamentos",
	__ssrInlineRender: true,
	setup(__props) {
		const modalAberto = ref(false);
		const modalImportarAberto = ref(false);
		const lancamentoEditando = ref(null);
		const apagandoTodos = ref(false);
		const busca = ref("");
		const filtroTipo = ref("todos");
		const filtroCategoria = ref("todas");
		const filtroConta = ref("todas");
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
		const mesFiltro = ref(agora.getMonth() + 1);
		const anoFiltro = ref(agora.getFullYear());
		const anos = computed(() => {
			const a = (/* @__PURE__ */ new Date()).getFullYear();
			return [
				a - 2,
				a - 1,
				a,
				a + 1
			];
		});
		const { transacoes, bancos, categorias, carregando, carregarTudo, adicionarLancamento, editarLancamento} = useFinancas();
		const lancamentosFiltrados = computed(() => {
			return transacoes.value.filter((item) => {
				const bateBusca = !busca.value || item.descricao.toLowerCase().includes(busca.value.toLowerCase());
				const bateTipo = filtroTipo.value === "todos" || item.tipo === filtroTipo.value;
				const bateCategoria = filtroCategoria.value === "todas" || item.categoria === filtroCategoria.value;
				const bateConta = filtroConta.value === "todas" || (filtroConta.value === "cartao" ? !!item.cartao_id : item.conta === filtroConta.value);
				let batePeriodo = true;
				if (mesFiltro.value > 0 && item.data) {
					const [ano, mes] = item.data.split("-").map(Number);
					batePeriodo = mes === mesFiltro.value && ano === anoFiltro.value;
				}
				return bateBusca && bateTipo && bateCategoria && bateConta && batePeriodo;
			});
		});
		const totalReceitas = computed(() => lancamentosFiltrados.value.filter((i) => i.tipo === "receita").reduce((a, c) => a + c.valor, 0));
		const totalDespesas = computed(() => lancamentosFiltrados.value.filter((i) => i.tipo === "despesa").reduce((a, c) => a + c.valor, 0));
		const balanco = computed(() => totalReceitas.value - totalDespesas.value);
		const abrirModalNovo = () => {
			lancamentoEditando.value = null;
			modalAberto.value = true;
		};
		const fecharModalLancamento = () => {
			modalAberto.value = false;
			lancamentoEditando.value = null;
		};
		const handleSalvar = async (item) => {
			if (item._editando && item.id) await editarLancamento(item.id, item);
			else await adicionarLancamento(item);
		};
		const handleImportarEmLote = async (itens) => {
			await carregarTudo(true);
			if (itens && itens.length > 0) {
				const primeiraData = itens[0]?.data;
				if (primeiraData) {
					const parts = primeiraData.split("-").map(Number);
					if (parts[0] && parts[1]) {
						anoFiltro.value = parts[0];
						mesFiltro.value = parts[1];
					}
				}
			}
		};
		const isItemShared = (item) => {
			if (item.dividir5050) return true;
			if (item.rateios && item.rateios.length > 0) return true;
			if (item.tipo === "despesa" && [
				"Alimentação",
				"Moradia",
				"Pets",
				"Saúde"
			].includes(item.categoria)) return true;
			return false;
		};
		const formatData = (str) => {
			if (!str) return "";
			const parts = str.split("-");
			return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str;
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Header = _sfc_main$1;
			const _component_ModalNovoLancamento = _sfc_main$2;
			const _component_ModalImportarExtrato = _sfc_main$3;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			_push(ssrRenderComponent(_component_Header, {
				title: "Extrato & Lançamentos",
				subtitle: "Gerencie todas as suas movimentações de entrada e saída",
				onAbrirModal: abrirModalNovo,
				onAbrirModalImportacao: ($event) => modalImportarAberto.value = true
			}, null, _parent));
			_push(`<main class="p-4 md:p-8 max-w-7xl mx-auto space-y-5 md:space-y-6">`);
			if (unref(carregando)) _push(`<div class="flex items-center justify-center py-12 text-brand"><svg class="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`);
			else {
				_push(`<!--[--><div class="bg-dark-800 border border-dark-700/80 rounded-xl p-4 flex flex-col gap-3 shadow-supabase"><div class="flex flex-col sm:flex-row gap-3"><div class="flex items-center gap-2"><select class="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand"><option value="0"${ssrIncludeBooleanAttr(Array.isArray(mesFiltro.value) ? ssrLooseContain(mesFiltro.value, "0") : ssrLooseEqual(mesFiltro.value, "0")) ? " selected" : ""}>Todos os Meses</option><!--[-->`);
				ssrRenderList(nomesMeses, (nome, idx) => {
					_push(`<option${ssrRenderAttr("value", idx + 1)}${ssrIncludeBooleanAttr(Array.isArray(mesFiltro.value) ? ssrLooseContain(mesFiltro.value, idx + 1) : ssrLooseEqual(mesFiltro.value, idx + 1)) ? " selected" : ""}>${ssrInterpolate(nome)}</option>`);
				});
				_push(`<!--]--></select><select class="bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand"><!--[-->`);
				ssrRenderList(anos.value, (a) => {
					_push(`<option${ssrRenderAttr("value", a)}${ssrIncludeBooleanAttr(Array.isArray(anoFiltro.value) ? ssrLooseContain(anoFiltro.value, a) : ssrLooseEqual(anoFiltro.value, a)) ? " selected" : ""}>${ssrInterpolate(a)}</option>`);
				});
				_push(`<!--]--></select></div><div class="relative flex-1"><input${ssrRenderAttr("value", busca.value)} type="text" placeholder="Buscar por descrição..." class="w-full bg-dark-900 border border-dark-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand placeholder:text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div></div><div class="flex flex-wrap items-center gap-2"><select class="flex-1 min-w-[130px] bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand"><option value="todos"${ssrIncludeBooleanAttr(Array.isArray(filtroTipo.value) ? ssrLooseContain(filtroTipo.value, "todos") : ssrLooseEqual(filtroTipo.value, "todos")) ? " selected" : ""}>Todos os Tipos</option><option value="receita"${ssrIncludeBooleanAttr(Array.isArray(filtroTipo.value) ? ssrLooseContain(filtroTipo.value, "receita") : ssrLooseEqual(filtroTipo.value, "receita")) ? " selected" : ""}>Receitas (+)</option><option value="despesa"${ssrIncludeBooleanAttr(Array.isArray(filtroTipo.value) ? ssrLooseContain(filtroTipo.value, "despesa") : ssrLooseEqual(filtroTipo.value, "despesa")) ? " selected" : ""}>Despesas (-)</option></select><select class="flex-1 min-w-[140px] bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand"><option value="todas"${ssrIncludeBooleanAttr(Array.isArray(filtroCategoria.value) ? ssrLooseContain(filtroCategoria.value, "todas") : ssrLooseEqual(filtroCategoria.value, "todas")) ? " selected" : ""}>Todas as Categorias</option><!--[-->`);
				ssrRenderList(unref(categorias), (cat) => {
					_push(`<option${ssrRenderAttr("value", cat.nome)}${ssrIncludeBooleanAttr(Array.isArray(filtroCategoria.value) ? ssrLooseContain(filtroCategoria.value, cat.nome) : ssrLooseEqual(filtroCategoria.value, cat.nome)) ? " selected" : ""}>${ssrInterpolate(cat.nome)}</option>`);
				});
				_push(`<!--]--></select><select class="flex-1 min-w-[130px] bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-brand"><option value="todas"${ssrIncludeBooleanAttr(Array.isArray(filtroConta.value) ? ssrLooseContain(filtroConta.value, "todas") : ssrLooseEqual(filtroConta.value, "todas")) ? " selected" : ""}>Todas as Contas</option><!--[-->`);
				ssrRenderList(unref(bancos), (banco) => {
					_push(`<option${ssrRenderAttr("value", banco.nome)}${ssrIncludeBooleanAttr(Array.isArray(filtroConta.value) ? ssrLooseContain(filtroConta.value, banco.nome) : ssrLooseEqual(filtroConta.value, banco.nome)) ? " selected" : ""}>${ssrInterpolate(banco.nome)}</option>`);
				});
				_push(`<!--]--><option value="cartao"${ssrIncludeBooleanAttr(Array.isArray(filtroConta.value) ? ssrLooseContain(filtroConta.value, "cartao") : ssrLooseEqual(filtroConta.value, "cartao")) ? " selected" : ""}>Cartão de Crédito</option></select><button class="text-xs text-gray-400 hover:text-white px-3 py-2 hover:bg-dark-700 rounded-lg transition-colors whitespace-nowrap"> Limpar </button></div></div><div class="grid grid-cols-3 gap-4"><div class="bg-dark-800 border border-income/20 rounded-xl p-4"><p class="text-xs text-gray-400 mb-1">Receitas</p><p class="text-lg font-extrabold font-mono text-income">+ R\$ ${ssrInterpolate(totalReceitas.value.toFixed(2))}</p></div><div class="bg-dark-800 border border-expense/20 rounded-xl p-4"><p class="text-xs text-gray-400 mb-1">Despesas</p><p class="text-lg font-extrabold font-mono text-expense">- R\$ ${ssrInterpolate(totalDespesas.value.toFixed(2))}</p></div><div class="bg-dark-800 border border-dark-700/80 rounded-xl p-4"><p class="text-xs text-gray-400 mb-1">Balanço</p><p class="${ssrRenderClass([balanco.value >= 0 ? "text-brand" : "text-expense", "text-lg font-extrabold font-mono"])}">${ssrInterpolate(balanco.value >= 0 ? "+" : "")}R\$ ${ssrInterpolate(balanco.value.toFixed(2))}</p></div></div><div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-4 md:p-6 shadow-supabase"><div class="flex items-center justify-between mb-4"><span class="text-xs text-gray-400 font-mono">${ssrInterpolate(lancamentosFiltrados.value.length)} lançamentos encontrados </span>`);
				if (lancamentosFiltrados.value.length > 0) {
					_push(`<button${ssrIncludeBooleanAttr(apagandoTodos.value) ? " disabled" : ""} class="text-xs font-semibold text-expense hover:text-white bg-expense/10 hover:bg-expense/30 border border-expense/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50">`);
					if (apagandoTodos.value) _push(`<svg class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 12h4z"></path></svg>`);
					else _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`);
					_push(` ${ssrInterpolate(apagandoTodos.value ? "Apagando..." : `Apagar todos (${lancamentosFiltrados.value.length})`)}</button>`);
				} else _push(`<!---->`);
				_push(`</div><div class="sm:hidden space-y-3"><!--[-->`);
				ssrRenderList(lancamentosFiltrados.value, (item) => {
					_push(`<div class="flex items-center justify-between p-3 rounded-xl bg-dark-900 border border-dark-700/80 group"><div class="flex items-center gap-3 min-w-0 flex-1"><div class="${ssrRenderClass([item.tipo === "receita" ? "bg-income/15 border-income/30 text-income" : "bg-expense/15 border-expense/30 text-expense", "w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs border shrink-0"])}">${ssrInterpolate(item.tipo === "receita" ? "ENT" : "SAÍ")}</div><div class="min-w-0"><div class="flex items-center gap-2"><p class="text-sm font-semibold text-white truncate">${ssrInterpolate(item.descricao)}</p>`);
					if (isItemShared(item)) _push(`<span class="text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono font-bold whitespace-nowrap shrink-0"> 🤝 50/50 </span>`);
					else _push(`<!---->`);
					_push(`</div><p class="text-[11px] text-gray-400 font-mono">${ssrInterpolate(item.categoria)} · ${ssrInterpolate(formatData(item.data))}</p></div></div><div class="flex items-center gap-2 shrink-0 ml-2"><span class="${ssrRenderClass([item.tipo === "receita" ? "text-income" : "text-expense", "text-sm font-bold font-mono"])}">${ssrInterpolate(item.tipo === "receita" ? "+" : "-")}R\$${ssrInterpolate(item.valor.toFixed(2))}</span><div class="flex flex-col gap-0.5"><button class="text-gray-600 hover:text-brand p-1 rounded hover:bg-brand/10 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button class="text-gray-600 hover:text-expense p-1 rounded hover:bg-expense/10 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></div></div>`);
				});
				_push(`<!--]-->`);
				if (lancamentosFiltrados.value.length === 0) _push(`<div class="py-8 text-center text-gray-400 text-sm"> Nenhum lançamento encontrado com os filtros selecionados. </div>`);
				else _push(`<!---->`);
				_push(`</div><div class="hidden sm:block overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400"><th class="pb-3">Tipo &amp; Descrição</th><th class="pb-3 hidden md:table-cell">Categoria</th><th class="pb-3 hidden lg:table-cell">Conta / Cartão</th><th class="pb-3 hidden md:table-cell">Data</th><th class="pb-3 text-right">Valor (R\$)</th><th class="pb-3 text-center">Ações</th></tr></thead><tbody class="divide-y divide-dark-700/60 text-sm"><!--[-->`);
				ssrRenderList(lancamentosFiltrados.value, (item) => {
					_push(`<tr class="group hover:bg-dark-750/60 transition-colors"><td class="py-4 font-medium text-white"><div class="flex items-center gap-3"><div class="${ssrRenderClass([item.tipo === "receita" ? "bg-income/15 border-income/30 text-income" : "bg-expense/15 border-expense/30 text-expense", "w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs border shrink-0"])}">${ssrInterpolate(item.tipo === "receita" ? "ENT" : "SAÍ")}</div><div><div class="flex items-center gap-2"><p class="text-sm font-semibold text-white">${ssrInterpolate(item.descricao)}</p>`);
					if (isItemShared(item)) _push(`<span class="text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono font-bold whitespace-nowrap"> 🤝 50/50 </span>`);
					else _push(`<!---->`);
					_push(`</div><span class="text-[11px] text-gray-400 font-mono">${ssrInterpolate(item.tipo === "receita" ? "Entrada" : "Saída")} ${ssrInterpolate(item.total_parcelas > 1 ? ` · Parc ${item.parcela_atual}/${item.total_parcelas}` : "")}</span></div></div></td><td class="py-4 hidden md:table-cell"><span class="text-xs px-2.5 py-1 rounded-md bg-dark-900 border border-dark-700 text-gray-300 font-medium">${ssrInterpolate(item.categoria)}</span></td><td class="py-4 text-xs font-mono text-gray-300 hidden lg:table-cell">`);
					if (item.cartao_nome) _push(`<span class="text-purple-400">💳 ${ssrInterpolate(item.cartao_nome)}</span>`);
					else _push(`<span>${ssrInterpolate(item.conta || "—")}</span>`);
					_push(`</td><td class="py-4 text-xs font-mono text-gray-400 hidden md:table-cell">${ssrInterpolate(formatData(item.data))}</td><td class="${ssrRenderClass([item.tipo === "receita" ? "text-income" : "text-expense", "py-4 text-right font-bold font-mono text-base"])}">${ssrInterpolate(item.tipo === "receita" ? "+" : "-")} R\$ ${ssrInterpolate(item.valor.toFixed(2))}</td><td class="py-4 text-center"><div class="flex items-center justify-center gap-1"><button class="text-gray-500 hover:text-brand p-1.5 rounded-lg hover:bg-brand/10 transition-colors" title="Editar Lançamento"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button class="text-gray-500 hover:text-expense p-1.5 rounded-lg hover:bg-expense/10 transition-colors" title="Excluir Lançamento"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
				});
				_push(`<!--]-->`);
				if (lancamentosFiltrados.value.length === 0) _push(`<tr><td colspan="6" class="py-8 text-center text-gray-400 text-sm"> Nenhum lançamento encontrado com os filtros selecionados. </td></tr>`);
				else _push(`<!---->`);
				_push(`</tbody></table></div></div><!--]-->`);
			}
			_push(`</main>`);
			_push(ssrRenderComponent(_component_ModalNovoLancamento, {
				aberto: modalAberto.value,
				"lancamento-para-editar": lancamentoEditando.value,
				onFechar: fecharModalLancamento,
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lancamentos.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=lancamentos-DcNmT8L7.mjs.map
