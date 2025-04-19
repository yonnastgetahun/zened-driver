'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Clock, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getMetricsManager, MetricsManager } from '@/lib/metrics/MetricsManager';
import { motion } from 'framer-motion';

/**
 * DailySummary component
 * Shows a summary of today's driving metrics with comparison to yesterday
 */
const DailySummary = () => {
  const [mounted, setMounted] = useState(false);
  const [protectedTime, setProtectedTime] = useState(0);
  const [handlingCount, setHandlingCount] = useState(0);
  const [comparison, setComparison] = useState<{
    isImproved: boolean;
    handlingRatioDiff: number;
  } | null>(null);
  
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      const metricsManager = getMetricsManager();
      
      // Get today's metrics
      const todayMetrics = metricsManager.getTodayMetrics();
      setProtectedTime(todayMetrics.totalDrivingTime - todayMetrics.totalHandlingTime);
      
      // Approximate handling count from alert count
      setHandlingCount(todayMetrics.alertCount);
      
      // Get comparison with yesterday
      const comp = metricsManager.getTodayVsYesterdayComparison();
      if (comp) {
        setComparison({
          isImproved: comp.isImproved,
          handlingRatioDiff: Math.abs(comp.handlingRatioDiff) * 100 // convert to percentage
        });
      }
    }
  }, []);
  
  if (!mounted) return null;
  
  const formatTime = (seconds: number) => {
    if (seconds === 0) return '0m';
    return MetricsManager.formatDuration(seconds);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-5">
        <h2 className="text-lg font-semibold mb-3">Today's Driving Summary</h2>
        
        <div className="space-y-4">
          {/* Protected Driving Time */}
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Protected Driving Time</p>
              <p className="font-medium">
                {protectedTime > 0 
                  ? formatTime(protectedTime)
                  : 'No driving recorded yet'}
              </p>
            </div>
          </div>
          
          {/* Phone Handling */}
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-full mr-3">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone Handling</p>
              <p className="font-medium">
                {handlingCount === 0 
                  ? 'No handling detected' 
                  : `${handlingCount} time${handlingCount === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
          
          {/* Comparison with Yesterday */}
          {comparison ? (
            <div className="flex items-center">
              <div className={`p-2 rounded-full mr-3 ${
                comparison.isImproved ? 'bg-green-100' : 'bg-amber-100'
              }`}>
                {comparison.isImproved 
                  ? <TrendingUp className="h-5 w-5 text-green-600" /> 
                  : <TrendingDown className="h-5 w-5 text-amber-600" />}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compared to Yesterday</p>
                <p className={`font-medium ${
                  comparison.isImproved ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {comparison.isImproved 
                    ? `${comparison.handlingRatioDiff.toFixed(1)}% less distracted` 
                    : `${comparison.handlingRatioDiff.toFixed(1)}% more distracted`}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="p-2 bg-muted rounded-full mr-3">
                <Minus className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Compared to Yesterday</p>
                <p className="font-medium text-muted-foreground">No comparison available</p>
              </div>
            </div>
          )}
          
          {/* Streak Information */}
          {(() => {
            const metricsManager = getMetricsManager();
            const streaks = metricsManager.getStreakMetrics();
            
            if (streaks.currentStreak > 0) {
              return (
                <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-md">
                  <div className="flex items-center">
                    <div className="p-1 bg-green-100 rounded-full mr-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-green-800">
                      {streaks.currentStreak} day streak of safer driving!
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </Card>
    </motion.div>
  );
};

export default DailySummary; 