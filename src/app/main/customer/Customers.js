import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import Edit from './Edit';
import { Grid, Typography, Paper, TextField, Button } from '@material-ui/core';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseChipSelect from '@fuse/core/FuseChipSelect';

function Customers() {
	const tableRef = React.createRef();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState(null);
	const [corporateApps, setCorporateApps] = useState([]);
	const [corporateApp, setCorporateApp] = useState({ value: 0, label: 'Vouch Main' });

	useEffect(() => {
		getCorporateApps();
	}, []);

	async function getData() {
		try {
			setLoading(true);
			JwtService.init();
			const axios = JwtService.getAxios();
			const vouchers = await axios.get('/api/admin/search-customer', {
				params: {
					query_param: search,
					corporate_app: corporateApp.value
				}
			});
			const resp = vouchers.data;
			if (resp.status) {
				setOrders(resp.data);
			} else {
				setOrders([]);
			}
			setLoading(false);
		} catch (ex) {
			setOrders([]);
			setLoading(false);
		}
	}

	async function getCorporateApps() {
		try {
			setLoading(true);
			JwtService.init();
			const axios = JwtService.getAxios();
			const vouchers = await axios.get('/api/admin/corporateApp');
			const resp = vouchers.data;
			if (resp.status) {
				setCorporateApps([{ id: 0, name: 'Vouch Main' }, ...resp.data.corporate_app]);
			} else {
				setCorporateApps([]);
			}
			setLoading(false);
		} catch (ex) {
			setCorporateApps([]);
			setLoading(false);
		}
	}

	function reload() {
		return getData();
	}

	function Action({ action, data }) {
		switch (action.icon) {
			case 'view':
				return (
					<Edit
						reload={reload}
						slide_id={data.id ? data.id : null}
						corporate_app={corporateApp.value}
						is_view={true}
					/>
				);
			default:
				return <></>;
		}
	}

	function onChange(event) {
		const target = event.target;
		setSearch(target.value);
	}

	function handleChange(value) {
		console.log(value);
		setCorporateApp(value);
	}

	function onKeyPress(event) {
		if (event.key === 'Enter' && search) {
			getData();
		}
	}

	return (
		<FusePageSimple
			header={
				<Grid container item justify="flex-end" direction="column" className="pl-12 pb-12">
					<Typography variant="h4">Customers</Typography>
				</Grid>
			}
			content={
				<>
					<Grid container className="p-20" alignItems="baseline">
						<Grid item md={12} className="mt-8">
							<Paper elevation={4}>
								<Grid container spacing={4} alignItems="center" className="ml-12">
									<Grid item md={4}>
										<TextField
											id="search"
											name="search"
											label="Search Query"
											InputLabelProps={{
												shrink: true
											}}
											helperText="Search with email, mobile number and premium key"
											fullWidth
											variant="outlined"
											onChange={onChange}
											onKeyPress={onKeyPress}
											required
										/>
									</Grid>
									<Grid item md={4} className="mb-12">
										<FuseChipSelect
											className="mt-8 mb-8"
											value={corporateApp}
											onChange={value => handleChange(value)}
											textFieldProps={{
												label: 'App Name',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											options={corporateApps.map(corporateApp => ({
												value: corporateApp.id,
												label: corporateApp.name
											}))}
											fullWidth
										/>
									</Grid>
									<Grid item md={4} className="mb-12">
										<Button
											variant="contained"
											color="primary"
											disabled={!search}
											className="mt-6"
											onClick={getData}
										>
											Search
										</Button>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
					<MaterialTable
						data={orders}
						ref={tableRef}
						columns={[
							{
								title: 'First Name',
								field: 'fname'
							},
							{
								title: 'Last Name',
								field: 'lname'
							},
							{
								title: 'Email',
								field: 'email'
							},
							{
								title: 'Phone',
								field: 'phone'
							},
							{
								title: 'Membership',
								field: 'membership.name'
							}
						]}
						isLoading={loading}
						actions={[
							{
								icon: 'view',
								onClick: () => {}
							}
						]}
						options={{
							pageSize: 10,
							pageSizeOptions: [10, 20, 50],
							actionsColumnIndex: -1,
							showTitle: false,
							overflowY: 'visible',
							headerStyle: {
								zIndex: 0
							}
						}}
						components={{
							Action
						}}
					/>
				</>
			}
		/>
	);
}

export default Customers;
