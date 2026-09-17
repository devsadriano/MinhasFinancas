import { a as useSupabaseUser } from '../virtual/entry.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-VW3GFU14.mjs';
import { u as useWorkspace } from './useWorkspace-CnSCU5qX.mjs';
import { ref } from 'vue';

//#region app/utils/statementParser.ts
/**
* Sanitiza strings removendo null bytes (\u0000) e caracteres de controle que causam erro no PostgreSQL
*/
function sanitizeText(str) {
	if (!str) return "";
	return String(str).replace(/\u0000/g, "").replace(/[\u0001-\u0008\u000B-\u001F\u007F-\u009F]/g, "").replace(/[\uD800-\uDFFF]/g, "").trim();
}
//#endregion
//#region app/composables/useFinancas.ts
var transacoes = ref([]);
var bancos = ref([]);
var cartoes = ref([]);
var categorias = ref([]);
var orcamentos = ref([]);
var metas = ref([]);
var transferencias = ref([]);
var carregando = ref(false);
var carregadoInicial = ref(false);
var CONTAS_PADRAO = [
	{
		nome: "Nubank",
		tipo: "Conta Corrente",
		saldo: 5450,
		cor: "#820ad1"
	},
	{
		nome: "Itaú Unibanco",
		tipo: "Conta Corrente",
		saldo: 3200,
		cor: "#ec7000"
	},
	{
		nome: "Banco Inter",
		tipo: "Investimentos",
		saldo: 1800,
		cor: "#ff7a00"
	},
	{
		nome: "Carteira Física",
		tipo: "Dinheiro",
		saldo: 350,
		cor: "#3ecf8e"
	}
];
var CARTOES_PADRAO = [{
	nome: "Nubank Ultravioleta",
	bandeira: "Mastercard Black",
	limite: 7500,
	dia_fechamento: 1,
	dia_vencimento: 10,
	cor: "#820ad1"
}, {
	nome: "Itaú Personalité",
	bandeira: "Visa Infinite",
	limite: 15e3,
	dia_fechamento: 15,
	dia_vencimento: 25,
	cor: "#ec7000"
}];
var CATEGORIAS_PADRAO = [
	{
		nome: "Alimentação",
		icone: "🍔",
		cor: "#f59e0b",
		tipo: "despesa",
		essencial: true
	},
	{
		nome: "Moradia",
		icone: "🏠",
		cor: "#3b82f6",
		tipo: "despesa",
		essencial: true
	},
	{
		nome: "Salário",
		icone: "💰",
		cor: "#3ecf8e",
		tipo: "receita",
		essencial: false
	},
	{
		nome: "Transporte",
		icone: "🚗",
		cor: "#ef4444",
		tipo: "despesa",
		essencial: true
	},
	{
		nome: "Investimentos",
		icone: "📈",
		cor: "#10b981",
		tipo: "receita",
		essencial: false
	},
	{
		nome: "Lazer",
		icone: "✈️",
		cor: "#8b5cf6",
		tipo: "despesa",
		essencial: false
	},
	{
		nome: "Saúde",
		icone: "🏥",
		cor: "#ec4899",
		tipo: "despesa",
		essencial: true
	},
	{
		nome: "Outros",
		icone: "📦",
		cor: "#94a3b8",
		tipo: "despesa",
		essencial: false
	}
];
function useFinancas() {
	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	const db = supabase;
	const carregarTudo = async (forcar = false) => {
		if (carregadoInicial.value && !forcar) return;
		carregando.value = true;
		try {
			if (user.value) {
				const { data: contasData } = await db.from("contas").select("*").order("created_at", { ascending: true });
				if (contasData && contasData.length > 0) bancos.value = contasData.map((c) => ({
					...c,
					saldo: Number(c.saldo)
				}));
				else {
					const paraInserir = CONTAS_PADRAO.map((c) => ({
						...c,
						user_id: user.value?.id
					}));
					const { data: novasContas } = await db.from("contas").insert(paraInserir).select();
					if (novasContas) bancos.value = novasContas.map((c) => ({
						...c,
						saldo: Number(c.saldo)
					}));
				}
				const { data: cartoesData } = await db.from("cartoes").select("*").order("created_at", { ascending: true });
				if (cartoesData && cartoesData.length > 0) cartoes.value = cartoesData.map((c) => ({
					...c,
					limite: Number(c.limite)
				}));
				else {
					const cartoesInserir = CARTOES_PADRAO.map((c) => ({
						...c,
						user_id: user.value?.id
					}));
					const { data: novosCartoes } = await db.from("cartoes").insert(cartoesInserir).select();
					if (novosCartoes) cartoes.value = novosCartoes.map((c) => ({
						...c,
						limite: Number(c.limite)
					}));
				}
				const nubankCard = cartoes.value.find((c) => c.nome.toLowerCase().includes("nubank"));
				if (nubankCard && (nubankCard.dia_fechamento === 1 || nubankCard.limite < 9e3)) {
					nubankCard.dia_fechamento = 16;
					nubankCard.dia_vencimento = 23;
					nubankCard.limite = 9650;
					if (nubankCard.id && !String(nubankCard.id).startsWith("card-")) await db.from("cartoes").update({
						dia_fechamento: 16,
						dia_vencimento: 23,
						limite: 9650
					}).eq("id", nubankCard.id);
				}
				const { data: catData } = await db.from("categorias").select("*").order("created_at", { ascending: true });
				if (catData && catData.length > 0) categorias.value = catData;
				else {
					const catInserir = CATEGORIAS_PADRAO.map((c) => ({
						...c,
						user_id: user.value?.id
					}));
					const { data: novasCats } = await db.from("categorias").insert(catInserir).select();
					if (novasCats) categorias.value = novasCats;
				}
				const { data: transData } = await db.from("transacoes").select("*, contas(nome), categorias(nome, icone, cor), cartoes(nome)").order("data", { ascending: false }).order("created_at", { ascending: false });
				if (transData) {
					transacoes.value = transData.map((t) => ({
						id: t.id,
						user_id: t.user_id,
						conta_id: t.conta_id,
						cartao_id: t.cartao_id,
						categoria_id: t.categoria_id,
						descricao: t.descricao,
						valor: Number(t.valor),
						tipo: t.tipo,
						data: t.data,
						pago: t.pago,
						observacao: t.observacao,
						parcela_atual: t.parcela_atual || 1,
						total_parcelas: t.total_parcelas || 1,
						conta: t.contas?.nome || "",
						categoria: t.categorias?.nome || "Outros",
						cartao_nome: t.cartoes?.nome || ""
					}));
					if (nubankCard?.id && !String(nubankCard.id).startsWith("card-")) {
						const transOrfas = (transData || []).filter((t) => !t.cartao_id && !t.conta_id);
						if (transOrfas.length > 0) {
							const orfasIds = transOrfas.map((t) => t.id);
							await db.from("transacoes").update({ cartao_id: nubankCard.id }).in("id", orfasIds);
							transacoes.value.forEach((t) => {
								if (orfasIds.includes(t.id)) {
									t.cartao_id = nubankCard.id;
									t.cartao_nome = nubankCard.nome;
								}
							});
						}
					}
				}
				const agora = /* @__PURE__ */ new Date();
				await carregarOrcamentos(agora.getMonth() + 1, agora.getFullYear());
				await carregarMetas();
				await carregarTransferencias();
			} else {
				if (bancos.value.length === 0) bancos.value = CONTAS_PADRAO;
				if (cartoes.value.length === 0) cartoes.value = CARTOES_PADRAO;
				if (categorias.value.length === 0) categorias.value = CATEGORIAS_PADRAO;
			}
			carregadoInicial.value = true;
		} catch (err) {
			console.error("Erro ao carregar dados:", err);
		} finally {
			carregando.value = false;
		}
	};
	const adicionarLancamento = async (item) => {
		const contaEncontrada = bancos.value.find((b) => b.nome.toLowerCase().includes((item.conta || "").toLowerCase())) || bancos.value[0];
		const catEncontrada = categorias.value.find((c) => c.nome.toLowerCase() === (item.categoria || "").toLowerCase());
		const cartaoEncontrado = item.usarCartao ? cartoes.value.find((c) => c.id === item.cartao_id) : null;
		const formatado = {
			id: `tr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
			descricao: item.descricao,
			valor: Number(item.valor),
			tipo: item.tipo,
			data: item.data,
			categoria: item.categoria || "Outros",
			conta: item.usarCartao ? "" : item.conta || "",
			cartao_id: item.usarCartao ? item.cartao_id || null : null,
			cartao_nome: cartaoEncontrado?.nome || "",
			observacao: item.observacao || "",
			pago: true,
			parcela_atual: item.parcela_atual || 1,
			total_parcelas: item.total_parcelas || 1
		};
		transacoes.value.unshift(formatado);
		if (contaEncontrada && !item.usarCartao) {
			if (item.tipo === "receita") contaEncontrada.saldo += Number(item.valor);
			else contaEncontrada.saldo -= Number(item.valor);
		}
		if (user.value) try {
			const novoDado = {
				user_id: user.value.id,
				descricao: item.descricao,
				valor: Number(item.valor),
				tipo: item.tipo,
				data: item.data,
				pago: true,
				parcela_atual: item.parcela_atual || 1,
				total_parcelas: item.total_parcelas || 1
			};
			if (item.usarCartao && item.cartao_id) novoDado.cartao_id = item.cartao_id;
			if (!item.usarCartao && contaEncontrada?.id) novoDado.conta_id = contaEncontrada.id;
			if (catEncontrada?.id) novoDado.categoria_id = catEncontrada.id;
			if (item.observacao) novoDado.observacao = item.observacao;
			const { data: inserido, error: errIns } = await db.from("transacoes").insert([novoDado]).select().single();
			if (errIns) console.error("Erro ao inserir lançamento:", errIns);
			else if (inserido) formatado.id = inserido.id;
			if (!item.usarCartao && contaEncontrada?.id) await db.from("contas").update({ saldo: contaEncontrada.saldo }).eq("id", contaEncontrada.id);
		} catch (e) {
			console.error("Erro na sincronização Supabase:", e);
		}
	};
	const editarLancamento = async (id, dados) => {
		const idx = transacoes.value.findIndex((t) => t.id === id);
		if (idx === -1) return;
		const antigo = transacoes.value[idx];
		const contaEncontrada = bancos.value.find((b) => b.nome.toLowerCase().includes((dados.conta || antigo.conta || "").toLowerCase()));
		const catEncontrada = categorias.value.find((c) => c.nome.toLowerCase() === (dados.categoria || antigo.categoria || "").toLowerCase());
		if (antigo.conta_id && contaEncontrada) {
			if (antigo.tipo === "receita") contaEncontrada.saldo -= antigo.valor;
			else contaEncontrada.saldo += antigo.valor;
		}
		if (contaEncontrada && !dados.cartao_id) {
			const novoValor = Number(dados.valor ?? antigo.valor);
			if ((dados.tipo ?? antigo.tipo) === "receita") contaEncontrada.saldo += novoValor;
			else contaEncontrada.saldo -= novoValor;
		}
		transacoes.value[idx] = {
			...antigo,
			...dados,
			descricao: dados.descricao ?? antigo.descricao,
			valor: Number(dados.valor ?? antigo.valor),
			categoria: dados.categoria || antigo.categoria,
			conta: dados.conta || antigo.conta
		};
		if (user.value && id && !id.startsWith("tr-")) try {
			await db.from("transacoes").update({
				descricao: dados.descricao,
				valor: Number(dados.valor),
				tipo: dados.tipo,
				data: dados.data,
				categoria_id: catEncontrada?.id || antigo.categoria_id,
				conta_id: dados.conta_id || antigo.conta_id,
				observacao: dados.observacao,
				pago: dados.pago
			}).eq("id", id);
			if (contaEncontrada?.id) await db.from("contas").update({ saldo: contaEncontrada.saldo }).eq("id", contaEncontrada.id);
		} catch (e) {
			console.error("Erro ao editar lançamento:", e);
		}
	};
	const removerLancamento = async (id) => {
		const item = transacoes.value.find((t) => t.id === id);
		if (!item) return;
		if (item.conta) {
			const conta = bancos.value.find((b) => b.nome === item.conta || b.id === item.conta_id);
			if (conta) {
				if (item.tipo === "receita") conta.saldo -= item.valor;
				else conta.saldo += item.valor;
				if (user.value && conta.id) await db.from("contas").update({ saldo: conta.saldo }).eq("id", conta.id);
			}
		}
		transacoes.value = transacoes.value.filter((t) => t.id !== id);
		if (user.value && id && !id.startsWith("tr-")) await db.from("transacoes").delete().eq("id", id);
	};
	const isUUID = (str) => typeof str === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
	const adicionarLancamentosEmLote = async (itens) => {
		if (!itens || itens.length === 0) return {
			sucesso: true,
			quantidade: 0
		};
		const { data: sessionData } = await supabase.auth.getSession();
		const currentUser = sessionData?.session?.user || user.value;
		const workspace = useWorkspace();
		const activeGrupoId = workspace.grupoAtivo.value?.id;
		const validGrupoId = activeGrupoId && isUUID(activeGrupoId) ? activeGrupoId : null;
		const formatados = [];
		const paraBanco = [];
		for (const item of itens) {
			const contaEncontrada = item.conta && typeof item.conta === "string" && item.conta.trim().length > 0 ? bancos.value.find((b) => b.id && b.id === item.conta_id || b.nome && b.nome.toLowerCase() === item.conta.trim().toLowerCase() || b.nome && b.nome.toLowerCase().includes(item.conta.trim().toLowerCase()) || item.conta && item.conta.trim().toLowerCase().includes(b.nome.toLowerCase())) || null : null;
			const catEncontrada = categorias.value.find((c) => c.id && c.id === item.categoria_id || c.nome && c.nome.toLowerCase() === (item.categoria || "").toLowerCase());
			const cartaoIdInput = item.cartao_id ? String(item.cartao_id).trim() : "";
			let cartaoEncontrado = cartaoIdInput ? cartoes.value.find((c) => c.id && String(c.id).toLowerCase() === cartaoIdInput.toLowerCase() || c.nome && c.nome.toLowerCase() === cartaoIdInput.toLowerCase() || c.nome && c.nome.toLowerCase().includes(cartaoIdInput.toLowerCase()) || cartaoIdInput.toLowerCase().includes(c.nome.toLowerCase())) : null;
			if (cartaoIdInput && (!cartaoEncontrado || !isUUID(cartaoEncontrado.id))) cartaoEncontrado = await obterOuCriarCartao({ nome: cartaoIdInput });
			const finalCartaoUuid = isUUID(cartaoIdInput) ? cartaoIdInput : isUUID(cartaoEncontrado?.id) ? cartaoEncontrado.id : null;
			const finalContaUuid = contaEncontrada && isUUID(contaEncontrada.id) ? contaEncontrada.id : null;
			const finalCatUuid = catEncontrada && isUUID(catEncontrada.id) ? catEncontrada.id : null;
			const tempId = `tr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
			const descSanitizada = sanitizeText(item.descricao) || "Lançamento Importado";
			const formatado = {
				id: tempId,
				descricao: descSanitizada,
				valor: Number(item.valor),
				tipo: item.tipo,
				data: item.data,
				categoria: sanitizeText(catEncontrada?.nome || item.categoria || "Outros"),
				conta: finalCartaoUuid ? "" : contaEncontrada?.nome || item.conta || "",
				cartao_id: finalCartaoUuid || cartaoEncontrado?.id || cartaoIdInput || null,
				cartao_nome: cartaoEncontrado?.nome || item.cartao_nome || "",
				pago: true,
				parcela_atual: Number(item.parcela_atual || item.parcela?.atual || 1),
				total_parcelas: Number(item.total_parcelas || item.parcela?.total || 1)
			};
			formatados.push(formatado);
			if (contaEncontrada && !finalCartaoUuid) {
				if (item.tipo === "receita") contaEncontrada.saldo += Number(item.valor);
				else contaEncontrada.saldo -= Number(item.valor);
			}
			if (currentUser) {
				const rowBanco = {
					user_id: currentUser.id,
					descricao: descSanitizada,
					valor: Number(item.valor),
					tipo: item.tipo,
					data: item.data,
					pago: true,
					parcela_atual: Number(item.parcela_atual || item.parcela?.atual || 1),
					total_parcelas: Number(item.total_parcelas || item.parcela?.total || 1)
				};
				if (validGrupoId) rowBanco.grupo_id = validGrupoId;
				if (finalCartaoUuid) rowBanco.cartao_id = finalCartaoUuid;
				if (!finalCartaoUuid && finalContaUuid) rowBanco.conta_id = finalContaUuid;
				if (finalCatUuid) rowBanco.categoria_id = finalCatUuid;
				paraBanco.push(rowBanco);
			}
		}
		if (currentUser && paraBanco.length > 0) try {
			let inseridos = null;
			const result1 = await db.from("transacoes").insert(paraBanco).select("id, valor");
			if (result1.error) {
				result1.error;
				console.error("Erro ao salvar lote no Supabase (tentativa 1):", result1.error);
				if (result1.error.message?.includes("schema cache") || result1.error.message?.includes("column") || result1.error.code === "PGRST204") {
					const paraBancoBasico = paraBanco.map((row) => ({
						user_id: row.user_id,
						descricao: row.descricao,
						valor: row.valor,
						tipo: row.tipo,
						data: row.data,
						pago: row.pago ?? true,
						parcela_atual: row.parcela_atual ?? 1,
						total_parcelas: row.total_parcelas ?? 1,
						...row.cartao_id ? { cartao_id: row.cartao_id } : {},
						...row.conta_id ? { conta_id: row.conta_id } : {},
						...row.categoria_id ? { categoria_id: row.categoria_id } : {}
					}));
					const result2 = await db.from("transacoes").insert(paraBancoBasico).select("id, valor");
					if (result2.error) {
						console.error("Erro no fallback básico:", result2.error);
						return {
							sucesso: false,
							mensagem: `Erro ao salvar no banco: ${result2.error.message}`
						};
					}
					inseridos = result2.data;
				} else return {
					sucesso: false,
					mensagem: `Erro ao salvar no banco: ${result1.error.message}`
				};
			} else inseridos = result1.data;
			if (inseridos) for (let idx = 0; idx < inseridos.length; idx++) {
				const ins = inseridos[idx];
				const orig = itens[idx];
				if (formatados[idx] && ins) formatados[idx].id = ins.id;
				if (orig?.dividir5050 && ins?.id) await workspace.criarRateio5050(ins.id, Number(ins.valor));
			}
		} catch (e) {
			console.error("Erro na requisição em lote Supabase:", e);
			return {
				sucesso: false,
				mensagem: e?.message || "Erro ao conectar ao banco."
			};
		}
		else for (let idx = 0; idx < formatados.length; idx++) if (itens[idx]?.dividir5050 && formatados[idx]?.id) await workspace.criarRateio5050(formatados[idx].id, formatados[idx].valor);
		await carregarTudo(true);
		return {
			sucesso: true,
			quantidade: formatados.length
		};
	};
	const adicionarConta = async (novaConta) => {
		const local = {
			...novaConta,
			saldo: Number(novaConta.saldo)
		};
		bancos.value.push(local);
		if (user.value) try {
			const { data } = await db.from("contas").insert([{
				...novaConta,
				user_id: user.value.id
			}]).select().single();
			if (data) local.id = data.id;
		} catch (e) {
			console.error("Erro ao adicionar conta:", e);
		}
	};
	const editarConta = async (id, dados) => {
		const idx = bancos.value.findIndex((b) => b.id === id);
		if (idx === -1) return;
		bancos.value[idx] = {
			...bancos.value[idx],
			...dados,
			saldo: Number(dados.saldo ?? bancos.value[idx].saldo)
		};
		if (user.value) await db.from("contas").update({
			nome: dados.nome,
			tipo: dados.tipo,
			saldo: Number(dados.saldo),
			cor: dados.cor
		}).eq("id", id);
	};
	const excluirConta = async (id) => {
		bancos.value = bancos.value.filter((b) => b.id !== id);
		if (user.value) await db.from("contas").delete().eq("id", id);
	};
	const obterOuCriarCartao = async (dados) => {
		const nomeNorm = dados.nome.toLowerCase();
		const existente = cartoes.value.find((c) => c.nome.toLowerCase().includes(nomeNorm) || nomeNorm.includes(c.nome.toLowerCase()));
		if (existente) return existente;
		const novo = {
			nome: dados.nome,
			bandeira: dados.bandeira || "Mastercard",
			limite: 5e3,
			dia_fechamento: 1,
			dia_vencimento: 10,
			cor: dados.cor || "#820ad1"
		};
		await adicionarCartao(novo);
		return cartoes.value[cartoes.value.length - 1] || {
			...novo,
			id: `card-${Date.now()}`
		};
	};
	const obterOuCriarConta = async (dados) => {
		const nomeNorm = dados.nome.toLowerCase();
		const existente = bancos.value.find((b) => b.nome.toLowerCase().includes(nomeNorm) || nomeNorm.includes(b.nome.toLowerCase()));
		if (existente) return existente;
		const novo = {
			nome: dados.nome,
			tipo: "Conta Corrente",
			saldo: 0,
			cor: dados.cor || "#3ecf8e"
		};
		await adicionarConta(novo);
		return bancos.value[bancos.value.length - 1] || {
			...novo,
			id: `banco-${Date.now()}`
		};
	};
	const adicionarCartao = async (novoCartao) => {
		const local = {
			...novoCartao,
			limite: Number(novoCartao.limite)
		};
		cartoes.value.push(local);
		if (user.value) try {
			const { data } = await db.from("cartoes").insert([{
				...novoCartao,
				user_id: user.value.id
			}]).select().single();
			if (data) local.id = data.id;
		} catch (e) {
			console.error("Erro ao adicionar cartão:", e);
		}
	};
	const editarCartao = async (id, dados) => {
		const idx = cartoes.value.findIndex((c) => c.id === id);
		if (idx === -1) return;
		cartoes.value[idx] = {
			...cartoes.value[idx],
			...dados,
			limite: Number(dados.limite ?? cartoes.value[idx].limite)
		};
		if (user.value) await db.from("cartoes").update({
			nome: dados.nome,
			bandeira: dados.bandeira,
			limite: Number(dados.limite),
			dia_fechamento: dados.dia_fechamento,
			dia_vencimento: dados.dia_vencimento,
			cor: dados.cor
		}).eq("id", id);
	};
	const excluirCartao = async (id) => {
		cartoes.value = cartoes.value.filter((c) => c.id !== id);
		if (user.value) await db.from("cartoes").delete().eq("id", id);
	};
	const adicionarCategoria = async (novaCat) => {
		const local = { ...novaCat };
		categorias.value.push(local);
		if (user.value) try {
			const { data } = await db.from("categorias").insert([{
				...novaCat,
				user_id: user.value.id
			}]).select().single();
			if (data) local.id = data.id;
		} catch (e) {
			console.error("Erro ao adicionar categoria:", e);
		}
	};
	const editarCategoria = async (id, dados) => {
		const idx = categorias.value.findIndex((c) => c.id === id);
		if (idx === -1) return;
		categorias.value[idx] = {
			...categorias.value[idx],
			...dados
		};
		if (user.value) await db.from("categorias").update({
			nome: dados.nome,
			tipo: dados.tipo,
			icone: dados.icone,
			cor: dados.cor,
			essencial: dados.essencial
		}).eq("id", id);
	};
	const excluirCategoria = async (id) => {
		categorias.value = categorias.value.filter((c) => c.id !== id);
		if (user.value) await db.from("categorias").delete().eq("id", id);
	};
	const carregarOrcamentos = async (mes, ano) => {
		if (!user.value) return;
		const { data } = await db.from("orcamentos").select("*").eq("user_id", user.value.id).eq("mes", mes).eq("ano", ano);
		if (data) orcamentos.value = data;
	};
	const salvarOrcamento = async (dados) => {
		const existente = orcamentos.value.find((o) => o.categoria_nome === dados.categoria_nome && o.mes === dados.mes && o.ano === dados.ano);
		if (existente) {
			const idx = orcamentos.value.findIndex((o) => o.id === existente.id);
			orcamentos.value[idx] = {
				...existente,
				...dados
			};
			if (user.value && existente.id) await db.from("orcamentos").update({ limite: dados.limite }).eq("id", existente.id);
		} else {
			const novoOrc = { ...dados };
			orcamentos.value.push(novoOrc);
			if (user.value) {
				const { data } = await db.from("orcamentos").insert([{
					...dados,
					user_id: user.value.id
				}]).select().single();
				if (data) novoOrc.id = data.id;
			}
		}
	};
	const excluirOrcamento = async (id) => {
		orcamentos.value = orcamentos.value.filter((o) => o.id !== id);
		if (user.value) await db.from("orcamentos").delete().eq("id", id);
	};
	const carregarMetas = async () => {
		if (!user.value) return;
		const { data } = await db.from("metas").select("*").eq("user_id", user.value.id).order("created_at", { ascending: true });
		if (data) metas.value = data.map((m) => ({
			...m,
			alvo: Number(m.alvo),
			atual: Number(m.atual)
		}));
	};
	const salvarMeta = async (dados) => {
		const novaMeta = {
			...dados,
			atual: 0
		};
		metas.value.push(novaMeta);
		if (user.value) {
			const { data } = await db.from("metas").insert([{
				...dados,
				user_id: user.value.id
			}]).select().single();
			if (data) novaMeta.id = data.id;
		}
	};
	const editarMeta = async (id, dados) => {
		const idx = metas.value.findIndex((m) => m.id === id);
		if (idx === -1) return;
		metas.value[idx] = {
			...metas.value[idx],
			...dados
		};
		if (user.value) await db.from("metas").update({
			titulo: dados.titulo,
			icone: dados.icone,
			alvo: dados.alvo,
			prazo: dados.prazo,
			cor: dados.cor
		}).eq("id", id);
	};
	const aportarNaMeta = async (id, valor) => {
		const idx = metas.value.findIndex((m) => m.id === id);
		if (idx === -1) return;
		const meta = metas.value[idx];
		meta.atual += valor;
		if (user.value) await db.from("metas").update({ atual: meta.atual }).eq("id", id);
	};
	const excluirMeta = async (id) => {
		metas.value = metas.value.filter((m) => m.id !== id);
		if (user.value) await db.from("metas").delete().eq("id", id);
	};
	const carregarTransferencias = async () => {
		if (!user.value) return;
		const { data } = await db.from("transferencias").select("*, contas_origem:conta_origem_id(nome), contas_destino:conta_destino_id(nome)").eq("user_id", user.value.id).order("data", { ascending: false });
		if (data) transferencias.value = data.map((t) => ({
			...t,
			valor: Number(t.valor),
			conta_origem_nome: t.contas_origem?.nome || "",
			conta_destino_nome: t.contas_destino?.nome || ""
		}));
	};
	const transferirEntreContas = async (dados) => {
		const origem = bancos.value.find((b) => b.id === dados.conta_origem_id);
		const destino = bancos.value.find((b) => b.id === dados.conta_destino_id);
		if (!origem || !destino) return;
		const valor = Number(dados.valor);
		origem.saldo -= valor;
		destino.saldo += valor;
		const novaTransf = {
			...dados,
			conta_origem_nome: origem.nome,
			conta_destino_nome: destino.nome
		};
		transferencias.value.unshift(novaTransf);
		if (user.value) try {
			const { data } = await db.from("transferencias").insert([{
				...dados,
				user_id: user.value.id
			}]).select().single();
			if (data) novaTransf.id = data.id;
			await db.from("contas").update({ saldo: origem.saldo }).eq("id", origem.id);
			await db.from("contas").update({ saldo: destino.saldo }).eq("id", destino.id);
		} catch (e) {
			console.error("Erro ao transferir:", e);
		}
	};
	return {
		transacoes,
		bancos,
		cartoes,
		categorias,
		orcamentos,
		metas,
		transferencias,
		carregando,
		carregarTudo,
		adicionarLancamento,
		editarLancamento,
		removerLancamento,
		adicionarLancamentosEmLote,
		adicionarConta,
		editarConta,
		excluirConta,
		obterOuCriarConta,
		adicionarCartao,
		editarCartao,
		excluirCartao,
		obterOuCriarCartao,
		adicionarCategoria,
		editarCategoria,
		excluirCategoria,
		carregarOrcamentos,
		salvarOrcamento,
		excluirOrcamento,
		carregarMetas,
		salvarMeta,
		editarMeta,
		aportarNaMeta,
		excluirMeta,
		carregarTransferencias,
		transferirEntreContas
	};
}

export { useFinancas as u };
//# sourceMappingURL=useFinancas-C7KH4i6q.mjs.map
