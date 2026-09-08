'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, Edit } from 'lucide-react';

interface Produto {
  id: string;
  nome: string;
  marca: string;
  categoria?: string;
  subcategoria: string;
  loja: string;
  faixa_preco: string;
  imagem_url: string;
  link_afiliado: string;
  posicao_ranking?: number;
  nota?: number;
  ativo: boolean;
}

export default function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [extraindo, setExtraindo] = useState(false);

  const [form, setForm] = useState({
    id: '',
    nome: '',
    marca: '',
    categoria: 'Impressoras 3D',
    subcategoria: '',
    loja: 'Mercado Livre',
    faixa_preco: 'R$ 1.000 - R$ 2.500',
    imagem_url: '',
    link_afiliado: '',
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    setLoading(true);
    try {
      const res = await fetch('/api/produtos');
      const data = await res.json();
      if (Array.isArray(data)) setProdutos(data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExtrairComIA() {
    if (!form.nome && !form.link_afiliado) {
      alert('Digite o nome do produto ou insira o link de afiliado para preencher com IA.');
      return;
    }

    setExtraindo(true);
    try {
      const urlParaExtrair = form.link_afiliado || form.nome;
      const res = await fetch('/api/extrair-produto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlParaExtrair }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro na extração');

      if (json.dados) {
        setForm((prev) => ({
          ...prev,
          nome: json.dados.nome || prev.nome,
          marca: json.dados.marca || prev.marca,
          loja: json.dados.loja || prev.loja,
          subcategoria: json.dados.subcategoria || prev.subcategoria,
          faixa_preco: json.dados.faixa_preco || prev.faixa_preco,
          imagem_url: json.dados.imagem_url || prev.imagem_url,
        }));
      }
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setExtraindo(false);
    }
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.link_afiliado) {
      alert('Preencha o Nome e o Link de Afiliado.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Erro desconhecido ao salvar');
      }

      setForm({
        id: '',
        nome: '',
        marca: '',
        categoria: 'Impressoras 3D',
        subcategoria: '',
        loja: 'Mercado Livre',
        faixa_preco: 'R$ 1.000 - R$ 2.500',
        imagem_url: '',
        link_afiliado: '',
      });

      await carregarProdutos();
      alert('Produto salvo com sucesso!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletar(id: string) {
    if (!confirm('Deseja excluir este produto?')) return;
    try {
      await fetch(`/api/produtos?id=${id}`, { method: 'DELETE' });
      await carregarProdutos();
    } catch (err) {
      console.error(err);
    }
  }

  function handleEditar(p: Produto) {
    setForm({
      id: p.id,
      nome: p.nome,
      marca: p.marca || '',
      categoria: p.categoria || 'Impressoras 3D',
      subcategoria: p.subcategoria || '',
      loja: p.loja || 'Mercado Livre',
      faixa_preco: p.faixa_preco || 'R$ 1.000 - R$ 2.500',
      imagem_url: p.imagem_url || '',
      link_afiliado: p.link_afiliado || '',
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-900 p-6 md:p-10 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Card Formulário */}
        <form onSubmit={handleSalvar} className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-6">
          <h1 className="text-2xl font-bold text-slate-900">Cadastrar Novo Produto</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nome com Botão IA */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Bambu Lab A1 Mini"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="flex-1 p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={handleExtrairComIA}
                  disabled={extraindo}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium rounded-lg text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  {extraindo ? 'Lendo...' : 'Preencher com IA'}
                </button>
              </div>
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
              <input
                type="text"
                placeholder="Ex: Bambu Lab, Creality"
                value={form.marca}
                onChange={(e) => setForm({ ...form, marca: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Impressoras 3D">Impressoras 3D</option>
                <option value="Filamentos">Filamentos</option>
                <option value="Resinas">Resinas</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Subcategoria / Tipo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subcategoria / Tipo</label>
              <input
                type="text"
                value={form.subcategoria}
                onChange={(e) => setForm({ ...form, subcategoria: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Loja / Marketplace */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Loja / Marketplace</label>
              <select
                value={form.loja}
                onChange={(e) => setForm({ ...form, loja: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Mercado Livre">Mercado Livre</option>
                <option value="Amazon">Amazon</option>
                <option value="Shopee">Shopee</option>
                <option value="AliExpress">AliExpress</option>
                <option value="TikTok Shop">TikTok Shop</option>
                <option value="Magalu">Magalu</option>
                <option value="Casas Bahia">Casas Bahia</option>
                <option value="Kabum">Kabum</option>
                <option value="Ponto Frio">Ponto Frio</option>
                <option value="Americanas">Americanas</option>
                <option value="Loja Própria / Outros">Loja Própria / Outros</option>
              </select>
            </div>

            {/* Faixa de Preço */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Faixa de Preço</label>
              <select
                value={form.faixa_preco}
                onChange={(e) => setForm({ ...form, faixa_preco: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Até R$ 100">Até R$ 100</option>
                <option value="R$ 100 - R$ 250">R$ 100 - R$ 250</option>
                <option value="R$ 250 - R$ 500">R$ 250 - R$ 500</option>
                <option value="R$ 500 - R$ 1.000">R$ 500 - R$ 1.000</option>
                <option value="R$ 1.000 - R$ 2.500">R$ 1.000 - R$ 2.500</option>
                <option value="R$ 2.500 - R$ 5.000">R$ 2.500 - R$ 5.000</option>
                <option value="R$ 5.000 - R$ 10.000">R$ 5.000 - R$ 10.000</option>
                <option value="R$ 10.000 - R$ 25.000">R$ 10.000 - R$ 25.000</option>
                <option value="R$ 25.000 - R$ 50.000">R$ 25.000 - R$ 50.000</option>
                <option value="R$ 50.000 - R$ 100.000">R$ 50.000 - R$ 100.000</option>
                <option value="Acima de R$ 100.000">Acima de R$ 100.000</option>
              </select>
            </div>
          </div>

          {/* Seção Imagem */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload do Computador</label>
              <div className="flex items-center gap-2">
                <input type="file" className="hidden" id="file-upload" />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm cursor-pointer transition-colors"
                >
                  Escolher arquivo
                </label>
                <span className="text-xs text-slate-500">Nenhum arquivo escolhido</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ou URL Direta da Imagem</label>
              <input
                type="url"
                placeholder="https://..."
                value={form.imagem_url}
                onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 outline-none text-sm"
              />
            </div>
          </div>

          {/* Link de Afiliado */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link de Afiliado *</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.link_afiliado}
              onChange={(e) => setForm({ ...form, link_afiliado: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Botão Cadastrar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : form.id ? 'Atualizar Produto' : 'Adicionar Produto ao Supabase'}
          </button>
        </form>

        {/* Tabela de Produtos */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Produtos Cadastrados no Banco ({produtos.length})</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                <tr>
                  <th className="p-3">Imagem</th>
                  <th className="p-3">Nome</th>
                  <th className="p-3">Loja</th>
                  <th className="p-3">Preço</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produtos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-3">
                      {p.imagem_url ? (
                        <img src={p.imagem_url} alt={p.nome} className="w-10 h-10 object-contain rounded border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded border border-slate-200" />
                      )}
                    </td>
                    <td className="p-3 font-medium text-slate-900">{p.nome}</td>
                    <td className="p-3">{p.loja}</td>
                    <td className="p-3 font-semibold text-emerald-600">{p.faixa_preco}</td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleEditar(p)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium">
                        Editar
                      </button>
                      <button onClick={() => handleDeletar(p.id)} className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-medium">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}