
import React from 'react';
import { 
  CalendarDays, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Zap, 
  Plus,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { AppState, StudyPlanItem } from '../types';
import { queryAI } from '../services/geminiService';

interface StudyPlannerProps {
  state: AppState;
  onUpdatePlan: (plan: StudyPlanItem[]) => void;
  onToggleItem: (id: string) => void;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ state, onUpdatePlan, onToggleItem }) => {
  const [loading, setLoading] = React.useState(false);

  const generateAIPlan = async () => {
    setLoading(true);
    try {
      const context = {
        routine: state.routine,
        assignments: state.assignments.filter(a => a.status === 'pending'),
        focusHistory: state.focusSessions.slice(-5),
        userName: state.userName
      };
      
      const response = await queryAI(JSON.stringify(context), 'study-plan');
      const plan = JSON.parse(response).map((item: any, idx: number) => ({
        ...item,
        id: `plan-${Date.now()}-${idx}`,
        completed: false
      }));
      onUpdatePlan(plan);
    } catch (err) {
      console.error("Plan Generation Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = state.studyPlan.filter(i => i.completed).length;
  const progress = state.studyPlan.length > 0 ? (completedCount / state.studyPlan.length) * 100 : 0;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">AI Daily Planner</h2>
          <p className="text-slate-500 font-medium">Your schedule, optimized by artificial intelligence.</p>
        </div>
        <button 
          onClick={generateAIPlan}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {state.studyPlan.length > 0 ? 'Recalibrate Plan' : 'Generate Daily Plan'}
        </button>
      </div>

      {state.studyPlan.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {state.studyPlan.map((item) => (
              <div 
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                className={`
                  group p-5 rounded-[1.75rem] border transition-all cursor-pointer flex items-center gap-4
                  ${item.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-2xl flex items-center justify-center transition-colors
                  ${item.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}
                `}>
                  {item.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{item.time}</span>
                    <span className={`
                      text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter
                      ${item.priority === 'high' ? 'bg-rose-100 text-rose-600' : item.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}
                    `}>
                      {item.priority}
                    </span>
                  </div>
                  <h4 className={`font-bold text-slate-800 text-lg ${item.completed ? 'line-through' : ''}`}>
                    {item.task}
                  </h4>
                </div>

                <div className={`
                  px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest
                  ${item.type === 'study' ? 'bg-indigo-100 text-indigo-700' : item.type === 'class' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'}
                `}>
                  {item.type}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
              <div className="relative inline-block mb-4">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    className="text-indigo-500 transition-all duration-1000"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * progress) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-800">{Math.round(progress)}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Done</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Efficiency Score</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                {progress > 80 ? "You're a legend today! Keep it up." : progress > 50 ? "Over halfway there. Focus!" : "Let's start ticking items off!"}
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-indigo-400 w-5 h-5 fill-current" />
                <h4 className="font-bold">Planner Logic</h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The AI prioritized your <span className="text-white font-bold">upcoming deadlines</span> and placed study blocks during your high-energy windows.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-16 text-center">
          <div className="bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CalendarDays className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Plan Your Day with AI</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 font-medium">
            We'll look at your classes, assignments, and energy levels to build the perfect schedule.
          </p>
          <button 
            onClick={generateAIPlan}
            disabled={loading}
            className="mt-8 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            Get Started
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyPlanner;
