import React, { useContext, useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import Add from './Add';
import Edit from './Edit';
import { UserContext } from 'app/context/UserContext';
import moment from 'moment';

function CorporateLeads() {
	const tableRef = React.createRef();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const userContext = useContext(UserContext);
	useEffect(() => {
		if (!loading) getData();
		// eslint-disable-next-line
	}, []);

	async function getData() {
		try {
			setLoading(true);
			JwtService.init();
			const axios = JwtService.getAxios();
			const vouchers = await axios.get('/api/admin/corporate_lead');
			const resp = vouchers.data;
			if (resp.status) {
				setOrders(resp.data.corporateLead);
			} else {
				setOrders([]);
			}
			setLoading(false);
		} catch (ex) {
			setOrders([]);
			setLoading(false);
		}
	}
	function reload() {
		return getData();
	}

	function Action({ action, data }) {
		const user = userContext.user;
		switch (action.icon) {
			case 'save':
				return <Add reload={reload} />;
			case 'edit':
				return user.role === 'admin' || user.id === data.user_id ? (
					<Edit reload={reload} slide_id={data.id ? data.id : null} />
				) : (
					<></>
				);
			case 'view':
				return user.role === 'admin' || user.id === data.user_id ? (
					<Edit reload={reload} slide_id={data.id ? data.id : null} is_view={true} />
				) : (
					<></>
				);
			default:
				return <></>;
		}
	}

	return (
		<MaterialTable
			title="Corporate Lead"
			data={orders}
			ref={tableRef}
			columns={[
				{
					title: 'Name',
					field: 'name'
				},
				{
					title: 'Contact Number',
					field: 'contact_number',
					render: data => {
						const user = userContext.user;
						if (user.role === 'admin' || user.id === data.user_id) return data.contact_number;
						return '';
					}
				},
				{
					title: 'Point Of Contact',
					field: 'person_of_contact'
				},
				{
					title: 'Company Name',
					field: 'company_name'
				},
				{
					title: 'Product',
					field: 'product'
				},
				{
					title: 'Status',
					field: 'status'
				},
				{
					title:"Next Update",
					field:"next_update"
				},
				{
					title: 'Last Update',
					field: 'updated_at',
					render: rowData => {
						const date = moment(rowData.updated_at);
						return date.format('MMMM Do YYYY');
					}
				}
			]}
			isLoading={loading}
			actions={[
				{
					icon: 'save',
					isFreeAction: true,
					onClick: () => {}
				},
				{
					icon: 'edit',
					onClick: () => {}
				},
				{
					icon: 'view',
					onClick: () => {}
				}
			]}
			options={{
				pageSize: 10,
				pageSizeOptions: [10, 20, 50],
				actionsColumnIndex: -1,
				exportButton: true
			}}
			components={{
				Action
			}}
		/>
	);
}

export default CorporateLeads;
