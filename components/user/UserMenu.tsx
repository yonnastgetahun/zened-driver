"use client";
import React, { useState } from 'react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useGuest } from '@/components/GuestContext';
import { handleSignOut } from '@/app/actions/auth';

export default function UserMenu() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { data: session } = useSession();
	const { isGuest, guestName } = useGuest();
	const user = session?.user;

	// Use server action for both regular and guest sign out
	const handleUserSignOut = () => {
		// For guest users we use the server action, for regular users we use signOut()
		if (isGuest) {
			// Use our custom server action
			const form = document.createElement('form');
			form.action = handleSignOut;
			form.method = 'post';
			document.body.appendChild(form);
			form.submit();
		} else {
			// Use next-auth signOut for regular users
			signOut();
		}
	};

	// Handle both authenticated and guest users
	if (!user && !isGuest) return null;

	// Determine display name and image
	const displayName = isGuest 
		? (guestName || 'Guest User') 
		: (user?.name || user?.email || 'User');
	
	const avatarUrl = isGuest 
		? "https://www.gravatar.com/avatar/?d=mp&f=y" // Guest avatar
		: (user?.image || "https://www.gravatar.com/avatar/?d=mp");

	return (
		<div className="relative">
			<button
				className="flex items-center space-x-3 focus:outline-none"
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			>
				<img
					src={avatarUrl}
					alt={`${displayName} avatar`}
					className="h-8 w-8 rounded-full object-cover"
				/>
				<span className="hidden md:flex items-center space-x-1">
					<span className="text-sm font-medium text-gray-700">{displayName}</span>
					<ChevronDown className="h-4 w-4 text-gray-500" />
				</span>
			</button>

			{/* Dropdown Menu */}
			{isMenuOpen && (
				<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
					<div
						className="py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="user-menu"
					>
						<a
							href="/app/profile"
							className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							role="menuitem"
						>
							<User className="mr-3 h-4 w-4" />
							Profile
						</a>

						<button
							onClick={handleUserSignOut}
							className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							role="menuitem"
						>
							<LogOut className="mr-3 h-4 w-4" />
							Sign out
						</button>
					</div>
				</div>
			)}
		</div>
	);
}