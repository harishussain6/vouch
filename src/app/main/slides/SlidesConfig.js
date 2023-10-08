import { authRoles } from 'app/auth';
import Slides from './Slides';
import SlidesCreate from './SlidesCreate';

const SlidesConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/slides/:id',
			component: SlidesCreate,
			auth: authRoles.marketing
		},
		{
			path: '/slides',
			component: Slides,
			auth: authRoles.marketing
		}
	]
};

export default SlidesConfig;
