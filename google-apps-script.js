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

    const allSheets = ss.getSheets().map(s => s.getName());
    const data = sheet.getDataRange().getValues();

    if (data.length === 0) {
        return ContentService.createTextOutput(JSON.stringify({
            success: false,
            error: 'Planilha vazia',
            availableSheets: allSheets
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // Tentar encontrar a linha de cabeçalho (procura por "ANO" ou "SÉRIE" nas primeiras 5 linhas)
    let headerRowIndex = -1;
    for (let r = 0; r < Math.min(data.length, 5); r++) {
        const hasBlock = data[r].some(cell => {
            const val = String(cell).toUpperCase();
            return val.includes('ANO') || val.includes('SERIE') || val.includes('SÉRIE');
        });
        if (hasBlock) {
            headerRowIndex = r;
            break;
        }
    }

    if (headerRowIndex === -1) {
        return ContentService.createTextOutput(JSON.stringify({
            success: true,
            count: 0,
            students: [],
            debug: {
                error: 'Nenhum cabeçalho de turma encontrado nas primeiras 5 linhas',
                firstRowPreview: data[0].slice(0, 5),
                availableSheets: allSheets
            }
        })).setMimeType(ContentService.MimeType.JSON);
    }

    const headers = data[headerRowIndex].map(h => String(h).toUpperCase().trim());
    const subHeaders = data[headerRowIndex + 1] ? data[headerRowIndex + 1].map(h => String(h).toUpperCase().trim()) : [];
    const classBlocks = [];

    // Identifica o início de cada bloco de turma
    headers.forEach((h, i) => {
        if (h !== '' && (h.includes('ANO') || h.includes('SERIE') || h.includes('SÉRIE'))) {
            // No formato específico da escola:
            // 1. O Nome do aluno está na MESMA coluna do título da turma (ex: Ano6ºA)
            // 2. O RA está 3 colunas à direita (ou onde estiver escrito 'RA' no subHeader)

            let nameIdx = i; // Por padrão, o nome está na coluna da turma
            let raIdx = i + 3; // Por padrão, RA está 3 colunas depois

            // Refinamento: procurar o texto "RA" nas próximas 5 colunas para ter certeza
            for (let j = i; j < i + 6 && j < headers.length; j++) {
                if (subHeaders[j] === 'RA' || headers[j] === 'RA') {
                    raIdx = j;
                    break;
                }
            }

            classBlocks.push({
                className: h,
                nameIndex: nameIdx,
                raIndex: raIdx
            });
        }
    });

    const students = [];
    // Pula o cabeçalho e o sub-cabeçalho
    const dataStartRow = headerRowIndex + 2;
    const rows = data.slice(dataStartRow);

    rows.forEach(row => {
        classBlocks.forEach(block => {
            const name = row[block.nameIndex];
            const ra = row[block.raIndex];

            // Validação: deve ter nome, não ser apenas um número e não ser o próprio cabeçalho
            if (name && String(name).trim() !== '' &&
                String(name).trim().toUpperCase() !== 'NOME' &&
                isNaN(Number(String(name).trim()))) {

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
        debug: {
            blocks: classBlocks.length,
            sheetUsed: sheetName,
            headerRow: headerRowIndex + 1,
            detectedHeaders: headers.slice(0, 20),
            subHeadersPreview: subHeaders.slice(0, 20),
            availableSheets: allSheets
        }
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
