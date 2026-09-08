'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Noticia {
  id?: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  imagemUrl: string;
  publicado: boolean;
  tempoLeitura?: string;
}

interface ConfigAutomacao {
  ativo: boolean;
  frequencia_horas: number;
  horario_execucao: string;
  categoria_padrao: string;
}

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // Estados da Automação
  const [config, setConfig] = useState<ConfigAutomacao>({
    ativo: true,
    frequencia_horas: 24,
    horario_execucao: '08:00',
    categoria_padrao: 'Impressão 3D',
  });
  const [salvandoConfig, setSalvandoConfig] = useState(false);

  // Estados de geração assistida por IA no Admin
  const [temaIA, setTemaIA] = useState('DJI Mini 4 Pro');
  const [gerandoIA, setGerandoIA] = useState(false);
  const [erroIA, setErroIA] = useState<string | null>(null);

  // Form principal do produto/notícia
  const [form, setForm] = useState<Noticia>({
    titulo: '',
    resumo: '',
    conteudo: '',
    categoria: 'Lançamentos',
    imagemUrl: '',
    publicado: true,
    tempoLeitura: '3 min de leitura',
  });

  const carregarDados = async () => {
    // Carrega notícias salvas
    const { data: newsData } = await supabase
      .from('noticias')
      .select('*')
      .order('created_at', { ascending: false });

    if (newsData) {
      setNoticias(
        newsData.map((item: any) => ({
          id: item.id,
          titulo: item.titulo || '',
          resumo: item.resumo || '',
          conteudo: item.conteudo || '',
          categoria: item.categoria || 'Lançamentos',
          imagemUrl: item.imagem_url || item.imagemUrl || '',
          publicado: item.publicado ?? true,
          tempoLeitura: item.tempo_leitura || '3 min de leitura',
        }))
      );
    }

    // Carrega configurações de automação
    const { data: configData } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'automacao_noticias')
      .single();

    if (configData?.valor) {
      setConfig(configData.valor as ConfigAutomacao);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gerar Notícia por IA Manualmente e Atualizar Lista
  async function handleGerarNoticiaIA() {
    if (!temaIA.trim()) return;

    setGerandoIA(true);
    setErroIA(null);

    try {
      const res = await fetch('/api/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produto: temaIA,
          categoria: form.categoria || 'Geral',
          detalhes: 'Gere uma análise técnica completa com especificações e opinião.',
        }),
      });

      const result = await res.json();

      if (res.ok && result.success && result.data) {
        setForm((prev) => ({
          ...prev,
          titulo: `Análise e Novidades: ${result.data.produto}`,
          resumo: `Confira as principais especificações e recursos do ${result.data.produto}.`,
          conteudo: result.data.conteudo || '',
          imagemUrl: result.data.imagemUrl || '',
        }));
        
        // Recarrega as matérias cadastradas no Supabase para exibir na lista do painel
        await carregarDados();
      } else {
        setErroIA(result.error || 'Erro de comunicação com a API.');
      }
    } catch (e) {
      setErroIA('Erro ao conectar com a rota /api/noticias.');
    } finally {
      setGerandoIA(false);
    }
  }

  // Salvar/Atualizar Notícia no Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = form.titulo
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const payload = {
      titulo: form.titulo,
      slug,
      resumo: form.resumo,
      conteudo: form.conteudo,
      categoria: form.categoria,
      imagem_url: form.imagemUrl,
      publicado: form.publicado,
      tempo_leitura: form.tempoLeitura,
    };

    let result;
    if (editandoId) {
      result = await supabase.from('noticias').update(payload).eq('id', editandoId);
    } else {
      result = await supabase.from('noticias').insert([payload]);
    }

    if (result.error) {
      alert('Erro ao salvar no Supabase: ' + result.error.message);
      return;
    }

    limparForm();
    await carregarDados();
    alert(editandoId ? 'Matéria atualizada no Supabase!' : 'Matéria salva com sucesso no Supabase!');
  };

  // Salvar Configurações de Horário/Automação
  const salvarConfiguracaoAutomacao = async () => {
    setSalvandoConfig(true);
    const { error } = await supabase.from('configuracoes').upsert({
      chave: 'automacao_noticias',
      valor: config,
    });

    setSalvandoConfig(false);
    if (error) {
      alert('Erro ao salvar agendamento: ' + error.message);
    } else {
      alert('Configurações de publicação automática salvas com sucesso!');
    }
  };

  const iniciarEdicao = (noticia: Noticia) => {
    if (!noticia.id) return;
    setEditandoId(noticia.id);
    setForm({
      titulo: noticia.titulo,
      resumo: noticia.resumo,
      conteudo: noticia.conteudo,
      categoria: noticia.categoria || 'Lançamentos',
      imagemUrl: noticia.imagemUrl || '',
      publicado: noticia.publicado ?? true,
      tempoLeitura: noticia.tempoLeitura || '3 min de leitura',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirNoticia = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta matéria do Supabase?')) {
      const { error } = await supabase.from('noticias').delete().eq('id', id);
      if (error) alert('Erro ao excluir: ' + error.message);
      else carregarDados();
    }
  };

  const limparForm = () => {
    setEditandoId(null);
    setForm({
      titulo: '',
      resumo: '',
      conteudo: '',
      categoria: 'Lançamentos',
      imagemUrl: '',
      publicado: true,
      tempoLeitura: '3 min de leitura',
    });
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-100 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Painel Editorial de Notícias</h1>
          <p className="text-xs text-slate-400">
            Gerencie matérias manuais ou programe a frequência de geração automática por IA.
          </p>
        </div>

        {/* PAINEL DE PROGRAMAÇÃO DE HORÁRIOS DA IA */}
        <div className="bg-slate-800 p-5 rounded-xl border border-emerald-500/30 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-700 pb-3">
            <h2 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              🤖 Automação & Agendamento por IA
            </h2>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={config.ativo}
                onChange={(e) => setConfig({ ...config, ativo: e.target.checked })}
                className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span className={config.ativo ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                {config.ativo ? 'Publicação Automática ATIVA' : 'Inativa'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Horário da Postagem
              </label>
              <input
                type="time"
                value={config.horario_execucao}
                onChange={(e) => setConfig({ ...config, horario_execucao: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Frequência</label>
              <select
                value={config.frequencia_horas}
                onChange={(e) => setConfig({ ...config, frequencia_horas: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value={12}>A cada 12 horas (2x ao dia)</option>
                <option value={24}>A cada 24 horas (1x ao dia)</option>
                <option value={48}>A cada 48 horas (A cada 2 dias)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Foco Principal dos Artigos
              </label>
              <input
                type="text"
                value={config.categoria_padrao}
                onChange={(e) => setConfig({ ...config, categoria_padrao: e.target.value })}
                placeholder="Ex: Impressão 3D e Drones"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={salvarConfiguracaoAutomacao}
            disabled={salvandoConfig}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors"
          >
            {salvandoConfig ? 'Salvando Agendamento...' : 'Salvar Regra de Postagem'}
          </button>
        </div>

        {/* GERADOR ASSISTIDO POR IA NO PAINEL */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            Gerar Rascunho com IA (Manual)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={temaIA}
              onChange={(e) => setTemaIA(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white"
              placeholder="Ex: Bambu Lab A1 Mini"
            />
            <button
              type="button"
              onClick={handleGerarNoticiaIA}
              disabled={gerandoIA}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
            >
              {gerandoIA ? 'Gerando Conteúdo & Foto...' : 'Preencher Campos'}
            </button>
          </div>
          {erroIA && <p className="text-xs text-red-400">⚠️ {erroIA}</p>}
        </div>

        {/* FORMULÁRIO DE EDIÇÃO E PUBLICAÇÃO */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-4"
        >
          <div className="flex justify-between items-center border-b border-slate-700 pb-3">
            <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded">
              {editandoId ? 'EDITANDO MATÉRIA' : 'NOVA MATÉRIA PARA O SUPABASE'}
            </span>
            {editandoId && (
              <button
                type="button"
                onClick={limparForm}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Cancelar Edição
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Título (SEO)</label>
              <input
                type="text"
                name="titulo"
                required
                value={form.titulo}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Categoria Card</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="Lançamentos">Lançamentos</option>
                <option value="Guias & Dicas">Guias & Dicas</option>
                <option value="Mercado">Mercado</option>
                <option value="Tutoriais">Tutoriais</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Capa da Notícia (URL da API)
            </label>
            {form.imagemUrl && (
              <div className="w-full h-44 bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
                <img src={form.imagemUrl} alt="Capa" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="text"
              name="imagemUrl"
              placeholder="https://..."
              value={form.imagemUrl}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Resumo / Chamada</label>
            <textarea
              name="resumo"
              rows={2}
              value={form.resumo}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Conteúdo Completo</label>
            <textarea
              name="conteudo"
              rows={8}
              value={form.conteudo}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                name="publicado"
                checked={form.publicado}
                onChange={handleChange}
                className="rounded border-slate-700 text-emerald-500"
              />
              Publicar imediatamente na Home
            </label>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors"
            >
              {editandoId ? 'Atualizar no Supabase' : 'Salvar no Supabase'}
            </button>
          </div>
        </form>

        {/* LISTAGEM EM TEMPO REAL DAS NOTÍCIAS NO SUPABASE */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-3">
          <h2 className="text-sm font-bold text-white">
            Matérias Cadastradas no Supabase ({noticias.length})
          </h2>

          {noticias.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Nenhuma matéria no banco ainda.</p>
          ) : (
            <div className="space-y-3">
              {noticias.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-950 rounded-lg border border-slate-700 flex gap-4 items-center justify-between"
                >
                  <div className="flex gap-3 items-center">
                    {item.imagemUrl ? (
                      <img
                        src={item.imagemUrl}
                        alt=""
                        className="w-16 h-12 object-cover rounded bg-slate-900"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-slate-900 rounded flex items-center justify-center text-[10px] text-slate-600">
                        Sem Imagem
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {item.categoria}
                        </span>
                        <h3 className="text-xs font-bold text-white">{item.titulo}</h3>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.resumo}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => iniciarEdicao(item)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] rounded"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => item.id && excluirNoticia(item.id)}
                      className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-[11px] rounded"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}