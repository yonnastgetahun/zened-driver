'use client';

import { AlertTriangle, XCircle, Pause, Wind } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '@/config';

interface AlertOverlayProps {
  alertActive: boolean;
  alertLevel: number;
  alertVariant: 'A' | 'B';
}

/**
 * Mindful Alert Overlay Component
 * Shows gentle reminders to maintain focus while driving
 * Using calm, non-judgmental language
 */
const AlertOverlay = ({ alertActive, alertLevel, alertVariant }: AlertOverlayProps) => {
  const [dismissed, setDismissed] = useState(false);
  const [breatheCount, setBreatheCount] = useState(0);
  
  // Reset dismissed state when alert becomes inactive
  useEffect(() => {
    if (!alertActive) {
      setDismissed(false);
    }
  }, [alertActive]);
  
  // Breathing animation counter
  useEffect(() => {
    if (alertActive && !dismissed) {
      const timer = setInterval(() => {
        setBreatheCount(prev => (prev + 1) % 8);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [alertActive, dismissed]);
  
  // Don't render if alert is inactive or dismissed
  if (!alertActive || dismissed) return null;
  
  // Get styles based on alert variant (internal only)
  const getAlertStyles = () => {
    const baseStyles = "fixed inset-0 flex items-center justify-center z-50 p-4";
    return `${baseStyles} bg-primary/10 backdrop-blur-sm`;
  };
  
  // Get content styles based on variant (internal only)
  const getContentStyles = () => {
    const baseStyles = "relative rounded-lg p-6 shadow-lg max-w-md w-full";
    return `${baseStyles} bg-background border border-secondary/30`;
  };
  
  // Different message depending on alert level - using mindful language
  const getMessage = () => {
    // Use mindful, non-judgmental language regardless of variant
    if (alertLevel <= 2) {
      return `Let's return to the present moment and set aside distractions.`;
    } else if (alertLevel <= 4) {
      return `Take a breath and return your focus to the road ahead.`;
    } else {
      return `This moment requires your full attention for everyone's safety.`;
    }
  };
  
  // Get breathing instruction
  const getBreathingInstruction = () => {
    if (breatheCount < 4) {
      return "Breathe in...";
    } else {
      return "Breathe out...";
    }
  };
  
  return (
    <AnimatePresence>
      <div className={getAlertStyles()}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20 }}
          className={getContentStyles()}
        >
          {/* Close button - positioned on the right top corner */}
          <button 
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss alert"
          >
            <XCircle size={20} />
          </button>
          
          <div className="flex flex-col gap-4">
            {/* Icon and title */}
            <div className="flex items-center gap-3">
              <div className="bg-secondary/20 p-2 rounded-full">
                <Pause className="text-primary" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-primary">
                Mindfulness Reminder
              </h2>
            </div>
            
            {/* Alert message */}
            <p className="text-lg text-text">
              {getMessage()}
            </p>
            
            {/* Breathing exercise */}
            <div className="flex items-center justify-center p-3 mt-2">
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: breatheCount < 4 ? 1.5 : 1,
                    opacity: breatheCount < 4 ? 0.8 : 0.4
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute w-24 h-24 rounded-full bg-secondary/30"
                />
                <Wind className="text-secondary z-10" size={20} />
              </div>
              <p className="ml-4 text-secondary font-medium">
                {getBreathingInstruction()}
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={() => setDismissed(true)}
                className="py-2 px-4 bg-secondary rounded-md text-primary font-medium hover:bg-secondary/90 transition-colors"
              >
                I'm Present Now
              </button>
              {alertLevel >= 3 && (
                <button
                  onClick={() => setDismissed(true)}
                  className="py-2 px-4 border border-secondary/30 rounded-md text-primary font-medium hover:bg-secondary/10 transition-colors"
                >
                  Pull Over Safely
                </button>
              )}
            </div>
            
            {/* Mindful driving quote */}
            <p className="text-sm text-center italic text-muted-foreground mt-2">
              "The journey is what matters, not just the destination."
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AlertOverlay; 