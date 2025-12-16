import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface SimulationResultsProps {
  basicEnergy: number;
  optimizedEnergy: number;
  isRunning: boolean;
  progress: number;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ basicEnergy, optimizedEnergy, isRunning, progress }) => {
  const economy = basicEnergy > 0 ? (1 - optimizedEnergy / basicEnergy) * 100 : 0;
  
  const data = [
    {
      name: 'Standard DC',
      energy: parseFloat(basicEnergy.toFixed(1)),
    },
    {
      name: 'LES/CEML DC',
      energy: parseFloat(optimizedEnergy.toFixed(1)),
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
        Simulation Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Standard Energy</p>
          <p className="text-2xl font-mono text-cyan-400">{basicEnergy.toFixed(1)} <span className="text-sm text-slate-500">units</span></p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">Optimized Energy</p>
          <p className="text-2xl font-mono text-emerald-400">{optimizedEnergy.toFixed(1)} <span className="text-sm text-slate-500">units</span></p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 relative overflow-hidden">
          <div className={`absolute inset-0 bg-emerald-500/10 transition-transform origin-left duration-1000 ${economy > 0 ? 'scale-x-100' : 'scale-x-0'}`}></div>
          <p className="text-slate-400 text-sm mb-1 relative z-10">Total Savings</p>
          <p className="text-2xl font-bold text-white relative z-10">{economy.toFixed(1)}%</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Bar dataKey="energy" radius={[0, 4, 4, 0]} barSize={40}>
               {
                  data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#06b6d4' : '#10b981'} />
                  ))
                }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <div className="w-full bg-slate-800 rounded-full h-2.5 mb-1 overflow-hidden">
          <div 
            className={`bg-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-out`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Simulation Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;
