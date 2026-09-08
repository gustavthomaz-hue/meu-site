'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Noticia {
  id: string;
  titulo: string;
  categoria: string;
  resumo: string;
  conteudo: string;
  imagem_url: string;
  created_at: string;
}

export default function DetalheNoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarNoticia() {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .single();

      if (!error && data) {
        setNoticia(data);
      }
      setCarregando(false);
    }

    buscarNoticia();
  }, [resolvedParams.slug]);

  if (carregando) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">Carregando notícia...</div>;
  }

  if (!noticia) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Notícia não encontrada</h1>
        <Link href="/noticias" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Voltar para Notícias
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/noticias" className="text-sm text-blue-600 hover:underline font-medium mb-6 inline-block">
        ← Voltar para Notícias
      </Link>

      <div className="mb-6">
        <span className="text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md">
          {noticia.categoria}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">{noticia.titulo}</h1>
        <p className="text-slate-500 text-sm mt-2">
          Publicado em {new Date(noticia.created_at).toLocaleDateString('pt-BR')}
        </p>
      </div>

      {noticia.imagem_url && (
        <div className="mb-8 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
          <img src={noticia.imagem_url} alt={noticia.titulo} className="w-full max-h-[450px] object-cover" />
        </div>
      )}

      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
        {noticia.conteudo}
      </div>
    </article>
  );
}