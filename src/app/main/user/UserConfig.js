import { authRoles } from 'app/auth';
import Users from './Users';
import UserCreate from './UserCreate';

const UserConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/user/:id',
			component: UserCreate
		},
		{
			path: '/user',
			component: Users,
			auth: authRoles.hr
		}
	]
};

export default UserConfig;
