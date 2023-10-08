import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import { Checkbox, FormControlLabel, Button, Icon, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import JwtService from 'app/services/jwtService';
import React, { useEffect, useState, useContext } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Vendor } from './Vendor';
import fileUpload from 'fuctbase64';
import Vouchers from '../voucher/Vouchers';
import { UserContext } from 'app/context/UserContext';
import VendorChildren from '../vendor_child/VendorChildren';
import VendorSearch from '../../common/VendorSearch';

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
	const userContext = useContext(UserContext);
	const { id, page } = routeParams;
	const [tabValue, setTabValue] = useState(getSelectedTab(userContext.user));
	useEffect(() => {
		if (
			categories.length > 0 &&
			amenities.length > 0 &&
			partners.length > 0 &&
			memberships.length > 0 &&
			cities.length > 0
		)
			setLoading(false);
	}, [categories, amenities, partners, memberships, cities]);

	useEffect(() => {
		setTabValue(page);
	}, [page]);
	useEffect(() => {
		const getData = async () => {
			try {
				const { id } = routeParams;
				if (id !== 'new') {
					const res = await axios.get('/api/admin/vendor/' + id);
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
					setMemberships(data.membership);
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
				console.log('error', error);
				setLoading(false);
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if ((vendor && !form) || (vendor && form && vendor.id !== form.id)) {
			console.log(form)
			console.log(vendor)
			setForm(vendor);
			console.log(form)
			
		}else{
			console.log(form)
			setForm(vendor);
			console.log(form)
			console.log('else');
		}
	}, [form, vendor, setForm]);

	function handleChangeTab(event, value) {
		history.push(`/vendor/${id}/${value}`);
		setTabValue(value);
	}

	function handleChipChange(value, name) {
		const setValue = Array.isArray(value)
			? value.map(item => ({ id: item.value, name: item.label }))
			: { id: value.value, name: value.label };
		setForm(_.set({ ...form }, name, setValue));
	}

	function setParentVendor(value) {
		form.super_parent = value;
		setForm(form);
	}
	function setSuperParent(value) {
		setForm(_.set({ ...form }, `superParent`, value));
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
			const post = {
				...form,
				status: form.status.id ? form.status.id : form.status,
				export_type: form.export_type.id ? form.export_type.id : form.export_type,
				category_id: form.category.id,
				amenities_ids: form.amenities.map(amunity => amunity.id),
				city_id: form.city.id,
				membership_ids: form.memberships.map(membership => membership.id),
				partner_ids: form.partners.map(partner => partner.id)
			};
			// console.log('dataToPost', post)
			const result =
				id === 'new'
					? await axios.post('/api/admin/vendor', post)
					: await axios.put(`/api/admin/vendor/${form.id}`, post);
			const res = result.data;
			if (!res.status) {
				setErrors(res.errors);
				setLoading(false);
			} else {
				history.push('/vendor');
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
									to="/vendors"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Vendors</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<FuseAnimate animation="transition.expandIn" delay={300}>
									<img className="w-32 sm:w-48 rounded" src={form.logo} alt={form.name} />
								</FuseAnimate>
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'New Vendor'}
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
						<Tab className="h-64 normal-case" label="Basic Info" value="about" />
					) : (
						<></>
					)}
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Location" value="location" />
					) : (
						<></>
					)}
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Marketing Options" value="marketing" />
					) : (
						<></>
					)}
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Memberships" value="membership" />
					) : (
						<></>
					)}
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Partners" value="partner" />
					) : (
						<></>
					)}
					<Tab className="h-64 normal-case" label="Images" value="images" />
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Vouchers" value="vouchers" />
					) : (
						<></>
					)}
					{userContext.user.user_type !== 'creative' ? (
						<Tab className="h-64 normal-case" label="Branches" value="branches" />
					) : (
						<></>
					)}
				</Tabs>
			}
			content={
				form && (
					<div className="p-16 sm:p-24 max-w-2xl">
						{tabValue === 'about' && (
							<div>
								<TextField
									className="mt-8 mb-8"
									error={errors['name']}
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
									id="description"
									error={errors['description']}
									helperText={errors['description'] ? errors['description'][0] : ''}
									name="description"
									onChange={handleChange}
									required
									label="Description"
									type="text"
									value={form.description}
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
									value={form.qrc}
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
									value={form.email}
									variant="outlined"
									fullWidth
									error={errors['email']}
									helperText={errors['email'] ? errors['email'][0] : ''}
									required
								/>
								<TextField
									className="mt-8 mb-8"
									id="pw"
									name="pw"
									onChange={handleChange}
									label="Password"
									value={form.pw}
									variant="outlined"
									fullWidth
									error={errors['pw']}
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
									value={form.pin}
									variant="outlined"
									fullWidth
									error={errors['pin']}
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
									error={errors['status']}
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
									error={errors['mupd_id']}
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
									error={errors['livedt']}
									helperText={errors['livedt'] ? errors['livedt'][0] : ''}
									required
								/>
								<TextField
									className="mt-8 mb-8"
									id="phone"
									name="phone"
									onChange={handleChange}
									label="Phone"
									value={form.phone}
									variant="outlined"
									fullWidth
									error={errors['phone']}
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
									error={errors['promo_pts']}
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
									error={errors['amenities']}
									helperText={errors['amenities'] ? errors['amenities'][0] : ''}
									required
								/>
							</div>
						)}
						{tabValue === 'location' && (
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
									error={errors['city_id']}
									helperText={errors['city_id'] ? errors['city_id'][0] : ''}
									required
								/>
								<TextField
									className="mt-8 mb-8"
									id="locality"
									name="locality"
									onChange={handleChange}
									label="Locality"
									type="text"
									value={form.locality}
									multiline
									rows={2}
									variant="outlined"
									fullWidth
									error={errors['locality']}
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
									value={form.address}
									variant="outlined"
									fullWidth
									error={errors['address']}
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
									value={form.latitude}
									variant="outlined"
									fullWidth
									error={errors['latitude']}
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
									value={form.longitude}
									variant="outlined"
									fullWidth
									error={errors['longitude']}
									helperText={errors['longitude'] ? errors['longitude'][0] : ''}
									required
								/>
								<VendorSearch
									setValue={setParentVendor}
									setVendor={setSuperParent}
									selectedVendor={form?.superParent || null}
									selectedId={vendor.super_parent}
									error={errors['link']}
									label="Super Parent"
								/>
							</div>
						)}
						{tabValue === 'marketing' && (
							<div>
								<FuseChipSelect
									className="mt-8 mb-8"
									value={{
										value: form.export_type.id ? form.export_type.id : vendor.export_type,
										label: form.export_type.name
											? form.export_type.name
											: vendor.export_type.toUpperCase()
									}}
									onChange={value => handleChipChange(value, 'export_type')}
									textFieldProps={{
										label: 'Summary Reports',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									options={[
										{ value: 'none', label: 'None' },
										{ value: 'daily', label: 'Daily' },
										{ value: 'weekly', label: 'Weekly' },
										{ value: 'monthly', label: 'Monthly' }
									]}
									error={errors['export_type']}
									helperText={errors['export_type'] ? errors['export_type'][0] : ''}
								/>
								<TextField
									className="mt-8 mb-8"
									id="email_reporter"
									name="email_reporter"
									onChange={handleChange}
									label="Add Emails to Send Reports to"
									placeholder="Add coma separted emails"
									type="text"
									value={form.email_reporter}
									variant="outlined"
									fullWidth
									error={errors['email_reporter']}
									helperText={errors['email_reporter'] ? errors['email_reporter'][0] : ''}
									required
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.has_pos}
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
											checked={form.redeem}
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
											checked={form.pingable}
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
											checked={form.mkt}
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
											checked={form.featured_social}
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
											checked={form.featured_website}
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
								<FormControlLabel
									control={
										<Checkbox
											checked={form.sms_on_redemption}
											onChange={handleChange}
											name="sms_on_redemption"
											color="primary"
										/>
									}
									label="Send SMS after redemption"
								/>
								<FormControlLabel
									control={
										<Checkbox
											checked={form.child_redemptions_page}
											onChange={handleChange}
											name="child_redemptions_page"
											color="primary"
										/>
									}
									label="Enable intercity RedemptionPage"
								/>
								<TextField
									className="mt-8 mb-8"
									id="url_to_route"
									name="url_to_route"
									onChange={handleChange}
									label="URL to send in SMS"
									placeholder="without spaces"
									type="text"
									value={form.url_to_route}
									variant="outlined"
									fullWidth
									error={errors['url_to_route']}
									helperText={errors['url_to_route'] ? errors['url_to_route'][0] : ''}
									required
								/>
							</div>
						)}
						{tabValue === 'membership' && (
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
									error={errors['membership_ids']}
									helperText={errors['membership_ids'] ? errors['membership_ids'][0] : ''}
									required
								/>
							</div>
						)}
						{tabValue === 'partner' && (
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
									error={errors['partner_ids']}
									helperText={errors['partner_ids'] ? errors['partner_ids'][0] : ''}
									required
								/>
							</div>
						)}
						{tabValue === 'images' && (
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
									error={errors['logo']}
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
									error={errors['logo']}
									helperText={errors['logo'] ? errors['logo'][0] : ''}
								/>
							</div>
						)}
						{tabValue === 'vouchers' && (
							<div>
								<Vouchers vendor_id={form.id} />
							</div>
						)}
						{tabValue === 'branches' && (
							<div>
								<VendorChildren vendor_id={form.id} />
							</div>
						)}
					</div>
				)
			}
		/>
	);
}

export default CreateVendor;
