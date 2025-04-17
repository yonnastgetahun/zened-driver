'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useVariantAssignment } from '@/lib/abTesting';

interface AlertSystemProps {
  isDriving: boolean;
  phoneHandling: boolean;
  isPassenger?: boolean;
}

/**
 * Hook managing the alert system with A/B testing variants
 * Handles alert state, audio cues, and escalation logic
 * Optimized for battery efficiency in background mode
 */
export const useAlertSystem = ({ isDriving, phoneHandling, isPassenger = false }: AlertSystemProps) => {
  const [alertActive, setAlertActive] = useState(false);
  const [alertLevel, setAlertLevel] = useState(0);
  const [alertStartTime, setAlertStartTime] = useState<number | null>(null);
  const alertVariant = useVariantAssignment();
  const audioContextRef = useRef<AudioContext | null>(null);
  const escalationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize the AudioContext on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log('AudioContext initialized');
      }
      
      // Remove event listeners after initialization
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
    
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);
  
  // Play alert sound based on variant and level - optimized to reduce calls
  const playAlertSound = useCallback(() => {
    if (!audioContextRef.current) return;
    
    // Skip sound if document is hidden (app in background)
    if (document.visibilityState !== 'visible') {
      console.log('App in background, skipping audio alert');
      return;
    }
    
    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure different sounds based on variant
    if (alertVariant === 'A') {
      // Variant A: More gentle beep
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    } else {
      // Variant B: More aggressive sound
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    }
    
    // Increase intensity based on alert level
    const duration = 0.5 + (alertLevel * 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
    
    console.log(`Playing ${alertVariant === 'A' ? 'standard' : 'aggressive'} alert sound at level ${alertLevel}`);
  }, [alertVariant, alertLevel]);
  
  // Log alert metrics to both localStorage and server if available
  const logAlertMetrics = useCallback(async (variant: 'A' | 'B', duration: number, level: number) => {
    // Log to localStorage for client-side analysis
    const alertMetrics = JSON.parse(localStorage.getItem('alertMetrics') || '{"variantA":{"count":0,"avgDuration":0},"variantB":{"count":0,"avgDuration":0}}');
    const variantKey = variant === 'A' ? 'variantA' : 'variantB';
    
    const currentCount = alertMetrics[variantKey].count;
    const currentAvgDuration = alertMetrics[variantKey].avgDuration;
    
    alertMetrics[variantKey].count = currentCount + 1;
    alertMetrics[variantKey].avgDuration = 
      (currentAvgDuration * currentCount + duration) / (currentCount + 1);
    
    localStorage.setItem('alertMetrics', JSON.stringify(alertMetrics));
    
    // Log to server if user is authenticated
    try {
      const response = await fetch('/api/alert-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alertLevel: level,
          alertVariant: variant,
          duration,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to log alert metrics to server:', await response.text());
      }
    } catch (error) {
      console.error('Error sending alert metrics to server:', error);
    }
  }, []);
  
  // Handle alert activation and escalation
  useEffect(() => {
    // Clean up any existing interval
    if (escalationIntervalRef.current) {
      clearInterval(escalationIntervalRef.current);
      escalationIntervalRef.current = null;
    }
    
    // Only trigger alerts if user is driving, handling phone, and not in passenger mode
    if (isDriving && phoneHandling && !isPassenger) {
      if (!alertActive) {
        setAlertActive(true);
        setAlertStartTime(Date.now());
        console.log(`Alert activated with variant ${alertVariant}`);
        
        // Trigger event
        window.dispatchEvent(new CustomEvent('alertActivated', { 
          detail: { alertVariant, timestamp: new Date().toISOString() } 
        }));
        
        // Log alert start to database
        fetch('/api/alert-metrics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            alertLevel: 1,
            alertVariant,
            started_at: new Date().toISOString(),
            ended_at: null
          }),
        }).catch(err => console.error('Error logging alert start:', err));
        
        // Initial alert sound
        playAlertSound();
      }
      
      // Set up escalation interval - adaptive based on foreground/background state
      const getEscalationInterval = () => {
        const isBackground = document.visibilityState !== 'visible';
        const baseInterval = alertVariant === 'A' ? 8000 : 5000; // Variant B escalates faster
        return isBackground ? baseInterval * 2 : baseInterval; // Slower escalation in background
      };
      
      escalationIntervalRef.current = setInterval(() => {
        setAlertLevel(prev => {
          const newLevel = prev < 5 ? prev + 1 : prev;
          console.log(`Alert escalated to level ${newLevel}`);
          
          // Dispatch event for level change
          window.dispatchEvent(new CustomEvent('alertLevelChanged', { 
            detail: { level: newLevel, timestamp: new Date().toISOString() } 
          }));
          
          return newLevel;
        });
        
        // Play sound
        playAlertSound();
        
        // Adjust interval if needed
        const currentInterval = getEscalationInterval();
        if (escalationIntervalRef.current) {
          clearInterval(escalationIntervalRef.current);
          escalationIntervalRef.current = setInterval(() => {
            setAlertLevel(prev => {
              const newLevel = prev < 5 ? prev + 1 : prev;
              console.log(`Alert escalated to level ${newLevel}`);
              return newLevel;
            });
            playAlertSound();
          }, currentInterval);
        }
      }, getEscalationInterval());
      
      // Set up visibility change listener
      const handleVisibilityChange = () => {
        const newInterval = getEscalationInterval();
        console.log(`App visibility changed. Setting escalation interval to ${newInterval}ms`);
        
        if (escalationIntervalRef.current) {
          clearInterval(escalationIntervalRef.current);
          escalationIntervalRef.current = setInterval(() => {
            setAlertLevel(prev => {
              const newLevel = prev < 5 ? prev + 1 : prev;
              console.log(`Alert escalated to level ${newLevel}`);
              return newLevel;
            });
            playAlertSound();
          }, newInterval);
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (escalationIntervalRef.current) {
          clearInterval(escalationIntervalRef.current);
        }
      };
      
    } else if (alertActive) {
      // Deactivate alert if conditions are no longer met or passenger mode is enabled
      setAlertActive(false);
      setAlertLevel(0);
      
      const endTime = Date.now();
      if (alertStartTime) {
        const duration = (endTime - alertStartTime) / 1000; // in seconds
        
        console.log(`Alert deactivated after ${duration.toFixed(1)} seconds`);
        
        // Only log metrics for real alerts (not passenger mode toggle)
        if (!isPassenger || isDriving === false || phoneHandling === false) {
          // Log alert end to metrics
          logAlertMetrics(alertVariant, duration, alertLevel);
          
          // Log alert end to database
          fetch('/api/alert-metrics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              alertLevel,
              alertVariant,
              started_at: new Date(alertStartTime).toISOString(),
              ended_at: new Date(endTime).toISOString()
            }),
          }).catch(err => console.error('Error logging alert end:', err));
          
          // Trigger event
          window.dispatchEvent(new CustomEvent('alertDeactivated', { 
            detail: { duration, timestamp: new Date().toISOString() } 
          }));
        }
      }
    }
    
    return () => {
      if (escalationIntervalRef.current) {
        clearInterval(escalationIntervalRef.current);
      }
    };
  }, [isDriving, phoneHandling, isPassenger, alertActive, alertVariant, playAlertSound, logAlertMetrics, alertStartTime, alertLevel]);
  
  return { 
    alertActive, 
    alertLevel, 
    alertVariant 
  };
}; 