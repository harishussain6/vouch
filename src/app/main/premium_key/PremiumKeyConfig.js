import { authRoles } from 'app/auth';
import CreatePremiumKey from './PremiumKeyCreation';
import PremiumKeysGeneration from './PremiumKeysGeneration';

const PremiumKeyConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/premium_key/create',
			component: CreatePremiumKey,
			auth: authRoles.premiumKey
		},
		{
			path: '/premium_key',
			component: PremiumKeysGeneration,
			auth: authRoles.premiumKey
		}
	]
};

export default PremiumKeyConfig;
