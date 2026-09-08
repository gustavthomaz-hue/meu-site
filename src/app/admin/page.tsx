'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Produto {
  id: string;
  nome: string;
  categoria?: string;
  loja?: string;
  faixa_preco?: string;
  faixaPreco?: string;
  imagem_url?: string;
  imagem?: string;
  link_afiliado?: string;
  link?: string;
  url?: string;
}

export default function AdminVisaoGeral() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [totalNoticias, setTotalNoticias] = useState(0);
  const [loading, setLoading] = useState(true);

  // Configuração Local do WhatsApp
  const [linkWhatsapp, setLinkWhatsapp] = useState('https://chat.whatsapp.com/ExemploGrupoHyperUtil');
  const [editandoWhatsapp, setEditandoWhatsapp] = useState(false);
  const [novoLinkWa, setNovoLinkWa] = useState('');

  useEffect(() => {
    async function carregarDadosSupabase() {
      setLoading(true);
      try {
        // 1. Busca produtos reais no Supabase
        const { data: prodsData, error: errProds } = await supabase
          .from('produtos')
          .select('*')
          .order('id', { ascending: false });

        if (!errProds && prodsData) {
          setProdutos(prodsData);
        }

        // 2. Busca contagem de notícias no Supabase
        const { count, error: errNot } = await supabase
          .from('noticias')
          .select('*', { count: 'exact', head: true });

        if (!errNot && count !== null) {
          setTotalNoticias(count);
        }
      } catch (err) {
        console.error('Erro ao carregar dados da Visão Geral:', err);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosSupabase();

    // Recupera link do WhatsApp salvo localmente
    const waSalvo = localStorage.getItem('hyperutil_link_whatsapp');
    if (waSalvo) {
      setLinkWhatsapp(waSalvo);
    }
  }, []);

  const salvarLinkWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();
    if (novoLinkWa) {
      setLinkWhatsapp(novoLinkWa);
      localStorage.setItem('hyperutil_link_whatsapp', novoLinkWa);
      setEditandoWhatsapp(false);
      alert('Link do Canal do WhatsApp atualizado!');
    }
  };

  const totalProdutos = produtos.length;
  const ultimosProdutos = produtos.slice(0, 5);

  // Filtra produtos que não possuem nenhum dos campos de link preenchidos
  const produtosSemLink = produtos.filter((p) => {
    const linkEfetivo = p.link_afiliado || p.link || p.url;
    return !linkEfetivo || linkEfetivo.trim() === '' || !linkEfetivo.startsWith('http');
  });

  const statusPorcentagem =
    totalProdutos > 0
      ? Math.round(((totalProdutos - produtosSemLink.length) / totalProdutos) * 100)
      : 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-slate-50 min-h-screen text-slate-800">
      {/* CABEÇALHO COM AÇÕES RÁPIDAS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Central de Comando HyperUtil
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">Visão Geral</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/produtos"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-xs transition-colors shadow-sm"
          >
            + Cadastrar Produto
          </Link>
          <Link
            href="/admin/noticias"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium text-xs transition-colors shadow-sm"
          >
            + Gerenciar Notícias
          </Link>
          <Link
            href="/admin/rankings"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-xs transition-colors shadow-sm"
          >
            ⚡ Gerar Ranking IA
          </Link>
          <button
            onClick={() => {
              setNovoLinkWa(linkWhatsapp);
              setEditandoWhatsapp(true);
            }}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-medium text-xs transition-colors"
          >
            📱 Canal WhatsApp
          </button>
        </div>
      </div>

      {/* FORMULÁRIO DO WHATSAPP */}
      {editandoWhatsapp && (
        <form onSubmit={salvarLinkWhatsapp} className="bg-emerald-900 text-white p-5 rounded-2xl shadow-lg space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm">Link Global do Canal do WhatsApp</h3>
            <button
              type="button"
              onClick={() => setEditandoWhatsapp(false)}
              className="text-xs text-emerald-200 hover:text-white"
            >
              Cancelar
            </button>
          </div>
          <p className="text-xs text-emerald-200">
            Este link é aplicado nos botões de chamada para o WhatsApp do portal.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={novoLinkWa}
              onChange={(e) => setNovoLinkWa(e.target.value)}
              required
              className="flex-1 bg-white text-slate-900 rounded-xl px-3 py-2 text-xs focus:outline-none"
              placeholder="https://chat.whatsapp.com/..."
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Atualizar
            </button>
          </div>
        </form>
      )}

      {/* KPIS DE PERFORMANCE E CONVERSÃO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total de Produtos</span>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {loading ? '...' : totalProdutos}
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">Base do Seletor & Duetos</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Notícias Automatizadas</span>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {loading ? '...' : totalNoticias}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Geradas via RSS + Gemini</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Cliques para WhatsApp</span>
          <div className="text-3xl font-black text-emerald-600 mt-2">342</div>
          <p className="text-xs text-emerald-600 font-medium mt-1">+18% esta semana</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Integridade dos Links</span>
          <div
            className={`text-3xl font-black mt-2 ${
              produtosSemLink.length > 0 ? 'text-amber-500' : 'text-emerald-600'
            }`}
          >
            {loading ? '...' : `${statusPorcentagem}%`}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {produtosSemLink.length > 0
              ? `${produtosSemLink.length} link(s) requer atenção`
              : 'Links prontos para conversão'}
          </p>
        </div>
      </div>

      {/* PAINEL CENTRAL DE OPERAÇÕES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: AUTOMAÇÕES, QUIZ E AUDITORIA */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-slate-900">Quiz Recomendador</h3>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
                3 Perguntas
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Respostas Concluídas:</span>
                <span className="font-bold text-slate-900">89 pesquisas</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Conversão para Afiliado:</span>
                <span className="font-bold text-emerald-600">42%</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Mais Indicado:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[120px]">Bambu Lab A1 Mini</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Automação RSS & IA</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Ativo
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Última Varredura RSS:</span>
                <span className="font-semibold text-slate-800">Hoje, 14:30</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Fallback de Imagem:</span>
                <span className="text-emerald-600 font-semibold">100% Ok</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Modelo de Reescrita:</span>
                <span className="font-semibold text-slate-800">Gemini Pro API</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3">Auditoria de Links</h3>
            {produtosSemLink.length === 0 ? (
              <p className="text-xs text-emerald-600 font-medium">
                ✓ Todos os produtos possuem link de afiliado ativo.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
                  Atualmente há {produtosSemLink.length} produto(s) sem link de afiliado:
                </p>
                <div className="divide-y divide-slate-100">
                  {produtosSemLink.map((p) => (
                    <div key={p.id} className="py-2 flex justify-between items-center text-xs">
                      <span className="truncate max-w-[160px] text-slate-700 font-medium">
                        {p.nome}
                      </span>
                      <Link
                        href="/admin/produtos"
                        className="text-emerald-600 hover:underline font-semibold text-[11px]"
                      >
                        Corrigir
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUNA DIREITA: ÚLTIMOS PRODUTOS REGISTRADOS NO SUPABASE */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Produtos no Catálogo</h3>
              <p className="text-xs text-slate-400">Alimentam o Seletor de Duelos, Rankings e Quiz</p>
            </div>
            <Link href="/admin/produtos" className="text-xs text-emerald-600 font-semibold hover:underline">
              Gerenciar Todos →
            </Link>
          </div>

          {loading ? (
            <p className="text-slate-400 text-sm">Carregando catálogo do Supabase...</p>
          ) : ultimosProdutos.length === 0 ? (
            <p className="text-slate-400 text-sm">Nenhum produto cadastrado no banco ainda.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {ultimosProdutos.map((p) => {
                const imagem = p.imagem_url || p.imagem;
                const preco = p.faixa_preco || p.faixaPreco || 'Consulte';
                const loja = p.loja || 'Mercado Livre';
                const categoria = p.categoria || 'Geral';

                return (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {imagem ? (
                        <img
                          src={imagem}
                          alt={p.nome}
                          className="w-10 h-10 object-contain border border-slate-200 rounded-lg p-1 bg-white"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-[9px] text-slate-400 font-bold">
                          SEM FOTO
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-slate-800 text-xs truncate max-w-xs md:max-w-sm">
                          {p.nome}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {loja} • {categoria}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 whitespace-nowrap">
                      {preco}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}