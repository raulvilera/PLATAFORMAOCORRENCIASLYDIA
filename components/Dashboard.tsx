
import React, { useState, useMemo, useRef } from 'react';
import { Incident, User, Student } from '../types';
import { generateIncidentPDF, uploadPDFToStorage } from '../services/pdfService';
import StatusBadge from './StatusBadge';
import { supabase } from '../services/supabaseClient';

interface DashboardProps {
  user: User;
  incidents: Incident[];
  students: Student[];
  classes: string[];
  onSave: (incident: Incident) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
  onOpenSearch: () => void;
  onUpdateIncident?: (incident: Incident) => void;
  onSyncStudents?: () => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({ user, incidents, students, classes, onSave, onDelete, onLogout, onOpenSearch, onUpdateIncident, onSyncStudents }) => {
  const [classRoom, setClassRoom] = useState('');
  const [studentName, setStudentName] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [classification, setClassification] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [selectedIrregularities, setSelectedIrregularities] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [registerDate, setRegisterDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const regDateRef = useRef<HTMLInputElement>(null);
  const retDateRef = useRef<HTMLInputElement>(null);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState<Incident | null>(null);
  const [newStatus, setNewStatus] = useState<Incident['status']>('Pendente');
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<'registros' | 'estatisticas'>('registros');

  // Estados para Gerenciamento de Professores
  const [showProfessorsModal, setShowProfessorsModal] = useState(false);
  const [professorsList, setProfessorsList] = useState<{ email: string, nome: string }[]>([]);
  const [newProfEmail, setNewProfEmail] = useState('');
  const [newProfNome, setNewProfNome] = useState('');
  const [isManagingProfs, setIsManagingProfs] = useState(false);

  // Estados para Busca no Histórico Permanente
  const [showPermanentSearch, setShowPermanentSearch] = useState(false);
  const [permanentSearchTerm, setPermanentSearchTerm] = useState('');
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<Student | null>(null);
  const [studentHistory, setStudentHistory] = useState<Incident[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const ra = useMemo(() => {
    const s = students.find(st => st.nome === studentName && st.turma === classRoom);
    return s ? s.ra : '---';
  }, [studentName, classRoom, students]);

  const fetchStudentHistory = async (student: Student) => {
    setIsLoadingHistory(true);
    setSelectedStudentForHistory(student);
    try {
      const { data, error } = await supabase
        .from('fioravante_records')
        .select('*')
        .eq('ra', student.ra)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setStudentHistory(data.map(i => ({
          id: i.id,
          studentName: i.student_name,
          ra: i.ra,
          classRoom: i.class_room,
          professorName: i.professor_name,
          discipline: i.discipline,
          date: i.date,
          time: i.time,
          registerDate: i.register_date,
          returnDate: i.return_date,
          description: i.description,
          irregularities: i.irregularities,
          category: i.category,
          severity: i.severity as any,
          status: i.status as any,
          source: i.source as any,
          pdfUrl: i.pdf_url,
          authorEmail: i.author_email,
          managementFeedback: i.management_feedback,
          lastViewedAt: i.last_viewed_at
        })));
      }
    } catch (e) {
      console.error("Erro ao buscar histórico:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!permanentSearchTerm) return [];
    return students.filter(s =>
      s.nome.toUpperCase().startsWith(permanentSearchTerm.toUpperCase())
    ).slice(0, 10); // Limitar a 10 resultados para performance e UI
  }, [students, permanentSearchTerm]);

  const triggerPicker = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      try {
        if ((ref.current as any).showPicker) {
          (ref.current as any).showPicker();
        } else {
          ref.current.focus();
        }
      } catch (err) {
        ref.current.focus();
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !description || !classRoom || !classification || !professorName) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSaving(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = registerDate.split('-').reverse().join('/');
    const uniqueId = `gest-${Date.now()}`;

    const newInc: Incident = {
      id: uniqueId,
      classRoom,
      studentName: studentName.toUpperCase(),
      professorName: professorName.toUpperCase(),
      ra,
      date: formattedDate,
      time: timeStr,
      registerDate: formattedDate,
      returnDate: classification === 'MEDIDA EDUCATIVA' && returnDate ? returnDate.split('-').reverse().join('/') : undefined,
      discipline: (discipline || 'N/A').toUpperCase(),
      irregularities: selectedIrregularities.join(', '),
      description: description.toUpperCase(),
      severity: 'Média',
      status: 'Pendente',
      category: classification,
      source: 'gestao',
      authorEmail: user.email
    };

    onSave(newInc);
    setStudentName('');
    setDescription('');
    setReturnDate('');
    setIsSaving(false);
  };

  const openUpdateModal = (inc: Incident) => {
    setIsUpdatingStatus(inc);
    setNewStatus(inc.status);
    setFeedback(inc.managementFeedback || '');
  };

  const handleUpdateStatus = () => {
    if (!isUpdatingStatus || !onUpdateIncident) return;

    const updated: Incident = {
      ...isUpdatingStatus,
      status: newStatus,
      managementFeedback: feedback.toUpperCase(),
      lastViewedAt: new Date().toISOString()
    };

    onUpdateIncident(updated);
    setIsUpdatingStatus(null);
  };

  const fetchProfessors = async () => {
    setIsManagingProfs(true);
    const { data, error } = await supabase.from('fioravante_authorized_professors').select('email, nome').order('nome');
    if (data) setProfessorsList(data);
    setIsManagingProfs(false);
  };

  const handleAddProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfEmail || !newProfNome) return;

    setIsManagingProfs(true);
    const { error } = await supabase.from('fioravante_authorized_professors').insert([
      { email: newProfEmail.toLowerCase().trim(), nome: newProfNome.toUpperCase().trim() }
    ]);

    if (error) {
      alert("Erro ao adicionar professor: " + error.message);
    } else {
      setNewProfEmail('');
      setNewProfNome('');
      await fetchProfessors();
    }
    setIsManagingProfs(false);
  };

  const handleRemoveProfessor = async (email: string) => {
    if (!confirm(`Deseja remover o acesso de ${email}?`)) return;

    setIsManagingProfs(true);
    const { error } = await supabase.from('authorized_professors').delete().eq('email', email);

    if (error) {
      alert("Erro ao remover: " + error.message);
    } else {
      await fetchProfessors();
    }
    setIsManagingProfs(false);
  };

  const history = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return incidents.filter(i =>
      (i.studentName || "").toLowerCase().includes(term) ||
      (i.classRoom || "").toLowerCase().includes(term) ||
      (i.professorName || "").toLowerCase().includes(term)
    );
  }, [incidents, searchTerm]);

  // Lógica de Estatísticas
  const stats = useMemo(() => {
    const classCount: Record<string, number> = {};
    const studentCount: Record<string, { count: number, turma: string }> = {};
    const typeCount: Record<string, number> = {};
    const profCount: Record<string, number> = {};
    const managerCount: Record<string, number> = {};

    incidents.forEach(inc => {
      // Top Turmas
      if (inc.classRoom) {
        classCount[inc.classRoom] = (classCount[inc.classRoom] || 0) + 1;
      }

      // Top Alunos
      if (inc.studentName) {
        if (!studentCount[inc.studentName]) {
          studentCount[inc.studentName] = { count: 0, turma: inc.classRoom || 'N/A' };
        }
        studentCount[inc.studentName].count++;
      }

      // Top Tipos
      if (inc.category) {
        typeCount[inc.category] = (typeCount[inc.category] || 0) + 1;
      }

      // Top Professores (Apenas registros de professores)
      if (inc.source === 'professor' && inc.professorName) {
        profCount[inc.professorName] = (profCount[inc.professorName] || 0) + 1;
      }

      // Top Gestores (Apenas registros de gestão)
      if (inc.source === 'gestao' && inc.professorName) {
        managerCount[inc.professorName] = (managerCount[inc.professorName] || 0) + 1;
      }
    });

    const topClasses = Object.entries(classCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topStudents = Object.entries(studentCount)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);

    const topTypes = Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1]);

    const topProfs = Object.entries(profCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topManagers = Object.entries(managerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { topClasses, topStudents, topTypes, topProfs, topManagers };
  }, [incidents]);

  const pedagogicalGuide = {
    'OCORRÊNCIA DISCIPLINAR': [
      'Advertência verbal ou escrita',
      'Convocação dos pais ou responsáveis para mediação',
      'Encaminhamento para o Conselho de Escola',
      'Suspensão temporária (casos graves)'
    ],
    'OCORRÊNCIA PEDAGÓGICA': [
      'Reforço escolar ou recuperação paralela',
      'Acompanhamento psicopedagógico',
      'Adaptação de atividades curriculares',
      'Criação de plano de estudo individualizado'
    ],
    'MEDIDA EDUCATIVA': [
      'Monitoria voluntária por período determinado',
      'Escrita de reflexão crítica sobre o ocorrido',
      'Serviço de apoio à organização da biblioteca/escola',
      'Apresentação de trabalho sobre cidadania'
    ]
  };

  return (
    <div className="min-h-screen bg-[#001a35] font-sans pb-12 overflow-x-hidden">
      <header className="bg-white/20 backdrop-blur-md text-[#001a35] px-4 sm:px-8 py-3 flex flex-col sm:flex-row justify-between items-center border-b border-white/20 sticky top-0 z-[50] shadow-xl gap-2 sm:gap-0">
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#001a35] text-center sm:text-left">Gestão Fioravante Iervolino 2026</h1>
          <p className="text-[8px] sm:text-[9px] font-bold text-[#001a35]/60 uppercase">Painel de Controle Administrativo</p>
        </div>
        <div className="flex gap-4 sm:gap-6 items-center">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase">{user.email}</span>
            <span className="text-[8px] font-bold text-orange-500 uppercase">Nível: Administrador</span>
          </div>
          <button onClick={onLogout} className="bg-white hover:bg-red-50 text-[#002b5c] px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase shadow-lg transition-all active:scale-95">Sair</button>
          <button
            onClick={() => { setShowProfessorsModal(true); fetchProfessors(); }}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            Professores
          </button>
          {onSyncStudents && (
            <button
              onClick={onSyncStudents}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase shadow-lg transition-all active:scale-95 flex items-center gap-2"
              title="Sincronizar alunos do Google Sheets para o Supabase"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sincronizar Alunos
            </button>
          )}
        </div>
      </header>

      {/* Navegação de Abas Principal */}
      <nav className="max-w-[1700px] mx-auto mt-6 px-4 sm:px-6 flex gap-4">
        <button
          onClick={() => setActiveTab('registros')}
          className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all shadow-lg ${activeTab === 'registros' ? 'bg-teal-500 text-white border-b-4 border-teal-700' : 'bg-white/10 text-white/40 hover:bg-white/20'}`}
        >
          📄 Registros e Lançamentos
        </button>
        <button
          onClick={() => setActiveTab('estatisticas')}
          className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all shadow-lg ${activeTab === 'estatisticas' ? 'bg-orange-500 text-white border-b-4 border-orange-700 animate-pulse' : 'bg-white/10 text-white/40 hover:bg-white/20'}`}
        >
          📊 Dashboard Analytics
        </button>
      </nav>

      <main className="max-w-[1700px] mx-auto mt-6 sm:mt-8 px-4 sm:px-6 space-y-8 sm:space-y-10">
        {activeTab === 'registros' && (
          <>
            <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white/10">
              <div className="bg-[#004a99] py-3 text-center border-b border-white/10">
                <h2 className="text-white font-black text-[10px] sm:text-xs uppercase tracking-widest">EFETUAR NOVO REGISTRO ADMINISTRATIVO</h2>
              </div>

              <div className="p-6 sm:p-10 bg-gradient-to-br from-[#115e59] via-[#14b8a6] to-[#ea580c]">
                <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
                    <div className="flex flex-col gap-2 w-full lg:w-48">
                      <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">TURMA / SÉRIE</label>
                      <select
                        value={classRoom}
                        onChange={e => { setClassRoom(e.target.value); setStudentName(''); }}
                        className="h-12 sm:h-14 border border-gray-200 rounded-2xl px-5 text-xs font-bold !text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer w-full"
                      >
                        <option value="">Selecione...</option>
                        {classes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 w-full lg:flex-1">
                      <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">NOME DO ALUNO</label>
                      <select
                        value={studentName}
                        onChange={e => setStudentName(e.target.value)}
                        disabled={!classRoom}
                        className="h-12 sm:h-14 border border-gray-200 rounded-2xl px-5 text-xs font-bold !text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm disabled:opacity-50 cursor-pointer w-full"
                      >
                        <option value="">Selecione o Aluno...</option>
                        {students.filter(s => s.turma === classRoom).map(s => <option key={s.ra} value={s.nome}>{s.nome}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 w-full lg:w-64">
                      <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">REGISTRO DO ALUNO (RA)</label>
                      <div className="h-12 sm:h-14 flex items-center px-6 bg-white/20 rounded-2xl font-black text-white text-xs border border-white/20 shadow-inner backdrop-blur-sm w-full">
                        {ra}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
                    <div className="flex flex-col gap-2 w-full lg:flex-1">
                      <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">RESPONSÁVEL PELO REGISTRO</label>
                      <input
                        type="text"
                        value={professorName}
                        onChange={e => setProfessorName(e.target.value)}
                        placeholder="Nome do Gestor ou Professor"
                        className="h-12 sm:h-14 border border-gray-200 rounded-2xl px-5 text-xs font-bold !text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm uppercase w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full lg:w-80">
                      <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">CATEGORIA DA MEDIDA</label>
                      <select
                        value={classification}
                        onChange={e => setClassification(e.target.value)}
                        className="h-12 sm:h-14 border border-gray-200 rounded-2xl px-5 text-xs font-bold !text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer w-full"
                      >
                        <option value="">Selecione...</option>
                        <option value="OCORRÊNCIA DISCIPLINAR">OCORRÊNCIA DISCIPLINAR</option>
                        <option value="OCORRÊNCIA PEDAGÓGICA">OCORRÊNCIA PEDAGÓGICA</option>
                        <option value="MEDIDA EDUCATIVA">MEDIDA EDUCATIVA</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 cursor-pointer" onClick={() => triggerPicker(regDateRef)}>
                      <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1 cursor-pointer">DATA DO REGISTRO</label>
                      <input
                        ref={regDateRef}
                        type="date"
                        value={registerDate}
                        onChange={e => setRegisterDate(e.target.value)}
                        className="h-12 sm:h-14 border border-gray-200 rounded-2xl px-5 text-xs font-bold !text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer w-full"
                      />
                    </div>

                    {classification === 'MEDIDA EDUCATIVA' && (
                      <div className="flex flex-col gap-2 cursor-pointer animate-fade-in" onClick={() => triggerPicker(retDateRef)}>
                        <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1 cursor-pointer">DATA DE RETORNO (PÓS-MEDIDA)</label>
                        <input
                          ref={retDateRef}
                          type="date"
                          value={returnDate}
                          onChange={e => setReturnDate(e.target.value)}
                          className="h-12 sm:h-14 border border-orange-300 rounded-2xl px-5 text-xs font-bold !text-black bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm cursor-pointer w-full"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-white uppercase tracking-widest ml-1">DESCRIÇÃO</label>
                    <textarea
                      rows={5}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full p-6 border border-gray-200 rounded-[28px] text-xs font-bold !text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm uppercase placeholder:text-gray-300"
                      placeholder="Relatório detalhado da ocorrência e medidas tomadas..."
                    ></textarea>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full sm:w-auto px-10 sm:px-20 py-5 sm:py-6 bg-gradient-to-r from-[#004a99] to-[#14b8a6] hover:scale-[1.02] text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.25em] rounded-2xl shadow-xl transition-all border-b-8 border-blue-900 active:translate-y-1 active:border-b-0"
                    >
                      {isSaving ? 'PROCESSANDO...' : 'FINALIZAR E SALVAR REGISTRO'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <section className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">
              <div className="px-6 sm:px-10 py-6 bg-[#002b5c] text-white flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Painel de Registros (Últimos 30 dias)</h3>
                    <button
                      onClick={() => setShowPermanentSearch(true)}
                      className="text-[9px] text-teal-400 font-black uppercase text-left hover:underline flex items-center gap-1 group"
                    >
                      Ir para Histórico Permanente
                      <svg className="w-2.5 h-2.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <span className="bg-teal-500 text-white text-[8px] sm:text-[9px] px-3 py-1 rounded-full font-black uppercase whitespace-nowrap">{history.length} Recentes</span>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Filtrar recentes..."
                      className="w-full pl-10 pr-6 py-2 rounded-xl bg-white/10 border border-white/20 text-[9px] sm:text-[10px] text-white outline-none"
                    />
                    <svg className="w-4 h-4 absolute left-3 top-2.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <button
                    onClick={onOpenSearch}
                    className="bg-teal-500 hover:bg-teal-600 text-white p-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2"
                    title="Busca Profunda na Planilha"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <span className="text-[10px] font-black uppercase hidden sm:inline">Busca Permanente</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar bg-gray-50/30">
                <table className="w-full text-left text-[10px] min-w-[1200px]">
                  <thead className="bg-[#f8fafc] border-b text-black sticky top-0 z-10">
                    <tr>
                      <th className="p-4 font-black uppercase">Data</th>
                      <th className="p-4 font-black uppercase">Status</th>
                      <th className="p-4 font-black uppercase">Aluno</th>
                      <th className="p-4 font-black uppercase">Turma</th>
                      <th className="p-4 text-center font-black uppercase">Documento Ação</th>
                      <th className="p-4 font-black uppercase">Tipo</th>
                      <th className="p-4 font-black uppercase">Responsável</th>
                      <th className="p-4 font-black uppercase">Relato</th>
                      <th className="p-4 text-center font-black uppercase">Remover</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {history.length > 0 ? history.map(inc => (
                      <tr key={inc.id} className="hover:bg-blue-50/40 transition-all">
                        <td className="p-4 font-black text-gray-500">{inc.date}</td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <StatusBadge status={inc.status} size="small" />
                            {inc.lastViewedAt && (
                              <span className="text-[7px] font-bold text-teal-600 uppercase">Visualizado</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-black text-[#002b5c] uppercase">{inc.studentName}</span>
                            <span className="text-[8px] font-bold text-gray-400">RA: {inc.ra}</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-blue-600">{inc.classRoom}</td>
                        <td className="p-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => generateIncidentPDF(inc, 'view')}
                              className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all shadow-sm"
                              title="Visualizar Documento"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => generateIncidentPDF(inc, 'download')}
                              className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-all shadow-sm"
                              title="Baixar Documento"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                            <button
                              onClick={() => openUpdateModal(inc)}
                              className="p-3 bg-teal-50 text-teal-600 rounded-2xl hover:bg-teal-100 transition-all shadow-sm"
                              title="Atualizar Status / Devolutiva"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${inc.category === 'MEDIDA EDUCATIVA' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {inc.category}
                          </span>
                        </td>
                        <td className="p-4 font-black text-[#002b5c] uppercase truncate max-w-[150px]">{inc.professorName}</td>
                        <td className="p-4 max-sm truncate text-gray-600 italic">
                          <div>{inc.description}</div>
                          {inc.managementFeedback && (
                            <div className="mt-2 p-2 bg-teal-50 border-l-2 border-teal-500 text-teal-800 font-bold text-[8px]">
                              DEVOLUTIVA: {inc.managementFeedback}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {(!inc.authorEmail || inc.authorEmail === user.email) && (
                            <button
                              onClick={() => onDelete(inc.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              title="Excluir registro"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={9} className="p-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest">Nenhum registro recente encontrado</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === 'estatisticas' && (
          <div className="animate-fade-in space-y-8 pb-10">
            {/* Dashboard Estatístico */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card Top Turmas */}
              <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col">
                <div className="bg-[#002b5c] p-6 text-center border-b-4 border-teal-500">
                  <h3 className="text-white font-black text-xs uppercase tracking-widest">🏆 Turmas c/ mais Ocorrências</h3>
                </div>
                <div className="p-8 flex-1 flex flex-col gap-4">
                  {stats.topClasses.length > 0 ? stats.topClasses.map(([turma, count], idx) => (
                    <div key={turma} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-l-8 border-teal-500">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#002b5c]">{idx + 1}º - {turma}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase">Ambiente Escolar</span>
                      </div>
                      <span className="bg-teal-100 text-teal-600 px-4 py-2 rounded-xl font-black text-[12px]">{count}</span>
                    </div>
                  )) : (
                    <p className="text-center text-gray-300 font-bold uppercase text-[10px] py-10">Dados insuficientes</p>
                  )}
                </div>
              </div>

              {/* Card Top Alunos */}
              <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col">
                <div className="bg-[#002b5c] p-6 text-center border-b-4 border-orange-500">
                  <h3 className="text-white font-black text-xs uppercase tracking-widest">👤 Alunos em Foco</h3>
                </div>
                <div className="p-8 flex-1 flex flex-col gap-4">
                  {stats.topStudents.length > 0 ? stats.topStudents.map(([nome, data], idx) => (
                    <div key={nome} className="flex items-start justify-between p-4 bg-gray-50 rounded-2xl border-l-8 border-orange-500">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#002b5c] uppercase truncate max-w-[150px]">{nome}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase">Turma: {data.turma}</span>
                      </div>
                      <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-black text-[12px]">{data.count}</span>
                    </div>
                  )) : (
                    <p className="text-center text-gray-300 font-bold uppercase text-[10px] py-10">Dados insuficientes</p>
                  )}
                </div>
              </div>

              {/* Tipos de Ocorrência */}
              <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col">
                <div className="bg-[#002b5c] p-6 text-center border-b-4 border-blue-500">
                  <h3 className="text-white font-black text-xs uppercase tracking-widest">📝 Tipos mais Comuns</h3>
                </div>
                <div className="p-8 flex-1 flex flex-col gap-4">
                  {stats.topTypes.length > 0 ? stats.topTypes.map(([type, count]) => {
                    const barColor = type.includes('DISCIPLINAR') ? 'bg-red-500' :
                      type.includes('PEDAGÓGICA') ? 'bg-blue-500' :
                        'bg-teal-500';
                    const textColor = type.includes('DISCIPLINAR') ? 'text-red-600' :
                      type.includes('PEDAGÓGICA') ? 'text-blue-600' :
                        'text-teal-600';

                    return (
                      <div key={type} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-[#002b5c] uppercase">{type}</span>
                          <span className={`text-[10px] font-black ${textColor}`}>{count} unidades</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`${barColor} h-full transition-all duration-1000`}
                            style={{ width: `${incidents.length > 0 ? Math.min(100, (count / incidents.length) * 100) : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }) : (
                    <p className="text-center text-gray-300 font-bold uppercase text-[10px] py-10">Nenhum dado cadastrado</p>
                  )}
                </div>
              </div>
            </div>

            {/* Segunda Linha de Estatísticas: Professores e Gestores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card Top Professores */}
              <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col">
                <div className="bg-[#002b5c] p-6 text-center border-b-4 border-teal-400">
                  <h3 className="text-white font-black text-xs uppercase tracking-widest">👨‍🏫 Professores: Maior Volume</h3>
                </div>
                <div className="p-8 flex-1 flex flex-col gap-4">
                  {stats.topProfs.length > 0 ? stats.topProfs.map(([nome, count], idx) => (
                    <div key={nome} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-l-8 border-teal-400">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#002b5c] border-b border-gray-100 pb-1">{idx + 1}º - {nome}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase mt-1">Registros de Aula</span>
                      </div>
                      <div className="flex flex-col items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <span className="text-teal-600 font-black text-[14px] leading-tight">{count}</span>
                        <span className="text-[7px] font-black text-gray-400 uppercase">Ocorrências</span>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      <p className="text-center text-gray-500 font-bold uppercase text-[9px] tracking-widest">Nenhum registro de professor</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Top Gestores */}
              <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/10 flex flex-col">
                <div className="bg-[#002b5c] p-6 text-center border-b-4 border-orange-400">
                  <h3 className="text-white font-black text-xs uppercase tracking-widest">💼 Gestores: Maior Volume</h3>
                </div>
                <div className="p-8 flex-1 flex flex-col gap-4">
                  {stats.topManagers.length > 0 ? stats.topManagers.map(([nome, count], idx) => (
                    <div key={nome} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-l-8 border-orange-400">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#002b5c] border-b border-gray-100 pb-1">{idx + 1}º - {nome}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase mt-1">Registros Administrativos</span>
                      </div>
                      <div className="flex flex-col items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                        <span className="text-orange-600 font-black text-[14px] leading-tight">{count}</span>
                        <span className="text-[7px] font-black text-gray-400 uppercase">Ocorrências</span>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      <p className="text-center text-gray-500 font-bold uppercase text-[9px] tracking-widest">Nenhum registro de gestão</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Guia de Medidas Pedagógicas */}
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/10">
              <div className="bg-gradient-to-r from-[#002b5c] to-[#004a99] p-8 text-center border-b-4 border-teal-500">
                <h2 className="text-white font-black text-sm uppercase tracking-widest">📚 Guia Estratégico de Medidas Pedagógicas</h2>
                <p className="text-teal-400 text-[10px] font-bold mt-2 uppercase">Ações sugeridas conforme o Regimento Escolar e tipo de ocorrência</p>
              </div>
              <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                {Object.entries(pedagogicalGuide).map(([type, measures]) => (
                  <div key={type} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${type.includes('DISCIPLINAR') ? 'bg-red-500' : type.includes('PEDAGÓGICA') ? 'bg-blue-500' : 'bg-teal-500'} animate-pulse`}></div>
                      <h4 className="text-[12px] font-black text-[#002b5c] uppercase tracking-tighter">{type}</h4>
                    </div>
                    <ul className="space-y-4">
                      {measures.map((m, i) => (
                        <li key={i} className="flex gap-4 items-start group">
                          <span className="text-orange-500 font-black text-xs">0{i + 1}</span>
                          <p className="text-[11px] font-bold text-gray-600 uppercase leading-relaxed group-hover:text-black transition-colors">{m}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-6 text-center border-t border-gray-100 italic text-[10px] font-bold text-gray-400 uppercase">
                * Estas medidas são sugestões e devem ser validadas pela coordenação de acordo com a gravidade e reincidência do caso.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Atualização de Status e Devolutiva */}
      {isUpdatingStatus && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in shadow-2xl">
          <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden flex flex-col border border-white/20">
            <div className="bg-[#002b5c] p-6 text-center border-b-4 border-teal-500">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Sinalizar Estágio da Ocorrência</h3>
              <p className="text-teal-400 text-[9px] font-bold mt-1 uppercase">{isUpdatingStatus.studentName}</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">Status da Ocorrência</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] font-black outline-none focus:ring-2 focus:ring-teal-500 transition-all text-black"
                >
                  <option value="Pendente">🔴 PENDENTE</option>
                  <option value="Em Análise">🟡 EM ANÁLISE</option>
                  <option value="Resolvido">🟢 RESOLVIDO</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">Justificativa / Devolutiva</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  placeholder="Descreva o estágio atual ou a resolução da ocorrência..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all text-black uppercase"
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsUpdatingStatus(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-black text-[10px] uppercase rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 py-4 bg-teal-500 text-white font-black text-[10px] uppercase rounded-2xl hover:bg-teal-600 transition-all shadow-md active:scale-95"
                >
                  Salvar Devolutiva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Busca no Histórico Permanente */}
      {showPermanentSearch && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in shadow-2xl">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] overflow-hidden flex flex-col border border-white/20">
            <div className="bg-[#002b5c] p-6 text-center shrink-0 border-b-4 border-orange-500">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Busca Criteriosa no Histórico Permanente</h3>
              <p className="text-orange-400 text-[9px] font-bold mt-1 uppercase">Localizar Aluno e Registros</p>
            </div>

            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-6">
                {/* Campo de Busca */}
                <div className="relative group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-4 mb-2">Digite as iniciais do aluno</label>
                  <div className="relative">
                    <input
                      autoFocus
                      type="text"
                      value={permanentSearchTerm}
                      onChange={(e) => {
                        setPermanentSearchTerm(e.target.value.toUpperCase());
                        setSelectedStudentForHistory(null);
                        setStudentHistory([]);
                      }}
                      placeholder="(CARREGARÁ APENAS INICIAIS CORRESPONDENTES)"
                      className="w-full h-16 pl-14 pr-6 bg-gray-50 border-2 border-gray-100 rounded-3xl text-sm font-black outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-black uppercase tracking-wider"
                    />
                    <svg className="w-6 h-6 absolute left-5 top-5 text-gray-300 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Resultados da Busca (Alunos) */}
                {permanentSearchTerm && !selectedStudentForHistory && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
                    {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => (
                      <button
                        key={s.ra}
                        onClick={() => fetchStudentHistory(s)}
                        className={`flex flex-col items-start p-4 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-orange-50 border border-gray-100 hover:border-orange-200 rounded-2xl transition-all group`}
                      >
                        <span className="text-[11px] font-black text-[#002b5c] group-hover:text-orange-600 transition-colors">{s.nome}</span>
                        <div className="flex gap-3 mt-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Turma: {s.turma}</span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">RA: {s.ra}</span>
                        </div>
                      </button>
                    )) : (
                      <div className="col-span-full py-10 text-center">
                        <p className="text-gray-300 font-black uppercase text-[10px] tracking-[0.2em]">Nenhum aluno encontrado com estas iniciais</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Histórico do Aluno Selecionado */}
                {selectedStudentForHistory && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="p-6 bg-orange-50 border border-orange-100 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <h4 className="text-orange-800 font-black text-xs uppercase tracking-wider">{selectedStudentForHistory.nome}</h4>
                        <p className="text-orange-600/60 text-[9px] font-bold uppercase">RA: {selectedStudentForHistory.ra} | TURMA: {selectedStudentForHistory.turma}</p>
                      </div>
                      <button
                        onClick={() => setSelectedStudentForHistory(null)}
                        className="text-[9px] font-black text-orange-600 uppercase hover:underline"
                      >
                        Trocar Aluno
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Histórico Acadêmico/Disciplinar</h5>
                      {isLoadingHistory ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : studentHistory.length > 0 ? (
                        <div className="space-y-4">
                          {studentHistory.map(inc => (
                            <div key={inc.id} className="p-6 bg-white border border-gray-100 rounded-[28px] shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-black text-gray-500">{inc.date}</span>
                                  <StatusBadge status={inc.status} size="small" />
                                </div>
                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[8px] font-black text-gray-500 uppercase">{inc.category}</span>
                              </div>
                              <p className="text-[10px] font-bold text-gray-600 uppercase italic line-clamp-3">{inc.description}</p>
                              <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-[8px] font-bold text-gray-400 uppercase">PROF: {inc.professorName}</span>
                                <div className="flex gap-2">
                                  <button onClick={() => generateIncidentPDF(inc, 'view')} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                                  <button onClick={() => generateIncidentPDF(inc, 'download')} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-14 text-center bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                          <p className="text-gray-300 font-black uppercase text-[10px] tracking-[0.2em]">Nenhum registro encontrado para este aluno</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center shrink-0">
              <button
                onClick={() => {
                  setShowPermanentSearch(false);
                  setPermanentSearchTerm('');
                  setSelectedStudentForHistory(null);
                }}
                className="px-12 py-4 bg-[#002b5c] text-white font-black text-[10px] uppercase rounded-full hover:shadow-xl transition-all active:scale-95"
              >
                Fechar Histórico
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gerenciamento de Professores */}
      {showProfessorsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in shadow-2xl">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] overflow-hidden flex flex-col border border-white/20">
            <div className="bg-[#002b5c] p-6 text-center shrink-0 border-b-4 border-teal-500">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em]">Gerenciar Professores Autorizados</h3>
              <p className="text-teal-400 text-[9px] font-bold mt-1 uppercase">Controle de Acesso à Plataforma</p>
            </div>

            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row gap-8">
              {/* Formulário lateral */}
              <div className="lg:w-1/3 space-y-6 shrink-0">
                <form onSubmit={handleAddProfessor} className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4">
                  <h4 className="text-[10px] font-black text-[#002b5c] uppercase text-center mb-2">Novo Professor</h4>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-2">E-mail</label>
                    <input
                      required
                      type="email"
                      value={newProfEmail}
                      onChange={e => setNewProfEmail(e.target.value)}
                      placeholder="exemplo@prof.educacao.sp.gov.br"
                      className="w-full h-11 px-4 bg-white border border-gray-200 rounded-2xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block ml-2">Nome Completo</label>
                    <input
                      required
                      type="text"
                      value={newProfNome}
                      onChange={e => setNewProfNome(e.target.value)}
                      placeholder="NOME DO PROFESSOR"
                      className="w-full h-11 px-4 bg-white border border-gray-200 rounded-2xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all uppercase text-black"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isManagingProfs}
                    className="w-full py-4 bg-teal-500 text-white font-black text-[10px] uppercase rounded-2xl hover:bg-teal-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isManagingProfs ? 'Salvando...' : 'Adicionar Professor'}
                  </button>
                </form>

                <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                  <p className="text-[8px] font-bold text-orange-700 uppercase leading-relaxed">
                    ⚠️ Somente professores cadastrados nesta lista poderão criar contas ou fazer login no portal.
                  </p>
                </div>
              </div>

              {/* Lista Principal */}
              <div className="flex-1 min-h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-4 px-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase">{professorsList.length} Professores Cadastrados</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-[32px] border border-gray-100 overflow-hidden flex flex-col">
                  <div className="overflow-y-auto custom-scrollbar flex-1">
                    <table className="w-full text-left text-[10px]">
                      <thead className="bg-[#f8fafc] border-b text-black sticky top-0">
                        <tr>
                          <th className="p-4 font-black uppercase tracking-widest">Professor</th>
                          <th className="p-4 font-black uppercase tracking-widest text-center">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {professorsList.map(prof => (
                          <tr key={prof.email} className="hover:bg-blue-50/40 transition-all">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-black text-[#002b5c] uppercase">{prof.nome}</span>
                                <span className="text-[9px] font-bold text-gray-400 tracking-tight">{prof.email}</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleRemoveProfessor(prof.email)}
                                className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center shrink-0">
              <button
                onClick={() => setShowProfessorsModal(false)}
                className="px-12 py-4 bg-[#002b5c] text-white font-black text-[10px] uppercase rounded-full hover:shadow-xl transition-all active:scale-95"
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default Dashboard;
