import { authRoles } from 'app/auth';
import Customers from './Customers';
import ProfilePage from './profile/ProfilePage';

const CustomerConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/customer/:id/:corporateApp',
			component: ProfilePage,
			auth: authRoles.customer
		},
		{
			path: '/customer',
			component: Customers,
			auth: authRoles.customer
		}
	]
};

export default CustomerConfig;
