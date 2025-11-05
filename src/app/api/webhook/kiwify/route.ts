import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Parse do JSON recebido da Kiwify
    const body = await request.json();
    
    // Log dos dados recebidos para debug
    console.log('Webhook Kiwify recebido:', body);
    
    // Extrair dados importantes
    const email = body.email || body.Customer?.email;
    const status = body.status || body.subscription_status;
    const productId = body.product_id;
    const orderId = body.order_id;
    const customerName = body.Customer?.full_name || body.customer_name;
    
    // Validar se temos os dados essenciais
    if (!email) {
      console.error('Email não encontrado no webhook');
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }
    
    if (!status) {
      console.error('Status não encontrado no webhook');
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      );
    }
    
    // Log dos dados extraídos
    console.log('Dados processados:', {
      email,
      status,
      productId,
      orderId,
      customerName
    });
    
    // 1. Verificar se o status do pagamento é "paid" ou "aprovado"
    const statusPago = ['paid', 'aprovado', 'active', 'completed'].includes(status.toLowerCase());
    
    if (statusPago) {
      console.log(`✅ Pagamento confirmado para ${email}`);
      
      // 2. Pegar o email do cliente que veio da Kiwify (já extraído acima)
      
      // 3. Procurar na tabela "Usuários" no Supabase pelo usuário com esse email
      const { data: usuario, error: errorBusca } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();
      
      if (errorBusca) {
        console.error('Erro ao buscar usuário:', errorBusca);
        
        // Se usuário não existe, log mas não falha o webhook
        if (errorBusca.code === 'PGRST116') {
          console.log(`⚠️ Usuário com email ${email} não encontrado na base de dados`);
          return NextResponse.json({
            success: true,
            message: 'Webhook processado - usuário não encontrado',
            email,
            status
          });
        }
        
        return NextResponse.json(
          { error: 'Erro ao buscar usuário no banco de dados' },
          { status: 500 }
        );
      }
      
      if (usuario) {
        console.log(`👤 Usuário encontrado: ${usuario.email}`);
        
        // 4. Atualizar o campo "plano_ativo" para "sim" ou "true"
        const { data: usuarioAtualizado, error: errorUpdate } = await supabase
          .from('usuarios')
          .update({ plano_ativo: true })
          .eq('email', email)
          .select();
        
        if (errorUpdate) {
          console.error('Erro ao atualizar usuário:', errorUpdate);
          return NextResponse.json(
            { error: 'Erro ao atualizar plano do usuário' },
            { status: 500 }
          );
        }
        
        console.log(`✅ Plano ativado com sucesso para ${email}`);
        
        return NextResponse.json({
          success: true,
          message: 'Plano ativado com sucesso',
          usuario: usuarioAtualizado?.[0],
          timestamp: new Date().toISOString()
        });
      }
    } else {
      // Status não é "paid" - processar outros status
      console.log(`ℹ️ Status ${status} recebido para ${email} - não ativando plano`);
      
      // Para status de cancelamento/reembolso, desativar plano
      const statusCancelado = ['cancelled', 'refunded', 'expired', 'canceled'].includes(status.toLowerCase());
      
      if (statusCancelado) {
        // Buscar e desativar plano do usuário
        const { error: errorDesativar } = await supabase
          .from('usuarios')
          .update({ plano_ativo: false })
          .eq('email', email);
        
        if (errorDesativar) {
          console.error('Erro ao desativar plano:', errorDesativar);
        } else {
          console.log(`❌ Plano desativado para ${email}`);
        }
      }
    }
    
    // Resposta de sucesso para a Kiwify
    return NextResponse.json(
      { 
        success: true, 
        message: 'Webhook processado com sucesso',
        processed_data: {
          email,
          status,
          action: statusPago ? 'plano_ativado' : 'status_processado',
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Erro ao processar webhook da Kiwify:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: 'Falha ao processar webhook'
      },
      { status: 500 }
    );
  }
}

// Método GET para testar se o endpoint está funcionando
export async function GET() {
  return NextResponse.json({
    message: 'Webhook Kiwify está funcionando',
    endpoint: '/api/webhook/kiwify',
    methods: ['POST'],
    timestamp: new Date().toISOString()
  });
}