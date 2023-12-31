import Vendors from './Vendors';
import { authRoles } from 'app/auth';
import CreateVendor from './cruds/VendorCreation';
import CreateVoucher from './voucher/CreateVoucher';

const VendorConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/voucher/:vendor_id/:voucher_id',
			component: CreateVoucher,
			auth: authRoles.vendor
		},
		{
			path: '/vendor/:id/:page',
			component: CreateVendor,
			auth: authRoles.vendor
		},
		{
			path: '/vendor',
			component: Vendors,
			auth: authRoles.vendor
		}
	]
};

export default VendorConfig;
