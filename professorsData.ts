// Mapeamento de e-mails institucionais para nomes de professores
// Este arquivo permite o preenchimento automático do nome do professor ao fazer login

export interface ProfessorData {
    email: string;
    nome: string;
    role?: 'gestor' | 'professor';
}

export const PROFESSORS_DB: ProfessorData[] = [
    // Contas de gestão
    { email: 'gestao@escola.com', nome: 'GESTÃO ESCOLAR', role: 'gestor' },
    { email: 'vilera@prof.educacao.sp.gov.br', nome: 'RAUL VILERA - GESTÃO', role: 'gestor' },
    { email: 'cadastroslkm@gmail.com', nome: 'CADASTROS LKM - GESTÃO', role: 'gestor' },
    { email: 'alinecardoso1@prof.educacao.sp.gov.br', nome: 'ALINE CARDOSO - GESTÃO', role: 'gestor' },
    { email: 'alinecardoso1@professor.educacao.sp.gov.br', nome: 'ALINE CARDOSO - GESTÃO', role: 'gestor' },
    { email: 'aline.gestao@prof.educacao.sp.gov.br', nome: 'ALINE CARDOSO - GESTÃO', role: 'gestor' },
    { email: 'deizylaura@prof.educacao.sp.gov.br', nome: 'DEIZY LAURA - GESTÃO', role: 'gestor' },
    { email: 'anderson.ikawa@servidor.educacao.sp.gov.br', nome: 'ANDERSON IKAWA - GESTÃO', role: 'gestor' },

    // Nova Lista de Professores - E.E. Fioravante Iervolino
    { email: 'alexandreos@professor.educacao.sp.gov.br', nome: 'ALEXANDRE OLIVEIRA DOS SANTOS', role: 'professor' },
    { email: 'alexandreos@prof.educacao.sp.gov.br', nome: 'ALEXANDRE OLIVEIRA DOS SANTOS', role: 'professor' },
    { email: 'anapolito@professor.educacao.sp.gov.br', nome: 'ANA CAROLINA POLITO PINHEIRO', role: 'professor' },
    { email: 'anapolito@prof.educacao.sp.gov.br', nome: 'ANA CAROLINA POLITO PINHEIRO', role: 'professor' },
    { email: 'anasantos51@professor.educacao.sp.gov.br', nome: 'ANA PAULA DE SANTANA SANTOS', role: 'professor' },
    { email: 'anasantos51@prof.educacao.sp.gov.br', nome: 'ANA PAULA DE SANTANA SANTOS', role: 'professor' },
    { email: 'anielisilva@professor.educacao.sp.gov.br', nome: 'ANIELI SOFIA RODRIGUES DA SILVA', role: 'professor' },
    { email: 'anielisilva@prof.educacao.sp.gov.br', nome: 'ANIELI SOFIA RODRIGUES DA SILVA', role: 'professor' },
    { email: 'brunanicole@professor.educacao.sp.gov.br', nome: 'BRUNA NICOLE FERREIRA SANTOS', role: 'professor' },
    { email: 'brunanicole@prof.educacao.sp.gov.br', nome: 'BRUNA NICOLE FERREIRA SANTOS', role: 'professor' },
    { email: 'camilacostamonteiro@professor.educacao.sp.gov.br', nome: 'CAMILA COSTA MONTEIRO ROSSI', role: 'professor' },
    { email: 'camilacostamonteiro@prof.educacao.sp.gov.br', nome: 'CAMILA COSTA MONTEIRO ROSSI', role: 'professor' },
    { email: 'carolinamduarte@professor.educacao.sp.gov.br', nome: 'CAROLINA MARIA DUARTE', role: 'professor' },
    { email: 'carolinamduarte@prof.educacao.sp.gov.br', nome: 'CAROLINA MARIA DUARTE', role: 'professor' },
    { email: 'cintiabernadete@professor.educacao.sp.gov.br', nome: 'CINTIA BERNADETE FERRAZ MATAVELLI', role: 'professor' },
    { email: 'cintiabernadete@prof.educacao.sp.gov.br', nome: 'CINTIA BERNADETE FERRAZ MATAVELLI', role: 'professor' },
    { email: 'clarinetesilva@professor.educacao.sp.gov.br', nome: 'CLARINETE HELENA ALVES DA SILVA', role: 'professor' },
    { email: 'clarinetesilva@prof.educacao.sp.gov.br', nome: 'CLARINETE HELENA ALVES DA SILVA', role: 'professor' },
    { email: 'denisesalvatierra@professor.educacao.sp.gov.br', nome: 'DENISE SALVATIERRA ROMAO', role: 'professor' },
    { email: 'denisesalvatierra@prof.educacao.sp.gov.br', nome: 'DENISE SALVATIERRA ROMAO', role: 'professor' },
    { email: 'edvaniabarros@professor.educacao.sp.gov.br', nome: 'EDVANIA BEZERRA BARROS', role: 'professor' },
    { email: 'edvaniabarros@prof.educacao.sp.gov.br', nome: 'EDVANIA BEZERRA BARROS', role: 'professor' },
    { email: 'ellenmeire@professor.educacao.sp.gov.br', nome: 'ELLEN MEIRE MARIANO DE SOUSA REIS', role: 'professor' },
    { email: 'ellenmeire@prof.educacao.sp.gov.br', nome: 'ELLEN MEIRE MARIANO DE SOUSA REIS', role: 'professor' },
    { email: 'giselesalviato@professor.educacao.sp.gov.br', nome: 'GISELE SALVIATO CARNEIRO SINCIC', role: 'professor' },
    { email: 'giselesalviato@prof.educacao.sp.gov.br', nome: 'GISELE SALVIATO CARNEIRO SINCIC', role: 'professor' },
    { email: 'gcabrera@professor.educacao.sp.gov.br', nome: 'GISLENE CABRERA', role: 'professor' },
    { email: 'gcabrera@prof.educacao.sp.gov.br', nome: 'GISLENE CABRERA', role: 'professor' },
    { email: 'iaravlima@professor.educacao.sp.gov.br', nome: 'IARA VIEIRA LIMA', role: 'professor' },
    { email: 'iaravlima@prof.educacao.sp.gov.br', nome: 'IARA VIEIRA LIMA', role: 'professor' },
    { email: 'itamaras@professor.educacao.sp.gov.br', nome: 'ITAMARA SANTANA DE OLIVEIRA', role: 'professor' },
    { email: 'itamaras@prof.educacao.sp.gov.br', nome: 'ITAMARA SANTANA DE OLIVEIRA', role: 'professor' },
    { email: 'janeteg@professor.educacao.sp.gov.br', nome: 'JANETE GALDINO DOS SANTOS SOUZA', role: 'professor' },
    { email: 'janeteg@prof.educacao.sp.gov.br', nome: 'JANETE GALDINO DOS SANTOS SOUZA', role: 'professor' },
    { email: 'jocelma@professor.educacao.sp.gov.br', nome: 'JOCELMA FERREIRA DOS SANTOS', role: 'professor' },
    { email: 'jocelma@prof.educacao.sp.gov.br', nome: 'JOCELMA FERREIRA DOS SANTOS', role: 'professor' },
    { email: 'joycemarilia@professor.educacao.sp.gov.br', nome: 'JOYCE MARILIA DA SILVA DIAS', role: 'professor' },
    { email: 'joycemarilia@prof.educacao.sp.gov.br', nome: 'JOYCE MARILIA DA SILVA DIAS', role: 'professor' },
    { email: 'lainechagas@professor.educacao.sp.gov.br', nome: 'LAINE SÁ DE SOUZA CHAGAS', role: 'professor' },
    { email: 'lainechagas@prof.educacao.sp.gov.br', nome: 'LAINE SÁ DE SOUZA CHAGAS', role: 'professor' },
    { email: 'luizvieiragomes@professor.educacao.sp.gov.br', nome: 'LUIZ VIEIRA GOMES', role: 'professor' },
    { email: 'luizvieiragomes@prof.educacao.sp.gov.br', nome: 'LUIZ VIEIRA GOMES', role: 'professor' },
    { email: 'marciasaturnino@professor.educacao.sp.gov.br', nome: 'MARCIA BETIZ SATURNINO', role: 'professor' },
    { email: 'marciasaturnino@prof.educacao.sp.gov.br', nome: 'MARCIA BETIZ SATURNINO', role: 'professor' },
    { email: 'marciagomez@professor.educacao.sp.gov.br', nome: 'MARCIA RITA GOMEZ MALERBA', role: 'professor' },
    { email: 'marciagomez@prof.educacao.sp.gov.br', nome: 'MARCIA RITA GOMEZ MALERBA', role: 'professor' },
    { email: 'isagomes@professor.educacao.sp.gov.br', nome: 'MARIA ISABEL GOMES SANTANA FERNANDES', role: 'professor' },
    { email: 'isagomes@prof.educacao.sp.gov.br', nome: 'MARIA ISABEL GOMES SANTANA FERNANDES', role: 'professor' },
    { email: 'marianaventura@professor.educacao.sp.gov.br', nome: 'MARIANA CAROLINA BOA VENTURA', role: 'professor' },
    { email: 'marianaventura@prof.educacao.sp.gov.br', nome: 'MARIANA CAROLINA BOA VENTURA', role: 'professor' },
    { email: 'patricia.alexandre1@educacao.sp.gov.br', nome: 'PATRICIA DE OLIVEIRA ALEXANDRE VILERA', role: 'professor' },
    { email: 'patricia.alexandre1@servidor.educacao.sp.gov.br', nome: 'PATRICIA DE OLIVEIRA ALEXANDRE VILERA', role: 'professor' },
    { email: 'rosilenesan@professor.educacao.sp.gov.br', nome: 'ROSILENE SANTANA ALVES SILVA', role: 'professor' },
    { email: 'rosilenesan@prof.educacao.sp.gov.br', nome: 'ROSILENE SANTANA ALVES SILVA', role: 'professor' },
    { email: 'rosirenel@professor.educacao.sp.gov.br', nome: 'ROSIRENE LEME BERALDI GOTTARDI', role: 'professor' },
    { email: 'rosirenel@prof.educacao.sp.gov.br', nome: 'ROSIRENE LEME BERALDI GOTTARDI', role: 'professor' },
    { email: 'vanessacatiane@professor.educacao.sp.gov.br', nome: 'VANESSA CATIANE DA SILVA PORTO', role: 'professor' },
    { email: 'vanessacatiane@prof.educacao.sp.gov.br', nome: 'VANESSA CATIANE DA SILVA PORTO', role: 'professor' },
    { email: 'vanessardantas@professor.educacao.sp.gov.br', nome: 'VANESSA RODRIGUES DANTAS', role: 'professor' },
    { email: 'vanessardantas@prof.educacao.sp.gov.br', nome: 'VANESSA RODRIGUES DANTAS', role: 'professor' },
];

