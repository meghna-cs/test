
import React from 'react';
import { AttendanceRecord, ClassSchedule } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Heart, 
  Zap, 
  Skull, 
  PartyPopper,
  Trophy,
  Flame,
  Gamepad2,
  AlertTriangle,
  Sword
} from 'lucide-react';

interface AttendanceTrackerProps {
  routine: ClassSchedule[];
  history: AttendanceRecord[];
  target: number;
  lastPerc: number;
  onUpdateHistory: (record: AttendanceRecord) => void;
  onSetRoutine: (routine: ClassSchedule[]) => void;
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ routine, history, target, lastPerc, onUpdateHistory, onSetRoutine }) => {
  const totalClassesSoFar = history.length;
  const attendedCount = history.filter(h => h.status === 'attended').length;
  const currentPercentage = totalClassesSoFar > 0 ? (attendedCount / totalClassesSoFar) * 100 : 0;

  const isRecovering = lastPerc < target && currentPercentage >= target;
  const isWinningStreak = currentPercentage >= target && currentPercentage <= 80 && lastPerc < 80;

  const getStatusMessage = () => {
    if (totalClassesSoFar === 0) return { text: "Level 1: No battles recorded yet.", color: "text-slate-400", icon: Gamepad2 };
    
    if (isRecovering) return { text: "MAJOR WIN: HP RESTORED! You are back in the game!", color: "text-emerald-400", icon: Trophy };
    if (isWinningStreak) return { text: "COMEBACK STREAK: Keep pushing to 80% for full armor!", color: "text-cyan-400", icon: Flame };

    if (currentPercentage >= target) {
      if (currentPercentage >= 95) return { text: "GOD MODE: Legendary Attendance!", color: "text-cyan-400", icon: Trophy };
      if (currentPercentage >= 90) return { text: "S-RANK: Elite Student Status.", color: "text-emerald-400", icon: ShieldCheck };
      return { text: "TARGET CLEARED: Above Criteria.", color: "text-lime-400", icon: PartyPopper };
    } else {
      const recoveryClasses = Math.ceil((target * totalClassesSoFar - 100 * attendedCount) / (100 - target));
      return { 
        text: `LAGGING BEHIND: Attend ${recoveryClasses} more classes to reach ${target}%!`, 
        color: "text-pink-500", 
        icon: Skull 
      };
    }
  };

  const status = getStatusMessage();

  const getAlert = () => {
    const p = Math.floor(currentPercentage);
    if (totalClassesSoFar === 0) return null;
    
    if (p === 75) return { type: 'major', text: "MAJOR ALERT: You have reached the minimum 75% criteria! Do not miss the next class!" };
    if ([95, 90, 85].includes(p)) return { type: 'warning', text: `Warning: Attendance decreased to ${p}%! Don't let it slip further!` };
    if ([80, 78, 77, 76].includes(p)) return { type: 'danger', text: `CRITICAL ALERT: HP at ${p}%! You are approaching the 75% failure threshold!` };
    if (p < target) return { type: 'critical', text: "SYSTEM FAILURE: Attendance below 75%. Academic standing in danger!" };
    return null;
  };

  const activeAlert = getAlert();

  const today = DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todaysClasses = routine.filter(c => c.day === today);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500 pb-20">
      {/* Alert Banner */}
      {activeAlert && (
        <div className={`p-6 rounded-3xl flex items-center gap-5 animate-pulse border-2 shadow-2xl ${
          activeAlert.type === 'major' ? 'bg-indigo-600 border-white text-white' :
          activeAlert.type === 'danger' ? 'bg-pink-600 border-white text-white' :
          activeAlert.type === 'warning' ? 'bg-amber-500/10 border-amber-500 text-amber-500' :
          'bg-red-600 border-white text-white'
        }`}>
          <AlertTriangle className="w-10 h-10 shrink-0" />
          <p className="text-xl font-black uppercase tracking-tight italic">{activeAlert.text}</p>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Bar Card */}
        <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-500 font-black uppercase tracking-widest text-xs">HP (Attendance)</h3>
              <Heart className={`w-6 h-6 ${currentPercentage < target ? 'text-pink-500 animate-pulse' : 'text-emerald-500'}`} />
            </div>
            <div className="flex items-end gap-2 mb-8">
              <span className={`text-8xl font-black tracking-tighter ${currentPercentage < target ? 'text-pink-500' : 'text-cyan-400'}`}>
                {currentPercentage.toFixed(0)}
              </span>
              <span className="text-slate-600 font-bold mb-4 text-2xl">%</span>
            </div>
            
            <div className="w-full h-6 bg-slate-800 rounded-full p-1.5 border border-white/5 shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-1000 relative shadow-[0_0_20px_rgba(0,0,0,0.5)] ${currentPercentage < target ? 'bg-gradient-to-r from-pink-600 to-rose-400' : 'bg-gradient-to-r from-cyan-600 to-emerald-400'}`}
                style={{ width: `${Math.max(currentPercentage, 5)}%` }}
              >
                <div className="absolute top-0 right-0 w-3 h-full bg-white/20 rounded-full blur-[2px]" />
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MIN: {target}%</p>
              {currentPercentage >= 90 && <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest animate-bounce">S-RANK ACHIEVED</p>}
            </div>
          </div>
          <ShieldCheck className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 rotate-12" />
        </div>

        {/* Dynamic Status Card */}
        <div className={`lg:col-span-2 p-10 rounded-[3.5rem] border-4 shadow-2xl flex flex-col md:flex-row items-center gap-10 ${currentPercentage < target ? 'bg-pink-500/5 border-pink-500/20' : 'bg-cyan-500/5 border-cyan-500/20'}`}>
          <div className={`p-10 rounded-[2.5rem] shadow-2xl transition-transform hover:scale-105 ${currentPercentage < target ? 'bg-pink-600 text-white shadow-pink-500/20' : 'bg-cyan-500 text-white shadow-cyan-500/20'}`}>
            <status.icon className="w-16 h-16" />
          </div>
          <div className="text-center md:text-left">
            <h3 className={`text-4xl font-black tracking-tighter mb-4 ${status.color}`}>{status.text}</h3>
            <p className="text-slate-400 text-lg font-bold">
              {currentPercentage >= target ? "Legendary work! You're securing your path to graduation." : "Critical mission failure imminent! You must attend all future encounters to restore health."}
            </p>
            {(isRecovering || isWinningStreak) && (
              <div className="mt-6 flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit mx-auto md:mx-0">
                <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                <span className="text-xs font-black text-white uppercase tracking-widest">Victory Buff Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Combat Encounters Map */}
      <div className="bg-slate-900/80 rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4">
            <Sword className="w-8 h-8 text-pink-500" />
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Daily Encounter: {today}</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Settle your score for today's classes</p>
            </div>
          </div>
          <div className="px-8 py-3 rounded-3xl bg-slate-800 text-cyan-400 font-black text-sm uppercase tracking-widest border border-white/10">
            {todaysClasses.length} Battles Remaining
          </div>
        </div>
        
        <div className="divide-y divide-white/5">
          {todaysClasses.length > 0 ? todaysClasses.map((cls) => (
            <div key={cls.id} className="p-10 flex flex-col lg:flex-row lg:items-center justify-between hover:bg-white/[0.03] transition-all gap-8 group">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-3xl bg-slate-800 border-2 border-white/5 flex flex-col items-center justify-center group-hover:border-cyan-500/40 transition-all shadow-xl">
                  <Zap className="w-8 h-8 text-cyan-500" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{cls.name}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="bg-slate-800 px-3 py-1 rounded-lg text-cyan-500 font-black text-[10px] tracking-widest">{cls.startTime}</span>
                    <div className="w-4 h-[2px] bg-slate-700" />
                    <span className="bg-slate-800 px-3 py-1 rounded-lg text-slate-500 font-black text-[10px] tracking-widest">{cls.endTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => onUpdateHistory({ date: new Date().toISOString(), classId: cls.id, status: 'attended' })}
                  className="flex-1 lg:flex-none px-10 py-5 rounded-[2rem] bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em] shadow-lg active:scale-95"
                >
                  <Zap className="w-5 h-5 fill-current" /> Victory
                </button>
                <button 
                  onClick={() => onUpdateHistory({ date: new Date().toISOString(), classId: cls.id, status: 'missed' })}
                  className="flex-1 lg:flex-none px-10 py-5 rounded-[2rem] bg-pink-500/10 text-pink-500 border-2 border-pink-500/20 hover:bg-pink-500 hover:text-white transition-all flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em] shadow-lg active:scale-95"
                >
                  <Skull className="w-5 h-5" /> Defeat
                </button>
              </div>
            </div>
          )) : (
            <div className="p-32 text-center opacity-50">
              <Gamepad2 className="w-24 h-24 text-slate-700 mx-auto mb-6" />
              <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xl">Peaceful Zone: No Classes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
