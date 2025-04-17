/**
 * Analytics page for reviewing A/B testing results
 * Displays aggregated metrics and visualizations from server data
 */
import { createSupabaseAdminClient } from '@/utils/supabase/server';
import AnalyticsDashboard from '@/components/app/AnalyticsDashboard';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AnalyticsPage() {
  // Check authentication
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  
  // Get metrics from database
  const supabase = await createSupabaseAdminClient();
  
  // Fetch aggregated metrics for all users
  const { data: metricsData, error: metricsError } = await supabase
    .from('alert_metrics')
    .select('*');
  
  // Fetch detailed alert events
  const { data: alertsData, error: alertsError } = await supabase
    .from('drivesafe_alert')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  
  if (metricsError || alertsError) {
    console.error('Error fetching analytics data:', metricsError || alertsError);
  }
  
  // Calculate variant performance metrics
  const variantA = {
    count: 0,
    totalDuration: 0,
    avgDuration: 0,
    users: new Set()
  };
  
  const variantB = {
    count: 0,
    totalDuration: 0,
    avgDuration: 0,
    users: new Set()
  };
  
  // Process metrics data
  if (metricsData) {
    metricsData.forEach(metric => {
      if (metric.alert_variant === 'A') {
        variantA.count += metric.alert_count;
        variantA.totalDuration += (metric.avg_duration || 0) * metric.alert_count;
        variantA.users.add(metric.user_id);
      } else {
        variantB.count += metric.alert_count;
        variantB.totalDuration += (metric.avg_duration || 0) * metric.alert_count;
        variantB.users.add(metric.user_id);
      }
    });
    
    // Calculate averages
    if (variantA.count > 0) {
      variantA.avgDuration = variantA.totalDuration / variantA.count;
    }
    
    if (variantB.count > 0) {
      variantB.avgDuration = variantB.totalDuration / variantB.count;
    }
  }
  
  // Prepare aggregated data
  const analyticsData = {
    variantA: {
      ...variantA,
      userCount: variantA.users.size
    },
    variantB: {
      ...variantB,
      userCount: variantB.users.size
    },
    rawEvents: alertsData || []
  };
  
  return (
    <div className="flex-1 h-full min-h-[calc(100vh-64px)]">
      <AnalyticsDashboard analyticsData={analyticsData} />
    </div>
  );
} 