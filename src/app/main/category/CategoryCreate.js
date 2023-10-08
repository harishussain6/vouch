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

function getCategory(slide = null) {
	return slide
		? slide
		: {
				id: null,
				name: '',
				category_color: '',
				retail: '',
				gold: ''
		  };
}
function CategoryCreate() {
	const [category, setCategory] = useState(getCategory());
	const { form, handleChange, setForm } = useForm(null);
	const [errors, setError] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const axios = JwtService.getAxios();
	const theme = useTheme();
	const history = useHistory();

	useEffect(() => {
		if ((category && !form) || (category && form && category.id !== form.id)) {
			setForm(category);
		}
	}, [form, category, setForm]);

	function canBeSubmitted() {
		return !_.isEqual(category, form);
	}

	useEffect(() => {
		const getData = async () => {
			try {
				if (id !== 'new') {
					try {
						const res = await axios.get(`/api/admin/category/${id}`);
						if (res.data.status) {
							setCategory(res.data.data.amenity);
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
			const res = await axios.post('/api/admin/category', dataToPost());

			if (res.data.status) {
				history.push('/categories');
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
		const res = await axios.put(`/api/admin/category/${id}`, dataToPost());

		if (res.data.status) {
			history.push('/categories');
		} else {
			setErrorMessage(res.data.message);
			setError(res.data.errors);
		}
	}

	function onSubmit() {
		if (id === 'new') add();
		else update();
	}

	async function retailUpload(files) {
		fileUpload(files).then(data => {
			setForm(_.set({ ...form }, `retail`, `data:${data.type};base64,${data.base64}`));
		});
	}
	async function goldUpload(files) {
		fileUpload(files).then(data => {
			setForm(_.set({ ...form }, `gold`, `data:${data.type};base64,${data.base64}`));
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
									to="/category"
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
					<div className="p-16 sm:p-24 max-w-2xl">
						<Grid container>
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
									className="mt-8 mb-8"
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
									autoFocus
									margin="dense"
									id="category_color"
									name="category_color"
									label="Category Color"
									type="text"
									fullWidth
									value={form.category_color}
									onChange={handleChange}
									variant="outlined"
									error={errors['category_color'] ? true : false}
									helperText={errors['category_color'] ? errors['category_color'][0] : null}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="retail"
									name="retail"
									onChange={retailUpload}
									label="Retail"
									type="file"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['retail']}
									helperText={errors['retail'] ? errors['retail'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="gold"
									name="gold"
									onChange={goldUpload}
									label="Gold"
									type="file"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['gold']}
									helperText={errors['gold'] ? errors['gold'][0] : ''}
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

export default withStyles(styles)(CategoryCreate);
