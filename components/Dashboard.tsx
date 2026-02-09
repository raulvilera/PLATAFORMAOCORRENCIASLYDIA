
import React, { useState, useMemo, useRef } from 'react';
import { Incident, User, Student } from '../types';
import { generateIncidentPDF, uploadPDFToStorage } from '../services/pdfService';

interface DashboardProps {
  user: User;
  incidents: Incident[];
  students: Student[];
  classes: string[];
  onSave: (incident: Incident) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
  onOpenSearch: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, incidents, students, classes, onSave, onDelete, onLogout, onOpenSearch }) => {
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

  const ra = useMemo(() => {
    const s = students.find(st => st.nome === studentName && st.turma === classRoom);
    return s ? s.ra : '---';
  }, [studentName, classRoom, students]);

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

    // Upload do PDF para Supabase Storage
    try {
      const uploadedPdfUrl = await uploadPDFToStorage(newInc);
      if (uploadedPdfUrl) {
        newInc.pdfUrl = uploadedPdfUrl;
        console.log('✅ PDF enviado com sucesso:', uploadedPdfUrl);
      } else {
        console.warn('⚠️ Falha no upload do PDF. Registro será salvo sem link.');
      }
    } catch (err) {
      console.error('❌ Erro ao fazer upload do PDF:', err);
    }

    onSave(newInc);
    setStudentName('');
    setDescription('');
    setReturnDate('');
    setIsSaving(false);
  };

  const history = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return incidents.filter(i =>
      (i.studentName || "").toLowerCase().includes(term) ||
      (i.classRoom || "").toLowerCase().includes(term) ||
      (i.professorName || "").toLowerCase().includes(term)
    );
  }, [incidents, searchTerm]);

  return (
    <div className="min-h-screen bg-[#001a35] font-sans pb-12 overflow-x-hidden">
      <header className="bg-[#002b5c] text-white px-4 sm:px-8 py-3 flex flex-col sm:flex-row justify-between items-center border-b border-white/10 sticky top-0 z-[50] shadow-xl gap-2 sm:gap-0">
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-xs sm:text-sm font-black uppercase tracking-widest text-teal-400 text-center sm:text-left">Gestão Lydia Kitz Moreira 2026</h1>
          <p className="text-[8px] sm:text-[9px] font-bold text-white/40 uppercase">Painel de Controle Administrativo</p>
        </div>
        <div className="flex gap-4 sm:gap-6 items-center">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase">{user.email}</span>
            <span className="text-[8px] font-bold text-orange-500 uppercase">Nível: Administrador</span>
          </div>
          <button onClick={onLogout} className="bg-white hover:bg-red-50 text-[#002b5c] px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase shadow-lg transition-all active:scale-95">Sair</button>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto mt-6 sm:mt-8 px-4 sm:px-6 space-y-8 sm:space-y-10">
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
                <button onClick={onOpenSearch} className="text-[9px] text-teal-400 font-black uppercase text-left hover:underline">Ir para Histórico Permanente</button>
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
                  <th className="p-4 font-black uppercase">Aluno</th>
                  <th className="p-4 font-black uppercase">Turma</th>
                  <th className="p-4 font-black uppercase">Tipo</th>
                  <th className="p-4 font-black uppercase">Responsável</th>
                  <th className="p-4 font-black uppercase">Relato</th>
                  <th className="p-4 text-center font-black uppercase">Documento</th>
                  <th className="p-4 text-center font-black uppercase">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {history.length > 0 ? history.map(inc => (
                  <tr key={inc.id} className="hover:bg-blue-50/40 transition-all">
                    <td className="p-4 font-black text-gray-500">{inc.date}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-black text-[#002b5c] uppercase">{inc.studentName}</span>
                        <span className="text-[8px] font-bold text-gray-400">RA: {inc.ra}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-blue-600">{inc.classRoom}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${inc.category === 'MEDIDA EDUCATIVA' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {inc.category}
                      </span>
                    </td>
                    <td className="p-4 font-black text-[#002b5c] uppercase truncate max-w-[150px]">{inc.professorName}</td>
                    <td className="p-4 max-sm truncate text-gray-600 italic">{inc.description}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => generateIncidentPDF(inc, 'view')} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                        <button onClick={() => generateIncidentPDF(inc, 'download')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {(!inc.authorEmail || inc.authorEmail === user.email) && (
                        <button onClick={() => onDelete(inc.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all" title="Excluir registro"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="p-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest">Nenhum registro recente encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Dashboard;
