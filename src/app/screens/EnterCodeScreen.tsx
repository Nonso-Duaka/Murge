import React, { useState, useEffect } from 'react';
// @ts-ignore
import murgeLogoImage from '../../assets/murge-logo-final.png';

interface EnterCodeScreenProps {
  onContinue: (code: string) => void;
}

export function EnterCodeScreen({ onContinue }: EnterCodeScreenProps) {
  const [code, setCode] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 sm:px-8 relative overflow-hidden">
      {/* Background - Atmospheric & Premium */}
      <div className={`fixed inset-0 transition-opacity duration-1500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Deep, rich gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1a1a1a_0%,_#000000_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

        {/* Animated Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '7s' }} />
      </div>

      <div className={`w-full max-w-sm relative z-10 flex flex-col items-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Logo Section */}
        <div className="mb-16 relative group">
          <div className={`absolute inset-0 bg-white/20 blur-3xl rounded-full transition-opacity duration-700 ${mounted ? 'opacity-30' : 'opacity-0'}`} />
          <img
            src={murgeLogoImage}
            alt="Murge"
            className="h-56 w-auto relative z-10 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-transform duration-700 transform hover:scale-105"
          />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-xl font-light text-white tracking-[0.2em] uppercase opacity-90">
              Welcome
            </h1>
            <p className="text-xs text-white/40 tracking-wide">
              Enter your exclusive access code
            </p>
          </div>

          <div className="group relative">
            <div
              className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-white/20 via-white/40 to-white/20 opacity-0 transition duration-500 group-hover:opacity-100 ${isFocused ? 'opacity-100 blur-md' : 'blur-sm'}`}
            />
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="CODE"
                className="block w-full bg-neutral-900/90 text-white placeholder-white/20 border-0 rounded-2xl py-4 px-4 text-center text-xl tracking-[0.3em] font-light focus:ring-0 focus:outline-none focus:bg-neutral-900 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!code}
            className={`
              w-full py-4 rounded-xl text-sm font-semibold tracking-widest uppercase transition-all duration-500
              ${code
                ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)] transform hover:-translate-y-0.5'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
              }
            `}
          >
            Enter Experience
          </button>
        </form>

        {/* Footer */}
        <div className="mt-12">
          <button className="text-[10px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest">
            Need Assistance?
          </button>
        </div>
      </div>
    </div>
  );
}