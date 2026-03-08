/**
 * ============================================================
 * Google Apps Script — EE LYDIA KITZ MOREIRA
 * VERSÃO DEFINITIVA v3 — Leitura Completa e Robusta
 * ============================================================
 *
 * FUNCIONALIDADES:
 *  - doGet  → Lê todos os alunos de todas as turmas da planilha
 *  - doPost → Registra dados (ocorrências/respostas) na planilha
 *
 * SUPORTE:
 *  - Formato largo: múltiplos blocos de turma por linha (ex: BA3:BD)
 *  - Nomes de turma: "7ºAno A", "7º ANO E", "7ANO E", "6ª SERIE B", etc.
 *  - Busca cabeçalho nas primeiras 15 linhas
 *  - Busca coluna RA nas próximas 10 colunas de cada bloco
 *  - Deduplicação automática de alunos (mesmo nome + mesma turma)
 *  - Segurança: validação de payload no doPost
 *
 * INSTRUÇÕES DE DEPLOY:
 *  1. Cole TODO este código no Google Apps Script.
 *  2. Clique em "Gerenciar implantações" → "Editar" → "Nova versão".
 *  3. Confirme o URL da Web App (copie se mudou).
 *  4. Acesso: "Qualquer pessoa" (sem autenticação).
 * ============================================================
 */

// ─── CONSTANTES ─────────────────────────────────────────────
const SPREADSHEET_ID = '1I2e7NexDqkZZ6Pc6fEQ6QTJCdY2xGgo_SicORFv4zGI';
var DEFAULT_SHEET = 'BANCODEDADOSGERAL';

// Quantas linhas iniciais verificar procurando o cabeçalho de turmas
var MAX_HEADER_SCAN_ROWS = 30;

// Quantas colunas à frente de cada turma verificar para encontrar "RA"
var MAX_RA_SCAN_COLS = 15;


// ─── UTILITÁRIOS ────────────────────────────────────────────

/**
 * Normaliza uma string removendo acentos, símbolos ordinais e espaços extras.
 * Retorna MAIÚSCULO sem acentos para comparação uniforme.
 */
