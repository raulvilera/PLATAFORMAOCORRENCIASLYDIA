
import React, { useState, useMemo, useEffect } from 'react';
import { Incident, User, Student } from '../types';
import { generateIncidentPDF, uploadPDFToStorage } from '../services/pdfService';
import { getProfessorNameFromEmail } from '../professorsData';

interface ProfessorViewProps {
  user: User;
  incidents: Incident[];
  students: Student[];
  classes: string[];
  onSave: (incident: Incident | Incident[]) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

const LISTA_IRREGULARIDADES = [
  'ATRASO', 'SEM MATERIAL', 'USO DE CELULAR', 'CONVERSA', 'DESRESPEITO',
  'INDISCIPLINA', 'DESACATO', 'SEM TAREFA', 'SAIU SEM PERMISSÃO'
];

const ProfessorView: React.FC<ProfessorViewProps> = ({ user, incidents, students, classes, onSave, onDelete, onLogout }) => {
  const [professorName, setProfessorName] = useState('');
  const [classRoom, setClassRoom] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [discipline, setDiscipline] = useState('');
  const [selectedIrregularities, setSelectedIrregularities] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [registerDate, setRegisterDate] = useState(new Date().toISOString().split('T')[0]);
  const [classification, setClassification] = useState('OCORRÊNCIA DISCIPLINAR');
  const [returnDate, setReturnDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const studentsInClass = useMemo(() => students.filter(a => a.turma === classRoom), [classRoom, students]);

  // Preenche automaticamente o nome do professor baseado no e-mail
  useEffect(() => {
    if (user?.email) {
      const autoName = getProfessorNameFromEmail(user.email);
      setProfessorName(autoName);
    }
  }, [user]);

  const toggleStudent = (nome: string) => {
    setSelectedStudents(prev =>
      prev.includes(nome) ? prev.filter(s => s !== nome) : [...prev, nome]
    );
  };

  const toggleIrregularity = (item: string) => {
    setSelectedIrregularities(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professorName || !classRoom || selectedStudents.length === 0 || !description) {
      alert("Preencha Nome, Turma, selecione o(s) Aluno(s) e relate o fato.");
      return;
    }

    setIsSaving(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = registerDate.split('-').reverse().join('/');

    const newIncidents: Incident[] = selectedStudents.map((nome, index) => {
      const studentData = students.find(s => s.nome === nome && s.turma === classRoom);
      return {
        id: `prof-${Date.now()}-${index}`,
        date: formattedDate,
        professorName: professorName.toUpperCase(),
        classRoom,
        studentName: nome.toUpperCase(),
        ra: studentData ? studentData.ra : '---',
        discipline: (discipline || 'N/A').toUpperCase(),
        irregularities: selectedIrregularities.join(', ') || 'NENHUMA',
        description: description.toUpperCase(),
        time: timeStr,
        registerDate: formattedDate,
        returnDate: classification === 'MEDIDA EDUCATIVA' && returnDate ? returnDate.split('-').reverse().join('/') : undefined,
        category: classification,
        severity: 'Média',
        status: 'Pendente',
        source: 'professor',
        authorEmail: user.email
      } as Incident;
    });

    try {
      // Upload dos PDFs em paralelo
      console.log(`📤 Iniciando upload de ${newIncidents.length} PDFs...`);
      const pdfUrls = await Promise.all(
        newIncidents.map(inc => uploadPDFToStorage(inc))
      );

      // Atualizar cada incidente com sua URL
      newIncidents.forEach((inc, index) => {
        if (pdfUrls[index]) {
          inc.pdfUrl = pdfUrls[index];
          console.log(`✅ PDF ${index + 1}/${newIncidents.length} enviado:`, inc.studentName);
        } else {
          console.warn(`⚠️ Falha no upload do PDF ${index + 1}/${newIncidents.length}:`, inc.studentName);
        }
      });

      onSave(newIncidents);
      alert(`${newIncidents.length} registros gravados.`);
      setSelectedStudents([]);
      setDescription('');
      setSelectedIrregularities([]);
      setReturnDate('');
    } catch (err) {
      console.error('❌ Erro ao salvar registros:', err);
      alert("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredHistory = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return incidents.filter(i =>
      (i.studentName || "").toLowerCase().includes(term) ||
      (i.classRoom || "").toLowerCase().includes(term) ||
      (i.professorName || "").toLowerCase().includes(term)
    );
  }, [incidents, searchTerm]);

  return (
    <div className="min-h-screen bg-[#001a35] font-sans pb-12 overflow-x-hidden">
      <header className="bg-[#002b5c] text-white px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-50 shadow-2xl gap-4 sm:gap-0 border-b border-white/10">
        <div className="flex flex-col items-center sm:items-start">
          <h1 className="text-sm font-black uppercase text-teal-400">Área do Professor 2026</h1>
          <p className="text-[9px] font-bold text-white/50 uppercase">EE Lydia Kitz Moreira</p>
        </div>
        <div className="flex gap-4 sm:gap-6 items-center">
          <span className="text-[10px] font-bold text-white/70">{user.email}</span>
          <button onClick={onLogout} className="bg-white text-[#002b5c] px-5 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-lg hover:bg-gray-100 transition-all">Sair</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-4 sm:mt-8 px-4 sm:px-6 space-y-8">
        <div className="bg-[#001a35] rounded-3xl shadow-2xl overflow-hidden border border-white/5">
          <div className="bg-[#004a99] py-3 text-center border-b border-white/10">
            <h2 className="text-white font-black text-[10px] sm:text-xs uppercase tracking-widest">LANÇAMENTO DE REGISTROS DISCIPLINARES</h2>
          </div>
          <div className="p-4 sm:p-8 bg-gradient-to-br from-[#115e59] via-[#14b8a6] to-[#ea580c]">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-white uppercase block ml-2">PROFESSOR RESPONSÁVEL</label>
                  <input type="text" value={professorName} onChange={e => setProfessorName(e.target.value)} placeholder="SEU NOME" className="w-full h-11 px-4 rounded-xl text-xs font-bold uppercase !text-black bg-white shadow-inner outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                </div>
                <div className="w-full md:w-64 space-y-1">
                  <label className="text-[10px] font-black text-white uppercase block ml-2">TURMA / SÉRIE</label>
                  <select value={classRoom} onChange={e => { setClassRoom(e.target.value); setSelectedStudents([]); }} className="w-full h-11 px-4 rounded-xl text-xs font-bold !text-black bg-white shadow-inner outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer">
                    <option value="">Selecione...</option>
                    {classes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-2 px-2">
                  <label className="text-[10px] font-black text-white uppercase tracking-widest">SELECIONE OS ALUNOS</label>
                  <span className="text-[9px] font-black text-white bg-black/30 px-3 py-1 rounded-full uppercase">{selectedStudents.length} selecionado(s)</span>
                </div>
                <div className="h-64 overflow-y-auto border-2 border-white/10 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-black/10 backdrop-blur-sm custom-scrollbar">
                  {studentsInClass.length > 0 ? studentsInClass.map(a => (
                    <label
                      key={a.ra}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer 
                        ${selectedStudents.includes(a.nome)
                          ? 'bg-[#003d7a] border-blue-400 text-white shadow-[inset_4px_4px_8px_rgba(0,0,0,0.5)] translate-y-0.5'
                          : 'bg-white border-white/10 text-black shadow-[4px_4px_10px_rgba(0,0,0,0.2),-2px_-2px_8px_rgba(255,255,255,0.1)] hover:bg-gray-50'}`}
                    >
                      <input type="checkbox" checked={selectedStudents.includes(a.nome)} onChange={() => toggleStudent(a.nome)} className="hidden" />
                      <div className="flex flex-col truncate">
                        <span className="text-[9px] font-black uppercase truncate">{a.nome}</span>
                        <span className="text-[7px] opacity-40">RA: {a.ra}</span>
                      </div>
                    </label>
                  )) : (
                    <div className="col-span-full h-full flex items-center justify-center text-white/20 text-[10px] font-black uppercase italic tracking-widest text-center">Selecione uma turma para carregar os alunos</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white uppercase block ml-2">IRREGULARIDADES</label>
                <div className="flex flex-wrap gap-2 px-2">
                  {LISTA_IRREGULARIDADES.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleIrregularity(item)}
                      className={`px-4 py-2 rounded-lg border transition-all text-[9px] font-bold 
                        ${selectedIrregularities.includes(item) ? 'bg-[#002b5c] text-white border-transparent shadow-lg scale-105' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-white uppercase block ml-2">CATEGORIA DA MEDIDA</label>
                  <select
                    value={classification}
                    onChange={e => setClassification(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl text-xs font-bold !text-black bg-white shadow-inner outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                  >
                    <option value="OCORRÊNCIA DISCIPLINAR">OCORRÊNCIA DISCIPLINAR</option>
                    <option value="OCORRÊNCIA PEDAGÓGICA">OCORRÊNCIA PEDAGÓGICA</option>
                    <option value="MEDIDA EDUCATIVA">MEDIDA EDUCATIVA</option>
                  </select>
                </div>
                {classification === 'MEDIDA EDUCATIVA' && (
                  <div className="flex-1 space-y-1 animate-fade-in">
                    <label className="text-[10px] font-black text-white uppercase block ml-2">DATA DE RETORNO (PÓS-MEDIDA)</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={e => setReturnDate(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl text-xs font-bold !text-black bg-white shadow-inner outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-white uppercase block ml-2 tracking-widest">DESCRIÇÃO</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="RELATE O OCORRIDO DETALHADAMENTE..." className="w-full p-4 rounded-xl text-xs font-bold uppercase !text-black bg-white shadow-inner outline-none focus:ring-2 focus:ring-orange-500 transition-all"></textarea>
              </div>

              <div className="flex justify-center pb-2">
                <button
                  type="submit"
                  disabled={isSaving || selectedStudents.length === 0}
                  className="w-auto px-16 py-5 bg-gradient-to-r from-blue-400 to-blue-900 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 border-b-4 border-blue-950"
                >
                  {isSaving ? 'Gravando...' : `Registrar para ${selectedStudents.length} Aluno(s)`}
                </button>
              </div>
            </form>
          </div>
        </div>

        <section className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 bg-[#004a99] text-white flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-widest">Histórico Recente</h3>
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Filtrar histórico..." className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-[10px] text-white placeholder:text-white/40 outline-none focus:bg-white focus:text-black" />
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-[9px] min-w-[1000px]">
              <thead className="bg-gray-50 border-b font-black uppercase text-gray-400">
                <tr>
                  <th className="p-4">Data</th>
                  <th className="p-4">Aluno</th>
                  <th className="p-4">Turma</th>
                  <th className="p-4">Responsável</th>
                  <th className="p-4">Descrição</th>
                  <th className="p-4 text-center">Documento</th>
                  <th className="p-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {filteredHistory.length > 0 ? filteredHistory.map(inc => (
                  <tr key={inc.id} className="hover:bg-blue-50/50 transition-all">
                    <td className="p-4 font-bold text-gray-500">{inc.date}</td>
                    <td className="p-4"><span className="font-black text-blue-900 uppercase">{inc.studentName}</span></td>
                    <td className="p-4 font-black text-blue-600">{inc.classRoom}</td>
                    <td className="p-4 uppercase font-bold text-gray-400">{inc.professorName}</td>
                    <td className="p-4 max-w-xs truncate text-gray-500 italic">{inc.description}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => generateIncidentPDF(inc, 'view')}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                          title="Visualizar PDF"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => generateIncidentPDF(inc, 'download')}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                          title="Baixar PDF"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {(inc.authorEmail === user.email) && (
                        <button
                          onClick={() => onDelete(inc.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                          title="Excluir meu registro"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="p-12 text-center text-gray-300 font-black uppercase tracking-widest italic">Nenhum registro recente</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #14b8a6; border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ProfessorView;
