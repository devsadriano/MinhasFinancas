import { _ as _plugin_vue_export_helper_default, a as useSupabaseUser, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-VW3GFU14.mjs';
import { u as useFinancas } from './useFinancas-C7KH4i6q.mjs';
import { _ as _sfc_main$1 } from './ModalNovoLancamento-DS8yO2EF.mjs';
import { defineComponent, ref, mergeProps, computed, unref, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, useSSRContext } from 'vue';
import { useRoute } from 'vue-router';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrRenderList, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
import { HomeIcon, ArrowsRightLeftIcon, CreditCardIcon, SparklesIcon, ArrowPathIcon, ChartPieIcon, ChartBarIcon, TagIcon, BuildingLibraryIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';
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
import '@vue/shared';
import 'pinia';
import '@supabase/ssr';
import 'unhead/utils';
import './useWorkspace-CnSCU5qX.mjs';

//#region app/components/Sidebar.vue
var _sfc_main = {
	__name: "Sidebar",
	__ssrInlineRender: true,
	setup(__props, { expose: __expose }) {
		const route = useRoute();
		useSupabaseClient();
		const user = useSupabaseUser();
		const mobileOpen = ref(false);
		const userEmail = computed(() => user.value?.email || "usuario@financas.app");
		const userName = computed(() => user.value?.user_metadata?.nome || userEmail.value.split("@")[0] || "Usuário");
		const userInitial = computed(() => userName.value.substring(0, 2).toUpperCase());
		const menuItems = [
			{
				label: "Visão Geral",
				path: "/",
				icon: HomeIcon
			},
			{
				label: "Extrato & Lançamentos",
				path: "/lancamentos",
				icon: ArrowsRightLeftIcon
			},
			{
				label: "Cartões & Faturas",
				path: "/cartoes",
				icon: CreditCardIcon
			},
			{
				label: "Caixinhas & Metas",
				path: "/metas",
				icon: SparklesIcon
			},
			{
				label: "Transferências",
				path: "/transferencias",
				icon: ArrowPathIcon
			},
			{
				label: "Orçamentos & Tetos",
				path: "/orcamentos",
				icon: ChartPieIcon
			},
			{
				label: "Relatórios",
				path: "/relatorios",
				icon: ChartBarIcon
			},
			{
				label: "Categorias",
				path: "/categorias",
				icon: TagIcon
			},
			{
				label: "Contas & Bancos",
				path: "/contas",
				icon: BuildingLibraryIcon
			},
			{
				label: "Configurações",
				path: "/configuracoes",
				icon: Cog6ToothIcon
			}
		];
		__expose({ mobileOpen });
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "w-0 lg:w-64 shrink-0" }, _attrs))} data-v-be0fb466>`);
			if (mobileOpen.value) _push(`<div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" data-v-be0fb466></div>`);
			else _push(`<!---->`);
			_push(`<aside class="${ssrRenderClass([mobileOpen.value ? "translate-x-0" : "-translate-x-full lg:translate-x-0", "fixed lg:sticky top-0 left-0 h-screen w-64 bg-dark-850 border-r border-dark-700 flex flex-col justify-between z-50 select-none transition-transform lg:transition-none duration-300 ease-in-out"])}" data-v-be0fb466><div data-v-be0fb466><div class="h-16 flex items-center px-6 border-b border-dark-700/60 gap-3" data-v-be0fb466><div class="w-9 h-9 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand shadow-glow-emerald" data-v-be0fb466><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-be0fb466><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-be0fb466></path></svg></div><div class="flex-1 min-w-0" data-v-be0fb466><h1 class="font-bold text-white tracking-wide text-base leading-tight" data-v-be0fb466>Minhas Finanças</h1><span class="text-[10px] text-brand font-mono font-medium tracking-wider uppercase bg-brand/10 px-1.5 py-0.5 rounded border border-brand/20" data-v-be0fb466>Supabase Edition</span></div><button class="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-dark-700 transition-colors focus:outline-none" data-v-be0fb466><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-be0fb466><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-be0fb466></path></svg></button></div><nav class="p-4 space-y-1.5" data-v-be0fb466><!--[-->`);
			ssrRenderList(menuItems, (item) => {
				_push(ssrRenderComponent(_component_NuxtLink, {
					key: item.path,
					to: item.path,
					class: ["flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 group outline-none focus:outline-none", [unref(route).path === item.path ? "bg-dark-800 text-white border border-dark-700 shadow-sm" : "text-gray-400 hover:text-gray-200 hover:bg-dark-800/50"]],
					onClick: ($event) => mobileOpen.value = false
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="${ssrRenderClass([unref(route).path === item.path ? "bg-brand shadow-glow-emerald" : "bg-transparent group-hover:bg-dark-600", "w-2 h-2 rounded-full transition-colors"])}" data-v-be0fb466${_scopeId}></div>`);
							ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: ["w-5 h-5 transition-colors", unref(route).path === item.path ? "text-brand" : "text-gray-400 group-hover:text-gray-200"] }, null), _parent, _scopeId);
							_push(`<span data-v-be0fb466${_scopeId}>${ssrInterpolate(item.label)}</span>`);
						} else return [
							createVNode("div", { class: ["w-2 h-2 rounded-full transition-colors", unref(route).path === item.path ? "bg-brand shadow-glow-emerald" : "bg-transparent group-hover:bg-dark-600"] }, null, 2),
							(openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: ["w-5 h-5 transition-colors", unref(route).path === item.path ? "text-brand" : "text-gray-400 group-hover:text-gray-200"] }, null, 8, ["class"])),
							createVNode("span", null, toDisplayString(item.label), 1)
						];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></nav></div><div class="p-4 border-t border-dark-700/60 bg-dark-900/40" data-v-be0fb466><div class="flex items-center justify-between p-2 rounded-lg bg-dark-800/60 border border-dark-700/80" data-v-be0fb466><div class="flex items-center gap-3 min-w-0" data-v-be0fb466><div class="w-8 h-8 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-brand font-bold text-xs shrink-0" data-v-be0fb466>${ssrInterpolate(userInitial.value)}</div><div class="flex-1 min-w-0" data-v-be0fb466><p class="text-xs font-semibold text-gray-200 truncate" data-v-be0fb466>${ssrInterpolate(userName.value)}</p><p class="text-[11px] text-gray-400 truncate" data-v-be0fb466>${ssrInterpolate(userEmail.value)}</p></div></div><button class="text-gray-400 hover:text-expense p-1.5 rounded-lg hover:bg-expense/10 transition-colors ml-1 shrink-0" title="Sair da Conta" data-v-be0fb466><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-be0fb466><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" data-v-be0fb466></path></svg></button></div></div></aside></div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var Sidebar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-be0fb466"]]);
//#endregion
//#region app/components/BottomNav.vue?vue&type=script&setup=true&lang.ts
var BottomNav_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "BottomNav",
	__ssrInlineRender: true,
	emits: ["abrirNovoLancamento"],
	setup(__props, { emit: __emit }) {
		const route = useRoute();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed bottom-0 left-0 right-0 z-40 md:hidden bg-dark-850/90 backdrop-blur-lg border-t border-dark-700/80 pb-[env(safe-area-inset-bottom)] select-none" }, _attrs))}><div class="flex items-center justify-around h-16 px-2 relative">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/",
				class: ["flex flex-col items-center justify-center w-14 h-full text-xs font-medium transition-colors", unref(route).path === "/" ? "text-brand font-bold" : "text-gray-400 hover:text-gray-200"]
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"${_scopeId}></path></svg><span class="text-[10px] mt-0.5"${_scopeId}>Início</span>`);
					else return [(openBlock(), createBlock("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						class: "h-5 w-5",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor"
					}, [createVNode("path", {
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					})])), createVNode("span", { class: "text-[10px] mt-0.5" }, "Início")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/lancamentos",
				class: ["flex flex-col items-center justify-center w-14 h-full text-xs font-medium transition-colors", unref(route).path === "/lancamentos" ? "text-brand font-bold" : "text-gray-400 hover:text-gray-200"]
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"${_scopeId}></path></svg><span class="text-[10px] mt-0.5"${_scopeId}>Extrato</span>`);
					else return [(openBlock(), createBlock("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						class: "h-5 w-5",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor"
					}, [createVNode("path", {
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
					})])), createVNode("span", { class: "text-[10px] mt-0.5" }, "Extrato")];
				}),
				_: 1
			}, _parent));
			_push(`<div class="relative -top-5 flex items-center justify-center"><button class="w-13 h-13 rounded-full bg-brand text-dark-950 font-extrabold flex items-center justify-center shadow-glow-emerald border-4 border-dark-900 active:scale-95 transition-transform cursor-pointer" title="Novo Lançamento"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.8" d="M12 4v16m8-8H4"></path></svg></button></div>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/metas",
				class: ["flex flex-col items-center justify-center w-14 h-full text-xs font-medium transition-colors", unref(route).path === "/metas" ? "text-brand font-bold" : "text-gray-400 hover:text-gray-200"]
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"${_scopeId}></path></svg><span class="text-[10px] mt-0.5"${_scopeId}>Metas</span>`);
					else return [(openBlock(), createBlock("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						class: "h-5 w-5",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor"
					}, [createVNode("path", {
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
					})])), createVNode("span", { class: "text-[10px] mt-0.5" }, "Metas")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/configuracoes",
				class: ["flex flex-col items-center justify-center w-14 h-full text-xs font-medium transition-colors", unref(route).path === "/configuracoes" ? "text-brand font-bold" : "text-gray-400 hover:text-gray-200"]
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path></svg><span class="text-[10px] mt-0.5"${_scopeId}>Ajustes</span>`);
					else return [(openBlock(), createBlock("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						class: "h-5 w-5",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor"
					}, [createVNode("path", {
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
					}), createVNode("path", {
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					})])), createVNode("span", { class: "text-[10px] mt-0.5" }, "Ajustes")];
				}),
				_: 1
			}, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/components/BottomNav.vue
var _sfc_setup$1 = BottomNav_vue_vue_type_script_setup_true_lang_default.setup;
BottomNav_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BottomNav.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var BottomNav_default = Object.assign(BottomNav_vue_vue_type_script_setup_true_lang_default, { __name: "BottomNav" });
//#endregion
//#region app/layouts/default.vue?vue&type=script&setup=true&lang.ts
var default_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "default",
	__ssrInlineRender: true,
	setup(__props) {
		const sidebarRef = ref(null);
		const modalNovoLancamentoAberto = ref(false);
		const { adicionarLancamento } = useFinancas();
		const handleSalvarNovoLancamento = async (item) => {
			await adicionarLancamento(item);
			modalNovoLancamentoAberto.value = false;
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-dark-900 text-gray-100 flex font-sans antialiased selection:bg-brand/30 selection:text-brand" }, _attrs))}>`);
			_push(ssrRenderComponent(Sidebar_default, {
				ref_key: "sidebarRef",
				ref: sidebarRef
			}, null, _parent));
			_push(`<div class="flex-1 flex flex-col min-w-0 bg-grid-pattern pb-24 md:pb-0"><div class="lg:hidden h-14 bg-dark-850/90 backdrop-blur-md border-b border-dark-700/60 flex items-center justify-between px-4 sticky top-0 z-30"><div class="flex items-center gap-3"><button class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-dark-700 transition-colors focus:outline-none" aria-label="Abrir menu"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button><div class="flex items-center gap-2"><div class="w-7 h-7 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><span class="font-bold text-white text-sm">Minhas Finanças</span></div></div><button class="bg-brand text-dark-950 font-extrabold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-glow-emerald"><span>+ Novo</span></button></div>`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(ssrRenderComponent(BottomNav_default, { onAbrirNovoLancamento: ($event) => modalNovoLancamentoAberto.value = true }, null, _parent));
			_push(ssrRenderComponent(_sfc_main$1, {
				aberto: modalNovoLancamentoAberto.value,
				onFechar: ($event) => modalNovoLancamentoAberto.value = false,
				onSalvar: handleSalvarNovoLancamento
			}, null, _parent));
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/layouts/default.vue
var _sfc_setup = default_vue_vue_type_script_setup_true_lang_default.setup;
default_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var default_default = default_vue_vue_type_script_setup_true_lang_default;

export { default_default as default };
//# sourceMappingURL=default-eCmo4JEz.mjs.map
