import React, { useContext, useEffect, useState } from 'react';
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
import FuseChipSelect from '@fuse/core/FuseChipSelect';
import fileUpload from 'fuctbase64';
import { authRoles } from 'app/auth';
import { UserContext } from 'app/context/UserContext';

const styles = () => ({});

function getOrder(slide = null) {
	return slide
		? slide
		: {
				name: '',
				email: '',
				password: '',
				user_type: 'admin',
				department: {},
				photo_url: ''
		  };
}
function UserCreate() {
	const [order, setOrder] = useState(getOrder());
	const { form, handleChange, setForm } = useForm(null);
	const [errors, setError] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [departments, setDepartments] = useState([]);
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const axios = JwtService.getAxios();
	const theme = useTheme();
	const history = useHistory();
	const [readOnly, setReadOnly] = useState(false);
	const userContext = useContext(UserContext);

	useEffect(() => {
		if ((order && !form) || (order && form && order.id !== form.id)) {
			setReadOnly(false);
			setForm(order);
		}
	}, [form, order, setForm]);

	function canBeSubmitted() {
		return !_.isEqual(order, form);
	}

	useEffect(() => {
		const getData = async () => {
			try {
				if (id !== 'new') {
					try {
						const res = await axios.get(`/api/admin/users/${id}`);
						if (res.data.status) {
							setOrder(res.data.data);
							// setReadOnly(userContext.user.user_type !== 'admin');
						} else {
							setErrorMessage(res.data.message);
							setError(res.data.errors);
						}
					} catch (error) {
						setError(error);
					}
				}
				axios.get('/api/admin/departments').then(res => {
					const data = res.data.data;
					setDepartments(data.departments);
				});
			} catch (error) {
				setLoading(false);
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);

	function dataToPost() {
		if (!form.photo_url) delete form.photo_url;
		delete form.created_at;
		delete form.updated_at;
		const post = {
			...form,
			department_id: form.department.id,
			user_type: form.user_type.id ? form.user_type.id : form.user_type
		};
		return post;
	}

	async function add() {
		setLoading(true);
		try {
			const res = await axios.post('/api/admin/register', dataToPost());

			if (res.data.status) {
				history.push('/user');
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
		const res = await axios.put(`/api/admin/user/${id}`, dataToPost());

		if (res.data.status) {
			history.push(authRoles.hr.includes(userContext.user.user_type) ? '/user' : '/welcome');
		} else {
			setErrorMessage(res.data.message);
			setError(res.data.errors);
		}
	}

	async function upload(files) {
		fileUpload(files).then(data => {
			setForm(_.set({ ...form }, `photo_url`, `data:${data.type};base64,${data.base64}`));
		});
	}

	function onSubmit() {
		if (id === 'new') add();
		else update();
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
									to="/user"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">User</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'New User'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">User</Typography>
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
									className="mt-8 mb-8"
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
									disabled={readOnly}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									autoFocus
									margin="dense"
									id="email"
									name="email"
									label="Email"
									type="email"
									fullWidth
									value={form.email}
									onChange={handleChange}
									variant="outlined"
									disabled={!authRoles.hr.includes(userContext.user.user_type)}
									error={errors['email'] ? true : false}
									helperText={errors['email'] ? errors['email'][0] : null}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="password"
									name="password"
									onChange={handleChange}
									label="Password"
									type="password"
									variant="outlined"
									value={form.password}
									InputLabelProps={{ shrink: true }}
									fullWidth
									disabled={readOnly}
									error={errors['password']}
									helperText={errors['password'] ? errors['password'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="photo_url"
									name="photo_url"
									onChange={upload}
									label="Photo"
									type="file"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									disabled={readOnly}
									error={errors['photo_url']}
									helperText={errors['photo_url'] ? errors['photo_url'][0] : ''}
								/>
							</Grid>
							{authRoles.hr.includes(userContext.user.user_type) && (
								<>
									<Grid item md={12}>
										<FuseChipSelect
											className="mt-8 mb-8"
											value={{
												value: form.user_type.id ? form.user_type.id : form.user_type,
												label: form.user_type.name
													? form.user_type.name
													: form.user_type.toUpperCase()
											}}
											onChange={value => handleChipChange(value, 'user_type')}
											textFieldProps={{
												label: 'User Type',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											disabled={readOnly}
											options={[
												{ value: 'admin', label: 'Admin' },
												{ value: 'csr', label: 'CSR' },
												{ value: 'client_support', label: 'Client Support' },
												{ value: 'client_service', label: 'Client Service' },
												{ value: 'it', label: 'IT' },
												{ value: 'marketing', label: 'Marketing' },
												{ value: 'creative', label: 'Creative' },
												{ value: 'alliance', label: 'Alliance' },
												{ value: 'corporate', label: 'Corporate' },
												{ value: 'orders', label: 'Orders' },
												{ value: 'hr', label: 'HR' }
											]}
											error={errors['user_type']}
											helperText={errors['user_type'] ? errors['user_type'][0] : ''}
										/>
									</Grid>
									<Grid item md={12}>
										<FuseChipSelect
											className="mt-8 mb-8"
											value={{ value: form.department.id, label: form.department.name }}
											onChange={value => handleChipChange(value, 'department')}
											textFieldProps={{
												label: 'Department',
												InputLabelProps: {
													shrink: true
												},
												variant: 'outlined'
											}}
											disabled={readOnly}
											options={departments.map(city => ({
												value: city.id,
												label: city.name
											}))}
											error={errors['department_id']}
											helperText={errors['department_id'] ? errors['department_id'][0] : ''}
											required
										/>
									</Grid>
								</>
							)}
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

export default withStyles(styles)(UserCreate);
