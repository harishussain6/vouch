import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import Add from './Add';
import Edit from './Edit';

function Orders() {
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
			const vouchers = await axios.get('/api/admin/order');
			const resp = vouchers.data;
			if (resp.status) {
				setOrders(resp.data.order);
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
			title="Order"
			data={orders}
			ref={tableRef}
			columns={[
				{
					title: 'Name',
					field: 'name'
				},
				{
					title: 'Contact Number',
					field: 'contact_number'
				},
				{
					title: 'Address',
					field: 'address'
				},
				{
					title: 'Delivery Date',
					field: 'delivery_date'
				},
				{
					title: 'City',
					field: 'city'
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

export default Orders;
