import { authRoles } from 'app/auth';

const navigationConfig = [
	{
		id: 'vendors',
		title: 'Vendor',
		type: 'group',
		icon: 'apps',
		auth: authRoles.reviewersAdmin,
		children: [
			{
				id: 'vendor_review',
				title: 'Vendor In Reviews',
				type: 'item',
				icon: 'local_library',
				url: '/vendor_review',
				auth: authRoles.reviewers
			},
			{
				id: 'vendor',
				title: 'Vendor List',
				type: 'item',
				icon: 'local_library',
				url: '/vendor',
				auth: authRoles.reviewersAdmin
			}
		]
	},
	{
		id: 'redemptions',
		title: 'Redemption',
		type: 'group',
		icon: 'apps',
		auth: authRoles.redemptions,
		children: [
			{
				id: 'redemption-list',
				title: 'Redemption List',
				type: 'item',
				icon: 'receipt',
				url: '/redemption/list',
				auth: authRoles.redemptions
			}
		]
	},
	{
		id: 'transactions',
		title: 'Transactions',
		type: 'group',
		icon: 'apps',
		auth: authRoles.customer,
		children: [
			{
				id: 'transaction-list',
				title: 'Transaction List',
				type: 'item',
				icon: 'receipt',
				url: '/transaction/list',
				auth: authRoles.customer
			}
		]
	},
	{
		id: 'global-notification',
		title: 'Global Notification',
		type: 'item',
		icon: 'notifications',
		url: '/global-notifications',
		auth: authRoles.marketing
	},
	{
		id: 'user',
		title: 'Users',
		type: 'item',
		icon: 'person',
		url: '/user',
		auth: authRoles.hr
	},
	{
		id: 'log',
		title: 'Logs',
		type: 'item',
		icon: 'equalizer',
		url: '/log',
		auth: authRoles.admin
	},
	{
		id: 'premium_key',
		title: 'Premium Key Generation',
		type: 'item',
		icon: 'vpn_key',
		url: '/premium_key',
		auth: authRoles.premiumKey
	},
	{
		id: 'customer',
		title: 'Customers',
		type: 'item',
		icon: 'person',
		url: '/customer',
		auth: authRoles.customer
	},
	{
		id: 'order',
		title: 'Orders',
		type: 'item',
		icon: 'receipt',
		url: '/order',
		auth: authRoles.orders
	},
	{
		id: 'corporate',
		title: 'Corporate Lead',
		type: 'item',
		icon: 'receipt',
		url: '/corporate_lead',
		auth: authRoles.corporate
	},
	{
		id: 'operation',
		title: 'CSR',
		type: 'item',
		icon: 'receipt',
		url: '/customer_query',
		auth: authRoles.staff
	},
	{
		id: 'task',
		title: 'Tasks',
		type: 'item',
		icon: 'list_alt',
		url: '/tasks',
		auth: authRoles.marketing
	},
	{
		id: 'posts',
		title: 'Posts',
		type: 'item',
		icon: 'list_alt',
		url: '/posts',
		auth: authRoles.marketing
	},
	{
		id: 'setup',
		title: 'Setup',
		type: 'group',
		icon: 'gear',
		children: [
			{
				id: 'slider',
				title: 'Sliders',
				type: 'item',
				icon: 'photo_library',
				url: '/slider',
				auth: authRoles.marketing
			},
			{
				id: 'slides',
				title: 'Slides',
				type: 'item',
				icon: 'photo_library',
				url: '/slides',
				auth: authRoles.marketing
			},
			{
				id: 'popup',
				title: 'Popup Notifications',
				type: 'item',
				icon: 'photo_library',
				url: '/popup',
				auth: authRoles.marketing
			},
			{
				id: 'amenities',
				title: 'Amenities',
				type: 'item',
				icon: 'photo_library',
				url: '/amenities',
				auth: authRoles.admin
			},
			{
				id: 'categories',
				title: 'Categories',
				type: 'item',
				icon: 'photo_library',
				url: '/categories',
				auth: authRoles.admin
			},
			{
				id: 'landing-list',
				title: 'Landing List',
				type: 'item',
				icon: 'photo_library',
				url: '/landing-list',
				auth: authRoles.marketing
			}
		]
	}
];

export default navigationConfig;
