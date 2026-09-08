import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, X, Star, ExternalLink, Swords } from 'lucide-react';

export const revalidate = 0;

interface Props {
  params: {
    slug: string;
  };
}

export default async function DueloPage({ params }: Props) {
  const { slug } = params;

  // Buscar duelo no Supabase pelo slug
  const { data: duelo } = await supabase
    .from('duelos')
    .select(`
      *,
      produto1:produtos!duelos_produto1_id_fkey(*),
      produto2:produtos!duelos_produto2_id_fkey(*)
    `)
    .eq('slug', slug)
    .single();

  if (!duelo) {
    notFound();
  }

  const { produto1, produto2 } = duelo;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-16">
      {/* Topo / Voltar */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>
          <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1.5">
            <Swords className="h-3.5 w-3.5" />
            Comparativo Técnico
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-10">
        {/* Cabeçalho do Duelo */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {duelo.titulo || `${produto1?.nome} vs ${produto2?.nome}`}
          </h1>
          {duelo.descricao && (
            <p className="text-slate-600 text-sm leading-relaxed">{duelo.descricao}</p>
          )}
        </div>

        {/* Grid Lado a Lado dos Produtos */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Card Produto 1 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="h-48 flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <img 
                  src={produto1?.imagem_url || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400"} 
                  alt={produto1?.nome} 
                  className="max-h-full object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{produto1?.marca}</span>
              <h2 className="text-xl font-bold text-slate-900">{produto1?.nome}</h2>
              <div className="flex items-center justify-center gap-1 text-amber-500 text-sm font-bold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{produto1?.avaliacao || "4.8"}</span>
                <span className="text-slate-400 text-xs font-normal">({produto1?.total_avaliacoes || 0} avaliações)</span>
              </div>
            </div>

            {/* Prós e Contras Produto 1 */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {duelo.pros_produto1 && duelo.pros_produto1.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Pontos Fortes</h3>
                  <ul className="space-y-2">
                    {duelo.pros_produto1.map((pro: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {duelo.contras_produto1 && duelo.contras_produto1.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Pontos a Considerar</h3>
                  <ul className="space-y-2">
                    {duelo.contras_produto1.map((contra: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{contra}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Oferta / Botão */}
            {produto1?.link_afiliado && (
              <a 
                href={produto1.link_afiliado}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/10"
              >
                Ver melhor oferta no vendedor
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* Card Produto 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="h-48 flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <img 
                  src={produto2?.imagem_url || "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400"} 
                  alt={produto2?.nome} 
                  className="max-h-full object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{produto2?.marca}</span>
              <h2 className="text-xl font-bold text-slate-900">{produto2?.nome}</h2>
              <div className="flex items-center justify-center gap-1 text-amber-500 text-sm font-bold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{produto2?.avaliacao || "4.7"}</span>
                <span className="text-slate-400 text-xs font-normal">({produto2?.total_avaliacoes || 0} avaliações)</span>
              </div>
            </div>

            {/* Prós e Contras Produto 2 */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {duelo.pros_produto2 && duelo.pros_produto2.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Pontos Fortes</h3>
                  <ul className="space-y-2">
                    {duelo.pros_produto2.map((pro: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {duelo.contras_produto2 && duelo.contras_produto2.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Pontos a Considerar</h3>
                  <ul className="space-y-2">
                    {duelo.contras_produto2.map((contra: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{contra}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Oferta / Botão */}
            {produto2?.link_afiliado && (
              <a 
                href={produto2.link_afiliado}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/10"
              >
                Ver melhor oferta no vendedor
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

        </div>

        {/* Seção Veredito do Especialista */}
        {duelo.veredito && (
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Swords className="h-4 w-4" />
              <span>Veredito do HyperUtil</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{duelo.veredito}</p>
          </div>
        )}
      </main>
    </div>
  );
}