import { u as useHead$1, a as useSupabaseUser } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-VW3GFU14.mjs';
import { u as useWorkspace } from './useWorkspace-CnSCU5qX.mjs';
import { u as useFinancas } from './useFinancas-C7KH4i6q.mjs';
import { W as WorkspaceToggle_default } from './WorkspaceToggle-DUt4Nbgb.mjs';
import { defineComponent, mergeProps, ref, computed, unref, useSSRContext } from 'vue';
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

//#region app/components/MetasCompartilhadas.vue?vue&type=script&setup=true&lang.ts
var MetasCompartilhadas_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "MetasCompartilhadas",
	__ssrInlineRender: true,
	setup(__props) {
		const { bancos} = useFinancas();
		const { membrosGrupo } = useWorkspace();
		useSupabaseClient();
		const user = useSupabaseUser();
		const metas = ref([]);
		const aportesGlobal = ref([]);
		const salvando = ref(false);
		const modalAporteAberto = ref(false);
		const modalNovaMetaAberto = ref(false);
		const metaSelecionada = ref(null);
		const formAporte = ref({
			valor: 100,
			contaId: "",
			data: (/* @__PURE__ */ new Date()).toISOString().substring(0, 10)
		});
		const formNovaMeta = ref({
			titulo: "",
			valor_alvo: 5e3,
			icone: "🌴",
			cor: "#3ecf8e",
			prazo_data: ""
		});
		const nomeParceiro = computed(() => {
			if (!membrosGrupo.value || membrosGrupo.value.length < 2) return "Parceiro(a)";
			return membrosGrupo.value.find((m) => m.user_id !== user.value?.id)?.perfil?.nome || "Parceiro(a)";
		});
		const metasComEstatisticas = computed(() => {
			return metas.value.map((meta) => {
				const aportesDaMeta = aportesGlobal.value.filter((a) => a.meta_id === meta.id);
				const totalAcumulado = aportesDaMeta.reduce((acc, a) => acc + Number(a.valor), 0);
				const porcentagem = meta.valor_alvo > 0 ? totalAcumulado / Number(meta.valor_alvo) * 100 : 0;
				const currentUserId = user.value?.id || "user-demo-1";
				const aporteVoce = aportesDaMeta.filter((a) => a.user_id === currentUserId).reduce((acc, a) => acc + Number(a.valor), 0);
				const aporteParceiro = aportesDaMeta.filter((a) => a.user_id !== currentUserId).reduce((acc, a) => acc + Number(a.valor), 0);
				return {
					...meta,
					totalAcumulado,
					porcentagem,
					aporteVoce,
					aporteParceiro
				};
			});
		});
		const totalGeralGuardado = computed(() => {
			return metasComEstatisticas.value.reduce((acc, m) => acc + m.totalAcumulado, 0);
		});
		const formatarData = (str) => {
			if (!str) return "";
			const parts = str.split("-");
			return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str;
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="bg-dark-800/80 border border-dark-700/80 rounded-2xl p-5 md:p-6 backdrop-blur-sm shadow-supabase flex flex-col md:flex-row md:items-center justify-between gap-4"><div><div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-brand animate-pulse"></span><h2 class="text-lg font-bold text-white tracking-tight">Metas Compartilhadas (Caixinhas)</h2></div><p class="text-xs text-gray-400 mt-1"> Guarde dinheiro junto com seu parceiro(a) e acompanhe quem mais contribuiu para cada objetivo. </p></div><div class="flex items-center gap-3"><div class="text-right hidden sm:block"><p class="text-[11px] text-gray-400 font-medium">Total Guardado em Caixinhas</p><p class="text-base font-extrabold text-brand font-mono"> R\$ ${ssrInterpolate(totalGeralGuardado.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 }))}</p></div><button class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-glow-emerald flex items-center gap-2 cursor-pointer shrink-0"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg><span>Nova Meta</span></button></div></div>`);
			if (metas.value.length > 0) {
				_push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
				ssrRenderList(metasComEstatisticas.value, (meta) => {
					_push(`<div class="bg-dark-800/90 border border-dark-700/80 hover:border-brand/40 rounded-2xl p-5 backdrop-blur-md shadow-supabase flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] group relative overflow-hidden"><div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80" style="${ssrRenderStyle({ backgroundImage: `linear-gradient(to right, ${meta.cor}, #3ecf8e)` })}"></div><div><div class="flex items-start justify-between gap-3 mb-4"><div class="flex items-center gap-3"><div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-inner transition-transform group-hover:scale-105" style="${ssrRenderStyle({
						backgroundColor: `${meta.cor}18`,
						borderColor: `${meta.cor}40`
					})}">${ssrInterpolate(meta.icone || "🎯")}</div><div><h3 class="text-sm font-bold text-white group-hover:text-brand transition-colors leading-snug">${ssrInterpolate(meta.titulo)}</h3>`);
					if (meta.prazo_data) _push(`<p class="text-[11px] text-gray-400 font-mono mt-0.5"> Prazo: ${ssrInterpolate(formatarData(meta.prazo_data))}</p>`);
					else _push(`<!---->`);
					_push(`</div></div><span class="${ssrRenderClass([meta.porcentagem >= 100 ? "text-income border-income/30 bg-income/10" : "text-purple-300 border-purple-500/30", "text-[11px] font-bold font-mono px-2.5 py-1 rounded-full border border-dark-600 bg-dark-900/60"])}">${ssrInterpolate(meta.porcentagem.toFixed(1))}% </span></div><div class="space-y-1.5 mb-4"><div class="w-full h-3 bg-dark-900 rounded-full overflow-hidden p-0.5 border border-dark-700"><div class="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-brand via-emerald-400 to-emerald-300 shadow-glow-emerald" style="${ssrRenderStyle({ width: `${Math.min(100, meta.porcentagem)}%` })}"></div></div><div class="flex items-center justify-between text-xs font-mono"><span class="text-gray-300 font-bold"> R\$ ${ssrInterpolate(meta.totalAcumulado.toLocaleString("pt-BR", { minimumFractionDigits: 2 }))}</span><span class="text-gray-500"> de R\$ ${ssrInterpolate(Number(meta.valor_alvo).toLocaleString("pt-BR", { minimumFractionDigits: 2 }))}</span></div></div><div class="bg-dark-900/70 border border-dark-750 rounded-xl p-3 space-y-2 mb-4"><p class="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center gap-1.5"><span>👥</span> Divisão de Aportes </p><div class="grid grid-cols-2 gap-2 text-xs"><div class="bg-dark-800/80 p-2 rounded-lg border border-dark-700/60"><span class="text-[10px] text-gray-400 block truncate">Você</span><span class="text-xs font-extrabold font-mono text-emerald-400"> R\$ ${ssrInterpolate(meta.aporteVoce.toLocaleString("pt-BR", { minimumFractionDigits: 2 }))}</span></div><div class="bg-dark-800/80 p-2 rounded-lg border border-dark-700/60"><span class="text-[10px] text-gray-400 block truncate">${ssrInterpolate(nomeParceiro.value)}</span><span class="text-xs font-extrabold font-mono text-purple-300"> R\$ ${ssrInterpolate(meta.aporteParceiro.toLocaleString("pt-BR", { minimumFractionDigits: 2 }))}</span></div></div></div></div><button class="w-full bg-dark-750 hover:bg-brand hover:text-dark-950 text-gray-200 border border-dark-600 hover:border-brand font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg><span>Aportar Dinheiro</span></button></div>`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<div class="bg-dark-800/50 border border-dashed border-dark-700 rounded-2xl p-12 text-center space-y-4"><div class="w-16 h-16 rounded-2xl bg-brand/10 text-brand border border-brand/20 flex items-center justify-center mx-auto text-3xl"> 🎯 </div><div><h3 class="text-base font-bold text-white">Nenhuma meta criada ainda</h3><p class="text-xs text-gray-400 mt-1 max-w-sm mx-auto"> Crie caixinhas para viagens, reforma da casa, reservas de emergência ou compra de bens. </p></div><button class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-glow-emerald"> + Criar Primeira Meta </button></div>`);
			if (modalAporteAberto.value) {
				_push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"><div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5"><div class="flex items-center justify-between border-b border-dark-700 pb-3"><div class="flex items-center gap-2"><span class="text-2xl">${ssrInterpolate(metaSelecionada.value?.icone || "🎯")}</span><h3 class="text-base font-bold text-white">Aportar em ${ssrInterpolate(metaSelecionada.value?.titulo)}</h3></div><button class="text-gray-400 hover:text-white text-lg font-bold">✕</button></div><form class="space-y-4 text-xs"><div><label class="block text-gray-300 font-semibold mb-1">Valor do Aporte (R\$)</label><input${ssrRenderAttr("value", formAporte.value.valor)} type="number" step="0.01" min="0.01" required placeholder="Ex: 250.00" class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-brand"></div><div><label class="block text-gray-300 font-semibold mb-1">Debitar da Conta</label><select class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:border-brand"><!--[-->`);
				ssrRenderList(unref(bancos), (banco) => {
					_push(`<option${ssrRenderAttr("value", banco.id || banco.nome)}${ssrIncludeBooleanAttr(Array.isArray(formAporte.value.contaId) ? ssrLooseContain(formAporte.value.contaId, banco.id || banco.nome) : ssrLooseEqual(formAporte.value.contaId, banco.id || banco.nome)) ? " selected" : ""}>${ssrInterpolate(banco.nome)} (Saldo: R\$ ${ssrInterpolate(Number(banco.saldo).toFixed(2))}) </option>`);
				});
				_push(`<!--]--></select></div><div><label class="block text-gray-300 font-semibold mb-1">Data do Aporte</label><input${ssrRenderAttr("value", formAporte.value.data)} type="date" required class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand"></div><div class="pt-2 flex items-center justify-end gap-3 border-t border-dark-700"><button type="button" class="px-4 py-2 rounded-xl text-gray-400 hover:text-white font-medium"> Cancelar </button><button type="submit"${ssrIncludeBooleanAttr(salvando.value) ? " disabled" : ""} class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-5 py-2 rounded-xl transition-all shadow-glow-emerald disabled:opacity-50">${ssrInterpolate(salvando.value ? "Aportando..." : "Confirmar Aporte")}</button></div></form></div></div>`);
			} else _push(`<!---->`);
			if (modalNovaMetaAberto.value) _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"><div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5"><div class="flex items-center justify-between border-b border-dark-700 pb-3"><h3 class="text-base font-bold text-white flex items-center gap-2"><span>🎯</span> Criar Nova Meta de Casal </h3><button class="text-gray-400 hover:text-white text-lg font-bold">✕</button></div><form class="space-y-4 text-xs"><div><label class="block text-gray-300 font-semibold mb-1">Título da Meta</label><input${ssrRenderAttr("value", formNovaMeta.value.titulo)} type="text" required placeholder="Ex: Viagem de Férias, Reforma da Cozinha" class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand font-medium"></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-gray-300 font-semibold mb-1">Valor Alvo (R\$)</label><input${ssrRenderAttr("value", formNovaMeta.value.valor_alvo)} type="number" step="0.01" min="1" required placeholder="Ex: 5000" class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand"></div><div><label class="block text-gray-300 font-semibold mb-1">Ícone Emoji</label><select class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand text-sm"><option value="🌴"${ssrIncludeBooleanAttr(Array.isArray(formNovaMeta.value.icone) ? ssrLooseContain(formNovaMeta.value.icone, "🌴") : ssrLooseEqual(formNovaMeta.value.icone, "🌴")) ? " selected" : ""}>🌴 Viagem</option><option value="🚗"${ssrIncludeBooleanAttr(Array.isArray(formNovaMeta.value.icone) ? ssrLooseContain(formNovaMeta.value.icone, "🚗") : ssrLooseEqual(formNovaMeta.value.icone, "🚗")) ? " selected" : ""}>🚗 Veículo</option><option value="🏠"${ssrIncludeBooleanAttr(Array.isArray(formNovaMeta.value.icone) ? ssrLooseContain(formNovaMeta.value.icone, "🏠") : ssrLooseEqual(formNovaMeta.value.icone, "🏠")) ? " selected" : ""}>🏠 Casa / Imóvel</option><option value="💍"${ssrIncludeBooleanAttr(Array.isArray(formNovaMeta.value.icone) ? ssrLooseContain(formNovaMeta.value.icone, "💍") : ssrLooseEqual(formNovaMeta.value.icone, "💍")) ? " selected" : ""}>💍 Casamento</option><option value="🛡️"${ssrIncludeBooleanAttr(Array.isArray(formNovaMeta.value.icone) ? ssrLooseContain(formNovaMeta.value.icone, "🛡️") : ssrLooseEqual(formNovaMeta.value.icone, "🛡️")) ? " selected" : ""}>🛡️ Reserva Emergência</option><option value="🎓"${ssrIncludeBooleanAttr(Array.isArray(formNovaMeta.value.icone) ? ssrLooseContain(formNovaMeta.value.icone, "🎓") : ssrLooseEqual(formNovaMeta.value.icone, "🎓")) ? " selected" : ""}>🎓 Estudos</option><option value="💻"${ssrIncludeBooleanAttr(Array.isArray(formNovaMeta.value.icone) ? ssrLooseContain(formNovaMeta.value.icone, "💻") : ssrLooseEqual(formNovaMeta.value.icone, "💻")) ? " selected" : ""}>💻 Eletrônicos</option><option value="🎯"${ssrIncludeBooleanAttr(Array.isArray(formNovaMeta.value.icone) ? ssrLooseContain(formNovaMeta.value.icone, "🎯") : ssrLooseEqual(formNovaMeta.value.icone, "🎯")) ? " selected" : ""}>🎯 Outros</option></select></div></div><div><label class="block text-gray-300 font-semibold mb-1">Prazo Desejado (Opcional)</label><input${ssrRenderAttr("value", formNovaMeta.value.prazo_data)} type="date" class="w-full bg-dark-900 border border-dark-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-brand"></div><div class="pt-2 flex items-center justify-end gap-3 border-t border-dark-700"><button type="button" class="px-4 py-2 rounded-xl text-gray-400 hover:text-white font-medium"> Cancelar </button><button type="submit"${ssrIncludeBooleanAttr(salvando.value) ? " disabled" : ""} class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-5 py-2 rounded-xl transition-all shadow-glow-emerald disabled:opacity-50">${ssrInterpolate(salvando.value ? "Criando..." : "Criar Meta")}</button></div></form></div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/components/MetasCompartilhadas.vue
var _sfc_setup$1 = MetasCompartilhadas_vue_vue_type_script_setup_true_lang_default.setup;
MetasCompartilhadas_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MetasCompartilhadas.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var MetasCompartilhadas_default = Object.assign(MetasCompartilhadas_vue_vue_type_script_setup_true_lang_default, { __name: "MetasCompartilhadas" });
//#endregion
//#region app/pages/metas.vue?vue&type=script&setup=true&lang.ts
var metas_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "metas",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Metas Compartilhadas - MinhasFinancas" });
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8 pb-12" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5"><span>🎯</span> Caixinhas &amp; Metas Compartilhadas </h1><p class="text-xs text-gray-400 mt-1"> Planeje e economize dinheiro junto com seu parceiro(a) para a realização de grandes sonhos. </p></div>`);
			_push(ssrRenderComponent(WorkspaceToggle_default, null, null, _parent));
			_push(`</div>`);
			_push(ssrRenderComponent(MetasCompartilhadas_default, null, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/metas.vue
var _sfc_setup = metas_vue_vue_type_script_setup_true_lang_default.setup;
metas_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/metas.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var metas_default = metas_vue_vue_type_script_setup_true_lang_default;

export { metas_default as default };
//# sourceMappingURL=metas-BLe6-4tz.mjs.map
