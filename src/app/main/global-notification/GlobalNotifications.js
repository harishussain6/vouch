import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import { Grid, Typography } from '@material-ui/core';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useHistory } from 'react-router';

JwtService.init();
const axios = JwtService.getAxios();

function GlobalNotifications() {
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

			const vouchers = await axios.get(`/api/admin/global-notifications`);
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
					<Typography variant="h4">Global Notifications</Typography>
				</Grid>
			}
			content={
				<>
					<MaterialTable
						data={keys}
						ref={tableRef}
						columns={[
							{
								title: 'Title',
								field: 'title'
							},
							{
								title: 'Message',
								field: 'message'
							},
							{
								title: 'City',
								field: 'city_name'
							},
							{
								title: 'Membersip',
								field: 'membership_name'
							},
							{
								title: 'User',
								field: 'user.name'
							},
							{
								title: 'Image',
								field: 'image',
								render: rowData => {
									if (!rowData.image) return <></>;
									return (
										<a href={rowData.image} target="_blank" rel="noopener noreferrer">
											<img src={rowData.image} alt={rowData.title} style={{ width: 150 }} />
										</a>
									);
								}
							},
							{
								title: 'Created At',
								field: 'created_at'
							}
						]}
						isLoading={loading}
						actions={[
							{
								icon: 'add',
								isFreeAction: true,
								onClick: () => {
									history.push('/global-notification');
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
							}
						}}
					/>
				</>
			}
		/>
	);
}

export default GlobalNotifications;
