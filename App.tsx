
import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AttendanceTracker from './components/AttendanceTracker';
import GradeSaver from './components/GradeSaver';
import AssignmentSolver from './components/AssignmentSolver';
import FocusCenter from './components/FocusCenter';
import StudyPlanner from './components/StudyPlanner';
// Fix: Import missing icons from lucide-react
import { Zap, Plus } from 'lucide-react';
import { ViewType, AppState, AttendanceRecord, SemesterGrade, Assignment, ClassSchedule, FocusSession, ScreentimeLog, StudyPlanItem } from './types';
import { INITIAL_GRADES, INITIAL_ROUTINE, INITIAL_ASSIGNMENTS, DEFAULT_ATTENDANCE_TARGET } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = React.useState<ViewType>('dashboard');
  const [state, setState] = React.useState<AppState>({
    userName: 'John Doe',
    attendanceTarget: DEFAULT_ATTENDANCE_TARGET,
    routine: INITIAL_ROUTINE,
    history: [],
    grades: INITIAL_GRADES,
    assignments: INITIAL_ASSIGNMENTS,
    focusSessions: [],
    screentimeLogs: [
      { date: new Date().toISOString(), category: 'Social', minutes: 120 },
      { date: new Date().toISOString(), category: 'Study', minutes: 240 },
    ],
    studyPlan: [],
    lastAttendancePerc: 0
  });

  const handleUpdateAttendance = (record: AttendanceRecord) => {
    setState(prev => {
      const totalClassesSoFar = prev.history.length;
      const attendedCount = prev.history.filter(h => h.status === 'attended').length;
      const currentPerc = totalClassesSoFar > 0 ? (attendedCount / totalClassesSoFar) * 100 : 0;
      
      return {
        ...prev,
        history: [record, ...prev.history],
        lastAttendancePerc: currentPerc
      };
    });
  };

  const handleUpdatePlan = (plan: StudyPlanItem[]) => {
    setState(prev => ({ ...prev, studyPlan: plan }));
  };

  const handleTogglePlanItem = (id: string) => {
    setState(prev => ({
      ...prev,
      studyPlan: prev.studyPlan.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleAddGrade = (grade: SemesterGrade) => {
    setState(prev => ({ ...prev, grades: [...prev.grades, grade] }));
  };

  const handleRemoveGrade = (semester: number) => {
    setState(prev => ({ ...prev, grades: prev.grades.filter(g => g.semester !== semester) }));
  };

  const handleSetRoutine = (routine: ClassSchedule[]) => {
    setState(prev => ({ ...prev, routine }));
  };

  const handleAddFocusSession = (session: FocusSession) => {
    setState(prev => ({ ...prev, focusSessions: [...prev.focusSessions, session] }));
  };

  const handleAddScreentime = (log: ScreentimeLog) => {
    setState(prev => ({ ...prev, screentimeLogs: [...prev.screentimeLogs, log] }));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard state={state} onSwitchView={setActiveView} />;
      case 'attendance':
        return (
          <AttendanceTracker 
            routine={state.routine} 
            history={state.history} 
            target={state.attendanceTarget}
            lastPerc={state.lastAttendancePerc}
            onUpdateHistory={handleUpdateAttendance}
            onSetRoutine={handleSetRoutine}
          />
        );
      case 'planner':
        return (
          <StudyPlanner 
            state={state} 
            onUpdatePlan={handleUpdatePlan} 
            onToggleItem={handleTogglePlanItem} 
          />
        );
      case 'grades':
        return <GradeSaver grades={state.grades} onAddGrade={handleAddGrade} onRemoveGrade={handleRemoveGrade} />;
      case 'assignments':
        return (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-10 bg-blue-500 rounded-full" />
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Quest Log</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {state.assignments.map(a => (
                <div key={a.id} className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                      {a.subject}
                    </span>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Due: {a.dueDate}</span>
                  </div>
                  <h4 className="font-black text-white text-xl mb-6 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{a.title}</h4>
                  <button 
                    onClick={() => setActiveView('ai-solver')}
                    className="w-full flex items-center justify-center gap-3 text-sm font-black text-white bg-blue-600/20 border border-blue-500/30 py-4 rounded-[1.5rem] hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                  >
                    <Zap className="w-4 h-4 fill-current" /> INVOKE ORACLE
                  </button>
                </div>
              ))}
              {/* Add New Quest Placeholder */}
              <button className="bg-slate-900/40 p-8 rounded-[3rem] border-4 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 group hover:border-white/10 transition-all text-slate-600 hover:text-slate-400">
                <Plus className="w-12 h-12" />
                <span className="font-black uppercase tracking-[0.2em] text-xs">New Quest</span>
              </button>
            </div>
          </div>
        );
      case 'ai-solver':
        return <AssignmentSolver assignments={state.assignments} onAddAssignment={() => {}} />;
      case 'coding':
        return <AssignmentSolver assignments={state.assignments} onAddAssignment={() => {}} isCodingMode />;
      case 'focus':
        return (
          <FocusCenter 
            sessions={state.focusSessions} 
            screentime={state.screentimeLogs} 
            onAddSession={handleAddFocusSession}
            onAddScreentime={handleAddScreentime}
          />
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
