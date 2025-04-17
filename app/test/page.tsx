'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DailySummary from '@/components/app/DailySummary';
import { runDrivingTest, resetMetrics, displayMetrics } from '@/lib/test/MetricsTest';

/**
 * Test page for metrics implementation
 */
export default function TestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Set up console.log override when component mounts
  useEffect(() => {
    const originalLog = console.log;
    
    console.log = function(...args: any[]) {
      originalLog.apply(console, args);
      setLogs(prev => [...prev, args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')]);
    };
    
    // Restore original console.log when component unmounts
    return () => {
      console.log = originalLog;
    };
  }, []);
  
  const handleRunTest = async () => {
    setIsRunning(true);
    setLogs([]);
    try {
      await runDrivingTest();
    } catch (error) {
      console.error('Test error:', error);
    }
    setIsRunning(false);
  };
  
  const handleResetMetrics = () => {
    resetMetrics();
    setLogs([]);
    setTimeout(() => {
      setLogs(['✅ Metrics reset. Refresh the page to see changes.']);
    }, 100);
  };
  
  const handleDisplayMetrics = () => {
    setLogs([]);
    setTimeout(() => {
      displayMetrics();
    }, 100);
  };
  
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">DriveSafe Metrics Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleRunTest} 
                disabled={isRunning}
                className="w-full"
              >
                {isRunning ? 'Test Running...' : 'Run Full Test Sequence'}
              </Button>
              
              <Button 
                onClick={handleDisplayMetrics}
                variant="outline"
                className="w-full"
              >
                Display Current Metrics
              </Button>
              
              <Button 
                onClick={handleResetMetrics}
                variant="destructive"
                className="w-full"
              >
                Reset All Metrics
              </Button>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                The full test will simulate three driving sessions:
              </p>
              <ol className="list-decimal pl-5 text-sm space-y-1 mt-2 text-muted-foreground">
                <li>Normal driving with phone handling</li>
                <li>Driving as a passenger (with phone handling)</li>
                <li>Perfect driving (no phone handling)</li>
              </ol>
              <p className="text-sm mt-4 text-muted-foreground">
                The test will take approximately 2 minutes to complete.
              </p>
            </div>
          </Card>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Daily Metrics Summary</h2>
            <DailySummary />
          </div>
        </div>
        
        <div>
          <Card className="p-6 h-full overflow-hidden flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Test Logs</h2>
            <div className="bg-muted p-4 rounded-md overflow-y-auto flex-grow font-mono text-xs h-[500px]">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">No logs yet. Run a test to see output here.</p>
              ) : (
                <pre className="whitespace-pre-wrap">
                  {logs.join('\n')}
                </pre>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 