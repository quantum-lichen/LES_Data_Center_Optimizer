import React, { useState, useEffect, useCallback, useRef } from 'react';
import HeroSection from './components/HeroSection';
import SimulationResults from './components/SimulationResults';
import { 
  generateRequests, 
  detectRedundancyCEML, 
  calculateEntropyLES, 
  compressRequestLES,
  ENERGY_PER_REQUEST 
} from './utils/lesLogic';
import { Play, RotateCcw, Cpu } from 'lucide-react';

// Types for the live feed log
interface LogEntry {
  id: number;
  text: string;
  type: 'basic' | 'optimized' | 'info';
  details?: string;
}

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Simulation State
  const [basicEnergy, setBasicEnergy] = useState(0);
  const [optimizedEnergy, setOptimizedEnergy] = useState(0);
  const [currentEntropy, setCurrentEntropy] = useState(1.0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Refs for simulation loop
  const requestsRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);
  const memoryRef = useRef<Set<string>>(new Set());
  const entropyRef = useRef(1.0);
  const animationFrameRef = useRef<number>(0);
  const lastProcessedTimeRef = useRef<number>(0);

  // Initialize data
  useEffect(() => {
    requestsRef.current = generateRequests();
  }, []);

  const addLog = (text: string, type: 'basic' | 'optimized' | 'info', details?: string) => {
    setLogs(prev => {
      const newLogs = [{ id: Date.now() + Math.random(), text, type, details }, ...prev];
      return newLogs.slice(0, 5); // Keep only last 5 logs for performance
    });
  };

  const processBatch = useCallback(() => {
    const BATCH_SIZE = 10; // Process 10 requests per frame to speed up visuals
    const total = requestsRef.current.length;
    let localBasicEnergy = 0;
    let localOptimizedEnergy = 0;
    
    // Safety check
    if (currentIndexRef.current >= total) {
      setIsRunning(false);
      addLog("Simulation Complete.", "info");
      return;
    }

    const endIndex = Math.min(currentIndexRef.current + BATCH_SIZE, total);
    
    for (let i = currentIndexRef.current; i < endIndex; i++) {
      const req = requestsRef.current[i];

      // --- BASIC DC LOGIC ---
      localBasicEnergy += ENERGY_PER_REQUEST;

      // --- OPTIMIZED DC LOGIC ---
      let energyForThisReq = 0;

      // 1. CEML: Redundancy check
      // Python: signature = compresser_requete_les(texte, 0.5) inside detecter function
      if (detectRedundancyCEML(req, memoryRef.current)) {
        // Redundant
        energyForThisReq = ENERGY_PER_REQUEST * 0.1;
      } else {
        // 2. LES: Entropy
        const entropy = calculateEntropyLES(req);
        // Update global entropy state (simulated cooling)
        entropyRef.current = Math.max(0.1, entropyRef.current * 0.99);

        // 3. Compression + Storage
        const signature = compressRequestLES(req, entropy);
        memoryRef.current.add(signature);

        // 4. Processing
        // Python: energie = ENERGIE_PAR_REQUETE * (0.3 + 0.7 * self.entropie_les)
        energyForThisReq = ENERGY_PER_REQUEST * (0.3 + 0.7 * entropyRef.current);
      }

      localOptimizedEnergy += energyForThisReq;
    }

    // Update Refs
    currentIndexRef.current = endIndex;

    // Update State
    setBasicEnergy(prev => prev + localBasicEnergy);
    setOptimizedEnergy(prev => prev + localOptimizedEnergy);
    setCurrentEntropy(entropyRef.current);
    setProgress((endIndex / total) * 100);

    // Add a sample log from the batch
    const lastReq = requestsRef.current[endIndex - 1];
    addLog(`Processed: ...${lastReq.slice(-15)}`, 'info', `Entropy: ${entropyRef.current.toFixed(4)}`);

    if (endIndex < total) {
       animationFrameRef.current = requestAnimationFrame(processBatch);
    } else {
      setIsRunning(false);
    }
  }, []);

  const handleStart = () => {
    if (isRunning) return;
    
    // Reset if starting from finished state or mid-way restart
    if (currentIndexRef.current >= requestsRef.current.length) {
      handleReset();
    }
    
    setIsRunning(true);
    // Use requestAnimationFrame for smoother loop than setInterval
    animationFrameRef.current = requestAnimationFrame(processBatch);
  };

  const handleReset = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setIsRunning(false);
    setProgress(0);
    setBasicEnergy(0);
    setOptimizedEnergy(0);
    setCurrentEntropy(1.0);
    setLogs([]);
    
    currentIndexRef.current = 0;
    entropyRef.current = 1.0;
    memoryRef.current = new Set();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header / Hero */}
        <HeroSection />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-4 w-full sm:w-auto">
             <button
              onClick={handleStart}
              disabled={isRunning && progress < 100}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all ${
                isRunning 
                  ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                  : 'bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95'
              }`}
            >
              <Play size={18} fill="currentColor" />
              {progress > 0 && progress < 100 ? 'Simulating...' : progress === 100 ? 'Run Again' : 'Run Simulation'}
            </button>
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all active:scale-95"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>

          <div className="flex items-center gap-6 text-sm">
             <div className="flex flex-col items-end">
                <span className="text-slate-500 uppercase text-xs tracking-wider">System Entropy</span>
                <span className={`font-mono text-lg ${currentEntropy < 0.3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {currentEntropy.toFixed(4)}
                </span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-slate-500 uppercase text-xs tracking-wider">Memory Usage</span>
                <span className="font-mono text-lg text-blue-400">
                  {memoryRef.current.size} <span className="text-xs text-slate-500">sigs</span>
                </span>
             </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Live Feed (Visualizer) */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full min-h-[300px]">
             <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
               <Cpu size={18} className="text-indigo-400" />
               Processing Node
             </h3>
             <div className="flex-1 bg-slate-950 rounded-lg p-4 font-mono text-xs overflow-hidden relative border border-slate-800/50">
                {logs.length === 0 && !isRunning && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                    Waiting to start...
                  </div>
                )}
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="animate-in fade-in slide-in-from-left-4 duration-300">
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>[REQ_ID_{Math.floor(log.id).toString().slice(-4)}]</span>
                        <span className="text-emerald-500/80">{log.details}</span>
                      </div>
                      <div className="text-slate-300 break-words border-l-2 border-indigo-500 pl-3">
                        {log.text}
                      </div>
                    </div>
                  ))}
                </div>
                {isRunning && (
                  <div className="absolute bottom-4 right-4 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-150"></span>
                  </div>
                )}
             </div>
          </div>

          {/* Right: Results Chart */}
          <div className="lg:col-span-2">
            <SimulationResults 
              basicEnergy={basicEnergy} 
              optimizedEnergy={optimizedEnergy} 
              isRunning={isRunning} 
              progress={progress}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-600 text-sm py-8 border-t border-slate-900">
          <p>LES Data Center Simulation • Based on python theoretical model</p>
        </footer>

      </div>
    </div>
  );
};

export default App;
