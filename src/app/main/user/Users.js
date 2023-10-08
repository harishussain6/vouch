import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import Add from './Add';
import Edit from './Edit';

function Users() {
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
			const vouchers = await axios.get('/api/admin/users');
			const resp = vouchers.data;
			if (resp.status) {
				setOrders(resp.data);
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
			case 'view':
				return <Edit reload={reload} slide_id={data.id ? data.id : null} is_view={true} />;
			default:
				return <></>;
		}
	}

	return (
		<MaterialTable
			title="Users"
			data={orders}
			ref={tableRef}
			columns={[
				{
					title: 'Name',
					field: 'name'
				},
				{
					title: 'Email',
					field: 'email'
				},
				{
					title: 'Department',
					field: 'department.name'
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
					icon: 'view',
					onClick: () => {}
				}
			]}
			options={{
				pageSize: 10,
				pageSizeOptions: [10, 20, 50],
				actionsColumnIndex: -1
			}}
			components={{
				Action
			}}
		/>
	);
}

export default Users;
