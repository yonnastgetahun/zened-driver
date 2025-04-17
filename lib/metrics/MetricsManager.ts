'use client';

export interface DrivingSession {
  id: string;
  startTime: number;
  endTime: number;
  totalDuration: number; // in seconds
  phoneHandlingDuration: number; // in seconds
  alertsTriggered: number;
  averageResponseTime: number; // in seconds
  cleanDrive: boolean; // no handling
}

export interface DailyMetrics {
  date: string; // YYYY-MM-DD
  totalDrivingTime: number; // in seconds
  totalHandlingTime: number; // in seconds
  alertCount: number;
  averageResponseTime: number;
  sessionCount: number;
  cleanDrives: number;
}

export interface WeeklyMetrics {
  weekId: string; // YYYY-WW
  startDate: string;
  endDate: string;
  totalDrivingTime: number;
  totalHandlingTime: number;
  alertCount: number;
  averageResponseTime: number;
  sessionCount: number;
  cleanDrives: number;
  bestDay: string | null;
  improvementPercentage: number | null; // compared to previous week
}

export interface StreakMetrics {
  currentStreak: number; // days with reduced handling
  bestStreak: number;
  lastImprovedDate: string | null;
  milestones: {
    reached: string[];
    next: {
      type: string;
      value: number;
      description: string;
    } | null;
  };
}

export interface MetricsData {
  sessions: DrivingSession[];
  dailyMetrics: Record<string, DailyMetrics>;
  weeklyMetrics: Record<string, WeeklyMetrics>;
  streaks: StreakMetrics;
  lastUpdated: number;
}

const DEFAULT_METRICS: MetricsData = {
  sessions: [],
  dailyMetrics: {},
  weeklyMetrics: {},
  streaks: {
    currentStreak: 0,
    bestStreak: 0,
    lastImprovedDate: null,
    milestones: {
      reached: [],
      next: {
        type: 'streak',
        value: 1,
        description: '1 day of safer driving'
      }
    }
  },
  lastUpdated: Date.now()
};

// Max sessions to store to prevent localStorage from growing too large
const MAX_SESSIONS = 100;

// Keep daily metrics for the last 30 days
const MAX_DAILY_METRICS_DAYS = 30;

/**
 * MetricsManager handles all tracking and analysis of driving behavior
 * Stores data in localStorage and provides methods for updating and querying metrics
 */
export class MetricsManager {
  private data: MetricsData;
  
  constructor() {
    this.data = this.loadMetricsData();
    this.ensureCurrentDayExists();
  }
  
  /**
   * Load metrics data from localStorage or initialize with defaults
   */
  private loadMetricsData(): MetricsData {
    try {
      const storedData = localStorage.getItem('driveSafeMetrics');
      if (storedData) {
        const parsedData = JSON.parse(storedData) as MetricsData;
        console.log('Loaded metrics data from localStorage');
        return parsedData;
      }
    } catch (error) {
      console.error('Error loading metrics from localStorage:', error);
    }
    
    return structuredClone(DEFAULT_METRICS);
  }
  
  /**
   * Save the current metrics data to localStorage
   */
  private saveMetricsData(): void {
    try {
      localStorage.setItem('driveSafeMetrics', JSON.stringify(this.data));
      this.data.lastUpdated = Date.now();
    } catch (error) {
      console.error('Error saving metrics to localStorage:', error);
    }
  }
  
  /**
   * Make sure the current day exists in daily metrics
   */
  private ensureCurrentDayExists(): void {
    const today = this.getFormattedDate(new Date());
    
    if (!this.data.dailyMetrics[today]) {
      this.data.dailyMetrics[today] = {
        date: today,
        totalDrivingTime: 0,
        totalHandlingTime: 0,
        alertCount: 0,
        averageResponseTime: 0,
        sessionCount: 0,
        cleanDrives: 0
      };
      this.saveMetricsData();
    }
  }
  
  /**
   * Format a date as YYYY-MM-DD
   */
  private getFormattedDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  /**
   * Get the ISO week number and year (YYYY-WW format)
   */
  private getWeekId(date: Date): string {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  }
  
  /**
   * Clean up old data to prevent localStorage from growing too large
   */
  private cleanupOldData(): void {
    // Keep only the most recent sessions
    if (this.data.sessions.length > MAX_SESSIONS) {
      this.data.sessions = this.data.sessions.slice(-MAX_SESSIONS);
    }
    
    // Keep only recent daily metrics
    const dailyEntries = Object.entries(this.data.dailyMetrics);
    if (dailyEntries.length > MAX_DAILY_METRICS_DAYS) {
      const sortedEntries = dailyEntries.sort((a, b) => b[0].localeCompare(a[0])); // Sort by date descending
      const recentEntries = sortedEntries.slice(0, MAX_DAILY_METRICS_DAYS);
      this.data.dailyMetrics = Object.fromEntries(recentEntries);
    }
  }
  
