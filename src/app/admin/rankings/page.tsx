'use client';

import { useState } from 'react';

export default function RankingsAdminPage() {
  const [subcategoria, setSubcategoria] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  const handleGerarRanking = async () => {
    if (!subcategoria) return;
    setLoading(true);
    setResultado(null);

    try {
      const res = await fetch('/api/rankings/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subcategoria }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }

      setResultado(data);
      alert('Ranking gerado e salvo no Supabase com sucesso!');
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          🏆 Gerador de Rankings Interno (IA)
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          A IA vai analisar os produtos cadastrados no seu banco para esta subcategoria e montar o ranking com notas automaticamente.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            NOME EXATO DA SUBCATEGORIA (Como está no banco)
          </label>
          <input
            type="text"
            value={subcategoria}
            onChange={(e) => setSubcategoria(e.target.value)}
            placeholder="Ex: FDM"
            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button
          onClick={handleGerarRanking}
          disabled={loading || !subcategoria}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium p-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? '🤖 Avaliando produtos no banco e gerando ranking...' : '⚡ Processar Embate e Salvar Ranking'}
        </button>
      </div>

      {resultado && resultado.ranking && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-emerald-500 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            ✅ Ranking Atualizado!
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            <strong>Resumo da IA:</strong> {resultado.ranking.introducao_embate}
          </p>
          <p className="text-sm text-emerald-600 font-medium">
            Foram avaliados {resultado.total_produtos_avaliados} produtos cadastrados. Tudo já está salvo no banco!
          </p>
        </div>
      )}
    </div>
  );
}