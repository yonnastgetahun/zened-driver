import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const session = await auth();
	const guestAuth = request.cookies.get('guest_auth')?.value;
	
	// Protected routes that require some form of authentication
	if (request.nextUrl.pathname.startsWith('/app')) {
		// Check if user is authenticated either via session or guest auth
		if (!session && !guestAuth) {
			// Redirect to home page if not authenticated
			return NextResponse.redirect(new URL('/', request.url));
		}
	}
	
	return NextResponse.next();
}

// Specify the routes this middleware should run on
export const config = {
	matcher: ['/app/:path*'],
}