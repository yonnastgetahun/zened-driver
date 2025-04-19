'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Hook to detect phone handling using device motion sensors
 * Optimized for battery efficiency with dynamic sampling rates
 */
export function usePhoneHandling() {
  const [phoneHandling, setPhoneHandling] = useState(false);
  const [sensorAvailable, setSensorAvailable] = useState(false);
  const [samplingRate, setSamplingRate] = useState(1000); // Start with 1s sampling rate
  const [debugData, setDebugData] = useState<{x: number, y: number, z: number} | null>(null);
  const debugIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const motionSamplerRef = useRef<NodeJS.Timeout | null>(null);
  const lastMotionRef = useRef<{x: number, y: number, z: number} | null>(null);
  
  // Enable debug mode for development (logs motion data to console)
  const DEBUG_MODE = process.env.NODE_ENV === 'development';
  
  useEffect(() => {
    // Check if Device Motion API is available
    const hasDeviceMotion = 'DeviceMotionEvent' in window;
    setSensorAvailable(hasDeviceMotion);
    
    if (!hasDeviceMotion) {
      console.warn('Device Motion API not available. Using simulation mode.');
      return;
    }
    
    let isListening = true;
    
    // Handler for motion events
    const handleMotion = (event: DeviceMotionEvent) => {
      const { acceleration } = event;
      if (!acceleration || acceleration.x === null) return;
      
      // Use default value of 0 for any null values
      const x = acceleration.x ?? 0;
      const y = acceleration.y ?? 0;
      const z = acceleration.z ?? 0;
      
      lastMotionRef.current = { x, y, z };
    };
    
    // Function to process motion data at the current sampling rate
    const processMotion = () => {
      if (!isListening || !lastMotionRef.current) return;
      
      const { x, y, z } = lastMotionRef.current;
      
      // Update debug data
      if (DEBUG_MODE) {
        setDebugData({ x, y, z });
      }
      
      // Define a threshold to detect handling
      const threshold = 1.5;
      const isHandling = Math.abs(x) > threshold || 
                       Math.abs(y) > threshold || 
                       Math.abs(z) > threshold;
      
      if (isHandling !== phoneHandling) {
        setPhoneHandling(isHandling);
        
        // Adjust sampling rate based on handling state
        if (isHandling) {
          // More frequent sampling when phone is being handled
          setSamplingRate(500); // 0.5s when handling
          console.log('Phone handling detected - increasing sampling rate');
        } else {
          // Less frequent sampling when phone is idle to save battery
          setSamplingRate(1000); // 1s when idle
          console.log('Phone handling stopped - decreasing sampling rate');
        }
        
        console.log(`Phone handling ${isHandling ? 'detected' : 'stopped'}`);
      }
    };
    
    // Add event listener for device motion
    window.addEventListener('devicemotion', handleMotion);
    
    // Start the motion sampler with the current rate
    motionSamplerRef.current = setInterval(processMotion, samplingRate);
    
    // Set up debug logging interval
    if (DEBUG_MODE && hasDeviceMotion) {
      debugIntervalRef.current = setInterval(() => {
        if (debugData) {
          console.log('Motion data:', debugData);
          console.log(`Current sampling rate: ${samplingRate}ms`);
        }
      }, 5000); // Log every 5 seconds
    }
    
    // Listen for app state changes (foreground/background)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // App in foreground - normal sampling
        isListening = true;
        setSamplingRate(phoneHandling ? 500 : 1000);
      } else {
        // App in background - reduce sampling frequency to save battery
        isListening = phoneHandling; // Only listen in background if currently handling
        setSamplingRate(2000); // 2s when in background
      }
    };
    
    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Effect for sampling rate changes
    const rateChangeHandler = () => {
      if (motionSamplerRef.current) {
        clearInterval(motionSamplerRef.current);
      }
      motionSamplerRef.current = setInterval(processMotion, samplingRate);
      console.log(`Sampling rate updated to ${samplingRate}ms`);
    };
    
    // Apply rate changes when samplingRate changes
    const rateChangeEffect = setTimeout(rateChangeHandler, 100);
    
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (debugIntervalRef.current) {
        clearInterval(debugIntervalRef.current);
      }
      
      if (motionSamplerRef.current) {
        clearInterval(motionSamplerRef.current);
      }
      
      clearTimeout(rateChangeEffect);
    };
  }, [phoneHandling, debugData, DEBUG_MODE, samplingRate]);
  
  // Toggle phone handling state for simulation and testing
  const togglePhoneHandling = () => {
    if (sensorAvailable) {
      console.warn('Using manual toggle while sensors are available');
    }
    const newState = !phoneHandling;
    setPhoneHandling(newState);
    console.log(`Phone handling ${newState ? 'detected' : 'stopped'} (manual)`);
    
    // Adjust sampling rate based on new state
    setSamplingRate(newState ? 500 : 1000);
  };
  
  return {
    phoneHandling,
    togglePhoneHandling,
    sensorAvailable,
    debugData
  };
} 