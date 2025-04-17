import { handleSignIn, handleGuestSignIn } from "@/app/actions/auth"
import config from "@/config";

export default function SignIn() {
	return (
		<div className="flex flex-col space-y-4">
			{/* Guest sign-in button - make this the primary, prominent option */}
			<form action={handleGuestSignIn}>
				<button
					type="submit"
					className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-[#5059FE] to-[#7D65F6] hover:from-[#4048ed] hover:to-[#6A55E1] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full justify-center"
				>
					Continue as Guest
				</button>
			</form>
			
			{/* Divider */}
			<div className="relative flex items-center">
				<div className="flex-grow border-t border-gray-300"></div>
				<span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
				<div className="flex-grow border-t border-gray-300"></div>
			</div>
			
			{/* Traditional sign-in button - make this secondary */}
			<form action={handleSignIn}>
				<button
					type="submit"
					className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 w-full justify-center"
				>
					Sign In with Email
				</button>
			</form>
		</div>
	);
} 