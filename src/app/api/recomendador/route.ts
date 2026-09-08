import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const LINK_WHATSAPP = "https://chat.whatsapp.com/SEU_GRUPO_AQUI";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const respostasTexto = JSON.stringify(body).toLowerCase();

    // 1. Busca TODOS os produtos cadastrados no banco de dados (Supabase)
    const { data: produtos, error } = await supabase
      .from("produtos")
      .select("*");

    if (error || !produtos || produtos.length === 0) {
      console.error("Erro ou nenhum produto cadastrado no banco:", error);
      return NextResponse.json(
        { erro: "Nenhum produto encontrado no banco de dados." },
        { status: 404 }
      );
    }

    // Função para extrair o link de qualquer coluna comum que você tenha usado no Supabase
    const obterLinkAfiliado = (item: any) => {
      return (
        item.link_afiliado ||
        item.link ||
        item.url ||
        item.link_compra ||
        item.link_loja ||
        "#"
      );
    };

    // Função para extrair a imagem
    const obterImagem = (item: any) => {
      return (
        item.imagem_url ||
        item.imagem ||
        "https://m.media-amazon.com/images/I/61S1k2xAn-L._AC_SL1500_.jpg"
      );
    };

    let produtoSelecionado = produtos[0]; // Padrão: primeiro produto da lista
    let tipo = "FDM / Filamento";
    let justificativa =
      "A melhor opção com base no seu perfil, oferecendo excelente calibração automática, confiabilidade e facilidade de uso.";

    // 2. Lógica dinâmica para encontrar o produto cadastrado correspondente
    if (respostasTexto.includes("miniaturas") || respostasTexto.includes("colecionáveis") || respostasTexto.includes("resina")) {
      // Tenta achar impressora de resina cadastrada no banco
      const resina = produtos.find(
        (p: any) =>
          p.nome?.toLowerCase().includes("elegoo") ||
          p.nome?.toLowerCase().includes("mars") ||
          p.nome?.toLowerCase().includes("resina")
      );
      if (resina) {
        produtoSelecionado = resina;
        tipo = "SLA / Resina";
        justificativa = "Equipamento ideal para miniaturas e alta precisão nos detalhes das impressões em resina.";
      }
    } else if (respostasTexto.includes("4.500") || respostasTexto.includes("avançado") || respostasTexto.includes("profissional")) {
      // Tenta achar impressora topo de linha / fechada no banco
      const topoLinha = produtos.find(
        (p: any) =>
          p.nome?.toLowerCase().includes("k1") ||
          p.nome?.toLowerCase().includes("max") ||
          p.nome?.toLowerCase().includes("creality")
      );
      if (topoLinha) {
        produtoSelecionado = topoLinha;
        tipo = "FDM / Fechada";
        justificativa = "Equipamento profissional de alta velocidade, câmara fechada e grande volume de impressão.";
      }
    } else {
      // Entrada / Padrão (Ex: Bambu Lab A1 Mini ou primeira impressora FDM)
      const entrada = produtos.find(
        (p: any) =>
          p.nome?.toLowerCase().includes("bambu") ||
          p.nome?.toLowerCase().includes("mini") ||
          p.nome?.toLowerCase().includes("ender")
      );
      if (entrada) {
        produtoSelecionado = entrada;
      }
    }

    // 3. Monta a resposta final usando 100% dos dados reais da tabela do Supabase
    return NextResponse.json({
      sucesso: true,
      recomendacao: {
        nome: produtoSelecionado.nome,
        tipo: tipo,
        imagem: obterImagem(produtoSelecionado),
        justificativa: justificativa,
        linkCompra: obterLinkAfiliado(produtoSelecionado),
        linkWhatsapp: LINK_WHATSAPP,
      },
    });
  } catch (error) {
    console.error("Erro interno ao processar recomendação:", error);
    return NextResponse.json(
      { erro: "Falha ao processar a recomendação." },
      { status: 500 }
    );
  }
}