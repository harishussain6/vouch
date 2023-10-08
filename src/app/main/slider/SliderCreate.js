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

const styles = () => ({});

const Slider = {
	id: null,
	name: '',
	position: '',
	slider_type: '',
	status: 'inactive'
};

function SliderCreate() {
	const { form, handleChange, setForm } = useForm(null);
	const [slider, setSlider] = useState(Slider);
	const [errors, setError] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const axios = JwtService.getAxios();
	const { id } = useParams();
	const theme = useTheme();
	const history = useHistory();
	useEffect(() => {
		const getData = async function() {
			if (id !== 'new') {
				setLoading(true);
				const res = await axios.get(`/api/admin/slider/${id}`);
				const result = res.data;
				if (result.status) {
					setSlider(result.data.sliders);
				} else {
					setErrorMessage(result.data.message);
					setError(result.data.errors);
				}
				setLoading(false);
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if ((slider && !form) || (slider && form && slider.id !== form.id)) {
			setForm(slider);
		}
	}, [form, slider, setForm]);

	function handleChipChange(value, name) {
		const setValue = Array.isArray(value)
			? value.map(item => ({ id: item.value, name: item.label }))
			: { id: value.value, name: value.label };
		setForm(_.set({ ...form }, name, setValue));
	}

	function onSubmit() {
		if (id === 'new') add();
		else update();
	}

	function canBeSubmitted() {
		return form.name.length > 0 && !_.isEqual(slider, form);
	}

	function dataToPost() {
		return {
			...form,
			position: form.position.id ? form.position.id : form.position,
			status: form.status.id ? form.status.id : form.status,
			slider_type: form.slider_type.id ? form.slider_type.id : form.slider_type
		};
	}
	async function add() {
		setLoading(true);
		try {
			const res = await axios.post('/api/admin/slider', dataToPost());

			if (res.data.status) {
				history.push('/slider');
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
		const res = await axios.put(`/api/admin/slider/${id}`, dataToPost());

		if (res.data.status) {
			history.push('/slider');
		} else {
			setErrorMessage(res.data.message);
			setError(res.data.errors);
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
									to="/slider"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Sliders</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'New Slider'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Slider</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
					</div>
				)
			}
			content={
				form && (
					<Grid container spacing={3} className="p-16 sm:p-24 max-w-2xl">
						<Grid item md={12}>
							<FormHelperText error>{errorMessage}</FormHelperText>
						</Grid>
						<Grid item md={12}>
							<TextField
								autoFocus
								margin="dense"
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
						<Grid item md={12}>
							<FuseChipSelect
								className="mt-8 mb-8"
								value={{
									value: form.position.id ? form.position.id : form.position,
									label: form.position.name ? form.position.name : form.position.toUpperCase()
								}}
								onChange={value => handleChipChange(value, 'position')}
								textFieldProps={{
									label: 'Position',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}}
								options={[
									{ value: 'top', label: 'Top' },
									{ value: 'bottom', label: 'Bottom' },
									{ value: 'grid', label: 'Grid' },
									{ value: 'featured', label: 'Featured' }
								]}
								error={errors['position']}
								helperText={errors['position'] ? errors['position'][0] : ''}
							/>
						</Grid>
						<Grid item md={12}>
							<FuseChipSelect
								className="mt-8 mb-8"
								value={{
									value: form.slider_type.id ? form.slider_type.id : form.slider_type,
									label: form.slider_type.name
										? form.slider_type.name
										: form.slider_type.toUpperCase()
								}}
								onChange={value => handleChipChange(value, 'slider_type')}
								textFieldProps={{
									label: 'Slider Type',
									InputLabelProps: {
										shrink: true
									},
									variant: 'outlined'
								}}
								options={[
									{ value: 'home', label: 'Home' },
									{ value: 'category', label: 'Category' }
								]}
								error={errors['slider_type']}
								helperText={errors['slider_type'] ? errors['slider_type'][0] : ''}
							/>
						</Grid>
						<Grid item md={12}>
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
				)
			}
		/>
	);
}

export default withStyles(styles)(SliderCreate);
