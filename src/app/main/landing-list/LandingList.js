import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import JwtService from 'app/services/jwtService';
import Add from './Add';
import Edit from './Edit';
import { Grid, Typography, Paper, Button, LinearProgress } from '@material-ui/core';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import FusePageSimple from '@fuse/core/FusePageSimple';
JwtService.init();
const axios = JwtService.getAxios();

function LandingList() {
	const tableRef = React.createRef();
	const [sliders, setSliders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [partner_id, setPartnerId] = useState({ value: 1, label: 'vouch365' });
	const [membership_id, setMembershipId] = useState({ value: 1, label: 'free' });
	const [memberships, setMemberships] = useState([]);
	const [partners, setPartners] = useState([]);
	const [selectLoading, setSelectLoading] = useState(false);
	useEffect(() => {
		if (!selectLoading) getOptions();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (partners.length > 0 && memberships.length > 0) setSelectLoading(false);
	}, [partners, memberships]);

	function getOptions() {
		setSelectLoading(true);
		axios.get('/api/admin/membership').then(res => {
			const data = res.data.data;
			setMemberships(data.membership);
		});
		axios.get('/api/admin/partner').then(res => {
			const data = res.data.data;
			setPartners(data.partners);
		});
	}

	async function getData() {
		setLoading(true);
		const axios = JwtService.getAxios();
		const vouchers = await axios.get('/api/admin/landingList', {
			params: {
				partner_id: partner_id.value,
				membership_id: membership_id.value
			}
		});
		const resp = vouchers.data;
		if (resp.status) {
			setSliders(resp.data.landingList);
		} else {
			setSliders([]);
		}
		setLoading(false);
	}
	function reload() {
		return getData();
	}

	function Action({ action, data }) {
		switch (action.icon) {
			case 'save':
				return <Add reload={reload} />;
			case 'edit':
				return <Edit reload={reload} slide_id={data.id ? data.id : null} />;
			default:
				return <></>;
		}
	}

	function handleChipChange(value, name) {
		if (name === 'partner_id') {
			setPartnerId(value);
		} else if (name === 'membership_id') {
			setMembershipId(value);
		}
	}

	function isDisabled() {
		return false;
	}
	return (
		<FusePageSimple
			header={
				<Grid container item justify="flex-end" direction="column" className="pl-12 pb-12">
					<Typography variant="h4">LandingList</Typography>
				</Grid>
			}
			content={
				<Grid container className="p-20" justify="space-between">
					<Grid item md={12} className="mt-8">
						<Paper elevation={4}>
							{selectLoading ? (
								<LinearProgress />
							) : (
								<Grid container spacing={4} alignItems="center" className="ml-4">
									<Grid item md={4}>
										<FuseChipSelect
											className="mt-8 mb-8"
											value={membership_id}
											onChange={value => handleChipChange(value, 'membership_id')}
											placeholder="Select membership"
											textFieldProps={{
												label: 'Memberships',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											options={memberships.map(membership => ({
												value: membership.id,
												label: membership.name
											}))}
											required
										/>
									</Grid>
									<Grid item md={4}>
										<FuseChipSelect
											className="mt-8 mb-8"
											value={partner_id}
											onChange={value => handleChipChange(value, 'partner_id')}
											placeholder="Select multiple partners"
											textFieldProps={{
												label: 'Partners',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											options={partners.map(partner => ({
												value: partner.id,
												label: partner.name
											}))}
											required
										/>
									</Grid>
									<Grid item>
										<Button
											variant="contained"
											className="mb-23"
											color="primary"
											disabled={isDisabled()}
											onClick={getData}
										>
											Search
										</Button>
									</Grid>
								</Grid>
							)}
						</Paper>
					</Grid>
					<Grid item md={12} className="mt-28">
						<MaterialTable
							data={sliders}
							ref={tableRef}
							columns={[
								{
									title: 'Tag',
									field: 'tag'
								},
								{
									title: 'Status',
									field: 'status'
								},
								{
									title: 'Link Type',
									field: 'linktype'
								},
								{
									title: 'Link',
									field: 'link'
								},
								{
									title: 'Logo',
									field: 'logo',
									// render: rowData => <img src={rowData.url} style={{width: 50, borderRadius: '50%'}}/>,
									render: rowData => (
										<a href={rowData.logo} target="_blank" rel="noopener noreferrer">
											<img src={rowData.logo} alt={rowData.tag} style={{ width: 150 }} />
										</a>
									)
								},
								{
									title: 'Background',
									field: 'background',
									// render: rowData => <img src={rowData.url} style={{width: 50, borderRadius: '50%'}}/>,
									render: rowData => (
										<a href={rowData.background} target="_blank" rel="noopener noreferrer">
											<img src={rowData.background} alt={rowData.tag} style={{ width: 150 }} />
										</a>
									)
								}
							]}
							isLoading={loading}
							actions={[
								{
									icon: 'save',
									isFreeAction: true,
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
					</Grid>
				</Grid>
			}
		/>
	);
}

export default LandingList;
