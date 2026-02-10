/**
 * Google Apps Script para ler dados da planilha Google Sheets
 * VERSÃO DEFINITIVA: Suporte Total ao Formato Largo da Escola
 * 
 * INSTRUÇÕES:
 * 1. Substitua TODO o código por este.
 * 2. Implante como "Nova Versão" (Gerenciar implantações > Editar > Nova versão).
 * 3. Copie o URL da Web App se ele mudar.
 */

function doGet(e) {
    const sheetName = e.parameter.sheetName || 'BANCODEDADOSGERAL';
    const ss = SpreadsheetApp.openById('1u7qMsMHkZT47OZdar5qvshQDRA8XJrLgDjAZVOViAio');
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Aba não encontrada' })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return ContentService.createTextOutput(JSON.stringify({ success: true, students: [] })).setMimeType(ContentService.MimeType.JSON);

    const headers = data[0].map(String);
    const classAnchors = [];

    // Identifica todas as colunas que iniciam um bloco de turma
    headers.forEach((h, i) => {
        const title = h.toUpperCase().trim();
        if (title !== '' && (title.includes('ANO') || title.includes('SERIE') || title.includes('SÉRIE'))) {
            classAnchors.push({
                index: i,
                name: h.trim(),
                raOffset: 3 // Mapeado: RA fica 3 colunas após o Nome
            });
        }
    });

    const students = [];
    const rows = data.slice(1);

    rows.forEach(row => {
        classAnchors.forEach(anchor => {
            const name = row[anchor.index];
            const ra = row[anchor.index + anchor.raOffset];

            if (name && String(name).trim() !== '' && String(name).trim().toUpperCase() !== 'NOME') {
                students.push({
                    nome: String(name).trim().toUpperCase(),
                    ra: ra ? String(ra).trim().toLowerCase() : '---',
                    turma: anchor.name
                });
            }
        });
    });

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        count: students.length,
        students: students,
        debug: { classes: classAnchors.length }
    })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
    try {
        const payload = JSON.parse(e.postData.contents);
        const ss = SpreadsheetApp.openById('1u7qMsMHkZT47OZdar5qvshQDRA8XJrLgDjAZVOViAio');
        const sheet = ss.getSheetByName(payload.sheetName);
        if (sheet) {
            sheet.appendRow(payload.values);
            return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
        }
        return ContentService.createTextOutput(JSON.stringify({ success: false })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
}
