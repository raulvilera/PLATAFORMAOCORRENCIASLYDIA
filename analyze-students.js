// Script para analisar problemas com listas de alunos
import { STUDENTS_DB } from './studentsData.ts';


console.log('📊 ANÁLISE DE DADOS DE ALUNOS\n');
console.log('Total de alunos no banco:', STUDENTS_DB.length);

// Agrupar por turma
const byClass = {};
STUDENTS_DB.forEach(student => {
    if (!byClass[student.turma]) {
        byClass[student.turma] = [];
    }
    byClass[student.turma].push(student);
});

console.log('\n📋 ALUNOS POR TURMA:');
Object.keys(byClass).sort().forEach(turma => {
    console.log(`${turma}: ${byClass[turma].length} alunos`);
});

// Verificar duplicatas de RA
console.log('\n🔍 VERIFICANDO DUPLICATAS DE RA:');
const raCount = {};
STUDENTS_DB.forEach(student => {
    if (!raCount[student.ra]) {
        raCount[student.ra] = [];
    }
    raCount[student.ra].push(student);
});

const duplicates = Object.entries(raCount).filter(([ra, students]) => students.length > 1);
if (duplicates.length > 0) {
    console.log(`⚠️ Encontradas ${duplicates.length} RAs duplicadas:`);
    duplicates.forEach(([ra, students]) => {
        console.log(`\n  RA: ${ra} (${students.length} ocorrências)`);
        students.forEach(s => {
            console.log(`    - ${s.nome} (${s.turma})`);
        });
    });
} else {
    console.log('✅ Nenhuma duplicata de RA encontrada');
}

// Verificar duplicatas de nome
console.log('\n🔍 VERIFICANDO DUPLICATAS DE NOME:');
const nameCount = {};
STUDENTS_DB.forEach(student => {
    const key = `${student.nome}|${student.turma}`;
    if (!nameCount[key]) {
        nameCount[key] = [];
    }
    nameCount[key].push(student);
});

const nameDuplicates = Object.entries(nameCount).filter(([key, students]) => students.length > 1);
if (nameDuplicates.length > 0) {
    console.log(`⚠️ Encontradas ${nameDuplicates.length} combinações nome+turma duplicadas:`);
    nameDuplicates.forEach(([key, students]) => {
        const [nome, turma] = key.split('|');
        console.log(`\n  ${nome} (${turma}) - ${students.length} ocorrências`);
        students.forEach(s => {
            console.log(`    - RA: ${s.ra}`);
        });
    });
} else {
    console.log('✅ Nenhuma duplicata de nome+turma encontrada');
}

// Verificar turmas listadas mas sem alunos
const DATA_TURMAS = [
    '6ºAno A', '6ºAno B', '6ºAno C', '6ºAno D', '6ºAno E', '6ºAno F',
    '7ºAno A', '7ºAno B', '7ºAno C', '7ºAno D', '7ºAno E', '7ºAno F',
    '8ºAno A', '8ºAno B', '8ºAno C', '8ºAno D', '8ºAno E', '8ºAno F',
    '9ºAno A', '9ºAno B', '9ºAno C', '9ºAno D',
    '1ª Série A', '1ª Série B', '1ª Série C', '1ª Série D', '1ª Série E', '1ª Série F', '1ª Série G', '1ª Série H',
    '2ª Série A', '2ª Série B', '2ª Série C', '2ª Série D', '2ª Série E', '2ª Série F', '2ª Série G', '2ª Série H',
    '3ª Série A', '3ª Série B', '3ª Série C', '3ª Série D', '3ª Série E', '3ª Série F', '3ª Série G', '3ª Série H'
];

console.log('\n📚 TURMAS SEM ALUNOS CADASTRADOS:');
const emptyClasses = DATA_TURMAS.filter(turma => !byClass[turma] || byClass[turma].length === 0);
if (emptyClasses.length > 0) {
    console.log(`⚠️ ${emptyClasses.length} turmas sem alunos:`);
    emptyClasses.forEach(turma => console.log(`  - ${turma}`));
} else {
    console.log('✅ Todas as turmas têm alunos cadastrados');
}

console.log('\n✅ Análise concluída!');
