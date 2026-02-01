
import React from 'react';
import { SemesterGrade } from '../types';
import { Plus, Trash2, Trophy, Star, TrendingUp, BarChart3, Medal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface GradeSaverProps {
  grades: SemesterGrade[];
  onAddGrade: (grade: SemesterGrade) => void;
  onRemoveGrade: (semester: number) => void;
}

const GradeSaver: React.FC<GradeSaverProps> = ({ grades, onAddGrade, onRemoveGrade }) => {
  const [newSgpa, setNewSgpa] = React.useState('');
  const [newCredits, setNewCredits] = React.useState('');

  const totalCredits = grades.reduce((acc, g) => acc + g.credits, 0);
  const cgpa = totalCredits > 0 
    ? grades.reduce((acc, g) => acc + (g.sgpa * g.credits), 0) / totalCredits 
    : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSgpa || !newCredits) return;
    onAddGrade({
      semester: grades.length + 1,
      sgpa: parseFloat(newSgpa),
      credits: parseInt(newCredits)
    });
    setNewSgpa('');
    setNewCredits('');
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CGPA Leaderboard Card */}
        <div className="bg-gradient-to-br from-pink-600 to-indigo-700 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 opacity-70">
              <Medal className="w-5 h-5" />
              <h3 className="font-black uppercase tracking-[0.2em] text-[10px]">Global Score (CGPA)</h3>
            </div>
            <div className="flex items-end gap-3 mb-8">
              <span className="text-8xl font-black tracking-tighter">{cgpa.toFixed(2)}</span>
              <span className="text-indigo-200 text-2xl font-black mb-4">/ 10</span>
            </div>
            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
              <Star className="w-8 h-8 text-yellow-400 fill-current" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Rank: S-Tier Prodigy</p>
                <p className="text-xs font-bold text-white">Based on {totalCredits} Total XP (Credits)</p>
              </div>
            </div>
          </div>
          <Trophy className="absolute -top-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
        </div>

        {/* GPA Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl h-80 relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-white text-xl uppercase tracking-tighter flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
              Performance Timeline
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SGPA Trend</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={grades}>
              <defs>
                <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="semester" stroke="#475569" fontSize={10} fontWeight="bold" />
              <YAxis domain={[0, 10]} stroke="#475569" fontSize={10} fontWeight="bold" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="sgpa" stroke="#22d3ee" strokeWidth={4} fillOpacity={1} fill="url(#colorGpa)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form to Add Semester */}
        <div className="bg-slate-900 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl">
          <h3 className="text-2xl font-black text-white tracking-tighter mb-8 uppercase flex items-center gap-3">
            <Plus className="w-6 h-6 text-pink-500" />
            New Score Entry
          </h3>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Semester SGPA</label>
              <input 
                type="number" step="0.01" min="0" max="10"
                value={newSgpa} onChange={e => setNewSgpa(e.target.value)}
                className="w-full p-5 rounded-2xl bg-slate-800 border border-white/5 text-white font-bold text-lg outline-none focus:border-pink-500/50 transition-colors"
                placeholder="e.g. 9.20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Credits (XP)</label>
              <input 
                type="number"
                value={newCredits} onChange={e => setNewCredits(e.target.value)}
                className="w-full p-5 rounded-2xl bg-slate-800 border border-white/5 text-white font-bold text-lg outline-none focus:border-pink-500/50 transition-colors"
                placeholder="e.g. 24"
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-6 rounded-3xl font-black text-lg shadow-xl shadow-pink-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-tighter">
              <Star className="w-6 h-6 fill-current" /> Save High Score
            </button>
          </form>
        </div>

        {/* History of Grades */}
        <div className="bg-slate-900/50 p-10 rounded-[3.5rem] border border-white/5 shadow-2xl flex flex-col">
          <h3 className="text-2xl font-black text-white tracking-tighter mb-8 uppercase flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Archive Results
          </h3>
          <div className="flex-1 space-y-4 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
            {grades.map(g => (
              <div key={g.semester} className="flex items-center justify-between p-6 bg-slate-800/50 rounded-3xl border border-white/5 group hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 font-black">
                    S{g.semester}
                  </div>
                  <div>
                    <p className="font-black text-white uppercase text-sm tracking-tight">Semester {g.semester}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{g.credits} Credits Transferred</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-black text-cyan-400 tracking-tighter">{g.sgpa.toFixed(2)}</span>
                  <button onClick={() => onRemoveGrade(g.semester)} className="text-slate-600 hover:text-pink-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {grades.length === 0 && (
              <div className="text-center py-20 opacity-30">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p className="font-black uppercase tracking-[0.2em] text-xs">No Records Found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeSaver;
