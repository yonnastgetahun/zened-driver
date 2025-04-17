import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Function to generate a unique device ID
export function generateDeviceId(): string {
  // Check if we already have a device ID in localStorage
  if (typeof window !== 'undefined') {
    const existingId = localStorage.getItem('device_id');
    if (existingId) return existingId;
    
    // If no existing ID, generate a new one and store it
    const newId = uuidv4();
    localStorage.setItem('device_id', newId);
    return newId;
  }
  
  // Fallback for server-side (though this shouldn't be called server-side)
  return uuidv4();
}

// Function to create a guest user in Supabase
export async function createGuestUser() {
  const deviceId = generateDeviceId();
  
  // Create a Supabase client with the anon key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Check if a user already exists with this device ID
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('device_id', deviceId)
    .maybeSingle();
    
  if (existingUser) {
    // User exists, return their ID
    return { 
      id: existingUser.id,
      deviceId,
      isNewUser: false
    };
  }
  
  // Create a new guest user
  const { data: newUser, error } = await supabase
    .from('users')
    .insert({
      device_id: deviceId,
      is_guest: true,
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single();
    
  if (error) {
    console.error('Error creating guest user:', error);
    throw error;
  }
  
  return { 
    id: newUser.id,
    deviceId,
    isNewUser: true
  };
}

// Function to sign in as a guest
export async function signInAsGuest() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const deviceId = generateDeviceId();
  
  // Create a custom JWT token for this device ID
  // In a real implementation, you'd want to sign this properly on the server side
  // This is a simplified version
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `guest_${deviceId}@example.com`,
    password: deviceId, // In a real app, use a more secure approach
  });
  
  if (error) {
    // If the user doesn't exist, create them
    if (error.message.includes('Invalid login credentials')) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: `guest_${deviceId}@example.com`,
        password: deviceId,
        options: {
          data: {
            is_guest: true,
            device_id: deviceId,
          },
        },
      });
      
      if (signUpError) {
        console.error('Error signing up guest user:', signUpError);
        throw signUpError;
      }
      
      return {
        session: signUpData.session,
        user: signUpData.user,
        isNewUser: true,
      };
    } else {
      console.error('Error signing in guest user:', error);
      throw error;
    }
  }
  
  return {
    session: data.session,
    user: data.user,
    isNewUser: false,
  };
} 