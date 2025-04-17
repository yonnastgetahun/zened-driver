import { createSupabaseAdminClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Get session to ensure user is authenticated
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Extract user ID from the session
    // @ts-ignore - the supabase adapter adds this property
    const userId = session.user.id;
    
    // Parse request body
    const { alertLevel, alertVariant, duration, timestamp } = await request.json();
    
    // Validate required fields
    if (!alertVariant || !alertLevel) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Get Supabase admin client to bypass RLS
    const supabaseAdmin = await createSupabaseAdminClient();
    
    // Insert alert event into database
    const { data, error } = await supabaseAdmin
      .from('drivesafe_alert')
      .insert({
        user_id: userId,
        alert_level: alertLevel,
        alert_variant: alertVariant,
        duration: duration || null,
        created_at: timestamp || new Date().toISOString()
      });
    
    if (error) {
      console.error('Error logging alert event:', error);
      return NextResponse.json(
        { error: 'Failed to log alert event' }, 
        { status: 500 }
      );
    }
    
    // Update aggregated metrics
    await updateAggregatedMetrics(supabaseAdmin, userId, alertVariant, duration);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in alert metrics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

async function updateAggregatedMetrics(
  supabaseAdmin: any, 
  userId: string, 
  alertVariant: 'A' | 'B', 
  duration: number
) {
  try {
    // Check if a record for this user and variant already exists
    const { data: existingData } = await supabaseAdmin
      .from('alert_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('alert_variant', alertVariant)
      .single();
    
    if (existingData) {
      // Update existing record
      const newAvgDuration = duration 
        ? ((existingData.avg_duration || 0) * existingData.alert_count + duration) / 
          (existingData.alert_count + 1)
        : existingData.avg_duration;
      
      await supabaseAdmin
        .from('alert_metrics')
        .update({
          alert_count: existingData.alert_count + 1,
          avg_duration: newAvgDuration,
          last_occurred: new Date().toISOString()
        })
        .eq('id', existingData.id);
    } else {
      // Insert new record
      await supabaseAdmin
        .from('alert_metrics')
        .insert({
          user_id: userId,
          alert_variant: alertVariant,
          alert_count: 1,
          avg_duration: duration || 0,
          last_occurred: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Error updating aggregated metrics:', error);
  }
} 