/**
 * Normaliza o e-mail institucional para o formato base para comparação
 */
const normalizeInstitutionalEmail = (email: string): string => {
    const [user, domain] = email.toLowerCase().trim().split('@');
    if (domain === 'prof.educacao.sp.gov.br' || domain === 'professor.educacao.sp.gov.br') {
        return `${user}@prof.educacao.sp.gov.br`;
    }
    return email.toLowerCase().trim();
};

/**
 * Verifica se o e-mail está registrado no sistema
 * IMPORTANTE: Apenas e-mails cadastrados em PROFESSORS_DB podem acessar a plataforma
 * Agora aceita automaticamente ambas as variantes (@prof e @professor)
 */
export const isProfessorRegistered = (email: string): boolean => {
    const normalizedTarget = normalizeInstitutionalEmail(email);
    return PROFESSORS_DB.some(p => normalizeInstitutionalEmail(p.email) === normalizedTarget);
};

/**
 * Extrai o nome do professor a partir do e-mail
 * Se não encontrar no banco, tenta extrair do próprio e-mail
 */
export const getProfessorNameFromEmail = (email: string): string => {
    const normalizedTarget = normalizeInstitutionalEmail(email);

    // Busca no banco de dados de professores usando e-mail normalizado
    const professor = PROFESSORS_DB.find(p => normalizeInstitutionalEmail(p.email) === normalizedTarget);

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

/**
 * Retorna o papel (role) do professor a partir do e-mail
 */
export const getProfessorRoleFromEmail = (email: string): 'gestor' | 'professor' | null => {
    const normalizedTarget = normalizeInstitutionalEmail(email);
    const professor = PROFESSORS_DB.find(p => normalizeInstitutionalEmail(p.email) === normalizedTarget);
    return professor?.role || null;
};
