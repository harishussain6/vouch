import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
// import Add from './Add';
import Edit from './Edit';
import { Typography } from '@material-ui/core';

function Categories() {
	const tableRef = React.createRef();
	const [sliders, setSliders] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!loading) getData();
		// eslint-disable-next-line
	}, []);

	async function getData() {
		setLoading(true);
		JwtService.init();
		const axios = JwtService.getAxios();
		const vouchers = await axios.get('/api/admin/category');
		const resp = vouchers.data;
		if (resp.status) {
			setSliders(resp.data.category);
		} else {
			setSliders([]);
		}
		setLoading(false);
	}
	function reload() {
		return getData();
	}

	function Action({ action, data }) {
		switch (action.icon) {
			case 'edit':
				return <Edit reload={reload} slide_id={data.id ? data.id : null} />;
			default:
				return <></>;
		}
	}

	return (
		<MaterialTable
			title="Category"
			data={sliders}
			ref={tableRef}
			columns={[
				{
					title: 'Name',
					field: 'name'
				},
				{
					title: 'Category Color',
					field: 'category_color',
					render: rowData => (
						<Typography style={{ color: rowData.category_color }}>{rowData.category_color}</Typography>
					)
				},
				{
					title: 'Retail',
					field: 'retail',
					render: rowData => <img src={rowData.retail} alt={rowData.name} style={{ width: 50 }} />
				},
				{
					title: 'Gold',
					field: 'gold',
					render: rowData => <img src={rowData.gold} alt={rowData.name} style={{ width: 50 }} />
				}
			]}
			isLoading={loading}
			actions={[
				{
					icon: 'edit',
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

export default Categories;
