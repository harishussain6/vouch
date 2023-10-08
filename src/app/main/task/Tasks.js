import React, { useContext, useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import Add from './Add';
import Edit from './Edit';
import { UserContext } from 'app/context/UserContext';
import AddTask from './AddTask';
JwtService.init();
const axios = JwtService.getAxios();
function Tasks() {
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
			let url = '/api/admin/tasks';
			if (userContext.user.user_type === 'creative') {
				url += `?user_id=${userContext.user.id}&status=active`;
			}
			const vouchers = await axios.get(url);
			const resp = vouchers.data;
			if (resp.status) {
				setOrders(resp.data.tasks);
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
				return userContext.user.user_type === 'creative' ? <></> : <Add reload={reload} />;
			case 'edit':
				return userContext.user.user_type === 'creative' ? (
					<AddTask task_id={data.id} key={data.id} />
				) : (
					<Edit reload={reload} slide_id={data.id ? data.id : null} key={data.id} />
				);
			case 'view':
				return <Edit reload={reload} slide_id={data.id ? data.id : null} is_view={true} key={data.id} />;
			default:
				return <></>;
		}
	}

	return (
		<MaterialTable
			title="Tasks"
			data={orders}
			ref={tableRef}
			columns={[
				{
					title: 'Task',
					field: 'task'
				},
				{
					title: 'Description',
					field: 'description'
				},
				{
					title: 'Type',
					field: 'task_type'
				},
				{
					title: 'Vendor',
					field: 'vendor.name',
					render: rowData => {
						return rowData.vendor ? `${rowData.vendor.name} (${rowData.vendor.locality})` : '';
					}
				},
				{
					title: 'Duration',
					field: 'duration'
				},
				{
					title: 'Status',
					field: 'status'
				},
				{
					title: 'Total Tasks',
					field: 'no_of_tasks'
				},
				{
					title: 'Completed Tasks',
					field: 'no_of_tasks_completed'
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
				overflowY: 'visible',
				headerStyle: {
					zIndex: -1
				},
				rowStyle: {
					zIndex: -1
				}
			}}
			components={{
				Action
			}}
		/>
	);
}

export default Tasks;
