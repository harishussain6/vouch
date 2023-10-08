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
				company_name: '',
				date: '',
				email: '',
				product: '',
				quantity: 0,
				status: '',
				next_update: '',
				last_update: '',
				person_of_contact:""
		  };
}
function CorporateLeadCreate() {
	const [corporateLead, setCorporateLead] = useState(getOrder());
	const { form, handleChange, setForm } = useForm(null);
	const [errors, setError] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const axios = JwtService.getAxios();
	const theme = useTheme();
	const history = useHistory();

	useEffect(() => {
		if ((corporateLead && !form) || (corporateLead && form && corporateLead.id !== form.id)) {
			console.log(corporateLead);
			setForm(corporateLead);
		}
	}, [form, corporateLead, setForm]);

	function canBeSubmitted() {
		return !_.isEqual(corporateLead, form);
	}

	useEffect(() => {
		const getData = async () => {
			try {
				if (id !== 'new') {
					try {
						const res = await axios.get(`/api/admin/corporate_lead/${id}`);
						if (res.data.status) {
							setCorporateLead(res.data.data.corporateLead);
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
			const res = await axios.post('/api/admin/corporate_lead', dataToPost());

			if (res.data.status) {
				history.push('/corporate_lead');
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
		const res = await axios.put(`/api/admin/corporate_lead/${id}`, dataToPost());

		if (res.data.status) {
			history.push('/corporate_lead');
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
									to="/corporate_lead"
									color="inherit"
								>
									<Icon className="text-20">
										{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}
									</Icon>
									<span className="mx-4">corporate_lead</span>
								</Typography>
							</FuseAnimate>

							<div className="flex items-center max-w-full">
								<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography className="text-16 sm:text-20 truncate">
											{form.name ? form.name : 'Corporate Lead'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation="transition.slideLeftIn" delay={300}>
										<Typography variant="caption">Corporate Lead</Typography>
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
									autoFocus
									margin="dense"
									id="contact_number"
									name="contact_number"
									label="Contact Number"
									type="text"
									fullWidth
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
									id="company_name"
									name="company_name"
									onChange={handleChange}
									label="Company Name"
									variant="outlined"
									value={form.company_name}
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['company_name']}
									helperText={errors['company_name'] ? errors['company_name'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="date"
									name="date"
									onChange={handleChange}
									label="Date"
									type="date"
									variant="outlined"
									value={form.date}
									InputLabelProps={{ shrink: true }}
									fullWidth
									error={errors['date']}
									helperText={errors['date'] ? errors['date'][0] : ''}
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
								<TextField
									className="mt-8 mb-8"
									id="person_of_contact"
									name="person_of_contact"
									onChange={handleChange}
									label="Point Of Contact"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.person_of_contact}
									error={errors['person_of_contact']}
									helperText={errors['person_of_contact'] ? errors['person_of_contact'][0] : ''}
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
									id="quantity"
									name="quantity"
									onChange={handleChange}
									label="Quantity"
									type="number"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.quantity}
									error={errors['quantity']}
									helperText={errors['quantity'] ? errors['quantity'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="status"
									name="status"
									onChange={handleChange}
									label="Status"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.status}
									error={errors['status']}
									helperText={errors['status'] ? errors['status'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="next_update"
									name="next_update"
									onChange={handleChange}
									label="Next Update"
									type="date"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.next_update}
									error={errors['next_update']}
									helperText={errors['next_update'] ? errors['next_update'][0] : ''}
								/>
							</Grid>
							<Grid item md={12}>
								<TextField
									className="mt-8 mb-8"
									id="last_update"
									name="last_update"
									onChange={handleChange}
									label="Last Update"
									type="date"
									variant="outlined"
									InputLabelProps={{ shrink: true }}
									fullWidth
									value={form.last_update}
									error={errors['last_update']}
									helperText={errors['last_update'] ? errors['last_update'][0] : ''}
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

export default withStyles(styles)(CorporateLeadCreate);
