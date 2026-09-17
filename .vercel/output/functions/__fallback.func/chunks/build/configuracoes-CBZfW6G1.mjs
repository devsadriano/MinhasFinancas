import { u as useHead$1, a as useSupabaseUser } from '../virtual/entry.mjs';
import { u as useWorkspace } from './useWorkspace-CnSCU5qX.mjs';
import { W as WorkspaceToggle_default } from './WorkspaceToggle-DUt4Nbgb.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

//#region app/pages/configuracoes.vue?vue&type=script&setup=true&lang.ts
var configuracoes_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "configuracoes",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Configurações & Grupo - MinhasFinancas" });
		const { grupoAtivo, gruposDisponiveis, membrosGrupo, carregarWorkspace} = useWorkspace();
		const user = useSupabaseUser();
		const emailParceiro = ref("");
		const novoGrupoInput = ref("");
		const nomeGrupoEditavel = ref("");
		const editandoNomeGrupo = ref(false);
		const salvandoParceiro = ref(false);
		const salvandoGrupo = ref(false);
		const mensagemFeedback = ref({
			texto: "",
			tipo: "sucesso"
		});
		const userEmail = computed(() => user.value?.email || "usuario@financas.app");
		const userName = computed(() => user.value?.user_metadata?.nome || userEmail.value.split("@")[0] || "Usuário");
		const userInitial = computed(() => userName.value.substring(0, 2).toUpperCase());
		const userIdCurto = computed(() => user.value?.id ? `${user.value.id.substring(0, 8)}...` : "Local-Demo");
		watch(user, async (novoUser) => {
			if (novoUser) await carregarWorkspace();
		}, { immediate: true });
		watch(grupoAtivo, (novo) => {
			if (novo) nomeGrupoEditavel.value = novo.nome || "";
		}, { immediate: true });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4 md:p-8 max-w-5xl mx-auto space-y-6 md:space-y-8 pb-16" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-700/80 pb-5"><div><h1 class="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5"><span>⚙️</span> Configurações do Workspace &amp; Perfil </h1><p class="text-xs text-gray-400 mt-1"> Gerencie suas credenciais, nome do grupo de casal e vincule a conta do seu parceiro(a). </p></div>`);
			_push(ssrRenderComponent(WorkspaceToggle_default, null, null, _parent));
			_push(`</div>`);
			if (mensagemFeedback.value.texto) _push(`<div class="${ssrRenderClass([mensagemFeedback.value.tipo === "sucesso" ? "bg-income/15 border-income/30 text-income" : "bg-expense/15 border-expense/30 text-expense", "p-4 rounded-xl text-xs font-semibold flex items-center justify-between border shadow-lg transition-all animate-fade-in"])}"><div class="flex items-center gap-2"><span class="text-sm">${ssrInterpolate(mensagemFeedback.value.tipo === "sucesso" ? "✅" : "⚠️")}</span><span>${ssrInterpolate(mensagemFeedback.value.texto)}</span></div><button class="text-gray-400 hover:text-white font-bold text-sm">✕</button></div>`);
			else _push(`<!---->`);
			_push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-6 backdrop-blur-sm shadow-supabase space-y-4"><div class="flex items-center gap-3 border-b border-dark-700 pb-3"><div class="w-10 h-10 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand font-bold">${ssrInterpolate(userInitial.value)}</div><div><h2 class="text-sm font-bold text-white leading-tight">Meu Perfil</h2><p class="text-xs text-gray-400 font-mono">Conta Autenticada</p></div></div><div class="space-y-3 text-xs"><div><label class="text-gray-400 font-medium block mb-1">Nome Completo</label><input type="text"${ssrRenderAttr("value", userName.value)} disabled class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-gray-300 font-medium cursor-not-allowed"></div><div><label class="text-gray-400 font-medium block mb-1">Endereço de E-mail</label><input type="email"${ssrRenderAttr("value", userEmail.value)} disabled class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-gray-300 font-mono cursor-not-allowed"></div><div class="pt-2 flex items-center justify-between text-gray-400 font-mono text-[11px]"><span>Status: <strong class="text-brand">Ativo</strong></span><span>ID: ${ssrInterpolate(userIdCurto.value)}</span></div></div></div><div class="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-6 backdrop-blur-sm shadow-supabase space-y-4"><div class="flex items-center justify-between border-b border-dark-700 pb-3"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xl font-bold"> 🏠 </div><div><h2 class="text-sm font-bold text-white leading-tight">Meus Workspaces (Grupos)</h2><p class="text-xs text-gray-400 font-mono">Gerencie e alterne seus painéis compartilhados</p></div></div><span class="text-xs bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono font-bold px-2.5 py-1 rounded-full">${ssrInterpolate(unref(gruposDisponiveis).length)} grupo(s) </span></div><div class="space-y-2 max-h-44 overflow-y-auto custom-scrollbar pr-1"><!--[-->`);
			ssrRenderList(unref(gruposDisponiveis), (g) => {
				_push(`<div class="${ssrRenderClass([g.id === unref(grupoAtivo)?.id ? "bg-brand/10 border-brand/40 text-white" : "bg-dark-900 border-dark-700/80 text-gray-300 hover:bg-dark-750", "p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer"])}"><div class="flex items-center gap-2.5 min-w-0"><span class="text-base shrink-0">${ssrInterpolate(g.id === unref(grupoAtivo)?.id ? "✨" : "🏡")}</span><div class="min-w-0"><p class="${ssrRenderClass([g.id === unref(grupoAtivo)?.id ? "text-brand" : "text-white", "font-bold truncate"])}">${ssrInterpolate(g.nome)}</p>`);
				if (g.id === unref(grupoAtivo)?.id) _push(`<p class="text-[10px] text-gray-400 font-mono truncate"> Workspace Ativo Selecionado </p>`);
				else _push(`<!---->`);
				_push(`</div></div><div class="flex items-center gap-2 shrink-0">`);
				if (g.id === unref(grupoAtivo)?.id) _push(`<span class="text-[10px] bg-brand/20 border border-brand/40 text-brand font-bold px-2 py-0.5 rounded-full uppercase"> Ativo </span>`);
				else _push(`<button class="text-[11px] bg-dark-700 hover:bg-dark-600 text-gray-200 px-2.5 py-1 rounded-lg font-medium transition-all"> Ativar </button>`);
				_push(`</div></div>`);
			});
			_push(`<!--]--></div><form class="pt-3 border-t border-dark-700/80 space-y-2 text-xs"><label class="text-gray-300 font-semibold flex items-center justify-between"><span>➕ Criar Novo Workspace</span></label><div class="flex gap-2"><input${ssrRenderAttr("value", novoGrupoInput.value)} type="text" placeholder="Digite o nome do novo workspace (ex: Casa Silva)" class="flex-1 bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white placeholder:text-gray-500 font-medium focus:outline-none focus:border-brand"><button type="submit"${ssrIncludeBooleanAttr(salvandoGrupo.value || !novoGrupoInput.value.trim()) ? " disabled" : ""} class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-4 py-2.5 rounded-xl transition-all text-xs disabled:opacity-50 cursor-pointer shrink-0 shadow-glow-emerald">${ssrInterpolate(salvandoGrupo.value ? "Criando..." : "+ Criar")}</button></div></form>`);
			if (unref(grupoAtivo)) {
				_push(`<div class="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-dark-750">`);
				if (!editandoNomeGrupo.value) _push(`<span> Renomear ativo: <strong class="text-white">${ssrInterpolate(unref(grupoAtivo).nome)}</strong></span>`);
				else _push(`<!---->`);
				if (!editandoNomeGrupo.value) _push(`<button class="text-brand hover:underline font-semibold"> ✏️ Editar Nome </button>`);
				else _push(`<form class="w-full flex items-center gap-2"><input${ssrRenderAttr("value", nomeGrupoEditavel.value)} type="text" required class="flex-1 bg-dark-900 border border-dark-700 rounded-lg px-2.5 py-1 text-xs text-white"><button type="submit" class="bg-brand text-dark-950 font-bold px-2.5 py-1 rounded-lg text-xs"> Salvar </button><button type="button" class="text-gray-400 hover:text-white text-xs"> Cancelar </button></form>`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div><div class="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-6 backdrop-blur-sm shadow-supabase space-y-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-700 pb-4"><div><h2 class="text-base font-bold text-white tracking-tight flex items-center gap-2"><span>👥</span> Membros do Grupo Familiar </h2><p class="text-xs text-gray-400 mt-0.5"> Pessoas que possuem acesso às contas, cartões e lançamentos deste workspace. </p></div><span class="text-xs bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono font-bold px-3 py-1 rounded-full self-start sm:self-auto"> Visão Casal Ativa </span></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><!--[-->`);
			ssrRenderList(unref(membrosGrupo), (membro) => {
				_push(`<div class="bg-dark-900 border border-dark-750 rounded-xl p-4 flex items-center justify-between gap-3 shadow-inner"><div class="flex items-center gap-3 min-w-0"><div class="w-10 h-10 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center text-brand font-bold text-sm shrink-0">${ssrInterpolate((membro.perfil?.nome || membro.perfis?.nome || "P").substring(0, 2).toUpperCase())}</div><div class="min-w-0"><p class="text-xs font-bold text-white truncate">${ssrInterpolate(membro.perfil?.nome || membro.perfis?.nome || "Usuário do Casal")} `);
				if (membro.user_id === unref(user)?.id) _push(`<span class="text-[10px] text-brand font-normal">(Você)</span>`);
				else _push(`<!---->`);
				_push(`</p><p class="text-[11px] text-gray-400 font-mono truncate">${ssrInterpolate(membro.perfil?.email || membro.perfis?.email || "email@exemplo.com")}</p></div></div><span class="${ssrRenderClass([membro.papel === "admin" ? "bg-brand/15 border-brand/30 text-brand" : "bg-blue-500/15 border-blue-500/30 text-blue-300", "text-[10px] font-bold uppercase font-mono px-2.5 py-1 rounded-full shrink-0 border"])}">${ssrInterpolate(membro.papel === "admin" ? "Admin" : "Membro")}</span></div>`);
			});
			_push(`<!--]--></div><div class="bg-dark-900/60 border border-dark-700 rounded-xl p-5 space-y-4"><div><h3 class="text-sm font-bold text-white flex items-center gap-2"><span>🔗</span> Vincular Parceiro(a) ao Seu Grupo </h3><p class="text-xs text-gray-400 mt-1"> Digite o e-mail cadastrado pelo seu parceiro(a). Uma vez vinculado, ambos visualizarão as finanças em conjunto. </p></div><form class="flex flex-col sm:flex-row gap-3"><div class="flex-1"><input${ssrRenderAttr("value", emailParceiro.value)} type="email" required placeholder="exemplo: parceiro@email.com" class="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-brand font-mono"></div><button type="submit"${ssrIncludeBooleanAttr(salvandoParceiro.value || !emailParceiro.value.trim()) ? " disabled" : ""} class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-5 py-2.5 rounded-xl transition-all text-xs shadow-glow-emerald flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0">`);
			if (salvandoParceiro.value) _push(`<svg class="animate-spin h-4 w-4 text-dark-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
			else _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>`);
			_push(`<span>${ssrInterpolate(salvandoParceiro.value ? "Viculando..." : "Vincular Conta")}</span></button></form><p class="text-[11px] text-gray-400 flex items-center gap-1.5"><span>ℹ️</span><span>Seu parceiro(a) precisa ter criado uma conta no sistema com este mesmo e-mail antes do vínculo.</span></p></div></div></div>`);
		};
	}
});
//#endregion
//#region app/pages/configuracoes.vue
var _sfc_setup = configuracoes_vue_vue_type_script_setup_true_lang_default.setup;
configuracoes_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/configuracoes.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var configuracoes_default = configuracoes_vue_vue_type_script_setup_true_lang_default;

export { configuracoes_default as default };
//# sourceMappingURL=configuracoes-CBZfW6G1.mjs.map
