import { authRoles } from 'app/auth';
import Orders from './Orders';
import OrderCreate from './OrderCreate';

const OrderConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/order/:id',
			component: OrderCreate,
			auth: authRoles.orders
		},
		{
			path: '/order',
			component: Orders,
			auth: authRoles.orders
		}
	]
};

export default OrderConfig;
