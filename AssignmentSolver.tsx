
import React from 'react';
import { Assignment } from '../types';
import { queryAI, AIServiceMode } from '../services/geminiService';
import { 
  Sparkles, 
  Loader2, 
  Copy, 
  Check, 
  FileUp, 
  Code2, 
  BrainCircuit, 
  Terminal,
  Cpu,
  Info,
  Bug,
  Layout,
  FileJson,
  Braces,
  Zap
} from 'lucide-react';

interface AssignmentSolverProps {
  assignments: Assignment[];
  onAddAssignment: (assignment: Assignment) => void;
  isCodingMode?: boolean;
}

const AssignmentSolver: React.FC<AssignmentSolverProps> = ({ assignments, onAddAssignment, isCodingMode = false }) => {
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [solution, setSolution] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('Python');
  const [showAnalysis, setShowAnalysis] = React.useState(true);
  const [mode, setMode] = React.useState<AIServiceMode>(isCodingMode ? 'coding' : 'solve');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSolve = async (imageData?: string) => {
    if (!query.trim() && !imageData) return;
    setLoading(true);
    try {
      const result = await queryAI(
        query || "Solve this code task", 
        mode, 
        imageData, 
        selectedLanguage,
        { detailed: showAnalysis }
      );
      setSolution(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      handleSolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (!solution) return;
    navigator.clipboard.writeText(solution);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codingLanguages = [
    { name: 'Python', icon: Cpu },
    { name: 'JavaScript', icon: FileJson },
    { name: 'HTML/CSS', icon: Layout }
  ];

  const codingModes: { id: AIServiceMode; label: string; icon: any; color: string }[] = [
    { id: 'coding', label: 'Write Script', icon: Code2, color: 'text-cyan-400' },
    { id: 'debug', label: 'Fix Bugs', icon: Bug, color: 'text-pink-500' },
    { id: 'code-analysis', label: 'Complexity', icon: BrainCircuit, color: 'text-amber-500' },
  ];

  const academicModes: { id: AIServiceMode; label: string; icon: any; color: string }[] = [
    { id: 'solve', label: 'Instant Solve', icon: Sparkles, color: 'text-emerald-400' },
    { id: 'explain', label: 'Logic Breakdown', icon: Info, color: 'text-blue-400' },
  ];

  const activeModes = isCodingMode ? codingModes : academicModes;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500">
      <div className={`p-8 rounded-[3rem] border shadow-2xl overflow-hidden transition-all duration-500 ${isCodingMode ? 'bg-[#0b0f19] border-cyan-500/20 shadow-cyan-500/5' : 'bg-slate-900 border-white/5 shadow-2xl'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-5">
            <div className={`p-5 rounded-3xl shadow-xl transition-transform hover:rotate-6 ${isCodingMode ? 'bg-cyan-500 text-white shadow-cyan-500/20' : 'bg-pink-600 text-white shadow-pink-500/20'}`}>
              {isCodingMode ? <Terminal className="w-10 h-10" /> : <Sparkles className="w-10 h-10" />}
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter">
                {isCodingMode ? 'Coding Lab' : 'The Oracle'}
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                {isCodingMode ? 'Strict: Python, JS, HTML/CSS Only' : 'Upload hints or paste scrolls to solve quests'}
              </p>
            </div>
          </div>
          
          {isCodingMode && (
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-2xl border border-white/5">
                {codingLanguages.map(lang => (
                  <button
                    key={lang.name}
                    onClick={() => setSelectedLanguage(lang.name)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${selectedLanguage === lang.name ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                  >
                    <lang.icon className="w-4 h-4" />
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          {activeModes.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`
                  flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black transition-all border-2
                  ${isSelected 
                    ? 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                    : 'bg-slate-800 border-transparent text-slate-500 hover:border-white/10 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : m.color}`} />
                {m.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <div className="absolute top-0 left-0 p-4 pointer-events-none opacity-20">
              <Braces className="w-12 h-12 text-cyan-500" />
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isCodingMode ? `// Write your ${selectedLanguage} logic or problem description here...` : "Paste the quest description or clues..."}
              className={`
                w-full h-72 p-10 rounded-[2.5rem] border outline-none resize-none font-bold transition-all text-xl
                ${isCodingMode 
                  ? 'bg-slate-950 border-white/5 text-cyan-400 font-mono placeholder-slate-800 focus:border-cyan-500/50 shadow-inner' 
                  : 'bg-slate-800 border-white/5 text-slate-200 focus:border-pink-500/50 placeholder-slate-600'
                }
              `}
            />
            <div className="absolute bottom-10 right-10 flex gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-5 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all active:scale-95 shadow-2xl"
              >
                <FileUp className="w-8 h-8" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>
          </div>
          
          <button 
            onClick={() => handleSolve()}
            disabled={loading || !query.trim()}
            className={`
              w-full py-7 rounded-[2rem] font-black text-2xl shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none
              ${isCodingMode ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-cyan-500/20' : 'bg-gradient-to-r from-pink-600 to-violet-600 text-white hover:shadow-pink-500/20'}
            `}
          >
            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : isCodingMode ? <Cpu className="w-8 h-8" /> : <Sparkles className="w-8 h-8 fill-current" />}
            {loading ? 'Compiling Logic...' : isCodingMode ? 'EXECUTE CODE SCRIPT' : 'UNRAVEL QUEST SOLUTION'}
          </button>
        </div>
      </div>

      {solution && (
        <div className={`p-10 rounded-[3rem] border-2 shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-500 ${isCodingMode ? 'bg-slate-950 border-cyan-500/20' : 'bg-slate-900 border-pink-500/20'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-1 h-12 rounded-full ${isCodingMode ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]' : 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]'}`} />
              <h3 className="font-black text-2xl text-white uppercase tracking-tighter">Result Deciphered</h3>
            </div>
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-3 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-all ${isCodingMode ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700' : 'bg-slate-800 text-pink-500 hover:bg-slate-700'}`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Cloned to Clipboard' : 'Copy Result'}
            </button>
          </div>
          
          <div className={`
            p-10 rounded-[2.5rem] leading-relaxed whitespace-pre-wrap text-xl font-bold shadow-inner
            ${isCodingMode 
              ? 'bg-black/50 text-cyan-300 font-mono border border-white/5' 
              : 'bg-white/5 text-slate-300 border border-white/5'
            }
          `}>
            {solution}
          </div>

          <div className="mt-8 flex items-center gap-5 bg-white/5 p-6 rounded-3xl border border-white/5">
            <div className={`p-4 rounded-2xl ${isCodingMode ? 'bg-cyan-500/10 text-cyan-400' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <div>
              <p className="text-white font-black text-lg">Quest Mastery Bonus</p>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Logic verified by Neural-X Engine. Copy and finish your task!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentSolver;
