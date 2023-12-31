import Vendors from './Vendors';
import { authRoles } from 'app/auth';
import CreateVendor from './cruds/VendorCreation';

const VendorReviewConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/vendor_review/:id',
			component: CreateVendor,
			auth: authRoles.reviewersAdmin
		},
		{
			path: '/vendor_review',
			component: Vendors,
			auth: authRoles.reviewersAdmin
		}
	]
};

export default VendorReviewConfig;
