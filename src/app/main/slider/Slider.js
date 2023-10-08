import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import Add from './Add';
import Edit from './Edit';

function Slider() {
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
		const vouchers = await axios.get('/api/admin/slider');
		const resp = vouchers.data;
		if (resp.status) {
			setSliders(resp.data.sliders);
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
			case 'save':
				return <Add reload={reload} />;
			case 'edit':
				return <Edit reload={reload} slider_id={data.id ? data.id : null} />;
			default:
				return <></>;
		}
	}

	return (
		<MaterialTable
			title="Sliders"
			data={sliders}
			ref={tableRef}
			columns={[
				{
					title: 'Name',
					field: 'name'
				},
				{
					title: 'Status',
					field: 'status'
				},
				{
					title: 'Position',
					field: 'position'
				},
				{
					title: 'Slider Type',
					field: 'slider_type'
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

export default Slider;
