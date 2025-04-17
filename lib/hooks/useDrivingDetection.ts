'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Hook to detect driving using geolocation
 * Optimized for battery efficiency with dynamic polling intervals
 */
export function useDrivingDetection() {
  const [isDriving, setIsDriving] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [pollingInterval, setPollingInterval] = useState(15000); // Start with 15s interval
  const watchIdRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Check if geolocation is available in the browser
    if (!navigator || !navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }
    
    let lastSpeedUpdate = Date.now();
    
    // Function to start or restart position watching with current interval
    const startWatching = () => {
      // Clear existing watch if any
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      
      // Set up position watching with current interval settings
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const speed = position.coords.speed || 0;
          const now = Date.now();
          
          // Update state values
          setCurrentSpeed(speed);
          const wasDriving = isDriving;
          const nowDriving = speed > 4.47; // 4.47 m/s is approximately 10 mph
          setIsDriving(nowDriving);
          
          // Adjust polling interval based on driving state
          // More frequent updates when driving, less frequent when idle
          if (nowDriving && !wasDriving) {
            // Just started driving - increase polling frequency
            setPollingInterval(5000); // 5 seconds when driving
            console.log('Driving started - increasing polling frequency');
          } else if (!nowDriving && wasDriving) {
            // Just stopped driving - decrease polling frequency to save battery
            setPollingInterval(15000); // 15 seconds when not driving
            console.log('Driving stopped - decreasing polling frequency');
          }
          
          // Debug logs
          console.log(`Current Speed: ${speed} m/s (${(speed * 2.237).toFixed(1)} mph)`);
          console.log(`Driving Status: ${nowDriving ? 'Driving' : 'Idle'}`);
          console.log(`Time since last update: ${now - lastSpeedUpdate}ms`);
          console.log(`Current polling interval: ${pollingInterval}ms`);
          
          lastSpeedUpdate = now;
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        { 
          enableHighAccuracy: isDriving, // High accuracy only when driving
          timeout: pollingInterval,
          maximumAge: pollingInterval / 2
        }
      );
    };
    
    // Start initial watching
    startWatching();
    
    // Effect to restart watching when polling interval changes
    const intervalChangeHandler = () => {
      console.log(`Polling interval updated to ${pollingInterval}ms`);
      startWatching();
    };
    
    // Listen for app state changes (foreground/background)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // App in foreground - normal polling
        setPollingInterval(isDriving ? 5000 : 15000);
      } else {
        // App in background - reduce polling frequency to save battery
        setPollingInterval(isDriving ? 10000 : 30000);
      }
    };
    
    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Restart watching when polling interval changes
    const intervalChangeEffect = setTimeout(intervalChangeHandler, 100);
    
    // Clean up the watch when component unmounts
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(intervalChangeEffect);
    };
  }, [isDriving, pollingInterval]);

  return { isDriving, currentSpeed };
} 