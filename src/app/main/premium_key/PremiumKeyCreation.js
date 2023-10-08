import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import { Button, Checkbox, FormControlLabel, Icon, TextField, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import JwtService from 'app/services/jwtService';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import currentDate from 'app/utils/helpers';

const premiumKey = {
	name: '',
	prefix: '',
	multi_voucher: 0,
	no_of_keys: 10,
	act_date: currentDate(),
	exp_date: currentDate(),
	allowed_redemptions: 12,
	children: [],
	partner: {},
	membership: {},
	cities: [],
	type: 'random',
	serial_start: 0,
	add365days: 0,
	all_city_access: 0
};
function CreatePremiumKey({ props }) {
	const [loading, setLoading] = useState(true);
	const [memberships, setMemberships] = useState([]);
	const [partners, setPartners] = useState([]);
	const [cities, setCities] = useState([]);
	const theme = useTheme();
	const { form, handleChange, setForm } = useForm(premiumKey);
	const [errors, setErrors] = useState({});
	const history = useHistory();
	const axios = JwtService.getAxios();

	useEffect(() => {
		if (partners.length > 0 && memberships.length > 0 && cities.length > 0) setLoading(false);
	}, [partners, memberships, cities]);
	useEffect(() => {
		const getData = async () => {
			try {
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
			} catch (error) {
				console.log('error');
				setLoading(false);
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);

	function canBeSubmitted() {
		return form.name.length > 0 && !_.isEqual(premiumKey, form);
	}

	async function onSubmit() {
		try {
			setLoading(true);
			const post = {
				...form,
				city_id: form.cities.map(city => city.id),
				membership_id: form.membership.id,
				partner_id: form.partner.id,
				type: form.type.id ? form.type.id : form.type,
				add365days: form.add365days ? 1 : 0,
				all_city_access: form.all_city_access ? 1 : 0
			};

			const result = await axios.post('/api/admin/premium-key/create', post);

			const res = result.data;
			if (!res.status) {
				setErrors(res.errors);
				setLoading(false);
			} else {
				history.push('/premium_key');
			}
		} catch (error) {
			console.log(error);
		}
	}

	function handleChipChange(value, name) {
		const setValue = Array.isArray(value)
			? value.map(item => ({ id: item.value, name: item.label }))
			: { id: value.value, name: value.label };
		setForm(_.set({ ...form }, name, setValue));
	}

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<FusePageCarded
			classes={{
				toolbar: 'p-0',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				form && (
					<div className="flex flex-1 w-full items-center justify-between">
						<div className="flex flex-col items-start max-w-full">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Typography
									className="normal-case flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/premium_key"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Premium Key Generation</span>
								</Typography>
							</FuseAnimate>
						</div>
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button
								className="whitespace-no-wrap normal-case"
								variant="contained"
								color="secondary"
								disabled={!canBeSubmitted()}
								onClick={onSubmit}
							>
								{'Generate'}
							</Button>
						</FuseAnimate>
					</div>
				)
			}
			content={
				form && (
					<div className="p-16 sm:p-24 max-w-2xl">
						<div>
							<TextField
								className="mt-8 mb-8"
								error={errors['name'] ? true : false}
								helperText={errors['name'] ? errors['name'][0] : ''}
								required
								label="Name"
								id="name"
								name="name"
								value={form.name}
								onChange={handleChange}
								variant="outlined"
								fullWidth
							/>

							<TextField
								className="mt-8 mb-8"
								error={errors['prefix'] ? true : false}
								helperText={errors['prefix'] ? errors['prefix'][0] : ''}
								required
								label="Prefix"
								id="prefix"
								name="prefix"
								value={form.prefix}
								onChange={handleChange}
								variant="outlined"
								fullWidth
							/>

							<TextField
								className="mt-8 mb-8"
								id="multi_voucher"
								error={errors['multi_voucher'] ? true : false}
								helperText={errors['multi_voucher'] ? errors['multi_voucher'][0] : ''}
								name="multi_voucher"
								onChange={handleChange}
								required
								label="Multi Voucher"
								type="numeric"
								value={form.multi_voucher}
								variant="outlined"
								fullWidth
							/>
							<TextField
								className="mt-8 mb-8"
								id="no_of_keys"
								name="no_of_keys"
								onChange={handleChange}
								label="No Of Keys"
								type="numeric"
								value={form.no_of_keys}
								variant="outlined"
								fullWidth
								error={errors['no_of_keys'] ? true : false}
								helperText={errors['no_of_keys'] ? errors['no_of_keys'][0] : ''}
							/>
							<TextField
								className="mt-8 mb-8"
								id="allowed_redemptions"
								name="allowed_redemptions"
								onChange={handleChange}
								label="Allowed Redemptions"
								type="numeric"
								value={form.allowed_redemptions}
								variant="outlined"
								fullWidth
								error={errors['allowed_redemptions'] ? true : false}
								helperText={errors['allowed_redemptions'] ? errors['allowed_redemptions'][0] : ''}
								required
							/>
							<TextField
								className="mt-8 mb-8"
								id="serial_start"
								name="serial_start"
								onChange={handleChange}
								label="Serial Start"
								type="numeric"
								value={form.serial_start}
								variant="outlined"
								fullWidth
								error={errors['serial_start'] ? true : false}
								helperText={errors['serial_start'] ? errors['serial_start'][0] : ''}
								required
							/>
							<FuseChipSelect
								className="mt-8 mb-8"
								value={{
									value: form.type.id ? form.type.id : form.type,
									label: form.type.name ? form.type.name : form.type.toUpperCase()
								}}
								onChange={value => handleChipChange(value, 'type')}
								textFieldProps={{
									label: 'Type',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}}
								options={[
									{ value: 'random', label: 'Random' },
									{ value: 'specific', label: 'Specific' },
									{ value: 'serial', label: 'Serial' }
								]}
								error={errors['serial'] ? true : false}
								helperText={errors['serial'] ? errors['serial'][0] : ''}
							/>

							<FormControlLabel
								control={
									<Checkbox
										checked={form.add365days ? true : false}
										onChange={handleChange}
										name="add365days"
										color="primary"
									/>
								}
								className="mt-8 mb-8"
								label="Add 365 Days"
							/>

							<FormControlLabel
								control={
									<Checkbox
										checked={form.all_city_access ? true : false}
										onChange={handleChange}
										name="all_city_access"
										color="primary"
									/>
								}
								className="mt-8 mb-8"
								label="All Cities Access"
							/>
							<TextField
								className="mt-8 mb-8"
								id="act_date"
								name="act_date"
								onChange={handleChange}
								label="Activation Date"
								type="date"
								value={form.act_date}
								variant="outlined"
								fullWidth
								error={errors['act_date'] ? true : false}
								helperText={errors['act_date'] ? errors['act_date'][0] : ''}
								required
							/>
							<TextField
								className="mt-8 mb-8"
								id="exp_date"
								name="exp_date"
								onChange={handleChange}
								label="Expiry Date"
								type="date"
								value={form.exp_date}
								variant="outlined"
								fullWidth
								error={errors['exp_date'] ? true : false}
								helperText={errors['exp_date'] ? errors['exp_date'][0] : ''}
								required
							/>
							<FuseChipSelect
								className="mt-8 mb-8"
								value={form.cities.map(city => ({ value: city.id, label: city.name }))}
								onChange={value => handleChipChange(value, 'cities')}
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
								isMulti
								error={errors['city_id'] ? true : false}
								helperText={errors['city_id'] ? errors['city_id'][0] : ''}
								required
							/>
							<FuseChipSelect
								className="mt-8 mb-8"
								value={{
									value: form.membership.id,
									label: form.membership.name
								}}
								onChange={value => handleChipChange(value, 'membership')}
								placeholder="Select memberships"
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
								error={errors['membership_ids'] ? true : false}
								helperText={errors['membership_ids'] ? errors['membership_ids'][0] : ''}
								required
							/>
							<FuseChipSelect
								className="mt-8 mb-8"
								value={{
									value: form.partner.id,
									label: form.partner.name
								}}
								onChange={value => handleChipChange(value, 'partner')}
								placeholder="Select partner"
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
								error={errors['partner_id'] ? true : false}
								helperText={errors['partner_id'] ? errors['partner_id'][0] : ''}
								required
							/>
						</div>
					</div>
				)
			}
		/>
	);
}

export default CreatePremiumKey;
