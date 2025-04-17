'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';

interface PhoneHandlingDebugProps {
  sensorAvailable: boolean;
  debugData: {x: number, y: number, z: number} | null;
}

/**
 * Debug panel for phone handling detection
 * Only shown in development mode and when the user enables it
 */
const PhoneHandlingDebug = ({ sensorAvailable, debugData }: PhoneHandlingDebugProps) => {
  const [showDebug, setShowDebug] = useState(false);
  
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="mt-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowDebug(!showDebug)}
        className="mb-2"
      >
        <Bug className="h-4 w-4 mr-2" />
        {showDebug ? 'Hide' : 'Show'} Debug Panel
      </Button>
      
      {showDebug && (
        <Card className="p-4 bg-slate-50">
          <h3 className="text-sm font-semibold mb-2">Phone Handling Debug</h3>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-medium">Sensor Status:</span> 
              <span className={sensorAvailable ? 'text-green-600' : 'text-red-600'}>
                {sensorAvailable ? 'Available' : 'Not Available'}
              </span>
            </div>
            
            {sensorAvailable && debugData && (
              <>
                <div>
                  <span className="font-medium">X-axis:</span> {debugData.x.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Y-axis:</span> {debugData.y.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Z-axis:</span> {debugData.z.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Magnitude:</span> {Math.sqrt(
                    debugData.x * debugData.x + 
                    debugData.y * debugData.y + 
                    debugData.z * debugData.z
                  ).toFixed(2)}
                </div>
              </>
            )}
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Threshold for detection: 1.5</p>
              <p>If any axis exceeds threshold, phone handling is detected</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PhoneHandlingDebug; 