
import React from 'react';
import { AppState, ViewType } from '../types';
import { 
  ArrowRight, 
  Target, 
  Trophy, 
  Zap, 
  Flame, 
  BrainCircuit, 
  Star,
  ShieldCheck,
  Timer as TimerIcon,
  Sword,
  Crown
} from 'lucide-react';

interface DashboardProps {
  state: AppState;
  onSwitchView: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onSwitchView }) => {
  const totalClassesSoFar = state.history.length;
  const attendedCount = state.history.filter(h => h.status === 'attended').length;
  const attendancePerc = totalClassesSoFar > 0 ? (attendedCount / totalClassesSoFar) * 100 : 0;
  
  const totalCredits = state.grades.reduce((acc, g) => acc + g.credits, 0);
  const cgpa = totalCredits > 0 
    ? state.grades.reduce((acc, g) => acc + (g.sgpa * g.credits), 0) / totalCredits 
    : 0;

  const totalFocusMinutes = state.focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const upcomingAssignments = state.assignments.filter(a => a.status === 'pending');

  return (
    <div className="space-y-12 pb-20">
      {/* Player Profile Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-pulse border-4 border-white/10">
              <Crown className="text-white w-12 h-12" />
            </div>
            <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">LVL 24</div>
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">PULSE HUB</h1>
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 font-black text-xs uppercase tracking-widest">Master Student</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">{attendedCount} Missions Won</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-white/5 p-4 rounded-3xl flex items-center gap-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <Flame className="w-6 h-6 text-orange-500 fill-current" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Win Streak</p>
              <p className="font-black text-white text-xl leading-none">4 DAYS</p>
            </div>
          </div>
          <button 
            onClick={() => onSwitchView('ai-solver')}
            className="bg-white text-black px-8 py-4 rounded-3xl font-black shadow-[0_0_25px_rgba(255,255,255,0.1)] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
          >
            <Zap className="w-5 h-5 fill-current" />
            INSTANT SOLVE
          </button>
        </div>
      </header>

      {/* Main Game Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Health (HP)" 
          value={`${attendancePerc.toFixed(0)}%`} 
          subtext={attendancePerc < state.attendanceTarget ? "Low Health!" : "Tanking!"}
          status={attendancePerc < state.attendanceTarget ? 'danger' : 'success'}
          icon={ShieldCheck}
          onClick={() => onSwitchView('attendance')}
        />
        <StatCard 
          label="Mana (Energy)" 
          value={`${totalFocusMinutes}m`} 
          subtext="Focus flow intensity"
          status="neutral"
          icon={TimerIcon}
          onClick={() => onSwitchView('focus')}
        />
        <StatCard 
          label="Global Score" 
          value={cgpa.toFixed(2)} 
          subtext="Leaderboard ranking"
          status="neutral"
          icon={Trophy}
          onClick={() => onSwitchView('grades')}
        />
        <StatCard 
          label="Open Quests" 
          value={upcomingAssignments.length.toString()} 
          subtext="Bounty pending"
          status={upcomingAssignments.length > 0 ? 'warning' : 'success'}
          icon={Sword}
          onClick={() => onSwitchView('assignments')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* AI Mission Intel */}
          <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 text-cyan-400 mb-4">
                  <BrainCircuit className="w-6 h-6" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Neural Interface Insights</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-6 tracking-tighter">Your Logic Buff: <span className="text-indigo-400">Coding Specialist</span></h2>
                <p className="text-slate-400 font-bold mb-10 leading-relaxed text-lg">
                  Detected high engagement in <span className="text-white">Python Scripts</span>. We suggest completing your coding quests during the 10 AM focus window to maximize XP gain.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => onSwitchView('planner')} className="bg-cyan-500 text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-cyan-500/20">ACCEPT MISSION</button>
                  <button onClick={() => onSwitchView('coding')} className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-black text-sm hover:bg-white/10 transition-all">VIEW LAB</button>
                </div>
              </div>
              <div className="hidden md:flex w-48 h-48 bg-white/5 rounded-[2.5rem] items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent" />
                <Star className="w-20 h-20 text-cyan-500 animate-spin-slow" />
              </div>
            </div>
            {/* Background Grids */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </section>

          {/* Schedule Quests */}
          <section className="bg-slate-900/50 p-8 rounded-[3rem] border border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                <Target className="w-6 h-6 text-pink-500" />
                Active Encounter Map
              </h2>
              <button onClick={() => onSwitchView('attendance')} className="text-pink-500 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                Manage Map <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {state.routine.length > 0 ? state.routine.slice(0, 3).map(cls => (
                <div key={cls.id} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-pink-500 shadow-xl group-hover:scale-110 transition-transform">
                    <Sword className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-white text-lg group-hover:text-pink-500 transition-colors">{cls.name}</h4>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{cls.day} Encounter • {cls.startTime} - {cls.endTime}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-pink-500" />
                    </div>
                    <span className="text-[8px] font-black text-pink-500 uppercase mt-2 tracking-widest">In Progress</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 text-slate-700 font-black uppercase tracking-[0.2em] text-sm">No Missions Available</div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Achievement Box */}
          <section className="bg-gradient-to-br from-violet-600 to-indigo-700 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <Crown className="w-16 h-16 mb-6 text-white/20 -rotate-12 group-hover:rotate-0 transition-transform" />
            <h3 className="text-2xl font-black mb-4 tracking-tighter">Legendary Status</h3>
            <p className="text-indigo-100 font-medium mb-8 leading-relaxed">Boost your final score by 15% by completing 5 consecutive focus recharge sessions.</p>
            <button 
              onClick={() => onSwitchView('focus')}
              className="w-full bg-white text-indigo-700 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
            >
              Start Recharge
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>

          {/* Tip of the Day */}
          <section className="bg-emerald-500/5 p-8 rounded-[3rem] border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-500">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-black text-emerald-500 uppercase text-xs tracking-widest">Pro Hack</h3>
            </div>
            <p className="text-slate-300 font-bold leading-relaxed">
              Enable <span className="text-emerald-400 underline">Logic Overlays</span> in coding lab to view Big O complexity while you build. Optimization is key to S-Rank!
            </p>
          </section>
          
          {/* Danger Alert */}
          {attendancePerc < state.attendanceTarget && (
            <section className="p-8 rounded-[3rem] bg-pink-500/10 border border-pink-500/30 animate-pulse">
              <h3 className="font-black text-pink-500 uppercase text-xs tracking-[0.2em] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 rotate-180" />
                SYSTEM ALERT
              </h3>
              <p className="text-pink-400 font-bold leading-relaxed">
                Your HP is dangerously low! Restore your attendance status before the next semester's boss battle.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  status: 'success' | 'danger' | 'warning' | 'neutral';
  icon: any;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, status, icon: Icon, onClick }) => {
  const colors = {
    success: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5',
    danger: 'text-pink-500 border-pink-500/20 bg-pink-500/5',
    warning: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    neutral: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
  };

  return (
    <button onClick={onClick} className={`p-8 rounded-[2.5rem] border shadow-2xl text-left transition-all group relative overflow-hidden hover:scale-105 hover:shadow-cyan-500/10 ${colors[status]}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-2xl">
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-4xl font-black text-white group-hover:text-white transition-colors tracking-tighter">{value}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">{label}</p>
        <p className="text-[9px] font-black uppercase tracking-tighter opacity-80">{subtext}</p>
      </div>
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
        <ArrowRight className="w-5 h-5 text-white" />
      </div>
    </button>
  );
};

export default Dashboard;
