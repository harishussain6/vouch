import { authRoles } from 'app/auth';
import CorporateLeads from './CorporateLeads';
import CorporateLeadCreate from './CorporateLeadCreate';

const CorporateLeadConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/corporate_lead/:id',
			component: CorporateLeadCreate,
			auth: authRoles.corporate
		},
		{
			path: '/corporate_lead',
			component: CorporateLeads,
			auth: authRoles.corporate
		}
	]
};

export default CorporateLeadConfig;