  /**
   * Record the start of a new driving session
   * @returns sessionId to use when ending the session
   */
  startDrivingSession(): string {
    const sessionId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    
    const newSession: DrivingSession = {
      id: sessionId,
      startTime: Date.now(),
      endTime: 0,
      totalDuration: 0,
      phoneHandlingDuration: 0,
      alertsTriggered: 0,
      averageResponseTime: 0,
      cleanDrive: true
    };
    
    this.data.sessions.push(newSession);
    this.saveMetricsData();
    
    return sessionId;
  }
  
  /**
   * Record the end of a driving session
   */
  endDrivingSession(sessionId: string, phoneHandlingDuration: number, alertsTriggered: number, averageResponseTime: number): void {
    const sessionIndex = this.data.sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) {
      console.error(`Session with ID ${sessionId} not found`);
      return;
    }
    
    const session = this.data.sessions[sessionIndex];
    const endTime = Date.now();
    const totalDuration = (endTime - session.startTime) / 1000; // in seconds
    
    // Update session data
    session.endTime = endTime;
    session.totalDuration = totalDuration;
    session.phoneHandlingDuration = phoneHandlingDuration;
    session.alertsTriggered = alertsTriggered;
    session.averageResponseTime = averageResponseTime;
    session.cleanDrive = phoneHandlingDuration === 0;
    
    // Update daily metrics
    const today = this.getFormattedDate(new Date());
    const dailyMetrics = this.data.dailyMetrics[today];
    
    dailyMetrics.totalDrivingTime += totalDuration;
    dailyMetrics.totalHandlingTime += phoneHandlingDuration;
    dailyMetrics.alertCount += alertsTriggered;
    dailyMetrics.sessionCount += 1;
    
    if (session.cleanDrive) {
      dailyMetrics.cleanDrives += 1;
    }
    
    // Update average response time
    if (alertsTriggered > 0) {
      const totalResponseTime = averageResponseTime * alertsTriggered;
      const previousTotalTime = dailyMetrics.averageResponseTime * (dailyMetrics.alertCount - alertsTriggered);
      dailyMetrics.averageResponseTime = (previousTotalTime + totalResponseTime) / dailyMetrics.alertCount;
    }
    
    // Update weekly metrics
    this.updateWeeklyMetrics();
    
    // Check for streak updates
    this.updateStreaks();
    
    // Cleanup old data
    this.cleanupOldData();
    
