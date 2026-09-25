import React from 'react';
import { ShieldCheck, Cpu, Globe, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#040509] text-slate-400 text-xs pt-16 pb-24 md:pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <span>NEXORA</span>
              <span className="text-cyan-400">✦</span>
            </div>
            <p className="text-slate-400 font-light max-w-sm mb-6 leading-relaxed">
              The Future of Shopping. Designed for 2030 and beyond with sub-orbital autonomous fulfillment, encrypted hardware provenance, and zero acoustic latency.
            </p>

            <div className="flex items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px] font-mono">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Global Sub-Orbital Mesh</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>LiDAR Provenance</span>
              </span>
            </div>
          </div>

          {/* Links 1 */}
          <div className="md:col-span-2">
            <h4 className="text-white font-mono uppercase font-bold text-xs tracking-wider mb-4">
              CAPSULES
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#discovery" className="hover:text-cyan-400 transition-colors">Neural Audio</a></li>
              <li><a href="#discovery" className="hover:text-cyan-400 transition-colors">Cyber Chronometers</a></li>
              <li><a href="#discovery" className="hover:text-cyan-400 transition-colors">Quantum OLED Decks</a></li>
              <li><a href="#drops" className="hover:text-rose-400 transition-colors">Vault Drops</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="md:col-span-2">
            <h4 className="text-white font-mono uppercase font-bold text-xs tracking-wider mb-4">
              ECOSYSTEM
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-slate-300">NEXORA Rewards</span></li>
              <li><span className="text-slate-300">Autonomous Fleet</span></li>
              <li><span className="text-slate-300">Biometric Safe Handoff</span></li>
              <li><span className="text-slate-300">Developer Ledger</span></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="md:col-span-4">
            <h4 className="text-white font-mono uppercase font-bold text-xs tracking-wider mb-4">
              STAY IN SYNC
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Receive encrypted alerts whenever a new limited batch unlock occurs.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="explorer@domain.com"
                className="bg-[#0C0F1E] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-full font-mono"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  alert('Registered for NEXORA Vault Alerts ✦');
                }}
                className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shrink-0"
              >
                JOIN
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-4 text-slate-500">
            <span>© 2030 NEXORA SYSTEMS INC. ALL RIGHTS RESERVED.</span>
            <span>·</span>
            <span>WCAG AA COMPLIANT</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <div className="w-6 h-6 rounded-lg glass-panel flex items-center justify-center">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
