/**
 * Authorization Roles
 */
const authRoles = {
	admin: ['admin', 'it'],
	premiumKey: ['admin', 'it', 'marketing'],
	reviewers: ['admin', 'it', 'creative', 'alliance'],
	reviewersAdmin: ['admin', 'it', 'creative', 'vendor', 'alliance'],
	staff: ['admin', 'client_support', 'csr', 'it', 'marketing', 'hr', 'creative', 'alliance', 'corporate', 'alliance'],
	customer: ['admin', 'it', 'csr'],
	redemptions: ['admin', 'it', 'csr', 'marketing', 'vendor', 'alliance', 'client_support', 'client_service'],
	vendor: ['admin', 'vendor', 'it', 'alliance', 'client_service', 'client_support'],
	hr: ['admin', 'hr', 'it'],
	orders: ['admin', 'orders', 'it'],
	it: ['admin', 'it'],
	marketing: ['admin', 'marketing', 'it', 'creative', 'alliance', 'client_service', 'client_support'],
	creative: ['admin', 'creative', 'it'],
	alliance: ['admin', 'alliance', 'it'],
	corporate: ['admin', 'corporate', 'it'],
	onlyGuest: []
};

export default authRoles;
