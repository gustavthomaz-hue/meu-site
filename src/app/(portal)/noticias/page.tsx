'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Noticia {
  id: string;
  titulo: string;
  categoria: string;
  resumo: string;
  imagem_url: string;
  slug: string;
  tempo_leitura: string;
  created_at?: string;
}

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarNoticias() {
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('publicado', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setNoticias(data);
      }
      setCarregando(false);
    }

    buscarNoticias();
  }, []);

  if (carregando) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Carregando notícias do Supabase...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Notícias & Tendências</h1>
        <p className="text-slate-600 mt-2">
          Fique por dentro das últimas atualizações sobre impressão 3D e tecnologia.
        </p>
      </div>

      {noticias.length === 0 ? (
        <div className="text-slate-500 py-12 text-center">
          Nenhuma notícia encontrada no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {noticias.map((item) => (
            <Link
              key={item.id}
              href={`/noticias/${item.slug}`}
              className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                {item.imagem_url ? (
                  <img
                    src={item.imagem_url}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    Sem imagem
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span className="text-blue-600 uppercase tracking-wider">{item.categoria}</span>
                  <span>{item.tempo_leitura || '3 min de leitura'}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.titulo}
                </h2>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">{item.resumo}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}