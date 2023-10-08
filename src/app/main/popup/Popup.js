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

function Popups() {
	const tableRef = React.createRef();
	const [sliders, setSliders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [flavor, setFlavor] = useState({ value: 1, label: 'Retail' });
	const [partner_id, setPartnerId] = useState({ value: 1, label: 'Vouch365' });
	const [membership_id, setMembershipId] = useState({ value: 1, label: 'Free' });
	const [city_id, setCityId] = useState({ value: 1, label: 'Karachi' });
	const [memberships, setMemberships] = useState([]);
	const [partners, setPartners] = useState([]);
	const [cities, setCities] = useState([]);
	const [selectLoading, setSelectLoading] = useState(false);
	useEffect(() => {
		if (!selectLoading) getOptions();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (partners.length > 0 && memberships.length > 0 && cities.length > 0) setSelectLoading(false);
	}, [partners, memberships, cities]);

	function getOptions() {
		setSelectLoading(true);
		axios.get('/api/admin/city').then(res => {
			const data = res.data.data;
			setCities(data.cities);
		});
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
		const vouchers = await axios.get('/api/admin/popup', {
			params: {
				flavor: flavor.value,
				partner_id: partner_id.value,
				city_id: city_id.value,
				membership_id: membership_id.value
			}
		});
		const resp = vouchers.data;
		if (resp.status) {
			setSliders(resp.data.popup);
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
		if (name === 'flavor') {
			setFlavor(value);
		} else if (name === 'partner_id') {
			setPartnerId(value);
		} else if (name === 'city_id') {
			setCityId(value);
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
					<Typography variant="h4">Popups</Typography>
				</Grid>
			}
			content={
				<Grid container className="p-16" justify="space-between">
					<Grid item md={12} className="mt-8">
						<Paper elevation={4}>
							{selectLoading ? (
								<LinearProgress />
							) : (
								<Grid container spacing={4} alignItems="center" className="ml-4">
									<Grid item md={2}>
										<FuseChipSelect
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
									<Grid item md={2}>
										<FuseChipSelect
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
									<Grid item md={2}>
										<FuseChipSelect
											value={city_id}
											onChange={value => handleChipChange(value, 'city_id')}
											textFieldProps={{
												label: 'City',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											options={cities.map(city => ({
												value: city.id,
												label: city.name
											}))}
											required
										/>
									</Grid>
									<Grid item md={2}>
										<FuseChipSelect
											value={flavor}
											onChange={value => handleChipChange(value, 'flavor')}
											textFieldProps={{
												label: 'Flavor',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											options={[
												{
													value: 1,
													label: 'Retail'
												},
												{
													value: 2,
													label: 'Gold'
												},
												{
													value: 3,
													label: 'Fusion'
												},
												{
													value: 4,
													label: 'Landing'
												}
											]}
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
									title: 'Title',
									field: 'title'
								},
								{
									title: 'Flavor',
									field: 'flavor'
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
									title: 'Image',
									field: 'image',
									// render: rowData => <img src={rowData.url} style={{width: 50, borderRadius: '50%'}}/>,
									render: rowData => (
										<a href={rowData.image} target="_blank" rel="noopener noreferrer">
											<img src={rowData.image} alt={rowData.link} style={{ width: 150 }} />
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

export default Popups;
