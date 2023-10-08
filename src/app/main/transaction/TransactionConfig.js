import { authRoles } from 'app/auth';
import Transaction from './Transactions';

const TransactionConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/transaction/list',
			component: Transaction,
			auth: authRoles.customer
		},
		{
			path: '/transaction/create',
			auth: authRoles.vendor
		}
	]
};

export default TransactionConfig;
