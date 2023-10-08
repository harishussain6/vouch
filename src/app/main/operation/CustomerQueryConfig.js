import { authRoles } from 'app/auth';
import CustomerQueries from './CustomerQueries';
import CustomerQueryCreate from './CustomerQueryCreate';

const CustomerQueryConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/customer_query/:id',
			component: CustomerQueryCreate,
			auth: authRoles.staff
		},
		{
			path: '/customer_query',
			component: CustomerQueries,
			auth: authRoles.staff
		}
	]
};

export default CustomerQueryConfig;
