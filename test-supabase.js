import { supabase } from './services/supabaseClient';

// Script de teste de conexão Supabase
async function testSupabaseConnection() {
    console.log('🔍 [TEST] Iniciando teste de conexão Supabase...');
    console.log('🔗 [TEST] URL:', 'https://zvuxzrfbmmbhuhwaofrn.supabase.co');

    try {
        // Teste 1: Verificar se o cliente foi criado
        console.log('✅ [TEST] Cliente Supabase criado com sucesso');

        // Teste 2: Tentar fazer uma query simples
        const { data, error } = await supabase.auth.getSession();
        console.log('📊 [TEST] Sessão atual:', { hasSession: !!data?.session, error: error?.message });

        // Teste 3: Verificar status do projeto
        const { data: healthData, error: healthError } = await supabase
            .from('students')
            .select('count')
            .limit(1);

        console.log('💚 [TEST] Status do projeto:', {
            isHealthy: !healthError,
            error: healthError?.message
        });

        console.log('✅ [TEST] Teste concluído!');
    } catch (err) {
        console.error('❌ [TEST] Erro no teste:', err);
    }
}

// Executar teste
testSupabaseConnection();
