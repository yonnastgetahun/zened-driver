'use server'

import { signIn, signOut } from "@/lib/auth"
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { generateDeviceId } from '@/lib/guestAuth';

export async function handleSignIn() {
	// standard email sign in
	await signIn("credentials", { redirectTo: "/app" })
}

export async function handleSignOut() {
	// Clear guest auth cookie if it exists
	const cookieStore = await cookies();
	cookieStore.delete('guest_auth');
	await signOut({ redirectTo: "/" })
}

export async function handleGuestSignIn() {
	// Generate device ID
	const deviceId = generateDeviceId();
	
	// Set a cookie to identify the guest user
	const cookieStore = await cookies();
	cookieStore.set('guest_auth', deviceId, { 
		path: '/',
		maxAge: 60 * 60 * 24 * 30, // 30 days
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax'
	});
	
	// Store additional info in a non-HttpOnly cookie for client-side access
	cookieStore.set('guest_info', JSON.stringify({ 
		isGuest: true,
		deviceId 
	}), { 
		path: '/',
		maxAge: 60 * 60 * 24 * 30, // 30 days
		httpOnly: false,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax'
	});
	
	// Redirect to app
	redirect("/app");
} 