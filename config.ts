const config = {
	metadata: {
		title: "Zened Driver",
		description: "The ultimate companion for focused, stress-free driving experiences",
		keywords: ["Driving", "Safe Driving", "Mindfulness", "Focus", "Stress-Free", "Driver Assistant", "Road Safety", "Distraction-Free", "Zen Driving", "Driving App"],
	},
	theme: {
		colors: {
			primary: '#3A7CA5', // Calming blue - promotes focus and tranquility
			primaryHover: '#2C6384', // Darker variant
			secondary: '#81B29A', // Soft sage/mint - represents mindfulness
			accent: '#F2CC8F', // Warm amber - for attention-requiring elements
			background: '#F7F9FB', // Light, clean background
			text: '#2D3748', // Dark but not harsh text color
			border: '#E5E7EB',  // Standard border color
			borderHover: '#D1D5DB'  // Border hover color
		}
	},
	// 加入 stripe plan 的   name 和 description
	stripe: {
		free: {
			monthPrice: 0,
			yearPrice: 0,
			monthPriceId: '',
			yearPriceId: '',
			productId: '',
			name: 'Free',
			description: 'Free plan',
		},
		basic: {
			monthPrice: 9.9,
			yearPrice: 90,
			monthPriceId: 'price_1QrDN5LftJls1Qmt6yKw9Jc1',
			yearPriceId: 'price_1QvXPGLftJls1Qmtv5WDcyEx',
			productId: 'prod_RkioMb0SBidBEm',
			name: 'Basic',
			description: 'Basic plan',
		},
		pro: {
			monthPrice: 29.9,
			yearPrice: 280,
			monthPriceId: 'price_1QuociLftJls1QmtLkO3yTap',
			yearPriceId: 'price_1QvXQaLftJls1Qmt8WU8blWx',
			productId: 'prod_RoRVnNIOef31KY',
			name: 'Pro',
			description: 'Pro plan',
		},
	},
	appName: "Zened Driver",
	socialLinks: {
		github: "https://github.com",
		twitter: "https://twitter.com",
		linkedin: "https://linkedin.com"
	},
	emailProvider: "nodemailer",
};


export default config;