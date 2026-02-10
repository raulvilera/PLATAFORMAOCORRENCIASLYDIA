-- ============================================
-- SCRIPT SQL PARA CRIAR TABELA STUDENTS
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. Criar tabela students se não existir
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  ra TEXT NOT NULL,
  turma TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_students_turma ON students(turma);
CREATE INDEX IF NOT EXISTS idx_students_ra ON students(ra);
CREATE INDEX IF NOT EXISTS idx_students_nome ON students(nome);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON students;
DROP POLICY IF EXISTS "Allow write access for managers" ON students;

-- 5. Política: Permitir leitura para todos autenticados
CREATE POLICY "Allow read access for authenticated users"
  ON students FOR SELECT
  TO authenticated
  USING (true);

-- 6. Política: Permitir insert/update/delete apenas para gestores
CREATE POLICY "Allow write access for managers"
  ON students FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' IN (
      'gestao@escola.com',
      'cadastroslkm@gmail.com',
      'vilera@prof.educacao.sp.gov.br'
    )
  );

-- 7. Verificar se a tabela foi criada
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'students'
ORDER BY ordinal_position;

-- 8. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'students';
