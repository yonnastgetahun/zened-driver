/**
 * MetricsTest.ts
 * Manual testing utility to simulate driving activity and verify metrics
 * 
 * To use, run in browser console:
 * import { runDrivingTest } from './lib/test/MetricsTest';
 * runDrivingTest();
 */

import { getMetricsManager, MetricsManager } from '@/lib/metrics/MetricsManager';

/**
 * Simulate a driving session with phone handling
 */
export function simulateDrivingSession(
  drivingDuration: number = 300, // 5 minutes in seconds
  handlingEvents: number = 3,
  isPassenger: boolean = false
): void {
  console.log('🚗 Starting simulated driving session...');
  console.log(`- Duration: ${drivingDuration}s`);
  console.log(`- Handling events: ${handlingEvents}`);
  console.log(`- Passenger mode: ${isPassenger}`);

  // Dispatch driving started event
  window.dispatchEvent(new CustomEvent('drivingStarted', { detail: { speed: 15 } }));
  
  // If passenger mode, enable it
  if (isPassenger) {
    window.dispatchEvent(new CustomEvent('passengerModeEnabled'));
  }
  
  // Calculate timing for handling events
  const handlingInterval = Math.floor(drivingDuration / (handlingEvents + 1));
  let currentTime = 0;
  
  // Schedule handling events
  for (let i = 0; i < handlingEvents; i++) {
    currentTime += handlingInterval;
    
    // Schedule phone pickup
    setTimeout(() => {
      console.log(`📱 Simulating phone pickup at ${currentTime}s`);
      window.dispatchEvent(new CustomEvent('phonePickedUp', { 
        detail: { sensorData: { x: 1, y: 1, z: 1 } } 
      }));
      
      // If not in passenger mode, an alert should be triggered
      if (!isPassenger) {
        console.log('⚠️ Alert should be triggered');
      }
      
      // Put down the phone after 5-10 seconds
      const handlingDuration = Math.floor(Math.random() * 5) + 5;
      setTimeout(() => {
        console.log(`📱 Simulating phone put down after ${handlingDuration}s`);
        window.dispatchEvent(new CustomEvent('phonePutDown'));
      }, handlingDuration * 1000);
      
    }, currentTime * 1000);
  }
  
  // End the driving session
  setTimeout(() => {
    console.log('🚗 Ending simulated driving session');
    window.dispatchEvent(new CustomEvent('drivingStopped'));
    
    // Display metrics after a short delay to ensure everything is updated
    setTimeout(() => {
      displayMetrics();
    }, 1000);
  }, drivingDuration * 1000);
}

/**
 * Display current metrics in the console
 */
export function displayMetrics(): void {
  const metricsManager = getMetricsManager();
  
  console.group('📊 DriveSafe Metrics');
  
  // Today's metrics
  const today = metricsManager.getTodayMetrics();
  console.group('Today\'s Summary');
  console.log(`Total driving time: ${MetricsManager.formatDuration(today.totalDrivingTime)}`);
  console.log(`Phone handling time: ${MetricsManager.formatDuration(today.totalHandlingTime)}`);
  console.log(`Protected driving time: ${MetricsManager.formatDuration(today.totalDrivingTime - today.totalHandlingTime)}`);
  console.log(`Alert count: ${today.alertCount}`);
  console.log(`Average response time: ${today.averageResponseTime.toFixed(2)}s`);
  console.log(`Clean drives: ${today.cleanDrives}/${today.sessionCount}`);
  console.groupEnd();
  
  // Streak info
  const streaks = metricsManager.getStreakMetrics();
  console.group('Streak Information');
  console.log(`Current streak: ${streaks.currentStreak} days`);
  console.log(`Best streak: ${streaks.bestStreak} days`);
  console.log(`Milestones reached: ${streaks.milestones.reached.length}`);
  if (streaks.milestones.next) {
    console.log(`Next milestone: ${streaks.milestones.next.description}`);
  }
  console.groupEnd();
  
  // Weekly info
  const week = metricsManager.getCurrentWeekMetrics();
  if (week) {
    console.group('Weekly Summary');
    console.log(`Week: ${week.weekId}`);
    console.log(`Total driving time: ${MetricsManager.formatDuration(week.totalDrivingTime)}`);
    console.log(`Distraction percentage: ${metricsManager.getDistractionPercentage('week').toFixed(2)}%`);
    if (week.improvementPercentage !== null) {
      console.log(`Weekly improvement: ${week.improvementPercentage.toFixed(2)}%`);
    }
    console.log(`Best day: ${week.bestDay || 'N/A'}`);
    console.groupEnd();
  }
  
  console.groupEnd();
}

/**
 * Run a complete driving test with multiple scenarios
 */
export async function runDrivingTest(): Promise<void> {
  console.log('🧪 Starting comprehensive metrics test');
  
  // Initialize metrics manager 
  const metricsManager = getMetricsManager();
  
  // Display initial state
  console.log('Initial metrics state:');
  displayMetrics();
  
  // First session: normal driving with some handling
  console.log('\n🧪 Test 1: Normal driving with phone handling');
  await new Promise<void>(resolve => {
    simulateDrivingSession(30, 2, false);
    setTimeout(() => resolve(), 35 * 1000);
  });
  
  // Second session: driving in passenger mode
  console.log('\n🧪 Test 2: Driving as passenger');
  await new Promise<void>(resolve => {
    simulateDrivingSession(20, 2, true);
    setTimeout(() => resolve(), 25 * 1000);
  });
  
  // Third session: perfect driving (no handling)
  console.log('\n🧪 Test 3: Perfect driving (no handling)');
  await new Promise<void>(resolve => {
    simulateDrivingSession(15, 0, false);
    setTimeout(() => resolve(), 20 * 1000);
  });
  
  // Final metrics
  console.log('\n📊 Final metrics after all tests:');
  displayMetrics();
  
  console.log('🎉 Test complete! Check the metrics displayed above.');
}

// Helper function to manually reset metrics (for testing purposes)
export function resetMetrics(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('driveSafeMetrics');
    console.log('✅ Metrics reset. Refresh the page to see changes.');
  }
} 