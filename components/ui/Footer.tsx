import Link from 'next/link';
import { Github, Twitter, Linkedin, Heart, Smile, Shield } from 'lucide-react';
import config from '@/config';

const Footer = () => {
	return (
		<footer className="w-full border-t border-gray-200 bg-[var(--background)] py-12">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Company Info */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-primary">{config.metadata.title}</h3>
						<div className="flex flex-col space-y-2">
							<Link
								href="/about"
								className="text-gray-600 hover:text-primary transition-colors"
							>
								About Us
							</Link>
							<Link
								href="/careers"
								className="text-gray-600 hover:text-primary transition-colors"
							>
								Careers
							</Link>
							<Link
								href="/blog"
								className="text-gray-600 hover:text-primary transition-colors"
							>
								Blog
							</Link>
						</div>
					</div>

					{/* Driving Resources */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-primary">Safe Driving</h3>
						<div className="flex flex-col space-y-2">
							<Link
								href="/resources/mindfulness"
								className="text-gray-600 hover:text-primary transition-colors"
							>
								Mindfulness Tips
							</Link>
							<Link
								href="/resources/focus"
								className="text-gray-600 hover:text-primary transition-colors"
							>
								Focus Techniques
							</Link>
							<Link
								href="/resources/safety"
								className="text-gray-600 hover:text-primary transition-colors"
							>
								Road Safety Guide
							</Link>
						</div>
					</div>

					{/* Legal */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-primary">Legal</h3>
						<div className="flex flex-col space-y-2">
							<a
								href="https://www.termsfeed.com/live/5ccabc26-0423-4a83-b6d5-57b7a08fd80d"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-600 hover:text-primary transition-colors"
							>
								Privacy Policy
							</a>
							<Link
								href="/terms"
								className="text-gray-600 hover:text-primary transition-colors"
							>
								Terms of Service
							</Link>
							<Link
								href="/cookies"
								className="text-gray-600 hover:text-primary transition-colors"
							>
								Cookie Policy
							</Link>
						</div>
					</div>

					{/* Community */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-primary">Community</h3>
						<div className="flex flex-col space-y-2">
							<Link
								href="/community/stories"
								className="text-gray-600 hover:text-primary transition-colors"
							>
								Success Stories
							</Link>
							<Link
								href="/community/forum"
								className="text-gray-600 hover:text-primary transition-colors"
							>
								Discussion Forum
							</Link>
							<div className="flex space-x-4 mt-4">
								<a
									href={config.socialLinks?.github || '#'}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-600 hover:text-primary transition-colors"
								>
									<Github className="w-5 h-5" />
								</a>
								<a
									href={config.socialLinks?.twitter || '#'}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-600 hover:text-primary transition-colors"
								>
									<Twitter className="w-5 h-5" />
								</a>
								<a
									href={config.socialLinks?.linkedin || '#'}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-600 hover:text-primary transition-colors"
								>
									<Linkedin className="w-5 h-5" />
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Daily Tip */}
				<div className="mt-8 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
					<div className="flex items-start gap-3">
						<Smile className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
						<p className="text-sm text-gray-700">
							<span className="font-medium">Zen Driving Tip:</span> Before starting your journey, take three deep breaths to center yourself and set an intention for a calm, focused drive.
						</p>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-8 pt-8 border-t border-gray-200">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-sm text-gray-600">
							© {new Date().getFullYear()} {config.appName}. All rights reserved.
						</p>
						<div className="mt-4 md:mt-0 flex items-center">
							<p className="text-sm text-gray-600 flex items-center">
								<span className="mr-1">Made with</span> 
								<Heart className="w-4 h-4 text-secondary mx-1" /> 
								<span>for mindful driving</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer; 