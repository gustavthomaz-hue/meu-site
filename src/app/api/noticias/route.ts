import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RequestBody {
  titulo?: string;
  produto?: string;
  categoria?: string;
  detalhes?: string;
}

// Função auxiliar para gerar Slug
function gerarSlug(texto: string) {
  return texto
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const queryProduto = body.produto || body.titulo || 'DJI Mini 4 Pro';
    const categoria = body.categoria || 'Drones & Tecnologia';

    const serperKey = process.env.SERPER_API_KEY;

    if (!serperKey) {
      return NextResponse.json({
        success: false,
        error: 'A chave SERPER_API_KEY não está configurada no seu .env.local',
      }, { status: 400 });
    }

    // 1. Busca da Imagem Real do Produto no Serper Images
    let imageUrl = 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80';
    try {
      const imgRes = await fetch('https://google.serper.dev/images', {
        method: 'POST',
        headers: {
          'X-API-KEY': serperKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: `${queryProduto} produto`,
          gl: 'br',
          hl: 'pt-br',
          num: 1,
        }),
      });

      if (imgRes.ok) {
        const imgData = await imgRes.json();
        if (imgData.images?.[0]?.imageUrl) {
          imageUrl = imgData.images[0].imageUrl;
        }
      }
    } catch (e) {
      console.error('Erro ao buscar imagem no Serper:', e);
    }

    // 2. Busca de Notícias Reais no Serper News
    const newsRes = await fetch('https://google.serper.dev/news', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: queryProduto,
        gl: 'br',
        hl: 'pt-br',
        num: 5,
      }),
    });

    if (!newsRes.ok) {
      return NextResponse.json({
        success: false,
        error: 'Falha ao buscar notícias na API do Serper.',
      }, { status: 500 });
    }

    const newsData = await newsRes.json();
    const artigos = newsData.news || [];

    // 3. Montagem do Artigo Estruturado
    let textoNoticia = `ANÁLISE E NOVIDADES DO MERCADO: ${queryProduto.toUpperCase()}\n\n`;

    if (artigos.length > 0) {
      textoNoticia += `Destaque Principal:\n${artigos[0].snippet}\n\n`;
      textoNoticia += `Principais Atualizações e Análises da Mídia:\n`;

      artigos.forEach((item: any, index: number) => {
        textoNoticia += `\n${index + 1}. ${item.title}\n`;
        textoNoticia += `   ${item.snippet}\n`;
        if (item.source) {
          textoNoticia += `   Fonte: ${item.source} (${item.date || 'Recente'})\n`;
        }
      });

      textoNoticia += `\nVeredito e Panorama:\n`;
      textoNoticia += `O ${queryProduto} segue como um dos assuntos mais debatidos na categoria de ${categoria}. As análises recentes destacam a evolução do dispositivo no ecossistema atual, sendo uma referência recomendada para entusiastas e profissionais da área.`;
    } else {
      textoNoticia += `O ${queryProduto} é um dos destaques recentes na categoria de ${categoria}.\n\n`;
      textoNoticia += `Principais Características:\n- Design otimizado e recursos avançados para a categoria.\n- Alta receptividade no mercado tecnológico nacional e internacional.\n- Excelente opção para quem busca desempenho, precisão e tecnologia de ponta.`;
    }

    const tituloGerado = `Análise e Novidades: ${queryProduto}`;
    const resumoGerado = `Confira as principais especificações e recursos do ${queryProduto}.`;
    const slugGerado = gerarSlug(`${tituloGerado}-${Date.now()}`);

    // 4. Salva a Notícia Automaticamente no Supabase
    const payloadNoticia = {
      titulo: tituloGerado,
      slug: slugGerado,
      resumo: resumoGerado,
      conteudo: textoNoticia,
      categoria: categoria,
      imagem_url: imageUrl,
      publicado: true,
      tempo_leitura: '3 min de leitura',
    };

    const { data: insertedData, error: dbError } = await supabase
      .from('noticias')
      .insert([payloadNoticia])
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar notícia automática no Supabase:', dbError);
      return NextResponse.json({
        success: false,
        error: `Erro ao gravar no banco: ${dbError.message}`,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: insertedData.id,
        produto: queryProduto,
        categoria,
        imagemUrl: imageUrl,
        conteudo: textoNoticia,
        criadoEm: insertedData.created_at || new Date().toISOString(),
      },
    });

  } catch (error: any) {
    console.error('Erro na rota de notícias:', error);
    return NextResponse.json({
      success: false,
      error: `Erro ao processar requisição: ${error.message || 'Erro interno'}`,
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID não fornecido' }, { status: 400 });
    }

    const { error } = await supabase.from('noticias').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Notícia excluída com sucesso' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}