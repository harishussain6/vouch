import { authRoles } from 'app/auth';
import Logs from './Logs';

const LogConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/log',
			component: Logs,
			auth: authRoles.admin
		}
	]
};

export default LogConfig;
