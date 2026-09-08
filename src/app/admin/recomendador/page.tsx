"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  Settings, 
  Plus, 
  Save, 
  BarChart3, 
  Sliders,
  Trash2
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Opcao {
  texto: string;
}

interface Pergunta {
  id: number;
  titulo: string;
  opcoes: Opcao[];
}

const PERGUNTAS_PADRAO: Pergunta[] = [
  {
    id: 1,
    titulo: "Qual é o seu nível de experiência com impressão 3D?",
    opcoes: [{ texto: "Iniciante" }, { texto: "Intermediário" }, { texto: "Avançado" }],
  },
  {
    id: 2,
    titulo: "Qual o seu objetivo principal de uso?",
    opcoes: [
      { texto: "Hobby" },
      { texto: "Miniaturas" },
      { texto: "Peças Funcionais" },
      { texto: "Produção Comercial" },
    ],
  },
  {
    id: 3,
    titulo: "Qual é a sua faixa de orçamento?",
    opcoes: [
      { texto: "Até R$ 2.000" },
      { texto: "R$ 2.000 a R$ 5.000" },
      { texto: "Acima de R$ 5.000" },
    ],
  },
];

export default function AdminRecomendadorPage() {
  const [systemPrompt, setSystemPrompt] = useState(
    "Você é um especialista em impressoras 3D. Analise as respostas do usuário e escolha a impressora ideal do nosso banco de dados, explicando o porquê de forma simples e objetiva."
  );

  const [perguntas, setPerguntas] = useState<Pergunta[]>(PERGUNTAS_PADRAO);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Estados do Modal / Formulário para nova pergunta
  const [exibirForm, setExibirForm] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [opcoesTxt, setOpcoesTxt] = useState("");

  // 1. Carregar dados do Supabase ao abrir a página
  const carregarDados = async () => {
    setLoading(true);

    // Buscar Prompt do Sistema
    const { data: promptData } = await supabase
      .from("configuracoes")
      .select("valor")
      .eq("chave", "quiz_system_prompt")
      .single();

    if (promptData?.valor) {
      setSystemPrompt(promptData.valor);
    }

    // Buscar Perguntas
    const { data: quizData } = await supabase
      .from("configuracoes")
      .select("valor")
      .eq("chave", "quiz_perguntas")
      .single();

    if (quizData?.valor) {
      try {
        const parsed = typeof quizData.valor === "string" ? JSON.parse(quizData.valor) : quizData.valor;
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPerguntas(parsed);
        }
      } catch (e) {
        console.error("Erro ao converter JSON:", e);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // 2. Salvar Prompt e Perguntas no Supabase
  const handleSalvarConfiguracoes = async () => {
    setSalvando(true);

    const { error: errorPrompt } = await supabase.from("configuracoes").upsert(
      { chave: "quiz_system_prompt", valor: systemPrompt },
      { onConflict: "chave" }
    );

    const { error: errorPerguntas } = await supabase.from("configuracoes").upsert(
      { chave: "quiz_perguntas", valor: JSON.stringify(perguntas) },
      { onConflict: "chave" }
    );

    setSalvando(false);

    if (errorPrompt || errorPerguntas) {
      alert("Erro ao salvar no Supabase: " + (errorPrompt?.message || errorPerguntas?.message));
    } else {
      alert("Configurações do Quiz salvas com sucesso no Supabase!");
    }
  };

  // 3. Adicionar Nova Pergunta à lista
  const handleAdicionarPergunta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTitulo.trim()) return;

    const listaOpcoes = opcoesTxt
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((texto) => ({ texto: texto.trim() }));

    const novaPergunta: Pergunta = {
      id: Date.now(),
      titulo: novoTitulo,
      opcoes: listaOpcoes.length > 0 ? listaOpcoes : [{ texto: "Opção 1" }, { texto: "Opção 2" }],
    };

    const listaAtualizada = [...perguntas, novaPergunta];
    setPerguntas(listaAtualizada);
    setNovoTitulo("");
    setOpcoesTxt("");
    setExibirForm(false);
  };

  // 4. Remover Pergunta da lista
  const handleExcluirPergunta = (id: number) => {
    if (!confirm("Deseja excluir esta pergunta?")) return;
    const listaAtualizada = perguntas.filter((p) => p.id !== id);
    setPerguntas(listaAtualizada);
  };

  return (
    <div className="p-6 space-y-8 bg-slate-950 min-h-screen text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Gerenciador do Quiz Recomendador
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ajuste o comportamento da IA, perguntas do Quiz e veja as métricas de conversão.
          </p>
        </div>
        <button
          onClick={handleSalvarConfiguracoes}
          disabled={salvando}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {salvando ? "Salvando..." : "Salvar Configurações"}
        </button>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium uppercase">Recomendações Geradas</div>
          <div className="text-2xl font-bold text-white mt-1">1,248</div>
          <span className="text-xs text-emerald-400 mt-2 block">+18% este mês</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium uppercase">Perfil Mais Comum</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">Iniciante / FDM</div>
          <span className="text-xs text-slate-400 mt-2 block">45% das respostas</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-medium uppercase">Mais Recomendada</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">Bambu Lab A1</div>
          <span className="text-xs text-slate-400 mt-2 block">312 indicações</span>
        </div>
      </div>

      {/* Configuração da IA */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
          <Sliders className="w-5 h-5 text-purple-400" /> Prompt Base do Sistema (IA Engine)
        </h2>
        <p className="text-xs text-slate-400">
          Este prompt orienta como o modelo Groq / Gemini interpreta os dados e formula as explicações.
        </p>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={4}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Perguntas do Quiz */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
            <HelpCircle className="w-5 h-5 text-purple-400" /> Perguntas Ativas no Quiz
          </h2>
          <button
            onClick={() => setExibirForm(!exibirForm)}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-500/20 transition"
          >
            <Plus className="w-4 h-4" /> {exibirForm ? "Fechar Form" : "Nova Pergunta"}
          </button>
        </div>

        {/* Form para adicionar nova pergunta */}
        {exibirForm && (
          <form onSubmit={handleAdicionarPergunta} className="bg-slate-950 border border-purple-500/30 p-4 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-purple-300">Criar Pergunta</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Título da Pergunta</label>
              <input
                type="text"
                required
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                placeholder="Ex: Qual o tamanho das peças que pretende imprimir?"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Opções de Resposta (uma por linha)</label>
              <textarea
                rows={3}
                value={opcoesTxt}
                onChange={(e) => setOpcoesTxt(e.target.value)}
                placeholder={"Pequenas (até 15cm)\nMédias (até 25cm)\nGrandes (acima de 30cm)"}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition"
            >
              Confirmar Pergunta
            </button>
          </form>
        )}

        {/* Lista Dinâmica de Perguntas */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-xs text-slate-500">Carregando perguntas...</p>
          ) : perguntas.length === 0 ? (
            <p className="text-xs text-slate-500">Nenhuma pergunta cadastrada. Clique em "Nova Pergunta" para adicionar.</p>
          ) : (
            perguntas.map((p, index) => (
              <div
                key={p.id || index}
                className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between"
              >
                <div>
                  <span className="text-xs text-purple-400 font-mono font-bold">Passo {index + 1}</span>
                  <p className="font-medium text-slate-200 mt-0.5">{p.titulo}</p>
                  <span className="text-xs text-slate-500">
                    {p.opcoes?.length || 0} Opções: {p.opcoes?.map((o) => o.texto).join(", ")}
                  </span>
                </div>
                <button
                  onClick={() => handleExcluirPergunta(p.id)}
                  className="text-slate-500 hover:text-red-400 p-1 transition"
                  title="Excluir Pergunta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}