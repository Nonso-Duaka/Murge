import React, { useState, useEffect } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
// @ts-ignore
import murgeLogoImage from '../../assets/murge-logo.png';

interface EnterCodeScreenProps {
  onContinue: (code: string) => void;
}

export function EnterCodeScreen({ onContinue }: EnterCodeScreenProps) {
  const [code, setCode] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code) {
      onContinue(code);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      {/* Background - Clean Gradient */}
      <div className={`fixed inset-0 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/20 via-transparent to-transparent" />
      </div>

      <div
        className={`w-full max-w-md relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
      >
        {/* Logo - Large & Centered */}
        <div className="text-center mb-20">
          <div
            className={`transition-all duration-1000 delay-300 transform ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
          >
            <img
              src={murgeLogoImage}
              alt="Murge"
              className="h-24 sm:h-32 mx-auto object-contain brightness-0 invert drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Input Area - Minimalist */}
        <div
          className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="group relative">
              <label className="block text-center text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-6">
                Access Code
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="ENTER CODE"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-white/5 border border-white/10 py-5 px-6 text-center text-2xl font-medium text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all rounded-xl font-mono tracking-wide uppercase"
                />
              </div>

              <p className="mt-4 text-center text-xs text-white/40 font-normal flex items-center justify-center gap-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Contact your recruitment team for access
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!code}
                className={`
                  w-full h-14 bg-white text-black font-semibold text-base rounded-xl
                  transition-all duration-300
                  ${!code
                    ? 'opacity-40 cursor-not-allowed'
                    : 'opacity-100 hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]'
                  }
                `}
              >
                Enter
              </button>
            </div>
          </form>
        </div>

        {/* Footer Support Link */}
        <div
          className={`text-center mt-16 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <button className="text-xs text-white/40 font-medium hover:text-white/80 transition-colors">
            Need help?
          </button>
        </div>
      </div>
    </div>
  );
}