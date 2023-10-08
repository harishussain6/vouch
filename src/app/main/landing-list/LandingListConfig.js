import { authRoles } from 'app/auth';
import LandingListCreate from './LandingListCreate';
import LandingList from './LandingList';

const LandingListConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/landing-list/:id',
			component: LandingListCreate,
			auth: authRoles.marketing
		},
		{
			path: '/landing-list',
			component: LandingList,
			auth: authRoles.marketing
		}
	]
};

export default LandingListConfig;
