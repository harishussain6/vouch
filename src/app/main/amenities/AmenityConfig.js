import { authRoles } from 'app/auth';
import Amenities from './Amenities';
import AmenityCreate from './AmenityCreate';

const AmenityConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/amenity/:id',
			component: AmenityCreate,
			auth: authRoles.admin
		},
		{
			path: '/amenities',
			component: Amenities,
			auth: authRoles.admin
		}
	]
};

export default AmenityConfig;
