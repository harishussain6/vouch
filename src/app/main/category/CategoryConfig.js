import { authRoles } from 'app/auth';
import Categories from './Categories';
import CategoryCreate from './CategoryCreate';

const CategoryConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/category/:id',
			component: CategoryCreate,
			auth: authRoles.admin
		},
		{
			path: '/categories',
			component: Categories,
			auth: authRoles.admin
		}
	]
};

export default CategoryConfig;
