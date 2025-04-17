'use client';

import { useState, useEffect } from 'react';
import { AlertMetrics } from '@/types/drivesafe.types';

/**
 * Component to display driving safety metrics
 * Shows data visualization of alert history
 */
const AlertMetricsView = () => {
  const [metrics, setMetrics] = useState<AlertMetrics | null>(null);
  
  // Load metrics from localStorage
  useEffect(() => {
    try {
      const storedMetrics = localStorage.getItem('alertMetrics');
      if (storedMetrics) {
        setMetrics(JSON.parse(storedMetrics));
        console.log('Loaded alert metrics from localStorage:', storedMetrics);
      }
    } catch (error) {
      console.error('Error loading metrics from localStorage:', error);
    }
  }, []);
  
  if (!metrics) {
    return (
      <div className="p-6 bg-background border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Your Safe Driving Status</h2>
        <p className="text-muted-foreground">No alerts recorded yet. Your driving safety statistics will appear here after your first drive.</p>
      </div>
    );
  }
  
  // Calculate combined metrics for user display (hiding the A/B testing)
  const totalAlerts = metrics.variantA.count + metrics.variantB.count;
  const avgDuration = totalAlerts > 0 ? 
    ((metrics.variantA.avgDuration * metrics.variantA.count) + 
     (metrics.variantB.avgDuration * metrics.variantB.count)) / totalAlerts : 0;
  
  return (
    <div className="p-6 bg-background border rounded-lg">
      <h2 className="text-xl font-semibold mb-6">Your Driving Safety Summary</h2>
      
      <div className="bg-muted/30 p-4 rounded-lg border mb-6">
        <h3 className="font-medium text-lg mb-3">Alert History</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Alerts:</span>
            <span className="font-medium">{totalAlerts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Average Response Time:</span>
            <span className="font-medium">{avgDuration.toFixed(2)}s</span>
          </div>
        </div>
      </div>
      
      {totalAlerts > 0 ? (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Response Time</h4>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <span className="text-xs text-muted-foreground">How quickly you respond to alerts</span>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {avgDuration.toFixed(2)}s
                </span>
              </div>
              <div className="h-4 bg-muted rounded overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, (avgDuration / 15) * 100)}%` }}
                  className="h-full bg-primary"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Faster</span>
                <span>Slower</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-accent/50 rounded-lg border">
            <h3 className="font-medium mb-2">Driving Safety Insights</h3>
            <p className="text-sm">
              {avgDuration < 5 
                ? "Great job! You're responding quickly to alerts, which means you're maintaining safe driving habits."
                : avgDuration < 10
                  ? "You're responding to alerts within a reasonable time. Try to put your phone down even faster for optimal safety."
                  : "Your response time is longer than recommended. For your safety, try to put your phone down immediately when alerted."
              }
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AlertMetricsView; 