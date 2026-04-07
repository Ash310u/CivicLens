import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, CheckCircle, Loader2, Route, Eye } from 'lucide-react';

const stages = [
  { text: 'Scanning uploaded image…', icon: Scan, status: 'processing', progress: 20 },
  { text: 'Validating waste presence…', icon: Eye, status: 'processing', progress: 40 },
  { text: 'Classifying → plastic_waste', icon: Loader2, status: 'processing', progress: 60 },
  { text: 'Severity: MEDIUM | Confidence: HIGH', icon: CheckCircle, status: 'success', progress: 80 },
  { text: 'Routing to Solid Waste Mgmt, Ward 14…', icon: Route, status: 'processing', progress: 90 },
  { text: '✓ Report CLR-2024-04512 filed', icon: CheckCircle, status: 'complete', progress: 100 },
];

export default function TerminalLoader() {
  const [currentStage, setCurrentStage] = useState(0);
  const [visibleStages, setVisibleStages] = useState([]);
  const [typing, setTyping] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStage >= stages.length) {
      const resetTimer = setTimeout(() => {
        setCurrentStage(0);
        setVisibleStages([]);
        setTyping('');
      }, 3000);
      return () => clearTimeout(resetTimer);
    }

    const stage = stages[currentStage];
    let charIndex = 0;
    setTyping('');

    const typeInterval = setInterval(() => {
      if (charIndex <= stage.text.length) {
        setTyping(stage.text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setVisibleStages(prev => [...prev, { ...stage, id: currentStage }]);
          setTyping('');
          setCurrentStage(prev => prev + 1);
        }, 400);
      }
    }, 35);

    return () => clearInterval(typeInterval);
  }, [currentStage]);

  const currentProgress = currentStage < stages.length ? stages[currentStage]?.progress || 0 : 100;

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-civic-500/20 via-teal-500/10 to-ocean-500/20 rounded-3xl blur-2xl opacity-60" />
      
      <div className="relative glass-strong rounded-2xl overflow-hidden shadow-elevated border border-[var(--border-glass)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-danger-400" />
              <div className="w-3 h-3 rounded-full bg-warning-400" />
              <div className="w-3 h-3 rounded-full bg-success-400" />
            </div>
            <span className="text-xs font-mono text-[var(--text-tertiary)] ml-2">civiclens-ai-validator</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-civic-500 animate-pulse" />
            <span className="text-[10px] font-mono text-civic-500">LIVE</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-5 font-mono text-sm min-h-[280px] max-h-[320px] overflow-hidden">
          {/* System init */}
          <div className="text-[var(--text-tertiary)] text-xs mb-3">
            <span className="text-civic-500">$</span> civiclens validate --image report_img_042.jpg
          </div>

          {/* Completed stages */}
          <AnimatePresence>
            {visibleStages.map((stage) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2.5 mb-2.5"
              >
                <stage.icon
                  size={14}
                  className={
                    stage.status === 'complete'
                      ? 'text-civic-500'
                      : stage.status === 'success'
                      ? 'text-civic-400'
                      : 'text-ocean-400'
                  }
                />
                <span className={
                  stage.status === 'complete'
                    ? 'text-civic-500 font-semibold'
                    : 'text-[var(--text-secondary)]'
                }>
                  {stage.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Currently typing */}
          {currentStage < stages.length && typing && (
            <div className="flex items-center gap-2.5 mb-2.5">
              <Loader2 size={14} className="text-ocean-400 animate-spin" />
              <span className="text-[var(--text-secondary)]">
                {typing}
                <span className={`inline-block w-[2px] h-4 bg-civic-500 ml-0.5 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
              </span>
            </div>
          )}

          {/* Idle cursor */}
          {currentStage >= stages.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--border-subtle)]"
            >
              <span className="text-civic-500 text-xs">$</span>
              <span className={`inline-block w-[2px] h-4 bg-civic-500 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-tertiary)] mb-1.5">
            <span>AI Pipeline Progress</span>
            <span>{currentStage >= stages.length ? 100 : currentProgress}%</span>
          </div>
          <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-civic-500 to-teal-500 rounded-full"
              animate={{ width: `${currentStage >= stages.length ? 100 : currentProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
