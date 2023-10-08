import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import { Button, Icon, TextField, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import JwtService from 'app/services/jwtService';
import React, { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import fileUpload from 'fuctbase64';
import { SnackbarContext } from 'app/context/SnackbarContext';
import VendorSearch from '../common/VendorSearch';

const premiumKey = {
	message: '',
	image: '',
	title: '',
	city_id: {},
	city_name: '',
	linktype: 'url',
	link: ''
};
function GlobalNotification({ props }) {
	const [loading, setLoading] = useState(true);
	const [cities, setCities] = useState([]);
	const [linkType, setLinkType] = useState('url');
	const [errors, setError] = useState({});
	const theme = useTheme();
	const { form, handleChange, setForm } = useForm(premiumKey);
	const history = useHistory();
	const axios = JwtService.getAxios();
	const context = useContext(SnackbarContext);

	useEffect(() => {
		if (cities.length > 0) setLoading(false);
		setLinkType(premiumKey.linktype);
	}, [cities]);
	useEffect(() => {
		const getData = async () => {
			try {
				axios.get('/api/admin/city').then(res => {
					const data = res.data.data;
					setCities(data.cities);
				});
			} catch (error) {
				console.log('error');
				setLoading(false);
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);

	function handleChipChange(value, name) {
		if (name === 'linktype') {
			console.log(value);
			setLinkType(value.value);
			setForm(_.set({ ...form }, name, value.value));
			console.log(linkType);
		} else setForm(_.set({ ...form }, name, value));
	}

	function headerUpload(files) {
		fileUpload(files).then(data => {
			setForm(_.set({ ...form }, `image`, `data:${data.type};base64,${data.base64}`));
		});
	}

	function setVendor(value) {
		setForm(_.set({ ...form }, 'link', value));
	}

	function canBeSubmitted() {
		return form.message.length > 0 && form.title.length > 0 && Object.keys(form.city_id).length === 2;
	}

	async function onSubmit() {
		try {
			setLoading(true);
			const params = {
				message: form.message,
				title: form.title,
				city_id: form.city_id.value,
				city_name: form.city_id.label,
				linktype: form.linktype,
				link: form.link
			};
			if (form.image) {
				params['image'] = form.image;
			}

			const result = await axios.post('/api/admin/send-global-notification', params);
			console.log(result);
			const res = result.data;
			if (!res.status) {
				setLoading(false);
				context.setMessage(res.message);
				context.setSeverity('error');
				context.setOpen(true);
			} else {
				history.push('/global-notifications');
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
									to="/"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Send Global Notification</span>
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
								{'Submit'}
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
								id="title"
								name="title"
								onChange={handleChange}
								label="Title Of Notification"
								value={form.title}
								variant="outlined"
								fullWidth
								required
							/>
							<TextField
								className="mt-8 mb-8"
								id="message"
								name="message"
								onChange={handleChange}
								label="Message"
								value={form.message}
								variant="outlined"
								fullWidth
								required
							/>
							<TextField
								className="mt-8 mb-8"
								id="image"
								name="image"
								onChange={headerUpload}
								label="Image"
								type="file"
								variant="outlined"
								fullWidth
								required
							/>
							<FuseChipSelect
								className="mt-8 mb-8"
								value={form.city_id}
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
							<FuseChipSelect
								className="mt-8 mb-8"
								value={{
									value: form.linktype.value ? form.linktype.value : form.linktype,
									label: form.linktype.label ? form.linktype.label : form.linktype.toUpperCase()
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
									{ value: 'url', label: 'URL' }
								]}
								error={errors['linktype']}
								helperText={errors['linktype'] ? errors['linktype'][0] : ''}
							/>
							{linkType === 'vendor' ? (
								<VendorSearch
									setValue={setVendor}
									selectedVendor={form?.vendor || null}
									error={errors['link']}
								/>
							) : (
								<></>
							)}
							{linkType === 'url' ? (
								<TextField
									autoFocus
									margin="dense"
									className="mt-8 mb-8"
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
						</div>
					</div>
				)
			}
		/>
	);
}

export default GlobalNotification;
