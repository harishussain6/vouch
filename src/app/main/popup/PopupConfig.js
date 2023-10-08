import { authRoles } from 'app/auth';
import Popups from './Popup';
import PopupCreate from './PopupCreate';

const PopupConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/popup/:id',
			component: PopupCreate,
			auth: authRoles.marketing
		},
		{
			path: '/popup',
			component: Popups,
			auth: authRoles.marketing
		}
	]
};

export default PopupConfig;
