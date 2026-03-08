-- SCRIPT SQL PARA CRIAÇÃO DAS TABELAS DA E.E. FIORAVANTE IERVOLINO
-- Cole este código no "SQL Editor" do seu Supabase e clique em "Run".

-- 1. Tabela de Registros de Ocorrências (Isolada)
CREATE TABLE IF NOT EXISTS public.fioravante_records (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    date text NOT NULL,
    student_name text NOT NULL,
    class_room text,
    ra text,
    category text,
    description text,
    professor_name text,
    professor_email text,
    register_date text,
    return_date text,
    pdf_url text,
    source text, -- 'gestao' ou 'professor'
    status text DEFAULT 'Pendente',
    severity text DEFAULT 'Média',
    management_feedback text,
    discipline text,
    irregularities text,
    time text,
    last_viewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT fioravante_records_pkey PRIMARY KEY (id)
);

-- 2. Tabela de Alunos (Cache da Planilha)
CREATE TABLE IF NOT EXISTS public.fioravante_students (
    id text NOT NULL, -- Ex: synced-123456
    nome text NOT NULL,
    ra text,
    turma text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT fioravante_students_pkey PRIMARY KEY (id)
);

-- 3. Tabela de Professores Autorizados (Isolada)
CREATE TABLE IF NOT EXISTS public.fioravante_authorized_professors (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    email text NOT NULL,
    role text NOT NULL DEFAULT 'professor', -- 'gestor' ou 'professor'
    nome text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT fioravante_authorized_professors_pkey PRIMARY KEY (id),
    CONSTRAINT fioravante_authorized_professors_email_key UNIQUE (email)
);

-- 4. Habilitar RLS (Segurança)
ALTER TABLE public.fioravante_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fioravante_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fioravante_authorized_professors ENABLE ROW LEVEL SECURITY;

-- Polícias de acesso público
CREATE POLICY "Acesso Público Fioravante Records" ON public.fioravante_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Público Fioravante Students" ON public.fioravante_students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso Público Fioravante Professors" ON public.fioravante_authorized_professors FOR ALL USING (true) WITH CHECK (true);

-- 5. Inserir Gestores Iniciais
INSERT INTO public.fioravante_authorized_professors (email, role, nome)
VALUES 
('vilera@prof.educacao.sp.gov.br', 'gestor', 'RAUL VILERA'),
('gestao@escola.com', 'gestor', 'GESTÃO ESCOLAR'),
('cadastroslkm@gmail.com', 'gestor', 'CADASTROS LKM')
ON CONFLICT (email) DO NOTHING;
