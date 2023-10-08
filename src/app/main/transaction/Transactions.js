import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, TextField, Button } from '@material-ui/core';
import FusePageSimple from '@fuse/core/FusePageSimple';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import { connect } from 'react-redux';
// import Add from './Add';
import moment from 'moment-timezone';

function Transaction({ user }) {
	const [toDate, setToDate] = useState(currentDate());
	const [fromDate, setFromDate] = useState(currentDate());
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [disabled, setDisabled] = useState(true);

	function currentDate() {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		return yyyy + '-' + mm + '-' + dd;
	}

	useEffect(() => {
		// eslint-disable-next-line
		if (loading) setDisabled(false);
	}, [loading]);
	useEffect(() => {
		if (toDate && fromDate) data();
		// eslint-disable-next-line
	}, []);

	function onChange(event) {
		const target = event.target;
		if (target.name === 'toDate') {
			setToDate(target.value);
		} else {
			setFromDate(target.value);
		}
	}

	async function data() {
		setLoading(true);
		const axios = JwtService.getAxios();

		const params = {
			date_from: fromDate,
			date_to: toDate
		};

		const transactions = await axios.get('/api/transaction', {
			params
		});
		const resp = transactions.data;
		setLoading(false);
		return setTransactions(resp.data);
	}

	// function Action(props) {
	// 	switch (props.action.icon) {
	// 		case 'save':
	// 			return user.data.role === 'marketing' ? <></> : <Add reload={data} />;
	// 		default:
	// 			return <></>;
	// 	}
	// }

	function getColumns() {
		const column = [
			{
				title: 'ID',
				field: 'id'
			},
			{
				title: 'User Name',
				field: 'user_name'
			}
		];

		return [
			...column,
			{
				title: 'email',
				field: 'user_email'
			},
			{
				title: 'Phone',
				field: 'user_phone'
			},
			{
				title: 'Product',
				field: 'product_title'
			},
			{
				title: 'City',
				field: 'product_city'
			},
			{
				title: 'Amount',
				field: 'product_amount'
			},
			{
				title: 'Transaction ID',
				field: 'transaction_id'
			},
			{
				title: 'Order ID',
				field: 'order_id'
			},
			{
				title: 'Provider',
				field: 'provider'
			},
			{
				title: 'Time',
				field: 'created_at',
				render: rowData => {
					const date = moment(rowData.created_at).tz('Asia/Karachi');
					return date.format('MMMM Do YYYY (h:mm a)');
				}
			}
		];
	}

	return (
		<FusePageSimple
			header={
				<Grid container item justify="flex-end" direction="column" className="pl-12 pb-12">
					<Typography variant="h4">Transactions</Typography>
				</Grid>
			}
			content={
				<Grid container className="p-20" justify="space-between">
					<Grid item md={12} className="mt-8">
						<Paper elevation={4}>
							<Grid container spacing={4} alignItems="center" className="ml-4">
								<Grid item md={3}>
									<TextField
										id="from"
										name="fromDate"
										label="From"
										type="date"
										InputLabelProps={{
											shrink: true
										}}
										fullWidth
										variant="outlined"
										onChange={onChange}
										required
									/>
								</Grid>
								<Grid item md={3}>
									<TextField
										id="to"
										name="toDate"
										label="To"
										type="date"
										InputLabelProps={{
											shrink: true
										}}
										fullWidth
										variant="outlined"
										onChange={onChange}
										required
									/>
								</Grid>

								<Grid item>
									<Button
										variant="contained"
										color="primary"
										disabled={disabled}
										className="mt-6"
										onClick={data}
									>
										Search
									</Button>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
					<Grid item className="mt-28" md={12}>
						<MaterialTable
							title="Transactions"
							data={transactions}
							isLoading={loading}
							columns={getColumns()}
							actions={[
								{
									icon: 'save',
									isFreeAction: true,
									onClick: () => {}
								}
							]}
							options={{
								pageSize: 10,
								pageSizeOptions: [10, 20, 50],
								actionsColumnIndex: -1,
								exportButton: true,
								exportAllData: true
							}}
							// components={{
							// 	Action
							// }}
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

export default connect(mapStateToProps)(Transaction);
