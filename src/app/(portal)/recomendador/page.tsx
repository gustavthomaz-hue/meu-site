"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, RotateCcw, ShoppingCart, MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Opcao {
  texto: string;
}

interface Pergunta {
  id: number;
  titulo: string;
  opcoes: Opcao[];
}

export default function RecomendadorPage() {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<any>(null);

  // Carrega as perguntas salvas no Supabase
  useEffect(() => {
    async function carregarPerguntas() {
      setLoadingInitial(true);
      const { data } = await supabase
        .from("configuracoes")
        .select("valor")
        .eq("chave", "quiz_perguntas")
        .single();

      if (data?.valor) {
        try {
          const parsed = typeof data.valor === "string" ? JSON.parse(data.valor) : data.valor;
          setPerguntas(parsed);
        } catch (e) {
          console.error("Erro ao converter JSON das perguntas:", e);
        }
      }
      setLoadingInitial(false);
    }

    carregarPerguntas();
  }, []);

  const handleSelect = (perguntaTitulo: string, respostaTexto: string) => {
    const novasRespostas = { ...respostas, [perguntaTitulo]: respostaTexto };
    setRespostas(novasRespostas);

    if (step < perguntas.length) {
      setStep(step + 1);
    } else {
      enviarParaIA(novasRespostas);
    }
  };

  const enviarParaIA = async (dados: Record<string, string>) => {
    setLoading(true);
    setStep(perguntas.length + 1); // Exibe a tela de resultado/loading

    try {
      const res = await fetch("/api/recomendador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const data = await res.json();
      if (data.sucesso) {
        setResultado(data.recomendacao);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reiniciar = () => {
    setStep(1);
    setResultado(null);
    setRespostas({});
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <p className="text-sm font-medium text-slate-600">Carregando perguntas...</p>
      </div>
    );
  }

  if (perguntas.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <p className="text-sm font-medium text-slate-600">Nenhuma pergunta configurada no momento.</p>
      </div>
    );
  }

  const perguntaAtual = perguntas[step - 1];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      {/* Header Badge */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        IA Recomendadora
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center tracking-tight">
        Encontre a Impressora 3D Ideal
      </h1>
      <p className="text-slate-500 text-center text-sm sm:text-base mt-2 mb-8">
        Responda às perguntas abaixo para receber a indicação técnica perfeita.
      </p>

      {/* Card Principal */}
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        {step <= perguntas.length && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Passo {step} de {perguntas.length}
            </span>
            <h2 className="text-xl font-bold text-slate-900">{perguntaAtual.titulo}</h2>
            <div className="grid gap-3 pt-2">
              {perguntaAtual.opcoes.map((opcao, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(perguntaAtual.titulo, opcao.texto)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 font-medium text-slate-700 transition"
                >
                  {opcao.texto}
                </button>
              ))}
            </div>
          </div>
        )}

        {step > perguntas.length && (
          <div className="space-y-6 text-center">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-sm font-medium text-slate-600">
                  A IA está analisando as melhores opções para você...
                </p>
              </div>
            ) : (
              <>
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Combinação Perfeita Encontrada
                </div>

                {/* Bloco de Resultado Preenchido */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {resultado?.imagem && (
                      <img
                        src={resultado.imagem}
                        alt={resultado.nome}
                        className="w-28 h-28 object-cover rounded-xl border border-slate-200 shrink-0"
                      />
                    )}
                    <div>
                      <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                        {resultado?.tipo || "Recomendação Especial"}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900">{resultado?.nome}</h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {resultado?.justificativa}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-3 pt-2">
                  <a
                    href={resultado?.linkCompra || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3.5 px-4 rounded-xl transition shadow-sm text-sm uppercase tracking-wide"
                  >
                    <ShoppingCart className="w-4 h-4" /> Ver Preço e Comprar no Mercado Livre
                  </a>

                  <a
                    href={resultado?.linkWhatsapp || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-sm text-sm uppercase tracking-wide"
                  >
                    <MessageCircle className="w-4 h-4" /> Entrar no Canal de Ofertas no WhatsApp
                  </a>

                  <button
                    onClick={reiniciar}
                    className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 transition mt-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Refazer o teste
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}