
import fs from 'fs';
import crypto from 'crypto';

let rawData = fs.readFileSync('./students_full_export.json', 'utf8');
// Remove BOM if present
if (rawData.charCodeAt(0) === 0xFEFF) {
    rawData = rawData.slice(1);
}
const studentsData = JSON.parse(rawData);

// Filtra cabeçalhos e entradas inválidas (como "coluna3" ou nomes muito curtos)
const cleanedStudents = studentsData.filter(s =>
    s.nome &&
    s.nome !== 'COLUNA2' &&
    s.nome.length > 5 &&
    s.ra &&
    s.ra !== 'coluna3' &&
    s.ra.length > 5
).map(s => ({
    id: crypto.randomUUID(),
    nome: s.nome.trim().toUpperCase(),
    ra: s.ra.trim().toLowerCase(),
    turma: s.turma.trim()
}));

console.log(`Total original no JSON: ${studentsData.length}`);
console.log(`Total de alunos válidos para importação: ${cleanedStudents.length}`);

// Salva o JSON limpo para referência futura se necessário
fs.writeFileSync('./students_cleaned.json', JSON.stringify(cleanedStudents, null, 2));

// Gera comandos SQL em chunks de 100 para evitar limites do Supabase
const chunkSize = 100;
for (let i = 0; i < cleanedStudents.length; i += chunkSize) {
    const chunk = cleanedStudents.slice(i, i + chunkSize);
    let sql = "INSERT INTO public.students (id, nome, ra, turma) VALUES \n";
    const values = chunk.map(s =>
        `('${s.id}', '${s.nome.replace(/'/g, "''")}', '${s.ra}', '${s.turma.replace(/'/g, "''")}')`
    ).join(",\n");
    sql += values + ";";

    fs.writeFileSync(`./sql_chunk_${Math.floor(i / chunkSize)}.sql`, sql);
}

console.log(`Sucesso: Gerados ${Math.ceil(cleanedStudents.length / chunkSize)} arquivos SQL preparados.`);
