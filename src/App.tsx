import { useState, useCallback, useRef, useEffect } from 'react';

type Phase = 'idle' | 'holding' | 'restarting' | 'complete';

function App() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [holdProgress, setHoldProgress] = useState(0);
  const [glitchText, setGlitchText] = useState('RESTART');
  const holdIntervalRef = useRef<number | null>(null);
  const restartTimeoutRef = useRef<number | null>(null);

  const messages = [
    'CLEARING CACHE...',
    'FLUSHING MEMORIES...',
    'RESETTING PRIORITIES...',
    'RELEASING TENSION...',
    'REINITIALIZING HOPE...',
    'SYSTEM READY',
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  const startHold = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('holding');
    setHoldProgress(0);

    let progress = 0;
    holdIntervalRef.current = window.setInterval(() => {
      progress += 2;
      setHoldProgress(progress);

      if (progress >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setPhase('restarting');
      }
    }, 30);
  }, [phase]);

  const endHold = useCallback(() => {
    if (phase !== 'holding') return;
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setHoldProgress(0);
    setPhase('idle');
  }, [phase]);

  // Restart sequence
  useEffect(() => {
    if (phase === 'restarting') {
      setCurrentMessage(0);
      let msgIndex = 0;

      const messageInterval = setInterval(() => {
        msgIndex++;
        setCurrentMessage(msgIndex);
        if (msgIndex >= messages.length - 1) {
          clearInterval(messageInterval);
          setTimeout(() => setPhase('complete'), 800);
        }
      }, 600);

      return () => clearInterval(messageInterval);
    }
  }, [phase, messages.length]);

  // Complete phase - reset after delay
  useEffect(() => {
    if (phase === 'complete') {
      restartTimeoutRef.current = window.setTimeout(() => {
        setPhase('idle');
        setHoldProgress(0);
        setCurrentMessage(0);
      }, 3000);

      return () => {
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      };
    }
  }, [phase]);

  // Glitch effect for idle state
  useEffect(() => {
    if (phase === 'idle') {
      const glitchChars = 'R3ST@RT_SYS_1NIT';
      const glitchInterval = setInterval(() => {
        if (Math.random() > 0.92) {
          const glitched = 'RESTART'.split('').map((char, i) =>
            Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
          ).join('');
          setGlitchText(glitched);
          setTimeout(() => setGlitchText('RESTART'), 100);
        }
      }, 200);
      return () => clearInterval(glitchInterval);
    }
  }, [phase]);

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0b] relative overflow-hidden flex flex-col">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scan lines */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.02]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,180,50,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,180,50,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Top status bar */}
      <div className="w-full px-4 md:px-8 py-4 md:py-6 flex justify-between items-center font-mono text-[10px] md:text-xs text-[#4a4a4a] tracking-wider">
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${phase === 'complete' ? 'bg-emerald-500' : 'bg-amber-500'} ${phase === 'restarting' ? 'animate-pulse' : ''}`} />
          SYS_STATUS: {phase === 'complete' ? 'REFRESHED' : phase === 'restarting' ? 'RESTARTING' : 'OPERATIONAL'}
        </span>
        <span className="hidden sm:block">PWR: 100% | TEMP: NOMINAL</span>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {/* Label above button */}
        <div className="mb-6 md:mb-8 text-center">
          <p className="font-mono text-[10px] md:text-xs text-[#666] tracking-[0.3em] uppercase mb-2">
            {phase === 'complete' ? 'Restart Complete' : phase === 'restarting' ? 'Processing' : 'Manual Override'}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#e8e8e8] tracking-tight">
            {phase === 'complete' ? 'You Are Reset' : 'Restart Yourself'}
          </h1>
        </div>

        {/* The Button */}
        <div className="relative">
          {/* Outer housing */}
          <div
            className={`
              w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full
              bg-gradient-to-b from-[#1a1a1c] to-[#0d0d0e]
              shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_20px_60px_rgba(0,0,0,0.8)]
              flex items-center justify-center
              border border-[#222]
              transition-all duration-300
              ${phase === 'complete' ? 'border-emerald-900/30' : ''}
            `}
          >
            {/* Progress ring */}
            {(phase === 'holding' || phase === 'restarting') && (
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="46%"
                  fill="none"
                  stroke={phase === 'restarting' ? '#f59e0b' : '#f59e0b'}
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 46} ${2 * Math.PI * 46}`}
                  strokeDashoffset={2 * Math.PI * 46 * (1 - (phase === 'restarting' ? 1 : holdProgress / 100))}
                  className="transition-all duration-75"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' }}
                />
              </svg>
            )}

            {/* Inner button */}
            <button
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              disabled={phase === 'restarting' || phase === 'complete'}
              className={`
                w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full
                transition-all duration-150 cursor-pointer
                flex flex-col items-center justify-center gap-2
                select-none touch-none
                disabled:cursor-not-allowed
                ${phase === 'holding'
                  ? 'bg-gradient-to-b from-[#2a2a2c] to-[#1a1a1c] shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] translate-y-1'
                  : phase === 'complete'
                  ? 'bg-gradient-to-b from-emerald-900/20 to-emerald-950/30 shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.05)]'
                  : 'bg-gradient-to-b from-[#2d2d30] to-[#1d1d1f] shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] hover:from-[#333336] hover:to-[#232326]'
                }
                ${phase === 'restarting' ? 'animate-pulse' : ''}
              `}
              style={{
                boxShadow: phase === 'holding'
                  ? 'inset 0 4px 20px rgba(0,0,0,0.9), 0 0 30px rgba(245,158,11,0.2)'
                  : phase === 'complete'
                  ? '0 8px 24px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.05), 0 0 40px rgba(16,185,129,0.15)'
                  : undefined,
              }}
            >
              {/* Power icon */}
              <svg
                className={`w-10 h-10 sm:w-12 sm:h-12 ${phase === 'complete' ? 'text-emerald-400' : 'text-amber-500'} transition-colors`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
              </svg>

              {/* Button text */}
              <span
                className={`
                  font-mono text-xs sm:text-sm tracking-[0.2em]
                  ${phase === 'complete' ? 'text-emerald-400' : 'text-[#888]'}
                  transition-colors
                `}
              >
                {phase === 'complete' ? 'DONE' : phase === 'restarting' ? 'WAIT' : glitchText}
              </span>
            </button>
          </div>

          {/* Warning stripes - decorative */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-2 overflow-hidden">
            <div
              className="w-full h-full opacity-30"
              style={{
                background: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 4px, transparent 4px, transparent 8px)',
              }}
            />
          </div>
        </div>

        {/* Instructions / Status */}
        <div className="mt-16 md:mt-20 text-center h-12">
          {phase === 'idle' && (
            <p className="font-mono text-[10px] md:text-xs text-[#555] tracking-wider animate-pulse">
              HOLD TO INITIATE RESTART
            </p>
          )}
          {phase === 'holding' && (
            <p className="font-mono text-[10px] md:text-xs text-amber-500/80 tracking-wider">
              KEEP HOLDING... {Math.round(holdProgress)}%
            </p>
          )}
          {phase === 'restarting' && (
            <p className="font-mono text-[10px] md:text-xs text-amber-500 tracking-wider">
              {messages[currentMessage]}
            </p>
          )}
          {phase === 'complete' && (
            <p className="font-mono text-[10px] md:text-xs text-emerald-400/80 tracking-wider">
              TAKE A DEEP BREATH. YOU ARE NEW.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 py-4 md:py-6 text-center">
        <p className="font-mono text-[9px] md:text-[10px] text-[#3a3a3a] tracking-wider">
          Requested by @Peyton_Nowlin · Built by @clonkbot
        </p>
      </footer>

      {/* Glitch overlay during restart */}
      {phase === 'restarting' && (
        <div
          className="fixed inset-0 pointer-events-none z-30 animate-glitch"
          style={{
            background: 'transparent',
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </div>
  );
}

export default App;
