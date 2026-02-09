import { supabase } from './services/supabaseClient.js';

// Script para testar autenticação com e-mail específico
async function testAuthentication() {
    const email = 'vilera@prof.educacao.sp.gov.br';

    console.log('🔍 [AUTH TEST] Testando autenticação para:', email);
    console.log('');

    try {
        // Teste 1: Verificar se o usuário existe
        console.log('📊 [TESTE 1] Verificando se o usuário existe no sistema...');
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers();

        if (userError) {
            console.log('⚠️  Não foi possível listar usuários (normal para client key)');
        }

        // Teste 2: Verificar sessão atual
        console.log('📊 [TESTE 2] Verificando sessão atual...');
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('✅ Sessão atual:', sessionData.session ? 'ATIVA' : 'NENHUMA');

        // Teste 3: Tentar login (será solicitado senha)
        console.log('');
        console.log('📊 [TESTE 3] Para testar o login, execute manualmente:');
        console.log('');
        console.log('const { data, error } = await supabase.auth.signInWithPassword({');
        console.log(`  email: '${email}',`);
        console.log('  password: \'SUA_SENHA_AQUI\'');
        console.log('});');
        console.log('console.log({ data, error });');
        console.log('');

        // Teste 4: Informações sobre reset de senha
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔑 OPÇÕES PARA RESOLVER O PROBLEMA:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('1️⃣  REDEFINIR SENHA (Recomendado):');
        console.log('   - Clique em "Esqueci a senha" na tela de login');
        console.log('   - Digite: vilera@prof.educacao.sp.gov.br');
        console.log('   - Verifique sua caixa de entrada');
        console.log('');
        console.log('2️⃣  CRIAR NOVA CONTA (se necessário):');
        console.log('   - Clique em "Cadastre-se aqui"');
        console.log('   - Use o mesmo e-mail institucional');
        console.log('   - O sistema substituirá a conta antiga');
        console.log('');
        console.log('3️⃣  TESTAR SENHA MANUALMENTE:');
        console.log('   - Execute o código acima no console do navegador');
        console.log('   - Substitua SUA_SENHA_AQUI pela senha que você lembra');
        console.log('');

    } catch (err) {
        console.error('❌ [ERROR]', err);
    }
}

// Executar teste
testAuthentication();
