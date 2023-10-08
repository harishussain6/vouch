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
import { SnackbarContext } from 'app/context/SnackbarContext';

const styles = () => ({});

function getOrder(slide = null) {
	return slide
		? slide
		: {
				customer_name: '',
				mobile_number: '',
				membership_number: '',
				issue: '',
				comments: '',
				customer_remarks: '',
				user: {},
				status: 'in_process'
		  };
}
function CustomerQueryCreate() {
	const [order, setOrder] = useState(getOrder());
	const { form, handleChange, setForm } = useForm(null);
	const [errors, setError] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	// const [departments, setDepartments] = useState([]);
	const { id } = useParams();
	const axios = JwtService.getAxios();
	const theme = useTheme();
	const history = useHistory();
	const context = useContext(SnackbarContext);

	useEffect(() => {
		if ((order && !form) || (order && form && order.id !== form.id)) {
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
						const res = await axios.get(`/api/admin/customer_query/${id}`);
						const data = res.data;
						if (data.status) {
							setOrder(data.data.corporateApp);
						} else {
							setErrorMessage(data.message);
							setError(data.errors);
						}
					} catch (error) {
						setError(error);
					}
				}
				// axios.get('/api/admin/departments').then(res => {
				// 	const data = res.data.data;
				// 	setDepartments(data.departments);
				// });
				axios.get('/api/admin/users').then(res => {
					const data = res.data.data;
					setUsers(data);
				});
			} catch (error) {
				setLoading(false);
			}
		};
		getData();
		// eslint-disable-next-line
	}, []);

	function dataToPost() {
		const post = {
			...form,
			user_id: form.user.id,
			status: form.status.id ? form.status.id : form.status
		};
		return post;
	}

	async function add() {
		setLoading(true);
		try {
			const res = await axios.post('/api/admin/customer_query', dataToPost());

			if (res.data.status) {
				console.log(res.data.data.sms);
				context.setMessage(res.data.data.sms['0']);
				context.setOpen(true);
				setTimeout(() => {
					history.push('/customer_query');
				}, 1000);
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
		const res = await axios.put(`/api/admin/customer_query/${id}`, dataToPost());

		if (res.data.status) {
			history.push('/customer_query');
		} else {
			setErrorMessage(res.data.message);
			setError(res.data.errors);
		}
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
									to="/customer_query"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Customer Query</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.customer_name ? form.customer_name : 'New CSR'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">CSR</Typography>
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
									autoFocus
									margin="dense"
									id="customer_name"
									name="customer_name"
									label="Customer Name"
									type="text"
									fullWidth
									value={form.customer_name}
									onChange={handleChange}
									variant="outlined"
									error={errors['customer_name'] ? true : false}
									helperText={errors['customer_name'] ? errors['customer_name'][0] : null}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									autoFocus
									margin="dense"
									id="mobile_number"
									name="mobile_number"
									label="Mobile Number"
									type="text"
									fullWidth
									value={form.mobile_number}
									onChange={handleChange}
									variant="outlined"
									error={errors['mobile_number'] ? true : false}
									helperText={errors['mobile_number'] ? errors['mobile_number'][0] : null}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="membership_number"
									name="membership_number"
									onChange={handleChange}
									label="Membership Number"
									variant="outlined"
									value={form.membership_number}
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['membership_number']}
									helperText={errors['membership_number'] ? errors['membership_number'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="issue"
									name="issue"
									onChange={handleChange}
									label="Issue"
									variant="outlined"
									value={form.issue}
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['issue']}
									helperText={errors['issue'] ? errors['issue'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="comments"
									name="comments"
									onChange={handleChange}
									label="Comments"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.comments}
									error={errors['comments']}
									helperText={errors['comments'] ? errors['comments'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="customer_remarks"
									name="customer_remarks"
									onChange={handleChange}
									label="Customer Remarks"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.customer_remarks}
									error={errors['customer_remarks']}
									helperText={errors['customer_remarks'] ? errors['customer_remarks'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="email"
									name="email"
									onChange={handleChange}
									label="Email"
									type="email"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.email}
									error={errors['email']}
									helperText={errors['email'] ? errors['email'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<FuseChipSelect
									className="mt-8 mb-8"
									value={{
										value: form.status.id ? form.status.id : form.status,
										label: form.status.name ? form.status.name : form.status
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
										{ value: 'in_process', label: 'In Process' },
										{ value: 'hold', label: 'Hold' },
										{ value: 'resolved', label: 'Resolved' },
										{ value: 'confirmed', label: 'Confirmed' }
									]}
									error={errors['status']}
									helperText={errors['status'] ? errors['status'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<FuseChipSelect
									className="mt-8 mb-8"
									value={{ value: form.user.id, label: form.user.name }}
									onChange={value => handleChipChange(value, 'user')}
									textFieldProps={{
										label: 'User',
										InputLabelProps: {
											shrink: true
										},
										variant: 'outlined'
									}}
									options={users.map(city => ({
										value: city.id,
										label: city.name
									}))}
									error={errors['user_id']}
									helperText={errors['user_id'] ? errors['user_id'][0] : ''}
									required
								/>
							</Grid>
							{/* <Grid item md={12}>
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
								options={departments.map(city => ({
									value: city.id,
									label: city.name
								}))}
								error={errors['department_id']}
								helperText={errors['department_id'] ? errors['department_id'][0] : ''}
								required
							/>
						</Grid> */}
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

export default withStyles(styles)(CustomerQueryCreate);