function normalizeStr(val) {
    if (val === null || val === undefined) return '';
    return String(val)
        .trim()
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')   // Remove acentos
        .replace(/[º°ª.]/g, '')            // Remove ordinais e pontos
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Detecta se uma célula representa um cabeçalho de turma.
 * Aceita formatos variados usados pela escola:
 *   "7ºAno A", "7º ANO E", "7 ANO E", "7ANO E",
 *   "6ª SERIE B", "6 SERIE A", "9ANO", "9 ANO", etc.
 */
function isClassHeader(val) {
    if (val === null || val === undefined) return false;
    var raw = String(val).trim();
    if (raw === '') return false;

    var s = normalizeStr(raw);

    // Regex mais abrangente para capturar turmas como "7ANO E", "1SERIE A", "7A", etc.
    return (
        /\d+\s*(ANO|SERIE|EM)/i.test(s) ||   // "7 ANO A", "6 SERIE B", "1 EM A"
        /^(ANO|SERIE|EM)\s*\d+/i.test(s) || // "ANO 7", "SERIE 6"
        /^\d+\s*[A-Z](\s|$)/i.test(s)        // "7A", "8 B"
    );
}

/**
 * Retorna uma resposta JSON padronizada.
 */
function jsonResponse(obj) {
    return ContentService
        .createTextOutput(JSON.stringify(obj))
        .setMimeType(ContentService.MimeType.JSON);
}


// ─── doGet: LEITURA DE ALUNOS ────────────────────────────────

function doGet(e) {
    try {
        var params = e.parameter || {};
        var sheetName = params.sheetName || DEFAULT_SHEET;

        var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        var sheet = ss.getSheetByName(sheetName);
        var allSheets = ss.getSheets().map(function (s) { return s.getName(); });

        // ── Aba não encontrada
        if (!sheet) {
            return jsonResponse({
                success: false,
                error: 'Aba "' + sheetName + '" não encontrada.',
                availableSheets: allSheets
            });
        }

        var data = sheet.getDataRange().getValues();

        // ── Planilha vazia
        if (!data || data.length === 0) {
            return jsonResponse({
                success: false,
                error: 'A planilha está vazia.',
                availableSheets: allSheets
            });
        }

        // ── 1. Encontrar a linha de cabeçalho de turmas
        var headerRowIndex = -1;
        for (var r = 0; r < Math.min(data.length, MAX_HEADER_SCAN_ROWS); r++) {
            var rowHasClass = data[r].some(function (cell) {
                return isClassHeader(cell);
            });
            if (rowHasClass) {
                headerRowIndex = r;
                break;
            }
        }

        if (headerRowIndex === -1) {
            return jsonResponse({
                success: true,
                count: 0,
                students: [],
                debug: {
                    warning: 'Nenhum cabeçalho de turma encontrado nas primeiras ' + MAX_HEADER_SCAN_ROWS + ' linhas.',
                    primeirasLinhas: data.slice(0, 3).map(function (row) {
                        return row.slice(0, 10).map(String);
                    }),
                    availableSheets: allSheets
                }
            });
        }

        // ── 2. Mapear cabeçalhos e sub-cabeçalhos
        var headerRow = data[headerRowIndex];
        var subHeaderRow = (data[headerRowIndex + 1]) ? data[headerRowIndex + 1] : [];

        var headers = headerRow.map(function (h) { return normalizeStr(h); });
        var subHeaders = subHeaderRow.map(function (h) { return normalizeStr(h); });

        // ── 3. Identificar todos os blocos de turma
        var classBlocks = [];

        for (var i = 0; i < headers.length; i++) {
            if (!isClassHeader(headerRow[i])) continue;

            var className = normalizeStr(headerRow[i]);
            var nameIdx = i;  // Coluna do NOME do aluno = mesma coluna do título da turma
            var raIdx = -1; // Será descoberto abaixo

            // Procura "RA" nas colunas imediatamente seguintes
            for (var j = i + 1; j < Math.min(i + MAX_RA_SCAN_COLS, headers.length); j++) {
                if (subHeaders[j] === 'RA' || headers[j] === 'RA') {
                    raIdx = j;
                    break;
                }
            }

            // Se não achou "RA", usa a convenção da escola: RA está 3 colunas à direita do nome
            if (raIdx === -1) {
                raIdx = i + 3;
            }

            classBlocks.push({
                className: className,
                nameIndex: nameIdx,
                raIndex: raIdx
            });
        }

        // ── 4. Extrair alunos de cada bloco
        var students = [];
        var seenKeys = {};           // Para deduplicar entradas idênticas
        var dataStart = headerRowIndex + 2; // Pula cabeçalho + sub-cabeçalho

        for (var rowIdx = dataStart; rowIdx < data.length; rowIdx++) {
            var row = data[rowIdx];

            for (var b = 0; b < classBlocks.length; b++) {
                var block = classBlocks[b];
                var rawName = row[block.nameIndex];
                var rawRA = row[block.raIndex];

                var nameStr = (rawName !== null && rawName !== undefined) ? String(rawName).trim() : '';

                // Ignora células vazias, numéricas isoladas ou que repetem cabeçalhos
                if (!nameStr) continue;
                if (!isNaN(Number(nameStr))) continue;
                var nameNorm = normalizeStr(nameStr);
                if (nameNorm === 'NOME' || nameNorm === 'ALUNO' || nameNorm === '') continue;
                // Ignora se o valor da célula for um cabeçalho de turma (linha de separação)
                if (isClassHeader(rawName)) continue;

                var raStr = (rawRA !== null && rawRA !== undefined) ? String(rawRA).trim() : '';
                if (!raStr || isNaN(Number(raStr))) {
                    raStr = '---';
                }

                // Deduplicação: chave = nome normalizado + turma
                var dedupKey = nameNorm + '||' + block.className;
                if (seenKeys[dedupKey]) continue;
                seenKeys[dedupKey] = true;

                students.push({
                    nome: nameNorm,
                    ra: raStr.toLowerCase(),
                    turma: block.className
                });
            }
        }

        // ── 5. Retornar resultado
        return jsonResponse({
            success: true,
            count: students.length,
            students: students,
            debug: {
                sheetUsed: sheetName,
                headerRow: headerRowIndex + 1,
                totalRows: data.length,
                totalCols: headers.length,
                classBlocksDetected: classBlocks.map(function (b) {
                    return b.className + ' (nome:' + b.nameIndex + ', ra:' + b.raIndex + ')';
                }),
                availableSheets: allSheets
            }
        });

    } catch (err) {
        return jsonResponse({
            success: false,
            error: 'Erro interno no doGet: ' + err.toString()
        });
    }
}


// ─── doPost: REGISTRO DE DADOS ───────────────────────────────

function doPost(e) {
    try {
        // Garante que o body existe
        if (!e || !e.postData || !e.postData.contents) {
            return jsonResponse({ success: false, error: 'Payload ausente ou inválido.' });
        }

        var payload = JSON.parse(e.postData.contents);

        // Campos obrigatórios
        if (!payload.sheetName) {
            return jsonResponse({ success: false, error: 'Campo "sheetName" obrigatório.' });
        }
        if (!Array.isArray(payload.values) || payload.values.length === 0) {
            return jsonResponse({ success: false, error: 'Campo "values" deve ser um array não vazio.' });
        }

        var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        var sheet = ss.getSheetByName(payload.sheetName);

        if (!sheet) {
            return jsonResponse({
                success: false,
                error: 'Aba "' + payload.sheetName + '" não encontrada para escrita.'
            });
        }

        sheet.appendRow(payload.values);

        return jsonResponse({ success: true, message: 'Dados registrados com sucesso.' });

    } catch (err) {
        return jsonResponse({
            success: false,
            error: 'Erro interno no doPost: ' + err.toString()
        });
    }
}