    // Save changes
    this.saveMetricsData();
  }
  
  /**
   * Record an alert being triggered
   */
  recordAlert(responseTime: number): void {
    const today = this.getFormattedDate(new Date());
    const dailyMetrics = this.data.dailyMetrics[today];
    
    dailyMetrics.alertCount += 1;
    
    // Update average response time
    const previousTotalTime = dailyMetrics.averageResponseTime * (dailyMetrics.alertCount - 1);
    dailyMetrics.averageResponseTime = (previousTotalTime + responseTime) / dailyMetrics.alertCount;
    
    this.saveMetricsData();
  }
  
  /**
   * Update weekly metrics based on daily data
   */
  private updateWeeklyMetrics(): void {
    const today = new Date();
    const currentWeekId = this.getWeekId(today);
    
    // Initialize current week if it doesn't exist
    if (!this.data.weeklyMetrics[currentWeekId]) {
      // Calculate week start and end dates
      const currentDay = today.getDay() || 7; // Convert Sunday (0) to 7
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - currentDay + 1); // Monday
      
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + (7 - currentDay)); // Sunday
      
      this.data.weeklyMetrics[currentWeekId] = {
        weekId: currentWeekId,
        startDate: this.getFormattedDate(startDate),
        endDate: this.getFormattedDate(endDate),
        totalDrivingTime: 0,
        totalHandlingTime: 0,
        alertCount: 0,
        averageResponseTime: 0,
        sessionCount: 0,
        cleanDrives: 0,
        bestDay: null,
        improvementPercentage: null
      };
    }
    
    // Recalculate weekly metrics from daily data
    const currentWeek = this.data.weeklyMetrics[currentWeekId];
    let totalAlertCount = 0;
    let totalResponseTime = 0;
    let bestRatio = -1;
    let bestDay = null;
    
    // Reset counters
    currentWeek.totalDrivingTime = 0;
    currentWeek.totalHandlingTime = 0;
    currentWeek.alertCount = 0;
    currentWeek.sessionCount = 0;
    currentWeek.cleanDrives = 0;
    
    // Aggregate daily metrics for the current week
    Object.values(this.data.dailyMetrics).forEach(daily => {
      if (daily.date >= currentWeek.startDate && daily.date <= currentWeek.endDate) {
        currentWeek.totalDrivingTime += daily.totalDrivingTime;
        currentWeek.totalHandlingTime += daily.totalHandlingTime;
        currentWeek.alertCount += daily.alertCount;
        currentWeek.sessionCount += daily.sessionCount;
        currentWeek.cleanDrives += daily.cleanDrives;
        
        // Track response times for weighted average
        if (daily.alertCount > 0) {
          totalAlertCount += daily.alertCount;
          totalResponseTime += daily.averageResponseTime * daily.alertCount;
        }
        
        // Determine best day (lowest handling-to-driving ratio)
        if (daily.totalDrivingTime > 0) {
          const ratio = daily.totalHandlingTime / daily.totalDrivingTime;
          if (bestRatio === -1 || ratio < bestRatio) {
            bestRatio = ratio;
            bestDay = daily.date;
          }
        }
      }
    });
    
    // Calculate week's average response time
    currentWeek.averageResponseTime = totalAlertCount > 0 ? totalResponseTime / totalAlertCount : 0;
    currentWeek.bestDay = bestDay;
    
    // Calculate improvement percentage compared to previous week
    const weekIdParts = currentWeekId.split('-W');
    const weekNum = parseInt(weekIdParts[1], 10);
    const year = parseInt(weekIdParts[0], 10);
    let previousWeekId: string;
    
    if (weekNum === 1) {
      // First week of the year, go to last week of previous year
      previousWeekId = `${year - 1}-W52`;
    } else {
      // Just go to previous week
      previousWeekId = `${year}-W${(weekNum - 1).toString().padStart(2, '0')}`;
    }
    
    const previousWeek = this.data.weeklyMetrics[previousWeekId];
    
    if (previousWeek && previousWeek.totalDrivingTime > 0 && currentWeek.totalDrivingTime > 0) {
      // Calculate handling ratio (lower is better)
      const currentRatio = currentWeek.totalHandlingTime / currentWeek.totalDrivingTime;
      const previousRatio = previousWeek.totalHandlingTime / previousWeek.totalDrivingTime;
      
      if (previousRatio > 0) {
        // Improvement percentage (positive means improvement)
        currentWeek.improvementPercentage = ((previousRatio - currentRatio) / previousRatio) * 100;
      }
    }
  }
  
  /**
   * Update user's streak metrics
   */
  private updateStreaks(): void {
    const today = this.getFormattedDate(new Date());
    const yesterday = this.getFormattedDate(new Date(Date.now() - 86400000));
    
    const todayMetrics = this.data.dailyMetrics[today];
    const yesterdayMetrics = this.data.dailyMetrics[yesterday];
    
    // Check if today is better than yesterday
    let isImproved = false;
    
    if (yesterdayMetrics && todayMetrics.totalDrivingTime > 0 && yesterdayMetrics.totalDrivingTime > 0) {
      const todayRatio = todayMetrics.totalHandlingTime / todayMetrics.totalDrivingTime;
      const yesterdayRatio = yesterdayMetrics.totalHandlingTime / yesterdayMetrics.totalDrivingTime;
      
      isImproved = todayRatio < yesterdayRatio;
    } else if (todayMetrics.totalDrivingTime > 0) {
      // If no data for yesterday but drove today, count as improvement
      isImproved = true;
    }
    
    // Update streak if improved
    if (isImproved) {
      // If last improved date was yesterday, increment streak
      if (this.data.streaks.lastImprovedDate === yesterday) {
        this.data.streaks.currentStreak += 1;
      } else {
        // Otherwise start a new streak
        this.data.streaks.currentStreak = 1;
      }
      
      this.data.streaks.lastImprovedDate = today;
      
      // Update best streak if current is better
      if (this.data.streaks.currentStreak > this.data.streaks.bestStreak) {
        this.data.streaks.bestStreak = this.data.streaks.currentStreak;
      }
      
      // Check for milestones
      this.checkMilestones();
    } 
    // If today is worse and we had activity, reset streak
    else if (todayMetrics.totalDrivingTime > 0) {
      this.data.streaks.currentStreak = 0;
    }
  }
  
  /**
   * Check and update milestone achievements
   */
  private checkMilestones(): void {
    const streaks = this.data.streaks;
    
    // Streak milestones
    const streakMilestones = [1, 3, 5, 7, 14, 30, 60, 90];
    for (const milestone of streakMilestones) {
      const milestoneKey = `streak_${milestone}_days`;
      if (streaks.currentStreak >= milestone && !streaks.milestones.reached.includes(milestoneKey)) {
        streaks.milestones.reached.push(milestoneKey);
      }
    }
    
    // Set next milestone
    let nextMilestone = null;
    for (const milestone of streakMilestones) {
      if (streaks.currentStreak < milestone) {
        nextMilestone = {
          type: 'streak',
          value: milestone,
          description: `${milestone} day${milestone > 1 ? 's' : ''} of safer driving`
        };
        break;
      }
    }
    
    streaks.milestones.next = nextMilestone;
  }
  
  /**
   * Get today's metrics summary
   */
  getTodayMetrics(): DailyMetrics {
    const today = this.getFormattedDate(new Date());
    this.ensureCurrentDayExists();
    return this.data.dailyMetrics[today];
  }
  
  /**
   * Get yesterday's metrics summary
   */
  getYesterdayMetrics(): DailyMetrics | null {
    const yesterday = this.getFormattedDate(new Date(Date.now() - 86400000));
    return this.data.dailyMetrics[yesterday] || null;
  }
  
  /**
   * Get the current week's metrics
   */
  getCurrentWeekMetrics(): WeeklyMetrics {
    const weekId = this.getWeekId(new Date());
    this.updateWeeklyMetrics(); // Ensure latest data
    return this.data.weeklyMetrics[weekId] || null;
  }
  
  /**
   * Get the user's streak information
   */
  getStreakMetrics(): StreakMetrics {
    return this.data.streaks;
  }
  
  /**
   * Get comparison between today and yesterday
   */
  getTodayVsYesterdayComparison(): {
    drivingTimeDiff: number;
    handlingTimeDiff: number;
    alertCountDiff: number;
    responseTimeDiff: number;
    handlingRatioDiff: number;
    isImproved: boolean;
  } | null {
    const today = this.getTodayMetrics();
    const yesterday = this.getYesterdayMetrics();
    
    if (!yesterday || yesterday.totalDrivingTime === 0) {
      return null;
    }
    
    const todayRatio = today.totalHandlingTime / (today.totalDrivingTime || 1);
    const yesterdayRatio = yesterday.totalHandlingTime / yesterday.totalDrivingTime;
    
    return {
      drivingTimeDiff: today.totalDrivingTime - yesterday.totalDrivingTime,
      handlingTimeDiff: today.totalHandlingTime - yesterday.totalHandlingTime,
      alertCountDiff: today.alertCount - yesterday.alertCount,
      responseTimeDiff: today.averageResponseTime - yesterday.averageResponseTime,
      handlingRatioDiff: todayRatio - yesterdayRatio,
      isImproved: todayRatio < yesterdayRatio
    };
  }
  
  /**
   * Calculate protected driving time (time without phone handling)
   */
  getProtectedDrivingTime(timeframe: 'today' | 'week' | 'total' = 'today'): number {
    if (timeframe === 'today') {
      const today = this.getTodayMetrics();
      return today.totalDrivingTime - today.totalHandlingTime;
    } else if (timeframe === 'week') {
      const week = this.getCurrentWeekMetrics();
      return week ? week.totalDrivingTime - week.totalHandlingTime : 0;
    } else {
      // Calculate all-time protected driving
      let totalDriving = 0;
      let totalHandling = 0;
      
      Object.values(this.data.dailyMetrics).forEach(day => {
        totalDriving += day.totalDrivingTime;
        totalHandling += day.totalHandlingTime;
      });
      
      return totalDriving - totalHandling;
    }
  }
  
  /**
   * Get current distraction level (percentage of driving time spent handling phone)
   * Lower is better
   */
  getDistractionPercentage(timeframe: 'today' | 'week' | 'total' = 'today'): number {
    if (timeframe === 'today') {
      const today = this.getTodayMetrics();
      return today.totalDrivingTime > 0 ? (today.totalHandlingTime / today.totalDrivingTime) * 100 : 0;
    } else if (timeframe === 'week') {
      const week = this.getCurrentWeekMetrics();
      return week && week.totalDrivingTime > 0 ? (week.totalHandlingTime / week.totalDrivingTime) * 100 : 0;
    } else {
      // Calculate all-time distraction percentage
      let totalDriving = 0;
      let totalHandling = 0;
      
      Object.values(this.data.dailyMetrics).forEach(day => {
        totalDriving += day.totalDrivingTime;
        totalHandling += day.totalHandlingTime;
      });
      
      return totalDriving > 0 ? (totalHandling / totalDriving) * 100 : 0;
    }
  }
  
  /**
   * Format seconds into a readable duration string
   */
  static formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  }
}

// Create a singleton instance
let metricsManagerInstance: MetricsManager | null = null;

export function getMetricsManager(): MetricsManager {
  if (!metricsManagerInstance && typeof window !== 'undefined') {
    metricsManagerInstance = new MetricsManager();
  }
  return metricsManagerInstance as MetricsManager;
} 