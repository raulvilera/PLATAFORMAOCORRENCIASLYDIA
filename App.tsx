
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProfessorView from './components/ProfessorView';
import ResetPassword from './components/ResetPassword';
import { Incident, User, Student } from './types';

import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { STUDENTS_DB } from './studentsData';
import { saveToGoogleSheets, loadStudentsFromSheets } from './services/sheetsService';
import { isProfessorRegistered } from './professorsData';

// E-mails de gestão permitidos
const MANAGEMENT_EMAILS = [
  'gestao@escola.com',
  'cadastroslkm@gmail.com',
  'vilera@prof.educacao.sp.gov.br'
];

// E-mail com acesso dual (gestor + professor)
const DUAL_ACCESS_EMAIL = 'vilera@prof.educacao.sp.gov.br';

type View = 'login' | 'dashboard' | 'resetPassword';
type ViewMode = 'gestor' | 'professor';

const App: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [user, setUser] = useState<User | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para controlar visualização (gestor/professor) para usuários com acesso dual
  const [viewMode, setViewMode] = useState<ViewMode>('gestor');

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const cached = localStorage.getItem('lkm_incidents_cache');
      if (cached) setIncidents(JSON.parse(cached));

      if (isSupabaseConfigured && supabase) {
        try {
          // 1. Detectar evento de recuperação de senha via listener oficial
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔔 [AUTH] Evento:', event);

            if (event === 'PASSWORD_RECOVERY') {
              console.log('🔐 [APP] Modo de recuperação de senha ativado');
              setView('resetPassword');
              return;
            }

            if (event === 'SIGNED_IN' && session?.user && view !== 'resetPassword') {
              const email = session.user.email!.toLowerCase();
              if (isProfessorRegistered(email)) {
                const role = MANAGEMENT_EMAILS.includes(email) ? 'gestor' : 'professor';
                setUser({ email, role });
                setView('dashboard');
              } else {
                await supabase.auth.signOut();
              }
            }
          });

          // 2. Fallback para detecção via Hash (caso o listener demore)
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          if (hashParams.get('type') === 'recovery' || hashParams.get('access_token')) {
            setView('resetPassword');
          }

          // 3. Verificar sessão atual se não estiver em modo de recuperação
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && view !== 'resetPassword') {
            const email = session.user.email!.toLowerCase();
            if (isProfessorRegistered(email)) {
              const role = MANAGEMENT_EMAILS.includes(email) ? 'gestor' : 'professor';
              setUser({ email, role });
              setView('dashboard');
            }
          }
        } catch (e) {
          console.warn("Erro ao inicializar auth:", e);
        }
      }
      setLoading(false);
    };
    initApp();
  }, [view]);

  useEffect(() => {
    const loadStudentsData = async () => {
      let finalStudents: Student[] = [];
      let loadedFromSheets = false;

      // 1. Tentar carregar do Google Sheets primeiro (fonte primária)
      try {
        const sheetsStudents = await loadStudentsFromSheets();
        if (sheetsStudents.length > 0) {
          finalStudents = sheetsStudents;
          loadedFromSheets = true;
          console.log(`✅ Google Sheets: Carregados ${sheetsStudents.length} alunos`);

          // 2. Sincronizar com Supabase (cache)
          if (isSupabaseConfigured && supabase) {
            try {
              // Limpar tabela students
              await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');

              // Inserir novos dados
              const studentsToInsert = sheetsStudents.map((s, index) => ({
                id: `sheet-${Date.now()}-${index}`,
                nome: s.nome,
                ra: s.ra,
                turma: s.turma
              }));

              const { error } = await supabase.from('students').insert(studentsToInsert);
              if (!error) {
                console.log('✅ Supabase: Dados sincronizados');
              } else {
                console.warn('⚠️ Supabase: Erro ao sincronizar:', error);
              }
            } catch (syncError) {
              console.warn('⚠️ Supabase: Falha na sincronização:', syncError);
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Google Sheets: Falha ao carregar, tentando Supabase...');
      }

      // 3. Fallback: Supabase (cache)
      if (!loadedFromSheets && isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('students').select('*');
          if (!error && data && data.length > 0) {
            finalStudents = data.map(s => ({
              id: s.id,
              nome: s.nome,
              ra: s.ra,
              turma: s.turma
            }));
            console.log(`✅ Supabase: Carregados ${finalStudents.length} alunos (cache)`);
          }
        } catch (e) {
          console.warn('⚠️ Supabase: Falha ao carregar');
        }
      }

      // 4. Último fallback: Dados locais
      if (finalStudents.length === 0) {
        finalStudents = STUDENTS_DB;
        console.log(`⚠️ Local: Usando ${STUDENTS_DB.length} alunos (studentsData.ts)`);
      }

      setStudents(finalStudents);

      // Gerar lista de turmas dinamicamente
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
          authorEmail: i.author_email,
          managementFeedback: i.management_feedback,
          lastViewedAt: i.last_viewed_at
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

    if (!window.confirm("CONFIRMAR EXCLUSÃO PERMANENTE?")) return;

    // Backup para rollback em caso de erro
    const previousIncidents = [...incidents];

    // Filtro otimista na UI
    const filtered = incidents.filter(i => i.id !== id);
    setIncidents(filtered);
    localStorage.setItem('lkm_incidents_cache', JSON.stringify(filtered));

    if (isSupabaseConfigured && supabase) {
      try {
        console.log(`🗑️ [DELETE] Tentando excluir incidente: ${id}`);
        const { error } = await supabase.from('incidents').delete().eq('id', id);

        if (error) {
          console.error('❌ [DELETE] Erro ao excluir do banco:', error);
          // Rollback em caso de erro de permissão ou rede
          setIncidents(previousIncidents);
          localStorage.setItem('lkm_incidents_cache', JSON.stringify(previousIncidents));

          if (error.message.includes('permission denied')) {
            alert("ERRO DE PERMISSÃO: O banco de dados não permitiu a exclusão. Verifique se você é o autor ou se tem nível de Gestor.");
          } else {
            alert(`Ocorreu um erro ao excluir do servidor: ${error.message}`);
          }
        } else {
          console.log('✅ [DELETE] Excluído com sucesso do banco de dados');
        }
      } catch (err) {
        console.error('❌ [DELETE] Erro inesperado:', err);
        setIncidents(previousIncidents);
        localStorage.setItem('lkm_incidents_cache', JSON.stringify(previousIncidents));
        alert("Erro de conexão ao tentar excluir. O registro foi restaurado.");
      }
    }
  };

  const handleUpdateIncident = async (updated: Incident) => {
    if (!user) return;

    // Atualização local
    const newIncidents = incidents.map(i => i.id === updated.id ? updated : i);
    setIncidents(newIncidents);
    localStorage.setItem('lkm_incidents_cache', JSON.stringify(newIncidents));

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('incidents')
          .update({
            status: updated.status,
            management_feedback: updated.managementFeedback,
            last_viewed_at: updated.lastViewedAt
          })
          .eq('id', updated.id);

        if (error) {
          console.error('❌ [UPDATE] Erro ao atualizar no banco:', error);
          alert(`Erro ao salvar atualização: ${error.message}`);
        } else {
          console.log('✅ [UPDATE] Atualizado com sucesso no banco');
        }
      } catch (err) {
        console.error('❌ [UPDATE] Erro inesperado:', err);
      }
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

  const hasDualAccess = user?.email === DUAL_ACCESS_EMAIL;

  const handleToggleView = () => {
    setViewMode(prev => prev === 'gestor' ? 'professor' : 'gestor');
  };

  const commonProps = {
    user: user!,
    incidents: incidents,
    students: students,
    classes: classes,
    onSave: handleSaveIncident,
    onDelete: handleDeleteIncident,
    onUpdateIncident: handleUpdateIncident,
    onLogout: handleLogout,
    onOpenSearch: () => setSearchModalOpen(true)
  };

  // Determina qual visualização renderizar
  const shouldShowGestorView = hasDualAccess ? viewMode === 'gestor' : user?.role === 'gestor';

  return (
    <div className="relative min-h-screen bg-[#001a35]">
      {/* Botão de alternância para usuários com acesso dual */}
      {hasDualAccess && (
        <button
          onClick={handleToggleView}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-wider shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          title={`Alternar para área ${viewMode === 'gestor' ? 'do professor' : 'da gestão'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          {viewMode === 'gestor' ? 'Ver como Professor' : 'Ver como Gestão'}
        </button>
      )}

      {shouldShowGestorView ? <Dashboard {...commonProps} /> : <ProfessorView {...commonProps} />}
    </div>
  );
};

export default App;
