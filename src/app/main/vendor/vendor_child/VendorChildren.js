import React, { createRef } from 'react';
import JwtService from 'app/services/jwtService';
import MaterialTable from 'material-table';
import AddChild from './AddChild';
import EditChild from './EditChild';

function VendorChildren({ vendor_id }) {
	const tableRef = createRef();

	function reload() {
		tableRef.current.onQueryChange();
	}
	async function getData(query) {
		return new Promise(async resolve => {
			JwtService.init();
			const axios = JwtService.getAxios();
			const params = {
				page: query.page,
				limit: query.pageSize,
				q: query.search
			};

			params.parent_id = vendor_id;
			const vendors = await axios.get('/api/admin/vendor', {
				params
			});
			const resp = vendors.data;
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

	function actions() {
		const actions = [];

		actions.push({
			icon: 'save',
			tooltip: 'Create',
			isFreeAction: true,
			onClick: (event, data) => {}
		});

		actions.push({
			icon: 'edit',
			tooltip: 'Edit',
			onClick: (event, data) => {}
		});

		return actions;
	}

	function Action({ action, data }) {
		switch (action.icon) {
			case 'save':
				return <AddChild vendor_id={vendor_id} reload={reload} />;
			case 'edit':
				return <EditChild vendor_id={data.id ? data.id : null} reload={reload} />;
			default:
				return <></>;
		}
	}

	return (
		<MaterialTable
			ref={tableRef}
			title="Branches"
			data={getData}
			columns={[
				{
					title: 'Name',
					field: 'name',
					width: 30
				},
				{
					title: 'Locality',
					field: 'locality',
					width: 30
				},
				{
					title: 'City',
					field: 'city.name',
					width: 10
				},
				{
					title: 'Status',
					field: 'status',
					width: 10
				}
			]}
			actions={actions()}
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

export default VendorChildren;
