
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProfessorView from './components/ProfessorView';
import { Incident, View, User, Student } from './types';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { STUDENTS_DB } from './studentsData';
import { saveToGoogleSheets } from './services/sheetsService';
import { generateIncidentPDF } from './services/pdfService';

const App: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [user, setUser] = useState<User | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingViewIncident, setPendingViewIncident] = useState<Incident | null>(null);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  // Detector de links externos da planilha
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incidentId = params.get('view_incident');
    
    if (incidentId && incidents.length > 0) {
      const inc = incidents.find(i => i.id === incidentId);
      if (inc) {
        setPendingViewIncident(inc);
        // Limpa a URL visualmente
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [incidents]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      let currentStudents: Student[] = STUDENTS_DB;
      if (isSupabaseConfigured) {
        const { data: stData } = await supabase
          .from('students')
          .select('*')
          .order('nome', { ascending: true });
        
        if (stData && stData.length > 0) {
          currentStudents = stData.map(s => ({
            nome: s.nome,
            ra: s.ra,
            turma: s.turma
          }));
        }
      }
      setStudents(currentStudents);
      
      const uniqueClasses = Array.from(new Set(currentStudents.map(s => s.turma))).sort((a, b) => {
        const getPriority = (name: string) => {
          if (name.startsWith('6º')) return 10;
          if (name.startsWith('7º')) return 20;
          if (name.startsWith('8º')) return 30;
          if (name.startsWith('9º')) return 40;
          if (name.startsWith('1ª')) return 50;
          if (name.startsWith('2ª')) return 60;
          if (name.startsWith('3ª')) return 70;
          return 100;
        };
        const pA = getPriority(a);
        const pB = getPriority(b);
        if (pA !== pB) return pA - pB;
        return a.localeCompare(b);
      });
      
      setClasses(uniqueClasses);

      if (isSupabaseConfigured) {
        const { data: incData, error } = await supabase
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        if (incData) {
          const mappedIncidents: Incident[] = incData.map(i => ({
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
            aiAnalysis: i.ai_analysis,
            pdfUrl: i.pdf_url
          }));
          setIncidents(mappedIncidents);
          localStorage.setItem('lkm_incidents_cache', JSON.stringify(mappedIncidents));
        }
      } else {
        const localData = localStorage.getItem('lkm_incidents_cache');
        if (localData) setIncidents(JSON.parse(localData));
      }
    } catch (e) {
      console.warn("Erro ao carregar dados, usando cache local:", e);
      const localData = localStorage.getItem('lkm_incidents_cache');
      if (localData) setIncidents(JSON.parse(localData));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setIncidents([]);
    setPendingViewIncident(null);
  };

  const handleSaveIncident = async (newIncident: Incident | Incident[]) => {
    const items = Array.isArray(newIncident) ? newIncident : [newIncident];
    const updatedIncidents = [...items, ...incidents];
    setIncidents(updatedIncidents);
    localStorage.setItem('lkm_incidents_cache', JSON.stringify(updatedIncidents));

    for (const item of items) {
      saveToGoogleSheets(item);
    }

    if (isSupabaseConfigured) {
      const dbItems = items.map(item => ({
        id: item.id,
        student_name: item.studentName,
        ra: item.ra,
        class_room: item.classRoom,
        professor_name: item.professorName,
        discipline: item.discipline,
        date: item.date,
        time: item.time,
        register_date: item.registerDate,
        return_date: item.returnDate,
        description: item.description,
        irregularities: item.irregularities,
        category: item.category,
        severity: item.severity,
        status: item.status,
        source: item.source,
        ai_analysis: item.aiAnalysis,
        pdf_url: item.pdfUrl
      }));

      try {
        await supabase.from('incidents').insert(dbItems);
      } catch (e) {
        console.warn("Falha na sincronização cloud Supabase.");
      }
    }
  };

  const handleDeleteIncident = async (id: string) => {
    if (!window.confirm("Confirmar exclusão permanente?")) return;
    const updated = incidents.filter(i => i.id !== id);
    setIncidents(updated);
    localStorage.setItem('lkm_incidents_cache', JSON.stringify(updated));
    if (isSupabaseConfigured) {
      try { await supabase.from('incidents').delete().eq('id', id); } catch (e) {}
    }
  };

  if (view === 'login') return <Login onLogin={handleLogin} />;

  if (loading && incidents.length === 0) {
    return (
      <div className="min-h-screen bg-[#001a35] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-white font-black uppercase text-[11px] tracking-[0.4em]">Sincronizando Lydia Kitz 2026...</div>
      </div>
    );
  }

  const commonProps = {
    user: user!,
    incidents,
    students,
    classes,
    onSave: handleSaveIncident as any,
    onDelete: handleDeleteIncident,
    onLogout: handleLogout
  };

  return (
    <>
      {user?.role === 'professor' 
        ? <ProfessorView {...commonProps} /> 
        : <Dashboard {...commonProps} />}
      
      {/* Botão flutuante para abrir PDF solicitado via link (evita bloqueio de popup) */}
      {pendingViewIncident && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-bounce">
          <button 
            onClick={() => {
              generateIncidentPDF(pendingViewIncident, 'view');
              setPendingViewIncident(null);
            }}
            className="bg-orange-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest border-2 border-white flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Abrir Documento Solicitado
          </button>
        </div>
      )}
    </>
  );
};

export default App;
