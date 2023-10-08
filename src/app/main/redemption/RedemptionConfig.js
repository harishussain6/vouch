import { authRoles } from 'app/auth';
import Redemption from './Redemptions';

const RedemptionConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/redemption/list',
			component: Redemption,
			auth: authRoles.redemptions
		},
		{
			path: '/redemption/create',
			auth: authRoles.vendor
		}
	]
};

export default RedemptionConfig;
