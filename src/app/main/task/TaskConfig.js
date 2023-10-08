import { authRoles } from 'app/auth';
import Tasks from './Tasks';
import TaskCreate from './TaskCreate';
import Posts from './Posts';

const TaskConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/tasks/:id',
			component: TaskCreate,
			auth: authRoles.marketing
		},
		{
			path: '/posts',
			component: Posts,
			auth: authRoles.marketing
		},
		{
			path: '/tasks',
			component: Tasks,
			auth: authRoles.marketing
		}
	]
};

export default TaskConfig;
