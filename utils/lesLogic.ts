// Constants based on the provided Python script
export const NUM_SERVERS = 100;
export const ENERGY_PER_REQUEST = 10;
export const TOTAL_REQUESTS_BATCH_SIZE = 250; // The python script repeats the list 250 times

// The base requests list from the python script
const BASE_REQUESTS = [
  "Optimiser qubit avec spin-locking et kuramoto fc-496",
  "FC-496 protocole pour data center quantique craid",
  "CEML compression pour réduire entropie cognitive les",
  "Générer architecture low-power avec Lichen-OS qubit"
];

// LES: Entropy Calculation
export const calculateEntropyLES = (text: string): number => {
  const motifs = ["qubit", "spin", "kuramoto", "fc-496", "craid"];
  const lowerText = text.toLowerCase();
  
  // Calculate raw probabilities
  let p = motifs.map(motif => {
    // Count occurrences (rough approximation of python's count/len)
    const count = (lowerText.match(new RegExp(motif, 'g')) || []).length;
    return count / text.length;
  });

  // Normalize probabilities as per script: p = [max(x, 1e-10) for x in p]
  p = p.map(x => Math.max(x, 1e-10));

  // p = [x/sum(p) for x in p]
  const sumP = p.reduce((a, b) => a + b, 0);
  p = p.map(x => x / sumP);

  // return min(-sum(x*np.log2(x) for x in p if x>0), 1.0)
  const entropy = -p.reduce((sum, x) => {
    return x > 0 ? sum + (x * Math.log2(x)) : sum;
  }, 0);

  return Math.min(entropy, 1.0);
};

// LES: Request Compression
export const compressRequestLES = (text: string, entropy: number): string => {
  if (entropy > 0.7) {
    return `COMP_${text.slice(0, 5)}`;
  } else {
    const keywords = ["qubit", "spin", "fc-496"];
    const foundKeywords = keywords.filter(k => text.toLowerCase().includes(k));
    
    if (foundKeywords.length > 0) {
      return foundKeywords.join("_").slice(0, 20);
    } else {
      return `UNK_${text.slice(0, 5)}`;
    }
  }
};

// CEML: Redundancy Detection
export const detectRedundancyCEML = (text: string, memory: Set<string>): boolean => {
  // Python: signature = compresser_requete_les(texte, 0.5)
  // We use 0.5 fixed entropy for the signature generation in detection as per script
  const signature = compressRequestLES(text, 0.5);
  return memory.has(signature);
};

// Generator to produce the full list of requests
export const generateRequests = (): string[] => {
  let allRequests: string[] = [];
  for (let i = 0; i < TOTAL_REQUESTS_BATCH_SIZE; i++) {
    BASE_REQUESTS.forEach((req, idx) => {
      // Create a unique variation as per script: req + f"_{i}"
      // In the python script loop: enumerate(requetes) where requetes is the list * 250
      // The logic in python: req + f"_{i}" where i is the index in the massive list.
      // Let's replicate the exact string generation.
      // The python list is [req1, req2, req3, req4, req1, req2...] 
      // i goes from 0 to 999.
      const globalIndex = i * 4 + idx;
      allRequests.push(`${req}_${globalIndex}`);
    });
  }
  return allRequests;
};

export interface SimulationStepResult {
  basicEnergy: number;
  optimizedEnergy: number;
  processedCount: number;
  currentEntropyLES: number; // To visualize the "cooling"
  isRedundant: boolean;
}

export interface SimulationState {
  basicTotalEnergy: number;
  optimizedTotalEnergy: number;
  processedCount: number;
  currentEntropy: number;
  memorySize: number;
}
