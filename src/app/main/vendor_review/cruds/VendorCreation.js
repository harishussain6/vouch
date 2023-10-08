import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import { Checkbox, FormControlLabel, Button, Icon, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import JwtService from 'app/services/jwtService';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Vendor } from './Vendor';
import fileUpload from 'fuctbase64';
import { UserContext } from 'app/context/UserContext';

function getSelectedTab(user) {
	return user.user_type === 'creative' ? 5 : 0;
}

function CreateVendor({ props }) {
	const [vendor, setVendor] = useState(Vendor);
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState([]);
	const [amenities, setAmenities] = useState([]);
	const [memberships, setMemberships] = useState([]);
	const [partners, setPartners] = useState([]);
	const [cities, setCities] = useState([]);
	const theme = useTheme();

	const { form, handleChange, setForm } = useForm(null);
	const [errors, setErrors] = useState({});
	const routeParams = useParams();
	const history = useHistory();
	const axios = JwtService.getAxios();
	const { id } = routeParams;
	const userContext = useContext(UserContext);
	const [tabValue, setTabValue] = useState(getSelectedTab(userContext.user));
	useEffect(() => {
		if (
			categories.length > 0 &&
			amenities.length > 0 &&
			partners.length > 0 &&
			memberships.length > 0 &&
			cities.length > 0
		) {
			if (id !== 'new') mappedData();
			setLoading(false);
		}
		// eslint-disable-next-line
	}, [categories, amenities, partners, memberships, cities]);
	useEffect(() => {
		const getData = async () => {
			try {
				if (id !== 'new') {
					const res = await axios.get('/api/admin/vendor-review/' + id);
					const data = res.data.data;
					setVendor(data);
				}
				axios.get('/api/admin/category').then(res => {
					const data = res.data.data;
					setCategories(data.category);
				});
				axios.get('/api/admin/city').then(res => {
					const data = res.data.data;
					setCities(data.cities);
				});
				axios.get('/api/admin/membership').then(res => {
					const data = res.data.data;
					const membership = [{ id: 0, name: 'All' }];
					setMemberships([...membership, ...data.membership]);
				});
				axios.get('/api/admin/amenity').then(res => {
					const data = res.data.data;
					setAmenities(data.amenities);
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

	useEffect(() => {
		if ((vendor && !form) || (vendor && form && vendor.id !== form.id)) {
			console.log(vendor);
			setForm(vendor);
		}
	}, [form, vendor, setForm]);

	function mappedData() {
		const mappedVendor = vendor;
		mappedVendor['category'] = mappedVendor.category_id
			? categories.find(category => category.id === vendor.category_id)
			: {};
		mappedVendor['city'] = mappedVendor.city_id ? cities.find(category => category.id === vendor.city_id) : {};
		mappedVendor['memberships'] = mappedVendor.membership_ids
			? memberships.filter(category =>
					vendor.membership_ids
						.split(',')
						.map(value => parseInt(value))
						.includes(category.id)
			  )
			: [];
		mappedVendor['partners'] = mappedVendor.partner_ids
			? partners.filter(category =>
					vendor.partner_ids
						.split(',')
						.map(value => parseInt(value))
						.includes(category.id)
			  )
			: [{ id: 1, name: 'vouch365' }];
		mappedVendor['amenities'] = mappedVendor.amenities
			? amenities.filter(category =>
					vendor.amenities
						.split(',')
						.map(value => parseInt(value))
						.includes(category.id)
			  )
			: [];
		console.log(mappedVendor);
		setVendor(mappedVendor);
	}
	function handleChangeTab(event, value) {
		console.log(value);
		setTabValue(value);
	}

	function handleChipChange(value, name) {
		let setValue = Array.isArray(value)
			? value.map(item => ({ id: item.value, name: item.label }))
			: { id: value.value, name: value.label };

		if (name === 'memberships' && Array.isArray(value)) {
			const hasAll = value.find(item => item.value === 0);
			console.log(hasAll, 'hasAll');
			if (hasAll) {
				setValue = memberships.filter(item => item.id !== 0).map(item => ({ id: item.id, name: item.name }));
			}
		}
		setForm(_.set({ ...form }, name, setValue));
	}

	function canBeSubmitted() {
		return form.name.length > 0 && !_.isEqual(vendor, form);
	}

	function headerUpload(files) {
		fileUpload(files).then(data => {
			setForm(_.set({ ...form }, `header`, `data:${data.type};base64,${data.base64}`));
		});
	}

	async function logoUpload(files) {
		fileUpload(files).then(data => {
			setForm(_.set({ ...form }, `logo`, `data:${data.type};base64,${data.base64}`));
		});
	}

	async function onSubmit() {
		try {
			setLoading(true);

			const obj = {};

			Object.keys(form).forEach(key => {
				if (form[key]) {
					if (key === 'amenities') {
						if (form[key].length > 0) obj[key] = form[key].map(amunity => amunity.id).join(',');
						else {
							delete obj[key];
						}
					} else if (key === 'memberships' && form[key].length > 0) {
						obj['membership_ids'] = form[key].map(amunity => amunity.id).join(',');
					} else if (key === 'partners' && form[key].length > 0) {
						obj['partner_ids'] = form[key].map(amunity => amunity.id).join(',');
					} else if (key === 'city') {
						obj['city_id'] = form[key].id;
					} else if (key === 'category') {
						obj['category_id'] = form[key].id;
					} else {
						obj[key] = form[key];
					}
				}
			});
			const post = {
				...obj,
				status: form.status.id ? form.status.id : form.status,
				pingable: obj.pingable ? 1 : 0,
				mkt: obj.mkt ? 1 : 0,
				featured_social: obj.featured_social ? 1 : 0,
				featured_website: obj.featured_website ? 1 : 0,
				has_pos: obj.has_pos ? 1 : 0,
				redeemed: obj.redeemed ? 1 : 0,
				is_live: obj.is_live ? 1 : 0,
				is_live_corporate: obj.is_live_corporate ? 1 : 0,
				is_live_retails: obj.is_live_retails ? 1 : 0
			};

			const result =
				id === 'new'
					? await axios.post('/api/admin/vendor-review', post)
					: await axios.put(`/api/admin/vendor-review/${form.id}`, post);
			const res = result.data;
			if (!res.status) {
				setErrors(res.errors);
				setLoading(false);
			} else {
				history.push('/vendor_review');
			}
		} catch (error) {
			console.log(error);
		}
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
									to="/vendor_review"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Vendor Review</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									<img className="w-32 sm:w-48 rounded" src={form.logo} alt={form.name} />
								</FuseAnimate>
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'New Vendor Review'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Vendor Detail</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
						<FuseAnimate animation="transition.slideRightIn" delay={300}>
							<Button
								className="whitespace-no-wrap normal-case"
								variant="contained"
								color="secondary"
								disabled={!canBeSubmitted()}
								onClick={onSubmit}
							>
								{id === 'new' ? 'Save' : 'Update'}
							</Button>
						</FuseAnimate>
					</div>
				)
			}
			contentToolbar={
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					classes={{ root: 'w-full h-64' }}
				>
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Basic Info" />
					) : (
						<></>
					)}
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Location" />
					) : (
						<></>
					)}
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Marketing Options" />
					) : (
						<></>
					)}
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Memberships" />
					) : (
						<></>
					)}
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Partners" />
					) : (
						<></>
					)}
					<Tab className="h-64 normal-case" label="Images" />
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Make It Live" />
					) : (
						<></>
					)}
				</Tabs>
			}
			content={
				form && (
					<div className="p-16 sm:p-24 max-w-2xl">
						{tabValue === 0 && (
							<div>
								<TextField
									className="mt-8 mb-8"
									error={errors['name'] ? true : false}
									helperText={errors['name'] ? errors['name'][0] : ''}
									required
									label="Name"
									id="name"
									name="name"
									value={form.name ?? ''}
									onChange={handleChange}
									variant="outlined"
									fullWidth
								/>

								<TextField
									className="mt-8 mb-8"
									id="description"
									error={errors['description'] ? true : false}
									helperText={errors['description'] ? errors['description'][0] : ''}
									name="description"
									onChange={handleChange}
									required
									label="Description"
									type="text"
									value={form.description ?? ''}
									multiline
									rows={5}
									variant="outlined"
									fullWidth
								/>

								<FuseChipSelect
									className="mt-8 mb-8"
									value={{ value: form.category.id, label: form.category.name }}
									onChange={value => handleChipChange(value, 'category')}
									textFieldProps={{
										label: 'Categories',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									options={categories.map(category => ({
										value: category.id,
										label: category.name
									}))}
									error={errors['category_id']}
									helperText={errors['category_id'] ? errors['category_id'][0] : ''}
									required
								/>
								<TextField
									className="mt-8 mb-8"
									id="qrc"
									name="qrc"
									onChange={handleChange}
									label="QRC"
									type="text"
									value={form.qrc ?? ''}
									variant="outlined"
									fullWidth
									error={errors['qrc']}
									helperText={errors['qrc'] ? errors['qrc'][0] : ''}
								/>
								<TextField
									className="mt-8 mb-8"
									id="email"
									name="email"
									onChange={handleChange}
									label="Email"
									type="email"
									value={form.email ?? ''}
									variant="outlined"
									fullWidth
									error={errors['email'] ? true : false}
									helperText={errors['email'] ? errors['email'][0] : ''}
									required
								/>
								<TextField
									className="mt-8 mb-8"
									id="pw"
									name="pw"
									onChange={handleChange}
									label="Password"
									value={form.pw ?? ''}
									variant="outlined"
									fullWidth
									error={errors['pw'] ? true : false}
									helperText={errors['pw'] ? errors['pw'][0] : ''}
									required
								/>
								<TextField
									className="mt-8 mb-8"
									id="pin"
									name="pin"
									onChange={handleChange}
									label="Pin"
									type="number"
									value={form.pin ?? ''}
									variant="outlined"
									fullWidth
									error={errors['pin'] ? true : false}
									helperText={errors['pin'] ? errors['pin'][0] : ''}
									required
								/>
								<FuseChipSelect
									className="mt-8 mb-8"
									value={{
										value: form.status.id ? form.status.id : form.status,
										label: form.status.name ? form.status.name : form.status.toUpperCase()
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
									error={errors['status'] ? true : false}
									helperText={errors['status'] ? errors['status'][0] : ''}
								/>
								<TextField
									className="mt-8 mb-8"
									id="mupd_id"
									name="mupd_id"
									onChange={handleChange}
									label="Mupd Id"
									type="number"
									value={form.mupd_id ? form.mupd_id : ''}
									variant="outlined"
									fullWidth
									error={errors['mupd_id'] ? true : false}
									helperText={errors['mupd_id'] ? errors['mupd_id'][0] : ''}
								/>
								<TextField
									className="mt-8 mb-8"
									id="livedt"
									name="livedt"
									onChange={handleChange}
									label="Live Date"
									type="date"
									value={form.livedt}
									variant="outlined"
									fullWidth
									error={errors['livedt'] ? true : false}
									helperText={errors['livedt'] ? errors['livedt'][0] : ''}
									required
								/>
								<TextField
									className="mt-8 mb-8"
									id="phone"
									name="phone"
									onChange={handleChange}
									label="Phone"
									value={form.phone ?? ''}
									variant="outlined"
									fullWidth
									error={errors['phone'] ? true : false}
									helperText={errors['phone'] ? errors['phone'][0] : ''}
									required
								/>

								<TextField
									className="mt-8 mb-8"
									id="promo_pts"
									name="promo_pts"
									onChange={handleChange}
									label="Promo Points"
									type="number"
									value={form.promo_pts}
									variant="outlined"
									fullWidth
									error={errors['promo_pts'] ? true : false}
									helperText={errors['promo_pts'] ? errors['promo_pts'][0] : ''}
									required
								/>
								<FuseChipSelect
									className="mt-8 mb-8"
									value={form.amenities.map(amenity => ({
										value: amenity.id,
										label: amenity.name
									}))}
									onChange={value => handleChipChange(value, 'amenities')}
									placeholder="Select multiple Amenities"
									textFieldProps={{
										label: 'Amenities',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									isMulti
									options={amenities.map(amenity => ({
										value: amenity.id,
										label: amenity.name
									}))}
									error={errors['amenities.0'] ? true : false}
									helperText={errors['amenities.0'] ? errors['amenities.0'][0] : ''}
									required
								/>
							</div>
						)}
						{tabValue === 1 && (
							<div>
								<FuseChipSelect
									className="mt-8 mb-8"
									value={{ value: form.city.id, label: form.city.name }}
									onChange={value => handleChipChange(value, 'city')}
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
									error={errors['city_id.0'] ? true : false}
									helperText={errors['city_id.0'] ? errors['city_id.0'][0] : ''}
									required
								/>
								<TextField
									className="mt-8 mb-8"
									id="locality"
									name="locality"
									onChange={handleChange}
									label="Locality"
									type="text"
									value={form.locality ?? ''}
									multiline
									rows={2}
									variant="outlined"
									fullWidth
									error={errors['locality'] ? true : false}
									helperText={errors['locality'] ? errors['locality'][0] : ''}
									required
								/>
								<TextField
									className="mt-8 mb-8"
									id="address"
									name="address"
									onChange={handleChange}
									label="Address"
									type="text"
									value={form.address ?? ''}
									variant="outlined"
									fullWidth
									error={errors['address'] ? true : false}
									helperText={errors['address'] ? errors['address'][0] : ''}
									required
								/>
								<TextField
									className="mt-8 mb-8"
									id="latitude"
									name="latitude"
									onChange={handleChange}
									label="Latitude"
									type="text"
									value={form.latitude ?? ''}
									variant="outlined"
									fullWidth
									error={errors['latitude'] ? true : false}
									helperText={errors['latitude'] ? errors['latitude'][0] : ''}
									required
								/>
								<TextField
									className="mt-8 mb-8"
									id="longitude"
									name="longitude"
									onChange={handleChange}
									label="Longitude"
									type="text"
									value={form.longitude ?? ''}
									variant="outlined"
									fullWidth
									error={errors['longitude'] ? true : false}
									helperText={errors['longitude'] ? errors['longitude'][0] : ''}
									required
								/>
							</div>
						)}
						{tabValue === 2 && (
							<div>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.has_pos ? true : false}
											onChange={handleChange}
											name="has_pos"
											color="primary"
										/>
									}
									label="HAS POS"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.redeem ? true : false}
											onChange={handleChange}
											name="redeem"
											color="primary"
										/>
									}
									label="Redeem"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.pingable ? true : false}
											onChange={handleChange}
											name="pingable"
											color="primary"
										/>
									}
									label="Pingable"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.mkt ? true : false}
											onChange={handleChange}
											name="mkt"
											color="primary"
										/>
									}
									label="Marketing"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.featured_social ? true : false}
											onChange={handleChange}
											name="featured_social"
											color="primary"
										/>
									}
									label="Social Featured"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.featured_website ? true : false}
											onChange={handleChange}
											name="featured_website"
											color="primary"
										/>
									}
									label="Website Featured"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.dinein}
											onChange={handleChange}
											name="dinein"
											color="primary"
										/>
									}
									label="Dine-In"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.takeaway}
											onChange={handleChange}
											name="takeaway"
											color="primary"
										/>
									}
									label="Takeaway"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.delivery}
											onChange={handleChange}
											name="delivery"
											color="primary"
										/>
									}
									label="Delivery"
								/>
							</div>
						)}
						{tabValue === 3 && (
							<div>
								<FuseChipSelect
									className="mt-8 mb-8"
									value={form.memberships.map(membership => ({
										value: membership.id,
										label: membership.name
									}))}
									onChange={value => handleChipChange(value, 'memberships')}
									placeholder="Select multiple memberships"
									textFieldProps={{
										label: 'Memberships',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									isMulti
									options={memberships.map(membership => ({
										value: membership.id,
										label: membership.name
									}))}
									error={errors['membership_ids.0'] ? true : false}
									helperText={errors['membership_ids.0'] ? errors['membership_ids.0'][0] : ''}
									required
								/>
							</div>
						)}
						{tabValue === 4 && (
							<div>
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
									error={errors['partner_ids.0'] ? true : false}
									helperText={errors['partner_ids.0'] ? errors['partner_ids.0'][0] : ''}
									required
								/>
							</div>
						)}
						{tabValue === 5 && (
							<div>
								<TextField
									className="mt-8 mb-8"
									id="logo"
									name="logo"
									onChange={logoUpload}
									label="Logo"
									type="file"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['logo'] ? true : false}
									helperText={errors['logo'] ? errors['logo'][0] : ''}
								/>
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
									error={errors['logo'] ? true : false}
									helperText={errors['logo'] ? errors['logo'][0] : ''}
								/>
							</div>
						)}
						{tabValue === 6 && (
							<div>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.is_live ? true : false}
											onChange={handleChange}
											name="is_live"
											color="primary"
										/>
									}
									label="Live"
								/>
								{userContext.user.user_type === 'it' ? (
									<>
										<FormControlLabel
											control={
												<Checkbox
													checked={form.is_live_retail ? true : false}
													onChange={handleChange}
													name="is_live_retail"
													color="primary"
												/>
											}
											label="Retail Live"
										/>
										<FormControlLabel
											control={
												<Checkbox
													checked={form.is_live_corporate ? true : false}
													onChange={handleChange}
													name="is_live_corporate"
													color="primary"
												/>
											}
											label="Corporate Live"
										/>
									</>
								) : (
									<></>
								)}
							</div>
						)}
					</div>
				)
			}
		/>
	);
}

export default CreateVendor;
