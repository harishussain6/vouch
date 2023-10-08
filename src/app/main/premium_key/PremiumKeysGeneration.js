import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import { Grid, Typography } from '@material-ui/core';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useHistory } from 'react-router';
import moment from 'moment-timezone';

JwtService.init();
const axios = JwtService.getAxios();

function PremiumKeysGeneration() {
	const tableRef = React.createRef();
	const [keys, setKeys] = useState([]);
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	useEffect(() => {
		getData();
	}, []);

	async function getData() {
		try {
			setLoading(true);

			const vouchers = await axios.get(`/api/admin/premium-keys`);
			const resp = vouchers.data;
			if (resp.status) {
				setKeys(resp.data);
			} else {
				setKeys([]);
			}
			setLoading(false);
		} catch (ex) {
			setKeys([]);
			setLoading(false);
		}
	}

	return (
		<FusePageSimple
			header={
				<Grid container item justify="flex-end" direction="column" className="pl-12 pb-12">
					<Typography variant="h4">Premium Key Generation History</Typography>
				</Grid>
			}
			content={
				<>
					<MaterialTable
						data={keys}
						ref={tableRef}
						columns={[
							{
								title: 'Key Name',
								field: 'key_name'
							},
							{
								title: 'No of Keys',
								field: 'no_of_keys'
							},
							{
								title: 'File name',
								field: 'file_name',
								render: rowData => (
									<a href={rowData.file_name} target="_blank" rel="noopener noreferrer">
										Download
									</a>
								)
							},
							{
								title: 'Created At',
								field: 'created_at',
								render: rowData => {
									const date = moment(rowData.created_at).tz('Asia/Karachi');
									return date.format('MMMM Do YYYY (h:mm a)');
								}
							}
						]}
						isLoading={loading}
						actions={[
							{
								icon: 'add',
								isFreeAction: true,
								onClick: () => {
									history.push('/premium_key/create');
								}
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
							},
							exportButton: true
						}}
					/>
				</>
			}
		/>
	);
}

export default PremiumKeysGeneration;
