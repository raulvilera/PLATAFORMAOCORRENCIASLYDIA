// Mapeamento de e-mails institucionais para nomes de professores
// Este arquivo permite o preenchimento automático do nome do professor ao fazer login

export interface ProfessorData {
    email: string;
    nome: string;
}

export const PROFESSORS_DB: ProfessorData[] = [
    // Conta de gestão
    { email: 'gestao@escola.com', nome: 'GESTÃO ESCOLAR' },

    // Professores cadastrados - E-mails Microsoft
    { email: 'aex@professor.educacao.sp.gov.br', nome: 'AEX LUTTI PEREIRA MARANHÃO' },
    { email: 'avarella@professor.educacao.sp.gov.br', nome: 'ALEXANDRA PAULA VARELLA DE SOUZA' },
    { email: 'aldison@prof.educacao.sp.gov.br', nome: 'ALDISON VASCONCELOS PEREIRA' },
    { email: 'anaparent88@professor.educacao.sp.gov.br', nome: 'ANA PAULA ALVES PEREIRA' },
    { email: 'analopes@professor.educacao.sp.gov.br', nome: 'ANA LUCI DOS SANTOS FREITAS' },
    { email: 'andreneto@professor.educacao.sp.gov.br', nome: 'ANDRÉ LUIZ NETO FERREIRA' },
    { email: 'antoniocarlos@professor.educacao.sp.gov.br', nome: 'ANTÔNIO CARLOS DE OLIVEIRA' },
    { email: 'adearaujo@professor.educacao.sp.gov.br', nome: 'ANTÔNIO MANOEL DE ARAUJO' },
    { email: 'antoniowilton@professor.educacao.sp.gov.br', nome: 'ANTÔNIO WILTON WANDERLEY CARPAI' },
    { email: 'augustoliano@professor.educacao.sp.gov.br', nome: 'AUGUSTO LIANO PESSOA NETO' },
    { email: 'carolinapermoniam@professor.educacao.sp.gov.br', nome: 'CAROLINA PERMONIAM PARRISSOLO' },
    { email: 'charles@professor.educacao.sp.gov.br', nome: 'CHARLES DALÂTO PESSOA SANTOS' },
    { email: 'cicero1@professor.educacao.sp.gov.br', nome: 'CÍCERO FERREIRA' },
    { email: 'gajalelima@professor.educacao.sp.gov.br', nome: 'CLAUDINEIA DE AGUIAR LIMA' },
    { email: 'clenilson@professor.educacao.sp.gov.br', nome: 'CLENILSON AGUIAR SILVA' },
    { email: 'daniellopesbarbosa@professor.educacao.sp.gov.br', nome: 'DANIEL LOPES BARBOSA' },
    { email: 'danielfillimi@professor.educacao.sp.gov.br', nome: 'DANIELA FERREIRA FILLIMI' },
    { email: 'deyseoliveira@professor.educacao.sp.gov.br', nome: 'DEYSE DE MIRANDA OLIVEIRA' },
    { email: 'edianeneves@professor.educacao.sp.gov.br', nome: 'EDIANE NEVES DA SILVA' },
    { email: 'edileusa@professor.educacao.sp.gov.br', nome: 'EDILEUSA NUNES PEREIRA' },
    { email: 'ebernardesca@professor.educacao.sp.gov.br', nome: 'EDUARDO BERNARDES CAMPANHESCA' },
    { email: 'essantos@professor.educacao.sp.gov.br', nome: 'ELIANE SANTOS SILVA' },
    { email: 'elisia1@professor.educacao.sp.gov.br', nome: 'ELISIA VENENTINO LIMA' },
    { email: 'emanuelle@professor.educacao.sp.gov.br', nome: 'EMANUELLE FRAZÃO SANTIAGO' },
    { email: 'egabiler@professor.educacao.sp.gov.br', nome: 'EMERSON GABILER DE ALMEIDA' },
    { email: 'ernedias@professor.educacao.sp.gov.br', nome: 'ERNEDIAS ELIFFER ARAGÃO NERY' },
    { email: 'euzeliaraujo@professor.educacao.sp.gov.br', nome: 'EUZELI ARAÚJO DE OLIVEIRA' },
    { email: 'fabianougusto@professor.educacao.sp.gov.br', nome: 'FABIANO AUGUSTO PITTON' },
    { email: 'fcamilo@professor.educacao.sp.gov.br', nome: 'FÁBIO CAMILO' },
    { email: 'fernando@professor.educacao.sp.gov.br', nome: 'FERNANDO JOSÉ DA SILVA FILHO' },
    { email: 'flaviaci@professor.educacao.sp.gov.br', nome: 'FLAVIA CRISTINA APARECIDA BICHELI' },
    { email: 'gfrancioli@professor.educacao.sp.gov.br', nome: 'GABRIEL FRANCIOLI MORO' },
    { email: 'gabrielypiatti@professor.educacao.sp.gov.br', nome: 'GABRIELY PIATTI RODRIGUES' },
    { email: 'galmeida@professor.educacao.sp.gov.br', nome: 'GEFSON DE ALMEIDA BATISTA' },
    { email: 'gfonseca@professor.educacao.sp.gov.br', nome: 'GERILTON DE OLIVEIRA SANTOS' },
    { email: 'ioshikawa@professor.educacao.sp.gov.br', nome: 'IVANI PIRES DOS SANTOS OSHIKAWA' },
    { email: 'jamiller@professor.educacao.sp.gov.br', nome: 'JAMILE DOS PASSOS BRAGA DE ALMEIDA' },
    { email: 'joseaparecidosilva@professor.educacao.sp.gov.br', nome: 'JOSÉ APARECIDO DA SILVA' },
    { email: 'jaregi@professor.educacao.sp.gov.br', nome: 'JÉSSICA GOMES DE MACÊDO FILHO' },
    { email: 'jufernani@professor.educacao.sp.gov.br', nome: 'JUREMA SCHEUBLE FURINI SANTOS' },
    { email: 'katyucia.abomfim@professor.educacao.sp.gov.br', nome: 'KATYUCIA ALVES DOMFIM' },
    { email: 'latinhaoli@professor.educacao.sp.gov.br', nome: 'LATINHA OLIVEIRA DE LIMA' },
    { email: 'luanafreitas@professor.educacao.sp.gov.br', nome: 'LUANA DE FREITAS SILVA' },
    { email: 'luanapavan@professor.educacao.sp.gov.br', nome: 'LUANA DE PAVAN' },
    { email: 'lnovaiscorrea@professor.educacao.sp.gov.br', nome: 'LUCIANA NOVAIS CORRÊA SANTOS' },
    { email: 'lucianomarteira@professor.educacao.sp.gov.br', nome: 'LUCIANO MOREIRA DE AZEVEDO' },
    { email: 'marcilasilva@professor.educacao.sp.gov.br', nome: 'MARCIEL DA SILVA' },
    { email: 'mmorig@professor.educacao.sp.gov.br', nome: 'MARIA HELENA CUNHA MORIG' },
    { email: 'mqferreira.santos@professor.educacao.sp.gov.br', nome: 'MARIA QUITÉRIA FERREIRA DOS SANTOS' },
    { email: 'marcelasilva@professor.educacao.sp.gov.br', nome: 'MARCELA SILVA SANTOS PINI' },
    { email: 'marinalfranciscosilva@professor.educacao.sp.gov.br', nome: 'MARINA L. FRANCISCO TIMÃO SILVA' },
    { email: 'mauriciodbarros@professor.educacao.sp.gov.br', nome: 'MAURICIO DE BARROS SANTOS' },
    { email: 'moniquepinto@professor.educacao.sp.gov.br', nome: 'MONIQUE DE PINTO MORAES' },
    { email: 'moiseabarros@professor.educacao.sp.gov.br', nome: 'MOISÉS ANTÔNIO LE BARROS' },
    { email: 'patriciamoraes@professor.educacao.sp.gov.br', nome: 'PATRICIA SOARES MORAES' },
    { email: 'paulaamani@professor.educacao.sp.gov.br', nome: 'PAULA AMANI VILA' },
    { email: 'pvatto@professor.educacao.sp.gov.br', nome: 'PAULO ROBERTO DA SILVA VATTO' },
    { email: 'pedrozanoti@professor.educacao.sp.gov.br', nome: 'PEDRO ZANOTI FILHO' },
    { email: 'pedrapereira@professor.educacao.sp.gov.br', nome: 'PEDRA PEREIRA MACEDO JUNIOR' },
    { email: 'reginacurtti@professor.educacao.sp.gov.br', nome: 'REGINA APARECIDA CURTT OLIVEIRA' },
    { email: 'reginacastro@professor.educacao.sp.gov.br', nome: 'REGINA DA SILVA CASTRO' },
    { email: 'renataaquino@professor.educacao.sp.gov.br', nome: 'RENATA MAGALHÃES AQUINO' },
    { email: 'ricardoamerico@professor.educacao.sp.gov.br', nome: 'RICARDO AMÉRICO DA SILVA' },
    { email: 'robertadelgado@professor.educacao.sp.gov.br', nome: 'ROBERTA DELGADO' },
    { email: 'rodrigovieira1@professor.educacao.sp.gov.br', nome: 'RODRIGO VIEIRA' },
    { email: 'romildasantos@professor.educacao.sp.gov.br', nome: 'ROMILDA APARECIDA MIRANDA' },
    { email: 'roseliaraujo1@professor.educacao.sp.gov.br', nome: 'ROSELI LUIZ ARAÚJO' },
    { email: 'rosrpereira2@professor.educacao.sp.gov.br', nome: 'ROSENILDA CARDOSO PESSOA' },
    { email: 'rosmaracardoso@professor.educacao.sp.gov.br', nome: 'ROSMARA DA SILVA CARDOSO' },
    { email: 'sandraestremacodoraes@professor.educacao.sp.gov.br', nome: 'SANDRA CRISTINA MACÊDO MORAES' },
    { email: 'sandradebiagi@professor.educacao.sp.gov.br', nome: 'SANDRA MARA DE BIAGI SANTOS' },
    { email: 'sergioagrino@professor.educacao.sp.gov.br', nome: 'SÉRGIO AGRÍPINO VILLA NOVA' },
    { email: 'simonesilva@professor.educacao.sp.gov.br', nome: 'SIMONE DA SILVA' },
    { email: 'almeidafabio@professor.educacao.sp.gov.br', nome: 'SOLANGE ALMEIDA DA SILVA' },
    { email: 'suzenileal@professor.educacao.sp.gov.br', nome: 'SUZENILDE SILVA NETO LEMES' },
    { email: 'titto@professor.educacao.sp.gov.br', nome: 'TITTO AUGUSTO NASCIMENTO SILVA' },
    { email: 'vanessai@professor.educacao.sp.gov.br', nome: 'VANESSA NÉ DE GOMES DOS SANTOS' },
    { email: 'vaniapenna@professor.educacao.sp.gov.br', nome: 'VANIA PENNA DE BARROS' },
    { email: 'vivianemgalvao@professor.educacao.sp.gov.br', nome: 'VIVIANE LEAL CÂMERA DE MORAES' },
    { email: 'vrivani@professor.educacao.sp.gov.br', nome: 'VIVIANE LEAL CÂMERA ALBORADAS' },
    { email: 'wilsonjunior@professor.educacao.sp.gov.br', nome: 'WILSON JUNIOR FERREIRA' },

    // Professores cadastrados - E-mails Google
    { email: 'lutti@prof.educacao.sp.gov.br', nome: 'AEX LUTTI PEREIRA MARANHÃO' },
    { email: 'avarella@prof.educacao.sp.gov.br', nome: 'ALEXANDRA PAULA VARELLA DE SOUZA' },
    { email: 'aldison@prof.educacao.sp.gov.br', nome: 'ALDISON VASCONCELOS PEREIRA' },
    { email: 'anaparent88@prof.educacao.sp.gov.br', nome: 'ANA PAULA ALVES PEREIRA' },
    { email: 'analucifreitas@prof.educacao.sp.gov.br', nome: 'ANA LUCI DOS SANTOS FREITAS' },
    { email: 'andreneto@prof.educacao.sp.gov.br', nome: 'ANDRÉ LUIZ NETO FERREIRA' },
    { email: 'antoniocarlos@prof.educacao.sp.gov.br', nome: 'ANTÔNIO CARLOS DE OLIVEIRA' },
    { email: 'antoniomanoel@prof.educacao.sp.gov.br', nome: 'ANTÔNIO MANOEL DE ARAUJO' },
    { email: 'antoniowilton@prof.educacao.sp.gov.br', nome: 'ANTÔNIO WILTON WANDERLEY CARPAI' },
    { email: 'augustoliano@prof.educacao.sp.gov.br', nome: 'AUGUSTO LIANO PESSOA NETO' },
    { email: 'carolinapermoniam@prof.educacao.sp.gov.br', nome: 'CAROLINA PERMONIAM PARRISSOLO' },
    { email: 'charlesd@prof.educacao.sp.gov.br', nome: 'CHARLES DALÂTO PESSOA SANTOS' },
    { email: 'cicero1@prof.educacao.sp.gov.br', nome: 'CÍCERO FERREIRA' },
    { email: 'gajalel@prof.educacao.sp.gov.br', nome: 'CLAUDINEIA DE AGUIAR LIMA' },
    { email: 'clenilson@prof.educacao.sp.gov.br', nome: 'CLENILSON AGUIAR SILVA' },
    { email: 'daniellopesbarbosa@prof.educacao.sp.gov.br', nome: 'DANIEL LOPES BARBOSA' },
    { email: 'danielfillimi@prof.educacao.sp.gov.br', nome: 'DANIELA FERREIRA FILLIMI' },
    { email: 'deyseoliveira@prof.educacao.sp.gov.br', nome: 'DEYSE DE MIRANDA OLIVEIRA' },
    { email: 'edianeneves@prof.educacao.sp.gov.br', nome: 'EDIANE NEVES DA SILVA' },
    { email: 'edileusa@prof.educacao.sp.gov.br', nome: 'EDILEUSA NUNES PEREIRA' },
    { email: 'ebernardesca@prof.educacao.sp.gov.br', nome: 'EDUARDO BERNARDES CAMPANHESCA' },
    { email: 'essantos@prof.educacao.sp.gov.br', nome: 'ELIANE SANTOS SILVA' },
    { email: 'elisia1@prof.educacao.sp.gov.br', nome: 'ELISIA VENENTINO LIMA' },
    { email: 'emanuelle@prof.educacao.sp.gov.br', nome: 'EMANUELLE FRAZÃO SANTIAGO' },
    { email: 'egabiler@prof.educacao.sp.gov.br', nome: 'EMERSON GABILER DE ALMEIDA' },
    { email: 'ernedias@prof.educacao.sp.gov.br', nome: 'ERNEDIAS ELIFFER ARAGÃO NERY' },
    { email: 'euzeli@prof.educacao.sp.gov.br', nome: 'EUZELI ARAÚJO DE OLIVEIRA' },
    { email: 'fabianoaugusto@prof.educacao.sp.gov.br', nome: 'FABIANO AUGUSTO PITTON' },
    { email: 'fcamilo@prof.educacao.sp.gov.br', nome: 'FÁBIO CAMILO' },
    { email: 'fernando@prof.educacao.sp.gov.br', nome: 'FERNANDO JOSÉ DA SILVA FILHO' },
    { email: 'flaviaci@prof.educacao.sp.gov.br', nome: 'FLAVIA CRISTINA APARECIDA BICHELI' },
    { email: 'gfrancioli@prof.educacao.sp.gov.br', nome: 'GABRIEL FRANCIOLI MORO' },
    { email: 'gabrielypiatti@prof.educacao.sp.gov.br', nome: 'GABRIELY PIATTI RODRIGUES' },
    { email: 'galmeida@prof.educacao.sp.gov.br', nome: 'GEFSON DE ALMEIDA BATISTA' },
    { email: 'gfonseca@prof.educacao.sp.gov.br', nome: 'GERILTON DE OLIVEIRA SANTOS' },
    { email: 'ioshikawa@prof.educacao.sp.gov.br', nome: 'IVANI PIRES DOS SANTOS OSHIKAWA' },
    { email: 'jamiller@prof.educacao.sp.gov.br', nome: 'JAMILE DOS PASSOS BRAGA DE ALMEIDA' },
    { email: 'joseaparecidosilva@prof.educacao.sp.gov.br', nome: 'JOSÉ APARECIDO DA SILVA' },
    { email: 'jaregi@prof.educacao.sp.gov.br', nome: 'JÉSSICA GOMES DE MACÊDO FILHO' },
    { email: 'jufernani@prof.educacao.sp.gov.br', nome: 'JUREMA SCHEUBLE FURINI SANTOS' },
    { email: 'katyucia.abomfim@prof.educacao.sp.gov.br', nome: 'KATYUCIA ALVES DOMFIM' },
    { email: 'latinhaoli@prof.educacao.sp.gov.br', nome: 'LATINHA OLIVEIRA DE LIMA' },
    { email: 'luanafreitas@prof.educacao.sp.gov.br', nome: 'LUANA DE FREITAS SILVA' },
    { email: 'luanapavan@prof.educacao.sp.gov.br', nome: 'LUANA DE PAVAN' },
    { email: 'lnovaiscorrea@prof.educacao.sp.gov.br', nome: 'LUCIANA NOVAIS CORRÊA SANTOS' },
    { email: 'lucianomarteira@prof.educacao.sp.gov.br', nome: 'LUCIANO MOREIRA DE AZEVEDO' },
    { email: 'marcilasilva@prof.educacao.sp.gov.br', nome: 'MARCIEL DA SILVA' },
    { email: 'mmorig@prof.educacao.sp.gov.br', nome: 'MARIA HELENA CUNHA MORIG' },
    { email: 'quiterriasantos@prof.educacao.sp.gov.br', nome: 'MARIA QUITÉRIA FERREIRA DOS SANTOS' },
    { email: 'marcelapini@prof.educacao.sp.gov.br', nome: 'MARCELA SILVA SANTOS PINI' },
    { email: 'marinalfrancisco@prof.educacao.sp.gov.br', nome: 'MARINA L. FRANCISCO TIMÃO SILVA' },
    { email: 'mauriciodbarros@prof.educacao.sp.gov.br', nome: 'MAURICIO DE BARROS SANTOS' },
    { email: 'moniquepinto@prof.educacao.sp.gov.br', nome: 'MONIQUE DE PINTO MORAES' },
    { email: 'moiseabarros@prof.educacao.sp.gov.br', nome: 'MOISÉS ANTÔNIO LE BARROS' },
    { email: 'patriciamoraes@prof.educacao.sp.gov.br', nome: 'PATRICIA SOARES MORAES' },
    { email: 'paulaamani@prof.educacao.sp.gov.br', nome: 'PAULA AMANI VILA' },
    { email: 'pvatto@prof.educacao.sp.gov.br', nome: 'PAULO ROBERTO DA SILVA VATTO' },
    { email: 'pedrozanoti@prof.educacao.sp.gov.br', nome: 'PEDRO ZANOTI FILHO' },
    { email: 'pjunior@prof.educacao.sp.gov.br', nome: 'PEDRA PEREIRA MACEDO JUNIOR' },
    { email: 'reginacurtti@prof.educacao.sp.gov.br', nome: 'REGINA APARECIDA CURTT OLIVEIRA' },
    { email: 'reginacastro@prof.educacao.sp.gov.br', nome: 'REGINA DA SILVA CASTRO' },
    { email: 'renataaquino@prof.educacao.sp.gov.br', nome: 'RENATA MAGALHÃES AQUINO' },
    { email: 'ricardoamerico@prof.educacao.sp.gov.br', nome: 'RICARDO AMÉRICO DA SILVA' },
    { email: 'robertadelgado@prof.educacao.sp.gov.br', nome: 'ROBERTA DELGADO' },
    { email: 'rodrigovieira1@prof.educacao.sp.gov.br', nome: 'RODRIGO VIEIRA' },
    { email: 'romildasantos@prof.educacao.sp.gov.br', nome: 'ROMILDA APARECIDA MIRANDA' },
    { email: 'roseliaraujo1@prof.educacao.sp.gov.br', nome: 'ROSELI LUIZ ARAÚJO' },
    { email: 'rosrpereira2@prof.educacao.sp.gov.br', nome: 'ROSENILDA CARDOSO PESSOA' },
    { email: 'rosmaracardoso@prof.educacao.sp.gov.br', nome: 'ROSMARA DA SILVA CARDOSO' },
    { email: 'sandraestremacodoraes@prof.educacao.sp.gov.br', nome: 'SANDRA CRISTINA MACÊDO MORAES' },
    { email: 'sandradebiagi@prof.educacao.sp.gov.br', nome: 'SANDRA MARA DE BIAGI SANTOS' },
    { email: 'sergioagrino@prof.educacao.sp.gov.br', nome: 'SÉRGIO AGRÍPINO VILLA NOVA' },
    { email: 'simonesilva@prof.educacao.sp.gov.br', nome: 'SIMONE DA SILVA' },
    { email: 'almeidafabio@prof.educacao.sp.gov.br', nome: 'SOLANGE ALMEIDA DA SILVA' },
    { email: 'suzenileal@prof.educacao.sp.gov.br', nome: 'SUZENILDE SILVA NETO LEMES' },
    { email: 'titto@prof.educacao.sp.gov.br', nome: 'TITTO AUGUSTO NASCIMENTO SILVA' },
    { email: 'vanessai@prof.educacao.sp.gov.br', nome: 'VANESSA NÉ DE GOMES DOS SANTOS' },
    { email: 'vaniapenna@prof.educacao.sp.gov.br', nome: 'VANIA PENNA DE BARROS' },
    { email: 'vivianemgalvao@prof.educacao.sp.gov.br', nome: 'VIVIANE LEAL CÂMERA DE MORAES' },
    { email: 'vrivani@prof.educacao.sp.gov.br', nome: 'VIVIANE LEAL CÂMERA ALBORADAS' },
    { email: 'wilsonjunior@prof.educacao.sp.gov.br', nome: 'WILSON JUNIOR FERREIRA' },
];

/**
 * Verifica se o e-mail está registrado no sistema
 * IMPORTANTE: Apenas e-mails cadastrados em PROFESSORS_DB podem acessar a plataforma
 */
export const isProfessorRegistered = (email: string): boolean => {
    const lowerEmail = email.toLowerCase().trim();
    return PROFESSORS_DB.some(p => p.email.toLowerCase() === lowerEmail);
};

/**
 * Extrai o nome do professor a partir do e-mail
 * Se não encontrar no banco, tenta extrair do próprio e-mail
 */
export const getProfessorNameFromEmail = (email: string): string => {
    // Busca no banco de dados de professores
    const professor = PROFESSORS_DB.find(p => p.email.toLowerCase() === email.toLowerCase());

    if (professor) {
        return professor.nome;
    }

    // Se não encontrar, tenta extrair do e-mail
    // Exemplo: maria.silva@escola.com.br -> MARIA SILVA
    const emailUsername = email.split('@')[0];
    const nameParts = emailUsername.split(/[._-]/);
    const formattedName = nameParts
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');

    return formattedName.toUpperCase();
};
