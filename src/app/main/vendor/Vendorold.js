import React, { useState,useEffect } from 'react';
import JwtService from 'app/services/jwtService';
import {Grid} from '@material-ui/core';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { connect } from 'react-redux';



function Vendor({ user }) {
	// const [From, setFrom] = useState([]);
	// const [To, setTo] = useState([]);
	// const [count, setCount] = useState([]);
	// const [page, setPage] = useState([]);
	// const [rowsperpage, setRowsPerPage] = useState([]);
	const history = useHistory();

	async function getData(query) {
		return new Promise(async resolve => {
			JwtService.init();
			const axios = JwtService.getAxios();
			const params = {
				page: query.page,
				// page: ((query.page ==0 )?1:query.page),
				limit: query.pageSize,
				q: query.search
			};
			// setFrom((((query.page ==0 )?1:query.page) * query.pageSize)-query.pageSize+1)
			// setTo((((query.page ==0 )?1:query.page) * query.pageSize))
			// setPage(query.pageSize)
			// setRowsPerPage(query.pageSize);
			if (user.data.role === 'vendor') params.parent_id = user.data.xid;
			else params.parent_id = 0;
			const vendors = await axios.get('/api/admin/vendor', {
				params
			});
			const resp = vendors.data;
			if (resp.status) {
				// setCount(resp.data.total)
				resolve({
					data: resp.data.data, /// your data array
					page: query.page, // current page number
					// page: ((query.page ==0 )?1:query.page), // current page number
					totalCount: resp.data.total // total row number
				});
			} else {
				resolve({
					data: [], /// your data array
					page: 0, // current page number
					totalCount: 10 // total row number
				});
			}
			
		});
	}

	function actions() {
		const actions = [];

		if (['admin', 'it', 'creative', 'alliance'].includes(user.data.role)) {
			actions.push({
				icon: 'visibility',
				tooltip: 'View Vendor',
				onClick: (event, data) => history.push('/vendor/' + data.id+"/about")
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
							title="Vendors"
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
							// components={{
							// 	Pagination: ({from,to,count,page}) => {
							// 	  return <CustomPaginationComponent params={{ From:From,To:To, count:count,page:page }} />;
							// 	}
							//   }}
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

export default connect(mapStateToProps)(Vendor);
