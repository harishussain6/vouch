import { authRoles } from 'app/auth';
import Slider from './Slider';
import SliderCreate from './SliderCreate';

const SliderrConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/slider/:id',
			component: SliderCreate,
			auth: authRoles.marketing
		},
		{
			path: '/slider',
			component: Slider,
			auth: authRoles.marketing
		}
	]
};

export default SliderrConfig;
