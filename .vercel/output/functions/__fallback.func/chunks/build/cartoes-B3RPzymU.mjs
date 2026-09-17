import { u as useFinancas } from './useFinancas-C7KH4i6q.mjs';
import { _ as _sfc_main$1 } from './Header-DO9G6iKM.mjs';
import { _ as _sfc_main$2 } from './ModalImportarExtrato-DqqJkpww.mjs';
import { ref, computed, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
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

//#region app/pages/cartoes.vue
var _sfc_main = {
	__name: "cartoes",
	__ssrInlineRender: true,
	setup(__props) {
		const { cartoes, transacoes, carregando, carregarTudo} = useFinancas();
		const modalAberto = ref(false);
		const modalExcluir = ref(false);
		const modalImportarAberto = ref(false);
		const modoEditar = ref(false);
		const cartaoParaExcluir = ref(null);
		ref(null);
		const cartaoSelecionadoId = ref("");
		const nomesMeses = [
			"Janeiro",
			"Fevereiro",
			"Março",
			"Abril",
			"Maio",
			"Junho",
			"Julho",
			"Agosto",
			"Setembro",
			"Outubro",
			"Novembro",
			"Dezembro"
		];
		const agora = /* @__PURE__ */ new Date();
		const mesFatura = ref(agora.getMonth() + 1);
		const anoFatura = ref(agora.getFullYear());
		const anos = computed(() => {
			const a = (/* @__PURE__ */ new Date()).getFullYear();
			return [
				a - 1,
				a,
				a + 1
			];
		});
		const periodoFaturaLabel = computed(() => `${nomesMeses[mesFatura.value - 1]}/${anoFatura.value}`);
		const coresSugeridas = [
			"#820ad1",
			"#ec7000",
			"#3ecf8e",
			"#3b82f6",
			"#ef4444",
			"#f59e0b",
			"#06b6d4",
			"#ec4899",
			"#84cc16",
			"#8b5cf6"
		];
		const form = reactive({
			nome: "",
			bandeira: "Mastercard",
			limite: 5e3,
			dia_fechamento: 1,
			dia_vencimento: 10,
			cor: "#820ad1"
		});
		const pertenceAoCartao = (t, c) => {
			if (!t || !c) return false;
			const cId = c.id ? String(c.id).trim().toLowerCase() : "";
			const cNome = c.nome ? String(c.nome).trim().toLowerCase() : "";
			if (t.cartao_id) {
				const tId = String(t.cartao_id).trim().toLowerCase();
				if (cId && tId === cId || cNome && tId === cNome || cNome && tId.includes(cNome) || cNome && cNome.includes(tId)) return true;
			}
			if (t.cartao_nome) {
				const tCardName = String(t.cartao_nome).trim().toLowerCase();
				if (cNome && tCardName === cNome || cNome && tCardName.includes(cNome) || cNome && cNome.includes(tCardName)) return true;
			}
			if (!t.conta_id && (!t.conta || t.conta === "")) return true;
			return false;
		};
		const pertenceAFatura = (t, c, mesAlvo, anoAlvo) => {
			if (!t || !c) return false;
			if (!pertenceAoCartao(t, c)) return false;
			if (!mesAlvo || mesAlvo === 0) return true;
			const diaFechamento = Number(c.dia_fechamento) || 15;
			if (!t.data) return false;
			const parts = t.data.split("-").map(Number);
			if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) return false;
			const y = parts[0];
			const m = parts[1];
			const d = parts[2];
			const dataCompra = new Date(y, m - 1, d);
			const dataFimCiclo = new Date(anoAlvo, mesAlvo - 1, diaFechamento, 23, 59, 59);
			return dataCompra >= new Date(anoAlvo, mesAlvo - 2, diaFechamento + 1, 0, 0, 0) && dataCompra <= dataFimCiclo;
		};
		const cartoesComLimite = computed(() => cartoes.value.map((c) => {
			const gastosFatura = transacoes.value.filter((t) => pertenceAFatura(t, c, mesFatura.value, anoFatura.value)).reduce((acc, curr) => acc + curr.valor, 0);
			const limiteDisponivel = Math.max(c.limite - gastosFatura, 0);
			const percUtilizado = c.limite > 0 ? gastosFatura / c.limite * 100 : 0;
			return {
				...c,
				gastosFatura,
				limiteDisponivel,
				percUtilizado
			};
		}));
		const cartaoAtivo = computed(() => cartoesComLimite.value.find((c) => c.id && c.id === cartaoSelecionadoId.value || c.nome && c.nome === cartaoSelecionadoId.value) || cartoesComLimite.value[0]);
		const lancamentosDoCartao = computed(() => {
			if (!cartaoAtivo.value) return [];
			return transacoes.value.filter((t) => pertenceAFatura(t, cartaoAtivo.value, mesFatura.value, anoFatura.value));
		});
		const totalFaturaAtiva = computed(() => lancamentosDoCartao.value.reduce((a, c) => a + c.valor, 0));
		const handleImportarEmLote = async (itens) => {
			await carregarTudo(true);
			if (itens && itens.length > 0) {
				const primeiraData = itens[0]?.data;
				if (primeiraData) {
					const parts = primeiraData.split("-").map(Number);
					if (parts[0] && parts[1]) {
						anoFatura.value = parts[0];
						mesFatura.value = parts[1];
					}
				}
			}
		};
		const formatData = (str) => {
			if (!str) return "";
			const parts = str.split("-");
			return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str;
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Header = _sfc_main$1;
			const _component_ModalImportarExtrato = _sfc_main$2;
			_push(`<div${ssrRenderAttrs(_attrs)}>`);
			_push(ssrRenderComponent(_component_Header, {
				title: "Cartões de Crédito & Faturas",
				subtitle: "Acompanhe seus limites, faturas e vencimentos",
				showAction: false
			}, null, _parent));
			_push(`<main class="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8"><div class="flex items-center justify-between flex-wrap gap-3"><h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Meus Cartões (${ssrInterpolate(unref(cartoes).length)}) </h3><div class="flex items-center gap-2"><select class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-semibold"><option${ssrRenderAttr("value", 0)}${ssrIncludeBooleanAttr(Array.isArray(mesFatura.value) ? ssrLooseContain(mesFatura.value, 0) : ssrLooseEqual(mesFatura.value, 0)) ? " selected" : ""}>Todas as Faturas (Ver Tudo)</option><!--[-->`);
			ssrRenderList(nomesMeses, (nome, idx) => {
				_push(`<option${ssrRenderAttr("value", idx + 1)}${ssrIncludeBooleanAttr(Array.isArray(mesFatura.value) ? ssrLooseContain(mesFatura.value, idx + 1) : ssrLooseEqual(mesFatura.value, idx + 1)) ? " selected" : ""}>Fatura ${ssrInterpolate(nome)}</option>`);
			});
			_push(`<!--]--></select><select class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"><!--[-->`);
			ssrRenderList(anos.value, (a) => {
				_push(`<option${ssrRenderAttr("value", a)}${ssrIncludeBooleanAttr(Array.isArray(anoFatura.value) ? ssrLooseContain(anoFatura.value, a) : ssrLooseEqual(anoFatura.value, a)) ? " selected" : ""}>${ssrInterpolate(a)}</option>`);
			});
			_push(`<!--]--></select><button class="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-gray-200 font-bold px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg><span class="hidden sm:inline">Importar Extrato</span></button><button class="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg><span>Novo Cartão</span></button></div></div>`);
			if (unref(carregando)) _push(`<div class="py-12 text-center text-purple-400"><svg class="animate-spin h-8 w-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`);
			else {
				_push(`<!--[-->`);
				if (unref(cartoes).length === 0) _push(`<div class="py-16 text-center"><div class="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div><p class="text-white font-bold mb-1">Nenhum cartão cadastrado</p><p class="text-gray-400 text-sm mb-4">Adicione seu primeiro cartão de crédito</p><button class="bg-purple-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm"> + Novo Cartão </button></div>`);
				else _push(`<!---->`);
				_push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
				ssrRenderList(cartoesComLimite.value, (card) => {
					_push(`<div class="${ssrRenderClass([cartaoSelecionadoId.value === card.id ? "ring-2 ring-purple-400 border-purple-500" : "border-dark-700/80 hover:border-dark-600", "rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all cursor-pointer border hover:scale-[1.01]"])}" style="${ssrRenderStyle({ background: `linear-gradient(135deg, ${card.cor}25 0%, #171c26 100%)` })}"><div class="absolute -right-10 -bottom-10 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-30" style="${ssrRenderStyle({ backgroundColor: card.cor })}"></div><div class="flex items-center justify-between mb-6"><div class="flex items-center gap-3"><div class="w-10 h-7 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-center shadow-inner"><div class="w-6 h-4 border border-amber-600/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5"><div class="bg-amber-600/30"></div><div class="bg-amber-600/30"></div></div></div><div><h4 class="text-sm font-bold text-white tracking-wide leading-tight">${ssrInterpolate(card.nome)}</h4><span class="text-[10px] text-gray-400 font-mono">${ssrInterpolate(card.bandeira)}</span></div></div><div class="flex items-center gap-1"><button class="p-1.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition-colors" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button class="p-1.5 rounded-lg text-gray-500 hover:text-expense hover:bg-expense/10 transition-colors" title="Excluir"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></div><div class="space-y-3"><div><div class="flex items-center justify-between text-xs mb-1"><span class="text-gray-400">Fatura ${ssrInterpolate(periodoFaturaLabel.value)}</span><span class="font-mono font-bold text-white">R\$ ${ssrInterpolate(card.gastosFatura.toFixed(2))}</span></div><div class="w-full bg-dark-950/80 rounded-full h-2 overflow-hidden border border-dark-700/60"><div class="${ssrRenderClass([card.percUtilizado > 80 ? "bg-expense" : card.percUtilizado > 60 ? "bg-amber-400" : "", "h-full rounded-full transition-all"])}" style="${ssrRenderStyle({
						width: `${Math.min(card.percUtilizado, 100)}%`,
						backgroundColor: card.percUtilizado <= 60 ? card.cor : void 0
					})}"></div></div></div><div class="flex items-center justify-between text-xs font-mono pt-1"><div><span class="text-[11px] text-gray-500 block">Limite Total</span><span class="font-bold text-gray-300">R\$ ${ssrInterpolate(card.limite.toFixed(2))}</span></div><div class="text-right"><span class="text-[11px] text-gray-500 block">Disponível</span><span class="font-bold text-brand">R\$ ${ssrInterpolate(card.limiteDisponivel.toFixed(2))}</span></div></div></div><div class="mt-5 pt-3 border-t border-dark-700/40 flex items-center justify-between text-xs text-gray-400 font-mono"><span>Fecha dia ${ssrInterpolate(card.dia_fechamento)} · Vence dia ${ssrInterpolate(card.dia_vencimento)}</span><span class="${ssrRenderClass([card.percUtilizado > 80 ? "text-expense animate-pulse" : "text-purple-400", "font-semibold"])}">${ssrInterpolate(card.percUtilizado.toFixed(0))}% </span></div></div>`);
				});
				_push(`<!--]--></div>`);
				if (cartaoAtivo.value) {
					_push(`<div class="bg-dark-800 border border-dark-700/80 rounded-2xl p-6 shadow-supabase space-y-6"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-700/80 pb-4"><div><h3 class="text-base font-bold text-white tracking-tight flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Fatura: <span class="text-purple-400">${ssrInterpolate(cartaoAtivo.value?.nome)}</span> · ${ssrInterpolate(periodoFaturaLabel.value)}</h3><p class="text-xs text-gray-400">Lançamentos atribuídos a este cartão</p></div><div class="flex items-center gap-4 bg-dark-900 border border-dark-700 rounded-xl p-3"><div><span class="text-[11px] text-gray-400 uppercase tracking-wider block font-mono">Total da Fatura</span><span class="text-xl font-extrabold font-mono text-purple-400">R\$ ${ssrInterpolate(totalFaturaAtiva.value.toFixed(2))}</span></div></div></div><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-dark-700 text-[11px] font-semibold uppercase tracking-wider text-gray-400"><th class="pb-3">Descrição</th><th class="pb-3">Parcela</th><th class="pb-3">Categoria</th><th class="pb-3">Data</th><th class="pb-3 text-right">Valor (R\$)</th><th class="pb-3 text-center">Ação</th></tr></thead><tbody class="divide-y divide-dark-700/60 text-sm"><!--[-->`);
					ssrRenderList(lancamentosDoCartao.value, (item) => {
						_push(`<tr class="group hover:bg-dark-750/50 transition-colors"><td class="py-3.5 font-medium text-white"><div class="flex items-center gap-3"><div class="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0"> 💳 </div><span>${ssrInterpolate(item.descricao)}</span></div></td><td class="py-3.5">`);
						if (item.total_parcelas > 1) _push(`<span class="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold"> Parc ${ssrInterpolate(item.parcela_atual)}/${ssrInterpolate(item.total_parcelas)}</span>`);
						else _push(`<span class="text-xs text-gray-500 font-mono">À vista</span>`);
						_push(`</td><td class="py-3.5"><span class="text-xs px-2.5 py-1 rounded-md bg-dark-900 border border-dark-700 text-gray-300 font-medium">${ssrInterpolate(item.categoria)}</span></td><td class="py-3.5 text-xs text-gray-400 font-mono">${ssrInterpolate(formatData(item.data))}</td><td class="py-3.5 text-right font-bold font-mono text-expense"> - R\$ ${ssrInterpolate(item.valor.toFixed(2))}</td><td class="py-3.5 text-center"><button class="text-gray-500 hover:text-expense p-1 rounded hover:bg-expense/10 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></td></tr>`);
					});
					_push(`<!--]-->`);
					if (lancamentosDoCartao.value.length === 0) _push(`<tr><td colspan="6" class="py-8 text-center text-gray-400 text-sm"> Nenhum gasto registrado na fatura de ${ssrInterpolate(periodoFaturaLabel.value)} para este cartão. </td></tr>`);
					else _push(`<!---->`);
					_push(`</tbody></table></div></div>`);
				} else _push(`<!---->`);
				_push(`<!--]-->`);
			}
			_push(`</main>`);
			if (modalAberto.value) {
				_push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div class="bg-dark-800 border border-dark-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4"><div class="flex items-center justify-between border-b border-dark-700 pb-3"><h3 class="text-base font-bold text-white">${ssrInterpolate(modoEditar.value ? "Editar Cartão" : "Cadastrar Cartão de Crédito")}</h3><button class="text-gray-400 hover:text-white">✕</button></div><form class="space-y-3"><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Nome do Cartão</label><input${ssrRenderAttr("value", form.nome)} type="text" placeholder="Ex: Nubank, C6 Black, Itaú" required class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Bandeira</label><select class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"><option value="Mastercard"${ssrIncludeBooleanAttr(Array.isArray(form.bandeira) ? ssrLooseContain(form.bandeira, "Mastercard") : ssrLooseEqual(form.bandeira, "Mastercard")) ? " selected" : ""}>Mastercard</option><option value="Mastercard Black"${ssrIncludeBooleanAttr(Array.isArray(form.bandeira) ? ssrLooseContain(form.bandeira, "Mastercard Black") : ssrLooseEqual(form.bandeira, "Mastercard Black")) ? " selected" : ""}>Mastercard Black</option><option value="Visa"${ssrIncludeBooleanAttr(Array.isArray(form.bandeira) ? ssrLooseContain(form.bandeira, "Visa") : ssrLooseEqual(form.bandeira, "Visa")) ? " selected" : ""}>Visa</option><option value="Visa Infinite"${ssrIncludeBooleanAttr(Array.isArray(form.bandeira) ? ssrLooseContain(form.bandeira, "Visa Infinite") : ssrLooseEqual(form.bandeira, "Visa Infinite")) ? " selected" : ""}>Visa Infinite</option><option value="Elo"${ssrIncludeBooleanAttr(Array.isArray(form.bandeira) ? ssrLooseContain(form.bandeira, "Elo") : ssrLooseEqual(form.bandeira, "Elo")) ? " selected" : ""}>Elo</option><option value="American Express"${ssrIncludeBooleanAttr(Array.isArray(form.bandeira) ? ssrLooseContain(form.bandeira, "American Express") : ssrLooseEqual(form.bandeira, "American Express")) ? " selected" : ""}>Amex</option><option value="Hipercard"${ssrIncludeBooleanAttr(Array.isArray(form.bandeira) ? ssrLooseContain(form.bandeira, "Hipercard") : ssrLooseEqual(form.bandeira, "Hipercard")) ? " selected" : ""}>Hipercard</option></select></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Limite (R\$)</label><input${ssrRenderAttr("value", form.limite)} type="number" step="100" required placeholder="5000.00" class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-400"></div></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Dia Fechamento</label><input${ssrRenderAttr("value", form.dia_fechamento)} type="number" min="1" max="31" required class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-400"></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Dia Vencimento</label><input${ssrRenderAttr("value", form.dia_vencimento)} type="number" min="1" max="31" required class="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-400"></div></div><div><label class="block text-xs font-semibold text-gray-300 uppercase mb-1">Cor do Cartão</label><div class="flex items-center gap-3"><input${ssrRenderAttr("value", form.cor)} type="color" class="w-12 h-10 bg-dark-900 border border-dark-700 rounded-lg p-1 cursor-pointer"><div class="flex gap-2 flex-wrap"><!--[-->`);
				ssrRenderList(coresSugeridas, (cor) => {
					_push(`<button type="button" style="${ssrRenderStyle({ backgroundColor: cor })}" class="${ssrRenderClass([form.cor === cor ? "border-white scale-110" : "border-transparent", "w-6 h-6 rounded-full border-2 transition-all"])}"></button>`);
				});
				_push(`<!--]--></div></div></div><div class="flex items-center justify-end gap-2 pt-3"><button type="button" class="px-4 py-2 text-xs text-gray-400">Cancelar</button><button type="submit" class="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2 rounded-lg text-xs">${ssrInterpolate(modoEditar.value ? "Salvar Alterações" : "Cadastrar Cartão")}</button></div></form></div></div>`);
			} else _push(`<!---->`);
			if (modalExcluir.value) _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"><div class="bg-dark-800 border border-expense/30 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-expense/15 border border-expense/30 flex items-center justify-center text-expense"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div><h3 class="text-base font-bold text-white">Excluir Cartão</h3><p class="text-xs text-gray-400">Esta ação não pode ser desfeita</p></div></div><p class="text-sm text-gray-300"> Deseja excluir o cartão <strong class="text-white">${ssrInterpolate(cartaoParaExcluir.value?.nome)}</strong>? </p><div class="flex items-center justify-end gap-2 pt-2"><button class="px-4 py-2 text-xs text-gray-400">Cancelar</button><button class="bg-expense hover:bg-red-500 text-white font-bold px-5 py-2 rounded-lg text-xs"> Sim, Excluir </button></div></div></div>`);
			else _push(`<!---->`);
			_push(ssrRenderComponent(_component_ModalImportarExtrato, {
				aberto: modalImportarAberto.value,
				cartaoPreSelecionadoId: cartaoSelecionadoId.value,
				onFechar: ($event) => modalImportarAberto.value = false,
				onImportar: handleImportarEmLote
			}, null, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cartoes.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cartoes-B3RPzymU.mjs.map
