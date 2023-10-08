import React from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import Add from './Add';
import Edit from './Edit';
import StatusButton from './StatusButton';

function Vouchers({ vendor_id }) {
	const tableRef = React.createRef();
	async function getData(query) {
		return new Promise(async resolve => {
			JwtService.init();
			const axios = JwtService.getAxios();
			const params = {
				page: query.page,
				limit: query.pageSize,
				q: query.search,
				vendor_id
			};

			const vouchers = await axios.get('/api/admin/voucher', { params });
			const resp = vouchers.data;
			if (resp.status) {
				resolve({
					data: resp.data.data, /// your data array
					page: query.page, // current page number
					totalCount: resp.data.total // total row number
				});
			} else {
				resolve({
					data: [], /// your data array
					page: 0, // current page number
					totalCount: 0 // total row number
				});
			}
		});
	}
	function reload() {
		console.log(tableRef.current);
		return tableRef.current && tableRef.current.onQueryChange();
	}

	
	function Action({ action, data }) {
		switch (action.icon) {
			case 'save':
				return <Add reload={reload} vendor_id={vendor_id} />;
			case 'edit':
				return <Edit reload={reload} voucher_id={data.id ? data.id : null} vendor_id={vendor_id} />;
			case 'status':
				return <StatusButton data={data} reload={reload}/>	
			default:
				return "";
		}
	}

	return (
		<MaterialTable
			title="Vouchers"
			data={getData}
			tableRef={tableRef}
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
					title: 'Activation Date',
					field: 'act_date'
				},
				{
					title: 'Expiration Date',
					field: 'exp_date'
				},

				{
					title: 'Savings',
					field: 'savings'
				}
			]}
			actions={[
				{
					icon: 'save',
					isFreeAction: true,
					onClick: () => {}
				},
				{
					icon: 'status',
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

export default Vouchers;
