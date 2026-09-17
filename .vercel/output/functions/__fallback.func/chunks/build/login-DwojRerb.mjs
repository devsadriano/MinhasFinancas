import { a as useSupabaseUser, n as navigateTo } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-VW3GFU14.mjs';
import { defineComponent, ref, watchEffect, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

//#endregion
//#region app/pages/login.vue?vue&type=script&setup=true&lang.ts
var login_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "login",
	__ssrInlineRender: true,
	setup(__props) {
		useSupabaseClient();
		const user = useSupabaseUser();
		const modo = ref("login");
		const nome = ref("");
		const email = ref("");
		const senha = ref("");
		const carregando = ref(false);
		const mensagemErro = ref("");
		const mensagemSucesso = ref("");
		watchEffect(() => {
			if (user.value) navigateTo("/");
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-dark-950 flex items-center justify-center p-4 bg-grid-pattern selection:bg-brand/30 selection:text-brand" }, _attrs))}><div class="w-full max-w-md bg-dark-900 border border-dark-700/90 rounded-2xl p-8 shadow-2xl relative overflow-hidden"><div class="absolute -top-24 -left-24 w-48 h-48 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div><div class="text-center mb-6"><div class="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand mx-auto mb-3 shadow-glow-emerald"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><h2 class="text-2xl font-extrabold text-white tracking-tight">Minhas Finanças</h2><p class="text-xs text-gray-400 mt-1">Acesse ou crie sua conta para gerenciar seu patrimônio</p></div><div class="grid grid-cols-2 gap-1 p-1 bg-dark-950 border border-dark-700/80 rounded-xl mb-6"><button type="button" class="${ssrRenderClass([modo.value === "login" ? "bg-dark-800 text-white shadow-sm border border-dark-700" : "text-gray-400 hover:text-white", "py-2 text-xs font-bold rounded-lg transition-all"])}"> Entrar </button><button type="button" class="${ssrRenderClass([modo.value === "registro" ? "bg-dark-800 text-white shadow-sm border border-dark-700" : "text-gray-400 hover:text-white", "py-2 text-xs font-bold rounded-lg transition-all"])}"> Criar Conta </button></div>`);
			if (mensagemErro.value) _push(`<div class="mb-4 p-3 rounded-lg bg-expense/10 border border-expense/30 text-expense text-xs font-medium">${ssrInterpolate(mensagemErro.value)}</div>`);
			else _push(`<!---->`);
			if (mensagemSucesso.value) _push(`<div class="mb-4 p-3 rounded-lg bg-income/10 border border-income/30 text-income text-xs font-medium">${ssrInterpolate(mensagemSucesso.value)}</div>`);
			else _push(`<!---->`);
			_push(`<form class="space-y-4">`);
			if (modo.value === "registro") _push(`<div><label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Nome Completo</label><input${ssrRenderAttr("value", nome.value)} type="text" placeholder="Seu nome" required class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"></div>`);
			else _push(`<!---->`);
			_push(`<div><label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">E-mail</label><input${ssrRenderAttr("value", email.value)} type="email" placeholder="seuemail@exemplo.com" required class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"></div><div><label class="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Senha</label><input${ssrRenderAttr("value", senha.value)} type="password" placeholder="••••••••" required minlength="6" class="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors placeholder:text-gray-600"></div><button type="submit"${ssrIncludeBooleanAttr(carregando.value) ? " disabled" : ""} class="w-full bg-brand hover:bg-brand-400 disabled:opacity-50 text-dark-950 font-bold py-3 rounded-lg text-sm transition-all shadow-glow-emerald mt-2 flex items-center justify-center gap-2">`);
			if (carregando.value) _push(`<svg class="animate-spin h-4 w-4 text-dark-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
			else _push(`<!---->`);
			_push(`<span>${ssrInterpolate(carregando.value ? "Processando..." : modo.value === "login" ? "Entrar no Sistema" : "Criar Minha Conta")}</span></button></form></div></div>`);
		};
	}
});
//#endregion
//#region app/pages/login.vue
var _sfc_setup = login_vue_vue_type_script_setup_true_lang_default.setup;
login_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var login_default = login_vue_vue_type_script_setup_true_lang_default;

export { login_default as default };
//# sourceMappingURL=login-DwojRerb.mjs.map
