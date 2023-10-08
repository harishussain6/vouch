import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import Add from './Add';
import Edit from './Edit';
import moment from 'moment';

function CustomerQueries() {
	const tableRef = React.createRef();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!loading) getData();
		// eslint-disable-next-line
	}, []);

	async function getData() {
		try {
			setLoading(true);
			JwtService.init();
			const axios = JwtService.getAxios();
			const vouchers = await axios.get('/api/admin/customer_query');
			const resp = vouchers.data;
			if (resp.status) {
				setOrders(resp.data.customer_query);
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
		switch (action.icon) {
			case 'save':
				return <Add reload={reload} />;
			case 'edit':
				return <Edit reload={reload} slide_id={data.id ? data.id : null} />;
			case 'view':
				return <Edit reload={reload} slide_id={data.id ? data.id : null} is_view={true} />;
			default:
				return <></>;
		}
	}

	return (
		<MaterialTable
			title="CSR"
			data={orders}
			ref={tableRef}
			columns={[
				{
					title: 'Complaint ID',
					field: 'id'
				},
				{
					title: 'Customer Name',
					field: 'customer_name'
				},
				{
					title: 'Mobile Number',
					field: 'mobile_number'
				},
				{
					title: 'Department',
					field: 'department.name'
				},
				{
					title: 'User',
					field: 'user.name'
				},
				{
					title: 'Status',
					field: 'status'
				},
				{
					title: 'Created At',
					field: 'created_at',
					render: rowData => {
						const date = moment(rowData.created_at);
						return date.format('MMMM Do YYYY');
					}
				},
				{
					title: 'Updated At',
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

export default CustomerQueries;
