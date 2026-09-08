"use client";

import React from "react";
import { 
  Swords, 
  Check, 
  X, 
  ShoppingCart, 
  MessageCircle, 
  Sparkles, 
  Trophy
} from "lucide-react";
import { useWhatsappLink } from "@/hooks/useWhatsappLink";

// Exemplo de comparativo estruturado (posteriormente será dinâmico via Supabase/API)
const comparativoAtual = {
  produtoA: {
    nome: "Bambu Lab A1 Mini",
    categoria: "FDM / Entrada",
    preco: "R$ 2.490",
    imagem: "https://m.media-amazon.com/images/I/61S1k2xAn-L._AC_SL1500_.jpg",
    linkAfiliado: "https://mercadolivre.com.br",
    pros: ["Auto-nivelamento perfeito", "Silenciosa", "Troca rápida de bicos", "App e ecossistema excelentes"],
    contras: ["Área de impressão menor (180x180mm)", "Não suporta filamentos de alta temp."],
    specs: {
      volume: "180 x 180 x 180 mm",
      velocidade: "Até 500 mm/s",
      temperatura: "Até 300 ºC",
      nivelamento: "100% Automático (Sensor de força)",
      conectividade: "Wi-Fi / App Bambu Handy"
    }
  },
  produtoB: {
    nome: "Creality Ender 3 V3 SE",
    categoria: "FDM / Entrada",
    preco: "R$ 1.690",
    imagem: "https://m.media-amazon.com/images/I/61Nbf9fS5-L._AC_SL1500_.jpg",
    linkAfiliado: "https://mercadolivre.com.br",
    pros: ["Preço mais acessível", "Volume de impressão padrão (220x220mm)", "Fácil montagem"],
    contras: ["Nível de ruído superior", "Sem conectividade Wi-Fi nativa", "Velocidade inferior"],
    specs: {
      volume: "220 x 220 x 250 mm",
      velocidade: "Até 250 mm/s",
      temperatura: "Até 260 ºC",
      nivelamento: "Automático (CR-Touch)",
      conectividade: "Cartão SD / USB"
    }
  },
  vereditoIA: {
    vencedor: "Bambu Lab A1 Mini",
    motivo: "Se o seu foco for facilidade de uso, calibração automática perfeita e alta velocidade com zero dor de cabeça, a Bambu Lab A1 Mini vale cada centavo extra. Já a Ender 3 V3 SE é a melhor escolha se você busca o menor preço com um volume de impressão ligeiramente maior."
  }
};

