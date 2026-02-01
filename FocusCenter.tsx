
import React from 'react';
import { 
  Timer, 
  Coffee, 
  Play, 
  Pause, 
  RotateCcw, 
  Smartphone, 
  Plus,
  BarChart2,
  BrainCircuit
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { FocusSession, ScreentimeLog } from '../types';

interface FocusCenterProps {
  sessions: FocusSession[];
  screentime: ScreentimeLog[];
  onAddSession: (session: FocusSession) => void;
  onAddScreentime: (log: ScreentimeLog) => void;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const FocusCenter: React.FC<FocusCenterProps> = ({ sessions, screentime, onAddSession, onAddScreentime }) => {
  const [timerMode, setTimerMode] = React.useState<'work' | 'short' | 'long'>('work');
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [isActive, setIsActive] = React.useState(false);
  const [newScreentime, setNewScreentime] = React.useState({ category: 'Social', minutes: '' });

  const modes = {
    work: { label: 'Focus', minutes: 25, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    short: { label: 'Short Break', minutes: 5, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    long: { label: 'Long Break', minutes: 15, color: 'text-blue-600', bg: 'bg-blue-50' }
  };

  React.useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (timerMode === 'work') {
        onAddSession({
          id: Date.now().toString(),
          subject: 'General Study',
          durationMinutes: modes.work.minutes,
          date: new Date().toISOString()
        });
        alert('Focus Session Complete! Time for a break.');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[timerMode].minutes * 60);
  };

  const switchMode = (m: 'work' | 'short' | 'long') => {
    setTimerMode(m);
    setIsActive(false);
    setTimeLeft(modes[m].minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const screentimeData = [
    { name: 'Social', value: screentime.filter(l => l.category === 'Social').reduce((a, b) => a + b.minutes, 0) },
    { name: 'Study', value: screentime.filter(l => l.category === 'Study').reduce((a, b) => a + b.minutes, 0) },
    { name: 'Entertainment', value: screentime.filter(l => l.category === 'Entertainment').reduce((a, b) => a + b.minutes, 0) },
  ];

  const handleScreentimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScreentime.minutes) return;
    onAddScreentime({
      date: new Date().toISOString(),
      category: newScreentime.category as any,
      minutes: parseInt(newScreentime.minutes)
    });
    setNewScreentime({ ...newScreentime, minutes: '' });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timer Section */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-8">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
            {(Object.keys(modes) as Array<keyof typeof modes>).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${timerMode === m ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
              >
                {modes[m].label}
              </button>
            ))}
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
              <circle 
                cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" 
                className={modes[timerMode].color}
                strokeDasharray={754}
                strokeDashoffset={754 - (754 * timeLeft) / (modes[timerMode].minutes * 60)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-slate-800 tabular-nums">
                {formatTime(timeLeft)}
              </span>
              <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">
                {isActive ? 'Keep Going' : 'Ready?'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={resetTimer}
              className="p-4 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button 
              onClick={toggleTimer}
              className={`p-6 rounded-[2rem] shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 font-black text-lg ${isActive ? 'bg-red-500 text-white shadow-red-200' : 'bg-indigo-600 text-white shadow-indigo-200'}`}
            >
              {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
              {isActive ? 'Pause' : 'Start Session'}
            </button>
          </div>
        </div>

        {/* Wellness Dashboard */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-500" />
              Digital Well-being
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={screentimeData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {screentimeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center gap-3">
                {screentimeData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-sm font-bold text-slate-700">{d.name}</span>
                    <span className="text-xs text-slate-400 ml-auto">{Math.round((d.value / 60) * 10) / 10}h</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleScreentimeSubmit} className="flex gap-2">
              <select 
                value={newScreentime.category}
                onChange={e => setNewScreentime({...newScreentime, category: e.target.value})}
                className="flex-1 p-3 rounded-xl bg-slate-50 border-none outline-none text-sm font-bold"
              >
                <option>Social</option>
                <option>Study</option>
                <option>Entertainment</option>
              </select>
              <input 
                type="number"
                placeholder="Mins"
                value={newScreentime.minutes}
                onChange={e => setNewScreentime({...newScreentime, minutes: e.target.value})}
                className="w-24 p-3 rounded-xl bg-slate-50 border-none outline-none text-sm font-bold"
              />
              <button type="submit" className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700">
                <Plus className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="bg-indigo-900 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 flex items-center gap-4">
            <div className="p-4 bg-indigo-700 rounded-3xl">
              <BrainCircuit className="w-8 h-8 text-indigo-300" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Focus Fact</h4>
              <p className="text-indigo-200 text-sm leading-relaxed">The Pomodoro Technique improves your focus by providing clear boundaries for concentration.</p>
            </div>
          </div>
        </div>
      </div>

      {/* History Bar Chart */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-500" />
          Weekly Study Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sessions.slice(-7)}>
              <XAxis dataKey="date" hide />
              <YAxis stroke="#94a3b8" />
              <Tooltip cursor={{fill: '#f1f5f9'}} />
              <Bar dataKey="durationMinutes" fill="#4f46e5" radius={[10, 10, 10, 10]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FocusCenter;
