
import React from 'react';
import { 
  Gamepad2, 
  ShieldCheck, 
  Trophy, 
  ScrollText, 
  Zap, 
  Code2,
  Timer,
  Menu,
  X,
  Target,
  Sparkles
} from 'lucide-react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Hub', icon: Gamepad2, color: 'hover:text-cyan-400' },
    { id: 'attendance', label: 'HP Tracker', icon: ShieldCheck, color: 'hover:text-emerald-400' },
    { id: 'planner', label: 'Daily Quests', icon: Target, color: 'hover:text-amber-400' },
    { id: 'focus', label: 'Mana Recharge', icon: Timer, color: 'hover:text-violet-400' },
    { id: 'grades', label: 'High Score', icon: Trophy, color: 'hover:text-pink-400' },
    { id: 'assignments', label: 'Quest Log', icon: ScrollText, color: 'hover:text-blue-400' },
    { id: 'ai-solver', label: 'The Oracle', icon: Sparkles, color: 'hover:text-yellow-400' },
    { id: 'coding', label: 'Coding Lab', icon: Code2, color: 'hover:text-indigo-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col md:flex-row font-sans selection:bg-pink-500/30">
      {/* Mobile Game Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-1.5 rounded-lg shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-white">STUDENT OS</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-800 rounded-xl">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900/80 backdrop-blur-xl border-r border-white/5 transition-all duration-300 md:translate-x-0 md:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="hidden md:flex items-center gap-3 mb-10">
            <div className="bg-gradient-to-br from-pink-500 to-violet-600 p-2.5 rounded-2xl shadow-xl shadow-pink-500/20 rotate-3">
              <Zap className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter leading-none">PULSE</h1>
              <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em]">Game Level 24</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as ViewType);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-white/10 text-white font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                      : 'text-slate-400 hover:bg-white/5 ' + item.color}
                  `}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-pink-500 rounded-r-full shadow-[0_0_12px_rgba(236,72,153,0.8)]" />}
                  <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? 'text-pink-500' : ''}`} />
                  <span className="tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] border border-white/5 shadow-2xl">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">JD</div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-white">John Doe</p>
                <div className="w-full h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                  <div className="w-3/4 h-full bg-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
        {/* Background Gradients */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
