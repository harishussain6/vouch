import React, { useState,useEffect } from 'react';
import JwtService from 'app/services/jwtService';
import { Grid } from '@material-ui/core';
import MaterialTable from 'material-table';
import { useHistory } from 'react-router';
import FusePageSimple from '@fuse/core/FusePageSimple';

import FuseLoading from '@fuse/core/FuseLoading';
import { connect } from 'react-redux';
import axios from 'axios';

function Vendors({ user }) {

	const history = useHistory();
  const [selectedOption, setSelectedOption] = useState(''); // Initial selected option
  const [alldata, setAlldata] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState([]);
  const [loading, setLoading] = useState(false);
	function getData() {
			return new Promise(async resolve => {
				JwtService.init();
				const axios = JwtService.getAxios();
				const params = {
					page: page,
					limit: pageSize,
					q: search
				};
	
				if (user.data.role === 'vendor') params.parent_id = user.data.xid;
				else params.parent_id = 0;
				const vendors = await axios.get('/api/admin/vendor', {
					params
				});
				const resp = vendors.data;
				if(alldata == ''){
					const allparams = {
						limit:resp.data.total,
						q: '',
						parent_id:0
					};
					const allvendors = await axios.get('/api/admin/vendor?limit='+resp.data.total+'&q=&parent_id=0');
					const allresp = allvendors.data;
					setAlldata(allresp.data.data)
				}
				if (resp.status) {
					resolve({
						data: resp.data.data, /// your data array
						page: pageSize, // current page number
						totalCount: resp.data.total // total row number
					})
				} else {
					resolve({
						data: [], /// your data array
						page: 0, // current page number
						totalCount: 0 // total row number
					});
				}
			});
		}
		const fetchData = async () => {
			try {
			  setLoading(true);
			  const result = await getData();
			  // console.log(result.totalCount)
			  setData(result.data);
			  setTotalCount(result.totalCount);

			  // setPage(result.page);
			} catch (error) {
			  console.error('Error fetching data:', error);
			} finally {
			  setLoading(false);
			}
		  };
  useEffect(() => {
	  // Define a function to fetch data
	 

    fetchData(); // Call the fetchData function when selectedOption changes
  }, [selectedOption,page,pageSize]);
  //console.log(data)
	function actions() {
		const actions = [];

		if (['admin', 'it', 'creative', 'alliance'].includes(user.data.role)) {
			actions.push({
				icon: 'visibility',
				tooltip: 'View Vendor',
				onClick: (event, data) => history.push('/vendor/' + data.id + "/about")
			});
		}
		return actions;
	}
 
	const handleOnChange = async(e)=> {
		const selectedOption = e.target.options[e.target.selectedIndex];
		const attributeValue = selectedOption.getAttribute('row-id');
		const value = e.target.value
		
		const res = await axios.put(`/api/admin/vendor/${attributeValue}?status=${value}`)
		if(res.data.status){
			setSelectedOption(prevCount => prevCount + 1);
		}
	}


	  const handlePageChange = (newPage) => {
		setPage(newPage);
	  };
	  
	  const handlePageSizeChange = (newPageSize) => {
		setPageSize(newPageSize);
		setPage(0); // Reset to the first page when changing page size
	  };
	  const handleSearchChange = (search) => {
		setSearch(search);
	  };
	if (loading) {
		return <FuseLoading />;
	}
	return (
		<FusePageSimple
			content={
				<Grid container>
					<Grid item md={12}>
							<MaterialTable
							title="Vendors"
							// data={{ data: data, totalCount: totalCount, page: page}}
							data={data}
							page={page}
							totalCount={totalCount}
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
								},
								{
									title: 'Status',
									field: 'name',
									width: 10,
									render: (data) => (
										<select onChange={handleOnChange} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-[16px] h-40 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
											<option selected disabled>Choose a Status</option>
											<option value="active" row-id={data.id} {...(data.status === 'active' ? { selected: true } : {})}>Active</option>
											<option value="inactive" row-id={data.id} {...(data.status === 'inactive' ? { selected: true } : {})} >In-Active</option>
										</select>
									),
								},

							]}
							actions={actions()}
							options={{
								pageSize: pageSize,
								pageSizeOptions: [10, 20, 50],
								actionsColumnIndex: -1,
								searchable:true,
							}}  
							onChangePage={handlePageChange}
							onChangeRowsPerPage={handlePageSizeChange}
							// onSearchChange={handleSearchChange}
							onSearchChange={(searchText) => {
								const filteredData = alldata.filter((item) =>
								  item.name.toLowerCase().includes(searchText.toLowerCase())
								);
								setData(filteredData);
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
