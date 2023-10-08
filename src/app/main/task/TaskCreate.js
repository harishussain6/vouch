import React, { useEffect, useState, useContext } from 'react';
import { withStyles, TextField, Button, Grid, FormHelperText, Icon, Typography, Tabs, Tab } from '@material-ui/core';
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
import Posts from './Posts';
import { UserContext } from 'app/context/UserContext';

const styles = () => ({});

const axios = JwtService.getAxios();

function getOrder(slide = null) {
	return slide
		? slide
		: {
				task: '',
				description: '',
				user: {},
				status: 'active',
				task_type: 'vendor',
				duration: 'daily',
				vendor: {},
				no_of_tasks: 1,
				no_of_tasks_completed: 0
		  };
}
function TaskCreate() {
	const [order, setOrder] = useState(getOrder());
	const { form, handleChange, setForm } = useForm(null);
	const [errors, setError] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [viewOnly, setViewOnly] = useState(false);
	const { id } = useParams();
	const theme = useTheme();
	const history = useHistory();
	const userContext = useContext(UserContext);
	const [tabValue, setTabValue] = useState(0);

	useEffect(() => {
		if ((order && !form) || (order && form && order.id !== form.id)) {
			console.log(order);
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
						const res = await axios.get(`/api/admin/tasks/${id}`);
						if (res.data.status) {
							setOrder(res.data.data.task);
						} else {
							setErrorMessage(res.data.message);
							setError(res.data.errors);
						}
					} catch (error) {
						setError(error);
					}
				}
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

	useEffect(() => {
		const user = userContext.user;
		if (user.user_type === 'creative') setViewOnly(true);
	}, [userContext]);

	function dataToPost() {
		const post = {
			...form,
			user_id: form.user.id ? form.user.id : null,
			vendor_id: form.vendor.id ? form.vendor.id : null,
			task_type: form.task_type.id ? form.task_type.id : form.task_type,
			status: form.status.id ? form.status.id : form.status,
			duration: form.duration.id ? form.duration.id : form.duration
		};
		return post;
	}

	async function add() {
		setLoading(true);
		try {
			const res = await axios.post('/api/admin/tasks', dataToPost());

			if (res.data.status) {
				history.push('/tasks');
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
		const res = await axios.put(`/api/admin/tasks/${id}`, dataToPost());

		if (res.data.status) {
			history.push('/tasks');
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
		let setValue;
		if (name === 'vendor') setValue = value;
		else
			setValue = Array.isArray(value)
				? value.map(item => ({ id: item.value, name: item.label }))
				: { id: value.value, name: value.label };
		setForm(_.set({ ...form }, name, setValue));
	}

	function handleChangeTab(event, value) {
		setTabValue(value);
	}

	if (loading) {
		return <FuseLoading />;
	}

	function promiseOptions(inputValue) {
		console.log(inputValue);
		if (inputValue.length < 4) return Promise.resolve([]);
		return axios
			.get('/api/admin/get-parent-list', {
				params: { query: inputValue }
			})
			.then(res => {
				const data = res.data;
				return data.data.map(vendor => ({ id: vendor.id, label: vendor.name }));
			});
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
									to="/tasks"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Task</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.task ? form.task : 'New Task'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Task</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
					</div>
				)
			}
			contentToolbar={
				id !== 'new' ? (
					<Tabs
						value={tabValue}
						onChange={handleChangeTab}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="auto"
						classes={{ root: 'w-full h-64' }}
					>
						<Tab className="h-64 normal-case" label="Task" />
						<Tab className="h-64 normal-case" label="Posts" />
					</Tabs>
				) : (
					<></>
				)
			}
			content={
				form && (
					<div className="p-16 sm:p-24 max-w-2xl">
						{tabValue === 0 && (
							<Grid container>
								<Grid item md={12}>
									<FormHelperText error>{errorMessage}</FormHelperText>
								</Grid>
								<Grid item md={12}>
									<TextField
										className="mt-8 mb-8"
										id="task"
										name="task"
										onChange={handleChange}
										label="Task"
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										fullWidth
										disabled={viewOnly}
										value={form.task}
										error={errors['task']}
										helperText={errors['task'] ? errors['task'][0] : ''}
									/>
								</Grid>
								<Grid item md={12}>
									<TextField
										className="mt-8 mb-8"
										id="description"
										name="description"
										onChange={handleChange}
										label="Description"
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										fullWidth
										disabled={viewOnly}
										value={form.description}
										error={errors['description']}
										helperText={errors['description'] ? errors['description'][0] : ''}
									/>
								</Grid>
								<Grid item md={12}>
									<TextField
										className="mt-8 mb-8"
										id="no_of_tasks"
										name="no_of_tasks"
										onChange={handleChange}
										label="Total tasks"
										type="number"
										variant="outlined"
										InputLabelProps={{ shrink: true }}
										fullWidth
										disabled={viewOnly}
										value={form.no_of_tasks}
										error={errors['no_of_tasks']}
										helperText={errors['no_of_tasks'] ? errors['no_of_tasks'][0] : ''}
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
										variant="fixed"
										isDisabled={viewOnly}
										error={errors['status']}
										helperText={errors['status'] ? errors['status'][0] : ''}
									/>
								</Grid>
								{/* <Grid item md={12}>
									<FuseChipSelect
										className="mt-8 mb-8"
										value={{
											value: form.task_type.id ? form.task_type.id : form.task_type,
											label: form.task_type.name
												? form.task_type.name
												: form.task_type.toUpperCase()
										}}
										isDisabled={viewOnly}
										onChange={value => handleChipChange(value, 'task_type')}
										textFieldProps={{
											label: 'Task Type',
											InputLabelProps: {
												shrink: true
											},
											variant: 'outlined'
										}}
										variant="fixed"
										options={[
											{ value: 'post', label: 'Post' },
											{ value: 'vendor', label: 'Vendor' }
										]}
										error={errors['task_type']}
										helperText={errors['task_type'] ? errors['task_type'][0] : ''}
									/>
								</Grid> */}
								<Grid item md={12}>
									<FuseChipSelect
										className="mt-8 mb-8"
										value={{
											value: form.duration.id ? form.duration.id : form.duration,
											label: form.duration.name ? form.duration.name : form.duration.toUpperCase()
										}}
										onChange={value => handleChipChange(value, 'duration')}
										textFieldProps={{
											label: 'Duration',
											InputLabelProps: {
												shrink: true
											},
											variant: 'outlined'
										}}
										variant="fixed"
										isDisabled={viewOnly}
										options={[
											{ value: 'daily', label: 'Daily' },
											{ value: 'monthly', label: 'Weekly' },
											{ value: 'weekly', label: 'Monthly' }
										]}
										error={errors['duration']}
										helperText={errors['duration'] ? errors['duration'][0] : ''}
									/>
								</Grid>
								<Grid item md={12}>
									<FuseChipSelect
										className="mt-8 mb-8"
										value={{
											value: form.vendor.id,
											label: form.vendor.name ? form.vendor.name : form.vendor.label
										}}
										onChange={value => handleChipChange(value, 'vendor')}
										textFieldProps={{
											label: 'Vendor',
											InputLabelProps: {
												shrink: true
											},
											variant: 'outlined'
										}}
										isDisabled={viewOnly}
										error={errors['vendor_id']}
										helperText={errors['vendor_id'] ? errors['vendor_id'][0] : ''}
										required
										variant="async"
										defaultOptions
										loadOptions={promiseOptions}
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
										isDisabled={viewOnly}
										options={users.map(city => ({
											value: city.id,
											label: city.name
										}))}
										error={errors['user_id']}
										helperText={errors['user_id'] ? errors['user_id'][0] : ''}
										required
										variant="fixed"
									/>
								</Grid>
								<Grid container item md={12} justify="flex-end">
									<FuseAnimate animation="transition.slideRightIn" delay={300}>
										<Button
											className="whitespace-no-wrap normal-case"
											variant="contained"
											color="secondary"
											disabled={viewOnly || loading || !canBeSubmitted()}
											onClick={onSubmit}
										>
											{id === 'new' ? 'Save' : 'Update'}
										</Button>
									</FuseAnimate>
								</Grid>
							</Grid>
						)}
						{tabValue === 1 && <Posts id={id} />}
					</div>
				)
			}
		/>
	);
}

export default withStyles(styles)(TaskCreate);
