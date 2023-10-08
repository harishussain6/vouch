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

const styles = () => ({});

function getOrder(slide = null) {
	return slide
		? slide
		: {
				name: '',
				contact_number: '',
				address: '',
				delivery_date: '',
				city: '',
				product: '',
				advance_amount: 0,
				delivery_charges: 0,
				total_amount: 0
		  };
}
function OrderCreate() {
	const [order, setOrder] = useState(getOrder());
	const { form, handleChange, setForm } = useForm(null);
	const [errors, setError] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const axios = JwtService.getAxios();
	const theme = useTheme();
	const history = useHistory();

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
						const res = await axios.get(`/api/admin/order/${id}`);
						if (res.data.status) {
							setOrder(res.data.data.order);
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
			const res = await axios.post('/api/admin/order', dataToPost());

			if (res.data.status) {
				history.push('/order');
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
		const res = await axios.put(`/api/admin/order/${id}`, dataToPost());

		if (res.data.status) {
			history.push('/order');
		} else {
			setErrorMessage(res.data.message);
			setError(res.data.errors);
		}
	}

	function onSubmit() {
		if (id === 'new') add();
		else update();
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
									to="/order"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">Order</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'New Order'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Order</Typography>
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
									className="mt-8 mb-8"
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
									autoFocus
									margin="dense"
									id="contact_number"
									name="contact_number"
									label="Contact Number"
									type="text"
									fullWidth
									className="mt-8 mb-8"
									value={form.contact_number}
									onChange={handleChange}
									variant="outlined"
									error={errors['contact_number'] ? true : false}
									helperText={errors['contact_number'] ? errors['contact_number'][0] : null}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="address"
									name="address"
									onChange={handleChange}
									label="Address"
									variant="outlined"
									value={form.address}
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['address']}
									helperText={errors['address'] ? errors['address'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="delivery_date"
									name="delivery_date"
									onChange={handleChange}
									label="Delivery Date"
									type="date"
									variant="outlined"
									value={form.delivery_date}
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['delivery_date']}
									helperText={errors['delivery_date'] ? errors['delivery_date'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="city"
									name="city"
									onChange={handleChange}
									label="City"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.city}
									error={errors['city']}
									helperText={errors['city'] ? errors['city'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="product"
									name="product"
									onChange={handleChange}
									label="Product"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.product}
									error={errors['product']}
									helperText={errors['product'] ? errors['product'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="advance_amount"
									name="advance_amount"
									onChange={handleChange}
									label="Advance Amout"
									type="number"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.advance_amount}
									error={errors['advance_amout']}
									helperText={errors['advance_amout'] ? errors['advance_amout'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="delivery_charges"
									name="delivery_charges"
									onChange={handleChange}
									label="Delivery Charges"
									type="number"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.delivery_charges}
									error={errors['delivery_charges']}
									helperText={errors['delivery_charges'] ? errors['delivery_charges'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="total_amount"
									name="total_amount"
									onChange={handleChange}
									label="Total Amout"
									type="number"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.total_amount}
									error={errors['total_amount']}
									helperText={errors['total_amount'] ? errors['total_amount'][0] : ''}
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

export default withStyles(styles)(OrderCreate);
