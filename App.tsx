
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProfessorView from './components/ProfessorView';
import ResetPassword from './components/ResetPassword';
import { Incident, User, Student } from './types';

import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { STUDENTS_DB } from './studentsData';
import { saveToGoogleSheets } from './services/sheetsService';
import { isProfessorRegistered } from './professorsData';

type View = 'login' | 'dashboard' | 'resetPassword';

const App: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [user, setUser] = useState<User | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const cached = localStorage.getItem('lkm_incidents_cache');
      if (cached) setIncidents(JSON.parse(cached));

      if (isSupabaseConfigured && supabase) {
        try {
          // Detectar se é um link de reset de senha
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const recoveryToken = hashParams.get('access_token');
          const tokenType = hashParams.get('type');

          if (recoveryToken && tokenType === 'recovery') {
            console.log('🔐 [APP] Link de reset de senha detectado');
            setView('resetPassword');
            setLoading(false);
            return;
          }

          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const email = session.user.email!.toLowerCase();

            // VALIDAÇÃO DE WHITELIST: Verifica se professor está cadastrado
            if (!isProfessorRegistered(email)) {
              console.warn('⚠️ Sessão detectada mas e-mail não cadastrado:', email);
              await supabase.auth.signOut();
              setLoading(false);
              return;
            }

            const role = email === 'gestao@escola.com' ? 'gestor' : 'professor';
            setUser({ email, role });
            setView('dashboard');
          }
        } catch (e) {
          console.warn("Supabase não respondeu.");
        }
      }
      setLoading(false);
    };
    initApp();
  }, []);

  useEffect(() => {
    const loadStudentsData = async () => {
      let finalStudents: Student[] = STUDENTS_DB;

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('students').select('*');
          if (!error && data && data.length > 0) {
            finalStudents = data.map(s => ({
              id: s.id,
              nome: s.nome,
              ra: s.ra,
              turma: s.turma
            }));
          }
        } catch (e) {
          console.warn("Usando base de alunos local.");
        }
      }

      setStudents(finalStudents);

      const uniqueClasses = Array.from(new Set(finalStudents.map(s => s.turma)));
      const sortedClasses = uniqueClasses.sort((a, b) => {
        const isAno_a = a.includes('Ano');
        const isAno_b = b.includes('Ano');
        if (isAno_a && !isAno_b) return -1;
        if (!isAno_a && isAno_b) return 1;
        return a.localeCompare(b, undefined, { numeric: true });
      });

      setClasses(sortedClasses);
    };

    loadStudentsData();
  }, [user]);

  useEffect(() => {
    if (user) loadCloudIncidents();
  }, [user]);

  const loadCloudIncidents = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data: incData, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && incData) {
        const mapped: Incident[] = incData.map(i => ({
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
          authorEmail: i.author_email
        }));
        setIncidents(mapped);
        localStorage.setItem('lkm_incidents_cache', JSON.stringify(mapped));
      }
    } catch (e) { console.warn("Sincronização offline."); }
  };

  const handleSaveIncident = async (newIncident: Incident | Incident[]) => {
    if (!user) return;
    const items = (Array.isArray(newIncident) ? newIncident : [newIncident]).map(i => ({
      ...i, authorEmail: user.email
    }));
    const updatedList = [...items, ...incidents];
    setIncidents(updatedList);
    localStorage.setItem('lkm_incidents_cache', JSON.stringify(updatedList));
    for (const item of items) {
      saveToGoogleSheets(item);
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('incidents').insert({
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
            pdf_url: item.pdfUrl,
            author_email: item.authorEmail
          });
        } catch (err) { console.error("Erro banco"); }
      }
    }
  };

  const handleDeleteIncident = async (id: string) => {
    const inc = incidents.find(i => i.id === id);
    if (!inc || !user) return;
    if (inc.authorEmail && inc.authorEmail !== user.email && user.role !== 'gestor') {
      alert("ACESSO NEGADO: Você só pode excluir seus próprios registros.");
      return;
    }
    if (!window.confirm("CONFIRMAR EXCLUSÃO?")) return;
    const filtered = incidents.filter(i => i.id !== id);
    setIncidents(filtered);
    localStorage.setItem('lkm_incidents_cache', JSON.stringify(filtered));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('incidents').delete().eq('id', id);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
    setUser(null);
    setView('login');
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#000d1a] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Portal Lydia Kitz 2026...</p>
      </div>
    );
  }

  if (view === 'login') return <Login onLogin={u => { setUser(u); setView('dashboard'); }} />;

  if (view === 'resetPassword') {
    return (
      <ResetPassword
        onComplete={async () => {
          // Após resetar senha, fazer logout e voltar para login
          if (isSupabaseConfigured && supabase) {
            await supabase.auth.signOut();
          }
          // Limpar hash da URL
          window.history.replaceState(null, '', window.location.pathname);
          setView('login');
        }}
        onCancel={async () => {
          // Cancelar reset, fazer logout e voltar para login
          if (isSupabaseConfigured && supabase) {
            await supabase.auth.signOut();
          }
          window.history.replaceState(null, '', window.location.pathname);
          setView('login');
        }}
      />
    );
  }

  const commonProps = {
    user: user!,
    incidents: incidents,
    students: students,
    classes: classes,
    onSave: handleSaveIncident,
    onDelete: handleDeleteIncident,
    onLogout: handleLogout,
    onOpenSearch: () => setSearchModalOpen(true)
  };

  return (
    <div className="relative min-h-screen bg-[#001a35]">
      {user?.role === 'gestor' ? <Dashboard {...commonProps} /> : <ProfessorView {...commonProps} />}
    </div>
  );
};

export default App;
