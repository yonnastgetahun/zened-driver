'use client';

import { createContext, useContext, ReactNode, useEffect, useState, useRef } from 'react';
import { useDrivingDetection } from '@/lib/hooks/useDrivingDetection';
import { usePhoneHandling } from '@/lib/hooks/usePhoneHandling';
import { useAlertSystem } from '@/lib/hooks/useAlertSystem';
import { DriveSafeState } from '@/types/drivesafe.types';
import { getMetricsManager } from '@/lib/metrics/MetricsManager';

// Create the context with default values
const DriveSafeContext = createContext<DriveSafeState>({
  // Alert system state
  alertActive: false,
  alertLevel: 0,
  alertVariant: 'A',
  
  // Driving & phone handling state
  isDriving: false,
  phoneHandling: false,
  sensorAvailable: false,
  isPassenger: false,
  
  // Alert actions
  setAlertActive: () => {},
  updateAlertLevel: () => {},
  setAlertVariant: () => {},
  
  // Phone handling actions
  setPhoneHandling: () => {},
  setIsPassenger: () => {},
});

interface DriveSafeProviderProps {
  children: ReactNode;
}

/**
 * DriveSafeProvider integrates driving detection and phone handling
 * Ensures that the alert system is triggered only when both conditions are met
 */
export const DriveSafeProvider = ({ children }: DriveSafeProviderProps) => {
  // Initialize the hooks
  const { isDriving, currentSpeed } = useDrivingDetection();
  const { phoneHandling, togglePhoneHandling, sensorAvailable, debugData } = usePhoneHandling();
  const [isPassenger, setIsPassenger] = useState(false);
  
  // For metrics tracking
  const currentSessionIdRef = useRef<string | null>(null);
  const phoneHandlingStartTimeRef = useRef<number | null>(null);
  const totalHandlingTimeRef = useRef<number>(0);
  const alertCountRef = useRef<number>(0);
  const alertResponseTimesRef = useRef<number[]>([]);
  
  // Reset passenger mode when driving stops
  useEffect(() => {
    if (!isDriving && isPassenger) {
      setIsPassenger(false);
      console.log('Driving stopped - resetting passenger mode');
    }
  }, [isDriving, isPassenger]);
  
  const { alertActive, alertLevel, alertVariant } = useAlertSystem({ 
    isDriving, 
    phoneHandling,
    isPassenger
  });
  
  // Track driving sessions for metrics
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    const metricsManager = getMetricsManager();
    
    if (isDriving) {
      // Start a new driving session if one isn't already in progress
      if (!currentSessionIdRef.current) {
        currentSessionIdRef.current = metricsManager.startDrivingSession();
        console.log(`Started driving session: ${currentSessionIdRef.current}`);
        
        // Reset counters for the new session
        totalHandlingTimeRef.current = 0;
        alertCountRef.current = 0;
        alertResponseTimesRef.current = [];
      }
    } else {
      // End the current driving session if there is one
      if (currentSessionIdRef.current) {
        const avgResponseTime = alertResponseTimesRef.current.length > 0 
          ? alertResponseTimesRef.current.reduce((a, b) => a + b, 0) / alertResponseTimesRef.current.length 
          : 0;
        
        metricsManager.endDrivingSession(
          currentSessionIdRef.current,
          totalHandlingTimeRef.current,
          alertCountRef.current,
          avgResponseTime
        );
        
        console.log(`Ended driving session: ${currentSessionIdRef.current}`);
        console.log(`- Total handling time: ${totalHandlingTimeRef.current}s`);
        console.log(`- Total alerts: ${alertCountRef.current}`);
        console.log(`- Avg response time: ${avgResponseTime}s`);
        
        // Reset the session
        currentSessionIdRef.current = null;
        totalHandlingTimeRef.current = 0;
        alertCountRef.current = 0;
        alertResponseTimesRef.current = [];
      }
    }
    
    return () => {
      // Clean up if component unmounts during an active session
      if (currentSessionIdRef.current) {
        const avgResponseTime = alertResponseTimesRef.current.length > 0 
          ? alertResponseTimesRef.current.reduce((a, b) => a + b, 0) / alertResponseTimesRef.current.length 
          : 0;
        
        metricsManager.endDrivingSession(
          currentSessionIdRef.current,
          totalHandlingTimeRef.current,
          alertCountRef.current,
          avgResponseTime
        );
      }
    };
  }, [isDriving]);
  
  // Track phone handling time
  useEffect(() => {
    if (isDriving) {
      if (phoneHandling) {
        // Start tracking handling time
        phoneHandlingStartTimeRef.current = Date.now();
      } else if (phoneHandlingStartTimeRef.current) {
        // Calculate and add to total handling time
        const handlingDuration = (Date.now() - phoneHandlingStartTimeRef.current) / 1000;
        totalHandlingTimeRef.current += handlingDuration;
        
        // Reset the start time
        phoneHandlingStartTimeRef.current = null;
      }
    }
  }, [isDriving, phoneHandling]);
  
  // Track alert metrics
  useEffect(() => {
    if (alertActive && isDriving && !isPassenger) {
      // Record when the alert was activated
      const alertStartTime = Date.now();
      
      // Function to record alert response time
      const recordAlertResponse = () => {
        if (phoneHandling === false) {
          // User put down the phone
          const responseTime = (Date.now() - alertStartTime) / 1000;
          alertResponseTimesRef.current.push(responseTime);
          
          // Record the alert in metrics
          if (typeof window !== 'undefined') {
            const metricsManager = getMetricsManager();
            metricsManager.recordAlert(responseTime);
          }
          
          // Remove event listener
          window.removeEventListener('phonePutDown', recordAlertResponse);
        }
      };
      
      // Listen for phone being put down
      window.addEventListener('phonePutDown', recordAlertResponse);
      
      // Increment alert counter
      alertCountRef.current += 1;
      
      return () => {
        window.removeEventListener('phonePutDown', recordAlertResponse);
      };
    }
  }, [alertActive, isDriving, isPassenger, phoneHandling]);
  
  // Log state changes for debugging
  useEffect(() => {
    console.log(`DriveSafe state updated: isDriving=${isDriving}, phoneHandling=${phoneHandling}, isPassenger=${isPassenger}, alertActive=${alertActive}`);
    
    // Publish events when driving state changes
    if (isDriving) {
      window.dispatchEvent(new CustomEvent('drivingStarted', { detail: { speed: currentSpeed } }));
    } else {
      window.dispatchEvent(new CustomEvent('drivingStopped'));
    }
    
    // Publish events when phone handling state changes
    if (phoneHandling) {
      window.dispatchEvent(new CustomEvent('phonePickedUp', { detail: { sensorData: debugData } }));
    } else {
      window.dispatchEvent(new CustomEvent('phonePutDown'));
    }
    
    // Publish events when passenger mode changes
    if (isPassenger) {
      window.dispatchEvent(new CustomEvent('passengerModeEnabled'));
    } else if (isDriving) {
      window.dispatchEvent(new CustomEvent('passengerModeDisabled'));
    }
  }, [isDriving, phoneHandling, alertActive, currentSpeed, debugData, isPassenger]);
  
  // Create the context value
  const contextValue: DriveSafeState = {
    // Alert system state
    alertActive,
    alertLevel,
    alertVariant,
    
    // Driving & phone handling state
    isDriving,
    phoneHandling,
    sensorAvailable,
    isPassenger,
    
    // Alert actions
    setAlertActive: (active: boolean) => {
      // This is managed by the useAlertSystem hook based on isDriving and phoneHandling
      console.log(`Manual override of alert active state: ${active}`);
      // In a real implementation, we might want to add support for manual overrides
    },
    updateAlertLevel: (level: number) => {
      // This is managed by the useAlertSystem hook
      console.log(`Manual override of alert level: ${level}`);
    },
    setAlertVariant: (variant: 'A' | 'B') => {
      // This is determined by the A/B testing system
      console.log(`Manual override of alert variant: ${variant}`);
    },
    
    // Phone handling actions
    setPhoneHandling: (handling: boolean) => {
      if (handling !== phoneHandling) {
        togglePhoneHandling();
      }
    },
    setIsPassenger: (passenger: boolean) => {
      setIsPassenger(passenger);
      console.log(`Passenger mode ${passenger ? 'enabled' : 'disabled'}`);
    },
  };
  
  return (
    <DriveSafeContext.Provider value={contextValue}>
      {children}
    </DriveSafeContext.Provider>
  );
};

/**
 * Hook to use the DriveSafe context
 * Provides access to driving detection and phone handling state
 */
export const useDriveSafe = () => useContext(DriveSafeContext); 