export default function DueloSlugPage({ params }: { params: { slug: string } }) {
  // Busca dinamicamente o link atualizado do WhatsApp via hook do Supabase
  const whatsappLink = useWhatsappLink();
  const { produtoA, produtoB, vereditoIA } = comparativoAtual;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 flex flex-col items-center">
      {/* Badge Superior */}
      <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-600 px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
        <Swords className="w-4 h-4 text-purple-600" />
        Duelo Técnico de Impressoras 3D
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center tracking-tight">
        {produtoA.nome} <span className="text-purple-600">vs</span> {produtoB.nome}
      </h1>
      <p className="text-slate-500 text-center text-sm sm:text-base mt-2 mb-10 max-w-xl">
        Análise detalhada de especificações, prós, contras e recomendação técnica com inteligência artificial.
      </p>

      {/* Grid de Produtos Lado a Lado */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Produto A */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="relative w-full h-56 bg-slate-100 rounded-2xl mb-5 overflow-hidden flex items-center justify-center p-4">
              <img 
                src={produtoA.imagem} 
                alt={produtoA.nome} 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{produtoA.categoria}</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{produtoA.nome}</h2>
            <div className="text-2xl font-extrabold text-emerald-600 mt-2 mb-6">{produtoA.preco}</div>

            {/* Prós e Contras */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" /> Pontos Fortes
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {produtoA.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1">
                  <X className="w-4 h-4 text-rose-600" /> Pontos Fracos
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {produtoA.contras.map((contra, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span> {contra}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Botão de Afiliado */}
          <a
            href={produtoA.linkAfiliado}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3.5 px-4 rounded-xl transition text-xs sm:text-sm uppercase tracking-wide shadow-sm mt-4"
          >
            <ShoppingCart className="w-4 h-4" /> Comprar {produtoA.nome}
          </a>
        </div>

        {/* Produto B */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="relative w-full h-56 bg-slate-100 rounded-2xl mb-5 overflow-hidden flex items-center justify-center p-4">
              <img 
                src={produtoB.imagem} 
                alt={produtoB.nome} 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{produtoB.categoria}</span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{produtoB.nome}</h2>
            <div className="text-2xl font-extrabold text-emerald-600 mt-2 mb-6">{produtoB.preco}</div>

            {/* Prós e Contras */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" /> Pontos Fortes
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {produtoB.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2 flex items-center gap-1">
                  <X className="w-4 h-4 text-rose-600" /> Pontos Fracos
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {produtoB.contras.map((contra, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span> {contra}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Botão de Afiliado */}
          <a
            href={produtoB.linkAfiliado}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3.5 px-4 rounded-xl transition text-xs sm:text-sm uppercase tracking-wide shadow-sm mt-4"
          >
            <ShoppingCart className="w-4 h-4" /> Comprar {produtoB.nome}
          </a>
        </div>

      </div>

      {/* Tabela de Especificações Lado a Lado */}
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Tabela Comparativa de Especificações</h3>
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-2">Especificação</th>
              <th className="py-3 px-2 text-purple-700 font-bold">{produtoA.nome}</th>
              <th className="py-3 px-2 text-purple-700 font-bold">{produtoB.nome}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            <tr>
              <td className="py-3 px-2 font-medium text-slate-500">Volume de Impressão</td>
              <td className="py-3 px-2 font-semibold">{produtoA.specs.volume}</td>
              <td className="py-3 px-2 font-semibold">{produtoB.specs.volume}</td>
            </tr>
            <tr>
              <td className="py-3 px-2 font-medium text-slate-500">Velocidade Máxima</td>
              <td className="py-3 px-2 font-semibold">{produtoA.specs.velocidade}</td>
              <td className="py-3 px-2 font-semibold">{produtoB.specs.velocidade}</td>
            </tr>
            <tr>
              <td className="py-3 px-2 font-medium text-slate-500">Temperatura do Bico</td>
              <td className="py-3 px-2 font-semibold">{produtoA.specs.temperatura}</td>
              <td className="py-3 px-2 font-semibold">{produtoB.specs.temperatura}</td>
            </tr>
            <tr>
              <td className="py-3 px-2 font-medium text-slate-500">Nivelamento</td>
              <td className="py-3 px-2 font-semibold">{produtoA.specs.nivelamento}</td>
              <td className="py-3 px-2 font-semibold">{produtoB.specs.nivelamento}</td>
            </tr>
            <tr>
              <td className="py-3 px-2 font-medium text-slate-500">Conectividade</td>
              <td className="py-3 px-2 font-semibold">{produtoA.specs.conectividade}</td>
              <td className="py-3 px-2 font-semibold">{produtoB.specs.conectividade}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Veredito da IA & WhatsApp Banner */}
      <div className="w-full max-w-5xl bg-gradient-to-br from-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-purple-400" /> Veredito da IA Recomendadora
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-amber-400" /> Melhor Custo-Benefício: {vereditoIA.vencedor}
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {vereditoIA.motivo}
          </p>
        </div>

        {/* CTA Canal WhatsApp */}
        <div className="pt-4 border-t border-purple-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm font-bold text-purple-200">Quer receber alertas de promoções dessas impressoras?</p>
            <p className="text-xs text-slate-400">Entre no nosso grupo exclusivo e receba cupom em primeira mão.</p>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-6 rounded-xl transition text-xs sm:text-sm uppercase tracking-wide shrink-0"
          >
            <MessageCircle className="w-4 h-4" /> Entrar no Canal de Ofertas
          </a>
        </div>
      </div>

    </div>
  );
}