import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';

//#region app/components/Header.vue
var _sfc_main = {
	__name: "Header",
	__ssrInlineRender: true,
	props: {
		title: {
			type: String,
			default: "Dashboard"
		},
		subtitle: {
			type: String,
			default: "Acompanhe seu fluxo financeiro pessoal"
		},
		showAction: {
			type: Boolean,
			default: true
		}
	},
	emits: ["abrirModal", "abrirModalImportacao"],
	setup(__props) {
		const mesSelecionado = ref("atual");
		const meses = [
			{
				nome: "Ant.",
				valor: "anterior"
			},
			{
				nome: "Atual",
				valor: "atual"
			},
			{
				nome: "Todos",
				valor: "todos"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({ class: "bg-dark-850/80 backdrop-blur-md border-b border-dark-700/60 px-4 md:px-8 py-3 md:py-0 md:h-16 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 sticky top-14 lg:top-0 z-30" }, _attrs))}><div class="hidden md:block"><h2 class="text-lg font-bold text-white tracking-tight">${ssrInterpolate(__props.title)}</h2>`);
			if (__props.subtitle) _push(`<p class="text-xs text-gray-400">${ssrInterpolate(__props.subtitle)}</p>`);
			else _push(`<!---->`);
			_push(`</div><div class="flex items-center justify-between md:justify-end gap-2 md:gap-3 w-full md:w-auto"><div class="flex items-center bg-dark-800 border border-dark-700 rounded-lg p-1 text-xs"><!--[-->`);
			ssrRenderList(meses, (m) => {
				_push(`<button class="${ssrRenderClass([mesSelecionado.value === m.valor ? "bg-brand/15 text-brand border border-brand/30" : "text-gray-400 hover:text-white", "px-2 md:px-3 py-1 rounded-md transition-all font-medium whitespace-nowrap"])}">${ssrInterpolate(m.nome)}</button>`);
			});
			_push(`<!--]--></div>`);
			if (__props.showAction) _push(`<button class="bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-700 font-semibold px-3 md:px-3.5 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-all duration-200 hover:text-white whitespace-nowrap" title="Importar extrato bancário OFX ou CSV"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><span class="hidden sm:inline">Importar Extrato</span><span class="sm:hidden">Importar</span></button>`);
			else _push(`<!---->`);
			if (__props.showAction) _push(`<button class="bg-brand hover:bg-brand-400 text-dark-950 font-semibold px-3 md:px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-all duration-200 shadow-glow-emerald hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg><span class="hidden sm:inline">Novo Lançamento</span><span class="sm:hidden">Novo</span></button>`);
			else _push(`<!---->`);
			_push(`</div></header>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Header-DO9G6iKM.mjs.map
