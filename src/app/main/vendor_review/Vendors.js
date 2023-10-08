import React from 'react';
import JwtService from 'app/services/jwtService';
import { Grid } from '@material-ui/core';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { connect } from 'react-redux';

JwtService.init();
const axios = JwtService.getAxios();

function Vendors({ user }) {
	const history = useHistory();

	async function getData(query) {
		return new Promise(async resolve => {
			const params = {
				page: query.page,
				limit: query.pageSize,
				q: query.search
			};

			const vendors = await axios.get('/api/admin/vendor-review', {
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
		const actions = [
			{
				icon: 'visibility',
				tooltip: 'View Vendor',
				onClick: (event, data) => history.push('/vendor_review/' + data.id)
			}
		];

		if (user.data.role !== 'creative') {
			actions.push({
				icon: 'add_circle_outline',
				isFreeAction: true,
				onClick: () => history.push('/vendor_review/new')
			});
		}
		return actions;
	}

	return (
		<FusePageSimple
			content={
				<Grid container>
					<Grid item md={12}>
						<MaterialTable
							title="Vendors For Review"
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
									title: 'Live',
									width: 10,
									render: rowData => (rowData.is_live ? 'Live' : 'Pending')
								}
							]}
							actions={actions()}
							options={{
								pageSize: 10,
								pageSizeOptions: [10, 20, 50],
								actionsColumnIndex: -1
							}}
						/>
					</Grid>
				</Grid>
			}
		/>
	);
}
function mapStateToProps({ auth }) {
	return {
		user: auth.user
	};
}

export default connect(mapStateToProps)(Vendors);
