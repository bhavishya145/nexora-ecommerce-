import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw, Zap } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface SmartProductFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export const SmartProductFinderModal: React.FC<SmartProductFinderModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { addItem } = useCart();
  const [step, setStep] = useState<number>(1);
  const [selectedNeed, setSelectedNeed] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [selectedPreference, setSelectedPreference] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<{ product: Product; matchScore: number }[]>([]);

  if (!isOpen) return null;

  const handleCalculateMatches = async () => {
    setLoading(true);
    setStep(4);
    try {
      const res = await fetch('/api/ai/finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          need: selectedNeed,
          budget: selectedBudget,
          preference: selectedPreference
        })
      });
      const data = await res.json();
      setResults(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedNeed('');
    setSelectedBudget('');
    setSelectedPreference('');
    setResults([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                NEXORA Smart Product Finder
              </h2>
              <p className="text-xs text-neutral-400">
                Answer 3 quick preferences to compute your personalized tech match score
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 my-5">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step >= i ? 'bg-cyan-500' : 'bg-neutral-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Category / Need */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <h3 className="text-sm font-semibold text-neutral-200">
              Step 1: What category are you primarily shopping for?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'Audio', label: 'Planar Acoustics & Audio', desc: 'Lossless headphones, DACs, studio subwoofers' },
                { id: 'Wearables', label: 'Biometrics & Wearables', desc: 'Titanium smart rings, bio-watches & EEG' },
                { id: 'Workstation', label: 'Ergonomic Workstations', desc: 'Hall-effect keyboards, 49" OLEDs, standing desks' },
                { id: 'EDC', label: 'Cyber & Modular EDC', desc: 'Carbon wallets, titanium power vaults & pens' },
                { id: 'Drones', label: 'Drones & Autonomous Bots', desc: '8K gimbal drones & AI desktop companions' },
                { id: 'Energy', label: 'Clean Energy & GaN Power', desc: 'LiFePO4 generators & 240W GaN hubs' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedNeed(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedNeed === opt.id
                      ? 'bg-cyan-950/40 border-cyan-500 text-white'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[11px] text-neutral-400 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-3">
              <button
                disabled={!selectedNeed}
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs hover:bg-cyan-400 transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Target Budget */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <h3 className="text-sm font-semibold text-neutral-200">
              Step 2: What is your preferred budget range?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: '100', label: 'Under $100', desc: 'Essential EDC, high-speed charging, ambient lights' },
                { id: '300', label: '$100 – $300', desc: 'Premium rings, portable projectors, mechanical split boards' },
                { id: '600', label: '$300 – $600', desc: 'Flagship planar headphones, AR glasses, solar stations' },
                { id: '1500', label: '$600 & Beyond', desc: 'Autonomous 8K drones, 49" QD-OLEDs, cold plunge pods' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedBudget(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedBudget === opt.id
                      ? 'bg-cyan-950/40 border-cyan-500 text-white'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[11px] text-neutral-400 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs"
              >
                Back
              </button>
              <button
                disabled={!selectedBudget}
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs hover:bg-cyan-400 transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Priority Preference */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <h3 className="text-sm font-semibold text-neutral-200">
              Step 3: What attribute matters most to you?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'titanium', label: 'Titanium & Carbon Durability', desc: 'CNC grade 5 metal, indestructible lifetime build' },
                { id: 'wireless', label: 'Maximum Wireless Freedom', desc: 'Ultra-low latency, long battery, multi-device sync' },
                { id: 'ergonomic', label: 'Ergonomic Body Support', desc: 'Physical therapy certified posture & zero fatigue' },
                { id: 'autonomous', label: 'Autonomous AI Intelligence', desc: 'LiDAR bypass, auto-framing, computer vision' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPreference(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedPreference === opt.id
                      ? 'bg-cyan-950/40 border-cyan-500 text-white'
                      : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[11px] text-neutral-400 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs"
              >
                Back
              </button>
              <button
                disabled={!selectedPreference}
                onClick={handleCalculateMatches}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-neutral-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Compute My Matches</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Your Best Algorithmic Matches</h3>
                <p className="text-xs text-neutral-400">Based on your category, budget and priority selections</p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Start Over</span>
              </button>
            </div>

            {loading ? (
              <div className="py-16 text-center text-xs text-neutral-400 space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto" />
                <p>Computing acoustic, battery and material correlation scores...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {results.map(({ product, matchScore }) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 flex flex-col justify-between"
                  >
                    <div className="flex gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onClick={() => {
                          onClose();
                          onNavigate('product', product.slug || product.id);
                        }}
                        className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-neutral-400 font-medium">{product.brand}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                            {matchScore}% Match
                          </span>
                        </div>
                        <h4
                          onClick={() => {
                            onClose();
                            onNavigate('product', product.slug || product.id);
                          }}
                          className="text-xs font-semibold text-white truncate cursor-pointer hover:text-cyan-400 mt-0.5"
                        >
                          {product.name}
                        </h4>
                        <div className="text-xs font-bold text-cyan-400 mt-1">
                          ${product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onNavigate('product', product.slug || product.id);
                        }}
                        className="text-[11px] text-neutral-400 hover:text-white"
                      >
                        View Specs
                      </button>
                      <button
                        onClick={() => addItem(product)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
