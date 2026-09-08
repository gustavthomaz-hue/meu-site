"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Produto {
  id: string;
  nome: string;
  marca?: string;
  categoria?: string;
  categoria_slug?: string;
  preco?: number | string;
  imagem_url?: string;
  link_afiliado?: string;
  nota?: number | string;
  pontos_fortes?: string[];
  destaque_tag?: string;
}

export default function RankingSlugPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const [slug, setSlug] = useState<string>("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  // Resolve os parâmetros da URL
  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setSlug(resolved.slug);
    }
    resolveParams();
  }, [params]);

  // Busca os produtos quando o slug estiver disponível
  useEffect(() => {
    if (!slug) return;

    async function fetchProdutosPorCategoria() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("produtos")
          .select("*");

        if (error) {
          console.error("Erro ao carregar produtos:", error.message);
        } else if (data) {
          const filtrados = data.filter(
            (p) => p.categoria_slug === slug || !p.categoria_slug
          );

          const ordenados = [...filtrados].sort(
            (a, b) => Number(b.nota || 0) - Number(a.nota || 0)
          );

          setProdutos(ordenados);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProdutosPorCategoria();
  }, [slug]);

  const tituloFormatado = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div>
        <Link
          href="/rankings"
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 mb-3"
        >
          ← Voltar para todas as categorias
        </Link>
        <span className="text-blue-600 text-xs font-bold tracking-wider uppercase block mb-1">
          Ranking Atualizado 2026
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Melhores {tituloFormatado}
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Seleção completa dos melhores modelos com base em testes, avaliações e custo-benefício.
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium">
            Carregando ranking...
          </div>
        ) : produtos.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
            Nenhum produto cadastrado para essa categoria ainda.
          </div>
        ) : (
          produtos.map((item, index) => {
            const posicao = index + 1;
            return (
              <div
                key={item.id || index}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition grid md:grid-cols-12 gap-6 items-center"
              >
                <div className="md:col-span-3 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white font-extrabold text-lg rounded-xl flex items-center justify-center shrink-0">
                    #{posicao}
                  </div>
                  <div className="bg-slate-50 border border-slate-100 h-20 w-full rounded-xl flex items-center justify-center text-xs font-semibold text-slate-400 overflow-hidden p-2">
                    {item.imagem_url ? (
                      <img
                        src={item.imagem_url}
                        alt={item.nome}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span>[Sem Imagem]</span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-6 space-y-2">
                  <div className="flex items-center gap-2">
                    {item.marca && (
                      <span className="text-xs font-bold text-slate-400 uppercase">
                        {item.marca}
                      </span>
                    )}
                    {(item.destaque_tag || item.categoria) && (
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.destaque_tag || item.categoria}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{item.nome}</h3>
                  {item.pontos_fortes && item.pontos_fortes.length > 0 && (
                    <ul className="text-xs text-slate-600 space-y-1">
                      {item.pontos_fortes.map((pro, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-emerald-600 font-bold">✓</span> {pro}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="md:col-span-3 flex md:flex-col justify-between md:justify-center items-end gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">A partir de</span>
                    <span className="text-xl font-bold text-slate-900">
                      {typeof item.preco === "number"
                        ? `R$ ${item.preco}`
                        : item.preco || "Sob consulta"}
                    </span>
                    {item.nota && (
                      <div className="text-amber-500 text-xs font-bold mt-0.5">
                        ★ {item.nota}
                      </div>
                    )}
                  </div>

                  <a
                    href={item.link_afiliado || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition text-center w-full shadow-sm"
                  >
                    Ver Melhor Oferta →
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}