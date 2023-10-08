import React, { useEffect, useState } from 'react';
import { withStyles, TextField, Button, Grid, FormHelperText, Icon, Typography } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import _ from '@lodash';
import { useHistory, useParams } from 'react-router';
import JwtService from 'app/services/jwtService';
import FusePageCarded from '@fuse/core/FusePageCarded';
import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseLoading from '@fuse/core/FuseLoading';
import { useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import fileUpload from 'fuctbase64';

const styles = () => ({});

function getAmenity(slide = null) {
	return slide
		? slide
		: {
				id: null,
				name: '',
				icon: ''
		  };
}
function AmenityCreate() {
	const [amenity, setAmenity] = useState(getAmenity());
	const { form, handleChange, setForm } = useForm(null);
	const [errors, setError] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const axios = JwtService.getAxios();
	const theme = useTheme();
	const history = useHistory();

	useEffect(() => {
		if ((amenity && !form) || (amenity && form && amenity.id !== form.id)) {
			setForm(amenity);
		}
	}, [form, amenity, setForm]);

	function canBeSubmitted() {
		return !_.isEqual(amenity, form);
	}

	useEffect(() => {
		const getData = async () => {
			try {
				if (id !== 'new') {
					try {
						const res = await axios.get(`/api/admin/amenity/${id}`);
						if (res.data.status) {
							setAmenity(res.data.data.amenity);
						} else {
							setErrorMessage(res.data.message);
							setError(res.data.errors);
						}
					} catch (error) {
						setError(error);
					}
				}
			} catch (error) {
				setLoading(false);
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);

	function dataToPost() {
		const post = {
			...form
		};
		return post;
	}

	async function add() {
		setLoading(true);
		try {
			const res = await axios.post('/api/admin/amenity', dataToPost());

			if (res.data.status) {
				history.push('/amenities');
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
		const res = await axios.put(`/api/admin/amenity/${id}`, dataToPost());

		if (res.data.status) {
			history.push('/amenities');
		} else {
			setErrorMessage(res.data.message);
			setError(res.data.errors);
		}
	}

	function onSubmit() {
		if (id === 'new') add();
		else update();
	}

	async function logoUpload(files) {
		fileUpload(files).then(data => {
			setForm(_.set({ ...form }, `icon`, `data:${data.type};base64,${data.base64}`));
		});
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
									to="/amenities"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Amenities</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'New Amenity'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Amenity</Typography>
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
							<TextField
								className="mt-8 mb-8"
								id="icon"
								name="Icon"
								onChange={logoUpload}
								label="Icon"
								type="file"
								variant="outlined"
								InputLabelProps={{ shrink: true }}
								fullWidth
								error={errors['icon']}
								helperText={errors['icon'] ? errors['icon'][0] : ''}
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

export default withStyles(styles)(AmenityCreate);
