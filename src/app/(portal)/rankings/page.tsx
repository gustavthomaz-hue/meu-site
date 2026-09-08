"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Subtema {
  nome: string;
  slug: string;
  descricao: string;
}

interface Categoria {
  id: string;
  titulo: string;
  icone: string;
  descricao: string;
  subtemas: Subtema[];
}

const CATEGORIAS: Categoria[] = [
  {
    id: "impressao-3d",
    titulo: "Impressão 3D & Fabricação Digital",
    icone: "🖨️",
    descricao: "Rankings de impressoras, filamentos, resinas, tintas e insumos.",
    subtemas: [
      { nome: "Impressoras 3D FDM", slug: "impressoras-3d-fdm", descricao: "As melhores impressoras de filamento para iniciantes e pro" },
      { nome: "Filamentos PLA", slug: "filamentos-pla", descricao: "Top filamentos PLA com melhor fluidez e acabamento" },
      { nome: "Filamentos PETG", slug: "filamentos-petg", descricao: "Opções resistentes para peças estruturais" },
      { nome: "Impressoras 3D Resina", slug: "impressoras-3d-resina", descricao: "Precisão máxima para miniaturas e odontologia" },
      { nome: "Resinas 3D", slug: "resinas", descricao: "Resinas padrão, laváveis em água e de alta resistência" },
      { nome: "Aerógrafos e Tintas", slug: "aerografos-tintas", descricao: "Materiais para pintura e acabamento de peças 3D" },
    ],
  },
  {
    id: "drones",
    titulo: "Drones & FPV",
    icone: "🚁",
    descricao: "Comparativos de drones comerciais, FPV, skins de proteção e acessórios.",
    subtemas: [
      { nome: "Drones para Iniciantes", slug: "drones-iniciantes", descricao: "Modelos acessíveis e fáceis de pilotar" },
      { nome: "Drones FPV Cinema", slug: "drones-fpv", descricao: "Drones para filmagens dinâmicas e de alta velocidade" },
      { nome: "Skins e Vinis de Proteção", slug: "skins-vinis", descricao: "Texturas, adesivos de proteção e personalização" },
      { nome: "Baterias e Carregadores", slug: "baterias-drones", descricao: "Fontes de energia de alta eficiência para drones" },
    ],
  },
];

export default function RankingsMainPage() {
  // Define qual gaveta fica aberta inicialmente (impressão 3d)
  const [gavetaAberta, setGavetaAberta] = useState<string | null>("impressao-3d");

  const toggleGaveta = (id: string) => {
    setGavetaAberta(gavetaAberta === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div>
        <span className="text-blue-600 text-xs font-bold tracking-wider uppercase block mb-1">
          Guias & Comparativos
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Central de Rankings
        </h1>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Escolha um nicho e navegue pelas subcategorias para encontrar os melhores produtos testados e avaliados.
        </p>
      </div>

      <div className="space-y-4">
        {CATEGORIAS.map((cat) => {
          const isOpen = gavetaAberta === cat.id;

          return (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              {/* Botão de abrir/fechar a gaveta */}
              <button
                onClick={() => toggleGaveta(cat.id)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl p-3 bg-slate-100 rounded-2xl">{cat.icone}</span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{cat.titulo}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{cat.descricao}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400">
                    {cat.subtemas.length} subcategorias
                  </span>
                  <span
                    className={`text-xs text-slate-400 font-bold transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {/* Conteúdo Expansível (Subcategorias) */}
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.subtemas.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/rankings/${sub.slug}`}
                      className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition text-sm">
                          {sub.nome}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {sub.descricao}
                        </p>
                      </div>
                      <span className="text-blue-600 font-bold group-hover:translate-x-1 transition text-sm shrink-0 ml-3">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}