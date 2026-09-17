import { N as NuxtLink } from '../virtual/entry.mjs';
import { u as useFinancas } from './useFinancas-C7KH4i6q.mjs';
import { _ as _sfc_main$1 } from './Header-DO9G6iKM.mjs';
import { ref, reactive, computed, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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

//#region app/pages/contas.vue
var _sfc_main = {
	__name: "contas",
	__ssrInlineRender: true,
	setup(__props) {
		const { bancos, carregando} = useFinancas();
		const modalAberto = ref(false);
		const modalExcluir = ref(false);
		const modoEditar = ref(false);
		const contaParaExcluir = ref(null);
		ref(null);
		const coresSugeridas = [
			"#3ecf8e",
			"#820ad1",
			"#ec7000",
			"#ff7a00",
			"#3b82f6",
			"#ef4444",
			"#f59e0b",
			"#06b6d4",
			"#84cc16",
			"#ec4899"
		];
		const form = reactive({
			nome: "",
			tipo: "Conta Corrente",
			saldo: 0,
			cor: "#3ecf8e"
		});
		const saldoTotal = computed(() => bancos.value.reduce((a, c) => a + c.saldo, 0));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Header = _sfc_main$1;
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			_push(ssrRenderComponent(_component_Header, {
				title: "Contas Bancárias & Carteiras",
				subtitle: "Gerencie suas contas, saldos e bancos cadastrados",
				showAction: false
			}, null, _parent));
			_push(`<main class="p-4 md:p-8 max-w-7xl mx-auto space-y-5 md:space-y-6"><div class="flex items-center justify-between"><h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-brand"></span> Suas Contas Ativas (${ssrInterpolate(unref(bancos).length)}) </h3><button class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-glow-emerald flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg><span>Nova Conta</span></button></div>`);
			if (unref(carregando)) _push(`<div class="py-12 text-center text-brand"><svg class="animate-spin h-8 w-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`);
			else {
				_push(`<div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
				ssrRenderList(unref(bancos), (banco) => {
					_push(`<div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase relative overflow-hidden group hover:border-dark-600 transition-all flex flex-col justify-between"><div class="absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none" style="${ssrRenderStyle({ backgroundColor: banco.cor })}"></div><div><div class="flex items-center justify-between mb-4"><div class="flex items-center gap-3"><div class="w-4 h-4 rounded-full shadow-sm" style="${ssrRenderStyle({ backgroundColor: banco.cor })}"></div><h3 class="text-base font-bold text-white truncate max-w-[140px]">${ssrInterpolate(banco.nome)}</h3></div><span class="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-dark-900 border border-dark-700 text-gray-400 uppercase">${ssrInterpolate(banco.tipo)}</span></div><p class="text-xs text-gray-400 mb-1">Saldo Atual Disponível</p><p class="${ssrRenderClass([banco.saldo >= 0 ? "text-white" : "text-expense", "text-2xl font-extrabold font-mono tracking-tight"])}"> R\$ ${ssrInterpolate(banco.saldo.toFixed(2))}</p></div><div class="mt-6 pt-4 border-t border-dark-700/60 flex items-center justify-between text-xs">`);
					_push(ssrRenderComponent(_component_NuxtLink, {
						to: `/lancamentos?conta=${banco.id}`,
						class: "text-brand font-semibold hover:underline font-mono"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(` Ver Extrato → `);
							else return [createTextVNode(" Ver Extrato → ")];
						}),
						_: 2
					}, _parent));
					_push(`<div class="flex items-center gap-1"><button class="p-1.5 rounded-lg text-gray-500 hover:text-brand hover:bg-brand/10 transition-colors" title="Editar conta"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button class="p-1.5 rounded-lg text-gray-500 hover:text-expense hover:bg-expense/10 transition-colors" title="Excluir conta"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></div></div>`);
				});
				_push(`<!--]--></div>`);
				if (unref(bancos).length > 0) _push(`<div class="mt-4 p-4 bg-dark-800 border border-dark-700/80 rounded-2xl flex items-center justify-between"><span class="text-sm text-gray-400 font-mono">Saldo Total Consolidado</span><span class="${ssrRenderClass([saldoTotal.value >= 0 ? "text-brand" : "text-expense", "text-xl font-extrabold font-mono"])}"> R\$ ${ssrInterpolate(saldoTotal.value.toFixed(2))}</span></div>`);
				else _push(`<!---->`);
				if (unref(bancos).length === 0) _push(`<div class="py-16 text-center"><div class="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div><p class="text-white font-bold mb-1">Nenhuma conta cadastrada</p><p class="text-gray-400 text-sm mb-4">Adicione sua primeira conta bancária ou carteira</p><button class="bg-brand text-dark-950 font-bold px-6 py-2.5 rounded-lg text-sm"> + Nova Conta </button></div>`);
				else _push(`<!---->`);
				_push(`</div>`);
			}
			_push(`</main>`);
			if (modalAberto.value) {
				_push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"><div class="flex items-center justify-between border-b border-dark-700 pb-3"><h3 class="text-base font-bold text-white">${ssrInterpolate(modoEditar.value ? "Editar Conta" : "Cadastrar Nova Conta")}</h3><button class="text-gray-400 hover:text-white">✕</button></div><form class="space-y-3"><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Nome do Banco / Conta</label><input${ssrRenderAttr("value", form.nome)} type="text" placeholder="Ex: C6 Bank, XP, Poupança" required class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Tipo de Conta</label><select class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"><option value="Conta Corrente"${ssrIncludeBooleanAttr(Array.isArray(form.tipo) ? ssrLooseContain(form.tipo, "Conta Corrente") : ssrLooseEqual(form.tipo, "Conta Corrente")) ? " selected" : ""}>Conta Corrente</option><option value="Investimentos"${ssrIncludeBooleanAttr(Array.isArray(form.tipo) ? ssrLooseContain(form.tipo, "Investimentos") : ssrLooseEqual(form.tipo, "Investimentos")) ? " selected" : ""}>Investimentos</option><option value="Dinheiro"${ssrIncludeBooleanAttr(Array.isArray(form.tipo) ? ssrLooseContain(form.tipo, "Dinheiro") : ssrLooseEqual(form.tipo, "Dinheiro")) ? " selected" : ""}>Dinheiro / Carteira</option><option value="Poupança"${ssrIncludeBooleanAttr(Array.isArray(form.tipo) ? ssrLooseContain(form.tipo, "Poupança") : ssrLooseEqual(form.tipo, "Poupança")) ? " selected" : ""}>Poupança</option><option value="Conta Salário"${ssrIncludeBooleanAttr(Array.isArray(form.tipo) ? ssrLooseContain(form.tipo, "Conta Salário") : ssrLooseEqual(form.tipo, "Conta Salário")) ? " selected" : ""}>Conta Salário</option><option value="Conta Digital"${ssrIncludeBooleanAttr(Array.isArray(form.tipo) ? ssrLooseContain(form.tipo, "Conta Digital") : ssrLooseEqual(form.tipo, "Conta Digital")) ? " selected" : ""}>Conta Digital</option></select></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">${ssrInterpolate(modoEditar.value ? "Saldo Atual (R$)" : "Saldo Inicial (R$)")}</label><input${ssrRenderAttr("value", form.saldo)} type="number" step="0.01" required placeholder="0,00" class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-brand"></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Cor do Banco</label><div class="flex items-center gap-3"><input${ssrRenderAttr("value", form.cor)} type="color" class="w-12 h-10 bg-dark-900 border border-dark-700 rounded-lg p-1 cursor-pointer"><div class="flex gap-2 flex-wrap"><!--[-->`);
				ssrRenderList(coresSugeridas, (cor) => {
					_push(`<button type="button" style="${ssrRenderStyle({ backgroundColor: cor })}" class="${ssrRenderClass([form.cor === cor ? "border-white scale-110" : "border-transparent", "w-6 h-6 rounded-full border-2 transition-all"])}"></button>`);
				});
				_push(`<!--]--></div></div></div><div class="flex items-center justify-end gap-2 pt-3"><button type="button" class="px-4 py-2 text-xs text-gray-400 hover:text-white">Cancelar</button><button type="submit" class="bg-brand text-dark-950 font-bold px-5 py-2 rounded-lg text-xs">${ssrInterpolate(modoEditar.value ? "Salvar Alterações" : "Criar Conta")}</button></div></form></div></div>`);
			} else _push(`<!---->`);
			if (modalExcluir.value) _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div class="bg-dark-800 border border-expense/30 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-expense/15 border border-expense/30 flex items-center justify-center text-expense"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div><h3 class="text-base font-bold text-white">Excluir Conta</h3><p class="text-xs text-gray-400">Esta ação não pode ser desfeita</p></div></div><p class="text-sm text-gray-300"> Tem certeza que deseja excluir a conta <strong class="text-white">${ssrInterpolate(contaParaExcluir.value?.nome)}</strong>? Os lançamentos vinculados perderão o vínculo com a conta. </p><div class="flex items-center justify-end gap-2 pt-2"><button class="px-4 py-2 text-xs text-gray-400 hover:text-white">Cancelar</button><button class="bg-expense hover:bg-red-500 text-white font-bold px-5 py-2 rounded-lg text-xs"> Sim, Excluir </button></div></div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contas.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contas-3j6pHCe6.mjs.map
