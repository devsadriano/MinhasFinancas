import { u as useFinancas } from './useFinancas-C7KH4i6q.mjs';
import { _ as _sfc_main$1 } from './Header-DO9G6iKM.mjs';
import { ref, reactive, computed, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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

//#region app/pages/categorias.vue
var _sfc_main = {
	__name: "categorias",
	__ssrInlineRender: true,
	setup(__props) {
		const { categorias, transacoes, carregando} = useFinancas();
		const modalAberto = ref(false);
		const modalExcluir = ref(false);
		const modoEditar = ref(false);
		const catParaExcluir = ref(null);
		ref(null);
		const filtroTipo = ref("todos");
		const emojisSugeridos = [
			"🍔",
			"🏠",
			"💰",
			"🚗",
			"📈",
			"✈️",
			"🏥",
			"📦",
			"💡",
			"🛒",
			"👕",
			"📚",
			"🎮",
			"💼",
			"💻",
			"🐾",
			"🎵",
			"💎",
			"🔧",
			"📱",
			"⚽",
			"🎂",
			"🍷",
			"☕"
		];
		const coresSugeridas = [
			"#3ecf8e",
			"#ef4444",
			"#f59e0b",
			"#3b82f6",
			"#8b5cf6",
			"#ec4899",
			"#06b6d4",
			"#10b981",
			"#84cc16",
			"#f97316",
			"#94a3b8",
			"#820ad1"
		];
		const form = reactive({
			nome: "",
			tipo: "despesa",
			icone: "🏷️",
			cor: "#3b82f6",
			essencial: true
		});
		const categoriasFiltradas = computed(() => {
			if (filtroTipo.value === "todos") return categorias.value;
			if (filtroTipo.value === "essenciais") return categorias.value.filter((c) => c.tipo === "despesa" && c.essencial);
			return categorias.value.filter((c) => c.tipo === filtroTipo.value);
		});
		const getLancamentosCount = (cat) => {
			return transacoes.value.filter((t) => t.categoria_id === cat.id || t.categoria === cat.nome).length;
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Header = _sfc_main$1;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			_push(ssrRenderComponent(_component_Header, {
				title: "Categorias Financeiras",
				subtitle: "Organize suas despesas e receitas por grupos customizados",
				showAction: false
			}, null, _parent));
			_push(`<main class="p-4 md:p-8 max-w-7xl mx-auto space-y-5 md:space-y-6"><div class="flex items-center justify-between flex-wrap gap-3"><div class="flex items-center gap-4"><h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-brand"></span> Categorias (${ssrInterpolate(unref(categorias).length)}) </h3><div class="flex items-center gap-1 bg-dark-800 border border-dark-700 rounded-lg p-1"><button class="${ssrRenderClass([filtroTipo.value === "todos" ? "bg-brand text-dark-950" : "text-gray-400 hover:text-white", "px-3 py-1 rounded text-xs font-semibold transition-all"])}">Todos</button><button class="${ssrRenderClass([filtroTipo.value === "receita" ? "bg-income text-dark-950" : "text-gray-400 hover:text-white", "px-3 py-1 rounded text-xs font-semibold transition-all"])}">Receitas</button><button class="${ssrRenderClass([filtroTipo.value === "despesa" ? "bg-expense text-white" : "text-gray-400 hover:text-white", "px-3 py-1 rounded text-xs font-semibold transition-all"])}">Despesas</button><button class="${ssrRenderClass([filtroTipo.value === "essenciais" ? "bg-amber-400 text-dark-950 font-bold" : "text-gray-400 hover:text-white", "px-3 py-1 rounded text-xs font-semibold transition-all"])}">⚡ Essenciais</button></div></div><button class="bg-brand hover:bg-brand-400 text-dark-950 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-glow-emerald flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg><span>Nova Categoria</span></button></div>`);
			if (unref(carregando)) _push(`<div class="py-12 text-center text-brand"><svg class="animate-spin h-8 w-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`);
			else {
				_push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
				ssrRenderList(categoriasFiltradas.value, (cat) => {
					_push(`<div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-5 shadow-supabase hover:border-dark-600 transition-all group"><div class="flex items-center justify-between"><div class="flex items-center gap-4"><div class="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xl border transition-all group-hover:scale-110" style="${ssrRenderStyle({
						backgroundColor: cat.cor + "20",
						borderColor: cat.cor + "40",
						color: cat.cor
					})}">${ssrInterpolate(cat.icone)}</div><div><h3 class="text-sm font-bold text-white">${ssrInterpolate(cat.nome)}</h3><div class="flex items-center gap-2 mt-0.5"><span class="${ssrRenderClass([cat.tipo === "receita" ? "bg-income/10 text-income border-income/30" : "bg-expense/10 text-expense border-expense/30", "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"])}">${ssrInterpolate(cat.tipo)}</span>`);
					if (cat.tipo === "despesa") _push(`<span class="${ssrRenderClass([cat.essencial ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-purple-500/10 text-purple-400 border-purple-500/30", "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"])}">${ssrInterpolate(cat.essencial ? "⚡ Essencial" : "🎈 Supérfluo")}</span>`);
					else _push(`<!---->`);
					_push(`<span class="text-[11px] text-gray-500 font-mono">${ssrInterpolate(getLancamentosCount(cat))} lançamentos</span></div></div></div><div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button class="p-1.5 rounded-lg text-gray-500 hover:text-brand hover:bg-brand/10 transition-colors" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button${ssrIncludeBooleanAttr(!cat.id || !cat.user_id) ? " disabled" : ""} class="p-1.5 rounded-lg text-gray-500 hover:text-expense hover:bg-expense/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"${ssrRenderAttr("title", !cat.user_id ? "Categoria padrão do sistema" : "Excluir")}><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></div></div>`);
				});
				_push(`<!--]-->`);
				if (categoriasFiltradas.value.length === 0) _push(`<div class="col-span-full py-16 text-center"><p class="text-white font-bold mb-1">Nenhuma categoria encontrada</p><button class="text-brand text-sm hover:underline mt-2">+ Nova Categoria</button></div>`);
				else _push(`<!---->`);
				_push(`</div>`);
			}
			_push(`</main>`);
			if (modalAberto.value) {
				_push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"><div class="flex items-center justify-between border-b border-dark-700 pb-3"><h3 class="text-base font-bold text-white">${ssrInterpolate(modoEditar.value ? "Editar Categoria" : "Nova Categoria")}</h3><button class="text-gray-400 hover:text-white">✕</button></div><form class="space-y-4"><div class="flex items-center gap-3 p-3 bg-dark-900 border border-dark-700 rounded-xl"><div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl border" style="${ssrRenderStyle({
					backgroundColor: form.cor + "20",
					borderColor: form.cor + "40",
					color: form.cor
				})}">${ssrInterpolate(form.icone || "🏷️")}</div><div><p class="text-sm font-bold text-white">${ssrInterpolate(form.nome || "Nome da Categoria")}</p><span class="${ssrRenderClass([form.tipo === "receita" ? "bg-income/10 text-income border-income/30" : "bg-expense/10 text-expense border-expense/30", "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border"])}">${ssrInterpolate(form.tipo)}</span></div></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Nome da Categoria</label><input${ssrRenderAttr("value", form.nome)} type="text" placeholder="Ex: Assinaturas, Pets, Educação" required class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Tipo</label><select class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"><option value="despesa"${ssrIncludeBooleanAttr(Array.isArray(form.tipo) ? ssrLooseContain(form.tipo, "despesa") : ssrLooseEqual(form.tipo, "despesa")) ? " selected" : ""}>Despesa (-)</option><option value="receita"${ssrIncludeBooleanAttr(Array.isArray(form.tipo) ? ssrLooseContain(form.tipo, "receita") : ssrLooseEqual(form.tipo, "receita")) ? " selected" : ""}>Receita (+)</option></select></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Emoji / Ícone</label><input${ssrRenderAttr("value", form.icone)} type="text" maxLength="2" required placeholder="📦" class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand text-center text-xl"></div></div>`);
				if (form.tipo === "despesa") _push(`<div class="p-3 bg-dark-900/80 border border-amber-500/20 rounded-xl space-y-1"><label class="flex items-center gap-2.5 cursor-pointer"><input${ssrIncludeBooleanAttr(Array.isArray(form.essencial) ? ssrLooseContain(form.essencial, null) : form.essencial) ? " checked" : ""} type="checkbox" class="w-4 h-4 rounded border-dark-600 bg-dark-950 text-brand focus:ring-brand accent-amber-400"><span class="text-xs font-bold text-white flex items-center gap-1.5"> ⚡ Despesa Essencial (Custo Fixo/Básico) </span></label><p class="text-[11px] text-gray-400 pl-6 leading-tight"> Moradia, alimentação, água, luz, saúde e transporte. Usado para calcular sua Reserva de Emergência (6x custo básico). </p></div>`);
				else _push(`<!---->`);
				_push(`<div><label class="block text-xs font-semibold text-gray-400 mb-2">Ícones Rápidos</label><div class="flex flex-wrap gap-1.5"><!--[-->`);
				ssrRenderList(emojisSugeridos, (emoji) => {
					_push(`<button type="button" class="${ssrRenderClass([form.icone === emoji ? "border-brand bg-brand/10" : "border-transparent", "w-8 h-8 rounded-lg text-lg transition-all hover:bg-dark-700 border"])}">${ssrInterpolate(emoji)}</button>`);
				});
				_push(`<!--]--></div></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-2">Cor</label><div class="flex items-center gap-3"><input${ssrRenderAttr("value", form.cor)} type="color" class="w-12 h-10 bg-dark-900 border border-dark-700 rounded-lg p-1 cursor-pointer"><div class="flex gap-2 flex-wrap"><!--[-->`);
				ssrRenderList(coresSugeridas, (cor) => {
					_push(`<button type="button" style="${ssrRenderStyle({ backgroundColor: cor })}" class="${ssrRenderClass([form.cor === cor ? "border-white scale-110" : "border-transparent", "w-6 h-6 rounded-full border-2 transition-all"])}"></button>`);
				});
				_push(`<!--]--></div></div></div><div class="flex items-center justify-end gap-2 pt-2"><button type="button" class="px-4 py-2 text-xs text-gray-400">Cancelar</button><button type="submit" class="bg-brand text-dark-950 font-bold px-5 py-2 rounded-lg text-xs">${ssrInterpolate(modoEditar.value ? "Salvar" : "Criar Categoria")}</button></div></form></div></div>`);
			} else _push(`<!---->`);
			if (modalExcluir.value) _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div class="bg-dark-800 border border-expense/30 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4"><h3 class="text-base font-bold text-white">Excluir Categoria</h3><p class="text-sm text-gray-300"> Deseja excluir <strong class="text-white">${ssrInterpolate(catParaExcluir.value?.nome)}</strong>? Os lançamentos com esta categoria ficarão sem categoria definida. </p><div class="flex items-center justify-end gap-2"><button class="px-4 py-2 text-xs text-gray-400">Cancelar</button><button class="bg-expense text-white font-bold px-5 py-2 rounded-lg text-xs"> Excluir </button></div></div></div>`);
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/categorias.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=categorias-CQJOhRrJ.mjs.map
