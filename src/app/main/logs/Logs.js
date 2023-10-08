import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import { Grid, Typography, Paper, Button } from '@material-ui/core';
import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseChipSelect from '@fuse/core/FuseChipSelect';

JwtService.init();
const axios = JwtService.getAxios();

function Logs() {
	const tableRef = React.createRef();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState({});
	const [users, setUsers] = useState([]);

	useEffect(() => {
		if (users.length === 0) {
			async function getUser() {
				axios.get('/api/admin/users').then(res => {
					const data = res.data.data;
					setUsers(data);
				});
			}
			getUser();
		}
	}, [users]);

	async function getData() {
		try {
			setLoading(true);

			const vouchers = await axios.get(`/api/admin/logs?user_id=${search.id}`);
			const resp = vouchers.data;
			if (resp.status) {
				setOrders(resp.data.logs);
			} else {
				setOrders([]);
			}
			setLoading(false);
		} catch (ex) {
			setOrders([]);
			setLoading(false);
		}
	}

	function handleChipChange(value, name) {
		const setValue = Array.isArray(value)
			? value.map(item => ({ id: item.value, name: item.label }))
			: { id: value.value, name: value.label };
		setSearch(setValue);
	}

	return (
		<FusePageSimple
			header={
				<Grid container item justify="flex-end" direction="column" className="pl-12 pb-12">
					<Typography variant="h4">Logs</Typography>
				</Grid>
			}
			content={
				<>
					<Grid container className="p-20" justify="space-between">
						<Grid item md={12} className="mt-8">
							<Paper elevation={4}>
								<Grid container spacing={4} alignItems="center" className="ml-4">
									<Grid item md={6}>
										<FuseChipSelect
											value={{ value: search.id, label: search.name }}
											onChange={value => handleChipChange(value, 'user')}
											textFieldProps={{
												label: 'User',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											options={users.map(city => ({
												value: city.id,
												label: city.name
											}))}
										/>
									</Grid>
									<Grid item>
										<Button
											variant="contained"
											color="primary"
											disabled={!search}
											className="mt-4"
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
								title: 'Name',
								field: 'user.name'
							},
							{
								title: 'Log',
								field: 'log'
							},
							{
								title: 'Time',
								field: 'created_at'
							}
						]}
						isLoading={loading}
						options={{
							pageSize: 10,
							pageSizeOptions: [10, 20, 50],
							actionsColumnIndex: -1,
							showTitle: false,
							overflowY: 'visible',
							headerStyle: {
								zIndex: 0
							},
							exportButton: true
						}}
					/>
				</>
			}
		/>
	);
}

export default Logs;
