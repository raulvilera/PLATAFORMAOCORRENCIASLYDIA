
import { Incident, Student } from '../types';

/**
 * URL do seu Google Apps Script implantado como Web App.
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxNOQ0u1PapmQZjsnRK2f8zzLGjvsoWdHAysrVarzqOfNtHzIxeK1-JYq95WVkSUA5Rdg/exec';

/**
 * Carrega a lista de alunos da planilha Google Sheets.
 * Aba: BANCODEDADOSGERAL
 */
export const loadStudentsFromSheets = async (): Promise<Student[]> => {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheetName=BANCODEDADOSGERAL`, {
      method: 'GET',
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.students)) {
      console.log(`✅ Google Sheets: Carregados ${data.students.length} alunos`);
      return data.students;
    }

    throw new Error('Formato de resposta inválido do Google Sheets');
  } catch (error) {
    console.error('❌ Erro ao carregar alunos do Google Sheets:', error);
    return [];
  }
};

export const saveToGoogleSheets = async (incident: Incident) => {
  try {
    const isGestao = incident.source === 'gestao';
    const sheetName = isGestao ? 'BANCODEALUNOS' : 'OCORRENCIASDOSPROFESSORES';

    /**
     * Usa a URL pública do PDF armazenado no Supabase Storage.
     * Se não houver URL (upload falhou), mostra mensagem de erro.
     */
    console.log(`📋 Google Sheets - Aluno: ${incident.studentName}, PDF URL:`, incident.pdfUrl || 'não disponível');

    const pdfLinkFormula = incident.pdfUrl
      ? `=HYPERLINK("${incident.pdfUrl}"; "📄 ABRIR PDF")`
      : "❌ PDF não gerado";

    const values = isGestao ? [
      incident.date,                           // 1. Data
      incident.studentName.toUpperCase(),      // 2. Aluno
      incident.classRoom || '---',             // 3. Turma
      incident.professorName?.toUpperCase() || 'GESTAO', // 4. Responsável
      incident.ra || '---',                    // 5. RA
      incident.category || 'OCORRÊNCIA',       // 6. Categoria
      incident.description.toUpperCase(),      // 7. Relato
      incident.registerDate || incident.date,  // 8. Registro
      incident.returnDate || 'N/A',            // 9. Retorno
      pdfLinkFormula                           // 10. Link PDF
    ] : [
      incident.date,                           // 1. Data
      incident.professorName?.toUpperCase() || '---', // 2. Professor
      incident.classRoom || '---',             // 3. Turma
      incident.studentName.toUpperCase(),      // 4. Aluno
      incident.ra || '---',                    // 5. RA
      incident.discipline?.toUpperCase() || 'N/A', // 6. Disciplina
      incident.irregularities?.toUpperCase() || 'NENHUMA', // 7. Irregularidades
      incident.description.toUpperCase(),      // 8. Relato
      incident.time || '---',                  // 9. Horário
      pdfLinkFormula                           // 10. Link PDF
    ];

    const payload = {
      sheetName: sheetName,
      values: values
    };

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return true;
  } catch (error) {
    console.error('Erro ao sincronizar com Google Sheets:', error);
    return false;
  }
};
