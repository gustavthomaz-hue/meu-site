import Link from 'next/link';
import { 
  Sparkles, 
  Swords, 
  Trophy, 
  ArrowRight, 
  ChevronDown, 
  Shield, 
  Newspaper,
  CheckCircle2,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import WhatsappBanner from '@/components/WhatsappBanner';

// Garante que o Next.js busque dados atualizados do Supabase sem cache estático
export const revalidate = 0;

export default async function Home() {
  // 1. Busca o duelo em destaque diretamente no Supabase
  const { data: duelos } = await supabase
    .from('duelos')
    .select(`
      *,
      produto1:produtos!duelos_produto1_id_fkey(*),
      produto2:produtos!duelos_produto2_id_fkey(*)
    `)
    .limit(1);

  const dueloDestaque = duelos && duelos.length > 0 ? duelos[0] : null;

  // Lista de Filamentos (dados mantidos do seu código original)
  const filamentosTop = [
    {
      posicao: 1,
      nome: 'PLA Premium Sunlu 1kg',
      descricao: 'Excelente tolerância dimensional (+/- 0.02mm), baixa deformação e ótimo brilho final.',
      preco: 'R$ 119,90',
      nota: 4.9,
      destaque: 'Melhor Custo-Benefício',
      imagem: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80',
      link: '#'
    },
    {
      posicao: 2,
      nome: 'PLA High Speed eSUN 1kg',
      descricao: 'Ideal para impressoras de alta velocidade (como Bambu e K1). Fluidez impecável.',
      preco: 'R$ 139,90',
      nota: 4.8,
      destaque: 'Alta Velocidade',
      imagem: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80',
      link: '#'
    },
    {
      posicao: 3,
      nome: 'PLA Basic Creality 1kg',
      descricao: 'Fácil de imprimir, excelente aderência na mesa e ótimo para iniciantes.',
      preco: 'R$ 99,90',
      nota: 4.7,
      destaque: 'Mais Vendido',
      imagem: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80',
      link: '#'
    }
  ];

  // Perguntas Frequentes (dados mantidos do seu código original)
  const faqs = [
    {
      pergunta: "Como funcionam as comparações e duelos?",
      resposta: "Analisamos especificações técnicas, testes práticos da comunidade, facilidade de uso, disponibilidade de peças no Brasil e custo-benefício para dar um parecer neutro e direto."
    },
    {
      pergunta: "Os links de compra são confiáveis?",
      resposta: "Sim! Indicamos apenas lojas oficiais ou vendedores com reputação verificada em grandes plataformas como Shopee, Mercado Livre e Amazon."
    },
    {
      pergunta: "Como funciona o Recomendador Inteligente?",
      resposta: "Você responde a poucas perguntas sobre seu orçamento, nível de experiência e tipo de projeto, e nosso algoritmo indica os modelos mais adequados para o seu perfil."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* 1. CABEÇALHO / NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-sm">
              H
            </div>
            <span>Hyper Util</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Impressão 3D
            </Link>
            <Link href="/recomendador" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Recomendador</span>
            </Link>
            <Link href="/noticias" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Newspaper className="w-4 h-4" />
              <span>Notícias</span>
            </Link>
          </nav>

          <Link
            href="/recomendador"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Descobrir impressora ideal
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        
        {/* 2. BANNER PRINCIPAL (HERO) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Decisões de compra sem achismo</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Compare, escolha e compre a impressora 3D certa
            </h1>

            <p className="text-slate-600 text-base leading-relaxed max-w-xl">
              Duelos lado a lado, rankings de insumos e um recomendador inteligente. Tudo com prós, contras e as melhores ofertas das principais lojas.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/recomendador"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                Descobrir minha impressora ideal
              </Link>

              <Link
                href="/duelos"
                className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 transition-colors"
              >
                Ver comparativos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* CARD DE DUELO EM DESTAQUE (DINÂMICO COM SUPABASE) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
              <Swords className="w-4 h-4" />
              <span>Duelo em destaque</span>
            </div>

            {dueloDestaque ? (
              <>
                <div className="grid grid-cols-2 gap-4 relative items-center">
                  {/* Produto 1 */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-2">
                    <div className="w-20 h-20 mx-auto bg-slate-100 rounded-xl flex items-center justify-center p-2">
                      <img 
                        src={dueloDestaque.produto1?.imagem_url || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300"} 
                        alt={dueloDestaque.produto1?.nome} 
                        className="max-h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-slate-400">{dueloDestaque.produto1?.marca}</p>
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{dueloDestaque.produto1?.nome}</h4>
                    <p className="text-xs text-amber-500 font-bold">★ {dueloDestaque.produto1?.avaliacao || "4.6"}</p>
                  </div>

                  {/* Divisor VS */}
                  <div className="absolute left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-white z-10">
                    VS
                  </div>

                  {/* Produto 2 */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-2">
                    <div className="w-20 h-20 mx-auto bg-slate-100 rounded-xl flex items-center justify-center p-2">
                      <img 
                        src={dueloDestaque.produto2?.imagem_url || "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300"} 
                        alt={dueloDestaque.produto2?.nome} 
                        className="max-h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-slate-400">{dueloDestaque.produto2?.marca}</p>
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{dueloDestaque.produto2?.nome}</h4>
                    <p className="text-xs text-amber-500 font-bold">★ {dueloDestaque.produto2?.avaliacao || "4.8"}</p>
                  </div>
                </div>

                <Link
                  href="/duelos"
                  className="w-full block text-center py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Ver duelo completo →
                </Link>
              </>
            ) : (
              <div className="text-center py-10 space-y-2">
                <p className="text-slate-500 text-sm font-medium">Nenhum duelo cadastrado ainda.</p>
                <p className="text-slate-400 text-xs">Adicione duelos no Supabase para exibir aqui.</p>
              </div>
            )}
          </div>
        </section>

        {/* 3. CARDS DE NAVEGAÇÃO RÁPIDA */}
        <section id="duelos-secao" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/duelos"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-sm group space-y-3"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
              Duelos de Impressoras
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Comparativos técnicos lado a lado com prós e contras detalhados.
            </p>
          </Link>

          <Link
            href="/rankings"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-sm group space-y-3"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
              Rankings de Insumos
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Os melhores filamentos, aerógrafos e ferramentas testados.
            </p>
          </Link>

          <Link
            href="/recomendador"
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-sm group space-y-3"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
              Recomendador
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Responda poucas perguntas e receba a indicação ideal para seu perfil.
            </p>
          </Link>
        </section>

        {/* 4. SEÇÃO: RANKING DE FILAMENTOS PLA */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <Trophy className="w-4 h-4" />
                <span>Guia de Insumos</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Melhores Filamentos PLA Recomendados
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Testados e aprovados pela comunidade quanto à facilidade de impressão, resistência e tolerância dimensional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filamentosTop.map((item) => (
              <div key={item.posicao} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:border-blue-200 transition-all">
                <div>
                  <div className="relative h-48 bg-slate-100 p-4 flex items-center justify-center">
                    <span className="absolute top-3 left-3 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      #{item.posicao}
                    </span>
                    <span className="absolute top-3 right-3 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {item.destaque}
                    </span>
                    <img 
                      src={item.imagem} 
                      alt={item.nome}
                      className="max-h-full object-contain mix-blend-multiply" 
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 text-base">{item.nome}</h3>
                      <span className="text-xs font-bold text-amber-500">★ {item.nota}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.descricao}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-50 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">A partir de</span>
                    <span className="text-sm font-bold text-slate-900">{item.preco}</span>
                  </div>
                  <a 
                    href={item.link} 
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>Ver Ofertas</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. NOTÍCIAS */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                Notícias & Tendências
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Fique por dentro do mundo da impressão 3D
              </h2>
            </div>
            <Link href="/noticias" className="text-xs font-bold text-blue-600 hover:underline">
              Todas as notícias →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/noticias" className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-40 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                Imagem da Notícia
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Lançamentos</span>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  Bambu Lab expande linha de entrada com foco em silêncio
                </h4>
              </div>
            </Link>

            <Link href="/noticias" className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-40 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                Imagem da Notícia
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Guia de Materiais</span>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  PLA ou PETG? O guia direto para escolher o filamento certo
                </h4>
              </div>
            </Link>

            <Link href="/noticias" className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-40 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                Imagem da Notícia
              </div>
              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Tendências</span>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  Impressão multicolor deixa de ser luxo em 2026
                </h4>
              </div>
            </Link>
          </div>
        </section>

        {/* 6. SEÇÃO: FAQ (PERGUNTAS FREQUENTES) */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Tire suas dúvidas</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Perguntas Frequentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-sm text-slate-800">{faq.pergunta}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.resposta}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. CANAL WHATSAPP */}
        <WhatsappBanner />

      </main>

      {/* 8. RODAPÉ COMPLETO COM AVISO DE AFILIADOS */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-md flex items-center justify-center text-xs font-black">
                H
              </div>
              <span>Hyper Util</span>
            </div>
            <p className="leading-relaxed">
              Comparativos, rankings e recomendações de tecnologia para você decidir com confiança.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-700 uppercase">Conteúdo</h5>
            <ul className="space-y-1">
              <li><Link href="/" className="hover:underline">Impressoras 3D</Link></li>
              <li><Link href="/rankings" className="hover:underline">Insumos & Acessórios</Link></li>
              <li><Link href="/recomendador" className="hover:underline">Recomendador</Link></li>
              <li><Link href="/noticias" className="hover:underline">Notícias</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-slate-700 uppercase">Aviso de Afiliados</h5>
            <p className="leading-relaxed text-[11px] text-slate-400">
              O Hyper Util é um portal independente. Ao comprar através dos nossos links, podemos receber uma comissão sem custo adicional para você. Isso nos ajuda a manter o projeto ativo e isento.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-100 text-center">
          © 2026 HyperUtil. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}