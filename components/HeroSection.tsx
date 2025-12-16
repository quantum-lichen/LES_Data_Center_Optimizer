import React from 'react';
import { Cpu, Zap, Activity, Repeat } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            LES Data Center Optimizer
          </h1>
          <p className="text-lg text-slate-400">
            Simulating advanced energy reduction in quantum-ready data centers using cognitive entropy minimization.
          </p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Core Technologies</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Activity size={20} />
              </div>
              <div>
                <strong className="block text-slate-200">Low-Entropy Spiral (LES)</strong>
                <span className="text-sm text-slate-400">Aligns incoming requests on an optimized cognitive structure to minimize processing chaos.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Repeat size={20} />
              </div>
              <div>
                <strong className="block text-slate-200">Cognitive Entropy Minimization Loop (CEML)</strong>
                <span className="text-sm text-slate-400">Eliminates redundancies and compresses calculations using dynamic memory patterns.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col justify-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-700"></div>
        
        <div className="relative z-10 text-center space-y-2">
          <p className="text-sm uppercase tracking-widest text-slate-500 font-semibold">Projected Impact</p>
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            67.5%
          </div>
          <p className="text-slate-300 font-medium">Energy Reduction Validated</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-4">
            Comparison between standard linear processing and LES/CEML optimized architecture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;