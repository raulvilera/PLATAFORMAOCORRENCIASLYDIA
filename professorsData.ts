// Mapeamento de e-mails institucionais para nomes de professores
// Este arquivo permite o preenchimento automático do nome do professor ao fazer login

export interface ProfessorData {
    email: string;
    nome: string;
}

export const PROFESSORS_DB: ProfessorData[] = [
    // Contas de gestão
    { email: 'gestao@escola.com', nome: 'GESTÃO ESCOLAR' },
    { email: 'vilera@prof.educacao.sp.gov.br', nome: 'RAUL VILERA - GESTÃO' },
    { email: 'cadastroslkm@gmail.com', nome: 'CADASTROS LKM - GESTÃO' },

    // Lista Completa Baseada na Imagem Oficial
    { email: 'luth@professor.educacao.sp.gov.br', nome: 'ALEX LUTH PEREIRA MARANHÃO' },
    { email: 'luth@prof.educacao.sp.gov.br', nome: 'ALEX LUTH PEREIRA MARANHÃO' },
    { email: 'avarella@professor.educacao.sp.gov.br', nome: 'ALEXANDRA PAULA VARELLA DE SOUZA' },
    { email: 'avarella@prof.educacao.sp.gov.br', nome: 'ALEXANDRA PAULA VARELLA DE SOUZA' },
    { email: 'alisonv@professor.educacao.sp.gov.br', nome: 'ALISON VASCONCELOS BESERRA' },
    { email: 'alisonv@prof.educacao.sp.gov.br', nome: 'ALISON VASCONCELOS BESERRA' },
    { email: 'anapereira08@professor.educacao.sp.gov.br', nome: 'ANA PAULA ALVES PEREIRA' },
    { email: 'anapereira08@prof.educacao.sp.gov.br', nome: 'ANA PAULA ALVES PEREIRA' },
    { email: 'sanfreitas@professor.educacao.sp.gov.br', nome: 'ANDREIA DOS SANTOS FREITAS' },
    { email: 'sanfreitas@prof.educacao.sp.gov.br', nome: 'ANDREIA DOS SANTOS FREITAS' },
    { email: 'andreiamadureira@professor.educacao.sp.gov.br', nome: 'ANDREIA MADUREIRA REIS' },
    { email: 'andreiamadureira@prof.educacao.sp.gov.br', nome: 'ANDREIA MADUREIRA REIS' },
    { email: 'antoniocarloso@professor.educacao.sp.gov.br', nome: 'ANTÔNIO CARLOS DE OLIVEIRA' },
    { email: 'antoniocarloso@prof.educacao.sp.gov.br', nome: 'ANTÔNIO CARLOS DE OLIVEIRA' },
    { email: 'antonioramosaraujo@professor.educacao.sp.gov.br', nome: 'ANTÔNIO RAMOS DE ARAUJO' },
    { email: 'antonioramosaraujo@prof.educacao.sp.gov.br', nome: 'ANTÔNIO RAMOS DE ARAUJO' },
    { email: 'antoniowilton@professor.educacao.sp.gov.br', nome: 'ANTÔNIO WILTON WANDERLEY CABRAL' },
    { email: 'antoniowilton@prof.educacao.sp.gov.br', nome: 'ANTÔNIO WILTON WANDERLEY CABRAL' },
    { email: 'augustolino@professor.educacao.sp.gov.br', nome: 'AUGUSTO LINO PESSOA NETO' },
    { email: 'augustolino@prof.educacao.sp.gov.br', nome: 'AUGUSTO LINO PESSOA NETO' },
    { email: 'carolinapermoniam@professor.educacao.sp.gov.br', nome: 'CAROLINA PERMONIAM PARUSSOLO' },
    { email: 'carolinapermoniam@prof.educacao.sp.gov.br', nome: 'CAROLINA PERMONIAM PARUSSOLO' },
    { email: 'charlesd@professor.educacao.sp.gov.br', nome: 'CHARLES DALAN JESUS DOS SANTOS' },
    { email: 'charlesd@prof.educacao.sp.gov.br', nome: 'CHARLES DALAN JESUS DOS SANTOS' },
    { email: 'cicero1@professor.educacao.sp.gov.br', nome: 'CÍCERO FERREIRA' },
    { email: 'cicero1@prof.educacao.sp.gov.br', nome: 'CÍCERO FERREIRA' },
    { email: 'aguiarl@professor.educacao.sp.gov.br', nome: 'CLAUDINEIA DE AGUIAR LIMA' },
    { email: 'aguiarl@prof.educacao.sp.gov.br', nome: 'CLAUDINEIA DE AGUIAR LIMA' },
    { email: 'danielalmeida@professor.educacao.sp.gov.br', nome: 'DANIEL DE FREITAS ALMEIDA' },
    { email: 'danielalmeida@prof.educacao.sp.gov.br', nome: 'DANIEL DE FREITAS ALMEIDA' },
    { email: 'daniellopesbarbosa@professor.educacao.sp.gov.br', nome: 'DANIEL LOPES BARBOSA' },
    { email: 'daniellopesbarbosa@prof.educacao.sp.gov.br', nome: 'DANIEL LOPES BARBOSA' },
    { email: 'danielaflima@professor.educacao.sp.gov.br', nome: 'DANIELA FERREIRA LIMA' },
    { email: 'danielaflima@prof.educacao.sp.gov.br', nome: 'DANIELA FERREIRA LIMA' },
    { email: 'deyseoliveira@professor.educacao.sp.gov.br', nome: 'DEYSE DE MIRANDA OLIVEIRA' },
    { email: 'deyseoliveira@prof.educacao.sp.gov.br', nome: 'DEYSE DE MIRANDA OLIVEIRA' },
    { email: 'ediane@professor.educacao.sp.gov.br', nome: 'EDIANE VIEIRA DA SILVA' },
    { email: 'ediane@prof.educacao.sp.gov.br', nome: 'EDIANE VIEIRA DA SILVA' },
    { email: 'edileusa@professor.educacao.sp.gov.br', nome: 'EDILEUSA NUNES PEREIRA' },
    { email: 'edileusa@prof.educacao.sp.gov.br', nome: 'EDILEUSA NUNES PEREIRA' },
    { email: 'henriquefonseca@professor.educacao.sp.gov.br', nome: 'EDUARDO HENRIQUE DA FONSECA' },
    { email: 'henriquefonseca@prof.educacao.sp.gov.br', nome: 'EDUARDO HENRIQUE DA FONSECA' },
    { email: 'essantos@professor.educacao.sp.gov.br', nome: 'ELIANE SANTOS SILVA' },
    { email: 'essantos@prof.educacao.sp.gov.br', nome: 'ELIANE SANTOS SILVA' },
    { email: 'elias1@professor.educacao.sp.gov.br', nome: 'ELIAS MONTEIRO DA SILVA' },
    { email: 'elias1@prof.educacao.sp.gov.br', nome: 'ELIAS MONTEIRO DA SILVA' },
    { email: 'elisabetepires@professor.educacao.sp.gov.br', nome: 'ELISABETE APARECIDA PIRES' },
    { email: 'elisabetepires@prof.educacao.sp.gov.br', nome: 'ELISABETE APARECIDA PIRES' },
    { email: 'egabler@professor.educacao.sp.gov.br', nome: 'EMERSON GABLER DE ALMEIDA' },
    { email: 'egabler@prof.educacao.sp.gov.br', nome: 'EMERSON GABLER DE ALMEIDA' },
    { email: 'erineidearagao@professor.educacao.sp.gov.br', nome: 'ERINEIDE LEITE ARAGÃO NERY' },
    { email: 'erineidearagao@prof.educacao.sp.gov.br', nome: 'ERINEIDE LEITE ARAGÃO NERY' },
    { email: 'euzeli@professor.educacao.sp.gov.br', nome: 'EUZELI ARAÚJO DE OLIVEIRA' },
    { email: 'euzeli@prof.educacao.sp.gov.br', nome: 'EUZELI ARAÚJO DE OLIVEIRA' },
    { email: 'fabianoaugusto@professor.educacao.sp.gov.br', nome: 'FABIANO AUGUSTO PIEDADE' },
    { email: 'fabianoaugusto@prof.educacao.sp.gov.br', nome: 'FABIANO AUGUSTO PIEDADE' },
    { email: 'camilof@professor.educacao.sp.gov.br', nome: 'FÁBIO CAMILO' },
    { email: 'camilof@prof.educacao.sp.gov.br', nome: 'FÁBIO CAMILO' },
    { email: 'fernandojs@professor.educacao.sp.gov.br', nome: 'FERNANDO JOSÉ DA SILVA FILHO' },
    { email: 'fernandojs@prof.educacao.sp.gov.br', nome: 'FERNANDO JOSÉ DA SILVA FILHO' },
    { email: 'flaviacri@professor.educacao.sp.gov.br', nome: 'FLÁVIA CRISTINA APARECIDA BICHLER' },
    { email: 'flaviacri@prof.educacao.sp.gov.br', nome: 'FLÁVIA CRISTINA APARECIDA BICHLER' },
    { email: 'flaviofleury@professor.educacao.sp.gov.br', nome: 'FLÁVIO CARDOSO FLEURY' },
    { email: 'flaviofleury@prof.educacao.sp.gov.br', nome: 'FLÁVIO CARDOSO FLEURY' },
    { email: 'gabrielaserighelli@professor.educacao.sp.gov.br', nome: 'GABRIELA SERIGHELLI DE MELO' },
    { email: 'gabrielaserighelli@prof.educacao.sp.gov.br', nome: 'GABRIELA SERIGHELLI DE MELO' },
    { email: 'gelsonalmeida@professor.educacao.sp.gov.br', nome: 'GELSON DE ALMEIDA BATISTA' },
    { email: 'gelsonalmeida@prof.educacao.sp.gov.br', nome: 'GELSON DE ALMEIDA BATISTA' },
    { email: 'genilton@professor.educacao.sp.gov.br', nome: 'GENILTON DE OLIVEIRA SILVA' },
    { email: 'genilton@prof.educacao.sp.gov.br', nome: 'GENILTON DE OLIVEIRA SILVA' },
    { email: 'oshikawa@professor.educacao.sp.gov.br', nome: 'IVANILDE DOS SANTOS OSHIKAWA' },
    { email: 'oshikawa@prof.educacao.sp.gov.br', nome: 'IVANILDE DOS SANTOS OSHIKAWA' },
    { email: 'janinabraga@professor.educacao.sp.gov.br', nome: 'JANINA DOS PASSOS BRAGA DE ALMEIDA' },
    { email: 'janinabraga@prof.educacao.sp.gov.br', nome: 'JANINA DOS PASSOS BRAGA DE ALMEIDA' },
    { email: 'joseaparecidosilva@professor.educacao.sp.gov.br', nome: 'JOSÉ APARECIDO DA SILVA' },
    { email: 'joseaparecidosilva@prof.educacao.sp.gov.br', nome: 'JOSÉ APARECIDO DA SILVA' },
    { email: 'juarezgomes@professor.educacao.sp.gov.br', nome: 'JUAREZ GOMES DE MAGALHÃES FILHO' },
    { email: 'juarezgomes@prof.educacao.sp.gov.br', nome: 'JUAREZ GOMES DE MAGALHÃES FILHO' },
    { email: 'juremas@professor.educacao.sp.gov.br', nome: 'JUREMA SOLEDADE FURINI SANTOS' },
    { email: 'juremas@prof.educacao.sp.gov.br', nome: 'JUREMA SOLEDADE FURINI SANTOS' },
    { email: 'katiusciabomfim@professor.educacao.sp.gov.br', nome: 'KATIUSCIA ALVES BOMFIM' },
    { email: 'katiusciabomfim@prof.educacao.sp.gov.br', nome: 'KATIUSCIA ALVES BOMFIM' },
    { email: 'luanalima01@professor.educacao.sp.gov.br', nome: 'LUANA CAROLINE ALVES LIMA' },
    { email: 'luanalima01@prof.educacao.sp.gov.br', nome: 'LUANA CAROLINE ALVES LIMA' },
    { email: 'luanafreitas@professor.educacao.sp.gov.br', nome: 'LUANA DE FREITAS SILVA' },
    { email: 'luanafreitas@prof.educacao.sp.gov.br', nome: 'LUANA DE FREITAS SILVA' },
    { email: 'luanapaiva01@professor.educacao.sp.gov.br', nome: 'LUANA DE PAIVA' },
    { email: 'luanapaiva01@prof.educacao.sp.gov.br', nome: 'LUANA DE PAIVA' },
    { email: 'novaiscorreia@professor.educacao.sp.gov.br', nome: 'LUCIANA NOVAIS CORREIA SANTOS' },
    { email: 'novaiscorreia@prof.educacao.sp.gov.br', nome: 'LUCIANA NOVAIS CORREIA SANTOS' },
    { email: 'lucianomoreira@professor.educacao.sp.gov.br', nome: 'LUCIANO MOREIRA DE AZEVEDO' },
    { email: 'lucianomoreira@prof.educacao.sp.gov.br', nome: 'LUCIANO MOREIRA DE AZEVEDO' },
    { email: 'marcielsilva@professor.educacao.sp.gov.br', nome: 'MARCIEL DA SILVA' },
    { email: 'marcielsilva@prof.educacao.sp.gov.br', nome: 'MARCIEL DA SILVA' },
    { email: 'marcunha@professor.educacao.sp.gov.br', nome: 'MARIA HELENA CUNHA MORO' },
    { email: 'marcunha@prof.educacao.sp.gov.br', nome: 'MARIA HELENA CUNHA MORO' },
    { email: 'quiteriasantos@professor.educacao.sp.gov.br', nome: 'MARIA QUITÉRIA FERREIRA DOS SANTOS' },
    { email: 'quiteriasantos@prof.educacao.sp.gov.br', nome: 'MARIA QUITÉRIA FERREIRA DOS SANTOS' },
    { email: 'mariceliasilva@professor.educacao.sp.gov.br', nome: 'MARICELIA SILVA SANTOS PINA' },
    { email: 'mariceliasilva@prof.educacao.sp.gov.br', nome: 'MARICELIA SILVA SANTOS PINA' },
    { email: 'marinafrancisco@professor.educacao.sp.gov.br', nome: 'MARINA DA CONCEIÇÃO FRANCISCO SILVA' },
    { email: 'marinafrancisco@prof.educacao.sp.gov.br', nome: 'MARINA DA CONCEIÇÃO FRANCISCO SILVA' },
    { email: 'mauriciobsantos@professor.educacao.sp.gov.br', nome: 'MAURÍCIO DE BARROS SANTOS' },
    { email: 'mauriciobsantos@prof.educacao.sp.gov.br', nome: 'MAURÍCIO DE BARROS SANTOS' },
    { email: 'michelepinhio@professor.educacao.sp.gov.br', nome: 'MICHELE DE PINHO MORAES' },
    { email: 'michelepinhio@prof.educacao.sp.gov.br', nome: 'MICHELE DE PINHO MORAES' },
    { email: 'moisesbarros@professor.educacao.sp.gov.br', nome: 'MOISÉS ANTÔNIO DE BARROS' },
    { email: 'moisesbarros@prof.educacao.sp.gov.br', nome: 'MOISÉS ANTÔNIO DE BARROS' },
    { email: 'patriciag@professor.educacao.sp.gov.br', nome: 'PATRÍCIA GOMES ROCHA RIBEIRO' },
    { email: 'patriciag@prof.educacao.sp.gov.br', nome: 'PATRÍCIA GOMES ROCHA RIBEIRO' },
    { email: 'paulaarmani@professor.educacao.sp.gov.br', nome: 'PAULA ARMANI VILA' },
    { email: 'paulaarmani@prof.educacao.sp.gov.br', nome: 'PAULA ARMANI VILA' },
    { email: 'pauloito@professor.educacao.sp.gov.br', nome: 'PAULO ROBERTO DA SILVA ITO' },
    { email: 'pauloito@prof.educacao.sp.gov.br', nome: 'PAULO ROBERTO DA SILVA ITO' },
    { email: 'pedrozanotti@professor.educacao.sp.gov.br', nome: 'PEDRO ZANOTTI FILHO' },
    { email: 'pedrozanotti@prof.educacao.sp.gov.br', nome: 'PEDRO ZANOTTI FILHO' },
    { email: 'vilera@professor.educacao.sp.gov.br', nome: 'RAUL PEREIRA VILERA JUNIOR' },
    { email: 'vilera@prof.educacao.sp.gov.br', nome: 'RAUL PEREIRA VILERA JUNIOR' },
    { email: 'regianecurti@professor.educacao.sp.gov.br', nome: 'REGIANE CURTI DE SOUZA OLIVEIRA' },
    { email: 'regianecurti@prof.educacao.sp.gov.br', nome: 'REGIANE CURTI DE SOUZA OLIVEIRA' },
    { email: 'reginasilvacastro@professor.educacao.sp.gov.br', nome: 'REGINA DA SILVA CASTRO' },
    { email: 'reginasilvacastro@prof.educacao.sp.gov.br', nome: 'REGINA DA SILVA CASTRO' },
    { email: 'renatahypolito@professor.educacao.sp.gov.br', nome: 'RENATA MAGALHÃES HYPOLITO' },
    { email: 'renatahypolito@prof.educacao.sp.gov.br', nome: 'RENATA MAGALHÃES HYPOLITO' },
    { email: 'ricardoamerico@professor.educacao.sp.gov.br', nome: 'RICARDO AMÉRICO DA SILVA' },
    { email: 'ricardoamerico@prof.educacao.sp.gov.br', nome: 'RICARDO AMÉRICO DA SILVA' },
    { email: 'robertosalgado@professor.educacao.sp.gov.br', nome: 'ROBERTO SALGADO' },
    { email: 'robertosalgado@prof.educacao.sp.gov.br', nome: 'ROBERTO SALGADO' },
    { email: 'rodrigovieira1@professor.educacao.sp.gov.br', nome: 'RODRIGO VIEIRA' },
    { email: 'rodrigovieira1@prof.educacao.sp.gov.br', nome: 'RODRIGO VIEIRA' },
    { email: 'rosanamiranda@professor.educacao.sp.gov.br', nome: 'ROSANA APARECIDA MIRANDA' },
    { email: 'rosanamiranda@prof.educacao.sp.gov.br', nome: 'ROSANA APARECIDA MIRANDA' },
    { email: 'roseliaraujo01@professor.educacao.sp.gov.br', nome: 'ROSELI LUIZ ARAÚJO' },
    { email: 'roseliaraujo01@prof.educacao.sp.gov.br', nome: 'ROSELI LUIZ ARAÚJO' },
    { email: 'rosimerypessoa@professor.educacao.sp.gov.br', nome: 'ROSIMERY DE SOUZA PESSOA' },
    { email: 'rosimerypessoa@prof.educacao.sp.gov.br', nome: 'ROSIMERY DE SOUZA PESSOA' },
    { email: 'rosmaracardoso@professor.educacao.sp.gov.br', nome: 'ROSMARA DA SILVA CARDOSO' },
    { email: 'rosmaracardoso@prof.educacao.sp.gov.br', nome: 'ROSMARA DA SILVA CARDOSO' },
    { email: 'sandracristinamacedo@professor.educacao.sp.gov.br', nome: 'SANDRA CRISTINA MACEDO MORAES' },
    { email: 'sandracristinamacedo@prof.educacao.sp.gov.br', nome: 'SANDRA CRISTINA MACEDO MORAES' },
    { email: 'sergioagripino@professor.educacao.sp.gov.br', nome: 'SÉRGIO AGRIPINO VILLA NOVA' },
    { email: 'sergioagripino@prof.educacao.sp.gov.br', nome: 'SÉRGIO AGRIPINO VILLA NOVA' },
    { email: 'silvasimone@professor.educacao.sp.gov.br', nome: 'SIMONE DA SILVA' },
    { email: 'silvasimone@prof.educacao.sp.gov.br', nome: 'SIMONE DA SILVA' },
    { email: 'almeidafazio@professor.educacao.sp.gov.br', nome: 'SOLANGE ALMEIDA DA SILVA' },
    { email: 'almeidafazio@prof.educacao.sp.gov.br', nome: 'SOLANGE ALMEIDA DA SILVA' },
    { email: 'suzineidefreitas@professor.educacao.sp.gov.br', nome: 'SUZINEIDE SILVA DE FREITAS' },
    { email: 'suzineidefreitas@prof.educacao.sp.gov.br', nome: 'SUZINEIDE SILVA DE FREITAS' },
    { email: 'titto@professor.educacao.sp.gov.br', nome: 'TITTO AUGUSTO NASCIMENTO SILVA' },
    { email: 'titto@prof.educacao.sp.gov.br', nome: 'TITTO AUGUSTO NASCIMENTO SILVA' },
    { email: 'vanessaivete@professor.educacao.sp.gov.br', nome: 'VANESSA IVETE GOMES DOS SANTOS' },
    { email: 'vanessaivete@prof.educacao.sp.gov.br', nome: 'VANESSA IVETE GOMES DOS SANTOS' },
    { email: 'vaniapenha@professor.educacao.sp.gov.br', nome: 'VANIA PENHA DE BARROS' },
    { email: 'vaniapenha@prof.educacao.sp.gov.br', nome: 'VANIA PENHA DE BARROS' },
    { email: 'camera@professor.educacao.sp.gov.br', nome: 'VIVIANE LEAL CÂMERA DE MORAES' },
    { email: 'camera@prof.educacao.sp.gov.br', nome: 'VIVIANE LEAL CÂMERA DE MORAES' },
    { email: 'wmota@professor.educacao.sp.gov.br', nome: 'WILSON RODRIGUES MOTA' },
    { email: 'wmota@prof.educacao.sp.gov.br', nome: 'WILSON RODRIGUES MOTA' },
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
