// Mapeamento de e-mails institucionais para nomes de professores
// Este arquivo permite o preenchimento automático do nome do professor ao fazer login

export interface ProfessorData {
    email: string;
    nome: string;
}

export const PROFESSORS_DB: ProfessorData[] = [
    // Adicione aqui os e-mails institucionais e nomes dos professores
    // Exemplo:
    // { email: 'maria.silva@prof.educacao.sp.gov.br', nome: 'MARIA SILVA' },
    // { email: 'joao.santos@professor.educacao.sp.gov.br', nome: 'JOÃO SANTOS' },
    { email: 'gestao@escola.com', nome: 'GESTÃO ESCOLAR' },
    { email: 'vilera@prof.educacao.sp.gov.br', nome: 'VILERA' },
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
