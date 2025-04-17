'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Car, Phone, AlertTriangle, Activity, BarChart2, User, Zap, Wind } from 'lucide-react';
import AlertOverlay from '@/components/app/AlertOverlay';
import PhoneHandlingDebug from '@/components/app/PhoneHandlingDebug';
import DailySummary from '@/components/app/DailySummary';
import Link from 'next/link';
import { useDriveSafe } from '@/components/app/DriveSafeContext';
import Image from 'next/image';
import { motion } from 'framer-motion';
import config from '@/config';

/**
 * Main Zened Driver Dashboard Component
 * Focused on mindfulness and distraction-free driving
 * Uses the DriveSafeContext to get integrated driving and phone handling state
 */
const DriveSafeDashboard = () => {
  const { 
    isDriving, 
    phoneHandling, 
    sensorAvailable, 
    alertActive, 
    alertLevel, 
    alertVariant,
    setPhoneHandling,
    isPassenger,
    setIsPassenger
  } = useDriveSafe();
  
  // For testing - if we don't have the actual modules available
  const currentSpeed = isDriving ? 15 : 0;
  const debugData = { x: 0, y: 0, z: 0 };
  
  const [mounted, setMounted] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);

  // Set mounted state for animations
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Toggle phone handling for simulation/testing
  const togglePhoneHandling = () => {
    setPhoneHandling(!phoneHandling);
    console.log(`Phone handling toggled to: ${!phoneHandling}`);
  };
  
  // Toggle passenger mode
  const togglePassengerMode = () => {
    setIsPassenger(!isPassenger);
    console.log(`Passenger mode toggled to: ${!isPassenger}`);
  };

  // Start a breathing exercise
  const toggleBreathingExercise = () => {
    setBreathingActive(!breathingActive);
  };
  
  // Card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Breathing circle animation variants
  const breathingCircle = {
    inhale: {
      scale: 1.5,
      transition: { duration: 4, ease: "easeInOut" }
    },
    exhale: {
      scale: 1,
      transition: { duration: 4, ease: "easeInOut" }
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 transition-all duration-300">
      {/* Alert Overlay - rendered conditionally based on alert state */}
      <AlertOverlay 
        alertActive={alertActive} 
        alertLevel={alertLevel} 
        alertVariant={alertVariant} 
      />
      
      <div className="flex flex-col gap-8">
        {/* Header with Analytics Link */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <h1 className="text-2xl font-bold text-primary">{config.metadata.title}</h1>
          <Link 
            href="/analytics" 
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            <span>View Analytics</span>
          </Link>
        </motion.div>

        {/* Mindfulness Breathing Exercise */}
        {!isDriving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-background border border-secondary/30 rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-medium text-primary mb-4">Pre-Drive Mindfulness</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-2">
                <p className="text-text">Take a moment to center yourself before driving.</p>
                <button
                  onClick={toggleBreathingExercise}
                  className="px-4 py-2 bg-secondary text-primary rounded-md hover:bg-secondary/90 transition-colors"
                >
                  {breathingActive ? "Stop Exercise" : "Start Breathing Exercise"}
                </button>
              </div>
              
              {breathingActive && (
                <div className="flex-1 flex justify-center items-center">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <motion.div
                      animate={breathingActive ? "inhale" : "exhale"}
                      variants={breathingCircle}
                      initial={false}
                      className="absolute w-24 h-24 rounded-full bg-secondary/30"
                      style={{ animationIterationCount: "infinite" }}
                    />
                    <div className="z-10 text-center">
                      <span className="text-sm text-primary font-medium">Breathe</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Driving Status Card */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className={`p-4 transition-all duration-300 ease-in-out ${isDriving ? 'border-secondary shadow-md' : 'border-muted'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full transition-colors duration-300 ${isDriving ? 'bg-secondary/20 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                  <Car size={24} />
                </div>
                <div>
                  <h3 className="font-medium">Driving Status</h3>
                  <p className={`text-sm transition-colors duration-300 ${isDriving ? 'text-secondary' : 'text-muted-foreground'}`}>
                    {isDriving ? (isPassenger ? 'Passenger Mode' : 'Currently Driving') : 'Not Driving'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className={`px-4 py-2 rounded-md w-full text-center font-medium transition-colors duration-300 ${
                  isDriving 
                    ? 'bg-secondary/20 text-secondary' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  Auto-Detected via GPS
                </div>
                
                {/* Passenger toggle only shown when driving is detected */}
                {isDriving && (
                  <button
                    onClick={togglePassengerMode}
                    className={`mt-2 px-4 py-2 rounded-md w-full font-medium flex items-center justify-center gap-2 transition-colors duration-300 ${
                      isPassenger 
                        ? 'bg-secondary/30 text-primary hover:bg-secondary/40' 
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <User size={16} />
                    <span>{isPassenger ? 'Exit Passenger Mode' : 'I\'m a Passenger'}</span>
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
          
          {/* Focus Level Card */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className="p-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Zap size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Focus Level</h3>
                  <p className={`text-sm transition-colors duration-300 ${phoneHandling ? 'text-amber-500' : 'text-secondary'}`}>
                    {phoneHandling ? 'Distracted' : (isDriving ? 'Focused' : 'Ready')}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-in-out ${
                      phoneHandling 
                        ? 'bg-amber-500 w-1/4' 
                        : isDriving 
                          ? 'bg-secondary w-full' 
                          : 'bg-primary w-3/4'
                    }`}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {phoneHandling ? 'Potential distraction detected' : (isDriving ? 'Great focus maintained' : 'Ready to drive')}
                </p>
              </div>
            </Card>
          </motion.div>
          
          {/* Phone Handling Card */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className={`p-4 transition-all duration-300 ease-in-out ${phoneHandling ? 'border-amber-500 shadow-md' : 'border-muted'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full transition-colors duration-300 ${phoneHandling ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground'}`}>
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-medium">Phone Handling</h3>
                  <p className={`text-sm transition-colors duration-300 ${phoneHandling ? 'text-amber-700' : 'text-muted-foreground'}`}>
                    {phoneHandling ? 'Phone in Use' : 'Phone Not in Use'}
                  </p>
                  {sensorAvailable && (
                    <span className="text-xs text-green-600">Using motion sensors</span>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={togglePhoneHandling}
                  className={`px-4 py-2 rounded-md w-full font-medium transition-all duration-300 ${
                    phoneHandling 
                      ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' 
                      : 'bg-accent text-primary hover:bg-accent/90'
                  }`}
                >
                  {phoneHandling ? 'Put Phone Down' : sensorAvailable ? 'Simulate Pickup' : 'Pick Up Phone'}
                </button>
              </div>
              
              {/* Debug Panel - Only shown in development mode */}
              <PhoneHandlingDebug 
                sensorAvailable={sensorAvailable} 
                debugData={debugData} 
              />
            </Card>
          </motion.div>
          
          {/* Mindfulness Status Card */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className="p-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Wind size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Mindfulness</h3>
                  <p className="text-sm text-secondary">
                    {alertActive ? 'Take a breath' : 'Calm & Present'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={toggleBreathingExercise}
                  className="px-4 py-2 rounded-md w-full font-medium bg-secondary/20 text-primary hover:bg-secondary/30 transition-colors"
                >
                  {breathingActive ? "Stop Breathing" : "Start Breathing"}
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
        
        {/* Daily Summary - Replacing the "Drive Safe" banner */}
        <DailySummary />
      </div>
    </div>
  );
};

export default DriveSafeDashboard; 