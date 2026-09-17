import { u as useFinancas } from './useFinancas-C7KH4i6q.mjs';
import { _ as _sfc_main$1 } from './Header-DO9G6iKM.mjs';
import { reactive, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
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

//#region app/pages/transferencias.vue
var _sfc_main = {
	__name: "transferencias",
	__ssrInlineRender: true,
	setup(__props) {
		const { bancos, transferencias, carregando} = useFinancas();
		const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		const form = reactive({
			conta_origem_id: "",
			conta_destino_id: "",
			valor: null,
			data: today,
			descricao: ""
		});
		const contaOrigem = computed(() => bancos.value.find((b) => b.id === form.conta_origem_id));
		const contaDestino = computed(() => bancos.value.find((b) => b.id === form.conta_destino_id));
		const podeTransferir = computed(() => form.conta_origem_id && form.conta_destino_id && form.conta_origem_id !== form.conta_destino_id && form.valor > 0 && form.data);
		const formatData = (str) => {
			if (!str) return "";
			const parts = str.split("-");
			return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str;
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Header = _sfc_main$1;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			_push(ssrRenderComponent(_component_Header, {
				title: "Transferências Entre Contas",
				subtitle: "Movimente dinheiro entre suas próprias contas bancárias",
				showAction: false
			}, null, _parent));
			_push(`<main class="p-4 md:p-8 max-w-7xl mx-auto space-y-6"><div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase"><h3 class="text-base font-bold text-white mb-5 flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Nova Transferência </h3><form class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1.5">De (Conta Origem)</label><select required class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.conta_origem_id) ? ssrLooseContain(form.conta_origem_id, "") : ssrLooseEqual(form.conta_origem_id, "")) ? " selected" : ""}>Selecione a origem</option><!--[-->`);
			ssrRenderList(unref(bancos), (banco) => {
				_push(`<option${ssrRenderAttr("value", banco.id)}${ssrIncludeBooleanAttr(banco.id === form.conta_destino_id) ? " disabled" : ""}${ssrIncludeBooleanAttr(Array.isArray(form.conta_origem_id) ? ssrLooseContain(form.conta_origem_id, banco.id) : ssrLooseEqual(form.conta_origem_id, banco.id)) ? " selected" : ""}>${ssrInterpolate(banco.nome)} (R\$ ${ssrInterpolate(banco.saldo.toFixed(2))}) </option>`);
			});
			_push(`<!--]--></select></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Para (Conta Destino)</label><select required class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(form.conta_destino_id) ? ssrLooseContain(form.conta_destino_id, "") : ssrLooseEqual(form.conta_destino_id, "")) ? " selected" : ""}>Selecione o destino</option><!--[-->`);
			ssrRenderList(unref(bancos), (banco) => {
				_push(`<option${ssrRenderAttr("value", banco.id)}${ssrIncludeBooleanAttr(banco.id === form.conta_origem_id) ? " disabled" : ""}${ssrIncludeBooleanAttr(Array.isArray(form.conta_destino_id) ? ssrLooseContain(form.conta_destino_id, banco.id) : ssrLooseEqual(form.conta_destino_id, banco.id)) ? " selected" : ""}>${ssrInterpolate(banco.nome)} (R\$ ${ssrInterpolate(banco.saldo.toFixed(2))}) </option>`);
			});
			_push(`<!--]--></select></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Valor (R\$)</label><input${ssrRenderAttr("value", form.valor)} type="number" step="0.01" min="0.01" required placeholder="0,00" class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-blue-400"></div><div class="flex flex-col gap-2"><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Data</label><input${ssrRenderAttr("value", form.data)} type="date" required class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"></div></div><div class="lg:col-span-3"><label class="block text-xs font-semibold text-gray-300 uppercase mb-1.5">Descrição (opcional)</label><input${ssrRenderAttr("value", form.descricao)} type="text" placeholder="Ex: Reserva de emergência, pagamento cartão..." class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"></div><div class="flex items-end"><button type="submit"${ssrIncludeBooleanAttr(!podeTransferir.value) ? " disabled" : ""} class="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg> Transferir </button></div></form>`);
			if (podeTransferir.value) _push(`<div class="mt-4 p-4 bg-dark-900 border border-blue-500/20 rounded-xl flex items-center justify-center gap-4"><div class="text-center"><p class="text-xs text-gray-400">Origem</p><p class="text-sm font-bold text-white">${ssrInterpolate(contaOrigem.value?.nome)}</p><p class="text-xs font-mono text-expense">- R\$ ${ssrInterpolate((form.valor || 0).toFixed(2))}</p></div><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg><div class="text-center"><p class="text-xs text-gray-400">Destino</p><p class="text-sm font-bold text-white">${ssrInterpolate(contaDestino.value?.nome)}</p><p class="text-xs font-mono text-income">+ R\$ ${ssrInterpolate((form.valor || 0).toFixed(2))}</p></div></div>`);
			else _push(`<!---->`);
			_push(`</div><div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase"><h3 class="text-base font-bold text-white mb-5 flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Histórico de Transferências </h3>`);
			if (unref(carregando)) _push(`<div class="py-8 text-center text-blue-400"><svg class="animate-spin h-6 w-6 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`);
			else if (unref(transferencias).length === 0) _push(`<div class="py-12 text-center"><div class="text-4xl mb-3">↕️</div><p class="text-white font-bold mb-1">Nenhuma transferência realizada</p><p class="text-gray-400 text-sm">Realize sua primeira transferência entre contas acima</p></div>`);
			else {
				_push(`<div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400"><th class="pb-3">Data</th><th class="pb-3">De</th><th class="pb-3">Para</th><th class="pb-3">Descrição</th><th class="pb-3 text-right">Valor</th></tr></thead><tbody class="divide-y divide-dark-700/60 text-sm"><!--[-->`);
				ssrRenderList(unref(transferencias), (t) => {
					_push(`<tr class="hover:bg-dark-750/60 transition-colors"><td class="py-3.5 text-xs text-gray-400 font-mono">${ssrInterpolate(formatData(t.data))}</td><td class="py-3.5 font-medium text-white">${ssrInterpolate(t.conta_origem_nome)}</td><td class="py-3.5 font-medium text-white">${ssrInterpolate(t.conta_destino_nome)}</td><td class="py-3.5 text-xs text-gray-400">${ssrInterpolate(t.descricao || "—")}</td><td class="py-3.5 text-right font-bold font-mono text-blue-400">R\$ ${ssrInterpolate(Number(t.valor).toFixed(2))}</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div>`);
			}
			_push(`</div></main></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/transferencias.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=transferencias-CAck9VA7.mjs.map
