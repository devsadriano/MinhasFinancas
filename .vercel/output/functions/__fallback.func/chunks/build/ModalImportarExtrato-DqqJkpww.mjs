import { u as useFinancas } from './useFinancas-C7KH4i6q.mjs';
import { ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';

//#region app/components/ModalImportarExtrato.vue
var _sfc_main = {
	__name: "ModalImportarExtrato",
	__ssrInlineRender: true,
	props: {
		aberto: {
			type: Boolean,
			default: false
		},
		cartaoPreSelecionadoId: {
			type: String,
			default: ""
		}
	},
	emits: ["fechar", "importar"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const { bancos, cartoes, categorias, carregarTudo} = useFinancas();
		ref(null);
		const dragOver = ref(false);
		const salvando = ref(false);
		const erroLeitura = ref("");
		const transacoes = ref([]);
		const contaAlvo = ref("");
		const modoDestino = ref("conta");
		const cartaoAlvoId = ref("");
		const instituicaoDetectada = ref(null);
		watch(() => props.aberto, async (novo) => {
			if (novo) {
				erroLeitura.value = "";
				salvando.value = false;
				transacoes.value = [];
				instituicaoDetectada.value = null;
				modoDestino.value = props.cartaoPreSelecionadoId ? "cartao" : "conta";
				await carregarTudo();
				if (bancos.value.length > 0) contaAlvo.value = bancos.value[0].nome;
				if (props.cartaoPreSelecionadoId) cartaoAlvoId.value = props.cartaoPreSelecionadoId;
				else if (cartoes.value.length > 0) cartaoAlvoId.value = cartoes.value[0].id || cartoes.value[0].nome || "";
			}
		});
		const qtdSelecionados = computed(() => {
			return transacoes.value.filter((t) => t.selecionado).length;
		});
		const todosSelecionados = computed(() => {
			return transacoes.value.length > 0 && transacoes.value.every((t) => t.selecionado);
		});
		const totalEntradas = computed(() => {
			return transacoes.value.filter((t) => t.selecionado && t.tipo === "receita").reduce((acc, t) => acc + t.valor, 0);
		});
		const totalSaidas = computed(() => {
			return transacoes.value.filter((t) => t.selecionado && t.tipo === "despesa").reduce((acc, t) => acc + t.valor, 0);
		});
		watch(modoDestino, (novo) => {
			if (novo === "cartao" && (!cartaoAlvoId.value || cartaoAlvoId.value === "") && cartoes.value.length > 0) cartaoAlvoId.value = cartoes.value[0].id || "";
		});
		const formatData = (str) => {
			if (!str) return "";
			const parts = str.split("-");
			if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
			return str;
		};
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.aberto) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in" }, _attrs))}><div class="bg-dark-800 border border-dark-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]"><div class="flex items-center justify-between px-6 py-4 border-b border-dark-700/80 bg-dark-850"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg></div><div><h3 class="text-base font-bold text-white leading-tight">Importar Extrato Bancário</h3><p class="text-xs text-gray-400">Leitura automática de OFX e CSV com inteligência de parcelas</p></div></div><button class="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-dark-700 focus:outline-none"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
				if (transacoes.value.length === 0) {
					_push(`<div class="p-8 flex flex-col items-center justify-center text-center space-y-4 my-auto"><label for="file-input-statement" class="${ssrRenderClass([dragOver.value ? "border-brand bg-brand/10 scale-[1.01]" : "border-dark-600 hover:border-brand/50 bg-dark-900/50 hover:bg-dark-900", "w-full max-w-xl border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"])}"><input id="file-input-statement" type="file" accept=".pdf,.ofx,.csv,.txt,.md,.markdown" class="hidden"><div class="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div><div><p class="text-sm font-bold text-white">Clique aqui para selecionar seu arquivo .PDF, .OFX, .CSV, .TXT ou .MD</p><p class="text-xs text-gray-400 mt-1">Suporta faturas PDF e extratos do Nubank, Itaú, Inter, Bradesco, C6, Santander, PicPay, Mercado Pago, etc.</p></div><span class="bg-brand/15 border border-brand/30 text-brand text-xs font-semibold px-4 py-2 rounded-lg transition-colors group-hover:bg-brand/25 pointer-events-none"> Escolher Arquivo do Computador </span></label>`);
					if (erroLeitura.value) _push(`<div class="p-3.5 rounded-xl bg-expense/15 border border-expense/30 text-expense text-xs font-semibold max-w-md shadow-lg"> ⚠️ ${ssrInterpolate(erroLeitura.value)}</div>`);
					else _push(`<!---->`);
					_push(`<div class="flex items-center gap-6 text-xs text-gray-400 font-mono pt-2"><span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-400"></span>Fatura PDF</span><span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-brand"></span>OFX Bancário</span><span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-blue-400"></span>CSV / Excel</span><span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-purple-400"></span>Texto / Markdown</span></div></div>`);
				} else {
					_push(`<div class="flex-1 flex flex-col min-h-0">`);
					if (erroLeitura.value) _push(`<div class="mx-4 mt-3 p-3.5 rounded-xl bg-expense/15 border border-expense/30 text-expense text-xs font-semibold flex items-center justify-between shadow-lg"><span>⚠️ ${ssrInterpolate(erroLeitura.value)}</span><button class="text-expense font-bold">✕</button></div>`);
					else _push(`<!---->`);
					if (instituicaoDetectada.value) _push(`<div class="px-5 py-2.5 bg-gradient-to-r from-purple-900/40 via-purple-800/20 to-dark-850 border-b border-purple-500/30 flex items-center justify-between text-xs"><div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full animate-pulse shadow-glow-emerald" style="${ssrRenderStyle({ backgroundColor: instituicaoDetectada.value.cor })}"></span><span class="text-white font-bold"> 🪄 Instituição Identificada: <span class="text-purple-300 font-extrabold">${ssrInterpolate(instituicaoDetectada.value.nome)}</span></span><span class="text-gray-400 hidden sm:inline">· Cartão/Conta vinculado e criado automaticamente se necessário</span></div><span class="text-[10px] bg-purple-500/20 border border-purple-500/40 text-purple-300 px-2.5 py-0.5 rounded-full font-mono font-bold"> Auto-Detectado </span></div>`);
					else _push(`<!---->`);
					_push(`<div class="p-4 bg-dark-850 border-b border-dark-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"><div class="flex flex-wrap items-center gap-3"><div class="flex items-center gap-1 bg-dark-900 border border-dark-700 rounded-lg p-0.5"><button class="${ssrRenderClass([modoDestino.value === "conta" ? "bg-brand text-dark-950" : "text-gray-400", "px-3 py-1.5 rounded text-xs font-semibold transition-all"])}">Conta</button><button class="${ssrRenderClass([modoDestino.value === "cartao" ? "bg-purple-500 text-white" : "text-gray-400", "px-3 py-1.5 rounded text-xs font-semibold transition-all"])}">💳 Cartão</button></div>`);
					if (modoDestino.value === "conta") {
						_push(`<div class="flex items-center gap-2"><label class="text-gray-400 font-medium">Conta:</label><select class="bg-dark-900 border border-dark-700 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand font-semibold"><!--[-->`);
						ssrRenderList(unref(bancos), (banco) => {
							_push(`<option${ssrRenderAttr("value", banco.nome)}${ssrIncludeBooleanAttr(Array.isArray(contaAlvo.value) ? ssrLooseContain(contaAlvo.value, banco.nome) : ssrLooseEqual(contaAlvo.value, banco.nome)) ? " selected" : ""}>${ssrInterpolate(banco.nome)}</option>`);
						});
						_push(`<!--]--></select></div>`);
					} else {
						_push(`<div class="flex items-center gap-2"><label class="text-purple-300 font-medium">Cartão:</label><select class="bg-dark-900 border border-purple-500/40 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-purple-400 font-semibold"><!--[-->`);
						ssrRenderList(unref(cartoes), (card) => {
							_push(`<option${ssrRenderAttr("value", card.id || card.nome)}${ssrIncludeBooleanAttr(Array.isArray(cartaoAlvoId.value) ? ssrLooseContain(cartaoAlvoId.value, card.id || card.nome) : ssrLooseEqual(cartaoAlvoId.value, card.id || card.nome)) ? " selected" : ""}>${ssrInterpolate(card.nome)}</option>`);
						});
						_push(`<!--]--></select></div>`);
					}
					_push(`<button class="text-gray-300 hover:text-white px-2.5 py-1.5 bg-dark-800 border border-dark-700 rounded-lg transition-colors font-medium">${ssrInterpolate(todosSelecionados.value ? "Desmarcar Todos" : "Selecionar Todos")}</button></div><div class="flex items-center gap-4 font-mono font-semibold"><span class="text-income flex items-center gap-1"> + R\$ ${ssrInterpolate(totalEntradas.value.toFixed(2))}</span><span class="text-expense flex items-center gap-1"> - R\$ ${ssrInterpolate(totalSaidas.value.toFixed(2))}</span><span class="text-gray-400 bg-dark-900 px-2.5 py-1 rounded border border-dark-700">${ssrInterpolate(qtdSelecionados.value)} de ${ssrInterpolate(transacoes.value.length)} itens </span></div></div><div class="flex-1 overflow-y-auto p-4 space-y-3"><div class="sm:hidden space-y-2.5"><!--[-->`);
					ssrRenderList(transacoes.value, (item) => {
						_push(`<div class="${ssrRenderClass([item.selecionado ? "bg-dark-800 border-dark-600" : "bg-dark-900/50 border-dark-800 opacity-60", "p-3 rounded-xl border transition-all flex items-start gap-3"])}"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(item.selecionado) ? ssrLooseContain(item.selecionado, null) : item.selecionado) ? " checked" : ""} class="mt-1 rounded border-dark-600 text-brand focus:ring-0 bg-dark-900 w-4 h-4 cursor-pointer"><div class="flex-1 min-w-0 space-y-1.5"><div class="flex items-center justify-between gap-2"><p class="text-xs font-bold text-white truncate">${ssrInterpolate(item.cleanName || item.descricao)}</p><span class="${ssrRenderClass([item.tipo === "receita" ? "text-income" : "text-expense", "text-xs font-bold font-mono shrink-0"])}">${ssrInterpolate(item.tipo === "receita" ? "+" : "-")} R\$ ${ssrInterpolate(item.valor.toFixed(2))}</span></div>`);
						if (item.cleanName && item.cleanName !== item.descricao) _push(`<p class="text-[10px] text-gray-500 font-mono truncate"> Original: ${ssrInterpolate(item.descricao)}</p>`);
						else _push(`<!---->`);
						_push(`<div class="flex items-center justify-between gap-2"><div class="flex items-center gap-2">`);
						if (item.parcela) _push(`<span class="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono font-bold"> Parc ${ssrInterpolate(item.parcela.atual)}/${ssrInterpolate(item.parcela.total)}</span>`);
						else _push(`<!---->`);
						_push(`<span class="text-[10px] text-gray-400 font-mono">${ssrInterpolate(formatData(item.data))}</span></div>`);
						if (item.tipo === "despesa") _push(`<label class="flex items-center gap-1.5 text-[11px] text-gray-300 cursor-pointer"><span class="text-[10px] text-purple-300 font-semibold">50/50</span><div class="relative inline-flex items-center"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(item.dividir5050) ? ssrLooseContain(item.dividir5050, null) : item.dividir5050) ? " checked" : ""} class="sr-only peer"><div class="w-6 h-3.5 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand"></div></div></label>`);
						else _push(`<!---->`);
						_push(`</div><select class="w-full bg-dark-900 border border-dark-700 rounded px-2 py-1 text-[11px] text-gray-300 focus:outline-none focus:border-brand"><!--[-->`);
						ssrRenderList(unref(categorias), (cat) => {
							_push(`<option${ssrRenderAttr("value", cat.nome)}${ssrIncludeBooleanAttr(Array.isArray(item.categoria) ? ssrLooseContain(item.categoria, cat.nome) : ssrLooseEqual(item.categoria, cat.nome)) ? " selected" : ""}>${ssrInterpolate(cat.nome)}</option>`);
						});
						_push(`<!--]--></select></div></div>`);
					});
					_push(`<!--]--></div><div class="hidden sm:block"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400 pb-2"><th class="p-2 w-10 text-center">Sel.</th><th class="p-2">Data</th><th class="p-2">Descrição Limpa / Original</th><th class="p-2">Categoria Sugerida</th><th class="p-2 text-center">Dividir 50/50</th><th class="p-2 text-right">Valor (R\$)</th></tr></thead><tbody class="divide-y divide-dark-700/60 text-xs"><!--[-->`);
					ssrRenderList(transacoes.value, (item) => {
						_push(`<tr class="${ssrRenderClass([{ "opacity-40 bg-dark-900/30": !item.selecionado }, "transition-colors hover:bg-dark-750/50"])}"><td class="p-2.5 text-center"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(item.selecionado) ? ssrLooseContain(item.selecionado, null) : item.selecionado) ? " checked" : ""} class="rounded border-dark-600 text-brand focus:ring-0 bg-dark-900 w-4 h-4 cursor-pointer"></td><td class="p-2.5 font-mono text-gray-400 whitespace-nowrap">${ssrInterpolate(formatData(item.data))}</td><td class="p-2.5 font-medium text-white"><div class="flex items-center gap-2"><span class="truncate max-w-xs font-bold text-white">${ssrInterpolate(item.cleanName || item.descricao)}</span>`);
						if (item.parcela) _push(`<span class="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-mono font-bold whitespace-nowrap">${ssrInterpolate(item.parcela.atual)}/${ssrInterpolate(item.parcela.total)}</span>`);
						else _push(`<!---->`);
						_push(`</div>`);
						if (item.cleanName && item.cleanName !== item.descricao) _push(`<span class="text-[10px] text-gray-500 font-mono block truncate max-w-xs"> Original: ${ssrInterpolate(item.descricao)}</span>`);
						else _push(`<!---->`);
						_push(`</td><td class="p-2.5"><select class="bg-dark-900 border border-dark-700 rounded-lg px-2.5 py-1 text-xs text-gray-200 focus:outline-none focus:border-brand"><!--[-->`);
						ssrRenderList(unref(categorias), (cat) => {
							_push(`<option${ssrRenderAttr("value", cat.nome)}${ssrIncludeBooleanAttr(Array.isArray(item.categoria) ? ssrLooseContain(item.categoria, cat.nome) : ssrLooseEqual(item.categoria, cat.nome)) ? " selected" : ""}>${ssrInterpolate(cat.nome)}</option>`);
						});
						_push(`<!--]--></select></td><td class="p-2.5 text-center">`);
						if (item.tipo === "despesa") _push(`<label class="relative inline-flex items-center cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(item.dividir5050) ? ssrLooseContain(item.dividir5050, null) : item.dividir5050) ? " checked" : ""} class="sr-only peer"><div class="w-7 h-4 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[&#39;&#39;] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand"></div></label>`);
						else _push(`<span class="text-[10px] text-gray-600 font-mono">—</span>`);
						_push(`</td><td class="${ssrRenderClass([item.tipo === "receita" ? "text-income" : "text-expense", "p-2.5 text-right font-bold font-mono text-sm whitespace-nowrap"])}">${ssrInterpolate(item.tipo === "receita" ? "+" : "-")} R\$ ${ssrInterpolate(item.valor.toFixed(2))}</td></tr>`);
					});
					_push(`<!--]--></tbody></table></div></div><div class="p-4 border-t border-dark-700/80 bg-dark-850 flex items-center justify-between gap-3"><button class="text-xs text-gray-400 hover:text-white px-3 py-2 hover:bg-dark-700 rounded-lg transition-colors font-medium"> ← Escolher Outro Arquivo </button><div class="flex items-center gap-3"><button class="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"> Cancelar </button><button${ssrIncludeBooleanAttr(qtdSelecionados.value === 0 || salvando.value) ? " disabled" : ""} class="bg-brand hover:bg-brand-400 disabled:opacity-40 text-dark-950 font-bold px-5 py-2 rounded-lg text-xs transition-all shadow-glow-emerald flex items-center gap-2 cursor-pointer">`);
					if (salvando.value) _push(`<svg class="animate-spin h-4 w-4 text-dark-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
					else _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`);
					_push(`<span>${ssrInterpolate(salvando.value ? "Importando..." : `Importar ${qtdSelecionados.value} Lançamentos`)}</span></button></div></div></div>`);
				}
				_push(`</div></div>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ModalImportarExtrato.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ModalImportarExtrato-DqqJkpww.mjs.map
