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

function Slides() {
	const [sliders, setSliders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [slider_id, setSliderId] = useState({ value: 1, label: 'top' });
	const [partner_id, setPartnerId] = useState({ value: 1, label: 'vouch365' });
	const [membership_id, setMembershipId] = useState({ value: 1, label: 'free' });
	const [city_id, setCityId] = useState({ value: 1, label: 'karachi' });
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
		const vouchers = await axios.get('/api/admin/slide', {
			params: {
				slider_id: slider_id.value,
				partner_id: partner_id.value,
				city_id: city_id.value,
				membership_id: membership_id.value
			}
		});
		const resp = vouchers.data;
		if (resp.status) {
			setSliders(resp.data.slide);
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

	function isDisabled() {
		return false;
	}

	function handleChipChange(value, name) {
		if (name === 'slider_id') {
			setSliderId(value);
		} else if (name === 'partner_id') {
			setPartnerId(value);
		} else if (name === 'city_id') {
			setCityId(value);
		} else if (name === 'membership_id') {
			setMembershipId(value);
		}
	}

	return (
		<FusePageSimple
			header={
				<Grid container item justify="flex-end" direction="column" className="pl-12 pb-12">
					<Typography variant="h4">Slides</Typography>
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
									<Grid item md={2}>
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
									<Grid item md={2}>
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
									<Grid item md={2}>
										<FuseChipSelect
											className="mt-8 mb-8"
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
											className="mt-8 mb-8"
											value={slider_id}
											onChange={value => handleChipChange(value, 'slider_id')}
											textFieldProps={{
												label: 'Slider Type',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											options={[
												{
													value: 1,
													label: 'Home Top'
												},
												{
													value: 2,
													label: 'Home Bottom'
												},
												{
													value: 3,
													label: 'Home Featured'
												},
												{
													value: 4,
													label: 'Category Top'
												},
												{
													value: 5,
													label: 'Category Bottom'
												},
												{
													value: 6,
													label: 'Category Featured'
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
									title: 'Header',
									field: 'header',
									// render: rowData => <img src={rowData.url} style={{width: 50, borderRadius: '50%'}}/>,
									render: rowData => (
										<a href={rowData.header} target="_blank" rel="noopener noreferrer">
											<img src={rowData.header} alt={rowData.tag} style={{ width: 150 }} />
										</a>
									)
								},
								{
									title: 'Live Date',
									field: 'dtlive'
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

export default Slides;
