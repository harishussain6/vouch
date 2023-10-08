import { authRoles } from 'app/auth';
import GlobalNotification from './GlobalNotification';
import GlobalNotifications from './GlobalNotifications';

const GlobalNotificationConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/global-notifications',
			component: GlobalNotifications,
			auth: authRoles.marketing
		},
		{
			path: '/global-notification',
			component: GlobalNotification,
			auth: authRoles.marketing
		}
	]
};

export default GlobalNotificationConfig;
