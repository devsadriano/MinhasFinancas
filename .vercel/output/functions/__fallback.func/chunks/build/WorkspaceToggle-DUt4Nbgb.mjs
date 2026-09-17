import { u as useWorkspace } from './useWorkspace-CnSCU5qX.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';

//#region app/components/WorkspaceToggle.vue?vue&type=script&setup=true&lang.ts
var WorkspaceToggle_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "WorkspaceToggle",
	__ssrInlineRender: true,
	emits: ["change"],
	setup(__props, { emit: __emit }) {
		const { grupoAtivo, gruposDisponiveis, modoVisao} = useWorkspace();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-3" }, _attrs))}>`);
			if (unref(gruposDisponiveis).length > 1) {
				_push(`<div class="relative"><select${ssrRenderAttr("value", unref(grupoAtivo)?.id)} class="bg-dark-800 border border-dark-700 hover:border-brand/40 text-xs font-bold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-brand transition-colors cursor-pointer pr-8 appearance-none"><!--[-->`);
				ssrRenderList(unref(gruposDisponiveis), (g) => {
					_push(`<option${ssrRenderAttr("value", g.id)}> 🏠 ${ssrInterpolate(g.nome)}</option>`);
				});
				_push(`<!--]--></select><div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></div></div>`);
			} else _push(`<!---->`);
			_push(`<div class="relative bg-dark-900 border border-dark-700/80 p-1 rounded-xl flex items-center shadow-inner"><div class="${ssrRenderClass([unref(modoVisao) === "casal" ? "left-1" : "left-[calc(50%+2px)] bg-gradient-to-r from-purple-600 to-purple-400 shadow-purple-500/20", "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-brand to-emerald-400 rounded-lg shadow-glow-emerald transition-all duration-300 ease-out"])}"></div><button type="button" class="${ssrRenderClass([unref(modoVisao) === "casal" ? "text-dark-950 font-black" : "text-gray-400 hover:text-white", "relative z-10 flex-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"])}"><span>👩‍❤️‍👨</span><span>Visão Casal</span></button><button type="button" class="${ssrRenderClass([unref(modoVisao) === "pessoal" ? "text-white font-black" : "text-gray-400 hover:text-white", "relative z-10 flex-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"])}"><span>👤</span><span>Minha Visão</span></button></div></div>`);
		};
	}
});
//#endregion
//#region app/components/WorkspaceToggle.vue
var _sfc_setup = WorkspaceToggle_vue_vue_type_script_setup_true_lang_default.setup;
WorkspaceToggle_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/WorkspaceToggle.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var WorkspaceToggle_default = Object.assign(WorkspaceToggle_vue_vue_type_script_setup_true_lang_default, { __name: "WorkspaceToggle" });

export { WorkspaceToggle_default as W };
//# sourceMappingURL=WorkspaceToggle-DUt4Nbgb.mjs.map
