import React, { useContext, useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import { UserContext } from 'app/context/UserContext';
import moment from 'moment';

const axios = JwtService.getAxios();

function Posts({ id }) {
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
			let url = id ? `/api/admin/tasks/${id}/posts` : `/api/admin/posts`;
			if (id && userContext.user.user_type === 'creative') {
				url += `?user_id=${userContext.user.id}`;
			}
			const vouchers = await axios.get(url);
			const resp = vouchers.data;
			if (resp.status) {
				setOrders(resp.data.posts);
			} else {
				setOrders([]);
			}
			setLoading(false);
		} catch (ex) {
			setOrders([]);
			setLoading(false);
		}
	}

	function columns() {
		const column = [
			{
				title: 'Title',
				field: 'title',
				render: rowData => (
					<a href={`${rowData.link}`} target="_blank" rel="noopener noreferrer">
						{rowData.title}
					</a>
				)
			},
			{
				title: 'Link',
				field: 'link',
				render: rowData => (
					<a href={`${rowData.link}`} target="_blank" rel="noopener noreferrer">
						{rowData.link}
					</a>
				)
			}
		];

		if (!id) {
			column.push({
				title: 'Vendor',
				field: 'vendor_name'
			});
		}
		column.push({
			title: 'Created At',
			field: 'created_at',
			render: rowData => {
				const date = moment(rowData.created_at);
				return date.format('dddd, MMMM Do YYYY, h:mm:ss a');
			}
		});
		return column;
	}

	return (
		<MaterialTable
			title="Posts"
			data={orders}
			ref={tableRef}
			columns={columns()}
			isLoading={loading}
			options={{
				pageSize: 10,
				pageSizeOptions: [10, 20, 50],
				actionsColumnIndex: -1,
				exportButton: true
			}}
		/>
	);
}

export default Posts;
