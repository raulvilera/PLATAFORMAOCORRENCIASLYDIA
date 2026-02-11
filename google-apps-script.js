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

    const headers = data[0].map(h => String(h).toUpperCase().trim());
    const classBlocks = [];

    // Identifica o início de cada bloco de turma e as colunas NOME e RA dentro dele
    headers.forEach((h, i) => {
        if (h !== '' && (h.includes('ANO') || h.includes('SERIE') || h.includes('SÉRIE'))) {
            // Procurar as colunas NOME e RA nos arredores (próximas 5 colunas)
            let nameIdx = -1;
            let raIdx = -1;

            for (let j = i; j < i + 5 && j < headers.length; j++) {
                const headerText = headers[j];
                if (headerText === 'NOME' && nameIdx === -1) nameIdx = j;
                if (headerText === 'RA' && raIdx === -1) raIdx = j;
            }

            if (nameIdx !== -1) {
                classBlocks.push({
                    className: h,
                    nameIndex: nameIdx,
                    raIndex: raIdx
                });
            }
        }
    });

    const students = [];
    const rows = data.slice(1);

    rows.forEach(row => {
        classBlocks.forEach(block => {
            const name = row[block.nameIndex];
            const ra = block.raIndex !== -1 ? row[block.raIndex] : '---';

            // Validação: deve ter nome, não ser apenas um número e não ser o próprio cabeçalho "NOME"
            if (name && String(name).trim() !== '' &&
                String(name).trim().toUpperCase() !== 'NOME' &&
                isNaN(Number(String(name).trim()))) { // Garante que não é um número (nº chamada)

                students.push({
                    nome: String(name).trim().toUpperCase(),
                    ra: ra ? String(ra).trim().toLowerCase() : '---',
                    turma: block.className
                });
            }
        });
    });

    return ContentService.createTextOutput(JSON.stringify({
        success: true,
        count: students.length,
        students: students,
        debug: { blocks: classBlocks.length }
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
