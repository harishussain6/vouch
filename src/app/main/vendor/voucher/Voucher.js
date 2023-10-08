import currentDate from 'app/utils/helpers';

export const Voucher = {
	id: null,
	vendor_id: 0,
	name: '',
	description: '',
	vc_code: 0,
	pos_code: 0,
	act_date: currentDate(),
	exp_date: currentDate(),
	savings: 0,
	redeemed: 0,
	is_percent: 0,
	valid_from: currentDate(),
	valid_to: currentDate(),
	memberships: [],
	partners: [{ id: 1, name: 'vouch365' }],
	offer: [],
	status: 'inactive'
};
