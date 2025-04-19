'use server'

import { createClient } from '@supabase/supabase-js'

interface FeedbackData {
  type: 'issue' | 'suggestion'
  message: string
  contactInfo?: string
  userId: string
  isGuest: boolean
}

interface QuickFeedbackData {
  screen: string
  reaction: 'positive' | 'neutral' | 'negative'
  userId: string
  isGuest: boolean
}

export async function submitFeedback({
  type,
  message,
  contactInfo,
  userId,
  isGuest
}: FeedbackData) {
  try {
    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    )

    // Store the feedback in Supabase
    const { data: _data, error } = await supabase
      .from('feedback')
      .insert([
        {
          type,
          message,
          contact_info: contactInfo,
          user_id: userId,
          is_guest: isGuest,
          created_at: new Date().toISOString()
        }
      ])

    if (error) {
      console.error('Error inserting feedback:', error)
      throw new Error('Failed to submit feedback')
    }

    // Add your notification logic here (e.g., send email to admin, notify Slack)
    // This could be a separate function or service call

    return { success: true }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    throw error
  }
}

export async function submitQuickFeedback({
  screen,
  reaction,
  userId,
  isGuest
}: QuickFeedbackData) {
  try {
    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    )

    // Store the quick reaction feedback in Supabase
    const { data: _data, error } = await supabase
      .from('quick_feedback')
      .insert([
        {
          screen,
          reaction,
          user_id: userId,
          is_guest: isGuest,
          created_at: new Date().toISOString()
        }
      ])

    if (error) {
      console.error('Error inserting quick feedback:', error)
      throw new Error('Failed to submit quick feedback')
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting quick feedback:', error)
    throw error
  }
} 