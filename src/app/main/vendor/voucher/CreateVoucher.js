import React, { useState, useEffect } from 'react';
import {
	withStyles,
	TextField,
	Button,
	Grid,
	LinearProgress,
	FormHelperText,
	FormControlLabel,
	Icon,
	Typography
} from '@material-ui/core';
import JwtService from 'app/services/jwtService';
import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import { CheckBox } from '@material-ui/icons';
// import fileUpload from 'fuctbase64';
import { useHistory, useParams } from 'react-router';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseLoading from '@fuse/core/FuseLoading';
import { useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Voucher } from './Voucher';

const styles = () => ({});

function CreateVoucher({ handleClick }) {
	const { form, handleChange, setForm } = useForm(null);
	const [voucher, setVoucher] = useState(Voucher);
	const [offers, setOffers] = useState([]);
	const [memberships, setMemberships] = useState([]);
	const [partners, setPartners] = useState([]);
	const [selectLoading, setSelectLoading] = useState(true);
	const [errors, setError] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [disabledSelect, setDisabledSelect]= useState(false)
	const [loading, setLoading] = useState(false);
	const { vendor_id, voucher_id } = useParams();
	const axios = JwtService.getAxios();
	const history = useHistory();
	const theme = useTheme();
	useEffect(() => {
		if ((voucher && !form) || (voucher && form && voucher.id !== form.id)) {
			voucher.vendor_id = vendor_id;
			setForm(voucher);
		}
		// eslint-disable-next-line
	}, [form, voucher, setForm]);

	function canBeSubmitted() {
		return !_.isEqual(voucher, form);
	}

	useEffect(() => {
		if (offers.length > 0 && partners.length > 0 && memberships.length > 0) setSelectLoading(false);
	}, [offers, partners, memberships]);

	useEffect(() => {
		const getData = async () => {
			try {
				if (voucher_id !== 'new') {
					try {
						setLoading(true);
						const res = await axios.get(`/api/admin/voucher/${voucher_id}`);
						if (res.data.status) {
							setVoucher(res.data.data);
							setLoading(false);
						} else {
							setErrorMessage(res.data.message);
							setError(res.data.errors);
							setLoading(false);
						}
					} catch (error) {
						setError(error);
					}
				}
				axios.get('/api/admin/membership').then(res => {
					const data = res.data.data;
					setMemberships(data.membership);
				});
				axios.get('/api/admin/offer').then(res => {
					const data = res.data.data;
					setOffers(data.offers);
				});
				axios.get('/api/admin/partner').then(res => {
					const data = res.data.data;
					setPartners(data.partners);
				});
			} catch (error) {
				setSelectLoading(false);
			}
		};
		getData();
		// eslint-disable-next-line
	}, [open]);

	function dataToPost() {
		const post = {
			...form,
			vendor_id,
			membership_ids: form.memberships.map(membership => membership.id),
			partner_ids: form.partners.map(partner => partner.id),
			offer_ids: form.offer.map(offer => offer.id),
			status: form.status.id ? form.status.id : form.status
		};
		delete post.partners;
		delete post.memberships;
		delete post.offer;
		return post;
	}

	async function add() {
		setLoading(true);
		try {
			const res = await axios.post('/api/admin/voucher', dataToPost());

			if (res.data.status) {
				history.push(`/vendor/${vendor_id}`);
			} else {
				setErrorMessage(res.data.message);
				setError(res.data.errors);
			}
		} catch (error) {
			console.log(error);
			setError(error);
		}
		setLoading(false);
	}
	async function update() {
		const res = await axios.put(`/api/admin/voucher/${voucher_id}`, dataToPost());

		if (res.data.status) {
			history.push(`/vendor/${vendor_id}/vouchers`);
		} else {
			setErrorMessage(res.data.message);
			setError(res.data.errors);
		}
	}

	function onSubmit() {
		if (voucher_id === 'new') add();
		else update();
	}

	function handleChipChange(value, name) {
		// console.log(value);
		const setValue = Array.isArray(value)
			? value.map(item => ({ id: item.value, name: item.label }))
			: { id: value.value, name: value.label };
		setForm(_.set({ ...form }, name, setValue));
	}
	function handleChipChangem(value, name) {
		value.map((data)=>{
			if(data.value == "selectall"){
				console.log(memberships)
				setForm(_.set({ ...form }, name, memberships));
				setDisabledSelect(true)
				
			}else{
				const setValue = Array.isArray(value)
				? value.map(item => ({ id: item.value, name: item.label }))
				: { id: value.value, name: value.label };
			setForm(_.set({ ...form }, name, setValue));
			setDisabledSelect(false)
			}
		})

	}


	function handleDate(date) {
		return date.replace(' 00:00:00', '');
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
									to={`/vendor/${vendor_id}`}
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Voucher</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'New Slide'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Voucher</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
					</div>
				)
			}
			content={
				form && (
					<Grid container className="p-16 sm:p-24 max-w-2xl">
						<Grid item md={12}>
							<FormHelperText error>{errorMessage}</FormHelperText>
						</Grid>
						<Grid item md={12}>
							<TextField
								autoFocus
								margin="dense"
								className="mt-8 mb-8"
								id="name"
								name="name"
								label="Name"
								type="text"
								fullWidth
								value={form.name}
								onChange={handleChange}
								variant="outlined"
								error={errors['name'] ? true : false}
								helperText={errors['name'] ? errors['name'][0] : null}
							/>
						</Grid>
						{/* <Grid item md={12}>
							<TextField
								id="title"
								name="title"
								onChange={handleChange}
								label="Title"
								value={form.title}
								variant="outlined"
								fullWidth
								error={errors['title']}
								helperText={errors['title'] ? errors['title'][0] : ''}
								required
							/>
						</Grid> */}
						<Grid item md={12}>
							<TextField
								autoFocus
								className="mt-8 mb-8"
								margin="dense"
								id="description"
								name="description"
								label="Description"
								type="text"
								fullWidth
								value={form.description}
								onChange={handleChange}
								variant="outlined"
								error={errors['description'] ? true : false}
								helperText={errors['description'] ? errors['description'][0] : null}
							/>
						</Grid>
						{/* <Grid item md={12}>
							<TextField
								className="mt-8 mb-8"
								id="header"
								name="header"
								onChange={headerUpload}
								label="Header"
								type="file"
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								fullWidth
								error={errors['logo']}
								helperText={errors['logo'] ? errors['logo'][0] : ''}
							/>
						</Grid> */}
						<Grid item md={12}>
							<TextField
								className="mt-8 mb-8"
								autoFocus
								margin="dense"
								id="savings"
								name="savings"
								label="Savings"
								type="text"
								fullWidth
								value={form.savings}
								onChange={handleChange}
								variant="outlined"
								error={errors['savings'] ? true : false}
								helperText={errors['savings'] ? errors['savings'][0] : null}
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								className="mt-8 mb-8"
								autoFocus
								margin="dense"
								id="vc_code"
								name="vc_code"
								label="VC Code"
								type="text"
								fullWidth
								value={form.vc_code}
								onChange={handleChange}
								variant="outlined"
								error={errors['vc_code'] ? true : false}
								helperText={errors['vc_code'] ? errors['vc_code'][0] : null}
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								className="mt-8 mb-8"
								autoFocus
								margin="dense"
								id="pos_code"
								name="pos_code"
								label="VC Code"
								type="text"
								fullWidth
								value={form.pos_code}
								onChange={handleChange}
								variant="outlined"
								error={errors['pos_code'] ? true : false}
								helperText={errors['pos_code'] ? errors['pos_code'][0] : null}
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								id="act_date"
								className="mt-8 mb-8"
								name="act_date"
								onChange={handleChange}
								label="Activation Date"
								type="date"
								value={handleDate(form.act_date)}
								variant="outlined"
								fullWidth
								error={errors['act_date']}
								helperText={errors['act_date'] ? errors['act_date'][0] : ''}
								required
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								id="exp_date"
								className="mt-8 mb-8"
								name="exp_date"
								onChange={handleChange}
								label="Expiration Date"
								type="date"
								value={handleDate(form.exp_date)}
								variant="outlined"
								fullWidth
								error={errors['exp_date']}
								helperText={errors['exp_date'] ? errors['exp_date'][0] : ''}
								required
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								className="mt-8 mb-8"
								id="valid_to"
								name="valid_to"
								onChange={handleChange}
								label="Valid to"
								type="time"
								value={form.valid_to}
								variant="outlined"
								fullWidth
								error={errors['valid_to']}
								helperText={errors['valid_to'] ? errors['valid_to'][0] : ''}
							/>
						</Grid>
						<Grid item md={12}>
							<TextField
								id="valid_from"
								name="valid_from"
								onChange={handleChange}
								label="Expiration Date"
								type="time"
								value={form.valid_from}
								variant="outlined"
								fullWidth
								error={errors['valid_from']}
								helperText={errors['valid_from'] ? errors['valid_from'][0] : ''}
							/>
						</Grid>
						<Grid item md={12}>
							<FormControlLabel
								className="ml-4 mt-8 mb-24"
								control={
									<CheckBox
										checked={form.redeem}
										onChange={handleChange}
										name="redeem"
										color="primary"
									/>
								}
								label="Redeem"
							/>
						</Grid>
						<Grid item md={12}>
							<FormControlLabel
								className="ml-4 mt-8 mb-24"
								control={
									<CheckBox
										checked={form.is_percent}
										onChange={handleChange}
										name="is_percent"
										color="primary"
									/>
								}
								label="Is Percent?"
							/>
						</Grid>
						<Grid item md={12}>
							<FuseChipSelect
								className="mt-8 mb-8"
								value={{
									value: typeof form.status !== 'object' ? form.status : form.status.id,
									label:
										typeof form.status !== 'object' ? form.status.toUpperCase() : form.status.name
								}}
								onChange={value => handleChipChange(value, 'status')}
								textFieldProps={{
									label: 'Status',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}}
								options={[
									{ value: 'active', label: 'Active' },
									{ value: 'inactive', label: 'InActive' }
								]}
								error={errors['status']}
								helperText={errors['status'] ? errors['status'][0] : ''}
							/>
						</Grid>
						<Grid item md={12}>
							{selectLoading ? (
								<LinearProgress />
							) : (
								<FuseChipSelect
									className="mt-8 mb-8"
									// value={selectedOptions}
									value={form.memberships.map(membership => ({
										value: membership.id,
										label: membership.name
									}))}
									onChange={value => handleChipChangem(value, 'memberships')}
									placeholder="Select multiple memberships"
									textFieldProps={{
										label: 'Memberships',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									isMulti

									options={[
										(disabledSelect == false)?
										{
										value: 'selectall',
										label: 'Select All',
									  }:'',...memberships.map(membership => ({
										value: membership.id,
										label: membership.name
									}))]}
									// options={filteredOptions}
									error={errors['membership_ids']}
									helperText={errors['membership_ids'] ? errors['membership_ids'][0] : ''}
									required
								/>
							)}
						</Grid>
						<Grid item md={12}>
							{selectLoading ? (
								<LinearProgress />
							) : (
								<FuseChipSelect
									isDisabled
									className="mt-8 mb-8"
									value={form.partners.map(partner => ({
										value: partner.id,
										label: partner.name
									}))}
									onChange={value => handleChipChange(value, 'partners')}
									placeholder="Select multiple partners"
									textFieldProps={{
										label: 'Partners',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									isMulti
									options={partners.map(partner => ({
										value: partner.id,
										label: partner.name
									}))}
									error={errors['partner_ids']}
									helperText={errors['partner_ids'] ? errors['partner_ids'][0] : ''}
									required
								/>
							)}
						</Grid>
						<Grid item md={12}>
							{selectLoading ? (
								<LinearProgress />
							) : (
								<FuseChipSelect
									className="mt-8 mb-8"
									value={form.offer.map(offer => ({
										value: offer.id,
										label: offer.name
									}))}
									onChange={value => handleChipChange(value, 'offer')}
									placeholder="Select multiple Offers"
									textFieldProps={{
										label: 'Offers',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									isMulti
									options={offers.map(offer => ({
										value: offer.id,
										label: offer.name
									}))}
									error={errors['offers']}
									helperText={errors['offers'] ? errors['offers'][0] : ''}
									required
								/>
							)}
						</Grid>
						<Grid container item md={12} justify="flex-end">
							<FuseAnimate animation="transition.slideRightIn" delay={300}>
								<Button
									className="whitespace-no-wrap normal-case"
									variant="contained"
									color="secondary"
									disabled={loading || !canBeSubmitted()}
									onClick={onSubmit}
								>
									{voucher_id === 'new' ? 'Save' : 'Update'}
								</Button>
							</FuseAnimate>
						</Grid>
					</Grid>
				)
			}
		/>
	);
}

export default withStyles(styles)(CreateVoucher);
