import React, { useEffect, useState } from 'react';
import { withStyles, TextField, Button, Grid, FormHelperText, Icon, Typography } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import { useHistory, useParams } from 'react-router';
import JwtService from 'app/services/jwtService';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseLoading from '@fuse/core/FuseLoading';
import { useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import fileUpload from 'fuctbase64';
import VendorSearch from '../common/VendorSearch';
import CategorySearch from '../common/CategorySearch';

const styles = () => ({});

function getSlider(slide = null) {
	return slide
		? slide
		: {
				id: null,
				tag: '',
				logo: '',
				background: '',
				linktype: 'url',
				link: '',
				partner: { id: 1, name: 'vouch365' },
				membership: { id: 1, name: '' },
				dtlive: '',
				status: 'inactive'
		  };
}
function LandingListCreate() {
	const [slide, setSlide] = useState(getSlider());
	const { form, handleChange, setForm } = useForm(null);
	const [categories, setCategories] = useState([]);
	const [memberships, setMemberships] = useState([]);
	const [partners, setPartners] = useState([]);
	const [cities, setCities] = useState([]);
	const [sliders, setSliders] = useState([]);
	const [errors, setError] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [linkType, setLinkType] = useState('');
	const { id } = useParams();
	const axios = JwtService.getAxios();
	const theme = useTheme();
	const history = useHistory();

	useEffect(() => {
		console.log(memberships);
		if (
			categories.length > 0 &&
			sliders.length > 0 &&
			partners.length > 0 &&
			memberships.length > 0 &&
			cities.length > 0
		)
			setLoading(false);
	}, [categories, sliders, partners, memberships, cities]);

	useEffect(() => {
		if ((slide && !form) || (slide && form && slide.id !== form.id)) {
			setForm(slide);
			setLinkType(slide.linktype);
		}
	}, [form, slide, setForm]);

	function canBeSubmitted() {
		return !_.isEqual(slide, form);
	}

	useEffect(() => {
		const getData = async () => {
			try {
				if (id !== 'new') {
					try {
						const res = await axios.get(`/api/admin/landingList/${id}`);
						if (res.data.status) {
							setSlide(res.data.data.landingList);
						} else {
							setErrorMessage(res.data.message);
							setError(res.data.errors);
						}
					} catch (error) {
						setError(error);
					}
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
				axios.get('/api/admin/slider').then(res => {
					const data = res.data.data;
					setSliders(data.sliders);
				});
				axios.get('/api/admin/partner').then(res => {
					const data = res.data.data;
					setPartners(data.partners);
				});
			} catch (error) {
				setLoading(false);
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);

	function handleChipChange(value, name) {
		console.log(value);
		const setValue = Array.isArray(value)
			? value.map(item => ({ id: item.value, name: item.label }))
			: { id: value.value, name: value.label };
		setForm(_.set({ ...form }, name, setValue));
		if (name === 'linktype') setLinkType(value.value);
	}

	function dataToPost() {
		const post = {
			...form,
			link: form.link ? form.link.toString() : undefined,
			partner_id: form.partner.id,
			membership_id: form.membership.id,
			linktype: form.linktype.id ? form.linktype.id : form.linktype,
			status: form.status.id ? form.status.id : form.status
		};
		delete post.partner;
		delete post.membership;
		return post;
	}

	async function add() {
		setLoading(true);
		console.log('add');
		try {
			const res = await axios.post('/api/admin/landingList', dataToPost());

			if (res.data.status) {
				history.push('/landing-list');
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
		setLoading(true);
		const res = await axios.put(`/api/admin/landingList/${id}`, dataToPost());

		if (res.data.status) {
			history.push('/landing-list');
		} else {
			setErrorMessage(res.data.message);
			setError(res.data.errors);
		}
	}

	function onSubmit() {
		if (id === 'new') add();
		else update();
	}

	async function imageUpload(files) {
		fileUpload(files).then(data => {
			setForm(_.set({ ...form }, `logo`, `data:${data.type};base64,${data.base64}`));
		});
	}

	async function backgroundUpload(files) {
		fileUpload(files).then(data => {
			setForm(_.set({ ...form }, `background`, `data:${data.type};base64,${data.base64}`));
		});
	}

	function setVendor(value) {
		setForm(_.set({ ...form }, 'link', value));
	}

	function setOffer(value) {
		setForm(_.set({ ...form }, 'link', value));
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
									to="/landing-list"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Landing List</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.title ? form.title : 'Landing List'}
										</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
					</div>
				)
			}
			content={
				form && (
					<div className="p-16 sm:p-24 max-w-2xl">
						<Grid container>
							<Grid item md={12}>
								<FormHelperText error>{errorMessage}</FormHelperText>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="tag"
									name="tag"
									onChange={handleChange}
									label="Tag"
									value={form.tag}
									variant="outlined"
									fullWidth
									error={errors['tag']}
									helperText={errors['tag'] ? errors['tag'][0] : ''}
									required
								/>
							</Grid>
							<Grid item md={12}>
								<FuseChipSelect
									className="mt-8 mb-8"
									value={{
										value: form.linktype.id ? form.linktype.id : form.linktype,
										label: form.linktype.name ? form.linktype.name : form.linktype.toUpperCase()
									}}
									onChange={value => handleChipChange(value, 'linktype')}
									textFieldProps={{
										label: 'link Type',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									options={[
										{ value: 'vendor', label: 'Vendor' },
										{ value: 'url', label: 'Url' },
										{ value: 'category_id', label: 'Category Id' },
										{ value: 'app', label: 'App' }
									]}
									error={errors['linktype']}
									helperText={errors['linktype'] ? errors['linktype'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								{linkType === 'vendor' ? (
									<VendorSearch
										setValue={setVendor}
										selectedVendor={form?.vendor || null}
										error={errors['link']}
									/>
								) : (
									<></>
								)}
								{linkType === 'url' || linkType === 'app' ? (
									<TextField
										autoFocus
										margin="dense"
										id="link"
										name="link"
										label="Link"
										type="text"
										fullWidth
										value={form.link}
										onChange={handleChange}
										variant="outlined"
										error={errors['link'] ? true : false}
										helperText={errors['link'] ? errors['link'][0] : null}
									/>
								) : (
									<></>
								)}
								{linkType === 'category_id' ? (
									<CategorySearch setValue={setOffer} error={errors['link']} />
								) : (
									<></>
								)}
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="image"
									name="image"
									onChange={imageUpload}
									label="Logo"
									type="file"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['logo']}
									helperText={errors['logo'] ? errors['logo'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="image"
									name="image"
									onChange={backgroundUpload}
									label="Background Image"
									type="file"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['background']}
									helperText={errors['background'] ? errors['background'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="dtlive"
									name="dtlive"
									type="date"
									onChange={handleChange}
									label="Live Date"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['dtlive']}
									helperText={errors['dtlive'] ? errors['dtlive'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<FuseChipSelect
									isDisabled
									className="mt-8 mb-8"
									value={{
										value: form.partner.id,
										label: form.partner.name
									}}
									onChange={value => handleChipChange(value, 'partner')}
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
									error={errors['partner_id']}
									helperText={errors['partner_id'] ? errors['partner_id'][0] : ''}
									required
								/>
							</Grid>
							<Grid item md={12}>
								<FuseChipSelect
									className="mt-8 mb-8"
									value={{
										value: form.membership.id,
										label: form.membership.name
									}}
									onChange={value => handleChipChange(value, 'membership')}
									placeholder="Select multiple memberships"
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
									error={errors['membership_ids']}
									helperText={errors['membership_ids'] ? errors['membership_ids'][0] : ''}
									required
								/>
							</Grid>
							<Grid item md={12}>
								<FuseChipSelect
									className="mt-8 mb-8"
									value={
										form.status.id
											? {
													value: form.status.id,
													label: form.status.name
											  }
											: { value: form.status, label: form.status.toUpperCase() }
									}
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
							<Grid container item md={12} justify="flex-end">
								<FuseAnimate animation="transition.slideRightIn" delay={300}>
									<Button
										className="whitespace-no-wrap normal-case"
										variant="contained"
										color="secondary"
										disabled={loading || !canBeSubmitted()}
										onClick={onSubmit}
									>
										{id === 'new' ? 'Save' : 'Update'}
									</Button>
								</FuseAnimate>
							</Grid>
						</Grid>
					</div>
				)
			}
		/>
	);
}

export default withStyles(styles)(LandingListCreate);
